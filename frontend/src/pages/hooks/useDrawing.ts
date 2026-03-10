import { useEffect, useRef, useState, useCallback } from "react"

type Phase = "waiting" | "drawing" | "guessing" | "game_over"
type Stroke = { x: number; y: number; isStart: boolean; color: string; size: number }
type Drawing = { player: string; strokes: Stroke[] }

export function useDrawing({ canvasRef, party_id, user, round_duration }: {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  party_id: number | null
  user: { id: number; pseudo: string } | null
  round_duration: number
}) {
  const wsRef = useRef<WebSocket | null>(null)
  const localStrokesRef = useRef<Stroke[]>([])
  
  const [color, setColor] = useState("#2a1a08")
  const [size, setSize] = useState(4)
  const [phase, setPhase] = useState<Phase>("waiting")
  const [timeLeft, setTimeLeft] = useState(round_duration)
  const [round, setRound] = useState(1)
  const [totalRounds, setTotalRounds] = useState(1)
  const [currentDrawer, setCurrentDrawer] = useState<string | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [players, setPlayers] = useState<string[]>([])
  const [drawings, setDrawings] = useState<Drawing[]>([])
  const [currentDrawingIndex, setCurrentDrawingIndex] = useState(0)

  const getCtx = useCallback(() => canvasRef.current?.getContext("2d"), [canvasRef])

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = getCtx()
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    localStrokesRef.current = []
  }, [canvasRef, getCtx])

  const replayStroke = useCallback((stroke: Stroke) => {
    const ctx = getCtx()
    if (!ctx) return
    ctx.strokeStyle = stroke.color
    ctx.lineWidth = stroke.size
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    if (stroke.isStart) {
      ctx.beginPath()
      ctx.moveTo(stroke.x, stroke.y)
    } else {
      ctx.lineTo(stroke.x, stroke.y)
      ctx.stroke()
    }
  }, [getCtx])

  const showDrawing = useCallback((strokes: Stroke[]) => {
    const canvas = canvasRef.current
    const ctx = getCtx()
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    strokes.forEach(replayStroke)
  }, [canvasRef, getCtx, replayStroke])

  useEffect(() => {
    if (!party_id || !user) return

    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/draw/room/${party_id}/?pseudo=${user.pseudo}`)
    wsRef.current = ws

    ws.onopen = () => {
      console.log("Draw WebSocket connected")
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      
      switch (data.type) {
        case "init":
          setPlayers(data.players)
          setPhase(data.phase)
          setRound(data.round)
          setTotalRounds(data.totalRounds)
          break

        // No stroke case needed - drawing is private, no live replay

        case "phase":
          setPhase(data.phase)
          setRound(data.round)
          setTotalRounds(data.totalRounds)
          
          if (data.phase === "drawing") {
            // New drawing phase - clear canvas for everyone
            clearCanvas()
            setCurrentDrawer(null)
          }
          
          if (data.phase === "guessing" && data.drawing) {
            // Guessing phase - show one drawing at a time
            setCurrentDrawer(data.drawing.player)
            setCurrentDrawingIndex(data.drawingIndex || 0)
            showDrawing(data.drawing.strokes)
            
            // Store all drawings for navigation (optional)
            if (data.drawingIndex === 0) {
              setDrawings([data.drawing])
            } else {
              setDrawings(prev => [...prev, data.drawing])
            }
          }
          break

        case "timer":
          setTimeLeft(data.timeLeft)
          break

        case "game_over":
          setGameOver(true)
          setPhase("game_over")
          break

        case "player_joined":
          setPlayers(data.players)
          break

        case "player_left":
          setPlayers(data.players)
          break
      }
    }

    ws.onerror = (error) => {
      console.error("Draw WebSocket error:", error)
    }

    ws.onclose = () => {
      console.log("Draw WebSocket closed")
    }

    return () => {
      ws.close()
    }
  }, [party_id, user?.pseudo, replayStroke, showDrawing, clearCanvas])

  const sendStroke = useCallback((stroke: Stroke) => {
    // Only allow drawing during drawing phase
    if (phase !== "drawing" || !user) return
    
    // Store locally
    localStrokesRef.current.push(stroke)
    
    // Send to server
    wsRef.current?.send(JSON.stringify({
      type: "stroke",
      stroke,
      pseudo: user.pseudo
    }))
  }, [phase, user])

  const startGame = useCallback(() => {
    wsRef.current?.send(JSON.stringify({
      type: "start_game",
      round_duration,
      total_rounds: totalRounds
    }))
  }, [round_duration, totalRounds])

  // Check if user can draw (only during drawing phase)
  const canDraw = phase === "drawing"

  return {
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
    drawings,
    currentDrawingIndex,
    canDraw,
    clearCanvas,
    sendStroke,
    startGame,
  }
}