import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Card,
  CardContent,
  Button,
  IconButton,
  Tabs,
  Tab,
  LinearProgress,
  Divider,
  Menu,
  MenuItem,
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Leaderboard as LeaderboardIcon,
  EmojiEvents as TrophyIcon,
  Star as StarIcon,
  Public as GlobalIcon,
  DateRange as DateRangeIcon,
  StarBorder as StarBorderIcon,
  ArrowUpward as ArrowUpwardIcon,
  VerifiedUser as VerifiedUserIcon,
  Share as ShareIcon,
  Info as InfoIcon,
  Timeline as TimelineIcon,
  School as SchoolIcon,
  Lightbulb as LightbulbIcon
} from '@mui/icons-material';

// Services
import { gamificationService } from '../services/gamificationService';
import { useAuth } from '../contexts/AuthContext';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  }
}));

const UserRankCard = styled(Card)(({ theme, isuser }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: isuser ? `0 4px 20px ${theme.palette.primary.main}30` : theme.shadows[2],
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: isuser ? theme.palette.primary.light + '15' : theme.palette.background.paper,
  border: isuser ? `1px solid ${theme.palette.primary.main}30` : 'none',
}));

const RankAvatar = styled(Avatar)(({ theme, rank }) => {
  let backgroundColor = theme.palette.grey[500];
  let size = 40;
  
  if (rank === 1) {
    backgroundColor = '#FFD700'; // Gold
    size = 56;
  } else if (rank === 2) {
    backgroundColor = '#C0C0C0'; // Silver
    size = 48;
  } else if (rank === 3) {
    backgroundColor = '#CD7F32'; // Bronze
    size = 44;
  }
  
  return {
    width: size,
    height: size,
    backgroundColor,
    color: rank <= 3 ? theme.palette.getContrastText(backgroundColor) : undefined,
    fontWeight: 'bold',
    boxShadow: rank <= 3 ? theme.shadows[4] : 'none',
    border: rank <= 3 ? `2px solid ${theme.palette.background.paper}` : 'none',
  };
});

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`leaderboard-tabpanel-${index}`}
      aria-labelledby={`leaderboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
};

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.95rem',
  minHeight: 48,
  borderRadius: theme.shape.borderRadius,
  '&.Mui-selected': {
    fontWeight: 600,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  }
}));

const TrophyWrapper = styled(Box)(({ theme, position }) => {
  const colors = {
    1: {
      main: '#FFD700', // Gold
      light: '#FFF7D6',
    },
    2: {
      main: '#C0C0C0', // Silver
      light: '#F5F5F5',
    },
    3: {
      main: '#CD7F32', // Bronze
      light: '#F5E6D9',
    }
  };
  
  return {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
    backgroundColor: colors[position]?.light || theme.palette.grey[100],
    borderRadius: theme.shape.borderRadius * 2,
    width: '100%',
    height: position === 1 ? 240 : position === 2 ? 220 : 200,
    marginTop: position === 1 ? 0 : position === 2 ? 20 : 40,
    boxShadow: theme.shadows[2],
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-8px)',
    }
  };
});

const LeaderboardPage = () => {
  const { user } = useAuth();
  
  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState({
    leaderboard: [],
    current_user_rank: 0,
    current_user_points: 0
  });
  
  // Additional states
  const [timeframe, setTimeframe] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await gamificationService.getLeaderboard({ timeframe });
        setLeaderboardData(data);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard data. Please try again.');
        
        // Use fallback data
        if (process.env.NODE_ENV === 'development') {
          setLeaderboardData({
            leaderboard: getMockLeaderboardData(),
            current_user_rank: 4,
            current_user_points: 1250
          });
          setError(null);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, [timeframe]);
  
  // Event handlers
  const handleTimeframeMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleTimeframeMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
    handleTimeframeMenuClose();
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Mock data for development
  const getMockLeaderboardData = () => {
    return [
      {
        rank: 1,
        username: 'tech_wizard',
        display_name: 'Tech Wizard',
        points: 3750,
        avatar: null,
        is_current_user: false,
        streak_days: 45,
        badges_count: 18,
        completed_challenges: 32
      },
      {
        rank: 2,
        username: 'coding_star',
        display_name: 'Coding Star',
        points: 3600,
        avatar: null,
        is_current_user: false,
        streak_days: 36,
        badges_count: 16,
        completed_challenges: 28
      },
      {
        rank: 3,
        username: 'algorithm_guru',
        display_name: 'Algorithm Guru',
        points: 3200,
        avatar: null,
        is_current_user: false,
        streak_days: 30,
        badges_count: 14,
        completed_challenges: 25
      },
      {
        rank: 4,
        username: 'digital_explorer',
        display_name: 'Digital Explorer',
        points: 1250,
        avatar: null,
        is_current_user: true,
        streak_days: 12,
        badges_count: 7,
        completed_challenges: 15
      }
    ];
  };
  
  // Rank background helper
  const getRankColor = (rank) => {
    if (rank === 1) return 'gold';
    if (rank === 2) return 'silver';
    if (rank === 3) return 'bronze';
    return undefined;
  };
  
  // Render loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} color="secondary" />
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 4, 
        flexWrap: 'wrap',
        justifyContent: { xs: 'center', md: 'space-between' }
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: { xs: 2, md: 0 }, 
          flexDirection: { xs: 'column', sm: 'row' },
          textAlign: { xs: 'center', sm: 'left' }
        }}>
          <LeaderboardIcon sx={{ fontSize: 40, mr: { xs: 0, sm: 1.5 }, mb: { xs: 1, sm: 0 }, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
              Leaderboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              See how you rank against other learners
            </Typography>
          </Box>
        </Box>
        
        <Box>
          <Button
            variant="outlined"
            startIcon={<DateRangeIcon />}
            onClick={handleTimeframeMenuOpen}
            sx={{ borderRadius: 2 }}
          >
            {timeframe === 'all' ? 'All Time' : 
             timeframe === 'month' ? 'This Month' : 
             timeframe === 'week' ? 'This Week' : 'All Time'}
          </Button>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleTimeframeMenuClose}
          >
            <MenuItem 
              selected={timeframe === 'all'} 
              onClick={() => handleTimeframeChange('all')}
            >
              All Time
            </MenuItem>
            <MenuItem 
              selected={timeframe === 'month'} 
              onClick={() => handleTimeframeChange('month')}
            >
              This Month
            </MenuItem>
            <MenuItem 
              selected={timeframe === 'week'} 
              onClick={() => handleTimeframeChange('week')}
            >
              This Week
            </MenuItem>
          </Menu>
        </Box>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Your Rank */}
      <StyledPaper sx={{ mb: 4, py: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, px: 2 }}>
          Your Ranking
        </Typography>
        
        <UserRankCard isuser="1">
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <RankAvatar rank={leaderboardData.current_user_rank}>
                  {leaderboardData.current_user_rank}
                </RankAvatar>
              </Grid>
              
              <Grid item xs>
                <Typography variant="h6">
                  {user?.display_name || user?.username || 'You'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {leaderboardData.current_user_points.toLocaleString()} points
                </Typography>
              </Grid>
              
              <Grid item>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  color: 'primary.main',
                  backgroundColor: 'primary.light' + '20',
                  borderRadius: 2,
                  p: 1
                }}>
                  <StarIcon color="inherit" />
                  <Typography variant="h6" color="inherit">
                    #{leaderboardData.current_user_rank}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {calculateNextRankPoints(leaderboardData)} points to next rank
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={calculateProgressToNextRank(leaderboardData)} 
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>
          </CardContent>
        </UserRankCard>
      </StyledPaper>
      
      {/* Top 3 */}
      {leaderboardData.leaderboard.length > 0 && (
        <StyledPaper sx={{ mb: 4, py: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, px: 2 }}>
            Top Performers
          </Typography>
          
          <Grid container spacing={3} justifyContent="center">
            {/* Second Place */}
            {leaderboardData.leaderboard.length > 1 && (
              <Grid item xs={12} sm={4}>
                <TrophyWrapper position={2}>
                  <Avatar 
                    src={leaderboardData.leaderboard[1].avatar} 
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      mb: 1,
                      border: '4px solid #C0C0C0'
                    }}
                  >
                    {getInitials(leaderboardData.leaderboard[1].display_name || leaderboardData.leaderboard[1].username)}
                  </Avatar>
                  
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: 10, 
                      right: 10, 
                      bgcolor: '#C0C0C0',
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      color: 'black'
                    }}
                  >
                    2
                  </Box>
                  
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    {leaderboardData.leaderboard[1].display_name || leaderboardData.leaderboard[1].username}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <StarIcon sx={{ color: '#C0C0C0', mr: 0.5 }} />
                    <Typography variant="body1" fontWeight="bold">
                      {leaderboardData.leaderboard[1].points.toLocaleString()} points
                    </Typography>
                  </Box>
                </TrophyWrapper>
              </Grid>
            )}
            
            {/* First Place */}
            {leaderboardData.leaderboard.length > 0 && (
              <Grid item xs={12} sm={4}>
                <TrophyWrapper position={1}>
                  <Avatar 
                    src={leaderboardData.leaderboard[0].avatar} 
                    sx={{ 
                      width: 90, 
                      height: 90, 
                      mb: 1,
                      border: '4px solid #FFD700'
                    }}
                  >
                    {getInitials(leaderboardData.leaderboard[0].display_name || leaderboardData.leaderboard[0].username)}
                  </Avatar>
                  
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: 10, 
                      right: 10, 
                      bgcolor: '#FFD700',
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      color: 'black'
                    }}
                  >
                    1
                  </Box>
                  
                  <Typography variant="h5" sx={{ mt: 1, fontWeight: 600 }}>
                    {leaderboardData.leaderboard[0].display_name || leaderboardData.leaderboard[0].username}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrophyIcon sx={{ color: '#FFD700', mr: 0.5 }} />
                    <Typography variant="h6" fontWeight="bold">
                      {leaderboardData.leaderboard[0].points.toLocaleString()} points
                    </Typography>
                  </Box>
                  
                  <Tooltip title="Our leading DSAngel! Highest point earner in the community">
                    <Chip 
                      icon={<VerifiedUserIcon fontSize="small" />}
                      label="Top DSAngel" 
                      size="small" 
                      color="primary"
                      sx={{ position: 'absolute', bottom: 10, fontWeight: 500 }}
                    />
                  </Tooltip>
                </TrophyWrapper>
              </Grid>
            )}
            
            {/* Third Place */}
            {leaderboardData.leaderboard.length > 2 && (
              <Grid item xs={12} sm={4}>
                <TrophyWrapper position={3}>
                  <Avatar 
                    src={leaderboardData.leaderboard[2].avatar} 
                    sx={{ 
                      width: 70, 
                      height: 70, 
                      mb: 1,
                      border: '4px solid #CD7F32'
                    }}
                  >
                    {getInitials(leaderboardData.leaderboard[2].display_name || leaderboardData.leaderboard[2].username)}
                  </Avatar>
                  
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: 10, 
                      right: 10, 
                      bgcolor: '#CD7F32',
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      color: 'white'
                    }}
                  >
                    3
                  </Box>
                  
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    {leaderboardData.leaderboard[2].display_name || leaderboardData.leaderboard[2].username}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <StarIcon sx={{ color: '#CD7F32', mr: 0.5 }} />
                    <Typography variant="body1" fontWeight="bold">
                      {leaderboardData.leaderboard[2].points.toLocaleString()} points
                    </Typography>
                  </Box>
                </TrophyWrapper>
              </Grid>
            )}
          </Grid>
        </StyledPaper>
      )}
      
      {/* Full Leaderboard */}
      <StyledPaper>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <StyledTab label="All Rankings" icon={<GlobalIcon />} iconPosition="start" />
            <StyledTab label="By Challenges" icon={<SchoolIcon />} iconPosition="start" />
            <StyledTab label="By Badges" icon={<VerifiedUserIcon />} iconPosition="start" />
            <StyledTab label="Learning Streaks" icon={<TimelineIcon />} iconPosition="start" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width="5%">Rank</TableCell>
                  <TableCell width="50%">User</TableCell>
                  <TableCell width="15%" align="center">Badges</TableCell>
                  <TableCell width="15%" align="center">Challenges</TableCell>
                  <TableCell width="15%" align="right">Points</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaderboardData.leaderboard.map((user, index) => (
                  <TableRow 
                    key={index}
                    sx={{ 
                      backgroundColor: user.is_current_user ? 'primary.light' + '15' : 'inherit',
                      '&:hover': {
                        backgroundColor: user.is_current_user 
                          ? 'primary.light' + '25'
                          : 'action.hover'
                      }
                    }}
                  >
                    <TableCell>
                      <RankAvatar rank={user.rank} sx={{ mx: 'auto' }}>
                        {user.rank}
                      </RankAvatar>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          src={user.avatar} 
                          alt={user.display_name || user.username}
                          sx={{ 
                            mr: 2,
                            border: user.is_current_user 
                              ? '2px solid' 
                              : 'none',
                            borderColor: 'primary.main'
                          }}
                        >
                          {getInitials(user.display_name || user.username)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1">
                            {user.display_name || user.username}
                            {user.is_current_user && (
                              <Chip 
                                size="small" 
                                label="You" 
                                color="secondary"
                                sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                              />
                            )}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {user.streak_days > 0 && `${user.streak_days} day streak`}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title={`${user.badges_count} badges earned`}>
                        <Chip
                          icon={<VerifiedUserIcon fontSize="small" />}
                          label={user.badges_count || 0}
                          color="default"
                          size="small"
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title={`${user.completed_challenges} challenges completed`}>
                        <Chip
                          icon={<LightbulbIcon fontSize="small" />}
                          label={user.completed_challenges || 0}
                          color="default"
                          size="small"
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle1" fontWeight={user.is_current_user ? 'bold' : 'normal'}>
                        {user.points.toLocaleString()}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            flexDirection: 'column', 
            py: 6 
          }}>
            <SchoolIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Challenge Rankings Coming Soon
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 400 }}>
              Soon you'll be able to see who has completed the most challenges in each category.
            </Typography>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            flexDirection: 'column', 
            py: 6 
          }}>
            <VerifiedUserIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Badge Rankings Coming Soon
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 400 }}>
              Soon you'll be able to see who has earned the most badges in each category.
            </Typography>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            flexDirection: 'column', 
            py: 6 
          }}>
            <TimelineIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Streak Rankings Coming Soon
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 400 }}>
              Soon you'll be able to see who has the longest learning streaks.
            </Typography>
          </Box>
        </TabPanel>
      </StyledPaper>
    </Container>
  );
};

// Helper functions
const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const calculateNextRankPoints = (data) => {
  // Find the next ranked person above the current user
  const currentRank = data.current_user_rank;
  const currentPoints = data.current_user_points;
  
  const nextRankedUser = data.leaderboard.find(user => user.rank === currentRank - 1);
  
  if (nextRankedUser) {
    return nextRankedUser.points - currentPoints;
  }
  
  // If there's no one above, return a default goal (e.g., 500 more points)
  return 500;
};

const calculateProgressToNextRank = (data) => {
  const pointsToNextRank = calculateNextRankPoints(data);
  const currentPoints = data.current_user_points;
  
  // Assume we need at least 500 points to go up a rank
  const basePointsNeeded = 500;
  
  // Calculate progress percentage
  const progress = 100 - (pointsToNextRank / basePointsNeeded) * 100;
  
  // Ensure it's within 0-100 range
  return Math.min(Math.max(progress, 0), 100);
};

export default LeaderboardPage;