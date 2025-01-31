import React, { useEffect } from "react";
import { useAppContext } from "../hooks/app-context";
import axios from "axios";
import { Card, CardActionArea, Stack, Typography } from "@mui/material";
import Button from "../../../components/Button";
import { SERVER_URL } from "..";

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
      url: `${SERVER_URL}/set_current_prototype`,
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
    <Stack
      spacing="10px"
      sx={{
        padding: "10px",
        backgroundColor: "#F8F3CA",
        height: "100vh",
      }}
    >
      {/* <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            alignSelf: "center",
            fontFamily: "monospace",
          }}
        >
          Prototypes
        </Typography> */}
      {prototypes && (
        <Stack spacing="10px">
          <Stack spacing="5px">
            {prototypes?.map((prototype) => {
              return (
                <Stack spacing="10px">
                  <Card
                    key={prototype}
                    sx={{
                      fontSize: "20px",
                      lineHeight: "30px",
                      boxShadow: "none",
                      borderRadius: 0,
                      border:
                        currentPrototype === prototype
                          ? "2px solid #9a4e4e"
                          : "1px solid transparent", // Thicker border and color if currentPrototype matches
                    }}
                  >
                    <CardActionArea
                      onClick={() => {
                        updateCurrentPrototype(prototype);
                        setCurrentPrototype(prototype);
                      }}
                      sx={{ padding: "15px", borderRadius: 0 }}
                    >
                      <Stack
                        direction="row"
                        spacing="5px"
                        sx={{ justifyContent: "space-between" }}
                      >
                        <Typography>{prototype}</Typography>
                        <Button
                          colorVariant={"transparent"}
                          onClick={() =>
                            updatePrototypes(
                              prototypes.filter((p) => p !== prototype),
                            )
                          }
                          sx={{
                            padding: 0,
                          }}
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
  );
};

export default Prototypes;
