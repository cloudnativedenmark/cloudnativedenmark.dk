import { renderHook, act } from "@testing-library/react"
import { useFavorites } from "../use-favorites"

describe("useFavorites", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it("starts with no favorites", () => {
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites).toEqual([])
    expect(result.current.isFavorite("sess-1")).toBe(false)
  })

  it("toggles a session in and out of favorites", () => {
    const { result } = renderHook(() => useFavorites())

    act(() => result.current.toggleFavorite("sess-1"))
    expect(result.current.isFavorite("sess-1")).toBe(true)

    act(() => result.current.toggleFavorite("sess-1"))
    expect(result.current.isFavorite("sess-1")).toBe(false)
  })

  it("persists across remounts (simulating an app restart)", () => {
    const first = renderHook(() => useFavorites())
    act(() => first.result.current.toggleFavorite("sess-1"))
    first.unmount()

    const second = renderHook(() => useFavorites())
    expect(second.result.current.isFavorite("sess-1")).toBe(true)
  })
})
