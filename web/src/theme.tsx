import { createTheme } from '@mui/material/styles'
import { deepPurple, lightBlue } from '@mui/material/colors'

const theme = createTheme({
  palette: {
    primary: {
      main: deepPurple[500],
    },
    secondary: {
      main: lightBlue[500],
    },
  },
})

export { theme }
