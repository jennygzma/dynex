import React, { useEffect, useState } from "react";
import { usePlanContext } from "../hooks/plan-context";
import axios from "axios";
import { Button, Card } from "@mui/material";

const Plan = () => {
    const {plan, updatePlan} = usePlanContext();
    useEffect(()=> {
    }, [plan]);

    const generatePlan = () => {
        axios({
          method: "POST",
          url: "/generate_plan",
        })
          .then((response) => {
            console.log("/generate_plan request successful:", response.data);
            const responsePlan = JSON.parse(response.data.plan);
            const mappedPlan = responsePlan.map((step)=> {
                return {
                    taskId: step.task_id,
                    task: step.task
                }
            });
            updatePlan(mappedPlan);
          })
          .catch((error) => {
            console.error("Error calling /generate_plan request:", error);
          });
      };
    return (
        <div>
            <Button
                variant="contained"
                color="primary"
                onClick={generatePlan}
                sx={{ width: "100%" }}
            >
                Create Plan
            </Button>
            {plan && plan.map((task) => (
                <Card key={task.taskId} sx={{ padding: "40px", fontSize: "20px", lineHeight: "30px" }}>
                    {`${task.taskId}) ${task.task}`}
                </Card>))}
    </div>)
}

export default Plan;