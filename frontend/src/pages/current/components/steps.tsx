import React, { useEffect, useState } from "react";
import { useAppContext } from "../hooks/app-context";
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
      hasCode: false,
    };
  });
};

const Steps = () => {
  const {
    updateIsLoading,
    plan,
    updatePlan,
    currentTask,
    iterations,
    updateIterations,
    currentIteration,
    updateCurrentIteration,
    updateCurrentTask,
    spec,
    currentPrototype,
  } = useAppContext();
  const [newTaskDescription, setNewTaskDescription] = useState(undefined);
  const [updatedNewTaskDescription, setUpdatedNewTaskDescription] =
    useState(false);
  const [clickedAddStep, setClickedAddStep] = useState(false);
  const [addStepNewTaskDescription, setAddStepNewTaskDescription] =
    useState(undefined);
  // const [testCases, setTestCases] = useState(undefined);
  const [clickedDeleteIteration, setClickedDeleteIteration] = useState(false);

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
        updatePlan(mapPlan(responsePlan));
      })
      .catch((error) => {
        console.error("Error calling /get_plan request:", error);
        updatePlan([]);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const getFirstTaskIdWithoutCode = () => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: "/get_first_task_id_without_code",
    })
      .then((response) => {
        console.log(
          "/get_first_task_id_without_code request successful:",
          response.data,
        );
        const taskId = response.data.task_id;
        if (plan) updateCurrentTask(plan[taskId - 1]);
      })
      .catch((error) => {
        console.error(
          "Error calling /get_first_task_id_without_code request:",
          error,
        );
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

  const deleteCodeForIteration = (iteration: number) => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/delete_code_per_step_per_iteration",
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

  // const getTestCases = () => {
  //   updateIsLoading(true);
  //   axios({
  //     method: "GET",
  //     url: "/get_test_cases_per_lock_step",
  //     params: {
  //       task_id: currentTask.taskId,
  //     },
  //   })
  //     .then((response) => {
  //       console.log(
  //         "/get_test_cases_per_lock_step request successful:",
  //         response.data,
  //       );
  //       setTestCases(response.data.test_cases);
  //     })
  //     .catch((error) => {
  //       console.error(
  //         "Error calling /get_test_cases_per_lock_step request:",
  //         error,
  //       );
  //     })
  //     .finally(() => {
  //       updateIsLoading(false);
  //     });
  // };

  useEffect(() => {
    getPlan();
    updateCurrentIteration(0);
  }, [currentPrototype]);
  useEffect(() => {
    getFirstTaskIdWithoutCode();
  }, [plan]);

  useEffect(() => {
    if (currentTask === undefined) return;
    setUpdatedNewTaskDescription(false);
    setNewTaskDescription(currentTask.task);
    // setTestCases(undefined);
    getIterations();
    updateCurrentIteration(0);
  }, [currentTask]);

  useEffect(() => {
    if (currentTask === undefined) return;
    getIterations();
  }, [currentIteration, currentTask]);

  if (!spec) return <></>;

  return (
    <Box sx={{ width: "90%" }}>
      <Stack spacing="10px">
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            alignSelf: "center",
            fontFamily: "monospace",
          }}
        >
          Steps
        </Typography>
        <Button
          onClick={generatePlan}
          sx={{
            width: "100%",
          }}
        >
          {plan?.length !== 0 ? "Regenerate Plan" : "Create Plan"}
        </Button>
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
        {/* <Box
          border={5}
          sx={{
            justifyContent: "center",
            alignItems: "center",
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
              Brainstorm Test Cases
            </Typography>
            <Stack spacing="10px">
              <Button onClick={getTestCases} sx={{ width: "100%" }}>
                Get Test Cases
              </Button>
              {testCases &&
                testCases.map((testCase, index) => (
                  <Typography variant="body2" key={index}>
                    {testCase}
                  </Typography>
                ))}
            </Stack>
          </Stack>
        </Box> */}
        <Box
          border={5}
          sx={{
            justifyContent: "center",
            alignItems: "center",
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
              Iterate
            </Typography>
            {iterations && (
              <Button
                onClick={() => {
                  updateCurrentIteration(0);
                }}
              >
                Revert to Original
              </Button>
            )}
            {iterations &&
              Object.keys(iterations).map((key) => (
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
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default Steps;
