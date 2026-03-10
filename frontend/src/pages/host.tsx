import axios from "axios";
import { useState } from "react";
import game_urls from "../api/game";
import { useNavigate } from "react-router-dom";

type PartyType = {
  name: string;
  party_status: "PRIVATE" | "PUBLIC";
  total_rounds: number;
  round_time: number;
};

type User = {
  id: number;
  pseudo: string;
  email: string;
};


function Host({ user }: { user: User }) {
  const navigate = useNavigate()

  
  const [party, setParty] = useState<PartyType>({
    name: "",
    party_status: "PUBLIC",
    total_rounds: 1,
    round_time: 1,
  });

  function handleOnChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setParty((prev) => ({
      ...prev,
      [name]:
        name === "total_rounds" || name === "round_time"
          ? Number(value)
          : value,
    }));
  }

  async function handleHosting() {
  try {
    const response = await axios.post(game_urls.host, {user_id: user.id, data:party});
    console.log("party created:", response.data);
    navigate('/vdrw')
    
  } catch (err: any) {
    console.log(err.response?.data); // VERY IMPORTANT
  }
}
  if (!user) return <div>must be logged</div>;

  return (
    <div>
      <div>
        <input
          value={party.name}
          placeholder="party name"
          onChange={handleOnChange}
          name="name"
        />

        <select
          value={party.party_status}
          name="party_status"
          onChange={handleOnChange}
        >
          <option value="PUBLIC">PUBLIC</option>
          <option value="PRIVATE">PRIVATE</option>
        </select>

        <input
          type="number"
          min={0}
          max={5}
          placeholder="total rounds"
          value={party.total_rounds}
          name="total_rounds"
          onChange={handleOnChange}
        />

        <input
          type="number"
          min={0}
          max={3}
          placeholder="time per round"
          value={party.round_time}
          name="round_time"
          onChange={handleOnChange}
        />
      </div>

      <button
        onClick={handleHosting}
      >
        click
      </button>
    </div>
  );
}

export default Host;