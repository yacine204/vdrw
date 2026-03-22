import { useRef } from "react"

type Stroke = { x: number; y: number; isStart: boolean; color: string; size: number }

type CanvasProps = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  color: string
  size: number
  sendStroke: (stroke: Stroke) => void
  canDraw: boolean
}

function Canvas({ canvasRef, color, size, sendStroke, canDraw }: CanvasProps) {
  const isDrawing = useRef(false)

  const getCtx = () => canvasRef.current?.getContext("2d")

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    const scaleX = canvasRef.current!.width / rect.width
    const scaleY = canvasRef.current!.height / rect.height
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    }
  }

  const draw = (x: number, y: number, isStart: boolean) => {
    if (!canDraw) return
    
    const ctx = getCtx()
    if (!ctx) return
    ctx.strokeStyle = color
    ctx.lineWidth = size
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    if (isStart) { ctx.beginPath(); ctx.moveTo(x, y) }
    else { ctx.lineTo(x, y); ctx.stroke() }
    sendStroke({ x, y, isStart, color, size })
  }

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canDraw) return
    isDrawing.current = true
    const { x, y } = getPos(e)
    draw(x, y, true)
  }

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !canDraw) return
    const { x, y } = getPos(e)
    draw(x, y, false)
  }

  const stop = () => { isDrawing.current = false }

return (
  <div style={{
    padding: "14px",
    background: "#6b4c2a",
    borderRadius: "4px",
    boxShadow:
      "inset 0 0 0 3px #8b6340, inset 0 0 0 6px #4a3010, 4px 4px 0 #3a2208, 8px 8px 0 #2a1a08, 10px 12px 24px rgba(0,0,0,0.35)",
    transform: "rotate(-0.4deg)",
    display: "inline-block",
  }}>
    <canvas
      ref={canvasRef}
      width={1200}
      height={700}
      className="w-full max-w-3xl"
      style={{
        aspectRatio: "12/7",
        background: "#fffef9",
        cursor: canDraw ? "crosshair" : "not-allowed",
        opacity: canDraw ? 1 : 0.9,
        display: "block",
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={stop}
      onMouseLeave={stop}
    />
  </div>
)
}

export default Canvas