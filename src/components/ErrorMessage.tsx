import React from "react";

interface Props {
  error: any;
  styleType: any;
}

const ErrorMessage = ({ error, styleType }: Props) => {
  const errorDetails = () => {
    if (error.details) {
      return error.details.map((detail: any) => <p key={detail}>{detail}</p>);
    } else if (error.detail) {
      return <p key={error.detail}>{error.detail}</p>;
    }
  };

  const errorType = () => {
    if (error.type) {
      return (
        <em>
          See
          <a href={error.type} target="_blank" rel="noopener noreferrer">
            {" "}
            Twitter documentation{" "}
          </a>
          for further details.
        </em>
      );
    }
  };

  return (
    <div className={`ui message ${styleType}`}>
      <div className="header">{error.title}</div>
      {errorDetails()}
      {errorType()}
    </div>
  );
};

export default ErrorMessage;
