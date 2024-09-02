import React, { ReactElement, ReactNode } from "react";
import { Chip as MuiChip, ChipProps as MuiChipProps } from "@mui/material";
import { SxProps, Theme } from "@mui/system";

const COLOR = "#9a4e4e";

interface ChipProps extends MuiChipProps {
  selected?: boolean;
  sx?: SxProps<Theme>;
}

const Chip = ({ selected = false, sx, ...props }: ChipProps): ReactElement => {
  return (
    <MuiChip
      sx={{
        border: `1px solid ${selected ? COLOR : "default"}`,
        "&:hover": {
          borderColor: selected ? COLOR : "default",
        },
        ...sx,
      }}
      clickable
      {...props}
    />
  );
};

export default Chip;
