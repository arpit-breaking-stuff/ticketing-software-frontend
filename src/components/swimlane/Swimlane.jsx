import { Box } from "@mui/system";
import { useMutation } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import styled from "styled-components";
import { api } from "../../config";
import { Title1, Title1css } from "../../ui-components/typography";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

const Container = styled.div`
  padding: 12px 24px;
  width: min-content;
  width: 322px;
  min-height: 100vh;
  max-height: fit-content;
  background: #f6f6f6;
  border-radius: 17px;
`;

const EditSwimlaneTitle = styled.textarea`
  width: auto;
  all: unset;
  border: none;
  outline none;
  ${Title1css};
  color: green;
  white-space: initial;
  word-wrap: break-word
`;

export const IconButtonWrappers = styled.button`
  all: unset;
  background-color: lightgrey;
  border-radius: 50%;
  height: min-content;
  width: min-content;
  padding: 4px;

  :hover {
    cursor: pointer;
    background-color: darkgrey;
  }

  :disabled {
    color: white;
    background-color: gray;
    pointer-events: none;
  }
`;

export default function Swimlane(props) {
  const [editMode, setEditMode] = useState(false);
  const [swimlaneTitle, setSwimlaneTitle] = useState("");

  const deleteTicketStatusSwimlane = useMutation(
    ["delete-ticket-status-swimlane"],
    async () => {
      await api.delete(
        "/status/delete",
        {
          params: {
            _id: props._id,
          },
        }
      );
    },
    {
      onSuccess: () => {
        props.refetchSwimlane();
      },
    }
  );
  const updateTicketStatusSwimlane = useMutation(
    ["update-ticket-status"],
    async () => {
      if (typeof swimlaneTitle === "string") {
        await api.put(
          "/status/update",
          {},
          {
            params: {
              statusId: props._id,
              newName: swimlaneTitle,
            },
          }
        );
      } else {
        throw new Error("No string specified");
      }
    },
    {
      onSuccess: () => {
        console.log("successful updated");
        props.refetchSwimlane();
        setSwimlaneTitle("");
        setEditMode(false);
      },
    }
  );
  return (
    <Container>
      <Box display="flex" justifyContent={"flex-end"} gap={"12px"}>
        <IconButtonWrappers onClick={() => setEditMode(true)}>
          <EditIcon />
        </IconButtonWrappers>
        <IconButtonWrappers onClick={() => deleteTicketStatusSwimlane.mutate()}>
          <ClearIcon />
        </IconButtonWrappers>
      </Box>
      <Box margin={"24px 0"}>
        {editMode ? (
          <Box display={"flex"} gap={"12px"}>
            <EditSwimlaneTitle
              spellcheck="false"
              placeholder="Enter a new title"
              onChange={(e) => {
                console.log(swimlaneTitle);
                setSwimlaneTitle(e.target.value);
              }}
            />
            <Box display={"flex"} flexDirection={"column"} gap={"4px"}>
              <IconButtonWrappers
                onClick={() => {
                  updateTicketStatusSwimlane.mutate();
                }}
                disabled={swimlaneTitle.length === 0}
              >
                <CheckIcon />
              </IconButtonWrappers>
              <IconButtonWrappers
                onClick={() => {
                  setEditMode(false);
                }}
              >
                <ClearIcon />
              </IconButtonWrappers>
            </Box>
          </Box>
        ) : (
          <Title1>{props.title}</Title1>
        )}
      </Box>
      <div>{props.children}</div>
    </Container>
  );
}
