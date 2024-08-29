import React, { useEffect } from "react";
import { useAppContext } from "../hooks/app-context";
import axios from "axios";
import { Card, CardActionArea, Stack, Typography } from "@mui/material";
import Button from "../../../components/Button";
import Box from "../../../components/Box";

const Prototypes = () => {
  const {
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
    <Box sx={{ width: "98%" }}>
      <Stack spacing="10px">
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            alignSelf: "center",
            fontFamily: "monospace",
          }}
        >
          Prototypes
        </Typography>
        {prototypes && (
          <Stack direction="row" spacing="10px">
            <Stack direction="row" spacing="5px">
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
                        sx={{ padding: "15px", borderRadius: "20px" }}
                      >
                        <Stack
                          direction="row"
                          spacing="5px"
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
                            🗑️
                          </Button>
                        </Stack>
                      </CardActionArea>
                    </Card>
                  </Stack>
                );
              })}
            </Stack>
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default Prototypes;
