import React from "react";
import { CircularProgress, Box } from "@mui/material";
import { css } from "@emotion/react";

const overlayStyle = {
  position: "fixed",
  display: "flex",
  height: "100%",
  width: "100%",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#FFFFFFB3",
  zIndex: 9999,
};

const Spinner = () => {
  return (
    <Box sx={overlayStyle}>
      <CircularProgress sx={{ color: "#9a4e4e" }} />
    </Box>
  );
};

export default Spinner;
