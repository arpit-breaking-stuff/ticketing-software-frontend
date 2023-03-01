import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useReducer, useRef, useState } from "react";
import Ticket from "../../components/ticket/Ticket";
import { api } from "../../config";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {
  Button,
  Checkbox,
  CircularProgress,
  MenuItem,
  Select,
} from "@mui/material";
import Swimlane from "../../components/swimlane/Swimlane";

function enabledSorting(state, action) {
  if (action.field === "TICKET_NAME") {
    console.log({ ...state, ticketName: action.checked });
    return { ...state, ticketName: action.checked };
  }

  if (action.field === "TICKET_PRIORITY") {
    console.log({ ...state, ticketPriority: action.checked });
    return { ...state, ticketPriority: action.checked };
  }
}

export default function Home() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedTicketStatus, setSelectedTicketStatus] = useState("");

  const [enabledSortingFilters, dispatchSortingEnabled] = useReducer(
    enabledSorting,
    {
      ticketName: false,
      ticketPriority: false,
    }
  );

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
        setSelectedTicketStatus(data?.ticketStatus[0]);
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
  return !!swimlanes?.isLoading ? (
    <div>
      <CircularProgress sx={{ color: "black" }} />
    </div>
  ) : (
    <Box padding={"24px"}>
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
        <h3>Sort by Ticket Name</h3>
        <Checkbox
          checked={enabledSortingFilters.ticketName}
          onChange={(e) =>
            dispatchSortingEnabled({
              field: "TICKET_NAME",
              checked: e.target.checked,
            })
          }
        />
        {/* <h3>Sort by Ticket Priority</h3>
        <Checkbox
          checked={enabledSortingFilters.ticketPriority}
          onChange={(e) =>
            dispatchSortingEnabled({
              field: "TICKET_PRIORITY",
              checked: e.target.checked,
            })
          }
        /> */}
      </Box>
      <Box display={"flex"} gap={"12px"}>
        {swimlanes?.data?.ticketStatus?.map((status) => (
          <Swimlane
            key={status?._id}
            _id={status?._id}
            title={status?.ticketStatus}
            refetchSwimlane={() => {
              swimlanes?.refetch();
              tickets?.refetch();
            }}
          >
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
            {!!tickets.isLoading && (
              <CircularProgress sx={{ color: "black" }} />
            )}
            {!!tickets.isError && (
              <Box>
                Some error occurred, try refreshing{" "}
                {createTicket?.error?.response?.data?.message}
                <Button variant="contained" onClick={() => tickets.refetch()}>
                  Refresh
                </Button>
              </Box>
            )}
            {tickets?.data?.tickets
              ?.filter(
                (ticket) => ticket?.ticketStatus === status?.ticketStatus
              )
              ?.sort(
                (a, b) =>
                  enabledSortingFilters?.ticketName &&
                  (a.ticketName > b.ticketName ? 1 : -1)
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
                setSelectedTicketStatus(e.target.value);
              }}
            >
              {swimlanes?.data?.ticketStatus?.map((i) => (
                <MenuItem value={i} key={i?._id}>
                  {i?.ticketStatus}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Button
            onClick={() =>
              createTicket.mutate({ ticketStatus: selectedTicketStatus?._id })
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
