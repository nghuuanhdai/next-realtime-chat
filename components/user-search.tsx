import { LoremIpsum } from "lorem-ipsum";
import React, { FormEvent, useEffect, useState } from "react";
import { IUser } from "../types";

type Props ={
  other: IUser|null,
  changeConversationHandler: (userId: string)=>void
}

const UserSearch : React.FC<Props> = ({other, changeConversationHandler})=>{
  const [foundUsers, setFoundUsers] = useState<IUser[]>([])
  useEffect(()=>{
    //update search
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
    const founds: IUser[] = []
    for (let i = 0; i < 5; i++) {
      founds.push({
        username: lorem.generateWords(1),
        _id: (2+i).toString()
      })
    }
    setFoundUsers(founds)

  }, [other])
  
  function searchFormSubmit(evt:FormEvent<HTMLFormElement>) {
    evt.preventDefault()
    const formData = new FormData(evt.target as HTMLFormElement)
    console.log(`search for ${formData.get('username')}`)
  }

  function SelectUser(selectedUser: IUser) {
    return function (evt:React.MouseEvent<HTMLButtonElement>) {
      changeConversationHandler(selectedUser._id)
    }
  }
  return (
    <>
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
                  <button onClick={SelectUser(user)} className={user._id!==other?._id?'text-left w-full p-2 font-semibold text-black/70 text-xl hover:text-sky-500':'text-left w-full rounded-lg p-2 font-semibold bg-blue-400 text-white text-xl'}>{user.username}</button>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
      )
      :(<></>)
    }
    </>
  )
}

export default UserSearch;