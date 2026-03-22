import axios from "axios"
import game_urls from "../../api/game"
import { useEffect, useRef, useState } from "react"

type message_type = {
  message: string
  pseudo: string
  sent_at: string
  isSystem: boolean
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Architects+Daughter&display=swap');

  .chat-outer {
    position: relative;
    display: inline-block;
    padding-top: 12px;
  }

  .tape {
    position: absolute;
    top: 0px;
    left: 50%;
    transform: translateX(-50%) rotate(-1.5deg);
    width: 64px;
    height: 24px;
    background: rgba(255, 240, 180, 0.8);
    border: 1px solid rgba(200, 180, 120, 0.5);
    border-radius: 2px;
    z-index: 10;
    box-shadow: 0 1px 4px rgba(0,0,0,0.12);
  }

  .chat-wrap {
    display: flex;
    flex-direction: column;
    height: 440px;
    width: 290px;
    background: #fdf6e3;
    border-radius: 2px 12px 4px 8px;
    overflow: hidden;
    font-family: 'Architects Daughter', cursive;
    position: relative;
    z-index: 1;
    transform: rotate(-0.8deg) skewX(-0.3deg);
    box-shadow:
      2px 2px 0 #e8d9b5,
      4px 4px 0 #ddd0a8,
      6px 6px 0 #d0c090,
      8px 8px 14px rgba(0,0,0,0.15);
    border: 1.5px solid #d4c49a;
  }

  .chat-wrap::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: repeating-linear-gradient(
      transparent,
      transparent 27px,
      #e8dfc8 27px,
      #e8dfc8 28.5px
    );
    pointer-events: none;
    z-index: 0;
    opacity: 0.6;
  }

  .chat-header {
    padding: 10px 14px 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 2;
    border-bottom: 2px solid #d4c49a;
    background: #f7edcc;
    transform: skewY(0.4deg);
  }

  .chat-header-title {
    font-family: 'Caveat', cursive;
    font-size: 22px;
    font-weight: 700;
    color: #4a3520;
    letter-spacing: 0.5px;
    transform: rotate(-1deg);
    display: inline-block;
  }

  .status {
    font-family: 'Caveat', cursive;
    font-size: 13px;
    color: #a08858;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    transition: background 0.3s;
  }

  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 7px;
    scrollbar-width: none;
    position: relative;
    z-index: 2;
  }

  .messages::-webkit-scrollbar { display: none; }

  .msg-system {
    text-align: center;
    font-family: 'Caveat', cursive;
    font-size: 12px;
    color: #b09868;
    padding: 1px 0;
    transform: rotate(0.3deg);
  }

  .msg-me {
    align-self: flex-end;
    background: #fffde7;
    color: #3a2a10;
    border-radius: 8px 2px 8px 8px;
    padding: 6px 10px;
    max-width: 76%;
    border: 1.5px solid #d4c49a;
    transform: rotate(0.6deg) skewX(0.2deg);
    box-shadow: 2px 2px 0 #d4c49a;
  }

  .msg-other {
    align-self: flex-start;
    background: #fff8e1;
    color: #3a2a10;
    border-radius: 2px 8px 8px 8px;
    padding: 6px 10px;
    max-width: 76%;
    border: 1.5px solid #d4c49a;
    transform: rotate(-0.5deg) skewX(-0.3deg);
    box-shadow: 2px 2px 0 #d4c49a;
  }

  .msg-me:nth-child(odd) { transform: rotate(0.9deg); }
  .msg-other:nth-child(even) { transform: rotate(-0.8deg); }

  .msg-pseudo {
    font-family: 'Caveat', cursive;
    font-size: 12px;
    color: #a08858;
    margin-bottom: 1px;
    font-weight: 700;
  }

  .msg-text {
    font-size: 13px;
    line-height: 1.4;
  }

  .msg-time {
    font-family: 'Caveat', cursive;
    font-size: 10px;
    color: #b8a070;
    margin-top: 3px;
    text-align: right;
  }

  .chat-input-row {
    display: flex;
    border-top: 2px solid #d4c49a;
    padding: 8px 10px;
    gap: 7px;
    align-items: center;
    background: #f7edcc;
    position: relative;
    z-index: 2;
    transform: skewY(-0.3deg);
  }

  .chat-input {
    flex: 1;
    background: #fffde7;
    border: 1.5px solid #d4c49a;
    border-radius: 4px 8px 6px 4px;
    padding: 6px 10px;
    font-family: 'Architects Daughter', cursive;
    font-size: 12px;
    color: #3a2a10;
    outline: none;
    transform: rotate(0.2deg);
    transition: border-color 0.15s;
    box-shadow: inset 1px 1px 3px rgba(0,0,0,0.06);
  }

  .chat-input::placeholder { color: #c4a870; }
  .chat-input:focus { border-color: #a08858; }

  .send-btn {
    background: #4a3520;
    border: none;
    border-radius: 4px 8px 4px 6px;
    color: #fdf6e3;
    width: 32px;
    height: 32px;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transform: rotate(-1deg);
    transition: opacity 0.15s, transform 0.15s;
    font-family: 'Caveat', cursive;
    font-weight: 700;
    box-shadow: 2px 2px 0 #2a1a08;
  }

  .send-btn:hover {
    opacity: 0.85;
    transform: rotate(0deg) scale(1.05);
  }
`

function Message({ msg, currentUser }: { msg: message_type; currentUser: string }) {
  const isMe = msg.pseudo === currentUser

  if (msg.isSystem) {
    return <div className="msg-system">~ {msg.message} ~</div>
  }

  return (
    <div className={isMe ? "msg-me" : "msg-other"}>
      {!isMe && <div className="msg-pseudo">{msg.pseudo}</div>}
      <div className="msg-text">{msg.message}</div>
      <div className="msg-time">{msg.sent_at}</div>
    </div>
  )
}

function Chat({ user }: { user: { id: number; pseudo: string; email: string } }) {
  const [party_id, setPartyId] = useState<number | null>(null)
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [messages, setMessages] = useState<message_type[]>([])
  const wsRef = useRef<WebSocket | null>(null)
  const [input, setInput] = useState<string>("")
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const wsBase = (import.meta.env.VITE_WS_URL as string) || (import.meta.env.DEV ? "ws://127.0.0.1:8000" : "wss://vdrw.onrender.com")

  const get_party_id = async () => {
    try {
      const response = await axios.get(game_urls.user_in_game, { params: { user_id: user?.id } })
      setPartyId(response.data.user_in_game.party_id)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (user) get_party_id()
  }, [user?.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (!party_id) return
    const ws = new WebSocket(`${wsBase}/ws/chat/room/${party_id}/?pseudo=${user?.pseudo}`)
    wsRef.current = ws

    ws.onopen = () => setIsConnected(true)
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setMessages(prev => [...prev, {
        pseudo: data.pseudo,
        message: data.message,
        sent_at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isSystem: data.pseudo === "System"
      }])
    }
    ws.onclose = () => setIsConnected(false)
    ws.onerror = (e) => console.log(e)

    return () => ws.close()
  }, [party_id, user?.pseudo])

  const send_message = () => {
    if (wsRef.current && input.trim() !== "") {
      wsRef.current.send(JSON.stringify({ message: input, pseudo: user.pseudo }))
      setInput("")
    }
  }

  if (!party_id) return (
    <div style={{ fontFamily: "'Caveat', cursive", color: "#a08858", fontSize: "15px" }}>
      join a party to chat
    </div>
  )

  return (
    <>
      <style>{styles}</style>
      <div className="chat-outer">
        <div className="tape" />
        <div className="chat-wrap">
          <div className="chat-header">
            <span className="chat-header-title">chat</span>
            <div className="status">
              <div className="dot" style={{ background: isConnected ? "#7aab58" : "#c4a870" }} />
              {isConnected ? "live" : "offline"}
            </div>
          </div>

          <div className="messages">
            {messages.map((msg, idx) => (
              <Message key={idx} msg={msg} currentUser={user.pseudo} />
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="chat-input-row">
            <input
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send_message()}
              placeholder="write something..."
            />
            <button className="send-btn" onClick={send_message}>↑</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Chat