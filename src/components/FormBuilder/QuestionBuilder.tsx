
import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, X } from "lucide-react";

export const QuestionBuilder = ({ sectionIndex, pageIndex, qIndex, removeQuestion }: { sectionIndex: number; pageIndex: number; qIndex: number; removeQuestion: () => void }) => {
  const { register, control, watch, setValue } = useFormContext();
  const fieldName = `pages.${pageIndex}.sections.${sectionIndex}.questions.${qIndex}`;
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${fieldName}.options`
  });

  const questionType = watch(`${fieldName}.questiontypeid`);
  const needsOptions = [4, 5, 6].includes(parseInt(questionType || "1")); // Radio, Checkbox, Dropdown
  const isSlider = parseInt(questionType) === 7;
  const isRequired = watch(`${fieldName}.isrequired`);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-4">
      {/* Header */}
      <div className="bg-[#f3f4f6] px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <h4 className="font-semibold text-[#1d4ed8]">Question {qIndex + 1}</h4>
        <button type="button" onClick={removeQuestion} className="text-gray-500 hover:text-red-500 transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Question Text */}
        <div className="space-y-1">
          <Label className="text-sm font-semibold text-gray-700">Question <span className="text-red-500">*</span></Label>
          <Textarea 
            {...register(`${fieldName}.questiontext`)} 
            placeholder={`Question ${qIndex + 1}`} 
            className="min-h-[60px] border-gray-300 focus-visible:ring-indigo-500 resize-none text-sm w-full p-2 border rounded-md"
          />
        </div>

        {/* First Row of Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-sm font-semibold text-gray-700">Sort Order</Label>
            <Input 
              type="number"
              {...register(`${fieldName}.questionorder`)} 
              placeholder="e.g. 1" 
              className="h-10 border-gray-300 focus-visible:ring-indigo-500" 
            />
          </div>
          
          <div className="space-y-1 flex flex-col">
            <Label className="text-sm font-semibold text-gray-700 mb-1">Response Type <span className="text-red-500">*</span></Label>
            <select 
              {...register(`${fieldName}.questiontypeid`, { valueAsNumber: true })}
              className="h-9 border border-gray-300 rounded-md px-3 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full text-sm"
            >
              <option value={1}>Short Text</option>
              <option value={2}>Long Text</option>
              <option value={3}>Number</option>
              <option value={4}>Radio</option>
              <option value={5}>Checkbox</option>
              <option value={6}>Dropdown</option>
              <option value={7}>Slider</option>
              <option value={8}>Date</option>
            </select>
          </div>
        </div>

        {/* Conditional Slider Settings */}
        {isSlider && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="space-y-1">
              <Label className="text-sm font-semibold text-gray-700">Min Value <span className="text-red-500">*</span></Label>
              <Input type="number" {...register(`${fieldName}.minvalue`)} placeholder="10" className="h-9 border-gray-300 bg-white text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-semibold text-gray-700">Max Value <span className="text-red-500">*</span></Label>
              <Input type="number" {...register(`${fieldName}.maxvalue`)} placeholder="100" className="h-9 border-gray-300 bg-white text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-semibold text-gray-700">Increments <span className="text-red-500">*</span></Label>
              <Input type="number" {...register(`${fieldName}.increment`)} placeholder="5" className="h-9 border-gray-300 bg-white text-sm" />
            </div>
          </div>
        )}

        {/* Conditional Options Settings */}
        {needsOptions && (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-2">
            <Label className="text-sm font-semibold text-gray-700">Options Configuration</Label>
            {fields.map((opt, oIndex) => (
              <div key={opt.id} className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0 bg-white"></div>
                <Input 
                  {...register(`${fieldName}.options.${oIndex}.optiontext`)} 
                  placeholder={`Option ${oIndex + 1}`} 
                  className="h-9 border-gray-300 focus-visible:ring-indigo-500 bg-white text-sm" 
                />
                <button type="button" onClick={() => remove(oIndex)} className="text-gray-400 hover:text-red-500 p-1.5 bg-white border border-gray-200 rounded-md">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <Button 
              type="button" 
              variant="outline"
              onClick={() => append({ optiontext: "", optionorder: fields.length + 1 })}
              className="text-[#1d4ed8] border-blue-200 hover:bg-blue-50 mt-1 h-8 text-sm"
            >
              + Add Option
            </Button>
          </div>
        )}

        {/* Footer Checks */}
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox 
            id={`${fieldName}.isrequired`}
            checked={isRequired}
            onCheckedChange={(c) => setValue(`${fieldName}.isrequired`, c)}
            className="border-gray-400 data-[state=checked]:bg-[#1d4ed8] data-[state=checked]:border-[#1d4ed8] w-4 h-4 rounded"
          />
          <Label htmlFor={`${fieldName}.isrequired`} className="text-sm font-semibold text-gray-700 cursor-pointer">
            Is Required
          </Label>
        </div>
      </div>
    </div>
  );
};
