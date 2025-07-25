import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  LinearProgress,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Button,
  Avatar,
  Paper,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Icons
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LockIcon from '@mui/icons-material/Lock';
import InfoIcon from '@mui/icons-material/Info';
import ShareIcon from '@mui/icons-material/Share';
import FilterListIcon from '@mui/icons-material/FilterList';

// Services
import gamificationService from '../services/gamificationService';

// Styled components
const BadgesContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(5)
}));

const HeaderCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.shape.borderRadius * 2,
  marginBottom: theme.spacing(4)
}));

const BadgeCard = styled(Card)(({ theme, locked }) => ({
  height: '100%',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  cursor: locked ? 'default' : 'pointer',
  '&:hover': {
    transform: locked ? 'none' : 'translateY(-5px)',
    boxShadow: locked ? theme.shadows[2] : theme.shadows[8],
  },
  position: 'relative',
  filter: locked ? 'grayscale(0.8)' : 'none',
  opacity: locked ? 0.7 : 1
}));

const BadgeAvatar = styled(Avatar)(({ theme, locked }) => ({
  width: 80,
  height: 80,
  margin: '0 auto',
  backgroundColor: locked ? theme.palette.grey[300] : theme.palette.secondary.main,
  color: locked ? theme.palette.grey[700] : theme.palette.secondary.contrastText
}));

const LockOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(0,0,0,0.05)',
  zIndex: 1
}));

