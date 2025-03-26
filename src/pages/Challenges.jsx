import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions,
  Button, 
  Chip, 
  CircularProgress, 
  Container,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Alert,
  Divider
} from '@mui/material';
import { 
  Search as SearchIcon, 
  FilterList as FilterIcon,
  Code as CodeIcon,
  Stars as StarsIcon,
  EmojiEvents as EmojiEventsIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Services
import { contentService } from '../services/contentService';

const ChallengeBanner = styled(Box)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(6, 0),
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  textAlign: 'center',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
  },
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius * 2,
}));

const DifficultyChip = styled(Chip)(({ theme, difficulty }) => {
  let color;
  switch (difficulty) {
    case 'Beginner':
    case 1:
      color = theme.palette.success.main;
      break;
    case 'Intermediate':
    case 2:
      color = theme.palette.info.main;
      break;
    case 'Advanced':
    case 3:
      color = theme.palette.warning.main;
      break;
    case 'Expert':
    case 4:
      color = theme.palette.error.main;
      break;
    default:
      color = theme.palette.primary.main;
  }
  
  return {
    backgroundColor: color,
    color: '#fff',
    fontWeight: 'bold',
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
  };
});

const ChallengesPage = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 9;
  
  // Categories data (would come from API in real app)
  const categories = [
    { id: 'python', name: 'Python' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'html_css', name: 'HTML & CSS' },
    { id: 'algorithms', name: 'Algorithms' },
    { id: 'data_structures', name: 'Data Structures' }
  ];

  // Difficulty levels
  const difficultyLevels = [
    { value: 1, label: 'Beginner' },
    { value: 2, label: 'Intermediate' },
    { value: 3, label: 'Advanced' },
    { value: 4, label: 'Expert' }
  ];
  
  // Sorting options
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'difficulty_asc', label: 'Easiest First' },
    { value: 'difficulty_desc', label: 'Hardest First' },
    { value: 'popularity', label: 'Most Popular' }
  ];
  
  // Transform difficulty number to readable text
  const getDifficultyText = (level) => {
    const difficulty = difficultyLevels.find(d => d.value === level);
    return difficulty ? difficulty.label : 'Unknown';
  };
  
  // Fetch challenges when filters change
  useEffect(() => {
    const fetchChallenges = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Prepare params for API call
        const params = {
          page,
          page_size: pageSize
        };
        
        // Add filters if they exist
        if (searchQuery) params.search = searchQuery;
        if (difficultyFilter) params.difficulty = difficultyFilter;
        if (categoryFilter) params.category = categoryFilter;
        
        // Add sorting
        if (sortBy === 'newest') params.ordering = '-created_at';
        else if (sortBy === 'oldest') params.ordering = 'created_at';
        else if (sortBy === 'difficulty_asc') params.ordering = 'difficulty';
        else if (sortBy === 'difficulty_desc') params.ordering = '-difficulty';
        else if (sortBy === 'popularity') params.ordering = '-completion_count';
        
        // Call API
        const response = await contentService.getChallenges(params);
        
        setChallenges(response.results);
        setTotalPages(Math.ceil(response.count / pageSize));
      } catch (err) {
        console.error('Error fetching challenges:', err);
        setError('Failed to load challenges. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchChallenges();
  }, [page, searchQuery, difficultyFilter, categoryFilter, sortBy]);
  
  // Handle search input
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1); // Reset to first page on new search
  };
  
  // Handle filter changes
  const handleDifficultyChange = (event) => {
    setDifficultyFilter(event.target.value);
    setPage(1);
  };
  
  const handleCategoryChange = (event) => {
    setCategoryFilter(event.target.value);
    setPage(1);
  };
  
  // Handle sort change
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setPage(1);
  };
  
  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setDifficultyFilter('');
    setCategoryFilter('');
    setSortBy('newest');
    setPage(1);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Banner */}
      <ChallengeBanner>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Coding Challenges
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, maxWidth: '800px', mx: 'auto' }}>
          Solve fun challenges, level up your coding skills, and earn cool badges while learning!
        </Typography>
      </ChallengeBanner>
      
      {/* Filters */}
      <Box sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 4, boxShadow: 1 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              label="Search Challenges"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={difficultyFilter}
                onChange={handleDifficultyChange}
                label="Difficulty"
              >
                <MenuItem value="">All Levels</MenuItem>
                {difficultyLevels.map((level) => (
                  <MenuItem key={level.value} value={level.value}>
                    {level.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth variant="outlined">
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
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={handleSortChange}
                label="Sort By"
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <Button 
              fullWidth 
              variant="outlined" 
              color="secondary" 
              onClick={handleResetFilters}
              startIcon={<FilterIcon />}
            >
              Reset Filters
            </Button>
          </Grid>
        </Grid>
      </Box>
      
      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Loading State */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress color="secondary" size={60} />
        </Box>
      ) : (
        <>
          {/* No Results */}
          {challenges.length === 0 ? (
            <Box sx={{ textAlign: 'center', my: 8 }}>
              <Typography variant="h5" color="text.secondary" gutterBottom>
                No challenges found
              </Typography>
              <Typography variant="body1">
                Try adjusting your filters or search terms.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ mt: 3 }}
                onClick={handleResetFilters}
              >
                Show All Challenges
              </Button>
            </Box>
          ) : (
            <>
              {/* Challenge Cards */}
              <Grid container spacing={3}>
                {challenges.map((challenge) => (
                  <Grid item key={challenge.id} xs={12} sm={6} md={4}>
                    <StyledCard>
                      <DifficultyChip 
                        label={getDifficultyText(challenge.difficulty)} 
                        difficulty={challenge.difficulty}
                      />

                      <CardMedia
                    component="img"
                    image={challenge.image_url}
                    alt={challenge.title}
                    sx={{ height: 300, width: 500, margin: '0 auto', objectFit: 'fit' }}
                  />
                      
                      {/* <CardMedia
                        component="img"
                        height="140"
                        image={challenge.image_url || `https://source.unsplash.com/random/300x200?coding&sig=${challenge.id}`}
                        alt={challenge.title}
                      /> */}
                      
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                          {challenge.title}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {challenge.short_description || challenge.problem_statement.substring(0, 100)}...
                        </Typography>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <StarsIcon fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                            <Typography variant="body2">
                              {challenge.points || 100} points
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccessTimeIcon fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                            <Typography variant="body2">
                              {challenge.estimated_time || '10-15'} mins
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ mt: 2 }}>
                          <Chip 
                            label={challenge.category || categories[Math.floor(Math.random() * categories.length)].name} 
                            size="small" 
                            sx={{ mr: 1, mb: 1 }}
                          />
                          {challenge.tags && challenge.tags.slice(0, 2).map(tag => (
                            <Chip 
                              key={tag} 
                              label={tag} 
                              size="small" 
                              variant="outlined" 
                              sx={{ mr: 1, mb: 1 }}
                            />
                          ))}
                        </Box>
                      </CardContent>
                      
                      <Divider />
                      
                      <CardActions>
                        <Button 
                          size="small" 
                          color="primary" 
                          component={RouterLink} 
                          to={`/app/challenges/${challenge.id}`}
                          startIcon={<CodeIcon />}
                          sx={{ ml: 'auto', mr: 'auto' }}
                        >
                          Start Challenge
                        </Button>
                      </CardActions>
                    </StyledCard>
                  </Grid>
                ))}
              </Grid>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 2 }}>
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
        </>
      )}
    </Container>
  );
};

export default ChallengesPage;