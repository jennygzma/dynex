import React from "react";
import { Stack, Box } from "@mui/material";
import { InfoBlock } from "../type";

const Post = ({ data }: { data: InfoBlock }) => {
  return (
    <Box
      sx={{
        width: "600px",
        height: "250px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "2px",
        backgroundColor: "#f7e094",
        border: "solid 4px #ffc054",
      }}
    >
      <Stack
        direction="row"
        spacing="20px"
        sx={{
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            border: "solid 1px",
            width: "200px",
            height: "200px",
          }}
        >
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
        <Box
          sx={{
            width: "300px",
            height: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            backgroundColor: "#fad993",
            borderRadius: "2px",
            fontFamily: "monospace",
          }}
        >
          <div style={{ fontWeight: "bold" }}>{data.title}</div>
          {Object.entries(data.description).map(([key, value]) => (
            <div key={key}>
              {key}: {value}
            </div>
          ))}
        </Box>
      </Stack>
    </Box>
  );
};

export default Post;
