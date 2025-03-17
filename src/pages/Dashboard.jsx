import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, useTheme } from '@mui/material';
import { Sparklines, SparklinesLine, SparklinesSpots } from 'react-sparklines';
import { Link } from 'react-router-dom';

// Components
import ProgressBar from '../components/dashboard/ProgressBar';
import AchievementCard from '../components/dashboard/AchievementCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import RecommendedChallenges from '../components/dashboard/RecommendedChallenges';
import DashboardStats from '../components/dashboard/DashboardStats';

// Services
import { progressService } from '../services/progressService';
import { contentService } from '../services/contentService';
import { gamificationService } from '../services/gamificationService';

const Dashboard = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState(null);
  const [recentBadges, setRecentBadges] = useState([]);
  const [recommendedChallenges, setRecommendedChallenges] = useState([]);
  const [recommendedConcepts, setRecommendedConcepts] = useState([]);
  const [learningPath, setLearningPath] = useState([]);
  const [activityData, setActivityData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch user stats
        const stats = await progressService.getUserStats();
        setUserStats(stats);

        // Fetch recent badges
        const badges = await gamificationService.getUserBadges();
        setRecentBadges(badges.earned_badges.slice(0, 3));

        // Fetch recommended challenges
        const challenges = await contentService.getChallenges({
          page: 1,
          page_size: 3,
          ordering: 'recommended'
        });
        setRecommendedChallenges(challenges.results);

        // Fetch recommended concept notes
        const concepts = await contentService.getConceptNotes({
          page: 1,
          page_size: 3,
          ordering: 'recommended'
        });
        setRecommendedConcepts(concepts.results);

        // Fetch learning path
        const path = await progressService.getLearningPath();
        setLearningPath(path.learning_path);

        // Mock activity data for sparklines
        setActivityData([5, 10, 15, 8, 20, 18, 22, 25, 18, 30, 28]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress sx={{ color: theme.palette.secondary.main }} />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600, mb: 4 }}>
        Welcome Back, {userStats?.user_name || 'Tech Girl'}! 🌟
      </Typography>

      {/* Stats Row */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          backgroundColor: theme.palette.background.light,
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <DashboardStats 
              completedCount={userStats?.completed_count || 0}
              inProgressCount={userStats?.in_progress_count || 0}
              totalPoints={userStats?.total_points || 0}
              joinedDays={userStats?.joined_days || 0}
              averageDifficulty={userStats?.average_difficulty || 0}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Your Learning Activity</Typography>
            <Box sx={{ height: '120px', width: '100%' }}>
              <Sparklines data={activityData} margin={6} height={80}>
                <SparklinesLine color={theme.palette.secondary.main} style={{ fill: "none" }} />
                <SparklinesSpots size={3} style={{ fill: theme.palette.secondary.main }} />
              </Sparklines>
            </Box>
            <Typography variant="body2" color="text.secondary" align="center">
              Last 7 days activity
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Current Progress */}
      {userStats?.recent_completion && (
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 2,
            backgroundColor: theme.palette.background.light,
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography variant="h6" gutterBottom>
            Continue Learning
          </Typography>
          <Box sx={{ my: 2 }}>
            <Typography variant="body1" gutterBottom>
              {userStats.recent_completion.title}
            </Typography>
            <ProgressBar 
              value={userStats.recent_completion.completion_percentage || 0} 
              total={100}
              height={12}
              color={theme.palette.primary.main}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link 
              to={`/app/${userStats.recent_completion.type}s/${userStats.recent_completion.id}`}
              style={{ textDecoration: 'none', color: theme.palette.secondary.main }}
            >
              <Typography variant="button">
                Continue
              </Typography>
            </Link>
          </Box>
        </Paper>
      )}

      {/* Middle Section - Achievements and Recommendations */}
      <Grid container spacing={4}>
        {/* Achievements Section */}
        <Grid item xs={12} md={5}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              borderRadius: 2, 
              height: '100%',
              backgroundColor: theme.palette.background.light,
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Recent Achievements</Typography>
              <Link to="/app/badges" style={{ textDecoration: 'none', color: theme.palette.secondary.main }}>
                <Typography variant="button">View All</Typography>
              </Link>
            </Box>
            
            {recentBadges.length > 0 ? (
              <Grid container spacing={2}>
                {recentBadges.map((badge) => (
                  <Grid item xs={12} key={badge.id}>
                    <AchievementCard
                      id={badge.id}
                      name={badge.name}
                      description={badge.description}
                      imageUrl={badge.image_url}
                      pointsValue={badge.points_value}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No badges earned yet. Complete challenges to earn your first badge!
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Recommendations Section */}
        <Grid item xs={12} md={7}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              backgroundColor: theme.palette.background.light,
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Recommended for You</Typography>
              <Link to="/app/challenges" style={{ textDecoration: 'none', color: theme.palette.secondary.main }}>
                <Typography variant="button">View All</Typography>
              </Link>
            </Box>
            
            <RecommendedChallenges challenges={recommendedChallenges} concepts={recommendedConcepts} />
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom Section - Activity Feed and Learning Path */}
      <Grid container spacing={4} sx={{ mt: 2 }}>
        {/* Activity Feed */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              backgroundColor: theme.palette.background.light,
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <Typography variant="h6" gutterBottom>Recent Activity</Typography>
            <ActivityFeed />
          </Paper>
        </Grid>

        {/* Learning Path */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              backgroundColor: theme.palette.background.light,
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Your Learning Path</Typography>
              <Link to="/app/learning" style={{ textDecoration: 'none', color: theme.palette.secondary.main }}>
                <Typography variant="button">View All</Typography>
              </Link>
            </Box>
            
            {learningPath.length > 0 ? (
              <Box>
                {learningPath.slice(0, 3).map((item, index) => (
                  <Box 
                    key={item.content_id} 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2,
                      p: 2,
                      borderRadius: 1,
                      backgroundColor: theme.palette.background.paper
                    }}
                  >
                    <Box
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        backgroundColor: theme.palette.primary.main,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        mr: 2,
                      }}
                    >
                      {item.step}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1">{item.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.content_type} • Difficulty: {item.difficulty}/5 • {item.estimated_time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  Your personalized learning path is being created. Check back soon!
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;