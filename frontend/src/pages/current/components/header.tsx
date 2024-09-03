import { useState } from "react";
import Box from "../../../components/Box";
import { useAppContext } from "../hooks/app-context";
import { Drawer, Stack, styled, Tooltip, Typography } from "@mui/material";
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
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const {
    prototypes,
    updateCurrentPrototype,
    updateIsLoading,
    updatePrototypes,
  } = useAppContext();

  const toggleDrawer = (toggleValue) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setSidebarIsOpen(toggleValue);
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
        padding: "10px",
      }}
    >
      <Stack
        direction="row"
        spacing="10px"
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          width: "90%",
        }}
      >
        <Button
          onClick={toggleDrawer(!sidebarIsOpen)}
          colorVariant={"transparent"}
        >
          <Menu />
        </Button>
        <Drawer
          anchor="left"
          open={sidebarIsOpen}
          onClose={toggleDrawer(false)}
        >
          <DrawerHeader
            sx={{
              paddingTop: "100px",
              backgroundColor: "#F8F3CA",
            }}
          >
            <Button onClick={toggleDrawer(false)} colorVariant="red">
              <ChevronLeft />
            </Button>
          </DrawerHeader>
          <Prototypes />
        </Drawer>
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
          }}
        >
          <img
            src={require("../../../assets/franky.ico")}
            alt="franky"
            width="50x"
          />
          <Typography
            variant="h4"
            sx={{
              // alignSelf: "center",
              color: "#5BB9C2",
              fontWeight: "bold",
              fontFamily: "Courier New",
              textAlign: "center",
            }}
          >
            dynaex
          </Typography>
        </Stack>
        {prototypes?.length !== 0 ? (
          <Tooltip title="Explore a new prototype!">
            <Button
              onClick={() => {
                updateCurrentPrototype(undefined);
              }}
              sx={{ marginLeft: "auto" }}
            >
              +
            </Button>
          </Tooltip>
        ) : (
          <></>
        )}
      </Stack>
    </Box>
  );
};

export default Header;
