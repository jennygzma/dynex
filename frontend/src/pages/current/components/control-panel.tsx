import React, { useEffect, useState } from "react";
import { useAppContext } from "../hooks/app-context";
import axios from "axios";
import { Card, CardActionArea, Stack, Typography } from "@mui/material";
import Button from "../../../components/Button";
import TextField from "../../../components/TextField";
import Box from "../../../components/Box";
import Iterations from "./iterations";

const ControlPanel = () => {
  const {
    iterations,
    updateIterations,
    currentIteration,
    updateCurrentIteration,
    designHypothesis,
    theoriesToExplore,
    currentTheory,
    updateCurrentTheory,
  } = useAppContext();
  if (!theoriesToExplore) return <></>;
  return (
    <Box sx={{ width: "25%" }}>
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
        {theoriesToExplore && (
          <Stack direction="row" spacing="10px">
            <Stack sx={{ width: "100%" }}>
              {theoriesToExplore.map((theory) => {
                return (
                  <Stack spacing="10px">
                    <Card
                      key={theory}
                      sx={{
                        fontSize: "20px",
                        lineHeight: "30px",
                        backgroundColor:
                          currentTheory === theory
                            ? "lightblue"
                            : "transparent",
                      }}
                    >
                      <CardActionArea
                        onClick={() => updateCurrentTheory(theory)}
                        sx={{ padding: "15px" }}
                      >
                        <Typography>{theory}</Typography>
                      </CardActionArea>
                      {currentTheory === theory && (
                        <Stack
                          spacing="10px"
                          padding="15px"
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                          }}
                        >
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
