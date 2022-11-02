import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from 'axios'
import { useToast } from '@chakra-ui/react'
import {useHistory} from 'react-router-dom'
const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const toast = useToast() 
  const history = useHistory()
  const postDetailes = (pics)=>{
    setLoading(true)
    if(pics===undefined){
      toast({
        title: 'Please select proper Image!',
        description: "We've created your account for you.",
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "top"
      })
      setLoading(false)
       return 
    }
   if(pics.type === "image/jpeg"|| pics.type ==="image/png"){
    const formData=  new FormData()
    formData.append('file',pics)
    formData.append('upload_preset',"xol71jb0")
    axios.post("https://api.cloudinary.com/v1_1/dumgi49os/image/upload",formData)
    .then( (response)=> {
       setPic(response.data.secure_url)
      setLoading(false)
      }).catch((err)=>{
        console.log(err);
        setLoading(false)
      })
  }else{
    toast({
      title: 'Please select proper Image!',
      description: "",
      status: 'warning',
      duration: 5000,
      isClosable: true,
      position: "top"
    })
 setLoading(false)
  }
  
  }
  const onSubmit = async ()=>{
    setLoading(true)
    if(!name||!email||!password||!confirmPassword){
      toast({
        title: 'Please Fill everything!',
        description: "",
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "top"
      })
      setLoading(false)
      return
    }
    if(password!==confirmPassword){
      toast({
        title: 'The confirm password doesn"t match!',
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
      const {data} = await axios.post("/api/user",{name,email,password,pic})
      toast({
        title: 'You are Registered',
        description: "Registered",
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
        title: 'Error Try again later',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "top"
      })
      setLoading(false)
    }
  }
  return (
    <VStack spacing="5px" color="black">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
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
            placeholder="Enter your password"
            type={show?"text":"password"}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <InputRightElement width="5rem">
            <Button h="2rem" size="sm" onClick={()=>setShow(!show)}>
              {show?"HIde":"Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="Enter your confirm password"
            type={show?"text":"password"}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
        </InputGroup>
      </FormControl>

      <FormControl id="pic" isRequired>
        <FormLabel>Picture</FormLabel>
        <Input
        type={"file"}
          placeholder="Upload your profile picture"
          onChange={(e) => {
            postDetailes(e.target.files[0]);
          }}
        />
      </FormControl>
         <Button onClick={()=>{onSubmit()}} colorScheme="green" width="100%" isLoading={loading} style={{marginTop:"15px"} }>Submit</Button>
    </VStack>
  );
};

export default Register;
