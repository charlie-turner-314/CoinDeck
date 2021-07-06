import React from "react";
const { TwitterTweetEmbed } = require("react-twitter-embed");

const Tweet = ({ json }: any) => {
  const { id } = json.data;

  const options = {
    cards: "hidden",
    align: "center",
    width: "550",
    conversation: "none",
  };

  return <TwitterTweetEmbed options={options} tweetId={id} />;
};

export default Tweet;
