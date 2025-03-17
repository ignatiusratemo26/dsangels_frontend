import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import { Star, EmojiEvents, School, Today, Diversity3 } from '@mui/icons-material';

const DashboardStats = ({ completedCount, inProgressCount, totalPoints, joinedDays, averageDifficulty }) => {
  const theme = useTheme();

  const stats = [
    {
      icon: <School sx={{ fontSize: 28, color: theme.palette.primary.main }} />,
      value: completedCount,
      label: 'Completed',
    },
    {
      icon: <Diversity3 sx={{ fontSize: 28, color: theme.palette.primary.main }} />,
      value: inProgressCount,
      label: 'In Progress',
    },
    {
      icon: <Star sx={{ fontSize: 28, color: theme.palette.secondary.main }} />,
      value: totalPoints,
      label: 'Points',
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 28, color: theme.palette.success.main }} />,
      value: averageDifficulty.toFixed(1),
      label: 'Avg. Difficulty',
    },
    {
      icon: <Today sx={{ fontSize: 28, color: theme.palette.info.main }} />,
      value: joinedDays,
      label: 'Days Active',
    },
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Your Learning Stats</Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {stats.map((stat, index) => (
          <Grid item xs={6} sm={4} md={4} key={index}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 1.5,
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
                height: '100%',
              }}
            >
              {stat.icon}
              <Typography 
                variant="h5" 
                sx={{ 
                  my: 1, 
                  fontWeight: 'bold',
                  color: theme.palette.text.primary
                }}
              >
                {stat.value}
              </Typography>
              <Typography 
                variant="body2"
                sx={{ 
                  textAlign: 'center',
                  color: theme.palette.text.secondary
                }}
              >
                {stat.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

DashboardStats.propTypes = {
  completedCount: PropTypes.number.isRequired,
  inProgressCount: PropTypes.number.isRequired,
  totalPoints: PropTypes.number.isRequired,
  joinedDays: PropTypes.number.isRequired,
  averageDifficulty: PropTypes.number.isRequired
};

export default DashboardStats;