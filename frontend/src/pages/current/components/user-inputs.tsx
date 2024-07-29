import { Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "../hooks/app-context";
import Button from "../../../components/Button";
import TextField from "../../../components/TextField";
import Box from "../../../components/Box";
import Chip from "../../../components/Chip";

const UserInput = () => {
  const { updateIsLoading, theoriesToExplore, updateTheoriesToExplore } =
    useAppContext();

  useEffect(() => {
    getUseCase();
    getTheories();
    getSelectedTheories();
  }, []);

  const [useCase, setUseCase] = useState("");
  const [theories, setTheories] = useState([]);
  const [newTheoryInput, setNewTheoryInput] = useState("");
  const [selectedNewTheory, setSelectedNewTheory] = useState(false);

  const handleSelectTheory = (theory) => {
    if (!selectedNewTheory) setSelectedNewTheory(true);
    if (theoriesToExplore.includes(theory)) {
      updateTheoriesToExplore(theoriesToExplore.filter((t) => t !== theory));
    } else {
      updateTheoriesToExplore([...theoriesToExplore, theory]);
    }
  };

  const getUseCase = () => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: "/get_use_case",
    })
      .then((response) => {
        console.log("/get_use_case request successful:", response.data);
        setUseCase(response.data.user_case);
      })
      .catch((error) => {
        console.error("Error calling /get_use_case request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const brainstormTheories = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/brainstorm_theories",
      data: {
        use_case: useCase,
      },
    })
      .then((response) => {
        console.log("/brainstorm_theories request successful:", response.data);
        getTheories();
      })
      .catch((error) => {
        console.error("Error calling /brainstorm_theories request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const getTheories = () => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: "/get_theories",
    })
      .then((response) => {
        console.log("/get_theories request successful:", response.data);
        setTheories(response.data.theories);
      })
      .catch((error) => {
        console.error("Error calling /get_theories request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const saveTheory = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/save_theory",
      data: {
        theory: newTheoryInput,
      },
    })
      .then((response) => {
        console.log("/save_theory request successful:", response.data);
        getTheories();
        setNewTheoryInput("");
      })
      .catch((error) => {
        console.error("Error calling /save_theory request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const getSelectedTheories = () => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: "/get_selected_theories",
    })
      .then((response) => {
        console.log(
          "/get_selected_theories request successful:",
          response.data,
        );
        updateTheoriesToExplore(response.data.selected_theories);
      })
      .catch((error) => {
        console.error("Error calling /get_selected_theories request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const saveSelectedTheories = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/save_selected_theories",
      data: {
        selected_theories: theoriesToExplore,
      },
    })
      .then((response) => {
        console.log("/saveSelectedTheories request successful:", response.data);
        getSelectedTheories();
        setSelectedNewTheory(false);
      })
      .catch((error) => {
        console.error("Error calling /saveSelectedTheories request:", error);
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
          Use Case + Theory
        </Typography>
        <TextField
          className={"use-case"}
          label="Use Case"
          value={useCase}
          onChange={(e) => setUseCase(e.target.value)}
        />
        <Button
          onClick={brainstormTheories}
          disabled={!useCase}
          sx={{
            width: "100%",
          }}
        >
          Brainstorm Theories
        </Button>
        {theories.map((theory) => (
          <Chip
            key={theory}
            label={theory}
            onClick={() => handleSelectTheory(theory)}
            selected={theoriesToExplore?.includes(theory)}
            clickable
          />
        ))}
        <Stack direction="row" spacing="10px">
          <TextField
            className={"theory"}
            label="Theory"
            value={newTheoryInput}
            onChange={(e) => setNewTheoryInput(e.target.value)}
            sx={{ width: "90%" }}
          />
          <Button
            onClick={saveTheory}
            disabled={!newTheoryInput}
            sx={{
              width: "10%",
            }}
          >
            Submit
          </Button>
        </Stack>
        <Button
          onClick={saveSelectedTheories}
          disabled={!selectedNewTheory || !useCase}
          sx={{
            width: "100%",
          }}
        >
          Explore Theories For Use Case
        </Button>
      </Stack>
    </Box>
  );
};

export default UserInput;
