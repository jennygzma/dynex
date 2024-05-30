import { Stack, Typography, Button } from "@mui/material";
import React, { useState } from "react";
import UserInputs from "./components/user-inputs";
import CodeGeneration from "./components/code-generation";

// This prototype focuses on planning and getting a fully planned out version with the code ready
const Home = () => {
  return (
    <div className={"home"}>
      <Stack spacing="20px" sx={{ padding: "20px" }}>
        <Stack
          direction="row"
          spacing="20px"
          sx={{
            alignItems: "flex-start",
            alignContent: "flex-end",
            justifyContent: "center",
          }}
        >
          <img
            src={require("../../assets/franky-icon.ico")}
            alt="chopper"
            width="150x"
          />
          <Typography variant="h1" sx={{ alignSelf: "center" }}>
            UX Prototype
          </Typography>
        </Stack>
        <UserInputs />
        <CodeGeneration />
      </Stack>
    </div>
  );
};

export default Home;
