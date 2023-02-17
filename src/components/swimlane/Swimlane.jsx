import React from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 12px 24px;
  width: min-content;
  min-width: 322px;
  min-height: 100vh;
  max-height: fit-content;
  background: #f6f6f6;
  border-radius: 17px;
`;

export default function Swimlane(props) {
  return (
    <Container>
    <h1>{props.title}</h1>
      <div>{props.children}</div>
    </Container>
  );
}
