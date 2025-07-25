import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Avatar, useTheme } from '@mui/material';
import { Star } from '@mui/icons-material';

// Import the necessary icons
import { 
  EmojiEvents as EmojiEventsIcon,
  Code as CodeIcon,
  School as SchoolIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material';

const AchievementCard = ({ achievement }) => {
  const theme = useTheme();
  const { id, name, description, icon, date_earned, image_url, points_value } = achievement || {};
  
  useEffect(() => {
    console.log("Full achievement data:", achievement);
  }, [achievement]);
  
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
      {/* Use image_url if available */}
      {image_url && !image_url.includes('example.com') ? (
        <Avatar
          src={image_url}
          alt={name}
          sx={{
            width: 56,
            height: 56,
            border: `2px solid ${theme.palette.secondary.main}`,
          }}
        />
      ) : (
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
      )}
      
      <Box sx={{ ml: 2, flexGrow: 1 }}>
        <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
          {name || 'Achievement'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description && description.length > 60 
            ? `${description.substring(0, 60)}...` 
            : description || 'No description available'}
        </Typography>
        
        {/* Show points value if available */}
        {points_value && (
          <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: theme.palette.warning.main }}>
            <Star sx={{ fontSize: '0.8rem', verticalAlign: 'middle', mr: 0.5 }} />
            {points_value} points
          </Typography>
        )}
        
        {date_earned && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            Earned on {new Date(date_earned).toLocaleDateString()}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

AchievementCard.propTypes = {
  achievement: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    icon: PropTypes.string,
    image_url: PropTypes.string,
    points_value: PropTypes.number,
    date_earned: PropTypes.string
  }).isRequired
};

export default AchievementCard;