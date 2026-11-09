import { formatEventTime } from "../time-formatting"

it("preserves event-local times and converts offset timestamps to Copenhagen time", () => {
  expect(formatEventTime("2026-11-19T10:25:00")).toBe("10:25")
  expect(formatEventTime("2026-11-19T09:25:00Z")).toBe("10:25")
  expect(formatEventTime("2026-07-19T08:25:00Z")).toBe("10:25")
})
