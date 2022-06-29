import { FormEvent, useEffect, useMemo, useState, useRef, useCallback } from "react";
import { IMessage, IUser } from "../types";
import ChatMessage from "./message";
import { io, Socket } from "socket.io-client";
import useSWR, { mutate } from 'swr'

type Props = {
  user: IUser|null,
  other: IUser|null
}

const Chat: React.FC<Props> = ({user, other})=>{
  const [socketRequestCompleted, setSocketRequestCompleted] = useState(false)
  const [socket, setSocket] = useState<Socket|null>(null)
  
  const messageUrl = `/api/message/${other?._id}`

  async function fetcher() {
    if(!user || !other) return []
    const res = await fetch(messageUrl, {method: 'GET'})
    const data = await res.json()
    return data.messages
  }

  const {data: messages, error: messagesFetchErr} = useSWR<IMessage[]>(messageUrl, fetcher, {fallbackData: []})

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
      const payloadData = JSON.parse(payload)
      if ([other?._id, user?._id].includes(payloadData.senderId))
        mutate(messageUrl, [...(messages??[]), payloadData.message], {populateCache: true, optimisticData: true, revalidate: false})
      mutate('/api/user')
    })
    socket.on('disconnect', ()=>{
      console.log('disconnect')
    })
  },[socket, messages, messageUrl, other, user])

  useEffect(()=>{    
    chatBottomRef?.current?.scrollIntoView({behavior: 'auto', });
  }, [messages])

  async function sendMessage(form:HTMLFormElement) {
    const formData = new FormData(form)
    await fetch(messageUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({message: formData.get('message')})
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
          messages?.map(message => (
          <li key={message._id} className={message.sender._id===user?._id?"w-3/4 self-end":"w-3/4 self-start"}>
            <ChatMessage message={message} myChat={message.sender._id===user?._id}></ChatMessage>
          </li>
          ))
        }
        <li ref={chatBottomRef}></li>
        </ul>
      </div>
      <form id='message-form' onSubmit={onSubmit} className="flex mt-2">
        <textarea name='message' className='flex-auto border-2 h-20 rounded-l-lg p-2' onKeyDown={onKeyDown}/>
        <button type='submit' className='w-20 h-20 rounded-r-lg bg-blue-400 p-2 text-white'>Send</button>
      </form>
    </div>
    </>
  )
}

export default Chat;