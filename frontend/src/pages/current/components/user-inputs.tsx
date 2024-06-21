import { Box, Button, Card, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { usePlanContext } from "../hooks/plan-context";

const UserInputs = () => {
  const { updateIsLoading, designHypothesis, updateDesignHypothesis } =
    usePlanContext();

  useEffect(() => {
    getFakedData();
    getDesignHypothesis();
  }, []);

  const [dataInput, setDataInput] = useState("");
  const [dataModel, setDataModel] = useState("");
  const [UIPrompt, setUIPrompt] = useState("");
  const [updatedDesignHypothesis, setUpdatedDesignHypothesis] = useState(false);
  const [updatedDataInput, setUpdatedDataInput] = useState(false);

  useEffect(() => {}, [designHypothesis, dataInput]);

  const generateFakeData = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/generate_fake_data",
      data: {
        data_model: dataModel,
      },
    })
      .then((response) => {
        console.log("/generate_fake_data request successful:", response.data);
        getFakedData();
      })
      .catch((error) => {
        console.error("Error calling /generate_fake_data request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const saveFakedData = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/save_faked_data",
      data: {
        faked_data: dataInput,
      },
    })
      .then((response) => {
        console.log("/save_faked_data request successful:", response.data);
        getFakedData();
      })
      .catch((error) => {
        console.error("Error calling /save_faked_data request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const getFakedData = () => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: "/get_faked_data",
    })
      .then((response) => {
        console.log("/get_faked_data request successful:", response.data);
        setDataInput(response.data.faked_data);
        setUpdatedDataInput(false);
      })
      .catch((error) => {
        console.error("Error calling /get_faked_data request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const generateDesignHypothesis = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/generate_design_hypothesis",
      data: {
        prompt: UIPrompt,
        data_model: dataModel,
      },
    })
      .then((response) => {
        console.log(
          "/generate_design_hypothesis request successful:",
          response.data,
        );
        getDesignHypothesis();
      })
      .catch((error) => {
        console.error(
          "Error calling /generate_design_hypotheses request:",
          error,
        );
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const saveDesignHypothesis = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/save_design_hypothesis",
      data: {
        design_hypothesis: designHypothesis,
      },
    })
      .then((response) => {
        console.log(
          "/save_design_hypothesis request successful:",
          response.data,
        );
        getDesignHypothesis();
      })
      .catch((error) => {
        console.error("Error calling /save_design_hypothesis request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const getDesignHypothesis = () => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: "/get_design_hypothesis",
    })
      .then((response) => {
        console.log(
          "/get_design_hypothesis request successful:",
          response.data,
        );
        updateDesignHypothesis(response.data.design_hypothesis);
        setUpdatedDesignHypothesis(false);
      })
      .catch((error) => {
        console.error("Error calling /get_design_hypothesis request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  return (
    <Box
      sx={{
        padding: "10px",
        border: 10,
        borderColor: "#9a4e4e",
        backgroundColor: "white",
      }}
    >
      <Stack spacing="20px">
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            alignSelf: "center",
            fontFamily: "monospace",
          }}
        >
          User Input
        </Typography>
        <TextField
          className={"user-input"}
          label="User Input"
          variant="outlined"
          multiline
          rows={2}
          value={UIPrompt}
          placeholder={""}
          onChange={(e) => setUIPrompt(e.target.value)}
        />
        <TextField
          className={"data-model"}
          label="Data Model"
          variant="outlined"
          multiline
          rows={10}
          value={dataModel}
          onChange={(e) => setDataModel(e.target.value)}
          inputProps={{ style: { fontFamily: "monospace" } }}
        />
        <Stack direction="row" spacing="10px" width="100%">
          <Stack spacing="10px" width="50%">
            <Button
              variant="contained"
              color="primary"
              onClick={generateDesignHypothesis}
              disabled={!UIPrompt || !dataModel}
              sx={{ width: "100%" }}
            >
              {designHypothesis
                ? "Generate new design hypothesis"
                : "Generate design hypothesis"}
            </Button>
            {designHypothesis && (
              <>
                <TextField
                  className={"design-hypothesis"}
                  label="Design Hypothesis"
                  variant="outlined"
                  multiline
                  rows={13}
                  value={designHypothesis}
                  onChange={(e) => {
                    updateDesignHypothesis(e.target.value);
                    setUpdatedDesignHypothesis(true);
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={saveDesignHypothesis}
                  disabled={!updatedDesignHypothesis}
                >
                  Update design hypothesis
                </Button>
              </>
            )}
          </Stack>
          <Stack spacing="10px" width="50%">
            <Button
              variant="contained"
              color="primary"
              onClick={generateFakeData}
              disabled={!UIPrompt || !dataModel}
              sx={{ width: "100%" }}
            >
              {dataInput ? "Regenerate Fake Data" : "Generate Fake Data"}
            </Button>
            {dataInput !== "null" && dataInput && (
              <>
                <TextField
                  className={"generated-data"}
                  label="Data Input"
                  variant="outlined"
                  multiline
                  rows={13}
                  value={dataInput}
                  onChange={(e) => {
                    setDataInput(e.target.value);
                    setUpdatedDataInput(true);
                  }}
                  inputProps={{ style: { fontFamily: "monospace" } }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={saveFakedData}
                  disabled={!updatedDataInput}
                >
                  Update faked data
                </Button>
              </>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default UserInputs;
