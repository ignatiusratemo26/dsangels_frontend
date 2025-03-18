import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Chip,
  IconButton,
  Alert,
  InputAdornment,
  Menu,
  MenuItem,
  Pagination,
  Grid,
  Tab,
  Tabs,
  Tooltip,
  Badge,
  FormControlLabel,
  Switch
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Comment as CommentIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Forum as ForumIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  PushPin as PushPinIcon,
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  CalendarToday as CalendarIcon,
  Sort as SortIcon
} from '@mui/icons-material';

// Service import
import { communityService } from '../services/communityService';
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

const TopicItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1.5),
  transition: 'transform 0.2s, box-shadow 0.2s',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
    backgroundColor: theme.palette.mode === 'dark' 
      ? theme.palette.grey[800] 
      : theme.palette.grey[50],
  }
}));

const NewTopicButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 5,
  padding: theme.spacing(1, 3),
  fontSize: '1rem',
  boxShadow: theme.shadows[3]
}));

const ForumTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 500,
  minHeight: 48,
  borderRadius: theme.shape.borderRadius,
  '&.Mui-selected': {
    fontWeight: 600,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  }
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -5,
    top: 0,
  },
}));

const ForumPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  // State for topics
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Filter and search state
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [sortOrder, setSortOrder] = useState('newest');
  const [showClosedTopics, setShowClosedTopics] = useState(true);
  
  // New topic dialog state
  const [openNewTopicDialog, setOpenNewTopicDialog] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicDescription, setNewTopicDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  // Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Fetch topics on mount and when page changes
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = {
          page,
          page_size: pageSize
        };
        
        const response = await communityService.getAllTopics(params);
        
        setTopics(response.results || []);
        setTotalPages(Math.ceil(response.count / pageSize));
      } catch (err) {
        console.error('Error fetching forum topics:', err);
        setError('Failed to load forum topics. Please try again.');
        
        // Use fallback data in development
        if (process.env.NODE_ENV === 'development') {
          try {
            const fallbackData = await communityService.fallbackGetAllTopics({
              page,
              page_size: pageSize
            });
            setTopics(fallbackData.results || []);
            setTotalPages(Math.ceil(fallbackData.count / pageSize));
            setError(null); // Clear error if fallback works
          } catch (fallbackErr) {
            console.error('Error with fallback data:', fallbackErr);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchTopics();
  }, [page, pageSize]);
  
  // Apply filters when topics, search, or tab changes
  useEffect(() => {
    if (!topics.length) {
      setFilteredTopics([]);
      return;
    }
    
    let filtered = [...topics];
    
    // Apply tab filters
    if (tabValue === 1) { // Pinned
      filtered = filtered.filter(topic => topic.is_pinned);
    } else if (tabValue === 2) { // Active
      filtered = filtered.filter(topic => !topic.is_closed);
    }
    
    // Apply closed topics filter
    if (!showClosedTopics) {
      filtered = filtered.filter(topic => !topic.is_closed);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        topic => 
          topic.title.toLowerCase().includes(query) || 
          topic.description.toLowerCase().includes(query) ||
          (topic.created_by_username && topic.created_by_username.toLowerCase().includes(query))
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (sortOrder === 'oldest') {
        return new Date(a.created_at) - new Date(b.created_at);
      } else if (sortOrder === 'most_active') {
        return b.post_count - a.post_count;
      }
      return 0;
    });
    
    setFilteredTopics(filtered);
  }, [topics, searchQuery, tabValue, sortOrder, showClosedTopics]);
  
  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle search input
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  
  // Menu handlers
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Sort handlers
  const handleSort = (order) => {
    setSortOrder(order);
    handleMenuClose();
  };
  
  // Dialog handlers
  const handleOpenNewTopicDialog = () => {
    setOpenNewTopicDialog(true);
  };
  
  const handleCloseNewTopicDialog = () => {
    setOpenNewTopicDialog(false);
    setNewTopicTitle('');
    setNewTopicDescription('');
    setFormErrors({});
  };
  
  // Form validation
  const validateNewTopicForm = () => {
    const errors = {};
    
    if (!newTopicTitle.trim()) {
      errors.title = 'Title is required';
    } else if (newTopicTitle.length < 3) {
      errors.title = 'Title must be at least 3 characters';
    }
    
    if (!newTopicDescription.trim()) {
      errors.description = 'Description is required';
    } else if (newTopicDescription.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Create new topic
  const handleCreateTopic = async () => {
    if (!validateNewTopicForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      
      const newTopic = await communityService.createTopic({
        title: newTopicTitle,
        description: newTopicDescription
      });
      
      // Close dialog
      handleCloseNewTopicDialog();
      
      // Navigate to the new topic
      navigate(`/app/forum/topics/${newTopic.id}`);
    } catch (err) {
      console.error('Error creating topic:', err);
      
      if (err.response && err.response.data) {
        // Handle field errors from API
        const apiErrors = {};
        Object.keys(err.response.data).forEach(key => {
          apiErrors[key] = Array.isArray(err.response.data[key]) 
            ? err.response.data[key].join(' ') 
            : err.response.data[key];
        });
        setFormErrors(apiErrors);
      } else {
        setFormErrors({ general: 'Failed to create topic. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };
  
  // Format date helper
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Render loading state
  if (loading && page === 1) {
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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 0 } }}>
          <ForumIcon sx={{ fontSize: 32, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Community Forum
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <NewTopicButton
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={handleOpenNewTopicDialog}
          disabled={!isAuthenticated}
        >
          New Topic
        </NewTopicButton>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StyledPaper>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              alignItems: { xs: 'stretch', sm: 'center' }, 
              mb: 3,
              gap: 2
            }}>
              <TextField
                placeholder="Search topics..."
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ flex: 1 }}
              />
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={showClosedTopics} 
                      onChange={(e) => setShowClosedTopics(e.target.checked)}
                    />
                  }
                  label="Show Closed"
                  sx={{ mr: 1 }}
                />
                
                <Button
                  variant="outlined"
                  startIcon={<SortIcon />}
                  onClick={handleMenuOpen}
                  aria-controls="sort-menu"
                  aria-haspopup="true"
                >
                  Sort
                </Button>
                
                <Menu
                  id="sort-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem 
                    onClick={() => handleSort('newest')} 
                    selected={sortOrder === 'newest'}
                  >
                    Newest First
                  </MenuItem>
                  <MenuItem 
                    onClick={() => handleSort('oldest')} 
                    selected={sortOrder === 'oldest'}
                  >
                    Oldest First
                  </MenuItem>
                  <MenuItem 
                    onClick={() => handleSort('most_active')} 
                    selected={sortOrder === 'most_active'}
                  >
                    Most Active
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
            
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
            >
              <ForumTab label="All Topics" />
              <ForumTab label="Pinned" icon={<PushPinIcon />} iconPosition="start" />
              <ForumTab label="Active" icon={<CommentIcon />} iconPosition="start" />
            </Tabs>
            
            {filteredTopics.length === 0 ? (
              <Box sx={{ 
                textAlign: 'center', 
                py: 5, 
                px: 2,
                backgroundColor: theme => theme.palette.background.default,
                borderRadius: theme => theme.shape.borderRadius
              }}>
                <ForumIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {searchQuery 
                    ? "No topics match your search" 
                    : "No topics available"}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}>
                  {searchQuery 
                    ? "Try using different keywords or removing filters" 
                    : "Be the first to start a conversation in our community!"}
                </Typography>
                {searchQuery && (
                  <Button 
                    variant="outlined" 
                    color="primary"
                    onClick={() => setSearchQuery('')}
                    startIcon={<CloseIcon />}
                  >
                    Clear Search
                  </Button>
                )}
              </Box>
            ) : (
              <List sx={{ py: 1 }}>
                {filteredTopics.map((topic) => (
                  <TopicItem
                    key={topic.id}
                    alignItems="flex-start"
                    component={Paper}
                    elevation={1}
                    sx={{
                      borderLeft: topic.is_pinned ? '5px solid' : 'none',
                      borderLeftColor: 'secondary.main',
                      opacity: topic.is_closed ? 0.8 : 1
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        alt={topic.created_by_username} 
                        src={topic.created_by_avatar || ''}
                        sx={{ 
                          bgcolor: 'primary.main',
                          width: 50,
                          height: 50
                        }}
                      >
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, flexWrap: 'wrap' }}>
                          <RouterLink 
                            to={`/app/forum/topics/${topic.id}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                          >
                            <Typography 
                              variant="h6" 
                              component="div"
                              sx={{ mr: 1, '&:hover': { color: 'primary.main' } }}
                            >
                              {topic.title}
                            </Typography>
                          </RouterLink>
                          
                          {topic.is_pinned && (
                            <Tooltip title="Pinned Topic">
                              <PushPinIcon 
                                fontSize="small" 
                                color="secondary"
                                sx={{ mr: 1 }}
                              />
                            </Tooltip>
                          )}
                          
                          {topic.is_closed && (
                            <Tooltip title="Closed Topic">
                              <Chip 
                                size="small" 
                                label="Closed" 
                                color="default"
                                sx={{ height: 20, fontSize: '0.7rem' }}
                              />
                            </Tooltip>
                          )}
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{ 
                              mb: 2,
                              display: '-webkit-box',
                              overflow: 'hidden',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: 2,
                            }}
                          >
                            {topic.description}
                          </Typography>
                          
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 2,
                            color: 'text.secondary',
                            fontSize: '0.875rem'
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <PersonIcon fontSize="small" sx={{ mr: 0.5 }} />
                              {topic.created_by_username || 'Anonymous'}
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CalendarIcon fontSize="small" sx={{ mr: 0.5 }} />
                              {formatDate(topic.created_at)}
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CommentIcon fontSize="small" sx={{ mr: 0.5 }} />
                              {topic.post_count} {topic.post_count === 1 ? 'post' : 'posts'}
                            </Box>
                            
                            {topic.category && (
                              <Chip
                                label={topic.category}
                                size="small"
                                sx={{ height: 24 }}
                              />
                            )}
                          </Box>
                        </>
                      }
                    />
                  </TopicItem>
                ))}
              </List>
            )}
            
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </StyledPaper>
        </Grid>
      </Grid>
      
      {/* New Topic Dialog */}
      <Dialog
        open={openNewTopicDialog}
        onClose={handleCloseNewTopicDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Topic</DialogTitle>
        
        <DialogContent>
          {formErrors.general && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formErrors.general}
            </Alert>
          )}
          
          {!isAuthenticated && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              You must be logged in to create a new topic.
            </Alert>
          )}
          
          <TextField
            autoFocus
            margin="dense"
            id="topic-title"
            label="Topic Title"
            type="text"
            fullWidth
            variant="outlined"
            value={newTopicTitle}
            onChange={(e) => setNewTopicTitle(e.target.value)}
            error={!!formErrors.title}
            helperText={formErrors.title}
            disabled={submitting || !isAuthenticated}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            id="topic-description"
            label="Description"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={newTopicDescription}
            onChange={(e) => setNewTopicDescription(e.target.value)}
            error={!!formErrors.description}
            helperText={formErrors.description || "Describe what you'd like to discuss"}
            disabled={submitting || !isAuthenticated}
          />
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleCloseNewTopicDialog} 
            color="inherit"
            disabled={submitting}
          >
            Cancel
          </Button>
          
          <Button 
            onClick={handleCreateTopic} 
            variant="contained" 
            color="primary"
            disabled={submitting || !isAuthenticated}
            startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {submitting ? 'Creating...' : 'Create Topic'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ForumPage;