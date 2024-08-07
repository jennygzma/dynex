import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "../../../../components/Box";
import TextField from "../../../../components/TextField";
import Button from "../../../../components/Button";
import InputWithButton from "../../../../components/InputWithButton";
import { useAppContext } from "../../hooks/app-context";
import Category from "./category";

const matrixCategories: Record<string, string> = {
  PersonXIdea:
    "This identifies who the application is for. It defines the target user group or demographic. Are you designing the app for students, professionals, children, elderly people, people with specific needs or conditions, etc.?",
  PersonXGrounding:
    "Here, we dig deeper into understanding the user's goals and context. Specifically: What does the user aim to achieve with this app? What specific problem does the user have? Why is this problem difficult to solve? Why are existing solutions inadequate? What gaps or shortcomings do they have that your application will address?",
  ApproachXIdea:
    "Here, we think about how we conceptualize the method or strategy to tackle the identified problem. What kind of approach will you use to solve the user's problem? Are you using an algorithm, an existing theory, workflow, or innovative process?",
  ApproachXGrounding:
    "Here, we focus on the tangible details of making the approach feasible and effective for the target users. What are the essential components and features required to implement the approach effectively? How will you bring this approach to life?",
  InteractionXIdea:
    "This contemplates the general design of the user interface. How should the UI look and what interactions should the user have with it? Consider how the design aligns with the users' needs and expectations.",
  InteractionXGrounding:
    "Here, we delve into the specifics of the UI components and user interactions: What general information will be shown in each UI component? What kinds of interactions will the user have with the UI? For example, will there be buttons to click, swipes, drag-and-drop features, form fields?",
};

const ProjectSpecification = () => {
  const [problem, setProblem] = useState("");
  const [name, setName] = useState("");
  const { updateIsLoading } = useAppContext();

  // hi jenny get matrix implement this in backend

  // hi jenny impelment in backend
  const saveProblem = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/save_problem",
      data: {
        problem: problem,
      },
    })
      .then((response) => {
        console.log("/save_problem request successful:", response.data);
      })
      .catch((error) => {
        console.error("Error calling /save_problem request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  // hi jenny impelment in backend
  const checkSpecification = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/save_problem",
      data: {
        problem: problem,
      },
    })
      .then((response) => {
        console.log("/save_problem request successful:", response.data);
      })
      .catch((error) => {
        console.error("Error calling /save_problem request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  // hi jenny impelment in backend
  const saveName = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/save_problem",
      data: {
        problem: problem,
      },
    })
      .then((response) => {
        console.log("/save_problem request successful:", response.data);
      })
      .catch((error) => {
        console.error("Error calling /save_problem request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

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
          Problem Specification
        </Typography>
        <InputWithButton
          className="problem"
          label="Problem"
          input={problem}
          setInput={setProblem}
          onClick={saveProblem}
        />
        <Button
          onClick={checkSpecification}
          sx={{
            width: "100%",
          }}
        >
          Check If More Specification Is Needed
        </Button>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "7%" }}></TableCell>
                <TableCell align="center" sx={{ width: "31%" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      fontFamily: "monospace",
                    }}
                  >
                    Person
                  </Typography>
                </TableCell>
                <TableCell align="center" sx={{ width: "31%" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      fontFamily: "monospace",
                    }}
                  >
                    Approach
                  </Typography>
                </TableCell>
                <TableCell align="center" sx={{ width: "31%" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      fontFamily: "monospace",
                    }}
                  >
                    Interaction
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="right">
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      fontFamily: "monospace",
                    }}
                  >
                    Idea
                  </Typography>
                </TableCell>
                <TableCell>
                  <Category
                    title={"PersonXIdea"}
                    description={matrixCategories["PersonXIdea"]}
                    needsSpecification={true}
                  />
                </TableCell>
                <TableCell>
                  <Category
                    title={"ApproachXIdea"}
                    description={matrixCategories["ApproachXIdea"]}
                    needsSpecification={true}
                  />
                </TableCell>
                <TableCell>
                  <Category
                    title={"InteractionXIdea"}
                    description={matrixCategories["InteractionXIdea"]}
                    needsSpecification={true}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right">
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      fontFamily: "monospace",
                    }}
                  >
                    Grounding
                  </Typography>
                </TableCell>
                <TableCell>
                  <Category
                    title="PersonXGrounding"
                    description={matrixCategories["PersonXGrounding"]}
                    needsSpecification={true}
                  />
                </TableCell>
                <TableCell>
                  <Category
                    title="ApproachXGrounding"
                    description={matrixCategories["ApproachXGrounding"]}
                    needsSpecification={true}
                  />
                </TableCell>
                <TableCell>
                  <Category
                    title="InteractionXGrounding"
                    description={matrixCategories["InteractionXGrounding"]}
                    needsSpecification={true}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <InputWithButton
          className="name"
          label="Name"
          input={name}
          setInput={setName}
          onClick={saveName}
          direction="column"
          buttonName="Save Matrix"
        />
      </Stack>
    </Box>
  );
};

export default ProjectSpecification;
