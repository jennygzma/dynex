import { Paper, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "../hooks/app-context";
import Button from "../../../components/Button";
import TextField from "../../../components/TextField";
import Box from "../../../components/Box";

const Implementation = () => {
  const {
    updateIsLoading,
    plan,
    designHypothesis,
    currentTask,
    currentIteration,
    updateCurrentIteration,
    currentTheoryAndParadigm,
  } = useAppContext();
  const [code, setCode] = useState("");
  const [updatedCode, setUpdatedCode] = useState(false);
  const [problemDescription, setProblemDescription] = useState(undefined);
  const [clickedRender, setClickedRender] = useState(false);

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

  useEffect(() => {
    if (currentTask === undefined || !currentTheoryAndParadigm) return;
    getCode();
    getCodeForIteration(currentIteration);
    setProblemDescription("");
    setClickedRender(false);
  }, [
    plan,
    designHypothesis,
    currentTask,
    currentIteration,
    currentTheoryAndParadigm,
  ]);

  if (!currentTheoryAndParadigm) return <></>;
  return (
    <Box sx={{ width: "60%" }}>
      <Stack spacing="10px">
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
                  width: "100%",
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
                renderUI();
                setClickedRender(true);
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
                sx={{ height: clickedRender ? "1200px" : "0px" }}
              />
            </Box>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default Implementation;
