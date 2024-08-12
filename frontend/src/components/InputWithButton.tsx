import { Stack } from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Button from "./Button";
import TextField from "./TextField";

interface InputWithSubmissionProps {
  label: string;
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  buttonName?: string;
  onClick: () => void;
  disabled?: boolean;
  rows?: number;
  width?: string;
  className?: string;
  direction?: "row" | "column";
}

const InputWithButton = ({
  input,
  setInput,
  label,
  width = "100%",
  rows = 1,
  className = "text-field",
  onClick,
  buttonName = "Submit",
  disabled = false,
  direction = "row",
}: InputWithSubmissionProps) => {
  const [submittedInput, setSubmittedInput] = useState(false);
  useEffect(() => setSubmittedInput(false), [input]);

  return (
    <Stack direction={direction} spacing="10px" sx={{ width: { width } }}>
      <TextField
        className={className}
        label={label}
        value={input}
        rows={rows}
        onChange={(e) => {
          setInput(e.target.value);
          setSubmittedInput(false);
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
