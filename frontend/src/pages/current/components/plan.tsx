import React, { useEffect, useState } from "react";
import { usePlanContext } from "../hooks/plan-context";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const mapPlan = (jsonPlan) => {
  return jsonPlan.map((step) => {
    return {
      taskId: step.task_id,
      task: step.task,
    };
  });
};

const Plan = () => {
  const {
    updateIsLoading,
    plan,
    updatePlan,
    currentTask,
    updateCurrentTask,
    designHypothesis,
  } = usePlanContext();
  useEffect(() => {
    getPlan();
  }, []);
  useEffect(() => {}, [plan, designHypothesis]);
  useEffect(() => {
    if (currentTask === undefined) return;
    setUpdatedNewTaskDescription(false);
    getStepInPlan();
  }, [currentTask]);
  const [updatedPlan, setUpdatedPlan] = useState(false);
  const [jsonPlan, setJsonPlan] = useState(undefined);
  const [newTaskDescription, setNewTaskDescription] = useState(undefined);
  const [updatedNewTaskDescription, setUpdatedNewTaskDescription] =
    useState(false);

  const generatePlan = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/generate_plan",
    })
      .then((response) => {
        console.log("/generate_plan request successful:", response.data);
        getPlan();
      })
      .catch((error) => {
        console.error("Error calling /generate_plan request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const getPlan = () => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: "/get_plan",
    })
      .then((response) => {
        console.log("/get_plan request successful:", response.data);
        const responsePlan = JSON.parse(response.data.plan);
        const stringifiedPlan = response.data.plan;
        setJsonPlan(stringifiedPlan);
        updatePlan(mapPlan(responsePlan));
      })
      .catch((error) => {
        console.error("Error calling /get_plan request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const savePlan = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/save_plan",
      data: {
        plan: jsonPlan,
      },
    })
      .then((response) => {
        console.log("/save_plan request successful:", response.data);
        getPlan();
        updateCurrentTask(undefined);
        setUpdatedPlan(false);
      })
      .catch((error) => {
        console.error("Error calling /save_plan request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const getStepInPlan = () => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: "/get_step_in_plan",
      params: {
        task_id: currentTask.taskId,
      },
    })
      .then((response) => {
        console.log("/get_step_in_plan request successful:", response.data);
        const newTaskDescription = response.data.task_description;
        setNewTaskDescription(newTaskDescription);
      })
      .catch((error) => {
        console.error("Error calling /get_step_in_plan request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const updateStepInPlan = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/update_step_in_plan",
      data: {
        task_id: currentTask.taskId,
        task_description: newTaskDescription,
      },
    })
      .then((response) => {
        console.log("/update_step_in_plan request successful:", response.data);
        getStepInPlan();
        getPlan();
        setUpdatedNewTaskDescription(false);
      })
      .catch((error) => {
        console.error("Error calling /update_step_in_plan request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  if (!designHypothesis) return <></>;
  return (
    <Box
      sx={{
        padding: "10px",
        border: 10,
        borderColor: "#9a4e4e",
        backgroundColor: "white",
      }}
    >
      <Stack spacing="10px">
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            alignSelf: "center",
            fontFamily: "monospace",
          }}
        >
          Planning
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={generatePlan}
          sx={{ width: "100%" }}
        >
          {plan ? "Regenerate Plan" : "Create Plan"}
        </Button>
        <Stack sx={{ width: "100%" }} spacing={"10px"}>
          <TextField
            className={"generated-plan"}
            label="Plan"
            variant="outlined"
            multiline
            rows={10}
            value={jsonPlan}
            onChange={(e) => {
              setUpdatedPlan(true);
              setJsonPlan(e.target.value);
            }}
            inputProps={{ style: { fontFamily: "monospace" } }}
          />
          <Button
            variant="contained"
            color="primary"
            disabled={!updatedPlan}
            onClick={savePlan}
            sx={{ width: "100%" }}
          >
            Update Plan
          </Button>
        </Stack>
        {plan && (
          <Stack direction="row" spacing="10px">
            <Stack sx={{ width: "100%" }}>
              {plan.map((task) => {
                return (
                  <Stack spacing="10px">
                    <Card
                      key={task.taskId}
                      sx={{
                        padding: "40px",
                        fontSize: "20px",
                        lineHeight: "30px",
                        backgroundColor:
                          currentTask?.taskId === task.taskId
                            ? "lightblue"
                            : "transparent",
                      }}
                    >
                      <CardActionArea onClick={() => updateCurrentTask(task)}>
                        {`${task.taskId}) ${task.task}`}
                      </CardActionArea>
                    </Card>
                    {currentTask?.taskId === task.taskId && (
                      <Stack sx={{ width: "100%" }} spacing={"10px"}>
                        <TextField
                          className={"generated-plan"}
                          label="Plan"
                          variant="outlined"
                          multiline
                          rows={2}
                          value={newTaskDescription}
                          onChange={(e) => {
                            setUpdatedNewTaskDescription(true);
                            setNewTaskDescription(e.target.value);
                          }}
                          inputProps={{ style: { fontFamily: "monospace" } }}
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          disabled={!updatedNewTaskDescription}
                          onClick={updateStepInPlan}
                          sx={{ width: "100%" }}
                        >
                          {"Update Step"}
                        </Button>
                      </Stack>
                    )}
                  </Stack>
                );
              })}
            </Stack>
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default Plan;
