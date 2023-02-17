import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import Ticket from "../../components/ticket/Ticket";
import { api } from "../../config";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Button, CircularProgress, MenuItem, Select } from "@mui/material";
import Swimlane from "../../components/swimlane/Swimlane";

export default function Home() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedTicketStatus, setSelectedTicketStatus] = useState("");

  const tickets = useQuery(["fetch-all-tickets"], async () => {
    const tickets = await api.get("/ticket/get");
    return await tickets?.data;
  });

  const swimlanes = useQuery(
    ["fetch-all-ticket-status"],
    async () => {
      const statuses = await api.get("/status/get");
      return statuses?.data;
    },
    {
      enabled: !!tickets?.data,
      onSuccess: (data) => {
        console.log(data?.ticketStatus[0]?.ticketStatus);
        setSelectedTicketStatus(data?.ticketStatus[0]?.ticketStatus);
      },
    }
  );

  const createTicketStatus = useMutation(
    ["add-status"],
    async () => {
      return await api.post("/status/add", {
        status: newSwimlane.current,
      });
    },
    {
      onSuccess: () => {
        newSwimlane.current = "";
        swimlanes?.refetch();
      },
    }
  );

  const createTicket = useMutation(
    ["create-ticket"],
    async (args) => {
      await api.post("/ticket/add", {
        ...args,
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
        tickets.refetch();
        setOpenModal(false);
      },
    }
  );

  const newSwimlane = useRef("");
  const ticketNameField = useRef("");
  const ticketPriorityField = useRef(0);
  const assignedToField = useRef("");
  return (
    <Box padding={'24px'}>
      <Box display={"flex"} gap="24px" marginBottom={"24px"}>
        <h3>Add Column</h3>
        <input
          ref={newSwimlane}
          onChange={(e) => {
            newSwimlane.current = e.target.value;
          }}
        ></input>
        <Button variant="contained" onClick={() => createTicketStatus.mutate()}>
          <b>+</b>
        </Button>
      </Box>
      <Box display={"flex"} gap={"12px"}>
        {swimlanes?.data?.ticketStatus?.map((status) => (
          <Swimlane key={status?._id} title={status?.ticketStatus}>
            <Button
              variant="contained"
              onClick={() => {
                setSelectedTicketStatus(status?.ticketStatus);
                setOpenModal(true);
              }}
              fullWidth
            >
              Create Ticket
            </Button>
            {!!tickets.isLoading && <CircularProgress color="success" />}
            {!!tickets.isError && (
              <Box>
                Some error occurred, try refreshing{" "}
                <Button variant="contained" onClick={() => tickets.refetch()}>
                  Refresh
                </Button>
              </Box>
            )}
            {tickets?.data?.tickets
              ?.filter(
                (ticket) => ticket?.ticketStatus === status?.ticketStatus
              )
              ?.map((ticket) => (
                <Ticket
                  key={ticket._id}
                  {...ticket}
                  refetch={tickets?.refetch}
                />
              ))}
          </Swimlane>
        ))}
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
          <Box display="flex" gap={"40px"}>
            <label>Issue Title</label>
            <input
              ref={ticketNameField}
              onChange={(e) => {
                ticketNameField.current = e.target.value;
              }}
            />
          </Box>
          <Box display="flex" gap={"40px"}>
            <label>Assigned To</label>
            <input
              ref={assignedToField}
              onChange={(e) => {
                assignedToField.current = e.target.value;
              }}
            />
          </Box>
          <Box display="flex" gap={"40px"}>
            <label>Priority</label>
            <input
              ref={ticketPriorityField}
              type={"number"}
              onChange={(e) => {
                ticketPriorityField.current = e.target.value;
              }}
            />
          </Box>
          <Box display="flex" gap={"40px"}>
            <label>Status: </label>
            <Select
              value={selectedTicketStatus}
              onChange={(e) => {
                console.log(e.target.value);
                setSelectedTicketStatus(e.target.value);
              }}
            >
              {swimlanes?.data?.ticketStatus?.map((i) => (
                <MenuItem value={i?.ticketStatus} key={i?._id}>
                  {i?.ticketStatus}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Button
            onClick={() =>
              createTicket.mutate({ ticketStatus: selectedTicketStatus })
            }
            variant="contained"
          >
            {!!createTicket.isLoading ? (
              <CircularProgress color="inherit" />
            ) : (
              "Create Ticket"
            )}
          </Button>
          {!!createTicket.isError && (
            <Box>
              An error occurred. Refresh maybe?{" "}
              <Button onClick={() => createTicket.mutate()} variant="contained">
                Retry Adding ticket
              </Button>
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
