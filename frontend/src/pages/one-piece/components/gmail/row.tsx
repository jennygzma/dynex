import React from "react";
import { Stack, Box } from "@mui/material";
import { InfoBlock } from "../type";

const Row = ({ data }: { data: InfoBlock }) => {
  return (
    <Box
      sx={{
        width: "90%",
        height: "30px",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        border: "solid 3px #ffc054",
        paddingLeft: "50px",
        backgroundColor: "#f7e094",
      }}
    >
      <Stack
        direction="row"
        spacing="20px"
        sx={{
          alignItems: "center",
          fontFamily: "monospace",
        }}
      >
        <Box sx={{ border: "solid 2px", width: "15px", height: "15px" }}>
          <img
            src={data.imagePath}
            alt="zoro"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>
        <div style={{ fontWeight: "bold" }}>{data.title}</div>
        {Object.entries(data.description).map(([key, value]) => (
          <div key={key}>
            {key}: {value}
          </div>
        ))}
      </Stack>
    </Box>
  );
};

export default Row;
