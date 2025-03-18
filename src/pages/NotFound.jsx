import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { SentimentDissatisfied as SadIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  textAlign: 'center'
}));

const NotFoundPage = () => {
  // Use 'user' instead of 'currentUser'
  const { user, isAuthenticated } = useAuth();
  
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <StyledPaper>
          <SadIcon color="primary" sx={{ fontSize: 100, mb: 2 }} />
          
          <Typography component="h1" variant="h4" gutterBottom>
            404 - Page Not Found
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Sorry, the page you are looking for does not exist or has been moved.
          </Typography>
          
          <Link to={isAuthenticated ? '/app' : '/'} style={{ textDecoration: 'none' }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              sx={{ borderRadius: 2 }}
            >
              Go {isAuthenticated ? 'to Dashboard' : 'Home'}
            </Button>
          </Link>
        </StyledPaper>
      </Box>
    </Container>
  );
};

export default NotFoundPage;