import { Card, Paper, Stack, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "../hooks/app-context";
import Button from "../../../components/Button";
import TextField from "../../../components/TextField";
import { SERVER_URL } from "..";

const Implementation = () => {
  const {
    updateIsLoading,
    plan,
    currentTask,
    currentIteration,
    updateCurrentIteration,
    currentPrototype,
    iterations,
    updateIterations,
  } = useAppContext();
  const [code, setCode] = useState("");
  const [updatedCode, setUpdatedCode] = useState(false);
  const [problemDescription, setProblemDescription] = useState(undefined);
  const [tab, setTab] = useState<"ui" | "code">("code");
  const [clickedDeleteIteration, setClickedDeleteIteration] = useState(false);

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
      url: `${SERVER_URL}/save_code_per_step`,
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
      url: `${SERVER_URL}/get_code_per_step`,
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

  const getCodeForIteration = (iteration: number) => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: `${SERVER_URL}/get_code_per_step_per_iteration`,
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
      url: `${SERVER_URL}/generate_code`,
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

  const iterateCode = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: `${SERVER_URL}/iterate_code`,
      data: {
        task_id: currentTask.taskId,
        problem: problemDescription,
      },
    })
      .then((response) => {
        console.log("/iterate_code request successful:", response.data);
        setProblemDescription("");
        updateCurrentIteration(response.data.current_iteration);
      })
      .catch((error) => {
        console.error("Error calling /iterate_code request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const deleteCodeForIteration = (iteration: number) => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: `${SERVER_URL}/delete_code_per_step_per_iteration`,
      data: {
        task_id: currentTask.taskId,
        iteration: iteration,
      },
    })
      .then((response) => {
        console.log(
          "/delete_code_per_step_per_iteration request successful:",
          response.data,
        );
        setClickedDeleteIteration(!clickedDeleteIteration);
        getIterations();
      })
      .catch((error) => {
        console.error(
          "Error calling /delete_code_per_step_per_iteration request:",
          error,
        );
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const getIterations = () => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: `${SERVER_URL}/get_iteration_map_per_step`,
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
          console.log(response.data.iterations);
          updateIterations(response.data.iterations);
        } else {
          updateIterations(undefined);
        }
      })
      .catch((error) => {
        console.error(
          "Error calling /get_iteration_map_per_step request:",
          error,
        );
        updateIterations(undefined);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  useEffect(() => {
    if (currentTask === undefined) return;
    getIterations();
  }, [currentIteration, currentTask]);

  useEffect(() => {
    if (currentTask === undefined || !currentPrototype) return;
    getCode();
    getCodeForIteration(currentIteration);
    setProblemDescription("");
  }, [plan, currentTask, currentIteration, currentPrototype]);

  useEffect(() => {
    if (code && tab == "ui") {
      renderUI();
    }
  }, [code, tab]);

  if (!currentPrototype) return <></>;
  return (
    <Stack spacing="10px" width="100%">
      {/* <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            fontFamily: "monospace",
          }}
        >
          Implementation
        </Typography> */}
      <Stack spacing="10px" sx={{ width: "100%" }}>
        {/* <Typography
                        variant="body1"
                        sx={{
                          fontWeight: "bold",
                          alignSelf: "center",
                          fontFamily: "monospace",
                        }}
                      >
                        Iterate
                      </Typography> */}
        <Button
          onClick={generateCode}
          sx={{
            width: "100%",
          }}
        >
          {code ? "Regenerate Code" : "Generate Code"}
        </Button>
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
      {iterations && (
        <Stack spacing="10px">
          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold",
              alignSelf: "center",
              // fontFamily: "monospace",
            }}
          >
            Iteration Versions
          </Typography>
          {iterations && (
            <>
              <Button
                onClick={() => {
                  updateCurrentIteration(0);
                }}
              >
                Revert to Original
              </Button>
              {Object.keys(iterations).map((key) => (
                <Stack direction="row" spacing="5px">
                  <Card
                    sx={{
                      padding: "10px",
                      width: "90%",
                      backgroundColor:
                        +key === currentIteration
                          ? "rgba(154, 78, 78, 0.5)"
                          : "transparent",
                    }}
                  >
                    <Typography variant="body2">{iterations[key]}</Typography>
                  </Card>
                  <Button
                    onClick={() => {
                      updateCurrentIteration(+key);
                    }}
                  >
                    Set
                  </Button>
                  <Button
                    onClick={() => {
                      deleteCodeForIteration(+key);
                    }}
                  >
                    Delete
                  </Button>
                </Stack>
              ))}
            </>
          )}
        </Stack>
      )}

      <Tabs
        value={tab}
        onChange={(event, newValue) => setTab(newValue)}
        aria-label="tabs"
        sx={{
          "& .MuiTabs-indicator": {
            backgroundColor: "#9a4e4e",
            height: "4px",
          },
        }}
      >
        <Tab
          value="code"
          label="Code"
          sx={{
            "&.Mui-selected": {
              color: "#9a4e4e",
            },
          }}
        />
        <Tab
          value="ui"
          label="UI"
          sx={{
            "&.Mui-selected": {
              color: "#9a4e4e",
            },
          }}
        />
      </Tabs>
      {tab === "ui" &&
        (code ? (
          <Paper
            id="output"
            className="output"
            sx={{ height: code ? "1200px" : "0px" }}
          />
        ) : (
          <Typography variant="body1">
            No code available to render UI.
          </Typography>
        ))}
      {tab === "code" && code && (
        <Stack spacing="10px">
          <TextField
            className={"code"}
            rows={100}
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
      )}
    </Stack>
  );
};

export default Implementation;
