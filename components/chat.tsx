import { FormEvent, useEffect, useMemo, useState, useRef } from "react";
import { IMessage, IUser } from "../types";
import ChatMessage from "./message";
import { io, Socket } from "socket.io-client";
import {LoremIpsum} from 'lorem-ipsum'

type Props = {
  user: IUser|null,
  other: IUser|null
}

const Chat: React.FC<Props> = ({user, other})=>{
  const [messages, setMessages] = useState<IMessage[]>([])
  const [socketRequestCompleted, setSocketRequestCompleted] = useState(false)
  const [conversationId, setConversationId] = useState<string|null>(null)
  const [socket, setSocket] = useState<Socket|null>(null)

  useEffect(()=>{
    //fetch conversation history
    if(!user || !other) return

    fetch('/api/get-conversation', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        u1Id: user._id,
        u2Id: other._id
      })
    })
    .then(res => res.json())
    .then(data => setConversationId(data.conversationId))
    .catch(err => {console.error(err); setConversationId(null)})
  }, [other, user])

  function convertMessageJSON(message:{ _id: string; sender: { _id: string; username: string; }; sendTime: Date; message: string; }): IMessage{
    return {
      _id: message._id,
      fromUser: { _id: message.sender._id, username: message.sender.username },
      toUser: { _id: message.sender._id, username: message.sender.username },
      time: new Date(message.sendTime),
      message: message.message
    }
  }

  useMemo(()=>{
    if(!conversationId) return
    
    fetch('/api/get-messages', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        conversationId: conversationId
      })
      })
      .then(res => res.json())
      .then(data => {
        setMessages(data.messages.map((message: { _id: string; sender: { _id: string; username: string; }; sendTime: Date; message: string; }) => convertMessageJSON(message)))
      })
    }
  , [conversationId])

  useEffect(()=>{
    fetch('/api/socket').then(()=>setSocketRequestCompleted(true))
  }, [])
  
  useEffect(()=>{
    if(!socketRequestCompleted)
      return;

    const socket = io()
    setSocket(socket)
    return ()=>{socket.disconnect()}
  }, [socketRequestCompleted])

  useMemo(()=>{
    if(!socket) return
    socket.on('connect', () => {
      console.log('connected')
    })
    socket.on('message', (payload)=>{
      setMessages([...messages, convertMessageJSON(JSON.parse(payload))])
    })
    socket.on('disconnect', ()=>{
      console.log('disconnect')
    })
  },[socket, messages])

  useEffect(()=>{    
    chatBottomRef?.current?.scrollIntoView({behavior: 'auto', });
  }, [messages])

  async function sendMessage(form:HTMLFormElement) {
    const formData = new FormData(form)
    
    await fetch('/api/post-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({message: formData.get('message'), conversationId: conversationId})
    })
    form.reset()
  }

  async function onSubmit(evt:FormEvent<HTMLFormElement>) {
    evt.preventDefault()
    await sendMessage(evt.target as HTMLFormElement)
  }
  
  async function onKeyDown(evt:React.KeyboardEvent<HTMLTextAreaElement>) {
    if (evt.key == 'Enter' && !evt.shiftKey) {
      const messageForm = document.getElementById('message-form') as HTMLFormElement;
			evt.preventDefault();
			await sendMessage(messageForm)
    }
  }
  
  const chatBottomRef = useRef<null | HTMLLIElement>(null);

  return (
    <>
    <div className='flex-auto'>
      <div className='h-[calc(100%-6rem)] overflow-auto'>
        <ul className='flex flex-col pb-10'>
        {
          messages.map(message => (
          <li key={message._id} className={message.fromUser._id===user?._id?"w-3/4 self-start":"w-3/4 self-end"}>
            <ChatMessage message={message} myChat={message.fromUser._id===user?._id}></ChatMessage>
          </li>
          ))
        }
        <li ref={chatBottomRef}></li>
        </ul>
      </div>
      <form id='message-form' onSubmit={onSubmit} className="flex mt-2">
        <textarea name='message' className='flex-auto border-2 h-20 rounded-l-lg p-2' onKeyDown={onKeyDown}/>
        <button type='submit' className='w-20 h-20 rounded-r-lg bg-amber-400 p-2 text-white'>Send</button>
      </form>
    </div>
    </>
  )
}

export default Chat;