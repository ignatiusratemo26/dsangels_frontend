import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const LoaderContainer = styled(Box)(({ theme, fullPage }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(3),
  height: fullPage ? '100vh' : 'auto',
  width: '100%',
}));

const AnimatedCircle = styled(CircularProgress)(({ theme }) => ({
  color: theme.palette.secondary.main,
  marginBottom: theme.spacing(2),
}));

const Loader = ({ 
  size = 60, 
  message = "Loading...", 
  fullPage = false,
  showMessage = true
}) => {
  return (
    <LoaderContainer fullPage={fullPage}>
      <AnimatedCircle size={size} thickness={4} />
      {showMessage && (
        <Typography 
          variant="body1" 
          color="text.secondary"
          align="center"
        >
          {message}
        </Typography>
      )}
    </LoaderContainer>
  );
};

export default Loader;