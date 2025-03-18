import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Avatar, useTheme } from '@mui/material';
import { Star } from '@mui/icons-material';

const AchievementCard = ({ achievement }) => {
  const theme = useTheme();
  const { id, title, description, icon, date_earned } = achievement || {};

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 3px 8px rgba(0,0,0,0.15)',
        },
      }}
    >
      <Avatar
        sx={{
          width: 56,
          height: 56,
          border: `2px solid ${theme.palette.secondary.main}`,
          backgroundColor: theme.palette.secondary.light,
        }}
      >
        {/* Use icon name if available, otherwise fallback */}
        {icon === 'code' && <CodeIcon />}
        {icon === 'school' && <SchoolIcon />}
        {icon === 'calendar' && <DateRangeIcon />}
        {!icon && <EmojiEventsIcon />}
      </Avatar>
      
      <Box sx={{ ml: 2, flexGrow: 1 }}>
        <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
          {title || 'Achievement'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description && description.length > 60 
            ? `${description.substring(0, 60)}...` 
            : description || 'No description available'}
        </Typography>
        
        {date_earned && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            Earned on {new Date(date_earned).toLocaleDateString()}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

// Import the necessary icons
import { 
  EmojiEvents as EmojiEventsIcon,
  Code as CodeIcon,
  School as SchoolIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material';

AchievementCard.propTypes = {
  achievement: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    icon: PropTypes.string,
    date_earned: PropTypes.string
  }).isRequired
};

export default AchievementCard;