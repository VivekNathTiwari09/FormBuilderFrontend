import React, { useState } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageBuilder } from "./PageBuilder";
import { Plus, X } from "lucide-react";

interface FormBuilderProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onPreview?: (data: any) => void;
  onChange?: (data: any) => void;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({ initialData, onSubmit, onPreview, onChange }) => {
  const methods = useForm({
    defaultValues: initialData || {
      formcode: "",
      formtitle: "",
      description: "",
      pages: []
    }
  });

  React.useEffect(() => {
    if (initialData) {
      methods.reset(initialData);
    }
  }, [initialData, methods]);

  React.useEffect(() => {
    const subscription = methods.watch(() => {
      if (onChange) onChange(methods.getValues());
    });
    return () => subscription.unsubscribe();
  }, [methods.watch, onChange, methods]);

  const { register, control, handleSubmit } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "pages"
  });

  const normalizeFormPayload = (data: any) => {
    // Generate simple codes if not present
    if (!data.formcode) {
        data.formcode = data.formtitle.toUpperCase().replace(/\s+/g, '_');
    }
    
    // Clean up empty strings for numeric fields to prevent 422 errors
    data.pages?.forEach((page: any) => {
      page.sections?.forEach((section: any) => {
        section.questions?.forEach((q: any) => {
          if (q.minvalue === "") q.minvalue = null;
          if (q.maxvalue === "") q.maxvalue = null;
          if (q.increment === "") q.increment = null;
          if (q.maxscore === "") q.maxscore = null;
        });
      });
    });

    return data;
  };

  const onSave = (data: any) => {
    data = normalizeFormPayload(data);
    onSubmit(data);
  };

  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageDesc, setNewPageDesc] = useState("");

  const handleAddNewPage = () => {
    if (!newPageTitle.trim()) {
      alert("Page Title is required");
      return;
    }
    append({ pagetitle: newPageTitle, description: newPageDesc, pageorder: fields.length + 1, sections: [] });
    setIsPageModalOpen(false);
    setNewPageTitle("");
    setNewPageDesc("");
  };

  return (
    <div className="p-6 relative">
      {isPageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button onClick={() => setIsPageModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Page</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Page Title <span className="text-red-500">*</span></label>
                <Input 
                  value={newPageTitle} 
                  onChange={(e) => setNewPageTitle(e.target.value)} 
                  placeholder="Enter page title" 
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <Textarea 
                  value={newPageDesc} 
                  onChange={(e) => setNewPageDesc(e.target.value)} 
                  placeholder="Enter description" 
                  className="w-full resize-none h-20"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsPageModalOpen(false)}>Cancel</Button>
              <Button onClick={handleAddNewPage} className="bg-[#5F3EE7] hover:bg-indigo-700 text-white">Add Page</Button>
            </div>
          </div>
        </div>
      )}
      {/* Action Bar Removed From Top */}

      <FormProvider {...methods}>
        <form className="space-y-8">
          <div className="space-y-4 mb-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Form Title <span className="text-red-500">*</span></label>
              <Input 
                {...register("formtitle", { required: true })} 
                placeholder="e.g. Employee Satisfaction Survey" 
                className="text-lg font-bold border-gray-300 focus-visible:ring-indigo-500 w-full" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description (Optional)</label>
              <Textarea 
                {...register("description")} 
                placeholder="Brief description of the form" 
                className="border-gray-300 focus-visible:ring-indigo-500 w-full resize-none h-20 text-sm" 
              />
            </div>
          </div>

          <div className="space-y-8 mt-8">
            {fields.map((item, index) => (
              <PageBuilder key={item.id} pageIndex={index} removePage={() => remove(index)} />
            ))}

            <div 
              onClick={() => setIsPageModalOpen(true)}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-indigo-400 transition-colors text-gray-500 group"
            >
              <div className="bg-gray-100 group-hover:bg-indigo-100 p-3 rounded-full mb-3 transition-colors">
                <Plus size={24} className="text-gray-500 group-hover:text-indigo-600" />
              </div>
              <span className="font-semibold group-hover:text-indigo-600 transition-colors">Add New Page</span>
            </div>
          </div>

          <div className="flex justify-end items-center mt-8 pt-6 border-t border-gray-100 space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              className="text-gray-700 border-gray-300 hover:bg-gray-50 font-medium px-6"
              onClick={handleSubmit((data) => onPreview && onPreview(normalizeFormPayload(data)))}
            >
              Preview
            </Button>
            <Button 
              type="button"
              onClick={handleSubmit(onSave)} 
              className="bg-[#5F3EE7] hover:bg-indigo-700 text-white font-medium px-8"
            >
              Submit Form
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
