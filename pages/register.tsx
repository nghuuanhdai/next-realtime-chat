import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextPage } from "next/types";

const Register: NextPage = ()=>{
  const router = useRouter()
  const {err} = router.query

  return (
    <div className="bg-gradient-to-t from-blue-400 to-indigo-300 h-screen flex items-center">
      <Head>
        <title>Next realtime chat</title>
        <meta name="description" content="realtime chat app with Nextjs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto">
        { err
          ?(<p className="drop-shadow-xl bg-red-400 text-white m-5 p-3 rounded-lg mt-5 max-w-xs mx-auto">{err}</p>)
          :(<></>)
        }
        <form action="/api/register" method="post" className='drop-shadow-xl rounded-xl p-5 bg-white flex flex-col p-2 max-w-xs mx-auto'>
          <h1 className='text-4xl font-bold flex-auto text-amber-400'><Link href='/'>Realtime chat</Link></h1>
          <h2 className='text-2xl font-semibold text-slate-400 mb-5'>Register</h2>
          <label htmlFor='username' className='flex-auto text-black/40 text-sm'>username</label>
          <input name='username' id='username' className='text-blue-900 flex-auto bg-slate-200 rounded-lg p-2' type='text'></input>
          <label htmlFor='email' className='flex-auto text-black/40 text-sm'>email</label>
          <input name='email' id='email' className='text-blue-900 flex-auto bg-slate-200 rounded-lg p-2' type='email'></input>
          <label htmlFor='password' className='flex-auto text-black/40 text-sm'>password</label>
          <input name='password' id='password' className='text-blue-900 flex-auto bg-slate-200 rounded-lg p-2' type='password'></input>
          <button type='submit' className='mt-6 flex-auto rounded bg-blue-400 p-2 text-white font-semibold'>Register</button>
          <p className="text-right text-sm text-blue-400">Already have an account? <span className="underline"><Link href="/login">Login</Link></span></p>
        </form>
      </main>
    </div>
  )
}

export default Register