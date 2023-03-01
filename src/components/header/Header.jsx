import { Box } from "@mui/material";
import React from "react";
import styled from "styled-components";

const HeaderWrapper = styled(Box)`
  width: 100%;
  padding: 12px 24px;
  color: white;
  background: #1565c0;
`;
export default function Header() {
  return (
    <HeaderWrapper>
      <h1>This is supposed to look like notion in later iterations.</h1>
    </HeaderWrapper>
  );
}
