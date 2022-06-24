import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {LoremIpsum} from 'lorem-ipsum'
import ChatMessage from '../components/message'
import { IMessage, IMessageData, IUser } from '../types'
import { FormEvent, FormEventHandler, MouseEventHandler, useEffect, useState } from 'react'
import { NextPage } from 'next/types'
import Link from 'next/link'

const Home: NextPage = () => {
  const [chatData, setChatData] = useState<IMessageData|null>(null)
  const [user, setUser] = useState<IUser|null>(null)
  const [other, setOther] = useState<IUser|null>(null)
  const [friends, setFriends] = useState<IUser[]>([])
  const [friendRequests, setFriendRequests] = useState<IUser[]>([])
  const [sideBar, setSideBar] = useState<boolean>(false)

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

    const me: IUser = {userName: 'Johnathan', _id: "0"}
    const other: IUser = {userName: 'David', _id: "1"}
    const others: IUser[] = []
    for (let i = 0; i < 100; i++) {
      others.push({
        userName: lorem.generateWords(1),
        _id: (2+i).toString()
      })
    }

    const fRequest: IUser[] = []
    for (let i = 0; i < 5; i++) {
      fRequest.push({
        userName: lorem.generateWords(1),
        _id: (2+i).toString()
      })
    }

    const messages = []
    for (let i = 0; i < 10; i++) {
      const message: IMessage = {
        user: [me, other][Math.floor(Math.random()*2)],
        message: lorem.generateParagraphs(Math.floor(Math.random()*5)+1),
        _id: i.toString(),
        time: new Date()
      }
      messages.push(message)
    }
    setChatData({messages: messages})
    setUser(me)
    setOther(other)
    setFriends([other,...others])
    setFriendRequests(fRequest)
  }, [])

  function sendMessage(form:HTMLFormElement) {
    const formData = new FormData(form)
    form.reset()
    console.log(formData.get('message'))
  }

  function onSubmit(evt:FormEvent<HTMLFormElement>) {
    evt.preventDefault()
    sendMessage(evt.target as HTMLFormElement)
  }
  
  function onKeyDown(evt:React.KeyboardEvent<HTMLTextAreaElement>) {
    if (evt.key == 'Enter' && !evt.shiftKey) {
      const messageForm = document.getElementById('message-form') as HTMLFormElement;
			evt.preventDefault();
			sendMessage(messageForm)
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
              <h1 className='text-4xl font-bold flex-auto text-amber-400'><button onClick={()=> setSideBar(!sideBar)}>{user?.userName}</button></h1>
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
              friendRequests.length>0
              ?(
              <div>
                <div className='overflow-auto px-2 max-h-40'>
                  <ul className='flex flex-col-reverse pb-2'>
                    {
                      friendRequests?.map(friend => (
                        <li key={friend._id} className='flex flex-row'>
                          <button className={friend._id!==other?._id?'text-left w-full p-2 font-semibold text-black/70 text-xl hover:text-sky-500':'text-left w-full rounded-lg p-2 font-semibold bg-blue-400 text-white text-xl'}>{friend.userName}</button>
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
                  friends?.map(friend => (
                    <li key={friend._id}>
                      <button className={friend._id!==other?._id?'text-left w-full p-2 font-semibold text-black/70 text-xl hover:text-sky-500':'text-left w-full rounded-lg p-2 font-semibold bg-blue-400 text-white text-xl'}>{friend.userName}</button>
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
                chatData?.messages?.map(item => (
                <li key={item._id} className={item.user._id===user?._id?"w-3/4 self-start":"w-3/4 self-end"}>
                  <ChatMessage message={item} myChat={item.user._id===user?._id}></ChatMessage>
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
