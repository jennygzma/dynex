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
import Header from "./components/header";

// This prototype focuses on planning and getting a fully planned out version with the code ready
const Home = () => {
  const { isLoading } = useAppContext();
  useEffect(() => {}, [isLoading]);
  return (
    <div className={"home"}>
      {isLoading && <Spinner />}
      <MatrixProvider>
        <Header />
        <ProblemSpecification />
      </MatrixProvider>
      <Stack
        spacing="10px"
        sx={{
          padding: "20px",
          height: "100%",
          minHeight: "100vh",
          // backgroundColor:"#9a4e4e",
        }}
      >
        <ProjectFormation />
        <Stack direction="row" spacing="20px">
          <Steps />

          <CodeGeneration />
        </Stack>
      </Stack>
    </div>
  );
};

export default Home;
