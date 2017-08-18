import * as React from "react";

import Field from "shared/components/form/field";

import "./text-field.scss";

interface TextFieldProps {
  editable: boolean
  label: string | null
  value: string | null
  size: "sm" | "md" | "lg"
  onChange: React.ChangeEventHandler<HTMLInputElement> 
}

const TextField = (props: TextFieldProps) => {

  let textField: React.ReactElement<HTMLInputElement> = (
    <input 
      className="textfield" 
      readOnly={!props.editable} 
      onChange={props.onChange}
      value={props.value ? props.value : ""} />
  );

  return <Field label={props.label} field={textField} />

};

export default TextField;
