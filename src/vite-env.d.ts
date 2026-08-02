/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_CONFIG_KEY?: string
  readonly VITE_API_BASE_URL?: string
  readonly VITE_VAPID_PUBLIC_KEY?: string
  readonly VITE_ADMIN_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module "*.svg" {
  import React = require("react")
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}

declare module "*.svg?react" {
  import React = require("react")
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
  export default ReactComponent
}

declare module "*.png" {
  const src: string
  export default src
}

declare module "*.jpg" {
  const src: string
  export default src
}

declare module "*.jpeg" {
  const src: string
  export default src
}

declare module "*.webp" {
  const src: string
  export default src
}
