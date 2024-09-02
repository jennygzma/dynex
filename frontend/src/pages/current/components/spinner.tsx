import React from "react";
import { Box, styled, keyframes } from "@mui/material";

// Define the spin keyframes
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styled component for the spinning image
const SpinnerImage = styled("img")({
  width: "100px",
  height: "100px",
  animation: `${spin} 2s linear infinite`,
});

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
      <SpinnerImage
        src={require("../../../assets/franky-icon.ico")}
        alt="Loading..."
      />
    </Box>
  );
};

export default Spinner;
