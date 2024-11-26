/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  rootDir: ".",
  moduleNameMapper: {
    "@type/(.*)$": ["src/types/*"],
    "@renderer/components/(.*)$": ["<rootDir>/src/renderer/components/$1"],
    "@renderer/effects/(.*)$": ["<rootDir>/src/renderer/effects/$1"],
    "@renderer/stores/(.*)$": ["<rootDir>/src/renderer/stores/$1"],
    "@renderer/views/(.*)$": ["<rootDir>/src/renderer/views/$1"],
    "@main/caches/(.*)$": ["<rootDir>/src/main/caches/$1"],
    "@main/helpers/(.*)$": ["<rootDir>/src/main/helpers/$1"],
    "@main/services/(.*)$": ["<rootDir>/src/main/services/$1"],
    "@main/store/(.*)$": ["<rootDir>/src/main/store/$1"],
  }
};