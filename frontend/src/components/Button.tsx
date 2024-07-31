import React, { ReactElement, ReactNode } from "react";
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from "@mui/material";

interface ButtonProps extends MuiButtonProps {
  children: ReactNode;
}

const Button = ({
  children,
  variant = "contained",
  onClick,
  sx,
  disabled = false,
  ...props
}: ButtonProps): ReactElement => {
  return (
    <MuiButton
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      sx={{
        backgroundColor: "#9a4e4e",
        "&:hover": {
          backgroundColor: "#b55e5e",
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
