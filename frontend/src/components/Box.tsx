import React, { ReactElement, ReactNode } from "react";
import { Box as ReactBox, BoxProps as ReactBoxProps } from "@mui/material";

interface BoxProps extends ReactBoxProps {
  children?: ReactNode;
  border?: number;
}

const Box = ({ children, border, sx, ...props }: BoxProps): ReactElement => {
  return (
    <ReactBox
      sx={{
        padding: "10px",
        border: border ?? 10,
        borderColor: "#9a4e4e",
        backgroundColor: "white",
        ...sx,
      }}
      {...props}
    >
      {children}
    </ReactBox>
  );
};

export default Box;
