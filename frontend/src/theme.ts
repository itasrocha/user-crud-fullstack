import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const config = defineConfig({
  globalCss: {
    "::selection": {
      bg: "purple.500",
      color: "white",
    },
  },
})

export const system = createSystem(defaultConfig, config)
