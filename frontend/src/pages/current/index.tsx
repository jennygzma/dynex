import { Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import CodeGeneration from "./components/implementation";
import { useAppContext } from "./hooks/app-context";
import Spinner from "./components/spinner";
import Prototypes from "./components/prototypes";
import { MatrixProvider } from "./hooks/matrix-context";
import ProblemSpecification from "./components/problem-specification";
import Steps from "./components/steps";
import ProjectFormation from "./components/project-formation";

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
          spacing="10px"
          sx={{
            alignItems: "flex-start",
            alignContent: "flex-end",
            justifyContent: "center",
          }}
        >
          {/* <img
            src={require("../../assets/franky-icon.ico")}
            alt="franky"
            width="150x"
          /> */}
          <Typography
            variant="h1"
            sx={{
              alignSelf: "center",
              color: "#9a4e4e",
              fontWeight: "bold",
              fontFamily: "monospace",
            }}
          >
            DYNAEXPRO
          </Typography>
        </Stack>
        <MatrixProvider>
          <ProblemSpecification />
        </MatrixProvider>
        <Prototypes />
        <ProjectFormation />
        <Stack direction="row">
          <Steps />

          <CodeGeneration />
        </Stack>
      </Stack>
    </div>
  );
};

export default Home;
