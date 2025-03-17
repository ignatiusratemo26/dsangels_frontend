import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Avatar, useTheme } from '@mui/material';
import { Star } from '@mui/icons-material';

const AchievementCard = ({ id, name, description, imageUrl, pointsValue }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 3px 5px rgba(0,0,0,0.1)',
        },
      }}
    >
      <Avatar
        src={imageUrl}
        alt={name}
        sx={{
          width: 56,
          height: 56,
          border: `2px solid ${theme.palette.secondary.main}`,
        }}
      />
      
      <Box sx={{ ml: 2, flexGrow: 1 }}>
        <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description.length > 60 ? `${description.substring(0, 60)}...` : description}
        </Typography>
      </Box>
      
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: theme.palette.secondary.light,
          color: theme.palette.secondary.contrastText,
          borderRadius: 1,
          px: 1,
          py: 0.5,
        }}
      >
        <Star fontSize="small" />
        <Typography variant="body2" sx={{ ml: 0.5 }}>
          {pointsValue}
        </Typography>
      </Box>
    </Box>
  );
};

AchievementCard.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  pointsValue: PropTypes.number
};

export default AchievementCard;