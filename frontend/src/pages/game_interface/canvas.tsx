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
    <canvas
      ref={canvasRef}
      width={1200}
      height={700}
      className="w-full max-w-3xl rounded-2xl"
      style={{
        aspectRatio: "12/7",
        background: "#fffef9",
        border: "1.5px solid #d4c49a",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        cursor: canDraw ? "crosshair" : "not-allowed",
        opacity: canDraw ? 1 : 0.9,
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={stop}
      onMouseLeave={stop}
    />
  )
}

export default Canvas