import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ComponentMap } from "./ComponentMap";
import { Button } from "@/components/ui/button";

interface FormRendererProps {
  formConfig: any; // Form Response Schema JSON
  onSubmit: (data: any) => void;
}

export const FormRenderer: React.FC<FormRendererProps> = ({ formConfig, onSubmit }) => {
  // Generate Zod Schema dynamically
  const generateZodSchema = (config: any) => {
    const schemaFields: any = {};
    config.pages.forEach((page: any) => {
      page.sections.forEach((section: any) => {
        section.questions.forEach((q: any) => {
          let fieldSchema: any = z.any();
          if (q.questiontypeid === 1 || q.questiontypeid === 2 || q.questiontypeid === 4 || q.questiontypeid === 6 || q.questiontypeid === 8) {
             fieldSchema = z.string();
             if (q.isrequired) fieldSchema = fieldSchema.min(1, "This field is required");
             else fieldSchema = fieldSchema.optional();
          } else if (q.questiontypeid === 3 || q.questiontypeid === 7) {
             fieldSchema = z.number({ invalid_type_error: "Must be a number" });
             if (!q.isrequired) fieldSchema = fieldSchema.optional();
          } else if (q.questiontypeid === 5) { // Checkbox array
             fieldSchema = z.array(z.string());
             if (q.isrequired) fieldSchema = fieldSchema.min(1, "Select at least one option");
             else fieldSchema = fieldSchema.optional();
          }
          schemaFields[`q_${q.questionid}`] = fieldSchema;
        });
      });
    });
    return z.object(schemaFields);
  };

  const formSchema = React.useMemo(() => generateZodSchema(formConfig), [formConfig]);
  
  const methods = useForm({
    resolver: zodResolver(formSchema),
    mode: "onBlur"
  });

  const handleFormSubmit = (data: any) => {
    // Transform flat data to backend API request schema
    const formattedResponses = Object.keys(data).map(key => {
        const questionId = parseInt(key.split("_")[1]);
        const question = findQuestion(formConfig, questionId);
        const val = data[key];
        
        let answerText = null;
        let answerNumber = null;
        let selectedOptions = [];

        if (question.questiontypeid === 1 || question.questiontypeid === 2 || question.questiontypeid === 8) {
            answerText = val;
        } else if (question.questiontypeid === 3 || question.questiontypeid === 7) {
            answerNumber = val;
        } else if (question.questiontypeid === 4 || question.questiontypeid === 6) {
            selectedOptions = [{ optionid: parseInt(val) }];
        } else if (question.questiontypeid === 5) {
            selectedOptions = val.map((idStr: string) => ({ optionid: parseInt(idStr) }));
        }

        return {
            questionid: questionId,
            answertext: answerText,
            answernumber: answerNumber,
            selected_options: selectedOptions
        };
    });

    onSubmit({ formid: formConfig.formid, question_responses: formattedResponses });
  };

  const findQuestion = (config: any, qId: number) => {
      for (const p of config.pages) {
          for (const s of p.sections) {
              for (const q of s.questions) {
                  if (q.questionid === qId) return q;
              }
          }
      }
      return null;
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
        <div className="mb-8 bg-indigo-50 border border-indigo-100 rounded-xl p-8">
            <h1 className="text-3xl font-bold mb-3 text-indigo-900">{formConfig.formtitle}</h1>
            {formConfig.description && <p className="text-indigo-800/80">{formConfig.description}</p>}
        </div>

        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="space-y-8">
                {formConfig.pages.map((page: any, pIndex: number) => (
                <div key={page.pageid || pIndex} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-1 mb-4 px-2">
                        <h2 className="text-xl font-bold text-gray-800">{page.pagetitle}</h2>
                        {page.description && <p className="text-gray-500 text-sm">{page.description}</p>}
                    </div>
                    {page.sections.map((section: any, sIndex: number) => (
                    <div key={section.sectionid || sIndex} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
                        {section.sectiontitle && (
                          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-3">{section.sectiontitle}</h3>
                        )}
                        <div className="space-y-8">
                            {section.questions.map((q: any) => {
                                const FieldComponent = ComponentMap[q.questiontypeid];
                                if (!FieldComponent) return <div key={q.questionid} className="text-red-500">Unsupported question type {q.questiontypeid}</div>;
                                
                                return (
                                    <div key={q.questionid} className="pt-2">
                                        <FieldComponent question={q} name={`q_${q.questionid}`} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    ))}
                </div>
                ))}
                
                <div className="pt-8 flex justify-end">
                    <Button type="submit" className="bg-[#5F3EE7] hover:bg-indigo-700 text-white font-medium px-8 py-2 rounded-lg shadow-md transition-all">
                        Submit Response
                    </Button>
                </div>
            </form>
        </FormProvider>
    </div>
  );
};
