import { Button, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { api } from "../../config";
import { copyToClipboard } from "../../utils/copyToClipboard";

export default function TicketDetails() {
  const { ticketId } = useParams("ticketId");
  console.log();
  const ticket = useQuery(
    ["get-one-ticket"],
    async () => {
      const response = await api.get("/ticket/get", {
        params: {
          _id: ticketId,
        },
      });
      return response?.data;
    },
    {}
  );
  return ticket?.isLoading ? (
    <CircularProgress color="success" />
  ) : (
    <div>
      <h1>{ticket?.data?.tickets?.ticketName}<Button variant='contained' onClick={() => copyToClipboard(window.location.href)}>
        Copy URL
      </Button></h1>
      
      <h2>
        Created at{" "}{new Date(ticket?.data?.tickets?.createdAt)?.toLocaleDateString()}
      </h2>
      <h2>
        Assigned to{" "}{ticket?.data?.tickets?.assignedTo}
      </h2>
    </div>
  );
}
