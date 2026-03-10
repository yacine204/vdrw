import { Paintbrush, Eraser, Trash2 } from "lucide-react"

type BrushProps = {
  color: string
  size: number
  onColorChange: (c: string) => void
  onSizeChange: (s: number) => void
  onClear: () => void
}

const COLORS = [
  "#2a1a08", "#c0392b", "#e67e22", "#d4ac0d",
  "#1e8449", "#2471a3", "#7d3c98", "#f0ebe0"
]

function Brush({ color, size, onColorChange, onSizeChange, onClear }: BrushProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl px-4 py-3"
      style={{ background: "#fdf6e3", border: "1.5px solid #d4c49a", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>

      <Paintbrush className="h-5 w-5 shrink-0" style={{ color: "#a08858" }} />

      {/* Colors */}
      <div className="flex items-center gap-1.5">
        {COLORS.map(c => (
          <button key={c} onClick={() => onColorChange(c)}
            className="cursor-pointer transition-transform hover:scale-110 focus:outline-none shrink-0"
            style={{
              width: 20, height: 20, borderRadius: "50%", background: c, outline: "none",
              border: color === c ? "2.5px solid #4a3520" : "2px solid #d4c49a",
              transform: color === c ? "scale(1.2) rotate(-4deg)" : undefined,
              boxShadow: color === c ? "1px 1px 0 #c4b080" : "none"
            }} />
        ))}

        {/* Custom color picker */}
        <div className="relative shrink-0 h-5 w-5 cursor-pointer hover:scale-110 transition-transform">
          <div className="h-5 w-5 rounded-full"
            style={{
              background: "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)",
              border: !COLORS.includes(color) ? "2.5px solid #4a3520" : "2px solid #d4c49a"
            }} />
          <input type="color" value={color} onChange={e => onColorChange(e.target.value)}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer rounded-full" />
        </div>
      </div>

      <div className="h-6 w-px shrink-0" style={{ background: "#d4c49a" }} />

      {/* Size slider + circle preview */}
      <div className="flex items-center gap-3">
        <input type="range" min={2} max={40} value={size}
          onChange={e => onSizeChange(Number(e.target.value))}
          className="w-24 cursor-pointer accent-[#4a3520]" />
        <div className="flex items-center justify-center shrink-0" style={{ width: 24, height: 24 }}>
          <div className="rounded-full transition-all"
            style={{
              width: Math.min(size, 24),
              height: Math.min(size, 24),
              background: color,
              border: "1px solid #d4c49a"
            }} />
        </div>
      </div>

      {/* Spacer pushes eraser+clear to the right */}
      <div className="flex-1" />

      <div className="h-6 w-px shrink-0" style={{ background: "#d4c49a" }} />

      <button onClick={() => onColorChange("#fffef9")}
        className="rounded-lg p-1.5 transition-colors hover:bg-[#f0e8d0] shrink-0" style={{ color: "#a08858" }}>
        <Eraser className="h-5 w-5" />
      </button>

      <button onClick={onClear}
        className="rounded-lg p-1.5 transition-colors hover:bg-red-50 shrink-0" style={{ color: "#c0392b99" }}>
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  )
}

export default Brush