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

const Plan = () => {
  const { plan, updatePlan, currentTask, updateCurrentTask, designHypothesis } =
    usePlanContext();
  useEffect(() => {}, [plan, designHypothesis]);

  const [jsonPlan, setJsonPlan] = useState(undefined);
  const generatePlan = () => {
    axios({
      method: "POST",
      url: "/generate_plan",
    })
      .then((response) => {
        console.log("/generate_plan request successful:", response.data);
        const responsePlan = JSON.parse(response.data.plan);
        setJsonPlan(`${responsePlan}`);
        const mappedPlan = responsePlan.map((step) => {
          return {
            taskId: step.task_id,
            task: step.task,
          };
        });
        updatePlan(mappedPlan);
        updateCurrentTask(undefined);
      })
      .catch((error) => {
        console.error("Error calling /generate_plan request:", error);
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
        {plan && (
          <Stack direction="row" spacing="10px">
            <Stack sx={{ width: "100%" }}>
              {plan.map((task) => {
                return (
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
                );
              })}
            </Stack>
            <Stack sx={{ width: "100%" }} spacing={"10px"}>
              <TextField
                className={"generated-plan"}
                label="Plan"
                variant="outlined"
                multiline
                rows={13}
                value={jsonPlan}
                onChange={(e) => {
                  setJsonPlan(e.target.value);
                }}
                inputProps={{ style: { fontFamily: "monospace" } }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={generatePlan}
                sx={{ width: "100%" }}
              >
                Update Plan
              </Button>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default Plan;
