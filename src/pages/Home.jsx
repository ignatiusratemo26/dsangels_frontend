import React from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Stack, 
  useTheme, 
  useMediaQuery 
} from '@mui/material';
import { 
  Code, 
  Psychology, 
  EmojiEvents, 
  School, 
  Person, 
  Groups 
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

// Optional: import images for hero section and feature cards
import heroImage from '../assets/images/hero-image.jpg';
import featureImage1 from '../assets/images/feature1.jpg';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <Code fontSize="large" sx={{ color: theme.palette.primary.main }} />,
      title: "Fun Coding Challenges",
      description: "Solve exciting puzzles and games while learning to code! From simple blocks to real programming."
    },
    {
      icon: <Psychology fontSize="large" sx={{ color: theme.palette.secondary.main }} />,
      title: "AI-Powered Learning",
      description: "Our magical assistant helps you learn at your own pace with personalized hints and guidance."
    },
    {
      icon: <EmojiEvents fontSize="large" sx={{ color: theme.palette.success.main }} />,
      title: "Earn Cool Badges",
      description: "Collect awesome badges and rewards as you master new skills and complete challenges!"
    },
    {
      icon: <School fontSize="large" sx={{ color: theme.palette.info.main }} />,
      title: "Learn Together",
      description: "Join other tech girls in fun learning adventures. Share your achievements and help each other grow!"
    },
    {
      icon: <Person fontSize="large" sx={{ color: theme.palette.warning.main }} />,
      title: "Meet Role Models",
      description: "Discover amazing women in technology who are changing the world with their brilliant ideas."
    },
    {
      icon: <Groups fontSize="large" sx={{ color: theme.palette.error.main }} />,
      title: "Get Mentored",
      description: "Connect with friendly mentors who can guide you on your journey into the world of tech."
    }
  ];

  return (
    <Box sx={{ 
      bgcolor: theme.palette.background.default,
      minHeight: '100vh',
      overflowX: 'hidden'
    }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'rgba(255, 192, 203, 0.15)', // Very light pink background
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255, 182, 193, 0.2) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(147, 112, 219, 0.2) 0%, transparent 50%)',
          pt: 12,
          pb: 14,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    mb: 2,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '1px 1px 1px rgba(255,255,255,0.5)'
                  }}
                >
                  Spark Your Tech Adventure with DSAngels
                </Typography>
                
                <Typography
                  variant="h6"
                  sx={{ 
                    color: theme.palette.text.secondary,
                    mb: 4,
                    maxWidth: '600px',
                    lineHeight: 1.6
                  }}
                >
                  A magical world where every girl can explore technology, create amazing projects, and discover the tech superhero within!
                </Typography>
                
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    color="primary"
                    size="large"
                    disableElevation
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: '1rem',
                      fontWeight: 600,
                      boxShadow: '0 4px 14px 0 rgba(255,105,180,0.39)'
                    }}
                  >
                    Join The Adventure
                  </Button>
                  
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="outlined"
                    color="secondary"
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: '1rem',
                      fontWeight: 600,
                    }}
                  >
                    Log In
                  </Button>
                </Stack>
                
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  Already exploring? Log in to continue your journey!
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  height: { xs: '300px', md: '500px' },
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {/* If you have a hero image, uncomment this and comment out the Box below */}
                <img 
                  src={heroImage} 
                  alt="Girls coding together" 
                  style={{ 
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    borderRadius: '16px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
                  }} 
                />
                
                {/* Placeholder if no image available */}
                <Box
                  sx={{
                    width: '90%',
                    height: '90%',
                    borderRadius: '16px',
                    background: 'linear-gradient(45deg, #FF9EAA, #FFD0D0, #D0A3D0)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <Typography variant="h3" sx={{ color: 'white', fontWeight: 800, textShadow: '1px 1px 3px rgba(0,0,0,0.2)' }}>
                    DSAngels
                  </Typography>
                  
                  {/* Decorative elements */}
                  <Box sx={{ position: 'absolute', top: '10%', left: '15%', width: '20px', height: '20px', borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.6)' }} />
                  <Box sx={{ position: 'absolute', bottom: '20%', right: '10%', width: '30px', height: '30px', borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.6)' }} />
                  <Box sx={{ position: 'absolute', bottom: '40%', left: '20%', width: '15px', height: '15px', borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.6)' }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
        
        {/* Decorative shapes */}
        <Box
          sx={{
            position: 'absolute',
            bottom: -100,
            left: -100,
            width: 200,
            height: 200,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 105, 180, 0.1)',
            zIndex: 0
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 150,
            height: 150,
            borderRadius: '50%',
            backgroundColor: 'rgba(186, 85, 211, 0.1)',
            zIndex: 0
          }}
        />
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: theme.palette.primary.main
            }}
          >
            Your Tech Journey Awaits
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            Explore the magical world of technology, designed especially for girls like you!
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.12)',
                  },
                  bgcolor: 'background.paper',
                  overflow: 'visible'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: -3
                  }}
                >
                  <Box
                    sx={{
                      width: 70,
                      height: 70,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                    }}
                  >
                    {feature.icon}
                  </Box>
                </Box>
                
                <CardContent sx={{ textAlign: 'center', pt: 3 }}>
                  <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ bgcolor: 'rgba(255, 192, 203, 0.1)', py: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: theme.palette.primary.main
              }}
            >
              How It Works
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.secondary,
                maxWidth: '800px',
                mx: 'auto'
              }}
            >
              Your path to becoming a tech superstar is fun and easy!
            </Typography>
          </Box>

          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  height: '400px',
                  width: '100%',
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  position: 'relative'
                }}
              >
                {/* If you have an image, uncomment this and comment out the Box below */}
                <img 
                  src={featureImage1} 
                  alt="Girl using DSAngels platform" 
                  style={{ 
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }} 
                />
                
                {/* Placeholder if no image available */}
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(45deg, #B3D8FF, #D8B3FF)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 600, textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
                    Learn & Play
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={7}>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    color: theme.palette.secondary.main
                  }}
                >
                  Learning is an Adventure
                </Typography>
                
                <Typography
                  variant="body1"
                  sx={{
                    mb: 4,
                    fontSize: '1.1rem',
                    lineHeight: 1.7,
                    color: theme.palette.text.primary
                  }}
                >
                  At DSAngels, we believe learning should be fun and magical! Our platform introduces you to the exciting world of technology through interactive challenges, creative projects, and friendly guidance.
                </Typography>
                
                <Box sx={{ mb: 4 }}>
                  {[
                    'Create your own profile and customize your learning journey',
                    'Take on fun coding challenges designed just for your age and level',
                    'Get help from our AI assistant whenever you need it',
                    'Track your progress and celebrate your achievements'
                  ].map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          bgcolor: theme.palette.primary.main,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2
                        }}
                      >
                        <Typography variant="body2" sx={{ color: 'white' }}>
                          {index + 1}
                        </Typography>
                      </Box>
                      <Typography variant="body1">{item}</Typography>
                    </Box>
                  ))}
                </Box>
                
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="secondary"
                  size="large"
                  disableElevation
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1rem',
                    fontWeight: 600,
                    boxShadow: '0 4px 14px 0 rgba(186,85,211,0.39)'
                  }}
                >
                  Start Your Journey
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: theme.palette.primary.main
            }}
          >
            Meet Our Tech Explorers
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            Hear what other tech girls have to say about their adventures!
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {[
            {
              name: "Emma, 12",
              quote: "I made my first website with DSAngels! My friends think I'm a wizard now and I'm teaching them too.",
              avatar: "E"
            },
            {
              name: "Sofia, 9",
              quote: "The challenges are like games but I'm learning to code at the same time. The AI helper is my best friend!",
              avatar: "S"
            },
            {
              name: "Maya, 14",
              quote: "I never thought I could build an app, but now I've made three! I want to be a software engineer when I grow up.",
              avatar: "M"
            }
          ].map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
                  bgcolor: 'background.paper',
                  position: 'relative',
                  p: 4
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: -20,
                    left: 20,
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: theme.palette.primary.main,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.2rem'
                  }}
                >
                  {testimonial.avatar}
                </Box>
                
                <Typography
                  variant="body1"
                  sx={{
                    mb: 3,
                    fontSize: '1.1rem',
                    fontStyle: 'italic',
                    color: theme.palette.text.primary
                  }}
                >
                  "{testimonial.quote}"
                </Typography>
                
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    mt: 'auto',
                    color: theme.palette.secondary.main
                  }}
                >
                  {testimonial.name}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action Section */}
      <Box
        sx={{
          bgcolor: 'rgba(186, 85, 211, 0.1)',
          py: 10,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              textAlign: 'center',
              position: 'relative',
              zIndex: 1
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 3,
                color: theme.palette.primary.main
              }}
            >
              Begin Your Tech Adventure Today!
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.secondary,
                mb: 4,
                maxWidth: '700px',
                mx: 'auto'
              }}
            >
              Join thousands of tech girls who are discovering the magic of coding, creating amazing projects, and having fun with technology!
            </Typography>
            
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              sx={{ mb: 4 }}
            >
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                color="primary"
                size="large"
                disableElevation
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  boxShadow: '0 4px 14px 0 rgba(255,105,180,0.39)'
                }}
              >
                Join Now - It's Free!
              </Button>
              
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                color="secondary"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                Log In
              </Button>
            </Stack>
            
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Parents and mentors welcome too! Create an account to support your tech girl's journey.
            </Typography>
          </Box>
        </Container>
        
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            bottom: -50,
            left: '10%',
            width: 100,
            height: 100,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 105, 180, 0.15)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            right: '5%',
            width: 120,
            height: 120,
            borderRadius: '50%',
            backgroundColor: 'rgba(186, 85, 211, 0.15)',
          }}
        />
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', py: 5 }}>
        <Container maxWidth="lg">
          <Grid container spacing={2} justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                DSAngels
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Empowering the next generation of tech girls
              </Typography>
            </Grid>
            <Grid item>
              <Stack direction="row" spacing={3}>
                <RouterLink to="/about" style={{ textDecoration: 'none' }}>
                  <Typography color="text.secondary" sx={{ '&:hover': { color: theme.palette.primary.main } }}>
                    About
                  </Typography>
                </RouterLink>
                <RouterLink to="/parents" style={{ textDecoration: 'none' }}>
                  <Typography color="text.secondary" sx={{ '&:hover': { color: theme.palette.primary.main } }}>
                    For Parents
                  </Typography>
                </RouterLink>
                <RouterLink to="/mentors" style={{ textDecoration: 'none' }}>
                  <Typography color="text.secondary" sx={{ '&:hover': { color: theme.palette.primary.main } }}>
                    For Mentors
                  </Typography>
                </RouterLink>
              </Stack>
            </Grid>
          </Grid>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
            © {new Date().getFullYear()} DSAngels. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;