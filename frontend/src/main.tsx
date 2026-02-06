import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { ColorModeProvider } from "./components/ui/color-mode"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { AuthProvider } from './features/auth/context/AuthContext'
import App from './App'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={defaultSystem}>
        <ColorModeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ColorModeProvider>
      </ChakraProvider>
    </QueryClientProvider>
  </StrictMode>,
)