import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'

function Home() {
  const history = useHistory()
  useEffect(() => {
    const userInfo = JSON.parse( localStorage.getItem("userInfo"))
   
    if(!userInfo){
        history.push('/')
    }
     
    }, [history])
  return (
    <Container maxW="xl" centerContent>
      <Box
      d="flex"
      justifyContent="center"
      p={3}
      bg={'white'}
      borderRadius="lg"
      borderWidth="1px"
      w="100%"
      m={"40px 0 15px 0"}
      >
  <Text fontFamily="Work sans" color="black" fontSize="2xl" >Lets Talk</Text>
      </Box>

      <Box  p={3}
      bg={'white'}
      borderRadius="lg"
      borderWidth="1px"
      w="100%">

<Tabs variant='soft-rounded' colorScheme='green'>
  <TabList mb="3">
    <Tab width="50%">Login</Tab>
    <Tab width="50%">Register</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
        <Login></Login>
    </TabPanel>
    <TabPanel>
        <Register></Register>
    </TabPanel>
  </TabPanels>
</Tabs>
    </Box>
        
    </Container>
  )
}

export default Home