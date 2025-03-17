import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';

const ProgressBar = ({ value, total, height, color, showLabel = true }) => {
  const percentage = Math.min(Math.round((value / total) * 100), 100);
  
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: showLabel ? 0.5 : 0 }}>
        <Box
          sx={{
            width: '100%',
            height: height || 8,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            borderRadius: height || 8,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${percentage}%`,
              backgroundColor: color || 'primary.main',
              borderRadius: height || 8,
              transition: 'width 0.8s ease-in-out',
            }}
          />
        </Box>
        {showLabel && (
          <Typography variant="body2" sx={{ ml: 1, minWidth: '40px', textAlign: 'right' }}>
            {percentage}%
          </Typography>
        )}
      </Box>
    </Box>
  );
};

ProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  height: PropTypes.number,
  color: PropTypes.string,
  showLabel: PropTypes.bool
};

export default ProgressBar;