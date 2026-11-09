export const preparePrint = async (root: HTMLElement): Promise<void> => {
  await document.fonts.ready
  await Promise.all(
    Array.from(root.querySelectorAll<HTMLImageElement>("img")).map((image) => {
      if (image.complete) return
      const { promise, resolve } = Promise.withResolvers<void>()
      const done = () => resolve()
      image.addEventListener("load", done, { once: true })
      image.addEventListener("error", done, { once: true })
      return promise
    })
  )
}
