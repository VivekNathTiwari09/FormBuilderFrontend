import React, { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuestionBuilder } from "./QuestionBuilder";
import { Trash2, Edit2, X } from "lucide-react";

export const SectionBuilder = ({ sectionIndex, pageIndex, removeSection }: { sectionIndex: number; pageIndex: number; removeSection: () => void }) => {
  const { register, control, watch, setValue } = useFormContext();
  const fieldName = `pages.${pageIndex}.sections.${sectionIndex}`;
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${fieldName}.questions`
  });

  const sectionTitle = watch(`${fieldName}.sectiontitle`);
  const [isEditSectionModalOpen, setIsEditSectionModalOpen] = useState(false);
  const [editSectionTitle, setEditSectionTitle] = useState("");

  const openEditSectionModal = () => {
    setEditSectionTitle(sectionTitle || "");
    setIsEditSectionModalOpen(true);
  };

  const handleEditSectionTitle = () => {
    setValue(`${fieldName}.sectiontitle`, editSectionTitle);
    setIsEditSectionModalOpen(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-2 relative">
      {isEditSectionModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
            <button onClick={() => setIsEditSectionModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Edit Section Title</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                <Input 
                  value={editSectionTitle} 
                  onChange={(e) => setEditSectionTitle(e.target.value)} 
                  placeholder="Enter section title" 
                  className="w-full"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsEditSectionModalOpen(false)}>Cancel</Button>
              <Button onClick={handleEditSectionTitle} className="bg-[#2563eb] hover:bg-blue-700 text-white">Save</Button>
            </div>
          </div>
        </div>
      )}
      {/* Section Header matching Image 2 */}
      <div className="flex justify-between items-center p-3 border-b border-gray-100">
        <div className="flex items-center space-x-2 flex-1">
          <span className="font-bold text-gray-900">Section {sectionIndex + 1}</span>
          <span className="text-sm font-medium text-gray-700 ml-4">
            {sectionTitle || "Section Name (optional)"}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button type="button" onClick={openEditSectionModal} className="text-gray-400 hover:text-gray-900 transition-colors" title="Edit Section">
            <Edit2 size={16} />
          </button>
          <button type="button" onClick={removeSection} className="text-gray-400 hover:text-red-500 transition-colors" title="Remove Section">
            <Trash2 size={16} />
          </button>
          <Button 
            type="button" 
            variant="outline" 
            className="text-gray-700 border-gray-300 hover:bg-gray-50 h-8 px-4 font-medium rounded-md text-sm"
            onClick={() => append({ questiontext: "", questiontypeid: 1, isrequired: false, questionorder: fields.length + 1, options: [] })}
          >
            + Add Question
          </Button>
        </div>
      </div>
      
      {/* Questions Container */}
      <div className="p-3 bg-gray-50/30 rounded-b-lg">
        {fields.length === 0 && (
          <div className="text-center py-4 text-gray-400 text-sm">
            No questions added to this section.
          </div>
        )}
        <div className="space-y-3">
          {fields.map((item, qIndex) => (
            <QuestionBuilder key={item.id} sectionIndex={sectionIndex} pageIndex={pageIndex} qIndex={qIndex} removeQuestion={() => remove(qIndex)} />
          ))}
        </div>
      </div>
    </div>
  );
};
