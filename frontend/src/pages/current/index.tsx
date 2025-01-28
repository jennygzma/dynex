import { Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import CodeGeneration from "./components/implementation";
import { useAppContext } from "./hooks/app-context";
import Spinner from "./components/spinner";
import { MatrixProvider } from "./hooks/matrix-context";
import ProblemSpecification from "./components/problem-specification";
import Steps from "./components/steps";
import ProjectFormation from "./components/project-formation";
import Header from "./components/header";
import Button from "../../components/Button";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import Matrix from "./components/matrix";

const local = false;
export const URL = local ? "" : "https://dynexbackend-nmingl5go-jenny-mas-projects.vercel.app/";

// This prototype focuses on planning and getting a fully planned out version with the code ready
const Home = () => {
  const { isLoading, currentPrototype } = useAppContext();
  useEffect(() => {}, [isLoading]);
  const [expand, setExpand] = useState(true);

  return (
    <div className={"home"}>
      {isLoading && <Spinner />}
      <MatrixProvider>
        <Header />
        {!currentPrototype && <ProblemSpecification />}
      </MatrixProvider>
      {currentPrototype && (
        <Stack
          spacing="10px"
          sx={{
            padding: "40px",
            height: "100%",
            minHeight: "100vh",
            // backgroundColor:"#9a4e4e",
          }}
        >
          <Matrix />
          <ProjectFormation />
          {expand ? (
            <>
              <Stack
                direction="row"
                spacing="10px"
                sx={{
                  alignItems: "center",
                }}
              >
                <Button colorVariant="red" onClick={() => setExpand(false)}>
                  <ExpandLess />
                </Button>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  IMPLEMENTATION
                </Typography>
              </Stack>
              <Stack direction="row" spacing="20px">
                <Steps />
                <CodeGeneration />
              </Stack>
            </>
          ) : (
            <Stack
              direction="row"
              spacing="10px"
              sx={{
                alignItems: "center",
              }}
            >
              <Button colorVariant="red" onClick={() => setExpand(true)}>
                <ExpandMore />
              </Button>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                IMPLEMENTATION
              </Typography>
            </Stack>
          )}
        </Stack>
      )}
    </div>
  );
};

export default Home;
