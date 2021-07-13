import React from "react";

interface Props {
  tweet_data: {};
}

const Tweet = ({ tweet_data }: Props) => {
  return <div>{tweet_data}</div>;
};

export default Tweet;
