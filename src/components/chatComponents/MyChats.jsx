import React, { useState, useEffect } from "react";
import { ChatState } from "../../context/ChatProvider";
import ChatLoading from "./ChatLoading"
import GroupChatModel from "./GroupChatModel"
import { useToast, Box,Button,Stack,Text} from "@chakra-ui/react";
import { AddIcon } from '@chakra-ui/icons'
import axios from "axios";
import './MyChats.css'
const MyChats = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const toast = useToast();
    useEffect(() => {
      
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
   if(user){
    getChats();}
  }, [fetchAgain,user])
  const getChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/chat`, config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error fetching the chats",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

   const getSender = (loggedUser, users) => {
    return loggedUser&&users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };

  return (

    <Box
   
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
      <GroupChatModel>
          <Button
            display="flex"
            fontSize={{ base: "10px", md: "12px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
     </GroupChatModel>   
      </Box>

      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
     
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack  
          overflow={chats.length>9?"scroll":"hidden"} height="100vh" className="stack">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name}</b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>

  );
};

export default MyChats;
