import { formatPlainTextToHtml } from "../text-formatting"

describe("formatPlainTextToHtml", () => {
  it("returns an empty string for null, undefined, empty, and whitespace-only input", () => {
    expect(formatPlainTextToHtml(null)).toBe("")
    expect(formatPlainTextToHtml(undefined)).toBe("")
    expect(formatPlainTextToHtml("")).toBe("")
    expect(formatPlainTextToHtml(" \r\n  ")).toBe("")
  })

  it("formats a single paragraph", () => {
    expect(formatPlainTextToHtml("A single paragraph.")).toBe(
      "<p>A single paragraph.</p>"
    )
  })

  it("formats paragraphs separated by CRLF blank lines", () => {
    expect(
      formatPlainTextToHtml("First paragraph.\r\n\r\nSecond paragraph.")
    ).toBe("<p>First paragraph.</p><p>Second paragraph.</p>")
  })

  it("collapses three or more newlines to one paragraph break", () => {
    expect(
      formatPlainTextToHtml("First paragraph.\n\n\n\nSecond paragraph.")
    ).toBe("<p>First paragraph.</p><p>Second paragraph.</p>")
  })

  it("uses a line break for a single CRLF", () => {
    expect(formatPlainTextToHtml("First line.\r\nSecond line.")).toBe(
      "<p>First line.<br />Second line.</p>"
    )
  })

  it("uses a line break for LF-only input", () => {
    expect(formatPlainTextToHtml("First line.\nSecond line.")).toBe(
      "<p>First line.<br />Second line.</p>"
    )
  })

  it("formats dash, asterisk, and bullet character lists", () => {
    expect(formatPlainTextToHtml("- One\n- Two")).toBe(
      "<ul><li>One</li><li>Two</li></ul>"
    )
    expect(formatPlainTextToHtml("* One\n* Two")).toBe(
      "<ul><li>One</li><li>Two</li></ul>"
    )
    expect(formatPlainTextToHtml("• One\n• Two")).toBe(
      "<ul><li>One</li><li>Two</li></ul>"
    )
  })

  it("keeps a lead-in paragraph and following asterisk bullets as separate runs", () => {
    expect(formatPlainTextToHtml("What you will learn:\n* One\n* Two")).toBe(
      "<p>What you will learn:</p><ul><li>One</li><li>Two</li></ul>"
    )
  })

  it("keeps trailing prose after bullets as a paragraph run", () => {
    expect(formatPlainTextToHtml("- One\n- Two\nTrailing prose.")).toBe(
      "<ul><li>One</li><li>Two</li></ul><p>Trailing prose.</p>"
    )
  })

  it("does not merge separate bullet runs divided by prose", () => {
    expect(formatPlainTextToHtml("- One\nProse between runs.\n- Two")).toBe(
      "<ul><li>One</li></ul><p>Prose between runs.</p><ul><li>Two</li></ul>"
    )
  })

  it("escapes HTML-sensitive content exactly once", () => {
    expect(formatPlainTextToHtml("<script>alert('x')</script>")).toBe(
      "<p>&lt;script&gt;alert(&#39;x&#39;)&lt;/script&gt;</p>"
    )
    expect(formatPlainTextToHtml("D&D")).toBe("<p>D&amp;D</p>")
    expect(formatPlainTextToHtml('A "literal" quote')).toBe(
      "<p>A &quot;literal&quot; quote</p>"
    )
    expect(formatPlainTextToHtml("a -> b")).toBe("<p>a -&gt; b</p>")
  })

  it("escapes content inside list items", () => {
    expect(formatPlainTextToHtml("- <script>alert('x')</script>")).toBe(
      "<ul><li>&lt;script&gt;alert(&#39;x&#39;)&lt;/script&gt;</li></ul>"
    )
  })

  it("does not treat emphasis or negative numbers as bullets", () => {
    expect(formatPlainTextToHtml("*emphasis* matters")).toBe(
      "<p>*emphasis* matters</p>"
    )
    expect(formatPlainTextToHtml("-5 degrees")).toBe("<p>-5 degrees</p>")
  })

  it("leaves headings and numbered lines as paragraph text", () => {
    expect(formatPlainTextToHtml("### Heading\n1. Numbered line")).toBe(
      "<p>### Heading<br />1. Numbered line</p>"
    )
  })
})
