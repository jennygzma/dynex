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
    updateIsLoading,
    prototypes,
    updatePrototypes,
    currentPrototype,
    updateCurrentPrototype,
  } = useAppContext();

  const setCurrentPrototype = (prototype) => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/set_current_prototype",
      data: {
        current_prototype: prototype,
      },
    })
      .then((response) => {
        console.log(
          "/set_current_prototype request successful:",
          response.data,
        );
      })
      .catch((error) => {
        console.error("Error calling /set_current_prototype request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  useEffect(() => {}, [prototypes]);

  if (prototypes?.length === 0 || !prototypes) return <></>;

  return (
    <Box sx={{ width: "40%" }}>
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
        {prototypes && (
          <Stack direction="row" spacing="10px">
            <Stack sx={{ width: "100%" }}>
              {prototypes?.map((prototype) => {
                return (
                  <Stack spacing="10px">
                    <Card
                      key={prototype}
                      sx={{
                        fontSize: "20px",
                        lineHeight: "30px",
                        backgroundColor:
                          currentPrototype === prototype
                            ? "lightblue"
                            : "transparent",
                      }}
                    >
                      <CardActionArea
                        onClick={() => {
                          updateCurrentPrototype(prototype);
                          setCurrentPrototype(prototype);
                        }}
                        sx={{ padding: "15px" }}
                      >
                        <Stack
                          direction="row"
                          sx={{ justifyContent: "space-between" }}
                        >
                          <Typography>{prototype}</Typography>
                          <Button
                            onClick={() =>
                              updatePrototypes(
                                prototypes.filter((p) => p !== prototype),
                              )
                            }
                          >
                            Remove
                          </Button>
                        </Stack>
                      </CardActionArea>
                      {currentPrototype === prototype && (
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
