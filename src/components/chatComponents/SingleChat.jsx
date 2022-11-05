import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { ArrowBackIcon } from "@chakra-ui/icons";
import Profile from "./Profile";
import UpdateGroupChatModal from "./UpdateGroupChatModel";
import axios from "axios";
import ScrollChat from "./ScrollChat";
import io from "socket.io-client"
import Lottie from 'react-lottie'
import animationData from '../../typingAnimation.json'
const ENDPOINT = "http://localhost:5000"

let socket,selectedChatCompare

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const defaultOptions ={
    loop:true,
    autoplay:true,
    animationData: animationData,
    renderSettings:{
      preserveAspectRatio:"xMidYMid slice"
    }
  }
  useEffect(() => {
 socket =io(ENDPOINT)
  socket.emit('setup',user)
  socket.on('connected',()=>{
    setSocketConnected(true)
    socket.on('typing',()=>{
      setIsTyping(true)
    })
    socket.on('stop typing',()=>{
      setIsTyping(false)
    })
  })
  }, [])

  useEffect(() => {
    getMessages();
    selectedChatCompare = selectedChat
  }, [selectedChat]);
  
useEffect(() => {
  socket.on("message recieved",(newMessageRecieved)=>{
    if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id){
      //notification
    }else{
      setMessages([...messages,newMessageRecieved])
    }

  })
})
  

  const sendMessage = async (e) => {

    if ((newMessage && e === undefined) || (e.key === "Enter" && newMessage)) {
      socket.emit('stop typing',selectedChat._id)
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        console.log(data);
        socket.emit('new message',data)
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error sending The message ",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    }
  };

  const getMessages = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

   socket.emit('join room',selectedChat._id)
     
    } catch (error) {
      toast({
        title: "Failed to load The message ",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if(!socketConnected){return}
      if(!typing){
         setTyping(true)
         socket.emit('typing',selectedChat._id)
      }
      let LastTypeTime = new Date().getTime()
      let Timer = 3000
      setTimeout(() => {
        let Time = new Date().getTime()
        let timeDif= Time - LastTypeTime
        if(timeDif>= Timer && typing){
          socket.emit("stop typing",selectedChat._id)
          setTyping(false)
        }
      }, Timer);
    
  };
  const getSender = (loggedUser, users) => {
    return loggedUser && users[0]._id === loggedUser._id
      ? users[1].name
      : users[0].name;
  };
  const getSenderFull = (loggedUser, users) => {
    return loggedUser && users[0]._id === loggedUser._id ? users[1] : users[0];
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
              <>
                {getSender(user, selectedChat.users)}
                <Profile
                  user={getSenderFull(user, selectedChat.users)}
                ></Profile>
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  getMessages={getMessages}
                ></UpdateGroupChatModal>
              </>
            )}
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
          >
            {loading ? (
              <Spinner
                size="xl"
                w="20"
                h="20"
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "scroll",
                  scrollbarWidth: "none",
                }}
              >
                <ScrollChat messages={messages}></ScrollChat>
              </div>
            )}
            
            <FormControl
              onKeyDown={sendMessage}
              isRequired
              mt={3}
              style={{ display: "flex" }}
            >
               {isTyping&& !typing && <div style={{textAlign:"left"}} >
              <Lottie
              options={defaultOptions}
              width={50}
              style={{marginBottom:0,marginLeft:0}}
              />
             </div> }  
              <Input
                variant="filled"
                placeholder="Type..."
                onChange={typingHandler}
                value={newMessage}
                bg="white"
              ></Input>
              <Button onClick={() => sendMessage()}>Send</Button>
            </FormControl>
          </Box>
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
