import { BrowserRouter } from "react-router-dom"
import { AppProvider } from "./contexts/AppContext"
import { AppRoutes } from "./AppRoutes"
import '../src/styles/global.css'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  )
}