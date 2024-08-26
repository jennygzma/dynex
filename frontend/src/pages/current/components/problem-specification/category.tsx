import { Badge, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "../../../../components/Box";
import TextField from "../../../../components/TextField";
import Button from "../../../../components/Button";
import InputWithButton from "../../../../components/InputWithButton";
import { useAppContext } from "../../hooks/app-context";
import { CategoryType, useMatrixContext } from "../../hooks/matrix-context";
import Chip from "../../../../components/Chip";

interface CategoryProps {
  category: CategoryType;
  description: string;
}

interface Specification {
  question: string;
  brainstorm: string[];
  answer: string;
}

const mapQuestionsToSpecifications = (
  questions: Array<string>,
): Array<Specification> =>
  questions.map((question) => ({
    question: question,
    brainstorm: [],
    answer: "",
  }));

const Category = ({ description, category }: CategoryProps) => {
  const { updateIsLoading, currentPrototype } = useAppContext();
  const { submittedProblem, updateUpdatedMatrix } = useMatrixContext();
  const [input, setInput] = useState("");
  const [needsSpecification, setNeedsSpecification] = useState(false);
  const [brainstorms, setBrainstorms] = useState([]);
  // const [specifications, setSpecifications] = useState([]);
  const [question, setQuestion] = useState("");
  const [iteration, setIteration] = useState("");
  const isGrounding = category.includes("Grounding");
  const [versions, setVersions] = useState([]);

  // const updateSpecificationBrainstorm = (
  //   index: number,
  //   brainstorm: string[],
  // ) => {
  //   const updatedSpecifications = specifications.map((spec, i) =>
  //     i === index ? { ...spec, brainstorm: brainstorm } : spec,
  //   );
  //   console.log("hi jneny updatedSpecifications", {
  //     brainstorm,
  //     updatedSpecifications,
  //   });
  //   setSpecifications(updatedSpecifications);
  // };

  // const updateSpecificationAnswer = (index: number, answer: string) => {
  //   const updatedSpecifications = specifications.map((spec, i) =>
  //     i === index ? { ...spec, answer: answer } : spec,
  //   );
  //   setSpecifications(updatedSpecifications);
  // };

  const getNeedsSpecification = () => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: "/get_needs_specification",
      params: {
        category: category,
      },
    })
      .then((response) => {
        console.log(
          "/get_needs_specification request successful:",
          response.data,
        );
        setNeedsSpecification(response.data.needs_specification);
      })
      .catch((error) => {
        console.error("Error calling /get_needs_specification request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const getInput = () => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: "/get_input",
      params: {
        category: category,
      },
    })
      .then((response) => {
        console.log("/get_input request successful:", response.data);
        setInput(response.data.input);
      })
      .catch((error) => {
        console.error("Error calling /get_input request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const updateInput = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/update_input",
      data: {
        category: category,
        input: input,
      },
    })
      .then((response) => {
        console.log("/update_input request successful:", response.data);
        getInput();
        getNeedsSpecification();
      })
      .catch((error) => {
        console.error("Error calling /update_input request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const brainstormInputs = () => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: "/brainstorm_inputs",
      params: {
        category: category,
        iteration: iteration,
        brainstorms: brainstorms,
      },
    })
      .then((response) => {
        console.log("/brainstorm_inputs request successful:", response.data);
        if (isGrounding) {
          setInput(response.data.brainstorms);
        } else {
          setBrainstorms([...brainstorms, ...response.data.brainstorms]);
        }
      })
      .catch((error) => {
        console.error("Error calling /brainstorm_inputs request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  // const getQuestion = () => {
  //   updateIsLoading(true);
  //   axios({
  //     method: "GET",
  //     url: "/get_question",
  //     params: {
  //       category: category,
  //     },
  //   })
  //     .then((response) => {
  //       console.log("/get_question request successful:", response.data);
  //       // setSpecifications(
  //       //   mapQuestionsToSpecifications(response.data.questions),
  //       // );
  //       setQuestion(response.data.question);
  //     })
  //     .catch((error) => {
  //       console.error("Error calling /get_questions request:", error);
  //     })
  //     .finally(() => {
  //       updateIsLoading(false);
  //     });
  // };

  // const getBrainstorms = (question: string, index: number) => {
  //   updateIsLoading(true);
  //   axios({
  //     method: "GET",
  //     url: "/get_brainstorms",
  //     params: {
  //       category: category,
  //       question: question,
  //     },
  //   })
  //     .then((response) => {
  //       console.log("/get_brainstorms request successful:", response.data);
  //       updateSpecificationBrainstorm(index, response.data.brainstorms);
  //     })
  //     .catch((error) => {
  //       console.error("Error calling /get_brainstorms request:", error);
  //     })
  //     .finally(() => {
  //       updateIsLoading(false);
  //     });
  // };

  //   const updateSpecifications = () => {
  //     updateIsLoading(true);
  //     axios({
  //       method: "POST",
  //       url: "/update_specifications",
  //       data: {
  //         category: category,
  //         specifications: specifications,
  //       },
  //     })
  //       .then((response) => {
  //         console.log(
  //           "/update_specifications request successful:",
  //           response.data,
  //         );
  //         getInput();
  //         getNeedsSpecification();
  //       })
  //       .catch((error) => {
  //         console.error("Error calling /update_specifications request:", error);
  //       })
  //       .finally(() => {
  //         updateIsLoading(false);
  //       });
  //   };

  useEffect(() => {
    getInput();
    getNeedsSpecification();
  }, [submittedProblem]);

  useEffect(() => {
    setBrainstorms([]);
    getInput();
  }, [currentPrototype]);

  return (
    <Box border={5} sx={{ padding: "10px", maxWidth: "600px" }}>
      <Stack spacing="10px">
        {needsSpecification && (
          <Badge
            badgeContent={"Needs Specification"}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            color="primary"
            sx={{
              top: 8,
              right: 70,
              "& .MuiBadge-badge": {
                backgroundColor: "lightblue",
                color: "white",
                fontWeight: "bold",
                fontFamily: "monospace",
              },
            }}
          />
        )}
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: "bold",
            alignSelf: "center",
            fontFamily: "monospace",
          }}
        >
          {category}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            alignSelf: "center",
            fontFamily: "monospace",
          }}
        >
          {description}
        </Typography>
        <Button
          onClick={brainstormInputs}
          sx={{
            width: "100%",
          }}
        >
          Brainstorm
        </Button>
        {brainstorms.length > 0 || input ? (
          <Stack direction="row" spacing="5px">
            <TextField
              label="Iterate"
              className={"Iterate"}
              rows={2}
              value={iteration}
              onChange={(e) => {
                setIteration(e.target.value);
              }}
            />
            <Button
              onClick={brainstormInputs}
              sx={{
                width: "20%",
              }}
            >
              Update
            </Button>
          </Stack>
        ) : (
          <></>
        )}
        {brainstorms?.map((brainstorm) => {
          return (
            <Chip
              key={brainstorm}
              label={brainstorm}
              onClick={() => {
                setInput(brainstorm);
              }}
              clickable
              selected={brainstorm === input}
              sx={{
                alignSelf: "center",
              }}
            />
          );
        })}
        <InputWithButton
          label="Input"
          input={input}
          setInput={setInput}
          onClick={() => {
            updateInput();
            updateUpdatedMatrix(true);
          }}
          direction="column"
          rows={category.includes("Idea") ? 1 : 8}
        />
        {isGrounding && (
          <Stack spacing="5px">
            <Button onClick={() => setVersions([...versions, input])}>
              Save Version
            </Button>
            {versions?.map((version) => (
              <Chip
                key={version}
                label={version}
                onClick={() => {
                  setInput(version);
                }}
                clickable
                selected={version === input}
                sx={{
                  alignSelf: "center",
                }}
              />
            ))}
          </Stack>
        )}
        {/* <Button
          onClick={getQuestions}
          disabled={!needsSpecification}
          sx={{
            width: "100%",
          }}
        >
          Specify
        </Button>
        {specifications?.map(({ question, brainstorm, answer }, index) => {
          return (
            <Stack key={index} spacing="5px">
              <Stack direction="row" spacing="5px">
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "bold",
                    fontFamily: "monospace",
                  }}
                >
                  {question}
                </Typography>{" "}
                <Button onClick={() => getBrainstorms(question, index)}>
                  💡
                </Button>
              </Stack>
              {brainstorm?.map((b) => {
                <Chip
                  key={b}
                  label={b}
                  onClick={() => {
                    updateSpecificationAnswer(index, b);
                  }}
                  clickable
                  selected={b === answer}
                />;
              })}
              <TextField
                className={`${index}-answer`}
                label="Answer"
                value={answer}
                rows={1}
                onChange={(e) => {
                  updateSpecificationAnswer(index, e.target.value);
                }}
              ></TextField>
            </Stack>
          );
        })}
        <Button
          onClick={updateSpecifications}
          disabled={!needsSpecification}
          sx={{
            width: "100%",
          }}
        >
          Update Specifications
        </Button> */}
      </Stack>
    </Box>
  );
};

export default Category;
