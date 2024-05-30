import { Button, Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import axios from "axios";

const Starter = () => {
  const [dataInput, setDataInput] = useState("");
  const [dataModel, setDataModel] = useState("");

  const generateFakeData = () => {
    axios({
      method: "POST",
      url: "/generate_fake_data",
      data: {
        data_model_prompt: dataModel,
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
        setDataInput(response.data.fake_data);
      })
      .catch((error) => {
        console.error("Error calling /save_faked_data request:", error);
      });
  };

  return (
    <Stack spacing="20px" width="20%">
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
      <Button variant="contained" color="primary" onClick={generateFakeData}>
        Generate fake data
      </Button>
      <TextField
        className={"generated-data"}
        label="Data Input"
        variant="outlined"
        multiline
        rows={100}
        value={dataInput}
        onChange={(e) => setDataInput(e.target.value)}
        inputProps={{ style: { fontFamily: "monospace" } }}
      />
      <Button variant="contained" color="primary" onClick={saveFakedData}>
        Save faked data
      </Button>
    </Stack>
  );
};

export default Starter;
