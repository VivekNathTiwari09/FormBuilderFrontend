import React, { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionBuilder } from "./SectionBuilder";
import { GripVertical, Edit2, Trash2, X } from "lucide-react";

export const PageBuilder = ({ pageIndex, removePage }: { pageIndex: number; removePage: () => void }) => {
  const { register, control, watch, setValue } = useFormContext();
  const fieldName = `pages.${pageIndex}`;
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${fieldName}.sections`
  });

  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");

  const handleAddSection = () => {
    append({ sectiontitle: newSectionTitle, sectionorder: fields.length + 1, questions: [] });
    setIsSectionModalOpen(false);
    setNewSectionTitle("");
  };

  const pageTitle = watch(`${fieldName}.pagetitle`);
  const pageDescription = watch(`${fieldName}.description`);
  const [isEditPageModalOpen, setIsEditPageModalOpen] = useState(false);
  const [editPageTitle, setEditPageTitle] = useState("");
  const [editPageDesc, setEditPageDesc] = useState("");

  const openEditPageModal = () => {
    setEditPageTitle(pageTitle || "");
    setEditPageDesc(pageDescription || "");
    setIsEditPageModalOpen(true);
  };

  const handleEditPageTitle = () => {
    setValue(`${fieldName}.pagetitle`, editPageTitle);
    setValue(`${fieldName}.description`, editPageDesc);
    setIsEditPageModalOpen(false);
  };

  return (
    <div className="mb-4 bg-[#fff8f1] border border-orange-100 rounded-lg shadow-sm relative">
      {isEditPageModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
            <button onClick={() => setIsEditPageModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Edit Page Title</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                <Input 
                  value={editPageTitle} 
                  onChange={(e) => setEditPageTitle(e.target.value)} 
                  placeholder="Enter page title" 
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea 
                  value={editPageDesc} 
                  onChange={(e) => setEditPageDesc(e.target.value)} 
                  placeholder="Enter description" 
                  className="w-full min-h-[80px] p-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsEditPageModalOpen(false)}>Cancel</Button>
              <Button onClick={handleEditPageTitle} className="bg-[#2563eb] hover:bg-blue-700 text-white">Save</Button>
            </div>
          </div>
        </div>
      )}
      {isSectionModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
            <button onClick={() => setIsSectionModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Add New Section</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Title (Optional)</label>
                <Input 
                  value={newSectionTitle} 
                  onChange={(e) => setNewSectionTitle(e.target.value)} 
                  placeholder="Enter section title" 
                  className="w-full"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsSectionModalOpen(false)}>Cancel</Button>
              <Button onClick={handleAddSection} className="bg-[#2563eb] hover:bg-blue-700 text-white">Add Section</Button>
            </div>
          </div>
        </div>
      )}
      {/* Page Header matching Image 1 */}
      <div className="flex justify-between items-center p-3 border-b border-orange-100/50">
        <div className="flex items-start space-x-2 w-1/2 pt-0.5">
          <GripVertical size={16} className="text-gray-400 cursor-grab mt-0.5" />
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className="font-bold text-gray-900">Page {pageIndex + 1}</span>
              <span className="text-sm font-medium text-gray-700 ml-4">
                {pageTitle || "Page Title (optional)"}
              </span>
            </div>
            {pageDescription && (
              <span className="text-xs text-gray-500 mt-1">
                {pageDescription}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button type="button" onClick={openEditPageModal} className="text-gray-600 hover:text-gray-900 transition-colors">
            <Edit2 size={16} />
          </button>
          <button type="button" onClick={removePage} className="text-gray-600 hover:text-red-600 transition-colors">
            <Trash2 size={16} />
          </button>
          <Button 
            type="button"
            onClick={() => setIsSectionModalOpen(true)}
            className="bg-[#2563eb] hover:bg-blue-700 text-white h-8 px-4 font-medium rounded-md shadow-sm text-sm"
          >
            + Add Section
          </Button>
        </div>
      </div>
      
      {/* Sections Container */}
      <div className="p-3 space-y-3">
        {fields.map((item, sIndex) => (
          <SectionBuilder key={item.id} sectionIndex={sIndex} pageIndex={pageIndex} removeSection={() => remove(sIndex)} />
        ))}
        {fields.length === 0 && (
          <div className="text-center py-4 text-gray-400 text-sm">
            No sections added yet. Click "+ Add Section" to begin.
          </div>
        )}
      </div>
    </div>
  );
};
