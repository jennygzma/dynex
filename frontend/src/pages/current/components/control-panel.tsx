import React, { useEffect } from "react";
import { useAppContext } from "../hooks/app-context";
import axios from "axios";
import { Card, CardActionArea, Stack, Typography } from "@mui/material";
import Button from "../../../components/Button";
import Box from "../../../components/Box";
import Iterations from "./iterations";
import ProjectFormation from "./project-formation";

const ControlPanel = () => {
  const {
    iterations,
    updateCurrentIteration,
    theoriesAndParadigmsToExplore,
    currentTheoryAndParadigm,
    updateCurrentTheoryAndParadigm,
    updateIsLoading,
  } = useAppContext();

  const setCurrentTheoryAndParadigm = (theoryAndParadigm) => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/set_current_theory_and_paradigm",
      data: {
        theoryAndParadigm: theoryAndParadigm,
      },
    })
      .then((response) => {
        console.log(
          "/set_current_theory_and_paradigm request successful:",
          response.data,
        );
      })
      .catch((error) => {
        console.error(
          "Error calling /set_current_theory_and_paradigm request:",
          error,
        );
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  if (theoriesAndParadigmsToExplore?.length === 0) return <></>;

  return (
    <Box sx={{ width: "30%" }}>
      <Stack spacing="10px">
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            alignSelf: "center",
            fontFamily: "monospace",
          }}
        >
          Control Panel
        </Typography>
        {theoriesAndParadigmsToExplore && (
          <Stack direction="row" spacing="10px">
            <Stack sx={{ width: "100%" }}>
              {theoriesAndParadigmsToExplore.map((theory) => {
                return (
                  <Stack spacing="10px">
                    <Card
                      key={theory}
                      sx={{
                        fontSize: "20px",
                        lineHeight: "30px",
                        backgroundColor:
                          currentTheoryAndParadigm === theory
                            ? "lightblue"
                            : "transparent",
                      }}
                    >
                      <CardActionArea
                        onClick={() => {
                          updateCurrentTheoryAndParadigm(theory);
                          setCurrentTheoryAndParadigm(theory);
                        }}
                        sx={{ padding: "15px" }}
                      >
                        <Typography>{theory}</Typography>
                      </CardActionArea>
                      {currentTheoryAndParadigm === theory && (
                        <Stack
                          spacing="10px"
                          padding="15px"
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                          }}
                        >
                          <ProjectFormation />
                          <Iterations />
                        </Stack>
                      )}
                    </Card>
                  </Stack>
                );
              })}
            </Stack>
          </Stack>
        )}
        <Box
          border={5}
          sx={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Stack spacing="10px">
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
                alignSelf: "center",
                fontFamily: "monospace",
              }}
            >
              Iterate, Debug, or Repair Versions
            </Typography>
            {iterations && (
              <Button
                onClick={() => {
                  updateCurrentIteration(0);
                }}
              >
                Revert to Original
              </Button>
            )}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default ControlPanel;
