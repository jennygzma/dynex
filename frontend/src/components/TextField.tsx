import React, { ReactElement } from "react";
import {
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
} from "@mui/material";

interface TextFieldProps extends Omit<MuiTextFieldProps, "inputProps"> {
  code?: boolean;
}

const COLOR = "#9a4e4e";

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
    <MuiTextField
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
        backgroundColor: "white",
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: COLOR,
            borderRadius: 0,
          },
          "&:hover fieldset": {
            borderColor: COLOR,
            borderRadius: 0,
          },
          "&.Mui-focused fieldset": {
            borderColor: "#9a4e4e",
            borderRadius: 0,
          },
        },
        "& .MuiInputLabel-root": {
          color: COLOR,
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "#9a4e4e",
        },
        ...sx,
      }}
      {...props}
    />
  );
};

export default TextField;
