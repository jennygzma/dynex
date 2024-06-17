import {
  Box,
  Button,
  Card,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { usePlanContext } from "../hooks/plan-context";

const CodeGeneration = () => {
  const { plan, updatePlan, designHypothesis, currentTask } = usePlanContext();
  const [code, setCode] = useState("");
  const [updatedCode, setUpdatedCode] = useState(false);

  console.log("hi jenny currentTask", currentTask);
  useEffect(() => {
    if (currentTask === undefined) return;
    getCode();
    renderUI();
  }, [plan, designHypothesis, currentTask]);
  useEffect(() => {}, [code]);

  const renderUI = () => {
    const output = document.getElementById("output");
    output.innerHTML = "";
    const iframe = document.createElement("iframe");
    iframe.width = "100%";
    iframe.height = "100%";
    output.appendChild(iframe);
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(plan[currentTask.taskId - 1].code);
    doc.close();
  };

  const saveCode = () => {
    axios({
      method: "POST",
      url: "/save_code_per_step",
      data: {
        task_id: currentTask.taskId,
        code: code,
      },
    })
      .then((response) => {
        console.log("/save_code_per_step request successful:", response.data);
        getCode();
        setUpdatedCode(false);
      })
      .catch((error) => {
        console.error("Error calling /save_code_per_step request:", error);
      });
  };
  const getCode = () => {
    axios({
      method: "GET",
      url: "/get_code_per_step",
      params: {
        task_id: currentTask.taskId,
      },
    })
      .then((response) => {
        console.log("/get_code_per_step request successful:", response.data);
        plan[currentTask.taskId - 1].code = response.data.code;
        updatePlan(plan);
        setCode(response.data.code);
      })
      .catch((error) => {
        console.error("Error calling /get_code_per_step request:", error);
      });
  };

  const generateCode = () => {
    axios({
      method: "POST",
      url: "/generate_code",
      data: {
        task_id: currentTask.taskId,
      },
    })
      .then((response) => {
        console.log("/generate_code request successful:", response.data);
        getCode();
      })
      .catch((error) => {
        console.error("Error calling /generate_code request:", error);
      });
  };

  if (!designHypothesis || !plan || !currentTask) return <></>;

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
          Implementation
        </Typography>
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
          rows={40}
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setUpdatedCode(true);
          }}
          inputProps={{ style: { fontFamily: "monospace" } }}
        />
        <Button
          variant="contained"
          disabled={!updatedCode}
          color="primary"
          onClick={saveCode}
        >
          Update Code
        </Button>
        <Button variant="contained" color="primary" onClick={renderUI}>
          Render
        </Button>
        <Paper id="output" className={"hi"} sx={{ height: "100vh" }} />
      </Stack>
    </Box>
  );
};

export default CodeGeneration;
