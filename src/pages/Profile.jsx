import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Paper, Grid, Avatar, Button, TextField,IconButton,Tabs,Tab,Divider,Alert,Snackbar,Card,CardContent,
  CardActions,Chip,Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions,CircularProgress,Stack,
  Badge,Tooltip,List,ListItem,ListItemAvatar,ListItemText,
  ListItemSecondaryAction, Switch
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Download as DownloadIcon,
  } from '@mui/icons-material';
  
import { styled } from '@mui/material/styles';
import { 
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
  Star as StarIcon,
  Psychology as PsychologyIcon,
  School as SchoolIcon,
  EmojiEvents as EmojiEventsIcon,
  Share as ShareIcon,
  Check as CheckIcon,
  Person as PersonIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Lock as LockIcon,
  VerifiedUser as VerifiedUserIcon,
  ChildCare as ChildCareIcon,
  QuestionAnswer as QuestionAnswerIcon,
  BarChart as BarChartIcon,
  Cake as CakeIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '@mui/material/styles';

// Components
import Loader from '../components/common/Loader/Loader';
import BadgeDisplay from '../components/gamification/BadgeDisplay';
import AchievementCard from '../components/dashboard/AchievementCard';
import SkillChart from '../components/dashboard/SkillChart';
import ProgressBar from '../components/dashboard/ProgressBar';

const ProfileBackground = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(4, 0),
  borderRadius: theme.shape.borderRadius * 2,
  position: 'relative',
  marginBottom: theme.spacing(4),
  overflow: 'hidden',
  boxShadow: theme.shadows[3],
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-10%',
    right: '-5%',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    zIndex: 0,
  }
}));

const ProfileAvatar = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[3],
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const ProfileCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[1],
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[4],
    transform: 'translateY(-5px)',
  },
}));

