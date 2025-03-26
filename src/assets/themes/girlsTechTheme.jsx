import { createTheme } from '@mui/material/styles';

const girlsTechTheme = createTheme({
  palette: {
    primary: {
      main: '#FF6B9E', // Bright pink
      light: '#FF9BBF',
      dark: '#D94A7D',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#9C6AFF', // Purple
      light: '#C9A6FF',
      dark: '#7049CC',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#FF5252',
    },
    warning: {
      main: '#FFC107',
    },
    info: {
      main: '#64B5F6',
    },
    success: {
      main: '#4CAF50',
    },
    background: {
      default: '#FFFAFD', // Very light pink
      paper: '#FFFFFF',
    },
    text: {
      primary: '#3F3356', // Dark purple for text
      secondary: '#6E6887',
    },
  },
  typography: {
    fontFamily: '"Nunito", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      color: '#3F3356',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      color: '#3F3356',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.1rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          padding: '10px 20px',
          fontSize: '1rem',
          boxShadow: '0 3px 5px 2px rgba(255, 107, 158, .15)',
        },
        outlinedPrimary: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 24px rgba(149, 157, 165, 0.15)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
        },
      },
    },
  },
});

export default girlsTechTheme;