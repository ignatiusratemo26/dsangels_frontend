import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Breadcrumbs,
  Link,
  Divider,
  Chip,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ArrowBack as ArrowBackIcon,
  Lightbulb as LightbulbIcon,
  Code as CodeIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  QuestionAnswer as QuestionAnswerIcon,
  AccessTime as AccessTimeIcon,
  Favorite as FavoriteIcon,
  NavigateNext as NavigateNextIcon,
  Info as InfoIcon
} from '@mui/icons-material';

// Components
import Loader from '../components/common/Loader/Loader';
import ConceptVisualizer from '../components/learning/ConceptVisualizer';
import QuizComponent from '../components/learning/QuizComponent';
import InteractiveTutorial from '../components/learning/InteractiveTutorial/InteractiveTutorial';
import CodeEditor from '../components/challenges/CodeEditor/CodeEditor';
import ChallengeResult from '../components/challenges/ChallengeResult/ChallengeResult';

// Services
import { contentService } from '../services/contentService';
import { gamificationService } from '../services/gamificationService';

// TabPanel component for tab content
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`concept-tabpanel-${index}`}
      aria-labelledby={`concept-tab-${index}`}
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

const ConceptHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(4, 2),
  borderRadius: theme.shape.borderRadius * 2,
  position: 'relative',
  overflow: 'hidden',
  marginBottom: theme.spacing(3),
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-20%',
    right: '-10%',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.1)',
  }
}));

const CodeBlock = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1E1E1E' : '#F5F5F5',
  color: theme.palette.mode === 'dark' ? '#D4D4D4' : '#333333',
  padding: theme.spacing(2),
  fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
  fontSize: '0.9rem',
  borderRadius: theme.shape.borderRadius,
  overflowX: 'auto',
  margin: theme.spacing(2, 0),
}));

const RelatedConceptCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
  },
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
}));

