import { QueryClient, useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import styled from "styled-components";
import { api } from "../../config";

const Container = styled.div`
  background: #e0e4ea;
  border-radius: 17px;
  width: 240px;
  padding: 16px;
  margin: 16px 0;
`;
const TicketName = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  /* identical to box height, or 125% */

  color: #000000;
`;

const Priority = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  /* identical to box height, or 143% */

  border: 2px solid black;
  width: min-content;
  padding: 4px;
  color: #000000;
`;

const Participant = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  /* identical to box height, or 143% */

  color: #000000;
`;

const FlexBox = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;
export default function Ticket(props) {
  const deleteTicket = useMutation(
    ["delete-ticket"],
    async () => {
      await api.delete(`/ticket/delete?id=${props._id}`);
    },
    {
      onSuccess: () => {
        props.refetch();
      },
    }
  );
  return (
    <Container draggable>
      <FlexBox>
        <button onClick={() => deleteTicket.mutate()}>x</button>
      </FlexBox>
      <TicketName>{props.ticketName}</TicketName>
      <Priority>P{props.ticketPriority}</Priority>
      <Participant>
        Assigned To: <b>{props.assignedTo}</b>
      </Participant>
      <Participant>
        Created At: <b>{new Date(props?.createdAt).toLocaleDateString()}</b>
      </Participant>
    </Container>
  );
}
