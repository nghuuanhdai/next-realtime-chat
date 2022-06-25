import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {LoremIpsum} from 'lorem-ipsum'
import ChatMessage from '../components/message'
import { IMessage, IConversation, IConversationData, IUser } from '../types'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import { GetServerSidePropsContext, InferGetServerSidePropsType , NextPage } from 'next/types'
import Link from 'next/link'
import jwt from 'jsonwebtoken'
import { IAccessTokenData } from './api/login'
import { io, Socket } from "socket.io-client";

export const getServerSideProps = async(context: GetServerSidePropsContext)=>{
  const accessToken = context.req.cookies['accessToken']
  if(!accessToken)
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props:{user: null},
    };
  const decodedToken:(IAccessTokenData|undefined) = jwt.verify(accessToken, process.env.JWT_SECRET||'') as IAccessTokenData
  if(!decodedToken)
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props:{user: null},
    };
  const user: IUser = {
    _id: decodedToken.userId,
    username: decodedToken.username
  }
  return {props: {user: user}}
}

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({user}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [conversation, setConversation] = useState<IConversationData|null>(null)
  const [other, setOther] = useState<IUser|null>(null)
  const [conversations, setConversations] = useState<IConversation[]>([])
  const [foundUsers, setFoundUsers] = useState<IUser[]>([])
  const [sideBar, setSideBar] = useState<boolean>(false)
  const [socketRequestCompleted, setSocketRequestCompleted] = useState(false)

  useEffect(()=>{
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

    const me: IUser = user || {username: 'Johnathan', _id: "0"}
    const other: IUser = {username: 'David', _id: "1"}
    const others: IUser[] = []
    for (let i = 0; i < 100; i++) {
      others.push({
        username: lorem.generateWords(1),
        _id: (2+i).toString()
      })
    }

    const fRequest: IUser[] = []
    for (let i = 0; i < 5; i++) {
      fRequest.push({
        username: lorem.generateWords(1),
        _id: (2+i).toString()
      })
    }

    const messages = []
    for (let i = 0; i < 10; i++) {
      const fromUser = [me, other][Math.floor(Math.random()*2)]
      const toUser = fromUser === me ? other: me
      const message: IMessage = {
        fromUser: fromUser,
        toUser: toUser,
        message: lorem.generateParagraphs(Math.floor(Math.random()*5)+1),
        _id: i.toString(),
        time: new Date()
      }
      messages.push(message)
    }
    setConversation({messages: messages})
    setOther(other)
    setConversations([other,...others].map<IConversation>((user, index) => ({_id: index.toString(), otherUser: user})))
    setFoundUsers(fRequest)
  }, [user])

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

  function searchFormSubmit(evt:FormEvent<HTMLFormElement>) {
    evt.preventDefault()
    console.log('search')
    const formData = new FormData(evt.target as HTMLFormElement)
  }

  function logout(evt:React.MouseEvent<HTMLButtonElement>) {
    console.log('logout')
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Next realtime chat</title>
        <meta name="description" content="realtime chat app with Nextjs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto flex flex-col h-screen">
      <div className='flex-none'>
        {
          user
            ?(
            <div className='flex flex-row p-2 items-start'>
              <h1 className='text-4xl font-bold flex-auto text-amber-400'><button onClick={()=> setSideBar(!sideBar)}>{user?.username}</button></h1>
              <Link href='/api/logout'><button className='flex-none mt-2 flex-none rounded bg-slate-400 p-2 px-5 text-white font-semibold'>Logout</button></Link>
            </div>
          )
          :(<></>)
        }
      </div>
      <div className='flex-auto min-h-0'>
        <div className='h-full flex flex-row relative'>
          <div className={
            sideBar
            ?'flex-none absolute md:relative w-80 flex-col flex h-full z-10 bg-white overflow-clip transition-all'
            :'flex-none absolute md:relative w-0 md:w-80 flex-col flex h-full z-10 bg-white overflow-clip transition-all'}>
            <form onSubmit={searchFormSubmit} className='flex flex-row p-2 items-stretch'>
              <label htmlFor='username' className='flex-auto text-black/40 text-sm hidden'>user name</label>
              <input name='username' id='username' placeholder='user name' className='text-blue-900 flex-auto bg-slate-200 rounded-l-lg p-2' type='text'></input>
              <button type='submit' className='flex-auto rounded-r-lg bg-blue-400 p-2 text-white font-semibold'>Search</button>
            </form>
            {
              foundUsers.length>0
              ?(
              <div>
                <div className='overflow-auto px-2 max-h-40'>
                  <ul className='flex flex-col-reverse pb-2'>
                    {
                      foundUsers?.map(user => (
                        <li key={user._id} className='flex flex-row'>
                          <button className={user._id!==other?._id?'text-left w-full p-2 font-semibold text-black/70 text-xl hover:text-sky-500':'text-left w-full rounded-lg p-2 font-semibold bg-blue-400 text-white text-xl'}>{user.username}</button>
                        </li>
                      ))
                    }
                  </ul>
                </div>
              </div>
              )
              :(<></>)
            }
            <h2 className='font-bold text-3xl text-sky-500'>Conversations</h2>
            <div className='w-full h-0.5 bg-slate-200 mb-3 mt-0'></div>
            <div className='overflow-auto px-2 flex-auto min-h-0'>
              <ul className='pb-2 mt-1'>
                {
                  conversations?.map(conversation => (
                    <li key={conversation._id}>
                      <button className={conversation.otherUser._id!==other?._id?'text-left w-full p-2 font-semibold text-black/70 text-xl hover:text-sky-500':'text-left w-full rounded-lg p-2 font-semibold bg-blue-400 text-white text-xl'}>{conversation.otherUser.username}</button>
                    </li>
                  ))
                }
              </ul>
            </div>
          </div>
          <div className='hidden md:block w-0.5 bg-slate-200 mx-2'></div>
          <div className='flex-auto'>
            <div className='h-[calc(100%-6rem)] overflow-auto'>
              <ul className='flex flex-col-reverse pb-10'>
              {
                conversation?.messages?.map(item => (
                <li key={item._id} className={item.fromUser._id===user?._id?"w-3/4 self-start":"w-3/4 self-end"}>
                  <ChatMessage message={item} myChat={item.fromUser._id===user?._id}></ChatMessage>
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
        </div>
      </div>
      </main>
      
    </div>
  )
}

export default Home
