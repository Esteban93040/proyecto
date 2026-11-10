import { ThemeProvider, createTheme } from '@mui/material/styles'
import './App.css'
import Navbar from './components/organism/Navbar'

const theme = createTheme({
  typography: {
    fontFamily: '"Bangers", system-ui, sans-serif',
  }
})

function App() {

  return (
    <ThemeProvider theme={theme}>
      <Navbar />
    </ThemeProvider>
  )
}

export default App
