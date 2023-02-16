import React from "react";

import styled from 'styled-components'

const Container = styled.div`
    border: 1px solid black;
    padding: 12px 24px;
    width: min-content;
    min-width: 322px;
`
export default function Swimlane(props) {
  return (
    <Container>
      <h1>{props.title}</h1>
      <div>{props.children}</div>
    </Container>
  );
}
