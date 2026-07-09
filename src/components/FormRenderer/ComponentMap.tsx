import { TextField, TextAreaField, NumberField, RadioField, CheckboxField, SelectField, SliderField, DateField } from "./Fields";

// We map QuestionTypeID (or TypeCode) to the correct component. 
// Assuming QuestionTypeIDs: 1=Short Text, 2=Long Text, 3=Number, 4=Radio, 5=Checkbox, 6=Dropdown, 7=Slider, 8=Date
export const ComponentMap: Record<number, React.FC<any>> = {
  1: TextField,
  2: TextAreaField,
  3: NumberField,
  4: RadioField,
  5: CheckboxField,
  6: SelectField,
  7: SliderField,
  8: DateField
};
