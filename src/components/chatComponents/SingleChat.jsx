import { Box, IconButton, Text } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../../context/ChatProvider";
import { ArrowBackIcon } from "@chakra-ui/icons";

import Profile from "./Profile";
import UpdateGroupChatModal from "./UpdateGroupChatModel";
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const getSender = (loggedUser, users) => {
    return loggedUser && users[0]._id === loggedUser._id
      ? users[1].name
      : users[0].name;
  };
  const getSenderFull = (loggedUser, users) => {
    return loggedUser && users[0]._id === loggedUser._id
      ? users[1]
      : users[0]
  };
  return (
    <div>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
          >
            {" "}
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>{getSender(user,selectedChat.users)}
                <Profile user={getSenderFull(user,selectedChat.users)}></Profile>             
              </>
            ) : ( <>
              {selectedChat.chatName.toUpperCase()}
              <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} ></UpdateGroupChatModal>
              </>  )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="63vw"
            h="71vh"
          
            borderRadius="lg"
            overflowY="hidden"
          >message</Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </div>
  );
};

export default SingleChat;
