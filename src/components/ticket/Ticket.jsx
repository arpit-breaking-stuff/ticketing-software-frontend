import Clear from "@mui/icons-material/Clear";
import { Box } from "@mui/system";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { api } from "../../config";
import { PriorityColors } from "../../ui-components/colors/PriorityColors";
import { Text1, Title3, Title3css } from "../../ui-components/typography";
import { IconButtonWrappers } from "../swimlane/Swimlane";
import ClearIcon from "@mui/icons-material/Clear";

const Container = styled.div`
  background: #e0e4ea;
  border-radius: 17px;
  padding: 16px;
  margin: 16px 0;
`;
const TicketName = styled(Link)`
  all: unset;
  ${Title3css};

  :hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const Priority = styled.div`
  border-radius: 4px;
  background-color: ${(props) => PriorityColors.get(props.priority)};
  width: min-content;
  padding: 4px;
  color: #000000;
`;

export function PriorityBox(props) {
  return (
    <Priority priority={props.priority}>
      <Text1>P{props.priority}</Text1>
    </Priority>
  );
}

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
    <Container>
      <Box display="flex" justifyContent={"flex-end"}>
        <IconButtonWrappers onClick={() => deleteTicket.mutate()}>
          <ClearIcon />
        </IconButtonWrappers>
      </Box>
      <Box display={'flex'} flexDirection={'column'}>
        <TicketName to={`/ticket/${props._id}`}>
          <Title3>{props.ticketName}</Title3>
        </TicketName>
        <PriorityBox priority={props.ticketPriority} />
        <Text1>
          Assigned To: <b>{props.assignedTo}</b>
        </Text1>
        <Text1>
          Created At: <b>{new Date(props?.createdAt).toLocaleDateString()}</b>
        </Text1>
      </Box>
    </Container>
  );
}
