import Link from "next/link";
import { IUser } from "../types";

type Props = {
  user: IUser|null
  onTitleClick: Function
}

const Header: React.FC<Props> = ({user, onTitleClick})=>{
  return (
    <>
    {
      user
        ?(
        <div className='flex flex-row p-2 items-start'>
          <h1 className='text-4xl font-bold flex-auto text-blue-400'><button onClick={()=> onTitleClick()}>{user?.username}</button></h1>
          <Link href='/api/logout'><button className='flex-none mt-2 flex-none rounded bg-slate-400 p-2 px-5 text-white font-semibold'>Logout</button></Link>
        </div>
      )
      :(<></>)
    }
    </>
  )
}

export default Header;