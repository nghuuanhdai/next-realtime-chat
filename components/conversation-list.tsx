import { LoremIpsum } from "lorem-ipsum";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { IUser } from "../types";

type Props = {
  user: IUser|null,
  other: IUser|null,
  changeConversationHandler: (userId: string)=>void
}

const ConversationList: React.FC<Props> = ({user, other, changeConversationHandler}) =>{
  const userUrl = '/api/user' 
  async function fetcher()
  {
    const res = await fetch(userUrl, {method: 'GET'})
    const data = await res.json()
    return data.conversations
  }
  const { data:conversations, error: fetchConversationErr } = useSWR<IUser[]>(userUrl, fetcher, {fallback: []})

  function ChooseConversation(user:IUser) {
    return function HandleChoseConversation(evt: React.MouseEvent<HTMLButtonElement>)
    {
      changeConversationHandler(user._id)
    }
  }
  return (
    <>
      <h2 className='font-bold text-3xl text-amber-400'>Conversations</h2>
      <div className='w-full h-0.5 bg-slate-200 mb-3 mt-0'></div>
      <div className='overflow-auto px-2 flex-auto min-h-0'>
        <ul className='pb-2 mt-1'>
          {
            conversations?.map(user => (
              <li key={user._id}>
                <button onClick={ChooseConversation(user)} className={user._id!==other?._id?'text-left w-full p-2 font-semibold text-black/70 text-xl hover:text-sky-500':'text-left w-full rounded-lg p-2 font-semibold bg-amber-400 text-white text-xl'}>{user.username}</button>
              </li>
            ))
          }
        </ul>
      </div>
    </>
  )
}

export default ConversationList;