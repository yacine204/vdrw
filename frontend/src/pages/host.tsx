import axios from "axios"
import { useState } from "react"
import game_urls from "../api/game"
import { useNavigate } from "react-router-dom"

type PartyType = {
  name: string
  party_status: "PRIVATE" | "PUBLIC"
  total_rounds: number
  round_time: number
  max_players: number
}

type User = {
  id: number
  pseudo: string
  email: string
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Architects+Daughter&display=swap');

  .host-outer {
    position: relative;
    display: inline-block;
    padding-top: 18px;
  }

  .host-tape {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%) rotate(-1.5deg);
    width: 80px;
    height: 28px;
    background: rgba(255, 240, 180, 0.8);
    border: 1px solid rgba(200, 180, 120, 0.5);
    border-radius: 2px;
    z-index: 10;
    box-shadow: 0 1px 4px rgba(0,0,0,0.12);
  }

  .host-wrap {
    width: 360px;
    background: #fdf6e3;
    border-radius: 2px 14px 4px 10px;
    font-family: 'Architects Daughter', cursive;
    position: relative;
    z-index: 1;
    transform: rotate(-0.8deg) skewX(-0.3deg);
    box-shadow:
      2px 2px 0 #e8d9b5,
      4px 4px 0 #ddd0a8,
      6px 6px 0 #d0c090,
      8px 8px 18px rgba(0,0,0,0.15);
    border: 1.5px solid #d4c49a;
    overflow: hidden;
  }

  .host-wrap::after {
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

  .host-header {
    padding: 14px 20px 12px;
    border-bottom: 2px solid #d4c49a;
    background: #f7edcc;
    position: relative;
    z-index: 2;
    transform: skewY(0.4deg);
  }

  .host-title {
    font-family: 'Caveat', cursive;
    font-size: 30px;
    font-weight: 700;
    color: #4a3520;
    transform: rotate(-1deg);
    display: inline-block;
  }

  .host-body {
    padding: 28px 26px 26px;
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .host-row {
    display: flex;
    gap: 12px;
  }

  .host-field {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .field-label {
    font-family: 'Caveat', cursive;
    font-size: 17px;
    color: #a08858;
    margin-bottom: 6px;
    display: block;
    transform: rotate(-0.4deg);
  }

  .field-input {
    width: 100%;
    background: #fffde7;
    border: 1.5px solid #d4c49a;
    border-radius: 4px 8px 6px 4px;
    padding: 10px 14px;
    font-family: 'Architects Daughter', cursive;
    font-size: 16px;
    color: #3a2a10;
    outline: none;
    box-sizing: border-box;
    transform: rotate(0.2deg);
    box-shadow: inset 1px 1px 3px rgba(0,0,0,0.06);
    transition: border-color 0.15s;
  }

  .field-input::placeholder { color: #c4a870; }
  .field-input:focus { border-color: #a08858; }

  .field-select {
    width: 100%;
    background: #fffde7;
    border: 1.5px solid #d4c49a;
    border-radius: 4px 8px 6px 4px;
    padding: 10px 14px;
    font-family: 'Architects Daughter', cursive;
    font-size: 16px;
    color: #3a2a10;
    outline: none;
    box-sizing: border-box;
    transform: rotate(0.2deg);
    box-shadow: inset 1px 1px 3px rgba(0,0,0,0.06);
    cursor: pointer;
    appearance: none;
  }

  .host-btn {
    background: #4a3520;
    color: #fdf6e3;
    border: none;
    border-radius: 4px 8px 4px 6px;
    font-family: 'Caveat', cursive;
    font-size: 24px;
    font-weight: 700;
    padding: 10px 0;
    cursor: pointer;
    transform: rotate(-0.6deg);
    box-shadow: 2px 2px 0 #2a1a08;
    transition: opacity 0.15s, transform 0.15s;
    margin-top: 4px;
  }

  .host-btn:hover {
    opacity: 0.85;
    transform: rotate(0deg) scale(1.03);
  }
`

function Host({ user }: { user: User }) {
  const navigate = useNavigate()
  const [party, setParty] = useState<PartyType>({
    name: "",
    party_status: "PUBLIC",
    total_rounds: 1,
    round_time: 1,
    max_players: 1,
  })

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setParty(prev => ({
      ...prev,
      [name]: name === "total_rounds" || name === "round_time" || name === "max_players"
        ? Number(value)
        : value,
    }))
  }

  async function handleHosting() {
    try {
      const response = await axios.post(game_urls.host, { user_id: user.id, data: party })
      console.log("party created:", response.data)
      navigate("/vdrw")
    } catch (err: any) {
      console.log(err.response?.data)
    }
  }

  if (!user) return <div>must be logged</div>

  return (
    <>
      <style>{styles}</style>
      <div className="host-outer">
        <div className="host-tape" />
        <div className="host-wrap">
          <div className="host-header">
            <span className="host-title">host a party</span>
          </div>
          <div className="host-body">
            <div className="host-field">
              <label className="field-label">party name</label>
              <input
                className="field-input"
                name="name"
                value={party.name}
                onChange={handleOnChange}
                placeholder=""
              />
            </div>

            <div className="host-field">
              <label className="field-label">visibility</label>
              <select
                className="field-select"
                name="party_status"
                value={party.party_status}
                onChange={handleOnChange}
              >
                <option value="PUBLIC">public</option>
                <option value="PRIVATE">private</option>
              </select>
            </div>

            <div className="host-row">
              <div className="host-field">
                <label className="field-label">rounds</label>
                <input
                  className="field-input"
                  type="number"
                  min={1}
                  max={5}
                  name="total_rounds"
                  value={party.total_rounds}
                  onChange={handleOnChange}
                />
              </div>
              <div className="host-field">
                <label className="field-label">time / round</label>
                <input
                  className="field-input"
                  type="number"
                  min={1}
                  max={3}
                  name="round_time"
                  value={party.round_time}
                  onChange={handleOnChange}
                />
              </div>
              <div className="host-field">
                <label className="field-label">max players</label>
                <input
                  className="field-input"
                  type="number"
                  min={1}
                  max={6}
                  name="max_players"
                  value={party.max_players}
                  onChange={handleOnChange}
                />
              </div>
            </div>

            <button className="host-btn" onClick={handleHosting}>HOST ↑</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Host