// import React from 'react';
// import { Box, Container } from '@mui/material';
// import { styled } from '@mui/material/styles';

// const PublicContainer = styled(Box)(({ theme }) => ({
//   minHeight: '100vh',
//   display: 'flex',
//   flexDirection: 'column',
//   backgroundColor: theme.palette.background.default
// }));

// const PublicLayout = ({ children }) => {
//   return (
//     <PublicContainer>
//       {children}
//     </PublicContainer>
//   );
// };

// export default PublicLayout;


import React from 'react';
import { Box, Container, AppBar, Toolbar, Typography, Button, useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

const PublicContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default,
  position: 'relative',
  width: '100%'
}));

const PublicAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary
}));

const Logo = styled('img')({
  height: '40px',
  marginRight: '10px'
});

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  width: '100%'
}));

const PublicLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <PublicContainer>
      <PublicAppBar position="static">
        <Toolbar>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            flexGrow: 1 
          }}>
            <RouterLink to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <Logo src={logo} alt="DSAngels Logo" />
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                DSAngels
              </Typography>
            </RouterLink>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              component={RouterLink} 
              to="/login" 
              color="inherit" 
              sx={{ fontWeight: 600 }}
            >
              Log In
            </Button>
            <Button 
              component={RouterLink} 
              to="/register" 
              variant="contained" 
              color="primary"
              sx={{ borderRadius: 20 }}
            >
              Sign Up
            </Button>
          </Box>
        </Toolbar>
      </PublicAppBar>

      <MainContent>
        {children}
      </MainContent>

      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          mt: 'auto',
          textAlign: 'center',
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} DSAngels. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </PublicContainer>
  );
};

export default PublicLayout;