import { Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import UserInputs from "./components/user-inputs";
import CodeGeneration from "./components/code-generation";
import Plan from "./components/plan";
import { PlanProvider, usePlanContext } from "./hooks/plan-context";
import Spinner from "./components/spinner";

// This prototype focuses on planning and getting a fully planned out version with the code ready
const Home = () => {
  const { isLoading, updateIsLoading } = usePlanContext();
  useEffect(() => {}, [isLoading]);
  return (
    <div className={"home"}>
      {isLoading && <Spinner />}
      <Stack
        spacing="50px"
        sx={{
          padding: "20px",
          backgroundColor: "lightblue",
          height: "100%",
          minHeight: "100vh",
        }}
      >
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
          <Typography
            variant="h1"
            sx={{
              alignSelf: "center",
              color: "#9a4e4e",
              fontWeight: "bold",
              fontFamily: "monospace",
            }}
          >
            UX Prototyping
          </Typography>
        </Stack>
        <UserInputs />
        <Plan />
        <CodeGeneration />
      </Stack>
    </div>
  );
};

export default Home;
