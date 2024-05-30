import React from "react";
import { Stack } from "@mui/material";
import { InfoBlock } from "../type";
import Post from "./post";

const NewsFeed = ({ dataArray }: { dataArray: InfoBlock[] }) => {
  return (
    <Stack spacing="10px">
      {dataArray.map((data) => {
        return <Post data={data} />;
      })}
    </Stack>
  );
};

export default NewsFeed;
