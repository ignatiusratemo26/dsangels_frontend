import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Grid,
  Card, 
  CardContent, 
  CardMedia,
  CardActions,
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
  IconButton,
  Divider,
  Link,
  Paper,
  Tabs,
  Tab,
  useTheme
} from '@mui/material';
import { 
  Person as PersonIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  VerifiedUser as VerifiedIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  GitHub as GitHubIcon,
  Language as WebsiteIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Create a service file for this later
const roleModelService = {
  async getRoleModels({ page = 1, search = '', category = 'all', page_size = 8 }) {
    // This would be an API call in production
    return {
      results: generateMockRoleModels(search, category).slice((page - 1) * page_size, page * page_size),
      count: generateMockRoleModels(search, category).length
    };
  },
  
  async toggleFavorite(roleModelId) {
    console.log('Toggle favorite for role model:', roleModelId);
    // This would be an API call in production
    return { success: true };
  }
};

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  },
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden'
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  fontWeight: 500
}));

const CategoryTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const CategoryTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  '&.Mui-selected': {
    color: theme.palette.secondary.main,
  },
}));

const RoleModelsPage = () => {
  const theme = useTheme();
  const [roleModels, setRoleModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleModel, setSelectedRoleModel] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [category, setCategory] = useState('all');
  
  useEffect(() => {
    fetchRoleModels();
  }, [page, searchQuery, category]);
  
  const fetchRoleModels = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await roleModelService.getRoleModels({
        page,
        search: searchQuery,
        category,
        page_size: 8
      });
      
      setRoleModels(response.results);
      setTotalPages(Math.ceil(response.count / 8));
    } catch (err) {
      console.error('Error fetching role models:', err);
      setError('Failed to load role models. Please try again later.');
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
  
  const handleCategoryChange = (event, newValue) => {
    setCategory(newValue);
    setPage(1);
  };
  
  const handleOpenRoleModelDialog = (roleModel) => {
    setSelectedRoleModel(roleModel);
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRoleModel(null);
  };
  
  const handleToggleFavorite = async (roleModel, e) => {
    e.stopPropagation(); // Prevent opening the dialog
    
    try {
      await roleModelService.toggleFavorite(roleModel.id);
      
      // Update local state
      setRoleModels(prevRoleModels => 
        prevRoleModels.map(rm => 
          rm.id === roleModel.id ? { ...rm, is_favorite: !rm.is_favorite } : rm
        )
      );
      
      // If the dialog is open, update the selected role model too
      if (selectedRoleModel && selectedRoleModel.id === roleModel.id) {
        setSelectedRoleModel(prevSelectedRoleModel => ({
          ...prevSelectedRoleModel,
          is_favorite: !prevSelectedRoleModel.is_favorite
        }));
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <PersonIcon sx={{ fontSize: 32, mr: 1, color: 'primary.main' }} />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Women in Tech Role Models
        </Typography>
      </Box>
      
      <Paper sx={{ p: 3, mb: 4, borderRadius: theme.shape.borderRadius * 2 }}>
        <Typography variant="h6" gutterBottom>
          Inspiring Women in Technology
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Discover women who have made significant contributions to technology and can inspire your journey. 
          From historical pioneers to modern-day innovators, these role models show what's possible in tech!
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mt: 2 }}>
          <TextField
            placeholder="Search role models..."
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3 }}>
          <CategoryTabs value={category} onChange={handleCategoryChange} variant="scrollable" scrollButtons="auto">
            <CategoryTab label="All" value="all" />
            <CategoryTab label="Pioneers" value="pioneer" />
            <CategoryTab label="Modern Leaders" value="leader" />
            <CategoryTab label="Engineers" value="engineer" />
            <CategoryTab label="Scientists" value="scientist" />
            <CategoryTab label="Entrepreneurs" value="entrepreneur" />
          </CategoryTabs>
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
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent>
                    <Skeleton variant="text" height={32} />
                    <Skeleton variant="text" height={24} width="60%" />
                    <Skeleton variant="text" height={20} />
                    <Box sx={{ mt: 2 }}>
                      <Skeleton variant="rectangular" width="40%" height={24} sx={{ borderRadius: 16 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : roleModels.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <PersonIcon sx={{ fontSize: 80, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No role models found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchQuery ? "Try a different search term" : "Try a different category"}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {roleModels.map((roleModel) => (
              <Grid item xs={12} sm={6} md={3} key={roleModel.id}>
                <StyledCard onClick={() => handleOpenRoleModelDialog(roleModel)}>
                  <Box sx={{ position: 'relative', pt: '75%' }}>
                    <CardMedia
                      component="img"
                      image={roleModel.image}
                      alt={roleModel.name}
                      sx={{ 
                        position: 'absolute',
                        top: 0,
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%'
                      }}
                    />
                    <IconButton
                      onClick={(e) => handleToggleFavorite(roleModel, e)}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        }
                      }}
                    >
                      {roleModel.is_favorite ? (
                        <FavoriteIcon color="secondary" />
                      ) : (
                        <FavoriteBorderIcon />
                      )}
                    </IconButton>
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {roleModel.name}
                    </Typography>
                    <Typography variant="body2" color="primary.main" gutterBottom>
                      {roleModel.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ 
                      mb: 2,
                      display: '-webkit-box',
                      overflow: 'hidden',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 3
                    }}>
                      {roleModel.brief}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
                    <CategoryChip 
                      label={roleModel.category} 
                      size="small"
                      color={
                        roleModel.category === 'Pioneer' ? 'secondary' :
                        roleModel.category === 'Leader' ? 'primary' :
                        roleModel.category === 'Engineer' ? 'info' :
                        roleModel.category === 'Scientist' ? 'success' : 'warning'
                      }
                    />
                  </CardActions>
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
      
      {/* Role Model Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: theme.shape.borderRadius * 2 }
        }}
      >
        {selectedRoleModel && (
          <>
            <DialogTitle sx={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 3
            }}>
              <Typography variant="h5" component="div">
                {selectedRoleModel.name}
              </Typography>
              <Box>
                <IconButton
                  onClick={(e) => handleToggleFavorite(selectedRoleModel, e)}
                  color={selectedRoleModel.is_favorite ? 'secondary' : 'default'}
                  sx={{ mr: 1 }}
                >
                  {selectedRoleModel.is_favorite ? (
                    <FavoriteIcon />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
                <IconButton onClick={handleCloseDialog}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            
            <DialogContent dividers sx={{ p: 0 }}>
              <Grid container>
                <Grid item xs={12} md={5} sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}>
                  <Box sx={{ 
                    flex: 1,
                    position: 'relative',
                    minHeight: { xs: '300px', md: '100%' }
                  }}>
                    <CardMedia
                      component="img"
                      image={selectedRoleModel.image}
                      alt={selectedRoleModel.name}
                      sx={{ 
                        height: '100%',
                        width: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={7} sx={{ p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" color="primary.main" gutterBottom>
                      {selectedRoleModel.title}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {selectedRoleModel.description}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Born
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        {selectedRoleModel.born}
                      </Typography>
                      
                      <Typography variant="subtitle2" color="text.secondary">
                        Known For
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        {selectedRoleModel.known_for}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      {selectedRoleModel.achievements && (
                        <>
                          <Typography variant="subtitle2" color="text.secondary">
                            Key Achievements
                          </Typography>
                          <Box component="ul" sx={{ pl: 2, mt: 0.5 }}>
                            {selectedRoleModel.achievements.map((achievement, index) => (
                              <Typography component="li" variant="body2" key={index} sx={{ mb: 0.5 }}>
                                {achievement}
                              </Typography>
                            ))}
                          </Box>
                        </>
                      )}
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Why She's Inspiring
                    </Typography>
                    <Typography variant="body1">
                      {selectedRoleModel.inspiration}
                    </Typography>
                  </Box>
                  
                  {selectedRoleModel.quote && (
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        mb: 3,
                        borderRadius: 2,
                        borderColor: 'primary.light',
                        backgroundColor: 'primary.light',
                        backgroundOpacity: 0.1
                      }}
                    >
                      <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                        "{selectedRoleModel.quote}"
                      </Typography>
                    </Paper>
                  )}
                  
                  {/* Links section */}
                  {selectedRoleModel.links && (
                    <Box sx={{ mt: 3 }}>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="subtitle2" gutterBottom>
                        Learn More About {selectedRoleModel.name.split(' ')[0]}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {selectedRoleModel.links.website && (
                          <Button
                            component="a"
                            href={selectedRoleModel.links.website}
                            target="_blank"
                            rel="noopener"
                            startIcon={<WebsiteIcon />}
                            variant="outlined"
                            size="small"
                          >
                            Website
                          </Button>
                        )}
                        {selectedRoleModel.links.wikipedia && (
                          <Button
                            component="a"
                            href={selectedRoleModel.links.wikipedia}
                            target="_blank"
                            rel="noopener"
                            startIcon={<SchoolIcon />}
                            variant="outlined"
                            size="small"
                          >
                            Wikipedia
                          </Button>
                        )}
                        {selectedRoleModel.links.github && (
                          <Button
                            component="a"
                            href={selectedRoleModel.links.github}
                            target="_blank"
                            rel="noopener"
                            startIcon={<GitHubIcon />}
                            variant="outlined"
                            size="small"
                          >
                            GitHub
                          </Button>
                        )}
                      </Box>
                    </Box>
                  )}
                </Grid>
              </Grid>
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

// Helper function to generate mock data
function generateMockRoleModels(search = '', category = 'all') {
  const roleModels = [
    {
      id: 1,
      name: "Ada Lovelace",
      title: "World's First Computer Programmer",
      brief: "Created the first algorithm intended for processing on a computer in the mid-1800s.",
      description: "Ada Lovelace is considered the first computer programmer and was the first to recognize that computers had applications beyond pure calculation. She wrote the first algorithm designed to be carried out by a machine like Charles Babbage's Analytical Engine, essentially creating the first computer program.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Ada_Lovelace_portrait.jpg/800px-Ada_Lovelace_portrait.jpg",
      category: "Pioneer",
      born: "December 10, 1815",
      known_for: "First Computer Program",
      achievements: [
        "Created the first algorithm for a computing machine",
        "Conceptualized that computers could go beyond calculation and create art and music",
        "First to envision the potential of computers beyond mathematics"
      ],
      inspiration: "Ada overcame significant barriers as a woman in mathematics during the 19th century and made profound contributions that were ahead of her time. Her vision that computers could be more than calculation machines was revolutionary.",
      quote: "The Analytical Engine weaves algebraic patterns, just as the Jacquard loom weaves flowers and leaves.",
      links: {
        wikipedia: "https://en.wikipedia.org/wiki/Ada_Lovelace",
        website: "https://findingada.com/",
      },
      is_favorite: false
    },
    {
      id: 2,
      name: "Grace Hopper",
      title: "Computer Scientist & Naval Officer",
      brief: "Pioneered computer programming languages, created the first compiler, and coined the term 'debugging'.",
      description: "Grace Hopper was a computer scientist and United States Navy rear admiral who was one of the first programmers of the Harvard Mark I computer. She led the development of the first compiler and popularized the idea of machine-independent programming languages, which led to the development of COBOL.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Commodore_Grace_M._Hopper%2C_USN_%28covered%29.jpg/800px-Commodore_Grace_M._Hopper%2C_USN_%28covered%29.jpg",
      category: "Pioneer",
      born: "December 9, 1906",
      known_for: "Developing the first compiler, COBOL language",
      achievements: [
        "Created the first compiler, which translated written language into computer code",
        "Helped develop COBOL, one of the first high-level programming languages",
        "Found the first computer 'bug' - a moth stuck in a relay",
        "Received the National Medal of Technology"
      ],
      inspiration: "Grace Hopper's innovations made programming more accessible and practical. Her pioneering work on compilers revolutionized how we interact with computers, enabling the creation of software using words rather than just numbers.",
      quote: "The most dangerous phrase in the language is, 'We've always done it this way.'",
      links: {
        wikipedia: "https://en.wikipedia.org/wiki/Grace_Hopper",
        website: "https://ghc.anitab.org/",
      },
      is_favorite: false
    },
    {
      id: 3,
      name: "Katherine Johnson",
      title: "NASA Mathematician",
      brief: "Her calculations were critical to the success of the first U.S. crewed spaceflights.",
      description: "Katherine Johnson was a mathematician whose calculations of orbital mechanics were critical to the success of the first and subsequent U.S. crewed spaceflights. During her 33-year career at NASA, she earned a reputation for mastering complex manual calculations and helped pioneer the use of computers to perform tasks.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Katherine_Johnson_1983.jpg/800px-Katherine_Johnson_1983.jpg",
      category: "Scientist",
      born: "August 26, 1918",
      known_for: "Calculating trajectories for NASA space missions",
      achievements: [
        "Calculated the trajectory for Alan Shepard, the first American in space",
        "Verified the calculations for John Glenn's orbit around Earth",
        "Calculated the trajectory for the 1969 Apollo 11 mission to the Moon",
        "Received the Presidential Medal of Freedom in 2015"
      ],
      inspiration: "Katherine Johnson overcame both gender and racial barriers to become an essential figure in America's space program. Her brilliance, precision, and perseverance changed what was possible in space exploration and opened doors for women and people of color in STEM fields.",
      quote: "Like what you do, and then you will do your best.",
      links: {
        wikipedia: "https://en.wikipedia.org/wiki/Katherine_Johnson",
      },
      is_favorite: false
    },
    {
      id: 4,
      name: "Annie Easley",
      title: "Computer Scientist & Mathematician",
      brief: "Developed software for NASA that led to hybrid vehicle battery technology.",
      description: "Annie Easley was a computer scientist, mathematician, and rocket scientist who worked for NASA's Lewis Research Center (now Glenn Research Center). Her work on the Centaur rocket project helped lay the foundation for future space shuttle launches and her energy research contributed to the development of battery technology used in hybrid cars.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Annie_Easley.jpg/250px-Annie_Easley.jpg",
      category: "Scientist",
      born: "April 23, 1933",
      known_for: "Alternative energy research and rocket science",
      achievements: [
        "Developed and implemented computer code for energy-conversion systems",
        "Contributed to the Centaur high-energy rocket project",
        "Her work led to technologies used in hybrid vehicles and solar and wind energy projects",
        "Helped others as a tutor and equal employment opportunity counselor"
      ],
      inspiration: "Annie Easley broke barriers in the STEM field as an African American woman in the 1950s. She continuously adapted to evolving technologies throughout her career and was a champion for women and minorities in STEM while making significant technical contributions that affect our daily lives.",
      links: {
        wikipedia: "https://en.wikipedia.org/wiki/Annie_Easley",
      },
      is_favorite: false
    },
    {
      id: 5,
      name: "Reshma Saujani",
      title: "Founder of Girls Who Code",
      brief: "Founded Girls Who Code to close the gender gap in technology and empower girls to pursue computer science.",
      description: "Reshma Saujani is the founder and CEO of Girls Who Code, a nonprofit organization working to close the gender gap in technology by teaching girls computer science. Since its founding in 2012, Girls Who Code has reached over 300,000 girls through its programs and has worked to change the image of what a programmer looks like.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/2018-prathamusa-reshma-saujani.jpg/220px-2018-prathamusa-reshma-saujani.jpg",
      category: "Entrepreneur",
      born: "November 18, 1975",
      known_for: "Founding Girls Who Code and advocating for women in tech",
      achievements: [
        "Founded Girls Who Code, reaching hundreds of thousands of girls",
        "Author of multiple books including 'Brave, Not Perfect'",
        "TED Talk with millions of views on teaching girls bravery",
        "Named in Fortune's World's Greatest Leaders list"
      ],
      inspiration: "Reshma Saujani recognized the gender gap in computer science and took action to change it. Her advocacy for teaching girls to be brave rather than perfect has sparked a movement that's changing the face of technology and empowering the next generation of female innovators.",
      quote: "Teach girls bravery, not perfection.",
      links: {
        wikipedia: "https://en.wikipedia.org/wiki/Reshma_Saujani",
        website: "https://reshmasaujani.com/",
      },
      is_favorite: false
    },
    {
      id: 6,
      name: "Fei-Fei Li",
      title: "AI Researcher & Stanford Professor",
      brief: "Leading AI researcher who pioneered advancements in computer vision and deep learning.",
      description: "Dr. Fei-Fei Li is a professor at Stanford University and co-director of Stanford's Human-Centered AI Institute. Her research in computer vision, particularly in ImageNet, has revolutionized deep learning and artificial intelligence. She previously served as VP at Google and Chief Scientist of AI/ML at Google Cloud, and she co-founded AI4ALL, a nonprofit working to increase diversity in AI.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Fei-Fei_Li_at_AI_for_Good_2017.jpg/250px-Fei-Fei_Li_at_AI_for_Good_2017.jpg",
      category: "Leader",
      born: "1976",
      known_for: "Computer vision, ImageNet, AI ethics",
      achievements: [
        "Created ImageNet, a critical dataset that advanced deep learning",
        "Published over 200 scientific papers in top journals and conferences",
        "Founded AI4ALL to promote diversity and inclusion in AI",
        "Pioneered human-centered artificial intelligence approaches"
      ],
      inspiration: "Dr. Li has not only advanced the technical capabilities of AI through her groundbreaking research but has also been a powerful advocate for diversity in the field and for developing AI that benefits humanity. Her vision of human-centered AI is helping shape a more ethical and inclusive future for technology.",
      quote: "If we want machines to think, we need to teach them to see.",
      links: {
        wikipedia: "https://en.wikipedia.org/wiki/Fei-Fei_Li",
        website: "https://profiles.stanford.edu/fei-fei-li",
      },
      is_favorite: false
    },
    {
      id: 7,
      name: "Kimberly Bryant",
      title: "Founder of Black Girls Code",
      brief: "Launched Black Girls Code to introduce young girls of color to technology and programming.",
      description: "Kimberly Bryant is an electrical engineer who founded Black Girls Code, a nonprofit organization dedicated to teaching girls of color aged 7-17 about computer programming and digital technology. She started the organization after noticing the lack of diversity in her daughter's computer science classes and in the tech industry overall.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Kimberly_Bryant%2C_Black_Girls_Code_%40_SXSW_2016_%28cropped%29.jpg/220px-Kimberly_Bryant%2C_Black_Girls_Code_%40_SXSW_2016_%28cropped%29.jpg",
      category: "Entrepreneur",
      born: "January 14, 1967",
      known_for: "Founding Black Girls Code and advocating for diversity in tech",
      achievements: [
        "Built Black Girls Code to reach thousands of young women",
        "Named as a White House Champion of Change",
        "Received Smithsonian American Ingenuity Award in Social Progress",
        "Named one of the 25 Most Influential African-Americans In Technology"
      ],
      inspiration: "Kimberly Bryant has dedicated her career to addressing the lack of diversity in the tech industry by creating pathways for young girls of color to enter STEM fields. Her work is helping build a more inclusive tech ecosystem and empowering a new generation of innovators.",
      quote: "When you lift up girls, you lift up everybody else.",
      links: {
        wikipedia: "https://en.wikipedia.org/wiki/Kimberly_Bryant_(technologist)",
        website: "https://www.blackgirlscode.com/",
      },
      is_favorite: false
    },
    {
      id: 8,
      name: "Radia Perlman",
      title: "Network Engineer & Computer Programmer",
      brief: "Created the spanning-tree protocol (STP) that made today's internet possible.",
      description: "Radia Perlman is a computer programmer and network engineer known as the 'Mother of the Internet' for her invention of the spanning-tree protocol, which is fundamental to the operation of network bridges. She holds over 100 patents and has made significant contributions to many areas of network design and standardization.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Radia_Perlman_2009.jpg/250px-Radia_Perlman_2009.jpg",
      category: "Engineer",
      born: "January 1, 1951",
      known_for: "Spanning-tree protocol, network design and security",
      achievements: [
        "Invented the spanning-tree protocol essential for network routing",
        "Holds over 100 patents in networking and security",
        "Inducted into the Internet Hall of Fame and National Inventors Hall of Fame",
        "Authored textbooks on networking that have become standard references"
      ],
      inspiration: "Radia Perlman's inventions and protocols are the invisible infrastructure that makes the internet work. Her brilliant solutions to complex networking problems demonstrate how one person's innovation can create the foundation for global connectivity that billions of people rely on daily.",
      quote: "I don't want to be known as the 'Mother of the Internet.' It's not only incorrect, but deeply embarrassing for reasons too numerous to list.",
      links: {
        wikipedia: "https://en.wikipedia.org/wiki/Radia_Perlman",
      },
      is_favorite: false
    },
    {
      id: 9,
      name: "Megan Smith",
      title: "Former U.S. CTO & Tech Entrepreneur",
      brief: "The third Chief Technology Officer of the United States and advocate for tech inclusion.",
      description: "Megan Smith served as the third Chief Technology Officer of the United States under President Obama. Before her role in government, she was a vice president at Google, leading new business development and early-stage partnerships across the company. She later founded shift7, a company working on tech-forward inclusive innovation.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Megan_Smith_official_portrait.jpg/800px-Megan_Smith_official_portrait.jpg",
      category: "Leader",
      born: "October 21, 1964",
      known_for: "U.S. CTO, tech policy, and inclusive innovation",
      achievements: [
        "Served as the third U.S. Chief Technology Officer",
        "Led Google's acquisition of major platforms including Google Earth and Google Maps",
        "Founded shift7 to drive tech-based solutions to public challenges",
        "Advocate for STEM education and increasing diversity in tech"
      ],
      inspiration: "Megan Smith has moved between leading tech companies, government service, and entrepreneurship, using technology as a tool to address important societal challenges. Her focus on inclusion and opportunity in tech demonstrates how leadership can help create more equitable access to innovation.",
      quote: "Innovation comes from the edges.",
      links: {
        wikipedia: "https://en.wikipedia.org/wiki/Megan_Smith",
        website: "https://shift7.com/",
      },
      is_favorite: false
    },
    {
      id: 10,
      name: "Limor Fried",
      title: "Founder of Adafruit Industries",
      brief: "Engineer and entrepreneur who founded Adafruit to make learning electronics more accessible.",
      description: "Limor 'Ladyada' Fried is an electrical engineer and founder of Adafruit Industries, a company designed to create the best place online for learning electronics and making the best-designed products for makers of all ages and skill levels. She was the first female engineer on the cover of WIRED magazine and was named Entrepreneur of the Year by Entrepreneur magazine.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Limor_Fried_and_robot_friend_at_Hackerbot_Labs.jpg/800px-Limor_Fried_and_robot_friend_at_Hackerbot_Labs.jpg",
      category: "Entrepreneur",
      born: "May 1, 1979",
      known_for: "Open-source hardware, electronics education",
      achievements: [
        "Founded the successful open-source hardware company Adafruit Industries",
        "First female engineer on the cover of WIRED magazine",
        "Named Entrepreneur of the Year by Entrepreneur magazine",
        "Champion of the maker movement and STEM education"
      ],
      inspiration: "Limor Fried has democratized electronics by making learning accessible to everyone. Her company's open-source designs and educational resources have empowered countless people to create their own technology and understand the devices that surround them.",
      quote: "I'm basically trying to make the world a better place by making people smart enough to improve their own lives.",
      links: {
        wikipedia: "https://en.wikipedia.org/wiki/Limor_Fried",
        website: "https://www.adafruit.com/",
      },
      is_favorite: false
    },
    {
      id: 11,
      name: "Hedy Lamarr",
      title: "Actress & Inventor",
      brief: "Co-invented an early form of frequency hopping that's now used in Bluetooth and WiFi.",
      description: "Hedy Lamarr was not only a famous Hollywood actress but also a brilliant inventor. During World War II, she co-invented an early technique for spread spectrum communications, which laid the foundation for today's WiFi, Bluetooth, and CDMA technologies. Her work demonstrates the unexpected connections between different fields like entertainment and engineering.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Hedy_Lamarr_-_publicity_photo.JPG/800px-Hedy_Lamarr_-_publicity_photo.JPG",
      category: "Pioneer",
      born: "November 9, 1914",
      known_for: "Frequency-hopping spread spectrum technology",
      achievements: [
        "Co-invented frequency-hopping spread spectrum communication",
        "Received the Electronic Frontier Foundation Pioneer Award",
        "Inducted into the National Inventors Hall of Fame",
        "Balanced successful careers in both Hollywood and technology"
      ],
      inspiration: "Hedy Lamarr defied expectations and stereotypes, using her intellect to develop technology that would eventually revolutionize wireless communications. Her story reminds us that innovation can come from unexpected sources and that women can excel in both the arts and sciences.",
      quote: "Any girl can be glamorous. All you have to do is stand still and look stupid.",
      links: {
        wikipedia: "https://en.wikipedia.org/wiki/Hedy_Lamarr",
      },
      is_favorite: false
    },
    {
      id: 12,
      name: "Susan Wojcicki",
      title: "Former CEO of YouTube",
      brief: "Led YouTube's growth to become the world's largest video platform.",
      description: "Susan Wojcicki was the CEO of YouTube from 2014 to 2023, overseeing its growth into the world's largest video platform. She was Google's 16th employee and played crucial roles in the development of Google's advertising products like AdSense, AdWords, and Analytics. She was also involved in Google's acquisition of YouTube and DoubleClick.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Susan_Wojcicki_at_TechCrunch_Disrupt_SF_2013_%28cropped%29.jpg/800px-Susan_Wojcicki_at_TechCrunch_Disrupt_SF_2013_%28cropped%29.jpg",
      category: "Leader",
      born: "July 5, 1968",
      known_for: "YouTube leadership, Google advertising products",
      achievements: [
        "Served as CEO of YouTube, building it into a global platform",
        "One of Google's earliest employees and key executives",
        "Drove development of AdSense and other crucial Google products",
        "Consistently ranked among the world's most powerful women in business"
      ],
      inspiration: "Susan Wojcicki helped build Google from a startup in her garage to a global tech giant, then led YouTube through an era of tremendous growth and change. Her leadership style demonstrated how women can excel at the highest levels of tech companies.",
      quote: "Though we do need more women to graduate with technical degrees, I always like to remind women that you don't need to have science or technology degrees to build a career in tech.",
      links: {
        wikipedia: "https://en.wikipedia.org/wiki/Susan_Wojcicki",
      },
      is_favorite: false
    }
  ];
  
  // Filter by search query
  let filtered = roleModels;
  if (search) {
    const query = search.toLowerCase();
    filtered = filtered.filter(model => 
      model.name.toLowerCase().includes(query) ||
      model.title.toLowerCase().includes(query) ||
      model.brief.toLowerCase().includes(query) ||
      model.category.toLowerCase().includes(query)
    );
  }
  
  // Filter by category
  if (category && category !== 'all') {
    const categoryMap = {
      'pioneer': 'Pioneer',
      'leader': 'Leader',
      'engineer': 'Engineer',
      'scientist': 'Scientist',
      'entrepreneur': 'Entrepreneur'
    };
    
    filtered = filtered.filter(model => 
      model.category === categoryMap[category]
    );
  }
  
  return filtered;
}

export default RoleModelsPage;