import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Grid,
  Card, 
  CardContent, 
  CardMedia,
  Button, 
  Chip,
  TextField,
  InputAdornment,
  Skeleton,
  Alert,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Paper,
  Avatar,
  Divider,
  useTheme
} from '@mui/material';
import { 
  People as MentorsIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  CalendarMonth as CalendarIcon,
  SupervisorAccount as RequestIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import mentorService from '../services/mentorService';
import { useAuth } from '../contexts/AuthContext';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s, box-shadow 0.2s',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  },
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden'
}));

const SkillChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  '& .MuiChip-label': {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  }
}));

const MentorsPage = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  
  useEffect(() => {
    fetchMentors();
  }, [page, searchQuery]);
  
  const fetchMentors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to get mentors from API
      try {
        const response = await mentorService.getMentors({
          page,
          search: searchQuery,
          page_size: 8
        });
        
        setMentors(response.results || []);
        setTotalPages(Math.ceil(response.count / 8));
      } catch (apiErr) {
        console.error('API error:', apiErr);
        // Fallback to mock data
        if (process.env.NODE_ENV === 'development') {
          const mockMentors = generateMockMentors();
          setMentors(mockMentors);
          setTotalPages(Math.ceil(mockMentors.length / 8));
        } else {
          throw apiErr;
        }
      }
    } catch (err) {
      console.error('Error fetching mentors:', err);
      setError('Failed to load mentors. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };
  
  const handleOpenMentorDialog = (mentor) => {
    setSelectedMentor(mentor);
    setOpenDialog(true);
    setRequestSuccess(false);
    setMessage('');
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMentor(null);
  };
  
  const handleSendRequest = async () => {
    if (!message.trim()) return;
    
    try {
      setSending(true);
      
      // Send mentorship request
      await mentorService.requestMentorship({
        mentor_id: selectedMentor.id,
        message,
      });
      
      setRequestSuccess(true);
      setMessage('');
    } catch (err) {
      console.error('Error sending mentorship request:', err);
      setError('Failed to send request. Please try again later.');
    } finally {
      setSending(false);
    }
  };
  
  // Generate mock data for development
  const generateMockMentors = () => {
    const skills = ['JavaScript', 'Python', 'React', 'Data Science', 'AI', 'Machine Learning', 
      'Web Development', 'Mobile Apps', 'Game Development', 'HTML/CSS', 'UI/UX', 'AR/VR'];
    
    const mentors = [
      {
        id: 1,
        name: 'Sarah Johnson',
        title: 'Senior Software Engineer',
        company: 'Google',
        bio: 'Passionate about helping young girls learn to code and build amazing projects.',
        experience_years: 8,
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        skills: ['JavaScript', 'React', 'Web Development'],
        availability: '2 hours/week'
      },
      {
        id: 2,
        name: 'Maria Rodriguez',
        title: 'Data Scientist',
        company: 'Microsoft',
        bio: 'I love working with data and teaching others how to analyze and visualize information.',
        experience_years: 5,
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        skills: ['Python', 'Data Science', 'Machine Learning'],
        availability: '1 hour/week'
      },
      {
        id: 3,
        name: 'Jessica Williams',
        title: 'Mobile Developer',
        company: 'Apple',
        bio: 'Building apps that change how people interact with technology is my passion.',
        experience_years: 6,
        avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
        skills: ['Mobile Apps', 'JavaScript', 'UI/UX'],
        availability: '3 hours/week'
      },
      {
        id: 4,
        name: 'Priya Patel',
        title: 'Game Developer',
        company: 'Electronic Arts',
        bio: 'Gaming taught me to code, now I develop games and help others learn too.',
        experience_years: 7,
        avatar: 'https://randomuser.me/api/portraits/women/75.jpg',
        skills: ['Game Development', 'Python', 'AR/VR'],
        availability: '2 hours/week'
      },
      {
        id: 5,
        name: 'Aisha Khan',
        title: 'AI Researcher',
        company: 'DeepMind',
        bio: 'Interested in how AI can solve problems and help society move forward.',
        experience_years: 9,
        avatar: 'https://randomuser.me/api/portraits/women/62.jpg',
        skills: ['AI', 'Python', 'Machine Learning'],
        availability: '1 hour/week'
      },
      {
        id: 6,
        name: 'Emily Chen',
        title: 'Web Developer',
        company: 'Amazon',
        bio: 'Web development is a creative outlet where functionality meets design.',
        experience_years: 4,
        avatar: 'https://randomuser.me/api/portraits/women/26.jpg',
        skills: ['HTML/CSS', 'JavaScript', 'Web Development'],
        availability: '2 hours/week'
      },
      {
        id: 7,
        name: 'Zoe Wilson',
        title: 'UX Designer',
        company: 'Facebook',
        bio: 'Designing experiences that delight users and make technology accessible.',
        experience_years: 7,
        avatar: 'https://randomuser.me/api/portraits/women/14.jpg',
        skills: ['UI/UX', 'Web Development', 'HTML/CSS'],
        availability: '3 hours/week'
      },
      {
        id: 8,
        name: 'Olivia Brown',
        title: 'Robotics Engineer',
        company: 'Boston Dynamics',
        bio: 'Robots are the future, and I want to help more girls enter this exciting field.',
        experience_years: 6,
        avatar: 'https://randomuser.me/api/portraits/women/50.jpg',
        skills: ['Python', 'AI', 'Machine Learning'],
        availability: '1 hour/week'
      },
      {
        id: 9,
        name: 'Sophia Martinez',
        title: 'Full Stack Developer',
        company: 'Netflix',
        bio: 'I believe in building end-to-end solutions and mentoring the next generation.',
        experience_years: 8,
        avatar: 'https://randomuser.me/api/portraits/women/80.jpg',
        skills: ['JavaScript', 'Python', 'Web Development'],
        availability: '2 hours/week'
      }
    ];
    
    // Filter by search query if provided
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return mentors.filter(mentor => 
        mentor.name.toLowerCase().includes(query) ||
        mentor.title.toLowerCase().includes(query) ||
        mentor.company.toLowerCase().includes(query) ||
        mentor.bio.toLowerCase().includes(query) ||
        mentor.skills.some(skill => skill.toLowerCase().includes(query))
      );
    }
    
    return mentors;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <MentorsIcon sx={{ fontSize: 32, mr: 1, color: 'primary.main' }} />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Connect with Mentors
        </Typography>
      </Box>
      
      <Paper sx={{ p: 3, mb: 4, borderRadius: theme.shape.borderRadius * 2 }}>
        <Typography variant="h6" gutterBottom>
          Find Your Perfect Mentor
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Our mentors are industry professionals who volunteer their time to help girls like you learn coding and tech skills. 
          Connect with someone who can guide you on your journey into technology!
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            placeholder="Search mentors by name, skills, or company..."
            variant="outlined"
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
        </Box>
      </Paper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ mb: 4 }}>
        {loading ? (
          <Grid container spacing={3}>
            {[...Array(4)].map((_, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ height: '100%' }}>
                  <Skeleton variant="rectangular" height={140} />
                  <CardContent>
                    <Skeleton variant="text" height={32} />
                    <Skeleton variant="text" height={24} width="60%" />
                    <Skeleton variant="text" height={20} />
                    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap' }}>
                      <Skeleton variant="rectangular" width={60} height={24} sx={{ mr: 1, mb: 1, borderRadius: 16 }} />
                      <Skeleton variant="rectangular" width={80} height={24} sx={{ mr: 1, mb: 1, borderRadius: 16 }} />
                      <Skeleton variant="rectangular" width={70} height={24} sx={{ borderRadius: 16 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : mentors.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <MentorsIcon sx={{ fontSize: 80, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No mentors found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchQuery ? "Try a different search term" : "Check back later for new mentors"}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {mentors.map((mentor) => (
              <Grid item xs={12} sm={6} md={3} key={mentor.id}>
                <StyledCard onClick={() => handleOpenMentorDialog(mentor)}>
                  <Box sx={{ position: 'relative', pt: '75%', overflow: 'hidden' }}>
                    {mentor.avatar ? (
                      <CardMedia
                        component="img"
                        image={mentor.avatar}
                        alt={mentor.name}
                        sx={{ 
                          position: 'absolute',
                          top: 0,
                          objectFit: 'cover',
                          width: '100%',
                          height: '100%'
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '100%',
                          height: '100%',
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                        }}
                      >
                        <Typography variant="h3">
                          {mentor.name.charAt(0)}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {mentor.name}
                    </Typography>
                    <Typography variant="subtitle2" color="primary.main" gutterBottom>
                      {mentor.title} at {mentor.company}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ 
                      mb: 2,
                      display: '-webkit-box',
                      overflow: 'hidden',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 2
                    }}>
                      {mentor.bio}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                      {mentor.skills.slice(0, 3).map((skill, index) => (
                        <SkillChip
                          key={index}
                          label={skill}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      
      {totalPages > 1 && (
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
      
      {/* Mentor Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedMentor && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  src={selectedMentor.avatar} 
                  alt={selectedMentor.name}
                  sx={{ width: 64, height: 64, mr: 2 }}
                />
                <Box>
                  <Typography variant="h5" component="div">
                    {selectedMentor.name}
                  </Typography>
                  <Typography variant="subtitle1" color="primary.main">
                    {selectedMentor.title} at {selectedMentor.company}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            
            <DialogContent dividers>
              {requestSuccess ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Avatar
                    sx={{
                      mx: 'auto',
                      mb: 2,
                      bgcolor: 'success.main',
                      width: 80,
                      height: 80,
                    }}
                  >
                    <SendIcon sx={{ fontSize: 40 }} />
                  </Avatar>
                  
                  <Typography variant="h5" gutterBottom>
                    Request Sent Successfully!
                  </Typography>
                  
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Your mentorship request has been sent to {selectedMentor.name}.
                    They'll review your request and get back to you soon.
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleCloseDialog}
                    sx={{ mt: 2 }}
                  >
                    Close
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={7}>
                    <Typography variant="h6" gutterBottom>
                      About
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {selectedMentor.bio}
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Expertise
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        {selectedMentor.skills.map((skill, index) => (
                          <SkillChip
                            key={index}
                            label={skill}
                            color="primary"
                            variant="outlined"
                            size="medium"
                          />
                        ))}
                      </Box>
                    </Box>
                    
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Experience
                        </Typography>
                        <Typography variant="body1">
                          {selectedMentor.experience_years} years
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Availability
                        </Typography>
                        <Typography variant="body1">
                          {selectedMentor.availability}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  
                  <Grid item xs={12} md={5}>
                    <Paper
                      variant="outlined"
                      sx={{ p: 3, borderRadius: theme.shape.borderRadius * 2 }}
                    >
                      <Typography variant="h6" gutterBottom>
                        Request Mentorship
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Tell {selectedMentor.name} what you're hoping to learn and why you'd like them as your mentor.
                      </Typography>
                      
                      <TextField
                        fullWidth
                        label="Your message"
                        multiline
                        rows={5}
                        margin="normal"
                        variant="outlined"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={`Hi ${selectedMentor.name}, I'd like to learn more about...`}
                      />
                      
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleSendRequest}
                        disabled={!message.trim() || sending}
                        startIcon={sending ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                        sx={{ mt: 2 }}
                      >
                        {sending ? "Sending..." : "Send Request"}
                      </Button>
                    </Paper>
                  </Grid>
                </Grid>
              )}
            </DialogContent>
            
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={handleCloseDialog} color="inherit">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default MentorsPage;