module.exports = {
  preset: 'ts-jest',
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/*.(test|spec).+(ts|tsx|js)"
  ],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "identity-obj-proxy"
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/pages/**/*",
    "!src/templates/**/*"
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/public/",
    "/.cache/",
    "/coverage/"
  ],
  testPathIgnorePatterns: ["/node_modules/", "/.cache/", "/public/"],
  transformIgnorePatterns: [
    "node_modules/(?!(gatsby|gatsby-script|gatsby-link)/)"
  ],
  globals: {
    __PATH_PREFIX__: "",
  },
  testEnvironmentOptions: {
    url: "http://localhost"
  },
  setupFiles: ["<rootDir>/loadershim.js"]
}