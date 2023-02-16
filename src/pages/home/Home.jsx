import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import Ticket from "../../components/ticket/Ticket";
import { api } from "../../config";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {
  Button,
  CircularProgress,
  FormControl,
  Grid,
  Input,
  TextField,
} from "@mui/material";

export default function Home() {
  const [openModal, setOpenModal] = useState(false);
  const tickets = useQuery(["fetch-all-tickets"], async () => {
    const tickets = await api.get("/ticket/get");
    return tickets?.data;
  });

  const createTicket = useMutation(
    ["create-ticket"],
    async () => {
      console.log(ticketNameField.current);
      const res = await api.post("/ticket/add", {
        ticketName: ticketNameField.current,
        ticketPriority: ticketPriorityField.current,
        assignedTo: assignedToField.current,
      });
    },
    {
      onSuccess: () => tickets.refetch(),
      onSettled: () => {
        ticketNameField.current = "";
        ticketPriorityField.current = null;
        assignedToField.current = "";
        setOpenModal(false);
      },
    }
  );

  const ticketNameField = useRef("");
  const ticketPriorityField = useRef(0);
  const assignedToField = useRef("");
  return (
    <div>
      <h1>This is supposed to look like notion (eventually)</h1>
      <Grid container width={"100%"} gap={4}>
        {tickets.data?.tickets?.map((ticket) => (
          <Grid item xs="12" sm="6" lg={"3"} xl={"2"} key={ticket._id}>
            <Ticket {...ticket} refetch={tickets?.refetch} />
          </Grid>
        ))}
      </Grid>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          bgcolor={"aliceblue"}
          top={"30%"}
          left={"50%"}
          position={"center"}
          display={"flex"}
          flexDirection={"column"}
          padding={"24px"}
          border={"5px solid black"}
          gap={"24px"}
        >
          <h1>Create Ticket</h1>
          <label>Issue Title</label>
          <input
            ref={ticketNameField}
            onChange={(e) => {
              ticketNameField.current = e.target.value;
            }}
          />
          <label>Assigned To</label>
          <input
            ref={assignedToField}
            onChange={(e) => {
              assignedToField.current = e.target.value;
            }}
          />
          <label>Priority</label>
          <input
            ref={ticketPriorityField}
            type={"number"}
            onChange={(e) => {
              ticketPriorityField.current = e.target.value;
            }}
          />
          <Button onClick={() => createTicket.mutate()} variant="contained">
            {!!createTicket.isLoading ? (
              <CircularProgress color="inherit" />
            ) : (
              "Create Ticket"
            )}
          </Button>
        </Box>
      </Modal>
      <button onClick={() => setOpenModal(true)}>Create Ticket</button>
    </div>
  );
}
