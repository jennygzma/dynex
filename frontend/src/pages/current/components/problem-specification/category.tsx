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
import { SERVER_URL } from "../..";

interface CategoryProps {
  category: CategoryType;
  description: string;
  isDependency: boolean;
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

const PERSON_IDEA_EXAMPLE = [
  "Non-native speakers interested in Chinese culture",
  "Visual learners struggling with language memorization",
  "Travel enthusiasts planning a trip to China",
  "Retired adult wanting to expand linguistic skills",
  "Busy university student wanting to study Chinese in his free time",
  "Chinese-born American looking to brush up language skills",
];

const APPROACH_IDEA_EXAMPLE = [
  "Pictorial spaced repetition learning",
  "Visual storytelling for language acquisition",
  "Cognitive load theory for efficient memorization",
];

const INTERACTION_IDEA_EXAMPLE = [
  "Simple guess-and-review quiz interface",
  "Visual dictionary flashcard interface",
  "Image-based language learning game interface",
];

const PERSON_GROUNDING_EXAMPLE =
  "- Confusion arises due to unfamiliarity with Chinese characters and their complex structure, slowing the learning process. \n- Difficulty in linking characters to their corresponding meaning or pronunciation, hindering vocabulary acquisition.\n- Traditional memorization methods offer little aid to visual learners who could better recall information through imagery.";
const APPROACH_GROUNDING_EXAMPLE =
  "- Integrate visual aids, such as illustrations or animations, that correlate with each word's meaning to enhance understanding and recall.\n- Develop an algorithm that links related words and images together in a meaningful story, promoting stronger memory associations.\n- Make use of GPT to generate context-rich sentences or mini-stories, helping to create a narrative around each word or character.\n- Ensure design of the learning material caters to visual learners, with a focus on vibrant, engaging, and contextually relevant graphical representations.";
const INTERACTION_GROUNDING_EXAMPLE =
  "- The quiz interface should present the Chinese character or word along with its corresponding image. \n- The user then attempts to guess its meaning. If they respond accurately, the item is pushed back into the review cycle based on the SRS algorithm.\n- If the guess is incorrect, the correct meaning is displayed, and the item is scheduled for another review sooner.\n- Users should have a clear view of their progress and a way to navigate to previously learned words for self-study.";
const Category = ({
  description,
  category,
  isDependency = false,
}: CategoryProps) => {
  const { updateIsLoading, currentPrototype } = useAppContext();
  const {
    submittedProblem,
    updateUpdatedMatrix,
    currentCategory,
    updateCurrentCategory,
    updateMatrixCategoryInfo,
    matrixCategoryInfo,
  } = useMatrixContext();
  let initialInput = "";
  // if (category==="PersonXGrounding") {
  //   initialInput= PERSON_GROUNDING_EXAMPLE;
  // } else if (category==="ApproachXGrounding"){
  //   initialInput = APPROACH_GROUNDING_EXAMPLE;
  // } else if (category==="InteractionXGrounding"){
  //   initialInput = INTERACTION_GROUNDING_EXAMPLE;
  // }
  let initialBrainstorm = [];
  // if (category==="PersonXIdea") {
  //   initialBrainstorm = PERSON_IDEA_EXAMPLE;
  // } else if (category==="ApproachXIdea") {
  //   initialBrainstorm = APPROACH_IDEA_EXAMPLE;
  // } else if (category==="InteractionXIdea") {
  //   initialBrainstorm = INTERACTION_IDEA_EXAMPLE;
  // }

  const [input, setInput] = useState(initialInput);
  // const [needsSpecification, setNeedsSpecification] = useState(false);
  const [brainstorms, setBrainstorms] = useState(initialBrainstorm);
  // const [specifications, setSpecifications] = useState([]);
  const [question, setQuestion] = useState("");
  const [iteration, setIteration] = useState("");
  const isGrounding = category.includes("Grounding");
  const ideaPair = category.split("X")[0] + "XIdea";
  const disabled = isGrounding && matrixCategoryInfo[ideaPair].length === 0;
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

  // const getNeedsSpecification = () => {
  //   updateIsLoading(true);
  //   axios({
  //     method: "GET",
  //     url: `${SERVER_URL}/get_needs_specification`,
  //     params: {
  //       category: category,
  //     },
  //   })
  //     .then((response) => {
  //       console.log(
  //         "/get_needs_specification request successful:",
  //         response.data,
  //       );
  //       setNeedsSpecification(response.data.needs_specification);
  //     })
  //     .catch((error) => {
  //       console.error("Error calling /get_needs_specification request:", error);
  //     })
  //     .finally(() => {
  //       updateIsLoading(false);
  //     });
  // };

  const getInput = () => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: `${SERVER_URL}/get_input`,
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
      url: `${SERVER_URL}/update_input`,
      data: {
        category: category,
        input: input,
      },
    })
      .then((response) => {
        console.log("/update_input request successful:", response.data);
        getInput();
        // getNeedsSpecification();
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
      url: `${SERVER_URL}/brainstorm_inputs`,
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
  //     url: `${SERVER_URL}/get_question`,
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
  //     url: `${SERVER_URL}/get_brainstorms`,
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
  //       url: `${SERVER_URL}/update_specifications`,
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
    // getInput();
    // getNeedsSpecification();
  }, [submittedProblem]);

  useEffect(() => {
    //setBrainstorms([]);
    // getInput();
  }, [currentPrototype]);

  return (
    <Box
      border={0}
      sx={{
        maxWidth: "700px",
        borderColor: isDependency ? "#F8F3CA" : "transparent",
        backgroundColor: isDependency ? "#F8F3CA" : "transparent",
      }}
    >
      <Stack spacing="10px">
        {/* {!input && (
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
          )} */}
        {/* <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "bold",
              alignSelf: "center",
              fontFamily: "monospace",
            }}
          >
            {category}
          </Typography> */}
        <Typography
          variant="body2"
          sx={{
            // alignSelf: "center",
            //fontFamily: "monospace",
            fontWeight: "bold",
          }}
        >
          {description}
        </Typography>
        <Button
          onClick={() => {
            brainstormInputs();
            if (currentCategory !== category) {
              updateCurrentCategory(category);
            }
          }}
          disabled={disabled}
          sx={{
            width: "100%",
          }}
        >
          Brainstorm
        </Button>
        {brainstorms?.length > 0 || input ? (
          <Stack direction="row" spacing="5px">
            <TextField
              label="Iterate"
              className={"Iterate"}
              rows={1}
              value={iteration}
              onChange={(e) => {
                setIteration(e.target.value);
              }}
            />
            <Button
              onClick={brainstormInputs}
              disabled={disabled}
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
                if (currentCategory !== category) {
                  updateCurrentCategory(category);
                }
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
          disabled={disabled}
          onClick={() => {
            updateInput();
            updateUpdatedMatrix(true);
            updateMatrixCategoryInfo(category, input);
            if (currentCategory !== category) {
              updateCurrentCategory(category);
            }
          }}
          onChange={() => {
            if (currentCategory !== category) {
              updateCurrentCategory(category);
            }
          }}
          direction="column"
          rows={category.includes("Idea") ? 1 : 8}
        />
        {isGrounding && (
          <Stack spacing="5px">
            <Button
              disabled={disabled}
              onClick={() => {
                setVersions([...versions, input]);
                if (currentCategory !== category) {
                  updateCurrentCategory(category);
                }
              }}
            >
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
                  maxWidth: "698px",
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
