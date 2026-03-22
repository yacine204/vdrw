import axios from "axios"
import game_urls from "../api/game"
import { useState } from "react"

type party_status_type = "PUBLIC" | "PRIVATE"
type party_type = {
  id: number
  name: string
  code: string
  max_players: number
  current_players: number
  party_status: party_status_type
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Architects+Daughter&display=swap');

  .join-outer {
    position: relative;
    display: inline-block;
    padding-top: 18px;
  }

  .join-tape {
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

  .join-wrap {
    width: 360px;
    background: #fdf6e3;
    border-radius: 2px 14px 4px 10px;
    font-family: 'Architects Daughter', cursive;
    position: relative;
    z-index: 1;
    transform: rotate(0.6deg) skewX(0.2deg);
    box-shadow:
      2px 2px 0 #e8d9b5,
      4px 4px 0 #ddd0a8,
      6px 6px 0 #d0c090,
      8px 8px 18px rgba(0,0,0,0.15);
    border: 1.5px solid #d4c49a;
    overflow: hidden;
  }

  .join-wrap::after {
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

  .join-header {
    padding: 14px 20px 12px;
    border-bottom: 2px solid #d4c49a;
    background: #f7edcc;
    position: relative;
    z-index: 2;
    transform: skewY(0.4deg);
  }

  .join-title {
    font-family: 'Caveat', cursive;
    font-size: 30px;
    font-weight: 700;
    color: #4a3520;
    transform: rotate(-1deg);
    display: inline-block;
  }

  .join-body {
    padding: 28px 26px 26px;
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .join-section-title {
    font-family: 'Caveat', cursive;
    font-size: 20px;
    font-weight: 700;
    color: #4a3520;
    margin-bottom: 10px;
    transform: rotate(-0.5deg);
    display: inline-block;
  }

  .field-label {
    font-family: 'Caveat', cursive;
    font-size: 17px;
    color: #a08858;
    margin-bottom: 6px;
    display: block;
    transform: rotate(-0.4deg);
  }

  .join-input-row {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .field-input {
    flex: 1;
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

  .join-btn {
    background: #4a3520;
    color: #fdf6e3;
    border: none;
    border-radius: 4px 8px 4px 6px;
    font-family: 'Caveat', cursive;
    font-size: 18px;
    font-weight: 700;
    padding: 10px 18px;
    cursor: pointer;
    transform: rotate(-0.6deg);
    box-shadow: 2px 2px 0 #2a1a08;
    transition: opacity 0.15s, transform 0.15s;
    white-space: nowrap;
  }

  .join-btn:hover {
    opacity: 0.85;
    transform: rotate(0deg) scale(1.03);
  }

  .search-btn {
    background: #fffde7;
    color: #4a3520;
    border: 1.5px solid #d4c49a;
    border-radius: 4px 8px 4px 6px;
    font-family: 'Caveat', cursive;
    font-size: 18px;
    font-weight: 700;
    padding: 10px 18px;
    cursor: pointer;
    transform: rotate(-0.6deg);
    box-shadow: 2px 2px 0 #d4c49a;
    transition: opacity 0.15s, transform 0.15s;
  }

  .search-btn:hover {
    opacity: 0.85;
    transform: rotate(0deg) scale(1.03);
  }

  .divider {
    width: 100%;
    height: 1.5px;
    background: #d4c49a;
    transform: rotate(-0.3deg);
  }

  .party-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .party-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fffde7;
    border: 1.5px solid #d4c49a;
    border-radius: 4px 8px 6px 4px;
    padding: 10px 14px;
    transform: rotate(0.3deg);
    box-shadow: 2px 2px 0 #d4c49a;
  }

  .party-info {
    font-size: 14px;
    color: #3a2a10;
  }

  .party-name {
    font-family: 'Caveat', cursive;
    font-size: 18px;
    font-weight: 700;
    color: #4a3520;
  }

  .party-players {
    font-family: 'Caveat', cursive;
    font-size: 14px;
    color: #a08858;
  }

  .no-parties {
    font-family: 'Caveat', cursive;
    font-size: 16px;
    color: #b09868;
    transform: rotate(0.3deg);
    display: inline-block;
  }
`

function Join({ user }: { user: { id: number; pseudo: string; email: string } | null }) {
  const [public_parties, setPB] = useState<party_type[]>([])
  const [party_code, setPartyCode] = useState<string>("")
  const [searched, setSearched] = useState(false)

  async function handleSearchPublicParties() {
    try {
      const response = await axios.get(game_urls.get_all)
      setPB(response.data)
      setSearched(true)
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async function joinPrivateParty(code: string) {
    try {
      const response = await axios.post(game_urls.join_private_party, { user_id: user?.id, code })
      localStorage.setItem("party_id", response?.data?.party_member?.party_id)
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async function joinPublicParties(party: party_type) {
    try {
      const response = await axios.post(game_urls.join_public_party, {
        user_id: user?.id,
        party_id: party.id,
      })
      localStorage.setItem("party_id", response?.data?.party_member?.party_id)
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  if (!user) return <div style={{ fontFamily: "'Caveat', cursive", color: "#a08858", fontSize: "18px" }}>not allowed</div>

  return (
    <>
      <style>{styles}</style>
      <div className="join-outer">
        <div className="join-tape" />
        <div className="join-wrap">
          <div className="join-header">
            <span className="join-title">join a party</span>
          </div>
          <div className="join-body">

            <div>
              <div className="join-section-title">private</div>
              <div className="join-input-row">
                <input
                  className="field-input"
                  placeholder="enter code..."
                  value={party_code}
                  onChange={(e) => setPartyCode(e.target.value)}
                />
                <button className="join-btn" onClick={() => joinPrivateParty(party_code)}>JOIN ↑</button>
              </div>
            </div>

            <div className="divider" />

            <div>
              <div className="join-section-title">public</div>
              {!searched || public_parties.length === 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <button className="search-btn" onClick={handleSearchPublicParties}>search parties</button>
                  {searched && <span className="no-parties">~ no parties available ~</span>}
                </div>
              ) : (
                <ul className="party-list">
                  {public_parties.map((party) => (
                    <li key={party.id} className="party-item">
                      <div>
                        <div className="party-name">{party.name}</div>
                        <div className="party-players">{party.current_players}/{party.max_players} players</div>
                      </div>
                      <button className="join-btn" onClick={() => joinPublicParties(party)}>JOIN ↑</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default Join