import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton,
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  ListItemButton,
  Avatar, 
  Menu, 
  MenuItem,
  Badge, 
  Divider,
  useMediaQuery
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

import ChatBot from '../chat/ChatBot';
// Icons
import SmartToyIcon from '@mui/icons-material/SmartToy';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import ForumIcon from '@mui/icons-material/Forum';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AuthService from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';

// Logo
import logo from '../../assets/images/logo.png';

const drawerWidth = 240;

const MainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default
}));

const StyledAppBar = styled(AppBar)(({ theme, open, ismobile }) => ({
  backgroundColor: theme.palette.primary.main,
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && !ismobile && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`
  },
}));

const LogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  padding: '16px',
  justifyContent: 'center'
});

const Logo = styled('img')({
  height: '40px'
});

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  },
}));



const ContentContainer = styled(Box)(({ theme, open, ismobile }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginTop: '64px',
  width: '100%', // Add this to ensure full width
  ...(open && !ismobile && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`, // This is critical - adjust width when drawer is open
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const MainLayout = () => {
  const { user, userType, isParent, isMentor } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [open, setOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationEl, setNotificationEl] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [notificationCount, setNotificationCount] = useState(2);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await AuthService.getUserProfile();
        setUserProfile(userData);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    
    fetchUserProfile();
  }, []);
  
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isMobile]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleNotificationOpen = (event) => {
    setNotificationEl(event.currentTarget);
  };
  
  const handleNotificationClose = () => {
    setNotificationEl(null);
  };
  
  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };
  
  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setOpen(false);
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/app' },
    { text: 'Challenges', icon: <CodeIcon />, path: '/app/challenges' },
    { text: 'Learning', icon: <SchoolIcon />, path: '/app/learning' },
    { text: 'Badges', icon: <EmojiEventsIcon />, path: '/app/badges' },
    { text: 'Leaderboard', icon: <LeaderboardIcon />, path: '/app/leaderboard' },
    { text: 'Forum', icon: <ForumIcon />, path: '/app/forum' },
    { text: 'Mentors', icon: <PeopleIcon />, path: '/app/mentors' },
    { text: 'Role Models', icon: <PersonIcon />, path: '/app/role-models' },
    { text: 'Chat with Mowgli', icon: <SmartToyIcon />, path: '/app/chat', highlight: true },

  ];

  return (
    <MainContainer>
      {/* App Bar */}
      <StyledAppBar position="fixed" open={open} ismobile={isMobile ? 1 : 0}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            DSAngels
          </Typography>
          
          {/* Notifications */}
          <IconButton 
            color="inherit" 
            onClick={handleNotificationOpen}
            aria-label="show notifications"
          >
            <StyledBadge badgeContent={notificationCount} color="secondary">
              <NotificationsIcon />
            </StyledBadge>
          </IconButton>
          
          {/* Profile Menu */}
          <IconButton
            onClick={handleProfileMenuOpen}
            color="inherit"
            aria-label="account of current user"
            sx={{ ml: 1 }}
          >
            {userProfile?.avatar ? 
              <Avatar src={userProfile.avatar} alt={userProfile.display_name || userProfile.username} /> :
              <AccountCircleIcon />
            }
          </IconButton>
        </Toolbar>
      </StyledAppBar>
      
      {/* Profile Menu */}
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => {
          handleProfileMenuClose();
          navigate('/app/profile');
        }}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Notification Menu */}
      <Menu
        id="notification-menu"
        anchorEl={notificationEl}
        open={Boolean(notificationEl)}
        onClose={handleNotificationClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleNotificationClose}>
          <ListItemText 
            primary="New Badge Earned!" 
            secondary="You've earned the 'Coding Beginner' badge"
          />
        </MenuItem>
        <MenuItem onClick={handleNotificationClose}>
          <ListItemText 
            primary="Challenge Completed" 
            secondary="Great job on completing 'My First Loop'"
          />
        </MenuItem>
      </Menu>
      
      {/* Drawer */}
      <StyledDrawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={isMobile ? handleDrawerToggle : undefined}
      >
        <LogoContainer>
          <Logo src={logo} alt="DSAngels Logo" />
        </LogoContainer>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem 
              key={item.text} 
              disablePadding 
              sx={{ display: 'block' }}
            >
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  minHeight: 48,
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 2,
                    justifyContent: 'center',
                    color: location.pathname === item.path ? 'secondary.main' : 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    opacity: open ? 1 : 0,
                    color: location.pathname === item.path ? 'secondary.main' : 'inherit',
                  }} 
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </StyledDrawer>
      
      {/* Main Content */}
      <ContentContainer open={open} ismobile={isMobile ? 1 : 0}>
        <Outlet />
      </ContentContainer>
      <ChatBot />
    </MainContainer>
  );
};

export default MainLayout;