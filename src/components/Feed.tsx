import React, { useEffect, useReducer } from "react";
import Tweet from "./Tweet";
import ErrorMessage from "./ErrorMessage";
import Spinner from "./Spinner";
const Feed = () => {
  const initialState = {
    tweets: [],
    error: {},
    isWaiting: true,
  };

  useEffect(() => {}, []);

  return (
    <div>
      <h1>3 million</h1>
    </div>
  );
};

export default Feed;
