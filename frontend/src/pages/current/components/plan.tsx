import React, { useEffect, useState } from "react";
import { usePlanContext } from "../hooks/plan-context";
import axios from "axios";
import { Card, CardActionArea, Stack, Typography } from "@mui/material";
import Button from "../../../components/Button";
import TextField from "../../../components/TextField";
import Box from "../../../components/Box";

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
    getStep();
  }, [currentTask]);
  const [updatedPlan, setUpdatedPlan] = useState(false);
  const [jsonPlan, setJsonPlan] = useState(undefined);
  const [newTaskDescription, setNewTaskDescription] = useState(undefined);
  const [updatedNewTaskDescription, setUpdatedNewTaskDescription] =
    useState(false);
  const [clickedAddStep, setClickedAddStep] = useState(false);
  const [addStepNewTaskDescription, setAddStepNewTaskDescription] =
    useState(undefined);

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

  const getStep = () => {
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

  const updateStep = () => {
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
        getStep();
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

  const addStep = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/add_step_in_plan",
      data: {
        current_task_id: currentTask.taskId,
        new_task_description: addStepNewTaskDescription,
      },
    })
      .then((response) => {
        console.log("/add_step_in_plan request successful:", response.data);
        getPlan();
        setClickedAddStep(false);
        setAddStepNewTaskDescription(undefined);
      })
      .catch((error) => {
        console.error("Error calling /add_step_in_plan request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const removeStep = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/remove_step_in_plan",
      data: {
        task_id: currentTask.taskId,
      },
    })
      .then((response) => {
        console.log("/remove_step_in_plan request successful:", response.data);
        getPlan();
      })
      .catch((error) => {
        console.error("Error calling /remove_step_in_plan request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  if (!designHypothesis) return <></>;
  return (
    <Box>
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
          onClick={generatePlan}
          sx={{
            width: "100%",
          }}
        >
          {plan ? "Regenerate Plan" : "Create Plan"}
        </Button>
        <Stack sx={{ width: "100%" }} spacing={"10px"}>
          <TextField
            className={"generated-plan"}
            label="Plan"
            rows={10}
            value={jsonPlan}
            onChange={(e) => {
              setUpdatedPlan(true);
              setJsonPlan(e.target.value);
            }}
            code={true}
          />
          <Button
            disabled={!updatedPlan}
            onClick={savePlan}
            sx={{
              width: "100%",
            }}
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
                        fontSize: "20px",
                        lineHeight: "30px",
                        backgroundColor:
                          currentTask?.taskId === task.taskId
                            ? "lightblue"
                            : "transparent",
                      }}
                    >
                      <CardActionArea
                        onClick={() => updateCurrentTask(task)}
                        sx={{ padding: "15px" }}
                      >
                        <Typography>
                          {`${task.taskId}) ${task.task}`}
                        </Typography>
                      </CardActionArea>
                      {currentTask?.taskId === task.taskId && (
                        <Stack spacing="10px" padding="15px">
                          <Stack direction="row" spacing="10px">
                            <TextField
                              className={"generated-plan"}
                              label="Update Step"
                              value={newTaskDescription}
                              onChange={(e) => {
                                setUpdatedNewTaskDescription(true);
                                setNewTaskDescription(e.target.value);
                              }}
                            />
                            <Button
                              disabled={!updatedNewTaskDescription}
                              onClick={updateStep}
                            >
                              Update Step
                            </Button>
                          </Stack>
                          <Stack direction="row" spacing="10px">
                            <Button onClick={() => setClickedAddStep(true)}>
                              Add Task Beneath
                            </Button>
                            <Button onClick={removeStep}>Remove Task</Button>
                          </Stack>
                        </Stack>
                      )}
                    </Card>
                    {clickedAddStep && currentTask?.taskId === task.taskId && (
                      <Stack direction="row" spacing="10px">
                        <TextField
                          className={"add-step-to-plan"}
                          label="Add Step"
                          value={addStepNewTaskDescription}
                          onChange={(e) => {
                            setAddStepNewTaskDescription(e.target.value);
                          }}
                        />
                        <Button
                          disabled={!addStepNewTaskDescription}
                          onClick={addStep}
                        >
                          Add Step
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
