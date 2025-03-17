import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemIcon, Divider, CircularProgress, useTheme } from '@mui/material';
import { Code, EmojiEvents, School, FormatListBulleted, CheckCircleOutline, PlayArrow } from '@mui/icons-material';

const ActivityFeed = () => {
  const theme = useTheme();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in a real app you would fetch from API
    const mockActivities = [
      {
        id: 1,
        type: 'complete',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        content: {
          id: 101,
          title: 'Introduction to Arrays',
          type: 'challenge'
        },
        points: 50
      },
      {
        id: 2,
        type: 'start',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        content: {
          id: 102,
          title: 'Loops and Iteration',
          type: 'concept'
        }
      },
      {
        id: 3,
        type: 'badge',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        badge: {
          id: 201,
          name: 'First Steps',
          points: 100
        }
      },
      {
        id: 4,
        type: 'view',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        content: {
          id: 103,
          title: 'Variables and Data Types',
          type: 'concept'
        }
      },
      {
        id: 5,
        type: 'complete',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        content: {
          id: 104,
          title: 'Conditional Logic',
          type: 'challenge'
        },
        points: 75
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setActivities(mockActivities);
      setLoading(false);
    }, 800);
  }, []);

  const getActivityIcon = (type) => {
    const iconProps = { sx: { color: theme.palette.secondary.main } };
    
    switch (type) {
      case 'complete':
        return <CheckCircleOutline {...iconProps} />;
      case 'start':
        return <PlayArrow {...iconProps} />;
      case 'badge':
        return <EmojiEvents {...iconProps} />;
      case 'view':
        return <FormatListBulleted {...iconProps} />;
      default:
        return <School {...iconProps} />;
    }
  };

  const getActivityText = (activity) => {
    switch (activity.type) {
      case 'complete':
        return `Completed "${activity.content.title}" challenge! Earned ${activity.points} points.`;
      case 'start':
        return `Started learning "${activity.content.title}"`;
      case 'badge':
        return `Earned the "${activity.badge.name}" badge! +${activity.badge.points} points`;
      case 'view':
        return `Viewed "${activity.content.title}"`;
      default:
        return `Activity with ${activity.content.title}`;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress size={30} sx={{ color: theme.palette.secondary.main }} />
      </Box>
    );
  }

  if (activities.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <Typography color="text.secondary">No recent activity found</Typography>
      </Box>
    );
  }

  return (
    <List sx={{ 
      width: '100%', 
      maxHeight: 400, 
      overflow: 'auto',
      '&::-webkit-scrollbar': {
        width: '8px',
      },
      '&::-webkit-scrollbar-track': {
        background: theme.palette.background.default,
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: theme.palette.divider,
        borderRadius: '4px',
      }
    }}>
      {activities.map((activity, index) => (
        <React.Fragment key={activity.id}>
          <ListItem alignItems="flex-start" sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              {getActivityIcon(activity.type)}
            </ListItemIcon>
            <ListItemText
              primary={
                <Box component="span" sx={{ 
                  color: theme.palette.primary.main,
                  fontWeight: 500
                }}>
                  {getActivityText(activity)}
                </Box>
              }
              secondary={
                <Typography
                  sx={{ display: 'inline', fontSize: '0.8rem' }}
                  component="span"
                  variant="body2"
                  color="text.secondary"
                >
                  {formatTimestamp(activity.timestamp)}
                </Typography>
              }
            />
          </ListItem>
          {index < activities.length - 1 && (
            <Divider variant="inset" component="li" />
          )}
        </React.Fragment>
      ))}
      
      {activities.length >= 5 && (
        <Box sx={{ textAlign: 'center', pt: 1 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: theme.palette.secondary.main,
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            View All Activities
          </Typography>
        </Box>
      )}
    </List>
  );
};

export default ActivityFeed;