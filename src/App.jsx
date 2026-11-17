import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import './App.css'
import { LangProvider } from './context/LangContext'
import Navbar from './components/organism/Navbar'
import AboutMe from './components/organism/AboutMe'
import LaboralExperience from './components/organism/LaboralExperience'
import Education from './components/organism/Education'
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
        <LaboralExperience />
        <Education />
        <Projects />
        <Contact />
      </LangProvider>
    </ThemeProvider>
  )
}

export default App