const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[1],
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? theme.palette.grey[800] 
      : theme.palette.grey[100],
    boxShadow: theme.shadows[4],
  },
}));

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const ProfilePage = () => {
  const theme = useTheme();
  const { user, updateProfile, changePassword, logout } = useAuth();
  
  // State variables
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({
    display_name: '',
    bio: '',
    interests: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [badges, setBadges] = useState([]);
  
  // Password change states
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    new_password2: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Load user profile data
  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch this data from your API
        // const response = await apiService.getUserProfile();
        
        // Mock data for development
        const profileData = {
          id: user?.id || 1,
          username: user?.username || "tech_girl_123",
          email: user?.email || "user@example.com",
          display_name: user?.display_name || "Tech Girl",
          avatar: user?.avatar || null,
          date_joined: user?.date_joined || "2023-10-15T10:30:00Z",
          bio: "I love coding and learning new technologies! My favorite subjects are math and science. I want to become a software engineer one day.",
          interests: ["coding", "robotics", "AI", "game development"],
          profile_type: user?.profile_type || "learner",
          age_group: {
            id: 2,
            name: "Pre-teen",
            min_age: 10,
            max_age: 12
          }
        };
        
        setProfileData(profileData);
        
        // Set initial form data
        setEditFormData({
          display_name: profileData.display_name,
          bio: profileData.bio || '',
          interests: profileData.interests?.join(', ') || ''
        });
        
        // Mock stats data
        setStats({
          completed_challenges: 1,
          in_progress_challenges: 3,
          total_points: 120,
          badges_earned: 1,
          rank: 3,
          joined_days: 35,
          streak_days: 7
        });
        
        // Mock achievements data
        setAchievements([
          {
            id: 1,
            title: "First Code Challenge",
            description: "Completed your first coding challenge",
            icon: "code",
            date_earned: "2023-10-18T14:22:00Z"
          },
          {
            id: 2,
            title: "Quick Learner",
            description: "Completed 5 lessons in a single day",
            icon: "school",
            date_earned: "2023-10-20T19:15:00Z"
          },
          {
            id: 3,
            title: "Persistent Programmer",
            description: "7-day login streak",
            icon: "calendar",
            date_earned: "2023-11-01T08:30:00Z"
          }
        ]);
        
        // Mock badges data
        setBadges([
          {
            id: 1,
            name: "Coding Novice",
            description: "Completed your first 5 challenges",
            image_url: "/badges/coding-novice.png",
            points_value: 100,
            earned: true,
            date_earned: "2023-10-22T15:30:00Z"
          },
          {
            id: 2,
            name: "Bug Hunter",
            description: "Fixed 10 bugs in your code",
            image_url: "/badges/bug-hunter.png", 
            points_value: 200,
            earned: true,
            date_earned: "2023-10-28T12:45:00Z" 
          },
          {
            id: 3,
            name: "Algorithm Ace",
            description: "Mastered basic algorithms",
            image_url: "/badges/algorithm-ace.png",
            points_value: 300,
            earned: false,
            progress: 65
          }
        ]);
        
      } catch (error) {
        console.error("Error loading profile data:", error);
        setNotification({
          open: true,
          message: "Failed to load profile data. Please try again.",
          severity: "error"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadProfileData();
  }, [user]);
  
  // Handle avatar change
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Start editing profile
  const handleEditProfile = () => {
    setEditMode(true);
  };
  
  // Cancel editing profile
  const handleCancelEdit = () => {
    setEditMode(false);
    setEditFormData({
      display_name: profileData.display_name,
      bio: profileData.bio || '',
      interests: profileData.interests?.join(', ') || ''
    });
    setAvatarFile(null);
    setAvatarPreview(null);
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Save profile changes
  const handleSaveProfile = async () => {
    try {
      // Prepare form data for API submission
      const formData = new FormData();
      formData.append('display_name', editFormData.display_name);
      formData.append('bio', editFormData.bio);
      
      // Convert interests from comma-separated string to array
      const interestsArray = editFormData.interests
        .split(',')
        .map(interest => interest.trim())
        .filter(interest => interest.length > 0);
      
      formData.append('interests', JSON.stringify(interestsArray));
      
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }
      
      // In a real app, you would update the profile via API
      // await updateProfile(formData);
      
      // Update local state to reflect changes
      setProfileData(prev => ({
        ...prev,
        display_name: editFormData.display_name,
        bio: editFormData.bio,
        interests: interestsArray,
        avatar: avatarPreview || prev.avatar
      }));
      
      setEditMode(false);
      setAvatarFile(null);
      
      setNotification({
        open: true,
        message: "Profile updated successfully!",
        severity: "success"
      });
      
    } catch (error) {
      console.error("Error updating profile:", error);
      setNotification({
        open: true,
        message: "Failed to update profile. Please try again.",
        severity: "error"
      });
    }
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Open password change dialog
  const handleOpenPasswordDialog = () => {
    setShowPasswordDialog(true);
    setPasswordData({
      old_password: '',
      new_password: '',
      new_password2: ''
    });
    setPasswordErrors({});
  };
  
  // Close password dialog
  const handleClosePasswordDialog = () => {
    setShowPasswordDialog(false);
  };
  
  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle password change submission
  const handleSubmitPasswordChange = async () => {
    // Validate passwords
    const errors = {};
    if (!passwordData.old_password) errors.old_password = "Current password is required";
    if (!passwordData.new_password) errors.new_password = "New password is required";
    if (passwordData.new_password && passwordData.new_password.length < 8) {
      errors.new_password = "Password must be at least 8 characters";
    }
    if (passwordData.new_password !== passwordData.new_password2) {
      errors.new_password2 = "Passwords don't match";
    }
    
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }
    
    setPasswordLoading(true);
    try {
      // In a real app, you would change the password via API
      // await changePassword(passwordData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowPasswordDialog(false);
      setNotification({
        open: true,
        message: "Password changed successfully!",
        severity: "success"
      });
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordErrors({
        general: "Failed to change password. Please check your current password and try again."
      });
    } finally {
      setPasswordLoading(false);
    }
  };
  
  // Handle notification close
  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };
  
  // Format date string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  if (loading) {
    return <Loader fullPage message="Loading your profile..." />;
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Profile Header */}
      <ProfileBackground>
        <Container>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="avatar-upload"
                  type="file"
                  onChange={handleAvatarChange}
                  disabled={!editMode}
                />
                <label htmlFor="avatar-upload">
                  <ProfileAvatar
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={editMode ? <PhotoCameraIcon /> : null}
                  >
                    <StyledAvatar 
                      src={avatarPreview || profileData.avatar || '/default-avatar.png'} 
                      alt={profileData.display_name}
                    >
                      {profileData.display_name?.charAt(0) || profileData.username?.charAt(0)}
                    </StyledAvatar>
                  </ProfileAvatar>
                </label>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={9}>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                {editMode ? (
                  <TextField
                    fullWidth
                    variant="standard"
                    name="display_name"
                    value={editFormData.display_name}
                    onChange={handleInputChange}
                    InputProps={{
                      style: { 
                        color: theme.palette.primary.contrastText,
                        fontSize: '2rem',
                        fontWeight: 'bold'
                      },
                    }}
                    sx={{ mb: 1 }}
                  />
                ) : (
                  <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                    {profileData.display_name}
                  </Typography>
                )}
                
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', mb: 1, gap: 1 }}>
                  <Typography variant="subtitle1" component="span">
                    @{profileData.username}
                  </Typography>
                  
                  {profileData.profile_type === 'mentor' && (
                    <Chip 
                      icon={<VerifiedUserIcon />} 
                      label="Mentor" 
                      color="primary" 
                      size="small"
                      sx={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}
                    />
                  )}
                  
                  {profileData.profile_type === 'parent' && (
                    <Chip 
                      icon={<ChildCareIcon />} 
                      label="Parent" 
                      color="primary" 
                      size="small"
                      sx={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}
                    />
                  )}
                  
                  <Chip 
                    icon={<SchoolIcon />} 
                    label={profileData.age_group?.name || "Learner"} 
                    color="primary" 
                    size="small"
                    sx={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}
                  />
                </Box>
                
                {editMode ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    variant="standard"
                    name="bio"
                    placeholder="Write a short bio about yourself..."
                    value={editFormData.bio}
                    onChange={handleInputChange}
                    InputProps={{
                      style: { color: theme.palette.primary.contrastText }
                    }}
                  />
                ) : (
                  <Typography variant="body1" sx={{ mb: 2, maxWidth: '80%' }}>
                    {profileData.bio || "No bio added yet."}
                  </Typography>
                )}
                
                <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {editMode ? (
                    <TextField
                      fullWidth
                      variant="standard"
                      name="interests"
                      placeholder="Your interests (comma separated)"
                      value={editFormData.interests}
                      onChange={handleInputChange}
                      helperText="Separate interests with commas"
                      InputProps={{
                        style: { color: theme.palette.primary.contrastText }
                      }}
                      FormHelperTextProps={{
                        style: { color: 'rgba(255,255,255,0.7)' }
                      }}
                    />
                  ) : (
                    profileData.interests?.map((interest, index) => (
                      <Chip
                        key={index}
                        label={interest}
                        size="small"
                        sx={{ 
                          borderColor: 'rgba(255,255,255,0.5)', 
                          color: 'white',
                          backgroundColor: 'rgba(255,255,255,0.1)' 
                        }}
                      />
                    ))
                  )}
                </Box>
                
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  {editMode ? (
                    <>
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<SaveIcon />}
                        onClick={handleSaveProfile}
                      >
                        Save Profile
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={handleCancelEdit}
                        sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<EditIcon />}
                        onClick={handleEditProfile}
                      >
                        Edit Profile
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<LockIcon />}
                        onClick={handleOpenPasswordDialog}
                        sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
                      >
                        Change Password
                      </Button>
                    </>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </ProfileBackground>
      
      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <StatsCard>
            <EmojiEventsIcon color="secondary" sx={{ fontSize: 36, mb: 1 }} />
            <Typography variant="h4" color="secondary" fontWeight="bold">
              {stats?.total_points.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Points
            </Typography>
          </StatsCard>
        </Grid>
        
        <Grid item xs={6} sm={3}>
          <StatsCard>
            <PsychologyIcon color="primary" sx={{ fontSize: 36, mb: 1 }} />
            <Typography variant="h4" color="primary" fontWeight="bold">
              {stats?.completed_challenges}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Challenges Completed
            </Typography>
          </StatsCard>
        </Grid>
        
        <Grid item xs={6} sm={3}>
          <StatsCard>
            <StarIcon sx={{ fontSize: 36, mb: 1, color: '#FFD700' }} />
            <Typography variant="h4" fontWeight="bold" sx={{ color: '#FFD700' }}>
              {stats?.badges_earned}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Badges Earned
            </Typography>
          </StatsCard>
        </Grid>
        
        <Grid item xs={6} sm={3}>
          <StatsCard>
            <DateRangeIcon color="info" sx={{ fontSize: 36, mb: 1 }} />
            <Typography variant="h4" color="info.main" fontWeight="bold">
              {stats?.streak_days}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Day Streak
            </Typography>
          </StatsCard>
        </Grid>
      </Grid>
      
      {/* Profile Tabs */}
      <Paper sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth" 
          indicatorColor="secondary"
          textColor="secondary"
        >
          <Tab label="Achievements" icon={<EmojiEventsIcon />} iconPosition="start" />
          <Tab label="Badges" icon={<StarIcon />} iconPosition="start" />
          <Tab label="Skills" icon={<BarChartIcon />} iconPosition="start" />
          <Tab label="Account" icon={<PersonIcon />} iconPosition="start" />
        </Tabs>
      
        {/* Achievements Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Recent Achievements
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {achievements.length === 0 ? (
              <Alert severity="info">
                You haven't earned any achievements yet. Complete challenges to earn your first achievement!
              </Alert>
            ) : (
              <Grid container spacing={3}>
                {achievements.map(achievement => (
                  <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                    <AchievementCard achievement={achievement} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </TabPanel>
        
        {/* Badges Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Your Badges
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {badges.length === 0 ? (
              <Alert severity="info">
                You haven't earned any badges yet. Keep learning to earn your first badge!
              </Alert>
            ) : (
              <Grid container spacing={3}>
                {badges.map(badge => (
                  <Grid item xs={12} sm={6} md={4} key={badge.id}>
                    <BadgeDisplay badge={badge} />
                  </Grid>
                ))}
              </Grid>
            )}
            
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<EmojiEventsIcon />}
              >
                View All Badges
              </Button>
            </Box>
          </Box>
        </TabPanel>
        
        {/* Skills Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Your Skills Progress
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <ProfileCard>
                  <Typography variant="h6" gutterBottom>
                    Programming Skills
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <ProgressBar 
                      label="Python" 
                      value={75} 
                      color="success" 
                    />
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <ProgressBar 
                      label="HTML & CSS" 
                      value={60} 
                      color="info" 
                    />
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <ProgressBar 
                      label="JavaScript" 
                      value={35} 
                      color="warning" 
                    />
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <ProgressBar 
                      label="Scratch" 
                      value={90} 
                      color="secondary" 
                    />
                  </Box>
                </ProfileCard>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <ProfileCard>
                  <Typography variant="h6" gutterBottom>
                    Concept Mastery
                  </Typography>
                  
                  <Box sx={{ height: 300 }}>
                    <SkillChart
                      data={[
                        { skill: 'Variables', value: 80 },
                        { skill: 'Loops', value: 65 },
                        { skill: 'Functions', value: 50 },
                        { skill: 'Arrays', value: 40 },
                        { skill: 'Logic', value: 70 },
                        { skill: 'Debugging', value: 55 }
                      ]}
                    />
                  </Box>
                </ProfileCard>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
        
        {/* Account Tab */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Account Information
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <ProfileCard>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Basic Information
                  </Typography>
                  
                  <List>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary="Username" 
                        secondary={profileData.username} 
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <SchoolIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="Age Group" 
                        secondary={profileData.age_group?.name || "Not specified"} 
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <DateRangeIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary="Joined" 
                        secondary={formatDate(profileData.date_joined)} 
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <CakeIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary="Member For" 
                        secondary={`${stats?.joined_days || 0} days`} 
                      />
                    </ListItem>
                  </List>
                </ProfileCard>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <ProfileCard>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Advanced Settings
                  </Typography>
                  
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Email Notifications" 
                        secondary="Receive emails for important updates and achievements" 
                      />
                      <ListItemSecondaryAction>
                        <Switch defaultChecked />
                      </ListItemSecondaryAction>
                    </ListItem>
                    
                    <ListItem>
                      <ListItemText 
                        primary="Privacy Settings" 
                        secondary="Control who can see your profile and progress" 
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" color="primary">
                          <EditIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    
                    <ListItem>
                      <ListItemText 
                        primary="Data Export" 
                        secondary="Download your learning data and progress" 
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" color="primary">
                          <DownloadIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    
                    <ListItem sx={{ mt: 2 }}>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        fullWidth
                      >
                        Delete Account
                      </Button>
                    </ListItem>
                  </List>
                </ProfileCard>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
      </Paper>
      
      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onClose={handleClosePasswordDialog}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            To change your password, please enter your current password and then your new password.
          </DialogContentText>
          
          {passwordErrors.general && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {passwordErrors.general}
            </Alert>
          )}
          
          <TextField
            margin="dense"
            label="Current Password"
            type="password"
            fullWidth
            variant="outlined"
            name="old_password"
            value={passwordData.old_password}
            onChange={handlePasswordChange}
            error={!!passwordErrors.old_password}
            helperText={passwordErrors.old_password}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            variant="outlined"
            name="new_password"
            value={passwordData.new_password}
            onChange={handlePasswordChange}
            error={!!passwordErrors.new_password}
            helperText={passwordErrors.new_password}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            label="Confirm New Password"
            type="password"
            fullWidth
            variant="outlined"
            name="new_password2"
            value={passwordData.new_password2}
            onChange={handlePasswordChange}
            error={!!passwordErrors.new_password2}
            helperText={passwordErrors.new_password2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordDialog} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitPasswordChange} 
            color="primary" 
            variant="contained"
            disabled={passwordLoading}
            startIcon={passwordLoading ? <CircularProgress size={20} /> : null}
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleNotificationClose} 
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfilePage;