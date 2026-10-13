import assert from "node:assert/strict"
import { test } from "node:test"
import { digest, pagesFor } from "./share-data.mjs"

const data = {
  Grid: [{ timeSlots: [{ rooms: [{ session: { id: "1" } }] }] }],
  Sessions: [
    {
      sessions: [
        {
          id: "1",
          title: 'A & "B"',
          description: "First talk",
          startsAt: "2026-11-19T09:00:00Z",
          endsAt: "2026-11-19T10:00:00Z",
          room: "Workshop",
          categories: [
            { name: "Session format", categoryItems: [{ name: "Workshop" }] },
          ],
        },
      ],
    },
  ],
  Speakers: [
    {
      id: "speaker-1",
      fullName: "Jane Doe",
      tagLine: "Engineer",
      bio: "Speaker bio",
      profilePicture: "https://example.com/jane.jpg",
      sessions: [],
    },
  ],
}

test("creates talk and speaker pages from Sessionize", () => {
  const pages = pagesFor(data)
  assert.equal(
    pages.find((page) => page.pathname === "/schedule/talk/workshop-a-b-1/")
      ?.title,
    'A & "B" | Cloud Native Denmark'
  )
  assert.equal(
    pages.find((page) => page.pathname === "/speakers/jane-doe-speaker1/")
      ?.description,
    "Engineer — Speaker bio"
  )
})

test("digest ignores unrelated API fields and response order", () => {
  const updated = structuredClone(data)
  updated.Sessions[0].sessions[0].status = "changed"
  updated.Speakers[0].sessions = [{ id: 1 }]
  assert.equal(digest(data), digest(updated))
  updated.Sessions[0].sessions[0].title = "Updated"
  assert.notEqual(digest(data), digest(updated))
})

test("talk links show title and type while retaining the Sessionize id", () => {
  const changed = structuredClone(data)
  changed.Sessions[0].sessions[0].title = "New title"
  assert.equal(
    pagesFor(changed).find((page) =>
      page.pathname.startsWith("/schedule/talk/")
    )?.pathname,
    "/schedule/talk/workshop-new-title-1/"
  )
})

test("speaker links keep a stable short id when names change", () => {
  const changed = structuredClone(data)
  changed.Speakers[0].fullName = "Jane Smith"
  assert.equal(
    pagesFor(changed).find((page) => page.pathname.startsWith("/speakers/"))
      ?.pathname,
    "/speakers/jane-smith-speaker1/"
  )
})

test("rejects empty or incomplete responses", () => {
  assert.throws(() => pagesFor({ ...data, Speakers: [] }))
  assert.throws(() => pagesFor({ ...data, Sessions: [] }))
  assert.throws(() => pagesFor({ ...data, Grid: [] }))
})
