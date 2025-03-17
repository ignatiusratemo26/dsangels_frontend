import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  InputBase,
  IconButton,
  Divider,
  Chip,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  CardActions,
  Pagination,
  useTheme
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  School as SchoolIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Star as StarIcon,
  AccessTime as AccessTimeIcon,
  Code as CodeIcon,
  Lightbulb as LightbulbIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

// Services
import { contentService } from '../services/contentService';
import { progressService } from '../services/progressService';

// Components
import Loader from '../components/common/Loader/Loader';
import ProgressBar from '../components/dashboard/ProgressBar';

const SearchContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
    marginLeft: theme.spacing(3),
  },
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary,
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '30ch',
    },
  },
}));

const ConceptCard = styled(Card)(({ theme, completed }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
  ...(completed && {
    '&::after': {
      content: '""',
      position: 'absolute',
      width: '100%',
      height: '4px',
      bottom: 0,
      left: 0,
      backgroundColor: theme.palette.success.main,
    }
  })
}));

const LearningPathHeader = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(3),
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

const difficultyColors = {
  1: 'success',
  2: 'info',
  3: 'warning',
  4: 'error',
  5: 'error'
};

const difficultyLabels = {
  1: 'Beginner',
  2: 'Intermediate',
  3: 'Advanced',
  4: 'Expert',
  5: 'Master'
};

