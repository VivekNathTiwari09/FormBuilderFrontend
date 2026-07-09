
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, Check } from "lucide-react";

interface FieldProps {
  question: any;
  name: string;
  index?: number;
}

const getOptionValue = (opt: any, idx: number) => {
  if (opt.optionid !== undefined && opt.optionid !== null) {
    return String(opt.optionid);
  }
  return `temp_${idx}`;
};

export const TextField = ({ question, name, index }: FieldProps) => {
  const { register, formState: { errors } } = useFormContext();
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-base font-semibold">{index ? `${index}. ` : ""}{question.questiontext}</Label>
      <Input id={name} {...register(name)} />
      {errors[name] && <span className="text-sm text-destructive">{(errors[name] as any)?.message}</span>}
    </div>
  );
};

export const TextAreaField = ({ question, name, index }: FieldProps) => {
  const { register, formState: { errors } } = useFormContext();
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-base font-semibold">{index ? `${index}. ` : ""}{question.questiontext}</Label>
      <Textarea id={name} {...register(name)} />
      {errors[name] && <span className="text-sm text-destructive">{(errors[name] as any)?.message}</span>}
    </div>
  );
};

export const NumberField = ({ question, name, index }: FieldProps) => {
  const { register, formState: { errors } } = useFormContext();
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-base font-semibold">{index ? `${index}. ` : ""}{question.questiontext}</Label>
      <Input type="number" id={name} {...register(name, { valueAsNumber: true })} />
      {errors[name] && <span className="text-sm text-destructive">{(errors[name] as any)?.message}</span>}
    </div>
  );
};

export const RadioField = ({ question, name, index }: FieldProps) => {
  const { control, formState: { errors } } = useFormContext();
  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">{index ? `${index}. ` : ""}{question.questiontext}</Label>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <div className="space-y-2 mt-2">
            {question.options?.map((opt: any, idx: number) => {
              const optId = getOptionValue(opt, idx);
              const inputId = `radio-${name}-${optId}`;
              const isChecked = field.value === optId;
              return (
                <label key={optId} htmlFor={inputId} className="flex cursor-pointer items-center gap-3 rounded-md py-1 text-sm text-gray-800">
                  <input
                    id={inputId}
                    type="radio"
                    name={name}
                    value={optId}
                    checked={isChecked}
                    onChange={() => field.onChange(optId)}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      isChecked ? "border-[#5F3EE7] bg-[#5F3EE7]" : "border-gray-400 bg-white"
                    }`}
                  >
                    {isChecked && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </span>
                  <span>{opt.optiontext}</span>
                </label>
            )})}
          </div>
        )}
      />
      {errors[name] && <span className="text-sm text-destructive">{(errors[name] as any)?.message}</span>}
    </div>
  );
};

export const CheckboxField = ({ question, name, index }: FieldProps) => {
  const { control, formState: { errors } } = useFormContext();
  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">{index ? `${index}. ` : ""}{question.questiontext}</Label>
      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <div className="space-y-2 mt-2">
            {question.options?.map((opt: any, idx: number) => {
              const optId = getOptionValue(opt, idx);
              const currentValues = Array.isArray(field.value) ? field.value : [];
              const isChecked = currentValues.includes(optId);
              const inputId = `chk-${name}-${optId}`;
              return (
                <label key={optId} htmlFor={inputId} className="flex cursor-pointer items-center gap-3 rounded-md py-1 text-sm text-gray-800">
                  <input
                    id={inputId}
                    type="checkbox"
                    checked={isChecked}
                    onChange={(event) => {
                      if (event.target.checked) {
                        field.onChange([...currentValues, optId]);
                      } else {
                        field.onChange(currentValues.filter((v: string) => v !== optId));
                      }
                    }}
                    onBlur={field.onBlur}
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                      isChecked ? "border-[#5F3EE7] bg-[#5F3EE7] text-white" : "border-gray-400 bg-white"
                    }`}
                  >
                    {isChecked && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                  <span>{opt.optiontext}</span>
                </label>
            )})}
          </div>
        )}
      />
      {errors[name] && <span className="text-sm text-destructive">{(errors[name] as any)?.message}</span>}
    </div>
  );
};

export const SelectField = ({ question, name, index }: FieldProps) => {
  const { control, formState: { errors } } = useFormContext();
  return (
    <div className="space-y-2">
      <Label className="text-base font-semibold">{index ? `${index}. ` : ""}{question.questiontext}</Label>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <select
            value={field.value || ""}
            onChange={(event) => field.onChange(event.target.value)}
            onBlur={field.onBlur}
            ref={field.ref}
            className="mt-2 h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm outline-none transition-colors focus:border-[#5F3EE7] focus:ring-2 focus:ring-[#5F3EE7]/20"
          >
            <option value="" disabled>Select an option</option>
            {question.options?.map((opt: any, idx: number) => {
              const optId = getOptionValue(opt, idx);
              return (
                <option value={optId} key={optId}>
                  {opt.optiontext}
                </option>
              );
            })}
          </select>
        )}
      />
      {errors[name] && <span className="text-sm text-destructive">{(errors[name] as any)?.message}</span>}
    </div>
  );
};

export const SliderField = ({ question, name, index }: FieldProps) => {
  const { control, formState: { errors } } = useFormContext();
  const min = Number.isFinite(Number(question.minvalue)) ? Number(question.minvalue) : 0;
  const max = Number.isFinite(Number(question.maxvalue)) ? Number(question.maxvalue) : 100;
  const step = Number.isFinite(Number(question.increment)) && Number(question.increment) > 0 ? Number(question.increment) : 1;

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">{index ? `${index}. ` : ""}{question.questiontext}</Label>
      <Controller
        name={name}
        control={control}
        defaultValue={min}
        render={({ field }) => {
          const numericValue = Number(field.value);
          const val = Number.isFinite(numericValue) ? numericValue : min;
          const fillPercent = max > min ? ((val - min) / (max - min)) * 100 : 0;
          return (
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-sm font-medium text-gray-500">{min}</span>
              <input
                type="range"
                min={min} 
                max={max} 
                step={step} 
                value={val} 
                onChange={(event) => field.onChange(Number(event.target.value))}
                onBlur={field.onBlur}
                ref={field.ref}
                className="h-2 flex-1 cursor-pointer appearance-none rounded-full accent-[#5F3EE7] [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#5F3EE7] [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-sm [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#5F3EE7] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm"
                style={{
                  background: `linear-gradient(to right, #5F3EE7 0%, #5F3EE7 ${fillPercent}%, #E5E7EB ${fillPercent}%, #E5E7EB 100%)`,
                }}
              />
              <span className="text-sm font-medium text-gray-500">{max}</span>
              <span className="ml-4 font-bold text-indigo-600 w-10 text-right">
                {val}
              </span>
            </div>
          );
        }}
      />
      {errors[name] && <span className="text-sm text-destructive">{(errors[name] as any)?.message}</span>}
    </div>
  );
};

export const DateField = ({ question, name, index }: FieldProps) => {
  const { register, formState: { errors } } = useFormContext();
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-base font-semibold">{index ? `${index}. ` : ""}{question.questiontext}</Label>
      <div className="relative mt-2 w-fit">
        <Input type="date" id={name} {...register(name)} className="w-[180px] pr-10 text-gray-900" />
        <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5F3EE7]" />
      </div>
      {errors[name] && <span className="text-sm text-destructive">{(errors[name] as any)?.message}</span>}
    </div>
  );
};
