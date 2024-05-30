import { Button, Card, Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import axios from "axios";

const UserInputs = () => {
  const [dataInput, setDataInput] = useState("");
  const [dataModel, setDataModel] = useState("");
  const [UIPrompt, setUIPrompt] = useState("");
  const [designHypothesis, setDesignHypothesis] = useState("");

  const generateFakeData = () => {
    axios({
      method: "POST",
      url: "/generate_fake_data",
      data: {
        data_model: dataModel,
      },
    })
      .then((response) => {
        console.log("/generate_fake_data request successful:", response.data);
        setDataInput(response.data.fake_data);
      })
      .catch((error) => {
        console.error("Error calling /generate_fake_data request:", error);
      });
  };

  const saveFakedData = () => {
    axios({
      method: "POST",
      url: "/save_faked_data",
      data: {
        faked_data: dataInput,
      },
    })
      .then((response) => {
        console.log("/save_faked_data request successful:", response.data);
      })
      .catch((error) => {
        console.error("Error calling /save_faked_data request:", error);
      });
  };

  const generateDesignHypothesis = () => {
    axios({
      method: "POST",
      url: "/generate_design_hypothesis",
      data: {
        prompt: UIPrompt,
      },
    })
      .then((response) => {
        console.log(
          "/generate_design_hypothesis request successful:",
          response.data,
        );
        setDesignHypothesis(response.data.hypothesis);
      })
      .catch((error) => {
        console.error(
          "Error calling /generate_design_hypotheses request:",
          error,
        );
      });
  };

  return (
    <Stack spacing="20px">
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
            Generate design hypothesis
          </Button>
          {designHypothesis && (
            <>
              <Card
                sx={{ padding: "40px", fontSize: "20px", lineHeight: "30px" }}
              >
                {designHypothesis}
              </Card>
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
            Generate fake data
          </Button>
          {dataInput && (
            <>
              <TextField
                className={"generated-data"}
                label="Data Input"
                variant="outlined"
                multiline
                rows={13}
                value={dataInput}
                onChange={(e) => setDataInput(e.target.value)}
                inputProps={{ style: { fontFamily: "monospace" } }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={saveFakedData}
                disabled={!dataInput}
              >
                Save faked data
              </Button>
            </>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default UserInputs;