const LearningPage = () => {
  const theme = useTheme();
  
  // State variables
  const [concepts, setConcepts] = useState([]);
  const [savedConcepts, setSavedConcepts] = useState([]);
  const [learningPath, setLearningPath] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConcepts, setFilteredConcepts] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userProgress, setUserProgress] = useState({});
  
  const pageSize = 9;
  
  // Load concepts and user preferences
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get learning path
        const learningPathResponse = await progressService.getLearningPath();
        setLearningPath(learningPathResponse.learning_path || []);
        
        // Get user progress
        const progressResponse = await progressService.getUserProgress();
        
        // Transform progress data for easier lookup
        const progressMap = {};
        progressResponse.results.forEach(item => {
          if (item.content) {
            progressMap[item.content.id] = item.completion_percentage;
          }
        });
        setUserProgress(progressMap);
        
        // Get categories
        const categoriesResponse = await contentService.getCategories();
        setCategories(categoriesResponse.results || []);
        
        // Load initial concepts
        await fetchConcepts();
        
        // Get saved concepts
        const preferencesResponse = await contentService.getUserPreferences();
        setSavedConcepts(preferencesResponse.saved_concepts || []);
        
      } catch (err) {
        console.error('Error fetching learning data:', err);
        setError('Failed to load learning content. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);
  
  // Fetch concepts with current filters
  const fetchConcepts = async () => {
    try {
      setIsLoading(true);
      
      // Prepare query params
      const params = {
        page,
        page_size: pageSize,
        ordering: sortBy
      };
      
      // Add filters if active
      if (difficultyFilter) params.difficulty = difficultyFilter;
      if (categoryFilter) params.category = categoryFilter;
      if (searchQuery) params.search = searchQuery;
      
      // Fetch concepts
      const response = await contentService.getConceptNotes(params);
      
      setConcepts(response.results || []);
      setFilteredConcepts(response.results || []);
      
      // Calculate total pages
      const total = response.count || 0;
      setTotalPages(Math.ceil(total / pageSize));
      
    } catch (err) {
      console.error('Error fetching concepts:', err);
      setError('Failed to load concepts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Effect to refetch when filters/page change
  useEffect(() => {
    fetchConcepts();
  }, [page, difficultyFilter, categoryFilter, searchQuery, sortBy]);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page on new search
  };
  
  // Handle search reset
  const handleClearSearch = () => {
    setSearchQuery('');
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle filter menu
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };
  
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };
  
  // Handle sort menu
  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };
  
  const handleSortClose = () => {
    setSortAnchorEl(null);
  };
  
  // Handle filter changes
  const handleDifficultyChange = (event) => {
    setDifficultyFilter(event.target.value);
    setPage(1); // Reset page on filter change
  };
  
  const handleCategoryChange = (event) => {
    setCategoryFilter(event.target.value);
    setPage(1); // Reset page on filter change
  };
  
  // Handle sort selection
  const handleSortChange = (value) => {
    setSortBy(value);
    setSortAnchorEl(null);
    setPage(1); // Reset page on sort change
  };
  
  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Toggle bookmark on a concept
  const handleToggleBookmark = async (conceptId) => {
    try {
      const isSaved = savedConcepts.includes(conceptId);
      
      // Optimistic UI update
      if (isSaved) {
        setSavedConcepts(savedConcepts.filter(id => id !== conceptId));
      } else {
        setSavedConcepts([...savedConcepts, conceptId]);
      }
      
      // Call API to update preference
      await contentService.toggleSavedConcept(conceptId, !isSaved);
      
    } catch (err) {
      console.error(`Error toggling bookmark for concept ${conceptId}:`, err);
      
      // Revert on error
      const isSaved = savedConcepts.includes(conceptId);
      if (isSaved) {
        setSavedConcepts([...savedConcepts, conceptId]);
      } else {
        setSavedConcepts(savedConcepts.filter(id => id !== conceptId));
      }
    }
  };
  
  // Check if a concept is completed
  const isConceptCompleted = (conceptId) => {
    return userProgress[conceptId] === 100;
  };
  
  // Get progress of a concept
  const getConceptProgress = (conceptId) => {
    return userProgress[conceptId] || 0;
  };
  
  // Render loading state
  if (isLoading && concepts.length === 0) {
    return <Loader fullPage message="Loading learning content..." />;
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Learning Path Header */}
      <LearningPathHeader>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Your Learning Journey
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
              Follow your personalized learning path or explore concepts that interest you.
              Track your progress and build your knowledge step by step.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
            <SchoolIcon sx={{ fontSize: 80, opacity: 0.8 }} />
          </Grid>
        </Grid>
      </LearningPathHeader>
      
      {/* Tab Navigation */}
      <Paper sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth" 
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="All Concepts" />
          <Tab label="Your Path" />
          <Tab label="Saved" />
          <Tab label="Completed" />
        </Tabs>
      </Paper>
      
      {/* Error message if any */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Search and Filter Bar */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4, alignItems: 'center' }}>
        <SearchContainer>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search concepts…"
            inputProps={{ 'aria-label': 'search' }}
            value={searchQuery}
            onChange={handleSearchChange}
            endAdornment={
              searchQuery && (
                <IconButton size="small" onClick={handleClearSearch} sx={{ mr: 1 }}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              )
            }
          />
        </SearchContainer>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Difficulty</InputLabel>
            <Select
              value={difficultyFilter}
              onChange={handleDifficultyChange}
              label="Difficulty"
            >
              <MenuItem value="">All Levels</MenuItem>
              <MenuItem value="1">Beginner</MenuItem>
              <MenuItem value="2">Intermediate</MenuItem>
              <MenuItem value="3">Advanced</MenuItem>
              <MenuItem value="4">Expert</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              onChange={handleCategoryChange}
              label="Category"
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Button
            startIcon={<SortIcon />}
            variant="outlined"
            onClick={handleSortClick}
            size="medium"
          >
            Sort
          </Button>
          
          <Menu
            anchorEl={sortAnchorEl}
            open={Boolean(sortAnchorEl)}
            onClose={handleSortClose}
          >
            <MenuItem 
              selected={sortBy === 'recommended'} 
              onClick={() => handleSortChange('recommended')}
            >
              Recommended
            </MenuItem>
            <MenuItem 
              selected={sortBy === '-created_at'} 
              onClick={() => handleSortChange('-created_at')}
            >
              Newest First
            </MenuItem>
            <MenuItem 
              selected={sortBy === 'created_at'} 
              onClick={() => handleSortChange('created_at')}
            >
              Oldest First
            </MenuItem>
            <MenuItem 
              selected={sortBy === 'difficulty'} 
              onClick={() => handleSortChange('difficulty')}
            >
              Difficulty (Low to High)
            </MenuItem>
            <MenuItem 
              selected={sortBy === '-difficulty'} 
              onClick={() => handleSortChange('-difficulty')}
            >
              Difficulty (High to Low)
            </MenuItem>
          </Menu>
        </Box>
      </Box>
      
      {/* All Concepts Tab */}
      {tabValue === 0 && (
        <>
          {filteredConcepts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No concepts found matching your criteria
              </Typography>
              <Button 
                variant="outlined" 
                color="primary" 
                startIcon={<ClearIcon />}
                onClick={() => {
                  setSearchQuery('');
                  setDifficultyFilter('');
                  setCategoryFilter('');
                  setSortBy('recommended');
                }}
                sx={{ mt: 2 }}
              >
                Clear Filters
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredConcepts.map((concept) => (
                <Grid item key={concept.id} xs={12} sm={6} md={4}>
                  <ConceptCard completed={isConceptCompleted(concept.id)}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={concept.image_url || `https://source.unsplash.com/random/300x200?coding&sig=${concept.id}`}
                      alt={concept.title}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="h6" component="h2" gutterBottom>
                          {concept.title}
                        </Typography>
                        <IconButton 
                          size="small" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleBookmark(concept.id);
                          }}
                          color="primary"
                        >
                          {savedConcepts.includes(concept.id) ? (
                            <BookmarkIcon />
                          ) : (
                            <BookmarkBorderIcon />
                          )}
                        </IconButton>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {concept.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        <Chip 
                          size="small" 
                          color={difficultyColors[concept.difficulty || 1]} 
                          label={difficultyLabels[concept.difficulty || 1]} 
                        />
                        
                        {concept.category && (
                          <Chip 
                            size="small" 
                            label={concept.category} 
                            variant="outlined" 
                          />
                        )}
                        
                        {concept.estimated_time && (
                          <Chip 
                            size="small" 
                            icon={<AccessTimeIcon fontSize="small" />} 
                            label={concept.estimated_time} 
                            variant="outlined" 
                          />
                        )}
                      </Box>
                      
                      {/* Progress bar */}
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {getConceptProgress(concept.id) === 100 ? 'Completed' : 'Progress'}
                        </Typography>
                        <ProgressBar 
                          value={getConceptProgress(concept.id)} 
                          color={getConceptProgress(concept.id) === 100 ? 'success' : 'primary'}
                        />
                      </Box>
                    </CardContent>
                    
                    <CardActions>
                      <Button 
                        component={RouterLink} 
                        to={`/app/learning/${concept.id}`}
                        fullWidth 
                        variant="contained" 
                        color="primary"
                        endIcon={<ArrowForwardIcon />}
                      >
                        {getConceptProgress(concept.id) > 0 && getConceptProgress(concept.id) < 100 
                          ? 'Continue' 
                          : getConceptProgress(concept.id) === 100 
                            ? 'Review' 
                            : 'Start Learning'}
                      </Button>
                    </CardActions>
                  </ConceptCard>
                </Grid>
              ))}
            </Grid>
          )}
          
          {/* Pagination */}
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
        </>
      )}
      
      {/* Learning Path Tab */}
      {tabValue === 1 && (
        <>
          {learningPath.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <SchoolIcon sx={{ fontSize: 60, color: 'primary.main', opacity: 0.4, mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Your personalized learning path is being created
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Complete a few concepts to help us understand your interests and build a customized path for you.
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                component={RouterLink}
                to={`/app/learning/${concepts.length > 0 ? concepts[0].id : ''}`}
              >
                Start Learning
              </Button>
            </Box>
          ) : (
            <>
              <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Your Recommended Learning Path
              </Typography>
              
              <Grid container spacing={2}>
                {learningPath.map((item, index) => (
                  <Grid item xs={12} key={index}>
                    <Paper 
                      sx={{ 
                        p: 3, 
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        position: 'relative',
                        mb: 2,
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          bottom: 0,
                          left: 0,
                          width: '4px',
                          backgroundColor: theme.palette.primary.main,
                          borderTopLeftRadius: theme.shape.borderRadius * 3,
                          borderBottomLeftRadius: theme.shape.borderRadius * 3,
                        }
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: 48, 
                          height: 48, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          borderRadius: '50%',
                          backgroundColor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText,
                          fontWeight: 'bold',
                          fontSize: '1.2rem'
                        }}
                      >
                        {item.step || index + 1}
                      </Box>
                      
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6">{item.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.description || `${item.content_type || 'Concept'} • ${difficultyLabels[item.difficulty] || 'Beginner'} • ${item.estimated_time || '10-15 min'}`}
                        </Typography>
                        
                        {/* Progress bar */}
                        {getConceptProgress(item.content_id) > 0 && (
                          <Box sx={{ mt: 1 }}>
                            <ProgressBar 
                              value={getConceptProgress(item.content_id)} 
                              color={getConceptProgress(item.content_id) === 100 ? 'success' : 'primary'}
                            />
                          </Box>
                        )}
                      </Box>
                      
                      <Box>
                        <Button 
                          variant="contained" 
                          color="primary"
                          component={RouterLink}
                          to={`/app/learning/${item.content_id}`}
                          endIcon={<ArrowForwardIcon />}
                        >
                          {getConceptProgress(item.content_id) > 0 && getConceptProgress(item.content_id) < 100 
                            ? 'Continue' 
                            : getConceptProgress(item.content_id) === 100 
                              ? 'Review' 
                              : 'Start'}
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </>
      )}
      
      {/* Saved Concepts Tab */}
      {tabValue === 2 && (
        <>
          {savedConcepts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <BookmarkBorderIcon sx={{ fontSize: 60, color: 'primary.main', opacity: 0.4, mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                You haven't saved any concepts yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Bookmark concepts you want to revisit later by clicking the bookmark icon on any concept card.
              </Typography>
              <Button 
                variant="outlined" 
                color="primary"
                onClick={() => setTabValue(0)}
              >
                Browse Concepts
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {concepts
                .filter(concept => savedConcepts.includes(concept.id))
                .map((concept) => (
                  <Grid item key={concept.id} xs={12} sm={6} md={4}>
                    <ConceptCard completed={isConceptCompleted(concept.id)}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={concept.image_url || `https://source.unsplash.com/random/300x200?coding&sig=${concept.id}`}
                        alt={concept.title}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Typography variant="h6" component="h2" gutterBottom>
                            {concept.title}
                          </Typography>
                          <IconButton 
                            size="small" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleBookmark(concept.id);
                            }}
                            color="primary"
                          >
                            <BookmarkIcon />
                          </IconButton>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {concept.description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                          <Chip 
                            size="small" 
                            color={difficultyColors[concept.difficulty || 1]} 
                            label={difficultyLabels[concept.difficulty || 1]} 
                          />
                          
                          {concept.category && (
                            <Chip 
                              size="small" 
                              label={concept.category} 
                              variant="outlined" 
                            />
                          )}
                          
                          {concept.estimated_time && (
                            <Chip 
                              size="small" 
                              icon={<AccessTimeIcon fontSize="small" />} 
                              label={concept.estimated_time} 
                              variant="outlined" 
                            />
                          )}
                        </Box>
                        
                        {/* Progress bar */}
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            {getConceptProgress(concept.id) === 100 ? 'Completed' : 'Progress'}
                          </Typography>
                          <ProgressBar 
                            value={getConceptProgress(concept.id)} 
                            color={getConceptProgress(concept.id) === 100 ? 'success' : 'primary'}
                          />
                        </Box>
                      </CardContent>
                      
                      <CardActions>
                        <Button 
                          component={RouterLink} 
                          to={`/app/learning/${concept.id}`}
                          fullWidth 
                          variant="contained" 
                          color="primary"
                          endIcon={<ArrowForwardIcon />}
                        >
                          {getConceptProgress(concept.id) > 0 && getConceptProgress(concept.id) < 100 
                            ? 'Continue' 
                            : getConceptProgress(concept.id) === 100 
                              ? 'Review' 
                              : 'Start Learning'}
                        </Button>
                      </CardActions>
                    </ConceptCard>
                  </Grid>
                ))}
            </Grid>
          )}
        </>
      )}
      
      {/* Completed Concepts Tab */}
      {tabValue === 3 && (
        <>
          {Object.keys(userProgress).filter(id => userProgress[id] === 100).length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', opacity: 0.4, mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                You haven't completed any concepts yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Continue learning and complete concepts to see them listed here.
                Completed concepts can be revisited anytime for review.
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => setTabValue(0)}
              >
                Explore Concepts
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {concepts
                .filter(concept => userProgress[concept.id] === 100)
                .map((concept) => (
                  <Grid item key={concept.id} xs={12} sm={6} md={4}>
                    <ConceptCard completed={true}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={concept.image_url || `https://source.unsplash.com/random/300x200?coding&sig=${concept.id}`}
                        alt={concept.title}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Typography variant="h6" component="h2" gutterBottom>
                            {concept.title}
                          </Typography>
                          <Chip 
                            icon={<CheckCircleIcon />} 
                            label="Completed" 
                            size="small" 
                            color="success" 
                            sx={{ fontWeight: 'medium' }}
                          />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {concept.description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                          <Chip 
                            size="small" 
                            color={difficultyColors[concept.difficulty || 1]} 
                            label={difficultyLabels[concept.difficulty || 1]} 
                          />
                          
                          {concept.category && (
                            <Chip 
                              size="small" 
                              label={concept.category} 
                              variant="outlined" 
                            />
                          )}
                          
                          {concept.estimated_time && (
                            <Chip 
                              size="small" 
                              icon={<AccessTimeIcon fontSize="small" />} 
                              label={concept.estimated_time} 
                              variant="outlined" 
                            />
                          )}
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Completed on{' '}
                            {concept.completion_date ? new Date(concept.completion_date).toLocaleDateString() : 'recently'}
                          </Typography>
                          
                          <IconButton 
                            size="small" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleBookmark(concept.id);
                            }}
                            color="primary"
                          >
                            {savedConcepts.includes(concept.id) ? (
                              <BookmarkIcon />
                            ) : (
                              <BookmarkBorderIcon />
                            )}
                          </IconButton>
                        </Box>
                      </CardContent>
                      
                      <CardActions>
                        <Button 
                          component={RouterLink} 
                          to={`/app/learning/${concept.id}`}
                          fullWidth 
                          variant="contained" 
                          color="primary"
                          endIcon={<ArrowForwardIcon />}
                        >
                          Review Concept
                        </Button>
                      </CardActions>
                    </ConceptCard>
                  </Grid>
                ))}
            </Grid>
          )}
          
          {/* Pagination for completed concepts if needed */}
          {totalPages > 1 && concepts.filter(concept => userProgress[concept.id] === 100).length > pageSize && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary" 
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default LearningPage;