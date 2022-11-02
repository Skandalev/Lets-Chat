import React, { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
function Chats() {
    useEffect(() => {
    getChats()
    
    }, [])
const [chats, setChats] = useState([])
    
    const getChats = async ()=>{
         const {data} = await axios.get("/api/chat")
         setChats(data);
    }  



  return (
    <div>
        {chats.map((chat)=> {
        return <div key={chat.id}>
            {chat.chatName}
        </div> })}

    </div>
  )
}

export default Chats