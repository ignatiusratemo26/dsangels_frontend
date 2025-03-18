import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

// Create a styled container for the full-page loader
const FullPageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '80vh', // Use 80vh instead of 100vh to account for headers
  width: '100%',
  padding: theme.spacing(2),
}));

// Create a styled container for the inline loader
const InlineContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  width: '100%',
}));

const Loader = ({ isFullPage = false, message = 'Loading...', size = 40 }) => {
  // Choose the appropriate container based on whether it's a full-page loader
  const Container = isFullPage ? FullPageContainer : InlineContainer;

  return (
    <Container>
      <CircularProgress size={size} color="secondary" />
      {message && (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default Loader;