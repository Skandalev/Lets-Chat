import { Box } from '@chakra-ui/react'
import ChatBox from '../components/chatComponents/ChatBox'
import MyChats from '../components/chatComponents/MyChats'
import SideDrawer from '../components/chatComponents/SideDrawer'
import {ChatState} from '../context/ChatProvider'
import { useState } from 'react'
function Chats() {
   const {user} = ChatState()
   const [fetchAgain, setFetchAgain] = useState(false)
  return (
    <div style={{width:'100%'}}>
      
       {user&&<SideDrawer/>}
   
       <Box
       display="flex"
       justifyContent="space-between"
       w='100%'
       h="91.5vh"
       p="10px"
       >
        
      {user&& <MyChats fetchAgain={fetchAgain} />}
       {user&&  <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
         
       </Box>
    </div>
  )
}

export default Chats