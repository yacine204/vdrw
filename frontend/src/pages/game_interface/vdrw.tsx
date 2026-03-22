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

  if (!party_id) return <div className="p-6 text-[#4a3520]">Loading...</div>;

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

  return (
    <div className="flex gap-6 p-6 items-start">
      <div className="flex flex-col gap-3">
        {/* Game info bar */}
        <div className="flex items-center justify-between px-1">
          <span className="text-sm text-[#a08858]">
            Round {round}/{totalRounds} — {getPhaseText()}
          </span>
          <span className="text-sm font-bold text-[#4a3520]">{timeLeft}s</span>
        </div>

        {/* Players */}
        <div className="flex gap-2 px-1">
          {players.map((p) => (
            <div
              key={p}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full"
              style={{
                background: p === user.pseudo ? "#4a3520" : "#fdf6e3",
                color: p === user.pseudo ? "#fdf6e3" : "#4a3520",
                border: "1.5px solid #d4c49a",
                fontFamily: "'Caveat', cursive",
                fontSize: "16px",
                boxShadow: "2px 2px 0 #d4c49a",
              }}
            >
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{
                  background: p === user.pseudo ? "#fdf6e3" : "#a08858",
                }}
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

        {/* Brush controls - only show during drawing phase */}
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
            Type your guess in the chat! Whose drawing:{" "}
            <strong>{currentDrawer}</strong>
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
              background: "#4a3520",
              color: "#fdf6e3",
              fontFamily: "'Caveat', cursive",
              fontSize: 22,
              fontWeight: 700,
              border: "none",
              borderRadius: "16px 24px 14px 20px",
              padding: "14px 40px",
              boxShadow:
                "3px 3px 0 #2a1a08, 5px 5px 0 #1a0a00, 6px 8px 18px rgba(0,0,0,0.18)",
              cursor: "pointer",
              letterSpacing: 1,
              transform: "rotate(-0.8deg)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "rotate(0deg) scale(1.03)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "rotate(-0.8deg)")
            }
          >
             start game 
          </button>
        )}
      </div>

      <div className="mt-2">
        <Chat user={user} />
      </div>
    </div>
  );
}

export default Vdrw;
