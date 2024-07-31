import React, { ReactElement, ReactNode } from "react";
import { Chip as MuiChip, ChipProps as MuiChipProps } from "@mui/material";
import { SxProps, Theme } from "@mui/system";

interface ChipProps extends MuiChipProps {
  selected?: boolean;
  sx?: SxProps<Theme>;
}

const Chip = ({ selected = false, sx, ...props }: ChipProps): ReactElement => {
  return (
    <MuiChip
      sx={{
        backgroundColor: selected ? "lightblue" : "default",
        "&:hover": {
          backgroundColor: selected ? "lightblue" : "default",
        },
        ...sx,
      }}
      clickable
      {...props}
    />
  );
};

export default Chip;
