import { Paper, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { usePlanContext } from "../hooks/plan-context";
import Button from "../../../components/Button";
import TextField from "../../../components/TextField";
import Box from "../../../components/Box";

const CodeGeneration = () => {
  const { updateIsLoading, plan, updatePlan, designHypothesis, currentTask } =
    usePlanContext();
  const [code, setCode] = useState("");
  const [updatedCode, setUpdatedCode] = useState(false);
  const [testCases, setTestCases] = useState(undefined);
  const [problemDescription, setProblemDescription] = useState(undefined);

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
    updateIsLoading(true);
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
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };
  const getCode = () => {
    updateIsLoading(true);
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
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const generateCode = () => {
    updateIsLoading(true);
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
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const getTestCases = () => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: "/get_test_cases_per_lock_step",
      params: {
        task_id: currentTask.taskId,
      },
    })
      .then((response) => {
        console.log(
          "/get_test_cases_per_lock_step request successful:",
          response.data,
        );
        setTestCases(response.data.test_cases);
      })
      .catch((error) => {
        console.error(
          "Error calling /get_test_cases_per_lock_step request:",
          error,
        );
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const debugAndRepairCode = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/debug_and_repair_code",
      data: {
        task_id: currentTask.taskId,
        problem: problemDescription,
      },
    })
      .then((response) => {
        console.log(
          "/debug_and_repair_code request successful:",
          response.data,
        );
        getCode();
        setProblemDescription(undefined);
      })
      .catch((error) => {
        console.error("Error calling /debug_and_repair_code request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  useEffect(() => {
    if (currentTask === undefined) return;
    getCode();
    renderUI();
  }, [plan, designHypothesis, currentTask]);

  if (!designHypothesis || !plan || !currentTask) return <></>;

  return (
    <Box>
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
          onClick={generateCode}
          sx={{
            width: "100%",
          }}
        >
          {code ? "Regenerate Code" : "Generate Code"}
        </Button>
        <TextField
          className={"code"}
          label="Code Editor"
          rows={40}
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setUpdatedCode(true);
          }}
          code={true}
        />
        <Button disabled={!updatedCode} onClick={saveCode}>
          Update Code
        </Button>
        <Button disabled={!code} onClick={getTestCases}>
          Get Test Cases
        </Button>
        {testCases &&
          testCases.map((testCase, index) => <div key={index}>{testCase}</div>)}
        <Stack direction="row" spacing="10px" sx={{ minWidth: "100%" }}>
          <TextField
            className={"problem"}
            label="Problem Description"
            value={problemDescription}
            onChange={(e) => {
              setProblemDescription(e.target.value);
            }}
          />
          <Button disabled={!problemDescription} onClick={debugAndRepairCode}>
            Debug and Repair
          </Button>
        </Stack>
        <Button disabled={!code} onClick={renderUI}>
          Render
        </Button>
        <Paper id="output" className={"hi"} sx={{ height: "1000px" }} />
      </Stack>
    </Box>
  );
};

export default CodeGeneration;
