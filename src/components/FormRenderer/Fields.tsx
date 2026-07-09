import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface FieldProps {
  question: any;
  name: string;
}

export const TextField = ({ question, name }: FieldProps) => {
  const { register, formState: { errors } } = useFormContext();
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-base">{question.questiontext}</Label>
      <Input id={name} {...register(name)} />
      {errors[name] && <span className="text-sm text-destructive">{(errors[name] as any)?.message}</span>}
    </div>
  );
};

export const TextAreaField = ({ question, name }: FieldProps) => {
  const { register, formState: { errors } } = useFormContext();
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-base">{question.questiontext}</Label>
      <Textarea id={name} {...register(name)} />
      {errors[name] && <span className="text-sm text-destructive">{(errors[name] as any)?.message}</span>}
    </div>
  );
};

export const NumberField = ({ question, name }: FieldProps) => {
  const { register, formState: { errors } } = useFormContext();
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-base">{question.questiontext}</Label>
      <Input type="number" id={name} {...register(name, { valueAsNumber: true })} />
      {errors[name] && <span className="text-sm text-destructive">{(errors[name] as any)?.message}</span>}
    </div>
  );
};

export const RadioField = ({ question, name }: FieldProps) => {
  const { control, formState: { errors } } = useFormContext();
  return (
    <div className="space-y-3">
      <Label className="text-base">{question.questiontext}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-1">
            {question.options.map((opt: any) => (
              <div className="flex items-center space-x-2" key={opt.optionid}>
                <RadioGroupItem value={opt.optionid.toString()} id={`opt-${opt.optionid}`} />
                <Label htmlFor={`opt-${opt.optionid}`} className="font-normal">{opt.optiontext}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
      />
      {errors[name] && <span className="text-sm text-destructive">{(errors[name] as any)?.message}</span>}
    </div>
  );
};

export const CheckboxField = ({ question, name }: FieldProps) => {
  const { control, formState: { errors } } = useFormContext();
  return (
    <div className="space-y-3">
      <Label className="text-base">{question.questiontext}</Label>
      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <div className="space-y-2">
            {question.options.map((opt: any) => (
              <div className="flex items-center space-x-2" key={opt.optionid}>
                <Checkbox 
                  id={`opt-${opt.optionid}`} 
                  checked={field.value?.includes(opt.optionid.toString())}
                  onCheckedChange={(checked) => {
                    const currentValues = field.value || [];
                    const newVal = opt.optionid.toString();
                    if (checked) {
                      field.onChange([...currentValues, newVal]);
                    } else {
                      field.onChange(currentValues.filter((v: string) => v !== newVal));
                    }
                  }}
                />
                <Label htmlFor={`opt-${opt.optionid}`} className="font-normal">{opt.optiontext}</Label>
              </div>
            ))}
          </div>
        )}
      />
      {errors[name] && <span className="text-sm text-destructive">{(errors[name] as any)?.message}</span>}
    </div>
  );
};

export const SelectField = ({ question, name }: FieldProps) => {
  const { control, formState: { errors } } = useFormContext();
  return (
    <div className="space-y-2">
      <Label className="text-base">{question.questiontext}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value || ""}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options.map((opt: any) => (
                <SelectItem value={opt.optionid.toString()} key={opt.optionid}>
                  {opt.optiontext}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {errors[name] && <span className="text-sm text-destructive">{(errors[name] as any)?.message}</span>}
    </div>
  );
};

export const SliderField = ({ question, name }: FieldProps) => {
  const { control, formState: { errors } } = useFormContext();
  const min = question.minvalue || 0;
  const max = question.maxvalue || 100;
  const step = question.increment || 1;

  return (
    <div className="space-y-4">
      <Label className="text-base">{question.questiontext}</Label>
      <Controller
        name={name}
        control={control}
        defaultValue={min}
        render={({ field }) => (
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">{min}</span>
            <Slider 
              min={min} 
              max={max} 
              step={step} 
              value={[field.value ?? min]} 
              onValueChange={(vals) => field.onChange(vals[0])} 
              className="flex-1"
            />
            <span className="text-sm font-medium">{max}</span>
            <span className="ml-4 font-bold text-indigo-600 w-10 text-right">{field.value ?? min}</span>
          </div>
        )}
      />
      {errors[name] && <span className="text-sm text-destructive">{(errors[name] as any)?.message}</span>}
    </div>
  );
};

export const DateField = ({ question, name }: FieldProps) => {
  const { register, formState: { errors } } = useFormContext();
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-base">{question.questiontext}</Label>
      <Input type="date" id={name} {...register(name)} className="w-fit" />
      {errors[name] && <span className="text-sm text-destructive">{(errors[name] as any)?.message}</span>}
    </div>
  );
};
