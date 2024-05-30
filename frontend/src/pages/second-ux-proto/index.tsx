import { Stack, Typography, Button } from "@mui/material";
import React, { useState } from "react";
import Starter from "./components/starter";
import DesignAndRender from "./components/design-and-render";

// This prototype attempts to allow for iteration and steps given a prompt. However, fails because of the lack of planning.
const SecondUxProto = () => {
  const [designs, setDesigns] = useState([
    <DesignAndRender first={true} key={0} id={0} />,
  ]);

  const iterate = () => {
    setDesigns([
      ...designs,
      <DesignAndRender key={designs.length} id={designs.length} />,
    ]);
  };

  return (
    <div className={"home"}>
      <Stack spacing="20px" sx={{ padding: "20px" }}>
        <Stack
          direction="row"
          spacing="20px"
          sx={{
            alignItems: "flex-start",
            alignContent: "flex-end",
            justifyContent: "center",
          }}
        >
          <img
            src={require("../../assets/franky-icon.ico")}
            alt="chopper"
            width="150x"
          />
          <Typography variant="h1" sx={{ alignSelf: "center" }}>
            UX Prototype
          </Typography>
        </Stack>
        <Stack direction="row" spacing="50px">
          <Starter />
          <Stack spacing="40px">
            {designs.map((component, index) => (
              <Stack spacing="10px">
                {component}
                <Button onClick={iterate} variant="contained">
                  Iterate On Design
                </Button>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
};

export default SecondUxProto;
