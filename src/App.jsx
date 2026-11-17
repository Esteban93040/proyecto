import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import './App.css'
import { LangProvider } from './context/LangContext'
import Navbar from './components/organism/Navbar'
import AboutMe from './components/organism/AboutMe'
import Projects from './components/organism/Projects'
import Contact from './components/organism/Contact'

const theme = createTheme({
  typography: {
    fontFamily: '"Bangers", system-ui, sans-serif',
  },
  palette: {
    mode: 'dark',
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LangProvider>
        <Navbar />
        <AboutMe />
        <Projects />
        <Contact />
      </LangProvider>
    </ThemeProvider>
  )
}

export default App
