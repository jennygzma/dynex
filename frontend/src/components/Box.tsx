import React, { ReactElement, ReactNode } from "react";
import { Box as ReactBox, BoxProps as ReactBoxProps } from "@mui/material";

interface BoxProps extends ReactBoxProps {
  children: ReactNode;
}

const Box = ({ children, sx, ...props }: BoxProps): ReactElement => {
  return (
    <ReactBox
      sx={{
        padding: "10px",
        border: 10,
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
