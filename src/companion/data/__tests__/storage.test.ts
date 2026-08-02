import { getItem, setItem, removeItem } from "../storage"

describe("companion storage helpers", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it("returns the fallback when nothing is stored", () => {
    expect(getItem("missing-key", "fallback")).toBe("fallback")
  })

  it("round-trips values through set/get", () => {
    setItem("favorites", ["a", "b", "c"])
    expect(getItem<string[]>("favorites", [])).toEqual(["a", "b", "c"])
  })

  it("namespaces keys so they don't collide with other site storage", () => {
    setItem("role", "admin")
    expect(window.localStorage.getItem("cnd-companion:role")).toBe('"admin"')
  })

  it("removeItem clears a stored value back to the fallback", () => {
    setItem("role", "admin")
    removeItem("role")
    expect(getItem("role", null)).toBeNull()
  })

  it("falls back gracefully on corrupted JSON instead of throwing", () => {
    window.localStorage.setItem("cnd-companion:role", "{not json")
    expect(getItem("role", "safe-fallback")).toBe("safe-fallback")
  })
})
