import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from 'axios'
import {useHistory} from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
 const toast = useToast()
 const history = useHistory()
  const onSubmit = async() => {
   setLoading(true)
   if(!email||!password){
    toast({
      title: 'Please fill everything! ',
      description: "",
      status: 'warning',
      duration: 5000,
      isClosable: true,
      position: "top"
    })
    setLoading(false)
    return
   }
  try {


      // const config ={
      //   headers:{"Content-type":"application/json"},
      // }
      const {data} = await axios.post("/api/user/login",{email,password})
      toast({
        title: 'You are Logged',
        description: "Logged In",
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: "top"
      })
      localStorage.setItem('userInfo',JSON.stringify(data))
      setLoading(false)
      history.push('/chats')
    
  } catch (error) {
    toast({
      title: 'Error ',
      description: error.response.data.message,
      status: 'error',
      duration: 5000,
      isClosable: true,
      position: "top"
    })
    setLoading(false)
    
  }
  };
  return (
    <VStack spacing="5px" color="black">
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
        value={email}
          placeholder="Enter your email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
          value={password}
            placeholder="Enter your password"
            type={show ? "text" : "password"}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <InputRightElement width="5rem">
            <Button h="2rem" size="sm" onClick={() => setShow(!show)}>
              {show ? "HIde" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        onClick={
          onSubmit
        }
        colorScheme="green"
        width="100%"
        style={{ marginTop: "15px" }}
        isLoading={loading}
      >
        Submit
      </Button>

      <Button
        onClick={() => {
         setEmail("guest@gmail.com")
         setPassword("123456")
        }}
        colorScheme="red"
        width="100%"
        style={{ marginTop: "15px" }}
      
      >
       As Guest
      </Button>
    </VStack>
  );
};

export default Login;
