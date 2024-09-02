import React, { ReactElement, ReactNode } from "react";
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from "@mui/material";

interface ButtonProps extends MuiButtonProps {
  children: ReactNode;
  colorVariant?: Color;
}

type Color = "transparent" | "blue" | "red";

const Button = ({
  children,
  variant = "contained",
  onClick,
  sx,
  disabled = false,
  colorVariant = "blue",
  ...props
}: ButtonProps): ReactElement => {
  let color = "#5BB9C2";
  if (colorVariant === "red") color = "#9a4e4e";
  if (colorVariant === "transparent") color = "transparent";

  let hoverColor = "#79D8EA";
  if (colorVariant === "red") hoverColor = "#9a4e4e";
  if (colorVariant === "transparent") hoverColor = "rgba(0, 0, 0, 0.1)";

  return (
    <MuiButton
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      sx={{
        backgroundColor: color,
        borderRadius: 0,
        boxShadow: "none",
        "&:hover": {
          backgroundColor: hoverColor,
          color: "black",
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
