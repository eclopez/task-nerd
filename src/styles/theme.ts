'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0baf4e',
      light: '#8cca31',
      dark: '#00672b',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#027bbd',
      light: '#379ade',
      dark: '#005a99',
    },
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif',
  },
});

export { theme };
