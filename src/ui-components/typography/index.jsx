import React from "react";
import styled, { css } from "styled-components";

export const Title1css = css`
  font-style: normal;
  font-weight: 700;
  font-size: 48px;
  line-height: 64px;

  color: ${(props) => props.color ?? "black"};
`;

export const Title1Style = styled.h1`
  all: unset;
  ${Title1css};
`;

export const Title2css = css`
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 48px;

  color: ${(props) => props.color ?? "black"};
`;

export const Title2Style = styled.h2`
  all: unset;
  ${Title2css};
`;

export const Title3css = css`
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 36px;

  color: ${(props) => props.color ?? "black"};
`;

export const Title3Style = styled.h3`
  all: unset;
  ${Title3css};
`;

export const Title4css = css`
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 30px;

  color: ${(props) => props.color ?? "black"};
`;

export const Title4Style = styled.h3`
  all: unset;
  ${Title4css};
`;

export const Text1css = css`
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;

  color: ${(props) => props.color ?? "black"};
`;

export const Text1Style = styled.p`
  all: unset;
  ${Text1css};
`;

export const Text2css = css`
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 22px;

  color: ${(props) => props.color ?? "black"};
`;

export const Text2Style = styled.p`
  all: unset;
  ${Text2css};
`;

export const Text3css = css`
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;

  color: ${(props) => props.color ?? "black"};
`;

export const Text3Style = styled.p`
  all: unset;
  ${Text3css};
`;

export function Title1(props) {
  return <Title1Style color={props.color}>{props.children}</Title1Style>;
}

export function Title2(props) {
  return <Title2Style color={props.color}>{props.children}</Title2Style>;
}

export function Title3(props) {
  return <Title3Style color={props.color}>{props.children}</Title3Style>;
}

export function Title4(props) {
  return <Title4Style color={props.color}>{props.children}</Title4Style>;
}

export function Text1(props) {
  return <Text1Style color={props.color}>{props.children}</Text1Style>;
}

export function Text2(props) {
  return <Text2Style color={props.color}>{props.children}</Text2Style>;
}

export function Text3(props) {
  return <Text3Style color={props.color}>{props.children}</Text3Style>;
}
