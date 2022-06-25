import { FormEvent, useEffect, useState } from "react";
import { IMessage, IUser } from "../types";
import ChatMessage from "./message";
import { io } from "socket.io-client";
import {LoremIpsum} from 'lorem-ipsum'

type Props = {
  user: IUser|null,
  other: IUser|null
}

const Chat: React.FC<Props> = ({user, other})=>{
  const [messages, setMessages] = useState<IMessage[]>([])
  const [socketRequestCompleted, setSocketRequestCompleted] = useState(false)

  useEffect(()=>{
    //fetch conversation history

    if(!user || !other) return
    
    const lorem = new LoremIpsum({
      sentencesPerParagraph: {
        max: 3,
        min: 1
      },
      wordsPerSentence: {
        max: 10,
        min: 1
      }
    })

    const fetchMessages = []
    for (let i = 0; i < 10; i++) {
      const fromUser: IUser = [user, other][Math.floor(Math.random()*2)]
      const toUser = fromUser === user ? other: user
      const message: IMessage = {
        fromUser: fromUser,
        toUser: toUser,
        message: lorem.generateParagraphs(Math.floor(Math.random()*5)+1),
        _id: i.toString(),
        time: new Date()
      }
      fetchMessages.push(message)
    }

    setMessages(fetchMessages)
  }, [other, user])

  useEffect(()=>{
    fetch('/api/socket').then(()=>setSocketRequestCompleted(true))
  }, [])
  
  useEffect(()=>{
    if(!socketRequestCompleted)
      return;

    const socket = io()

    socket.on('connect', () => {
      console.log('connected')
    })
    socket.on('message', (payload)=>{
      console.log(`message: ${payload}`)
    })
    socket.on('disconnect', ()=>{
      console.log('disconnect')
    })

    return ()=>{socket.disconnect()}
  }, [socketRequestCompleted])

  async function sendMessage(form:HTMLFormElement) {
    const formData = new FormData(form)
    
    await fetch('/api/chat', {
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
  
  return (
    <>
    <div className='flex-auto'>
      <div className='h-[calc(100%-6rem)] overflow-auto'>
        <ul className='flex flex-col-reverse pb-10'>
        {
          messages.map(message => (
          <li key={message._id} className={message.fromUser._id===user?._id?"w-3/4 self-start":"w-3/4 self-end"}>
            <ChatMessage message={message} myChat={message.fromUser._id===user?._id}></ChatMessage>
          </li>
          ))
        }
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