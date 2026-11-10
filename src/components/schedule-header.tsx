import { useLayoutEffect, useRef, useState } from "react"
import { formatDate } from "../utils/time-formatting"

const titleShrink = 3.75

interface ScheduleHeaderProps {
  date: string
  rooms: { id: number; name: string }[]
}

export default function ScheduleHeader({ date, rooms }: ScheduleHeaderProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [sticky, setSticky] = useState(false)
  const [height, setHeight] = useState(0)

  useLayoutEffect(() => {
    const header = ref.current
    const grid = header?.parentElement
    if (!header || !grid) return

    const update = () => {
      const rem =
        parseFloat(
          window.getComputedStyle(document.documentElement).fontSize
        ) || 16
      const top = parseFloat(window.getComputedStyle(header).top)
      const shrink = titleShrink * rem
      const expanded = header.style.top.includes("calc")
      const limit = expanded ? top : top - shrink
      const origin = grid.getBoundingClientRect().top + grid.clientTop
      const size = header.getBoundingClientRect().height

      if (size > 0) setHeight(size + (expanded ? 0 : shrink))
      setSticky(origin <= limit)
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)

    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none"
        style={{ gridColumn: "1 / -1", gridRow: 1, height }}
      />
      <div
        ref={ref}
        className="sticky top-[var(--site-header-height)] z-20 grid grid-cols-subgrid gap-px bg-gray-200"
        style={{
          gridColumn: "1 / -1",
          gridRow: 1,
          alignSelf: "start",
          top: sticky
            ? "var(--site-header-height)"
            : `calc(var(--site-header-height) - ${titleShrink}rem)`,
        }}
      >
        <h2
          className={`col-span-full bg-white font-bold text-gray-900 text-center ${sticky ? "text-base py-2" : "text-3xl py-8"}`}
        >
          {formatDate(date)}
        </h2>
        <div className="bg-gray-100 p-4 font-bold text-center">Time</div>
        {rooms.map((room) => (
          <div key={room.id} className="bg-gray-100 p-4 font-bold text-center">
            {room.name}
          </div>
        ))}
      </div>
    </>
  )
}
