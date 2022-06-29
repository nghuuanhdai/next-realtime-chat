import { IMessage } from "../types"

type Props = {
  message: IMessage,
  myChat: Boolean
}

const ChatMessage: React.FC<Props> = ({message, myChat})=>{
  return (
    <div className="mb-2">
      <div className={(myChat?"bg-blue-400 rounded-md p-3 m-2 text-white mb-0":"bg-amber-400 rounded-md p-3 m-2 text-white mb-0")}>
        <p style={{whiteSpace: "pre-line"}}>{message.message}</p>
        <p className="text-right text-white/80 text-xs mt-5">Send by <span className="font-bold">{message.sender.username}</span></p>
      </div>
      <p className={myChat?"text-right text-xs text-black/50 mx-2":"text-xs text-black/50 mx-2"}>{new Date(message.sendTime).toUTCString()}</p>
    </div>
  )
}

export default ChatMessage

