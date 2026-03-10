import axios from "axios";
import game_urls from "../api/game";
import { useState } from "react";

type party_status_type = "PUBLIC" | "PRIVATE";

type party_type = {
  id: number;
  name: string;
  code: string;
  max_players: number;
  current_players: number;
  party_status: party_status_type;
};

function Join({
  user
}: {
  user: { id: number; pseudo: string; email: string } | null;
}) {

  const [public_parties, setPB] = useState<party_type[]>([]);
  const [party_code, setPartyCode] = useState<string | "">("")

  async function handleSearchPublicParties() {
    try {
      const response = await axios.get(game_urls.get_all);
      setPB(response.data);
      console.log("data:", response.data);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async function joinPrivateParty(code: string){
    try{
        const response = await axios.post(game_urls.join_private_party,{user_id : user?.id, code: code})
        console.log("party_id:",response.data.party_member.party_id, "user:",user?.id)
        localStorage.setItem("party_id", response?.data?.party_member?.party_id)
    }catch(err){
        console.log(err)
        throw err
    }   
  }

  async function joinPublicParties(party: party_type) {
    try {
      console.log("user_id:", user?.id, "party_id:", party.id);
      const response = await axios.post(game_urls.join_public_party, {
        user_id: user?.id,
        party_id: party?.id,
      });
      localStorage.setItem("party_id", response?.data?.party_member?.party_id)
      console.log("response:", response);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  return (
    <div>
      {user ? (
        <>
          <div>
            <h1>PRIVATE PARTY</h1>
            <input placeholder="CODE" value = {party_code} onChange={(e)=> setPartyCode(e.target.value)}/>
            <button onClick={()=>{joinPrivateParty(party_code)}}>JOIN</button>
          </div>

          <div>
            <h1>PUBLIC PARTIES</h1>
            {public_parties?.length == 0 ? (
              <>
                <button onClick={handleSearchPublicParties}>SEARCH</button>
                <div>no parties available</div>
              </>
            ) : (
              <ul>
                {public_parties.map((party) => (
                  <li key={party.id}>
                    {party.name}-Players:{party.current_players}/
                    {party.max_players}
                    <button onClick={() => joinPublicParties(party)}>
                      JOIN
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      ) : (
        <div>Not allowed</div>
      )}
    </div>
  );
}

export default Join;
