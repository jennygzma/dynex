import {
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
import InputWithButton from "../../../../components/InputWithButton";
import { useAppContext } from "../../hooks/app-context";
import Category from "./category";
import { CategoryType, useMatrixContext } from "../../hooks/matrix-context";

const MATRIX_CATEGORY_DESCRIPTIONS: Record<CategoryType, string> = {
  PersonXIdea:
    "This identifies who the application is for. It defines the target user group or demographic.",
  PersonXGrounding:
    "Here, we dig deeper into understanding the underlying challenges, realities, or constraints that the individual faces in trying to achieve their goal. This represents the contextual factors or pain points that shape their experience.",
  ApproachXIdea:
    "Here, we think about how the conceptual strategy, theory, or logical framework that guides the solution or system design. This reflects the abstract approach or methodology used to address the user’s goal.",
  ApproachXGrounding:
    "Here, we focus on the specific, practical considerations or decisions that translate the abstract strategy into actionable features or processes, taking into account the user's needs and the context.",
  InteractionXIdea:
    "This contemplates the design or pattern of interaction that defines how users engage with the system. This focuses on the conceptual model of the user interface or user experience.",
  InteractionXGrounding:
    "Here, we delve into the specific elements, content, or interaction mechanisms that make the abstract UI paradigm meaningful and effective in the given context.",
};

const getDependencies = (
  category: CategoryType | undefined,
  matrixCategoryInfo: Record<CategoryType, string>,
): CategoryType[] => {
  let dependencies = [];
  if (category == undefined) return dependencies;
  Object.entries(matrixCategoryInfo).forEach(([key, value]) => {
    if (value.length > 0) dependencies.push(key);
  });

  const isIdea = category?.includes("Idea");
  if (isIdea) {
    const col = category.split("X")[0];
    dependencies = dependencies.filter((d) => !d?.includes(col));
  } else {
    dependencies = dependencies.filter((d) => d !== category);
  }
  return dependencies;
};

const ProjectSpecification = () => {
  const { currentPrototype, updateIsLoading, updatePrototypes } =
    useAppContext();
  const {
    submittedProblem,
    updateSubmittedProblem,
    updatedMatrix,
    updateUpdatedMatrix,
    currentCategory,
    matrixCategoryInfo,
    updateCurrentCategory,
  } = useMatrixContext();
  const [problem, setProblem] = useState("");
  const [prototypeName, setPrototypeName] = useState("");
  const [dependencies, setDependencies] = useState([]);

  useEffect(() => {
    setDependencies(getDependencies(currentCategory, matrixCategoryInfo));
  }, [currentCategory]);

  const getProblem = () => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: "/get_problem",
    })
      .then((response) => {
        console.log("/get_problem request successful:", response.data);
        if (response.data.problem) {
          setProblem(response.data.problem);
          updateSubmittedProblem(true);
        }
      })
      .catch((error) => {
        console.error("Error calling /get_problem request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const getPrototypeName = () => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: "/get_prototype_name",
    })
      .then((response) => {
        console.log("/get_prototype_name request successful:", response.data);
        setPrototypeName(response.data.prototype_name);
      })
      .catch((error) => {
        console.error("Error calling /get_prototype_name request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

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
        updateSubmittedProblem(true);
      })
      .catch((error) => {
        console.error("Error calling /save_problem request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const explorePrototype = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/explore_prototype",
      data: {
        prototype: prototypeName,
      },
    })
      .then((response) => {
        console.log("/explore_prototype request successful:", response.data);
        getPrototypes();
      })
      .catch((error) => {
        console.error("Error calling /explore_prototype request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const getPrototypes = () => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: "/get_prototypes",
    })
      .then((response) => {
        console.log("/get_prototypes request successful:", response.data);
        updatePrototypes(response.data.prototypes);
      })
      .catch((error) => {
        console.error("Error calling /get_prototypes request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  useEffect(() => {
    getProblem();
    getPrototypes();
  }, []);

  useEffect(() => {
    getPrototypeName();
  }, [currentPrototype]);

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
        {submittedProblem && (
          <>
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
                        category={"PersonXIdea"}
                        description={
                          MATRIX_CATEGORY_DESCRIPTIONS["PersonXIdea"]
                        }
                        isDependency={dependencies?.includes("PersonXIdea")}
                      />
                    </TableCell>
                    <TableCell>
                      <Category
                        category={"ApproachXIdea"}
                        description={
                          MATRIX_CATEGORY_DESCRIPTIONS["ApproachXIdea"]
                        }
                        isDependency={dependencies?.includes("ApproachXIdea")}
                      />
                    </TableCell>
                    <TableCell>
                      <Category
                        category={"InteractionXIdea"}
                        description={
                          MATRIX_CATEGORY_DESCRIPTIONS["InteractionXIdea"]
                        }
                        isDependency={dependencies?.includes(
                          "InteractionXIdea",
                        )}
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
                        category="PersonXGrounding"
                        description={
                          MATRIX_CATEGORY_DESCRIPTIONS["PersonXGrounding"]
                        }
                        isDependency={dependencies?.includes(
                          "PersonXGrounding",
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Category
                        category="ApproachXGrounding"
                        description={
                          MATRIX_CATEGORY_DESCRIPTIONS["ApproachXGrounding"]
                        }
                        isDependency={dependencies?.includes(
                          "ApproachXGrounding",
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Category
                        category="InteractionXGrounding"
                        description={
                          MATRIX_CATEGORY_DESCRIPTIONS["InteractionXGrounding"]
                        }
                        isDependency={dependencies?.includes(
                          "InteractionXGrounding",
                        )}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <InputWithButton
              className="prototyp-name"
              label="Prototype Name"
              input={prototypeName}
              setInput={setPrototypeName}
              onClick={() => {
                explorePrototype();
                updateUpdatedMatrix(false);
              }}
              onChange={() => {
                updateCurrentCategory(undefined);
              }}
              direction="column"
              buttonName="Explore Prototype"
              disabled={!updatedMatrix}
            />
          </>
        )}
      </Stack>
    </Box>
  );
};

export default ProjectSpecification;