const BadgesPage = () => {
  const [userBadges, setUserBadges] = useState({ earned: [], available: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [badgeDialogOpen, setBadgeDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    total_earned: 0,
    total_available: 0,
    percentage_earned: 0,
    points: 0,
    level: 1
  });
  
  useEffect(() => {
    const fetchBadges = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch all badges and user badges info
        const userBadgesResponse = await gamificationService.getUserBadges();
        const allBadgesResponse = await gamificationService.getBadges();
        
        // Organize badges into earned and available
        const earnedBadges = userBadgesResponse.badges || [];
        const earnedBadgeIds = earnedBadges.map(badge => badge.id);
        
        // Filter available badges - those not yet earned
        const availableBadges = (allBadgesResponse.results || [])
          .filter(badge => !earnedBadgeIds.includes(badge.id));
        
        setUserBadges({
          earned: earnedBadges,
          available: availableBadges
        });
        
        // Set stats
        setStats({
          total_earned: earnedBadges.length,
          total_available: availableBadges.length + earnedBadges.length,
          percentage_earned: Math.round((earnedBadges.length / (availableBadges.length + earnedBadges.length)) * 100),
          points: userBadgesResponse.total_points || 0,
          level: userBadgesResponse.level || 1
        });
        
      } catch (err) {
        console.error('Error fetching badges:', err);
        setError('Failed to load badges data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBadges();
  }, []);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleBadgeClick = (badge, locked) => {
    if (!locked) {
      setSelectedBadge(badge);
      setBadgeDialogOpen(true);
    }
  };
  
  const calculateLevelProgress = () => {
    // Example logic - replace with your actual level calculation
    console.log("stats: ", stats)
    const currentPoints = stats.points;
    const pointsForCurrentLevel = 1000 * (stats.level - 1);
    const pointsForNextLevel = 1000 * stats.level;
    
    const totalPointsNeeded = pointsForNextLevel - pointsForCurrentLevel;
    const currentProgress = currentPoints - pointsForCurrentLevel;
    
    return (currentProgress / totalPointsNeeded) * 100;
  };
  
  if (isLoading) {
    return (
      <BadgesContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
          <CircularProgress color="secondary" />
        </Box>
      </BadgesContainer>
    );
  }
  
  if (error) {
    return (
      <BadgesContainer>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      </BadgesContainer>
    );
  }
  
  return (
    <BadgesContainer>
      {/* Header with stats */}
      <HeaderCard elevation={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              My Badges & Achievements
            </Typography>
            <Typography variant="body1">
              Collect badges as you learn and complete challenges!
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Chip 
              icon={<EmojiEventsIcon />} 
              label={`Level ${stats.level}`} 
              color="secondary" 
              sx={{ fontWeight: 'bold', mb: 1 }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">
                {stats.points} points
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={calculateLevelProgress()} 
                color="secondary"
                sx={{ width: 100, height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2">
                Next Level
              </Typography>
            </Box>
          </Box>
        </Box>
      </HeaderCard>
      
      {/* Progress Summary */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ height: '100%', borderRadius: 4 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h5" color="primary">
                {stats.total_earned}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Badges Earned
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Card sx={{ height: '100%', borderRadius: 4 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h5" color="primary">
                {stats.total_available - stats.total_earned}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Badges Available
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Card sx={{ height: '100%', borderRadius: 4 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h5" color="primary">
                {stats.percentage_earned}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Collection Complete
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Tabs */}
      <Box sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
          indicatorColor="secondary"
          textColor="secondary"
        >
          <Tab label={`Earned (${userBadges.earned.length})`} />
          <Tab label={`Available (${userBadges.available.length})`} />
          <Tab label="All Badges" />
          </Tabs>
      </Box>
      
      {/* Badge Grid */}
      <Grid container spacing={3}>
        {tabValue === 0 && userBadges.earned.length === 0 && (
          <Grid item xs={12}>
            <Alert severity="info">
              You haven't earned any badges yet. Complete challenges to earn your first badge!
            </Alert>
          </Grid>
        )}
        
        {tabValue === 0 && userBadges.earned.map((badge) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={badge.id}>
            <BadgeCard onClick={() => handleBadgeClick(badge, false)}>
              <CardContent sx={{ textAlign: 'center', pt: 3 }}>
                {badge.image_url ? (
                  <CardMedia
                    component="img"
                    image={badge.image_url}
                    alt={badge.name}
                    sx={{ height: 120, width: 120, margin: '0 auto', objectFit: 'contain' }}
                  />
                ) : (
                  <BadgeAvatar locked={false}>
                    <EmojiEventsIcon sx={{ fontSize: 40 }} />
                  </BadgeAvatar>
                )}
                <Typography variant="h6" sx={{ mt: 2 }}>
                  {badge.name}
                </Typography>
                <Chip 
                  label={`+${badge.points || 0} pts`} 
                  size="small" 
                  color="secondary"
                  sx={{ mt: 1 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>
                  {badge.description ? 
                    (badge.description.length > 75 ? 
                      `${badge.description.substring(0, 75)}...` : 
                      badge.description) : 
                    "Complete specific challenges to earn this badge."}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Earned on {new Date(badge.earned_date || Date.now()).toLocaleDateString()}
                </Typography>
              </CardContent>
            </BadgeCard>
          </Grid>
        ))}
        
        {tabValue === 1 && userBadges.available.map((badge) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={badge.id}>
            <BadgeCard locked={true}>
              <LockOverlay>
                <LockIcon sx={{ fontSize: 30, opacity: 0.7 }} />
              </LockOverlay>
              <CardContent sx={{ textAlign: 'center', pt: 3 }}>
                {badge.image_url ? (
                  <CardMedia
                    component="img"
                    image={badge.image_url}
                    alt={badge.name}
                    sx={{ height: 120, width: 120, margin: '0 auto', objectFit: 'contain' }}
                  />
                ) : (
                  <BadgeAvatar locked={true}>
                    <EmojiEventsIcon sx={{ fontSize: 40 }} />
                  </BadgeAvatar>
                )}
                <Typography variant="h6" sx={{ mt: 2 }}>
                  {badge.name}
                </Typography>
                <Chip 
                  label={`+${badge.points || 0} pts`} 
                  size="small" 
                  sx={{ mt: 1, opacity: 0.7 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>
                  {badge.hint || "Complete specific challenges to unlock this badge."}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Tooltip title="View requirements">
                    <IconButton size="small" color="primary" onClick={(e) => {
                      e.stopPropagation();
                      handleBadgeClick(badge, false);
                    }}>
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </BadgeCard>
          </Grid>
        ))}
        
        {tabValue === 2 && [...userBadges.earned, ...userBadges.available].map((badge) => {
          const isEarned = userBadges.earned.some(earnedBadge => earnedBadge.id === badge.id);
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={badge.id}>
              <BadgeCard 
                locked={!isEarned} 
                onClick={() => handleBadgeClick(badge, !isEarned)}
              >
                {!isEarned && (
                  <LockOverlay>
                    <LockIcon sx={{ fontSize: 30, opacity: 0.7 }} />
                  </LockOverlay>
                )}
                <CardContent sx={{ textAlign: 'center', pt: 3 }}>
                  {badge.image_url ? (
                    <CardMedia
                      component="img"
                      image={badge.image_url}
                      alt={badge.name}
                      sx={{ height: 120, width: 120, margin: '0 auto', objectFit: 'contain' }}
                    />
                  ) : (
                    <BadgeAvatar locked={!isEarned}>
                      <EmojiEventsIcon sx={{ fontSize: 40 }} />
                    </BadgeAvatar>
                  )}
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    {badge.name}
                  </Typography>
                  <Chip 
                    label={`+${badge.points || 0} pts`} 
                    size="small" 
                    color={isEarned ? "secondary" : "default"}
                    sx={{ mt: 1, opacity: isEarned ? 1 : 0.7 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>
                    {isEarned ? 
                      (badge.description ? 
                        (badge.description.length > 75 ? 
                          `${badge.description.substring(0, 75)}...` : 
                          badge.description) : 
                        "Badge earned!") :
                      (badge.hint || "Complete specific challenges to unlock this badge.")}
                  </Typography>
                  {isEarned && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      Earned on {new Date(badge.earned_date || Date.now()).toLocaleDateString()}
                    </Typography>
                  )}
                </CardContent>
              </BadgeCard>
            </Grid>
          );
        })}
      </Grid>
      
      {/* Badge Detail Dialog */}
      <Dialog
        open={badgeDialogOpen}
        onClose={() => setBadgeDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedBadge && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">{selectedBadge.name}</Typography>
                <Chip 
                  label={`+${selectedBadge.points || 0} points`} 
                  color="secondary" 
                  size="small" 
                />
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                {selectedBadge.image_url ? (
                  <img 
                    src={selectedBadge.image_url} 
                    alt={selectedBadge.name} 
                    style={{ height: 150, width: 150, objectFit: 'contain' }}
                  />
                ) : (
                  <Avatar 
                    sx={{ width: 120, height: 120, bgcolor: 'secondary.main', mb: 2 }}
                  >
                    <EmojiEventsIcon sx={{ fontSize: 60 }} />
                  </Avatar>
                )}
              </Box>
              
              <Typography variant="subtitle1" gutterBottom>
                Description
              </Typography>
              <Typography variant="body2" paragraph>
                {selectedBadge.description || "Complete specific challenges to earn this badge."}
              </Typography>
              
              {selectedBadge.requirements && (
                <>
                  <Typography variant="subtitle1" gutterBottom>
                    How to Earn
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {selectedBadge.requirements}
                  </Typography>
                </>
              )}
              
              {userBadges.earned.some(badge => badge.id === selectedBadge.id) && (
                <>
                  <Typography variant="subtitle1" gutterBottom>
                    Achievement Details
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2">
                      Earned on:
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {new Date(selectedBadge.earned_date || Date.now()).toLocaleDateString()}
                    </Typography>
                  </Box>
                  {selectedBadge.related_challenge && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">
                        Challenge:
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {selectedBadge.related_challenge}
                      </Typography>
                    </Box>
                  )}
                </>
              )}
            </DialogContent>
            <DialogActions>
              {userBadges.earned.some(badge => badge.id === selectedBadge.id) && (
                <Button 
                  startIcon={<ShareIcon />} 
                  color="primary"
                  onClick={() => {
                    // Implement share functionality
                    console.log('Share badge:', selectedBadge.name);
                  }}
                >
                  Share
                </Button>
              )}
              <Button onClick={() => setBadgeDialogOpen(false)}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </BadgesContainer>
  );
};

export default BadgesPage;