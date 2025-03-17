import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Chip, 
  Avatar, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  LinearProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  EmojiEvents as EmojiEventsIcon,
  Lock as LockIcon,
  Info as InfoIcon,
  Share as ShareIcon,
  ViewTimeline as ViewTimelineIcon
} from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme, earned }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 2,
  position: 'relative',
  overflow: 'hidden',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  boxShadow: earned ? theme.shadows[3] : theme.shadows[1],
  opacity: earned ? 1 : 0.8,
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  }
}));

const BadgeImageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2, 0),
  position: 'relative',
}));

const BadgeImage = styled(CardMedia)(({ theme, earned }) => ({
  width: 100,
  height: 100,
  objectFit: 'contain',
  filter: earned ? 'none' : 'grayscale(80%)',
  transition: 'all 0.3s ease',
}));

const BadgeAvatar = styled(Avatar)(({ theme, earned }) => ({
  width: 100,
  height: 100,
  backgroundColor: earned ? theme.palette.primary.main : theme.palette.grey[400],
  color: earned ? theme.palette.primary.contrastText : theme.palette.grey[100],
  border: earned ? `4px solid ${theme.palette.secondary.main}` : 'none',
  boxShadow: earned ? theme.shadows[4] : 'none',
}));

const LockOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1,
}));

const DetailDialogContent = styled(DialogContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
}));

const BadgeDisplay = ({ badge }) => {
  const [open, setOpen] = useState(false);
  
  const handleOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not yet earned';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <>
      <StyledCard earned={badge.earned} onClick={handleOpen}>
        {!badge.earned && (
          <LockOverlay>
            <LockIcon sx={{ fontSize: 36, color: 'white' }} />
          </LockOverlay>
        )}
        
        <BadgeImageContainer>
          {badge.image_url ? (
            <BadgeImage
              component="img"
              image={badge.image_url}
              alt={badge.name}
              earned={badge.earned}
            />
          ) : (
            <BadgeAvatar earned={badge.earned}>
              <EmojiEventsIcon sx={{ fontSize: 50 }} />
            </BadgeAvatar>
          )}
        </BadgeImageContainer>
        
        <CardContent sx={{ textAlign: 'center', flexGrow: 1, pt: 0 }}>
          <Typography variant="h6" gutterBottom>
            {badge.name}
          </Typography>
          
          <Box sx={{ px: 1 }}>
            <Chip 
              label={`+${badge.points_value || 0} pts`} 
              size="small" 
              color={badge.earned ? "secondary" : "default"}
              sx={{ mb: 1 }}
            />
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {badge.description ? 
              (badge.description.length > 60 ? 
                `${badge.description.substring(0, 60)}...` : 
                badge.description) : 
              "Complete specific challenges to earn this badge."}
          </Typography>
          
          {badge.earned ? (
            <Typography variant="caption" color="text.secondary" display="block">
              Earned on {formatDate(badge.date_earned)}
            </Typography>
          ) : badge.progress !== undefined ? (
            <Box sx={{ px: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  Progress
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {badge.progress}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={badge.progress} 
                color="secondary"
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>
          ) : (
            <Typography variant="caption" color="text.secondary" display="block">
              Keep learning to unlock
            </Typography>
          )}
        </CardContent>
      </StyledCard>
      
      {/* Detail Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">{badge.name}</Typography>
            <Chip 
              label={`+${badge.points_value || 0} points`} 
              color={badge.earned ? "secondary" : "default"} 
              size="small" 
            />
          </Box>
        </DialogTitle>
        
        <DetailDialogContent>
          {badge.image_url ? (
            <Box 
              component="img" 
              src={badge.image_url} 
              alt={badge.name}
              sx={{ 
                height: 150, 
                width: 150, 
                mb: 2,
                filter: badge.earned ? 'none' : 'grayscale(80%)',
              }}
            />
          ) : (
            <BadgeAvatar 
              earned={badge.earned}
              sx={{ width: 150, height: 150, mb: 2 }}
            >
              <EmojiEventsIcon sx={{ fontSize: 80 }} />
            </BadgeAvatar>
          )}
          
          <Typography variant="body1" sx={{ textAlign: 'center', mb: 2 }}>
            {badge.description || "Complete specific challenges to earn this badge."}
          </Typography>
          
          {badge.earned ? (
            <Box sx={{ mt: 1, mb: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2" color="success.main">
                Badge Earned!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Earned on {formatDate(badge.date_earned)}
              </Typography>
            </Box>
          ) : badge.progress !== undefined ? (
            <Box sx={{ width: '100%', mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  Progress
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {badge.progress}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={badge.progress} 
                color="secondary"
                sx={{ height: 8, borderRadius: 4 }}
              />
              
              {badge.requirements && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Requirements:
                  </Typography>
                  <ul>
                    {badge.requirements.map((req, index) => (
                      <li key={index}>
                        <Typography variant="body2">
                          {req}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </Box>
              )}
            </Box>
          ) : (
            <Box sx={{ mt: 1, mb: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Not Yet Earned
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Keep learning to unlock this badge
              </Typography>
            </Box>
          )}
          
          {badge.challenge_link && (
            <Button 
              variant="outlined" 
              color="primary" 
              sx={{ mt: 1 }}
              href={badge.challenge_link}
            >
              Go to Challenge
            </Button>
          )}
          
          <Box sx={{ display: 'flex', mt: 2, justifyContent: 'center', gap: 1 }}>
            {badge.earned && (
              <Tooltip title="Share Achievement">
                <IconButton color="primary">
                  <ShareIcon />
                </IconButton>
              </Tooltip>
            )}
            
            <Tooltip title="View Timeline">
              <IconButton color="primary">
                <ViewTimelineIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Learn More">
              <IconButton color="primary">
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </DetailDialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BadgeDisplay;