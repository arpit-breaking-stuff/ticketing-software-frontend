import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import Ticket from "../../components/ticket/Ticket";
import { api } from "../../config";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {
  Button,
  CircularProgress,
} from "@mui/material";
import Swimlane from "../../components/swimlane/Swimlane";

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
      await api.post("/ticket/add", {
        ticketName: ticketNameField.current,
        ticketPriority: ticketPriorityField.current,
        assignedTo: assignedToField.current,
      });
    },
    {
      onSuccess: () => {
        ticketNameField.current = "";
        ticketPriorityField.current = null;
        assignedToField.current = "";
        tickets.refetch()
        setOpenModal(false);
      },
    }
  );

  const ticketNameField = useRef("");
  const ticketPriorityField = useRef(0);
  const assignedToField = useRef("");
  return (
    <div>
      <Box display={"flex"}>
        <Swimlane title={"Not Started"}>
          {!!tickets.isLoading && <CircularProgress color="success" />}
          {!!tickets.isError && (
            <Box>
              Some error occurred, try refreshing{" "}
              <Button variant="contained" onClick={() => tickets.refetch()}>
                Refresh
              </Button>
            </Box>
          )}
          {tickets.data?.tickets?.map((ticket) => (
            <Ticket key={ticket._id} {...ticket} refetch={tickets?.refetch} />
          ))}

          <Button variant="contained" onClick={() => setOpenModal(true)} fullWidth>
            Create Ticket
          </Button>
        </Swimlane>
        <Swimlane title={"In Progress"}>
          
        </Swimlane>
        <Swimlane title={"In Review"}></Swimlane>
        <Swimlane title={"Completed"}></Swimlane>
      </Box>

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
          {!!createTicket.isError && <Box>An error occurred. Refresh maybe? <Button onClick={() => createTicket.mutate()} variant="contained">
            Retry Adding ticket
          </Button></Box>}
        </Box>
      </Modal>
    </div>
  );
}
