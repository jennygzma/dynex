import React, { ReactElement } from "react";
import {
  TextField as ReactTextField,
  TextFieldProps as ReactTextFieldProps,
} from "@mui/material";

interface TextFieldProps extends Omit<ReactTextFieldProps, "inputProps"> {
  code?: boolean;
}

const TextField = ({
  code = false,
  className = "text-field",
  label,
  variant = "outlined",
  rows = 2,
  value,
  placeholder = "",
  onChange,
  sx,
  ...props
}: TextFieldProps): ReactElement => {
  return (
    <ReactTextField
      className={className}
      label={label}
      multiline
      variant={variant}
      rows={rows}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      inputProps={code ? { style: { fontFamily: "monospace" } } : undefined}
      sx={{
        width: "100%",
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "#9a4e4e", // Default border color
          },
          "&:hover fieldset": {
            borderColor: "#9a4e4e", // Border color on hover
          },
          "&.Mui-focused fieldset": {
            borderColor: "#9a4e4e", // Border color when focused
          },
        },
        "& .MuiInputLabel-root": {
          color: "#9a4e4e", // Label color
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "#9a4e4e", // Label color when focused
        },
        ...sx,
      }}
      {...props}
    />
  );
};

export default TextField;
