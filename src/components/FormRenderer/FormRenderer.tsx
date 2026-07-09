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
  const hasPersistedIds = (config: any) => {
    if (!config?.formid) return false;
    return (config.pages || []).every((page: any) =>
      (page.sections || []).every((section: any) =>
        (section.questions || []).every((question: any) => {
          if (!question.questionid) return false;
          if ([4, 5, 6].includes(question.questiontypeid)) {
            return (question.options || []).every((option: any) => !!option.optionid);
          }
          return true;
        })
      )
    );
  };

  const generateZodSchemaAndDefaults = (config: any) => {
    const schemaFields: any = {};
    const defaultValues: any = {};
    config.pages?.forEach((page: any, pIdx: number) => {
      page.sections?.forEach((section: any, sIdx: number) => {
        section.questions?.forEach((q: any, qIdx: number) => {
          const fieldKey = `q_${q.questionid || `${pIdx}_${sIdx}_${qIdx}`}`;
          let fieldSchema: any = z.any();
          if (q.questiontypeid === 1 || q.questiontypeid === 2 || q.questiontypeid === 4 || q.questiontypeid === 6 || q.questiontypeid === 8) {
             fieldSchema = z.string();
             if (q.isrequired) fieldSchema = fieldSchema.min(1, "This field is required");
             else fieldSchema = fieldSchema.optional();
          } else if (q.questiontypeid === 3 || q.questiontypeid === 7) {
             fieldSchema = z.coerce.number();
             if (!q.isrequired) fieldSchema = fieldSchema.optional();
             const minValue = Number(q.minvalue);
             defaultValues[fieldKey] = Number.isFinite(minValue) ? minValue : 0;
          } else if (q.questiontypeid === 5) { // Checkbox array
             fieldSchema = z.array(z.string());
             if (q.isrequired) fieldSchema = fieldSchema.min(1, "Select at least one option");
             else fieldSchema = fieldSchema.optional();
             defaultValues[fieldKey] = [];
          }
          schemaFields[fieldKey] = fieldSchema;
        });
      });
    });
    return { schema: z.object(schemaFields), defaultValues };
  };

  const { schema: formSchema, defaultValues } = React.useMemo(() => generateZodSchemaAndDefaults(formConfig), [formConfig]);
  
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onBlur"
  });

  const handleFormSubmit = (data: any) => {
    if (!hasPersistedIds(formConfig)) {
      alert("Please save the form before submitting a preview response.");
      return;
    }

    // Transform flat data to backend API request schema
    const formattedResponses = Object.keys(data).map(key => {
        const question = findQuestion(formConfig, key);
        if (!question) return null;
        
        const questionId = question.questionid || 0; // 0 for unsaved questions
        const val = data[key];
        
        let answerText = null;
        let answerNumber = null;
        let selectedOptions: { optionid: number }[] = [];

        if (question.questiontypeid === 1 || question.questiontypeid === 2 || question.questiontypeid === 8) {
            answerText = val;
        } else if (question.questiontypeid === 3 || question.questiontypeid === 7) {
            answerNumber = val !== undefined && val !== "" ? val : null;
        } else if (question.questiontypeid === 4 || question.questiontypeid === 6) {
            const optionId = Number(val);
            if (Number.isFinite(optionId)) selectedOptions = [{ optionid: optionId }];
        } else if (question.questiontypeid === 5) {
            if (Array.isArray(val)) {
                selectedOptions = val
                    .map((idStr: string) => Number(idStr))
                    .filter((optionId: number) => Number.isFinite(optionId))
                    .map((optionId: number) => ({ optionid: optionId }));
            }
        }

        return {
            questionid: questionId,
            answertext: answerText,
            answernumber: answerNumber,
            selected_options: selectedOptions
        };
    }).filter(Boolean);

    onSubmit({ formid: formConfig.formid, question_responses: formattedResponses });
  };

  const findQuestion = (config: any, fieldKey: string) => {
      let pIdx = 0;
      for (const p of (config.pages || [])) {
          let sIdx = 0;
          for (const s of (p.sections || [])) {
              let qIdx = 0;
              for (const q of (s.questions || [])) {
                  const currentKey = `q_${q.questionid || `${pIdx}_${sIdx}_${qIdx}`}`;
                  if (currentKey === fieldKey) return q;
                  qIdx++;
              }
              sIdx++;
          }
          pIdx++;
      }
      return null;
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-8">
        <div className="mb-8 border-b border-gray-200 pb-6">
            <h1 className="text-3xl font-bold tracking-normal text-gray-950">{formConfig.formtitle}</h1>
            {formConfig.description && <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">{formConfig.description}</p>}
        </div>

        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="space-y-8">
                {formConfig.pages.map((page: any, pIndex: number) => (
                <div key={page.pageid || pIndex} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-1">
                        <h2 className="text-xl font-semibold text-gray-950">{page.pagetitle}</h2>
                        {page.description && <p className="text-sm text-gray-500">{page.description}</p>}
                    </div>
                    {page.sections?.map((section: any, sIndex: number) => (
                    <div key={section.sectionid || sIndex} className="space-y-6 rounded-lg border border-gray-200 bg-white p-7 shadow-sm">
                        {section.sectiontitle && (
                          <h3 className="border-b border-gray-100 pb-3 text-lg font-semibold text-gray-900">{section.sectiontitle}</h3>
                        )}
                        <div className="space-y-7">
                            {section.questions?.map((q: any, qIndex: number) => {
                                const FieldComponent = ComponentMap[q.questiontypeid];
                                const fieldKey = `q_${q.questionid || `${pIndex}_${sIndex}_${qIndex}`}`;
                                if (!FieldComponent) return <div key={fieldKey} className="text-red-500">Unsupported question type {q.questiontypeid}</div>;
                                
                                return (
                                    <div key={fieldKey} className="pt-2">
                                        <FieldComponent question={q} name={fieldKey} index={qIndex + 1} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    ))}
                </div>
                ))}
                
                <div className="pt-8 flex justify-end">
                    <Button type="submit" className="rounded-lg bg-[#5F3EE7] px-8 py-2 font-medium text-white shadow-sm transition-all hover:bg-indigo-700">
                        Submit Response
                    </Button>
                </div>
            </form>
        </FormProvider>
    </div>
  );
};
