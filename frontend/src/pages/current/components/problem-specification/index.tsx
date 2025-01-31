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
import InputWithButton from "../../../../components/InputWithButton";
import { useAppContext } from "../../hooks/app-context";
import Category from "./category";
import { CategoryType, useMatrixContext } from "../../hooks/matrix-context";
import { SERVER_URL } from "../..";

const MATRIX_CATEGORY_DESCRIPTIONS: Record<CategoryType, string> = {
  PersonXIdea: "Who is the application for?",
  PersonXGrounding:
    "What is the users goal? What are problems with existing approaches?",
  ApproachXIdea:
    "What is the concept, theory, or strategy that guides the solution?",
  ApproachXGrounding: "How do we translate this approach to reality?",
  InteractionXIdea: "What is the core interaction paradigm?",
  InteractionXGrounding: "What are the core features for this interaction?",
};

const getDependencies = (
  category: CategoryType | undefined,
  matrixCategoryInfo: Record<CategoryType, string>,
): CategoryType[] => {
  let dependencies = [];
  if (category === undefined) return dependencies;
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
  const {
    currentPrototype,
    updateCurrentPrototype,
    updateIsLoading,
    updatePrototypes,
  } = useAppContext();
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
      url: `${SERVER_URL}/get_problem`,
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
      url: `${SERVER_URL}/get_prototype_name`,
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
      url: `${SERVER_URL}/save_problem`,
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
      url: `${SERVER_URL}/explore_prototype`,
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
      url: `${SERVER_URL}/get_prototypes`,
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
    <Stack
      spacing="10px"
      sx={{
        paddingY: "120px",
        paddingX: "40px",
      }}
    >
      {/* <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            alignSelf: "center",
            fontFamily: "monospace",
          }}
        >
          Problem Specification
        </Typography> */}
      {/* <Stack
          direction="row"
          spacing="10px"
          sx={{
            alignItems: "flex-start",
            alignContent: "flex-end",
            justifyContent: "flex-start",
          }}
        >
          <img
            src={require("../../../../assets/franky-icon.ico")}
            alt="franky"
            width="50x"
          />
          <Typography
            variant="h4"
            sx={{
              // alignSelf: "center",
              color: "#9a4e4e",
              fontWeight: "bold",
              fontFamily: "Courier New",
            }}
          >
            dynex
          </Typography>
        </Stack> */}
      <InputWithButton
        className="problem"
        label="Problem"
        input={problem}
        setInput={setProblem}
        onClick={saveProblem}
      />
      {submittedProblem && (
        <>
          <TableContainer sx={{ backgroundColor: "white" }}>
            <Table
              sx={{
                borderCollapse: "collapse",
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ width: "7%", borderBottom: "none" }}
                  ></TableCell>
                  <TableCell
                    sx={{
                      width: "31%",
                      borderBottom: "none",
                      verticalAlign: "bottom",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        //fontFamily: "monospace",
                      }}
                    >
                      PERSON
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "31%",
                      borderBottom: "none",
                      verticalAlign: "bottom",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        // fontFamily: "monospace",
                      }}
                    >
                      APPROACH
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "31%",
                      borderBottom: "none",
                      verticalAlign: "bottom",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        // fontFamily: "monospace",
                      }}
                    >
                      INTERACTION
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell
                    align="right"
                    sx={{
                      borderBottom: "none",
                      verticalAlign: "top",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        // fontFamily: "monospace",
                      }}
                    >
                      IDEA
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      borderBottom: "none",
                      verticalAlign: "top",
                    }}
                  >
                    <Category
                      category={"PersonXIdea"}
                      description={MATRIX_CATEGORY_DESCRIPTIONS["PersonXIdea"]}
                      isDependency={dependencies?.includes("PersonXIdea")}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      borderBottom: "none",
                      verticalAlign: "top",
                    }}
                  >
                    <Category
                      category={"ApproachXIdea"}
                      description={
                        MATRIX_CATEGORY_DESCRIPTIONS["ApproachXIdea"]
                      }
                      isDependency={dependencies?.includes("ApproachXIdea")}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      borderBottom: "none",
                      verticalAlign: "top",
                    }}
                  >
                    <Category
                      category={"InteractionXIdea"}
                      description={
                        MATRIX_CATEGORY_DESCRIPTIONS["InteractionXIdea"]
                      }
                      isDependency={dependencies?.includes("InteractionXIdea")}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    align="right"
                    sx={{
                      borderBottom: "none",
                      verticalAlign: "top",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        // fontFamily: "monospace",
                      }}
                    >
                      GROUNDING
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      borderBottom: "none",
                      verticalAlign: "top",
                    }}
                  >
                    <Category
                      category="PersonXGrounding"
                      description={
                        MATRIX_CATEGORY_DESCRIPTIONS["PersonXGrounding"]
                      }
                      isDependency={dependencies?.includes("PersonXGrounding")}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      borderBottom: "none",
                      verticalAlign: "top",
                    }}
                  >
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
                  <TableCell
                    sx={{
                      borderBottom: "none",
                      verticalAlign: "top",
                    }}
                  >
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
              updateCurrentPrototype(prototypeName);
            }}
            onChange={() => {
              updateCurrentCategory(undefined);
            }}
            direction="row"
            buttonName="Explore Prototype"
            disabled={!updatedMatrix}
          />
        </>
      )}
    </Stack>
  );
};

export default ProjectSpecification;
