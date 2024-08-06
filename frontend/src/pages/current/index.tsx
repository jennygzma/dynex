import { Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import UserSpecification from "./components/user-specification";
import CodeGeneration from "./components/implementation";
import { useAppContext } from "./hooks/app-context";
import Spinner from "./components/spinner";
import ControlPanel from "./components/control-panel";

// This prototype focuses on planning and getting a fully planned out version with the code ready
const Home = () => {
  const { isLoading } = useAppContext();
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
            THEORY2CODE
          </Typography>
        </Stack>
        <UserSpecification />
        <Stack direction="row">
          <ControlPanel />
          <CodeGeneration />
        </Stack>
      </Stack>
    </div>
  );
};

export default Home;
