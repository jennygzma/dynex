import { useState } from "react";
import Box from "../../../components/Box";
import { useAppContext } from "../hooks/app-context";
import { Drawer, Stack, styled, Typography } from "@mui/material";
import React from "react";
import InputWithButton from "../../../components/InputWithButton";
import axios from "axios";
import { useMatrixContext } from "../hooks/matrix-context";
import Button from "../../../components/Button";
import Prototypes from "./prototypes";
import { ChevronLeft, Menu } from "@mui/icons-material";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const Header = () => {
  const [problem, setProblem] = useState("");
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const { currentPrototype, updateIsLoading, updatePrototypes } =
    useAppContext();
  const { updateSubmittedProblem } = useMatrixContext();

  const toggleDrawer = (toggleValue) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setSidebarIsOpen(toggleValue);
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

  return (
    <Box
      sx={{
        backgroundColor: "#9a4e4e",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%", // Ensure the header spans the full width
        zIndex: 1300, // Ensure it stays above other content (MUI default zIndex for drawers)
        // display: "flex",
        alignItems: "center", // Center items vertically
        padding: "10px", // Adjust padding as needed
      }}
    >
      <Stack
        direction="row"
        spacing="10px"
        sx={{
          alignItems: "center",
          alignContent: "flex-end",
          justifyContent: "flex-start",
          width: "90%",
        }}
      >
        <Button
          onClick={toggleDrawer(!sidebarIsOpen)}
          colorVariant={"transparent"}
        >
          <Menu />
        </Button>
        <img
          src={require("../../../assets/franky.ico")}
          alt="franky"
          width="50x"
        />
        <Drawer
          anchor="left"
          open={sidebarIsOpen}
          onClose={toggleDrawer(false)}
        >
          <DrawerHeader
            sx={{
              paddingTop: "100px",
            }}
          >
            <Button onClick={toggleDrawer(false)} colorVariant="red">
              <ChevronLeft />
            </Button>
          </DrawerHeader>
          <Prototypes />
        </Drawer>
        <Typography
          variant="h4"
          sx={{
            // alignSelf: "center",
            color: "#5BB9C2",
            fontWeight: "bold",
            fontFamily: "Courier New",
          }}
        >
          dynaex
        </Typography>
        <InputWithButton
          className="problem"
          label="Problem"
          input={problem}
          setInput={setProblem}
          onClick={saveProblem}
        />
      </Stack>
    </Box>
  );
};

export default Header;
