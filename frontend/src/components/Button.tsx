import React, { ReactElement, ReactNode } from "react";
import {
  Button as ReactButton,
  ButtonProps as ReactButtonProps,
} from "@mui/material";

interface ButtonProps extends ReactButtonProps {
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
    <ReactButton
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
    </ReactButton>
  );
};

export default Button;
