import React from 'react'
import ReactDOM from 'react-dom/client'
import { ColorModeProvider } from "./components/ui/color-mode"
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider>
        <App />
      </ColorModeProvider>
    </ChakraProvider>
  </React.StrictMode>,
)