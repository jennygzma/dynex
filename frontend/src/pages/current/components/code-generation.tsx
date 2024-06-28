import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { usePlanContext } from "../hooks/plan-context";

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
  // useEffect(() => {}, [code]);

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
          onClick={generateCode}
          sx={{
            width: "100%",
            backgroundColor: "#9a4e4e",
            "&:hover": {
              backgroundColor: "#b55e5e",
            },
          }}
        >
          {code ? "Regenerate Code" : "Generate Code"}
        </Button>
        <TextField
          className={"code"}
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
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#9a4e4e", // Default border color
              },
              "&:hover fieldset": {
                borderColor: "#9a4e4e", // Border color on hover
              },
              "&.Mui-focused fieldset": {
                borderColor: "#9a4e4e", // Border color when focused
              },
            },
            "& .MuiInputLabel-root": {
              color: "#9a4e4e", // Label color
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#9a4e4e", // Label color when focused
            },
          }}
        />
        <Button
          variant="contained"
          disabled={!updatedCode}
          onClick={saveCode}
          sx={{
            backgroundColor: "#9a4e4e",
            "&:hover": {
              backgroundColor: "#b55e5e",
            },
          }}
        >
          Update Code
        </Button>
        <Button
          variant="contained"
          disabled={!code}
          onClick={getTestCases}
          sx={{
            backgroundColor: "#9a4e4e",
            "&:hover": {
              backgroundColor: "#b55e5e",
            },
          }}
        >
          Get Test Cases
        </Button>
        {testCases &&
          testCases.map((testCase, index) => <div key={index}>{testCase}</div>)}
        <Stack direction="row" spacing="10px" sx={{ minWidth: "100%" }}>
          <TextField
            className={"problem"}
            label="Problem Description"
            variant="outlined"
            multiline
            rows={2}
            value={problemDescription}
            onChange={(e) => {
              setProblemDescription(e.target.value);
            }}
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#9a4e4e", // Default border color
                },
                "&:hover fieldset": {
                  borderColor: "#9a4e4e", // Border color on hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#9a4e4e", // Border color when focused
                },
              },
              "& .MuiInputLabel-root": {
                color: "#9a4e4e", // Label color
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#9a4e4e", // Label color when focused
              },
            }}
          />
          <Button
            variant="contained"
            disabled={!problemDescription}
            onClick={debugAndRepairCode}
            sx={{
              backgroundColor: "#9a4e4e",
              "&:hover": {
                backgroundColor: "#b55e5e",
              },
            }}
          >
            Debug and Repair
          </Button>
        </Stack>
        <Button
          variant="contained"
          color="primary"
          disabled={!code}
          onClick={renderUI}
          sx={{
            backgroundColor: "#9a4e4e",
            "&:hover": {
              backgroundColor: "#b55e5e",
            },
          }}
        >
          Render
        </Button>
        <Paper id="output" className={"hi"} sx={{ height: "1000px" }} />
      </Stack>
    </Box>
  );
};

export default CodeGeneration;
