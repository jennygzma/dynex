import { Card, Paper, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { usePlanContext } from "../hooks/plan-context";
import Button from "../../../components/Button";
import TextField from "../../../components/TextField";
import Box from "../../../components/Box";

const CodeGeneration = () => {
  const { updateIsLoading, plan, designHypothesis, currentTask } =
    usePlanContext();
  const [code, setCode] = useState("");
  const [updatedCode, setUpdatedCode] = useState(false);
  const [testCases, setTestCases] = useState(undefined);
  const [problemDescription, setProblemDescription] = useState(undefined);
  const [clickedRender, setClickedRender] = useState(false);
  const [iterations, setIterations] = useState(undefined);

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
        setCode(response.data.code);
      })
      .catch((error) => {
        console.error("Error calling /get_code_per_step request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const getIterations = () => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: "/get_iteration_map_per_step",
      params: {
        task_id: currentTask.taskId,
      },
    })
      .then((response) => {
        console.log(
          "/get_iteration_map_per_step request successful:",
          response.data,
        );
        if (Object.entries(response.data.iterations).length > 0) {
          setIterations(response.data.iterations);
        } else {
          setIterations(undefined);
        }
      })
      .catch((error) => {
        console.error(
          "Error calling /get_iteration_map_per_step request:",
          error,
        );
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const getCodeForIteration = (iteration: number) => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: "/get_code_per_step_per_iteration",
      params: {
        task_id: currentTask.taskId,
        iteration: iteration,
      },
    })
      .then((response) => {
        console.log(
          "/get_code_per_step_per_iteration request successful:",
          response.data,
        );
        setCode(response.data.code);
      })
      .catch((error) => {
        console.error(
          "Error calling /get_code_per_step_per_iteration request:",
          error,
        );
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

  const iterateCode = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/iterate_code",
      data: {
        task_id: currentTask.taskId,
        problem: problemDescription,
      },
    })
      .then((response) => {
        console.log("/iterate_code request successful:", response.data);
        getCode();
        getIterations();
        setProblemDescription("");
      })
      .catch((error) => {
        console.error("Error calling /iterate_code request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  useEffect(() => {
    if (currentTask === undefined) return;
    getCode();
    getIterations();
    setTestCases(undefined);
    setProblemDescription("");
    setClickedRender(false);
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
        {code && (
          <>
            <Box
              border={5}
              sx={{ justifyContent: "center", alignItems: "center" }}
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
                  Code Editor{" "}
                </Typography>
                <TextField
                  className={"code"}
                  rows={40}
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setUpdatedCode(true);
                  }}
                  code={true}
                />
                <Button
                  disabled={!updatedCode}
                  onClick={saveCode}
                  sx={{ width: "100%" }}
                >
                  Update Code
                </Button>
              </Stack>
            </Box>
            <Stack direction="row" spacing="10px">
              <Box
                border={5}
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: "25%",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "bold",
                    alignSelf: "center",
                    fontFamily: "monospace",
                  }}
                >
                  Brainstorm Test Cases
                </Typography>
                <Stack spacing="10px">
                  <Button
                    disabled={!code}
                    onClick={getTestCases}
                    sx={{ width: "100%" }}
                  >
                    Get Test Cases
                  </Button>
                  {testCases &&
                    testCases.map((testCase, index) => (
                      <Typography variant="body2" key={index}>
                        {testCase}
                      </Typography>
                    ))}
                </Stack>
              </Box>
              <Box
                border={5}
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: "75%",
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
                    Iterate, Debug, or Repair
                  </Typography>
                  {iterations && (
                    <Button onClick={() => getCodeForIteration(0)}>
                      Revert to Original
                    </Button>
                  )}
                  {iterations &&
                    Object.keys(iterations).map((key) => (
                      <Stack direction="row" spacing="5px">
                        <Card sx={{ padding: "10px", width: "95%" }}>
                          <Typography variant="body2">
                            {iterations[key]}
                          </Typography>
                        </Card>
                        <Button
                          onClick={() => {
                            getCodeForIteration(+key);
                          }}
                        >
                          Set
                        </Button>
                      </Stack>
                    ))}
                  <TextField
                    className={"problem"}
                    label="Problem Description"
                    value={problemDescription}
                    onChange={(e) => {
                      setProblemDescription(e.target.value);
                    }}
                  />
                  <Button disabled={!problemDescription} onClick={iterateCode}>
                    Iterate
                  </Button>
                </Stack>
              </Box>
            </Stack>
            <Button
              disabled={!code}
              onClick={() => {
                setClickedRender(true);
                renderUI();
              }}
            >
              Render
            </Button>
            {!clickedRender && (
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  alignSelf: "center",
                  fontFamily: "monospace",
                }}
              >
                Your UI will be rendered here!
              </Typography>
            )}
            <Box border={clickedRender ? 5 : 0}>
              <Paper
                id="output"
                className="output"
                sx={{ height: clickedRender ? "500px" : "0px" }}
              />
            </Box>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default CodeGeneration;
