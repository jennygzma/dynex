import { Button, Card, Paper, Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import axios from "axios";

const CodeGeneration = () => {
  const [plan, setPlan] = useState("");
  const [code, setCode] = useState("");

  const renderUI = () => {
    const output = document.getElementById("output");
    output.innerHTML = "";
    const iframe = document.createElement("iframe");
    iframe.width = "100%";
    iframe.height = "100%";
    output.appendChild(iframe);
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(code);
    doc.close();
  };

  const generatePlan = () => {
    axios({
      method: "POST",
      url: "/generate_plan",
    })
      .then((response) => {
        console.log("/generate_plan request successful:", response.data);
        setPlan(response.data.plan);
      })
      .catch((error) => {
        console.error("Error calling /generate_plan request:", error);
      });
  };

  const generateCode = () => {
    axios({
      method: "GET",
      url: "/generate_code",
    })
      .then((response) => {
        console.log("/generate_code request successful:", response.data);
        setCode(response.data.code);
      })
      .catch((error) => {
        console.error("Error calling /generate_code request:", error);
      });
  };

  return (
    <Stack spacing="20px">
      <Button
        variant="contained"
        color="primary"
        onClick={generatePlan}
        sx={{ width: "100%" }}
      >
        Create Plan
      </Button>
      {plan && (
        <>
          <Card sx={{ padding: "40px", fontSize: "20px", lineHeight: "30px" }}>
            {plan}
          </Card>
          <Button
            variant="contained"
            color="primary"
            onClick={generateCode}
            sx={{ width: "100%" }}
          >
            Generate Code
          </Button>
          <TextField
            className={"hi"}
            label="Code Editor"
            variant="outlined"
            multiline
            rows={10}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            inputProps={{ style: { fontFamily: "monospace" } }}
          />
          <Button variant="contained" color="primary" onClick={renderUI}>
            Render
          </Button>
          <Paper id="output" className={"hi"} sx={{ height: "100vh" }} />
        </>
      )}
    </Stack>
  );
};

export default CodeGeneration;
