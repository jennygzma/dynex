import { Stack, SxProps } from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Button from "./Button";
import TextField from "./TextField";

interface InputWithSubmissionProps {
  label: string;
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  buttonName?: string;
  onClick: () => void;
  onChange?: () => void;
  disabled?: boolean;
  rows?: number;
  width?: string;
  className?: string;
  direction?: "row" | "column";
  sx?: SxProps;
}

const InputWithButton = ({
  input,
  setInput,
  label,
  width = "100%",
  rows = 1,
  className = "text-field",
  onClick,
  onChange = () => {},
  buttonName = "Submit",
  disabled = false,
  direction = "row",
  sx,
}: InputWithSubmissionProps) => {
  const [submittedInput, setSubmittedInput] = useState(false);
  useEffect(() => setSubmittedInput(false), [input]);

  return (
    <Stack
      direction={direction}
      spacing="10px"
      sx={{ width: { width }, ...sx }}
    >
      <TextField
        className={className}
        label={label}
        value={input}
        rows={rows}
        onChange={(e) => {
          setInput(e.target.value);
          setSubmittedInput(false);
          onChange();
        }}
      />
      <Button
        onClick={() => {
          onClick();
          setSubmittedInput(true);
        }}
        disabled={disabled || submittedInput}
        sx={{
          width: direction === "row" ? "10%" : "100%",
        }}
      >
        {buttonName}
      </Button>
    </Stack>
  );
};

export default InputWithButton;
