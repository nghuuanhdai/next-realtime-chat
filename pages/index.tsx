import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'
import { GetServerSidePropsContext, InferGetServerSidePropsType , NextPage } from 'next/types'
import jwt from 'jsonwebtoken'
import { IAccessTokenData } from './api/login'
import Chat from '../components/chat'
import UserSearch from '../components/user-search'
import ConversationList from '../components/conversation-list'
import Header from '../components/header'
import { IUser } from '../types'

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
  const [other, setOther] = useState<IUser|null>(null)
  const [sideBar, setSideBar] = useState<boolean>(false)

  function ChangeConversation(otherUserId:string) {
    setOther({
      _id: otherUserId,
      username: 'Uknown'
    })
  }

  function onTitleClick() {
    setSideBar(!sideBar)
  }

  return (
    <>
    <Head>
        <title>Next realtime chat</title>
        <meta name="description" content="realtime chat app with Nextjs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto flex flex-col h-full">
      <div className='flex-none'>
        <Header user={user} onTitleClick={onTitleClick}></Header>
      </div>
      <div className='flex-auto min-h-0'>
        <div className='h-full flex flex-row relative'>
          <div className={
            sideBar
            ?'flex-none absolute md:relative w-80 flex-col flex h-full z-10 bg-white overflow-hidden transition-all'
            :'flex-none absolute md:relative w-0 md:w-80 flex-col flex h-full z-10 bg-white overflow-hidden transition-all'}>
            <UserSearch other={other} changeConversationHandler={ChangeConversation}></UserSearch>
            <ConversationList user={user} other={other} changeConversationHandler={ChangeConversation}></ConversationList>
          </div>
          <div className='hidden md:block w-0.5 bg-slate-200 mx-2'></div>
          <Chat user={user} other={other}></Chat>
        </div>
      </div>
      </main>
    </>
  )
}

export default Home
