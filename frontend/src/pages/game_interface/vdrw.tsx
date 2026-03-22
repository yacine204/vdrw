import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Canvas from "./canvas";
import Brush from "./brush";
import Chat from "./chat";
import { useDrawing } from "../hooks/useDrawing";
import game_urls from "../../api/game";

function Vdrw({
  user,
}: {
  user: { id: number; pseudo: string; email: string };
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const navigate = useNavigate();
  const [party_id, setPartyId] = useState<number | null>(null);
  const [round_duration, setRoundDuration] = useState(60);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const userRes = await axios.get(game_urls.user_in_game, {
        params: { user_id: user.id },
      });
      const party_id = userRes.data.user_in_game.party_id;
      setPartyId(party_id);

      const partyRes = await axios.get(game_urls.party_info, {
        params: { party_id },
      });
      setRoundDuration(partyRes.data.party.round_time ?? 60);

      const hostRes = await axios.get(game_urls.is_host, {
        params: { user_id: user.id, party_id },
      });
      setIsHost(hostRes.data.is_host);
    };
    if (user) fetchSettings();
  }, [user?.id]);

  const {
    color,
    setColor,
    size,
    setSize,
    phase,
    timeLeft,
    round,
    totalRounds,
    currentDrawer,
    gameOver,
    players,
    canDraw,
    clearCanvas,
    sendStroke,
    startGame,
  } = useDrawing({ canvasRef, party_id: party_id!, user, round_duration });

  useEffect(() => {
    if (gameOver) {
      navigate("/menu", { replace: true });
    }
  }, [gameOver, navigate]);

  if (!party_id)
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#87996b" }}>
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: "24px", color: "#fdf6e3" }}>
          Loading...
        </div>
      </div>
    );

  async function terminateParty() {
    try {
      const response = await axios.delete(game_urls.terminate, {
        data: { user_id: user.id },
      });
      console.log(response.data);
      navigate("/menu", { replace: true });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  const getPhaseText = () => {
    switch (phase) {
      case "waiting":
        return "Waiting for game to start...";
      case "drawing":
        return "Everyone is drawing!";
      case "guessing":
        return `Guess ${currentDrawer}'s drawing!`;
      case "game_over":
        return "Game Over!";
      default:
        return "";
    }
  };

  const woodyBtn = {
    marginTop: "300px",
    background: "#5a1a1a",
    color: "#fdf6e3",
    fontFamily: "'Caveat', cursive",
    fontSize: 18,
    fontWeight: 700,
    border: "none",
    borderRadius: "4px",
    padding: "10px 0",
    boxShadow: "inset 0 0 0 2px #7a3030, inset 0 0 0 4px #3a1010, 3px 3px 0 #3a1010, 5px 5px 0 #2a0a0a, 6px 8px 16px rgba(0,0,0,0.3)",
    cursor: "pointer",
    letterSpacing: 1,
    transform: "rotate(0.5deg)",
    borderTop: "1px solid #8a4040",
    transition: "opacity 0.15s, transform 0.15s",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#87996b" }}>
      <div className="flex gap-6 p-6 items-start">
        <div className="flex flex-col gap-3">

          {/* Game info bar */}
          <div className="flex items-center justify-between px-1">
            <span className="text-sm text-[#4a3010]">
              Round {round}/{totalRounds} — {getPhaseText()}
            </span>
            <span className="text-sm font-bold text-[#4a3520]">{timeLeft}s</span>
          </div>

          {/* Players */}
          <div className="flex gap-2 px-1">
            {players.map((p) => (
              <div
                key={p}
                className="flex items-center gap-2 px-4 py-1.5"
                style={{
                  background: p === user.pseudo ? "#4a3010" : "#6b4c2a",
                  color: "#fdf6e3",
                  fontFamily: "'Caveat', cursive",
                  fontSize: "16px",
                  borderRadius: "3px",
                  boxShadow: "inset 0 0 0 2px #8b6340, inset 0 0 0 4px #4a3010, 2px 2px 0 #3a2208, 4px 4px 0 #2a1a08, 5px 6px 12px rgba(0,0,0,0.25)",
                  transform: p === user.pseudo ? "rotate(0.6deg)" : "rotate(-0.4deg)",
                  borderTop: "1px solid #a07848",
                }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: p === user.pseudo ? "#fdf6e3" : "#d4b896" }}
                />
                {p}
              </div>
            ))}
          </div>

          <Canvas
            canvasRef={canvasRef}
            color={color}
            size={size}
            sendStroke={sendStroke}
            canDraw={canDraw}
          />

          {/* Brush controls */}
          {phase === "drawing" && (
            <Brush
              color={color}
              size={size}
              onColorChange={setColor}
              onSizeChange={setSize}
              onClear={clearCanvas}
            />
          )}

          {/* Guessing phase info */}
          {phase === "guessing" && currentDrawer && (
            <div className="text-center text-sm text-[#a08858]">
              Type your guess in the chat! Whose drawing: <strong>{currentDrawer}</strong>
            </div>
          )}

          {gameOver && (
            <div className="text-center text-[#4a3520] font-bold text-lg">
              Game Over
            </div>
          )}

          {phase === "waiting" && (
            <button
              onClick={startGame}
              className="fade-in self-start transition-all active:scale-95"
              style={{
                background: "#6b4c2a",
                color: "#fdf6e3",
                fontFamily: "'Caveat', cursive",
                fontSize: 22,
                fontWeight: 700,
                border: "none",
                borderRadius: "4px",
                padding: "14px 40px",
                boxShadow: "inset 0 0 0 2px #8b6340, inset 0 0 0 4px #4a3010, 3px 3px 0 #3a2208, 6px 6px 0 #2a1a08, 8px 10px 20px rgba(0,0,0,0.3)",
                cursor: "pointer",
                letterSpacing: 1,
                transform: "rotate(-0.8deg)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "rotate(0deg) scale(1.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "rotate(-0.8deg)")}
            >
              start game
            </button>
          )}
        </div>

        {/* Right column — chat + delete */}
        <div className="mt-2 flex flex-col gap-3">
          <Chat user={user} />
          {isHost && (
            <button
              onClick={terminateParty}
              style={woodyBtn}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "rotate(0deg) scale(1.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "rotate(0.5deg)")}
            >
              delete party
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Vdrw;