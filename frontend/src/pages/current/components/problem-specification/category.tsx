import { Badge, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "../../../../components/Box";
import TextField from "../../../../components/TextField";
import Button from "../../../../components/Button";
import InputWithButton from "../../../../components/InputWithButton";
import { useAppContext } from "../../hooks/app-context";

interface CategoryProps {
  title: string; // hi jenny specify this
  description: string;
  needsSpecification: boolean;
}

const Category = ({
  description,
  title,
  needsSpecification,
}: CategoryProps) => {
  const [input, setInput] = useState("");
  const { updateIsLoading } = useAppContext();
  const [questions, setQuestions] = useState([]);

  // hi jenny get input
  // hi jenny impelment in backend
  const saveInput = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/save_problem",
      data: {
        title: title,
        input: input,
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

  // hi jenny implement this to retrieve questions
  const getQuestions = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/save_problem",
      data: {
        title: title,
        input: input,
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
    <Box border={5} sx={{ padding: "10px" }}>
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
          {title}
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
        <InputWithButton
          label="Input"
          input={input}
          setInput={setInput}
          onClick={saveInput}
          direction="column"
        />
        <Button
          onClick={getQuestions}
          disabled={!needsSpecification}
          sx={{
            width: "100%",
          }}
        >
          Specify
        </Button>
        {questions.map((question, index) => {
          return (
            <Stack key={index} spacing="5px">
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  fontFamily: "monospace",
                }}
              >
                {question}
              </Typography>
              {/* hi jenny add the input */}
            </Stack>
          );
        })}
        <Button
          onClick={getQuestions}
          disabled={!needsSpecification}
          sx={{
            width: "100%",
          }}
        >
          Update Input
        </Button>
      </Stack>
    </Box>
  );
};

export default Category;