const ConceptPage = () => {
  const { conceptId } = useParams();
  const [concept, setConcept] = useState(null);
  const [relatedConcepts, setRelatedConcepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [saved, setSaved] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  
  useEffect(() => {
    const fetchConcept = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get concept details
        const conceptData = await contentService.getConceptById(conceptId);
        setConcept(conceptData);
        
        // Get related concepts
        const relatedData = await contentService.getRelatedConcepts(conceptId);
        setRelatedConcepts(relatedData.results || []);
        
        // Track view - gamification
        await gamificationService.trackPoints('concept_view', 5, { concept_id: conceptId });
        
        // Check if concept is saved by user
        const userPreferences = await contentService.getUserPreferences();
        setSaved(userPreferences.saved_concepts?.includes(parseInt(conceptId)) || false);
        
      } catch (err) {
        console.error('Error fetching concept:', err);
        setError('Failed to load the concept. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchConcept();
  }, [conceptId]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleSaveToggle = async () => {
    try {
      const newSavedState = !saved;
      await contentService.toggleSavedConcept(conceptId, newSavedState);
      setSaved(newSavedState);
      
      // If saving, award points
      if (newSavedState) {
        await gamificationService.trackPoints('save_concept', 2, { concept_id: conceptId });
      }
    } catch (err) {
      console.error('Error toggling saved status:', err);
    }
  };
  
  const handleStartQuiz = () => {
    setShowQuiz(true);
  };
  
  const handleQuizComplete = async (score, totalQuestions) => {
    setQuizCompleted(true);
    setShowQuiz(false);
    setQuizScore({ score, totalQuestions });
    
    // Award points based on score
    const percentScore = (score / totalQuestions) * 100;
    let points = 0;
    
    if (percentScore >= 90) points = 20;
    else if (percentScore >= 75) points = 15;
    else if (percentScore >= 50) points = 10;
    else points = 5;
    
    try {
      await gamificationService.trackPoints('complete_concept_quiz', points, { 
        concept_id: conceptId,
        score: score,
        total: totalQuestions
      });
    } catch (err) {
      console.error('Error tracking quiz completion:', err);
    }
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress color="secondary" size={60} />
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          component={RouterLink} 
          to="/app/learning" 
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          Back to Learning
        </Button>
      </Container>
    );
  }
  
  if (!concept) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">Concept not found</Alert>
        <Button 
          component={RouterLink} 
          to="/app/learning" 
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          Back to Learning
        </Button>
      </Container>
    );
  }
  
  // Mock concept data structure (for development)
  const mockConcept = {
    id: conceptId,
    title: concept.title || "Variables and Data Types",
    description: concept.description || "Learn about variables and basic data types in programming",
    content: concept.content || "<p>Variables are containers for storing data values. In most programming languages, you need to declare a variable before you can use it.</p><p>Common data types include:</p><ul><li>Integers: Whole numbers like 1, 42, -99</li><li>Floating Point: Numbers with decimal points like 3.14, 2.71828</li><li>Strings: Text enclosed in quotes like \"Hello World\"</li><li>Booleans: True or False values</li></ul>",
    examples: concept.examples || [
      {
        language: "Python",
        code: "# Python example\nname = \"Sarah\"\nage = 12\nis_student = True\nheight = 1.58  # in meters\n\nprint(f\"Hello, my name is {name} and I am {age} years old.\")"
      },
      {
        language: "JavaScript",
        code: "// JavaScript example\nlet name = \"Sarah\";\nlet age = 12;\nlet isStudent = true;\nlet height = 1.58;  // in meters\n\nconsole.log(`Hello, my name is ${name} and I am ${age} years old.`);"
      }
    ],
    difficulty: concept.difficulty || 1,
    reading_level: concept.reading_level || "Elementary",
    estimated_time: concept.estimated_time || "10 minutes",
    keywords: concept.keywords || ["variables", "data types", "programming basics"],
    category: concept.category || "Programming Fundamentals",
    interactive_elements: concept.interactive_elements || {
      visualizations: true,
      quiz: true,
      exercises: true
    },
    quiz: concept.quiz || [
      {
        question: "What do variables store?",
        options: ["Data values", "Functions", "Files", "Programs"],
        correct_answer: 0
      },
      {
        question: "Which of these is NOT a common data type?",
        options: ["Integer", "String", "Boolean", "Directory"],
        correct_answer: 3
      },
      {
        question: "In Python, how do you declare a variable called 'score' with value 100?",
        options: ["var score = 100;", "score := 100;", "score = 100", "int score = a100;"],
        correct_answer: 2
      }
    ],
    exercises: concept.exercises || [
      {
        id: 1,
        instruction: "Create a variable named 'favorite_color' and assign it your favorite color as a string.",
        template: "# Write your code below\n\n\n# Check your result\nprint(favorite_color)",
        solution: "favorite_color = \"purple\"\nprint(favorite_color)",
        test_cases: [
          {
            input: "",
            expected_output_type: "string"
          }
        ]
      }
    ],
    next_concept: concept.next_concept || {
      id: parseInt(conceptId) + 1,
      title: "Operators and Expressions"
    },
    previous_concept: parseInt(conceptId) > 1 ? {
      id: parseInt(conceptId) - 1,
      title: "Introduction to Programming"
    } : null
  };
  
  // Use concept data from API or fallback to mock
  const conceptData = {
    ...mockConcept,
    ...concept
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs sx={{ mb: 2 }} separator={<NavigateNextIcon fontSize="small" />}>
        <Link component={RouterLink} to="/app" color="inherit">
          Dashboard
        </Link>
        <Link component={RouterLink} to="/app/learning" color="inherit">
          Learning
        </Link>
        <Typography color="text.primary">{conceptData.title}</Typography>
      </Breadcrumbs>
      
      {/* Concept Header */}
      <ConceptHeader>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={10}>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              {conceptData.title}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 2, opacity: 0.9 }}>
              {conceptData.description}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              <Chip 
                icon={<SchoolIcon />} 
                label={`Difficulty: ${
                  conceptData.difficulty === 1 ? 'Beginner' : 
                  conceptData.difficulty === 2 ? 'Intermediate' : 
                  conceptData.difficulty === 3 ? 'Advanced' : 'Expert'
                }`} 
                color="secondary" 
                variant="outlined"
                sx={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}
              />
              <Chip 
                icon={<AccessTimeIcon />} 
                label={`${conceptData.estimated_time}`} 
                color="secondary" 
                variant="outlined"
                sx={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}
              />
              <Chip 
                icon={<StarIcon />} 
                label={`${conceptData.reading_level} level`} 
                color="secondary" 
                variant="outlined"
                sx={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Tooltip title={saved ? "Remove from saved" : "Save for later"}>
              <IconButton 
                onClick={handleSaveToggle}
                sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)', 
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
                }}
              >
                {saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </ConceptHeader>
      
      {/* Content Tabs */}
      <Paper sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth" 
          textColor="primary"
          indicatorColor="primary"
          aria-label="concept tabs"
        >
          <Tab icon={<InfoIcon />} label="Learn" id="concept-tab-0" />
          <Tab icon={<CodeIcon />} label="Examples" id="concept-tab-1" />
          <Tab icon={<LightbulbIcon />} label="Practice" id="concept-tab-2" />
          <Tab icon={<QuestionAnswerIcon />} label="Quiz" id="concept-tab-3" />
        </Tabs>
        
        {/* Learn Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 3 }}>
            <div dangerouslySetInnerHTML={{ __html: conceptData.content }} />
            
            {conceptData.interactive_elements?.visualizations && (
              <Box sx={{ mt: 4, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Visual Representation
                </Typography>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    bgcolor: 'background.default', 
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <ConceptVisualizer concept={conceptData} />
                </Paper>
              </Box>
            )}
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Key Points
              </Typography>
              <List>
                {(conceptData.key_points || ['Variables store data in memory', 'Different data types store different kinds of information', 'Variables must be declared before use in many languages']).map((point, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary={point} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        </TabPanel>
        
        {/* Examples Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Code Examples
            </Typography>
            
            {conceptData.examples.map((example, index) => (
              <Box key={index} sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <CodeIcon sx={{ mr: 1 }} /> {example.language} Example
                </Typography>
                <CodeBlock>
                  <pre style={{ margin: 0 }}>{example.code}</pre>
                </CodeBlock>
                {example.explanation && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {example.explanation}
                  </Typography>
                )}
              </Box>
            ))}
            
            <Alert severity="info" sx={{ mt: 2 }}>
              Try running these examples in your own coding environment to see them in action!
            </Alert>
          </Box>
        </TabPanel>
        
        {/* Practice Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Interactive Practice
            </Typography>
            
            {conceptData.exercises && conceptData.exercises.length > 0 ? (
              conceptData.exercises.map((exercise, index) => (
                <Paper 
                  key={index} 
                  sx={{ 
                    p: 3, 
                    mb: 3, 
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom>
                    Exercise {index + 1}: {exercise.instruction}
                  </Typography>
                  
                  <CodeEditor
                    initialCode={exercise.template}
                    language={exercise.language || "python"}
                    onChange={() => {}}
                    height="200px"
                  />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button 
                      variant="outlined" 
                      color="primary"
                      onClick={() => {}} // Would trigger test execution
                    >
                      Run Code
                    </Button>
                    
                    <Button
                      variant="text"
                      color="secondary"
                      onClick={() => {}} // Would show solution
                    >
                      Show Solution
                    </Button>
                  </Box>
                  
                  <ChallengeResult 
                    success={false}
                    message=""
                    output=""
                    hidden={true} // Initially hidden until they run code
                  />
                </Paper>
              ))
            ) : (
              <Alert severity="info">
                No practice exercises available for this concept yet.
              </Alert>
            )}
            
            <InteractiveTutorial concept={conceptData} />
          </Box>
        </TabPanel>
        
        {/* Quiz Tab */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ p: 3 }}>
            {quizCompleted ? (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Quiz Completed!
                </Typography>
                <Typography variant="h4" sx={{ color: 'success.main', my: 2 }}>
                  You scored {quizScore.score} out of {quizScore.totalQuestions}
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => setQuizCompleted(false)}
                  sx={{ mt: 2 }}
                >
                  Take Quiz Again
                </Button>
              </Box>
            ) : showQuiz ? (
              <QuizComponent 
                quiz={conceptData.quiz} 
                onComplete={handleQuizComplete}
              />
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <SchoolIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Test Your Knowledge
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Take a quick quiz to check your understanding of {conceptData.title}
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  onClick={handleStartQuiz}
                >
                  Start Quiz
                </Button>
              </Box>
            )}
          </Box>
        </TabPanel>
      </Paper>
      
      {/* Related Concepts */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          Related Concepts
        </Typography>
        <Grid container spacing={3}>
          {(relatedConcepts.length > 0 ? relatedConcepts : [
            { id: 101, title: "Operators and Expressions", description: "Learn about math and logical operators", difficulty: 1 },
            { id: 102, title: "Control Flow", description: "Understand conditional statements and loops", difficulty: 2 },
            { id: 103, title: "Functions", description: "Create reusable blocks of code", difficulty: 2 }
          ]).slice(0, 3).map((related) => (
            <Grid item key={related.id} xs={12} sm={6} md={4}>
              <RelatedConceptCard>
                <CardMedia
                  component="img"
                  height="140"
                  image={`https://source.unsplash.com/random/300x200?coding&sig=${related.id}`}
                  alt={related.title}
                />
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {related.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {related.description}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    fullWidth
                    component={RouterLink}
                    to={`/app/learning/${related.id}`}
                  >
                    Learn This
                  </Button>
                </CardContent>
              </RelatedConceptCard>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5 }}>
        {conceptData.previous_concept ? (
          <Button
            component={RouterLink}
            to={`/app/learning/${conceptData.previous_concept.id}`}
            startIcon={<ArrowBackIcon />}
            variant="outlined"
          >
            Previous: {conceptData.previous_concept.title}
          </Button>
        ) : (
          <Button
            component={RouterLink}
            to="/app/learning"
            startIcon={<ArrowBackIcon />}
            variant="outlined"
          >
            Back to Learning
          </Button>
        )}
        
        {conceptData.next_concept && (
          <Button
            component={RouterLink}
            to={`/app/learning/${conceptData.next_concept.id}`}
            endIcon={<NavigateNextIcon />}
            variant="contained"
            color="primary"
          >
            Next: {conceptData.next_concept.title}
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default ConceptPage;