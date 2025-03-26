import Editor from '@monaco-editor/react';

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  AlertTitle,
  TextField,
  Grid,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Icons
import CodeIcon from '@mui/icons-material/Code';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SendIcon from '@mui/icons-material/Send';

// Services
import challengeService from '../services/challengeService';
import gamificationService from '../services/gamificationService';

// Styled components
const ChallengeContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(5)
}));

const ChallengeHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  background: `linear-gradient(45deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
  color: theme.palette.primary.contrastText
}));

const DifficultyChip = styled(Chip)(({ theme, difficulty }) => {
  let color;
  switch (difficulty) {
    case 1:
      color = theme.palette.success.main;
      break;
    case 2:
      color = theme.palette.info.main;
      break;
    case 3:
      color = theme.palette.warning.main;
      break;
    case 4:
    case 5:
      color = theme.palette.error.main;
      break;
    default:
      color = theme.palette.primary.main;
  }
  
  return {
    backgroundColor: color,
    color: theme.palette.getContrastText(color),
    fontWeight: 'bold'
  };
});

const EditorContainer = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`,
  height: '400px'
}));

const InfoCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2]
}));

const HintButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2)
}));

const ChallengePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // States
  const [challenge, setChallenge] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [activeStep, setActiveStep] = useState(0);
  const [hintsUsed, setHintsUsed] = useState([]);
  const [hintDialogOpen, setHintDialogOpen] = useState(false);
  const [currentHint, setCurrentHint] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completionDialog, setCompletionDialog] = useState(false);
  const [completionData, setCompletionData] = useState(null);
  
  // Theme for the code editor
  const [editorTheme, setEditorTheme] = useState('light');
  
  // Load challenge data
  useEffect(() => {
    const fetchChallenge = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await challengeService.getChallenge(id);
        setChallenge(data);
        
        // Set initial code based on starter template
        if (data.starter_code) {
          setCode(data.starter_code);
        }
        
        // Set language mode
        if (data.language) {
          setCodeLanguage(data.language.toLowerCase());
        }
        
      } catch (err) {
        console.error('Error fetching challenge:', err);
        setError('Failed to load the challenge. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChallenge();
  }, [id]);
  
  const handleCodeChange = (value) => {
    setCode(value);
  };
  
  const handleRun = async () => {
    setIsRunning(true);
    setOutput('');
    
    try {
      const result = await challengeService.runCode(challenge.id, code, codeLanguage);
      setOutput(result.output || 'No output');
      
      if (result.success) {
        setOutput(prev => prev + '\n\nTests passed successfully! ✨');
      }
    } catch (err) {
      console.error('Error running code:', err);
      setOutput('Error running code: ' + (err.message || 'Unknown error'));
    } finally {
      setIsRunning(false);
    }
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const result = await challengeService.submitChallenge(challenge.id, code);
      
      if (result.success) {
        // Show success dialog with awarded points/badges
        setCompletionData(result);
        setCompletionDialog(true);
        
        // Check for new badges
        gamificationService.checkForNewBadges();
      } else {
        setOutput('Challenge submission failed: ' + (result.message || 'Some tests did not pass.'));
      }
    } catch (err) {
      console.error('Error submitting challenge:', err);
      setOutput('Error submitting challenge: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleShowHint = (index) => {
    if (challenge && challenge.hints && challenge.hints[index]) {
      // Handle both string hints and object hints
      const hint = challenge.hints[index];
      const hintText = typeof hint === 'object' ? hint.hint_text : hint;
      
      setCurrentHint(hintText);
      setHintDialogOpen(true);
      
      // Mark this hint as used if it's not already
      if (!hintsUsed.includes(index)) {
        setHintsUsed([...hintsUsed, index]);
      }
    }
  };
  
  const handleNextStep = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  const handleBackStep = () => {
    setActiveStep((prevStep) => Math.max(0, prevStep - 1));
  };
  
  // Convert Ace themes to Monaco themes
  const getMonacoTheme = () => {
    return editorTheme === 'pastel_on_dark' ? 'vs-dark' : 'light';
  };
  
  if (isLoading) {
    return (
      <ChallengeContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress color="secondary" />
        </Box>
      </ChallengeContainer>
    );
  }
  
  if (error) {
    return (
      <ChallengeContainer>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          variant="outlined" 
          onClick={() => navigate('/app/challenges')}
          sx={{ mt: 2 }}
        >
          Back to Challenges
        </Button>
      </ChallengeContainer>
    );
  }
  
  if (!challenge) {
    return (
      <ChallengeContainer>
        <Alert severity="info">
          <AlertTitle>Challenge Not Found</AlertTitle>
          The challenge you're looking for doesn't exist or has been removed.
        </Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          variant="outlined" 
          onClick={() => navigate('/app/challenges')}
          sx={{ mt: 2 }}
        >
          Back to Challenges
        </Button>
      </ChallengeContainer>
    );
  }
  
  // Steps for the challenge
  const steps = ['Understand', 'Code', 'Test', 'Submit'];
  
  return (
    <ChallengeContainer>
      {/* Back button */}
      <Box sx={{ mb: 2 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/app/challenges')}
          variant="text"
          color="primary"
        >
          Back to Challenges
        </Button>
      </Box>
      
      {/* Challenge Header */}
      <ChallengeHeader elevation={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {challenge.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <DifficultyChip 
                label={`Level ${challenge.difficulty_level}`} 
                icon={<CodeIcon />} 
                difficulty={challenge.difficulty_level}
              />
              {challenge.tags && challenge.tags.map(tag => (
                <Chip 
                  key={tag} 
                  label={tag} 
                  variant="outlined"
                  sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
                />
              ))}
            </Box>
          </Box>
          <Box>
            <Chip 
              label={`${challenge.points} points`} 
              icon={<EmojiEventsIcon />} 
              color="secondary"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
        </Box>
      </ChallengeHeader>
      
      {/* Challenge Stepper */}
      <Stepper 
        activeStep={activeStep} 
        alternativeLabel
        sx={{ mb: 4 }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {/* Challenge Content */}
      <Grid container spacing={3}>
        {/* Description, Instructions, Hints */}
        <Grid item xs={12} md={4}>
          <InfoCard>
            <CardContent>
              {activeStep === 0 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {challenge.description}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="h6" gutterBottom>
                    Learning Objectives
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {challenge.learning_objectives || "Complete this challenge to practice your coding skills!"}
                  </Typography>
                  
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                    onClick={handleNextStep}
                    sx={{ mt: 2 }}
                  >
                    Start Coding
                  </Button>
                </>
              )}
              
              {activeStep >= 1 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Instructions
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {challenge.problem_statement  || "No instructions provided."}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  {/* Hint Section */}
                  <Typography variant="h6" gutterBottom>
                    Hints
                  </Typography>
                  
                  {challenge.hints && challenge.hints.map((hint, index) => {
                      // Handle both string hints and object hints
                      const hintText = typeof hint === 'object' ? hint.hint_text : hint;
                      
                      return (
                        <HintButton
                          key={index}
                          variant={hintsUsed.includes(index) ? "outlined" : "contained"}
                          color={hintsUsed.includes(index) ? "secondary" : "primary"}
                          size="small"
                          startIcon={<LightbulbIcon />}
                          onClick={() => handleShowHint(index)}
                          fullWidth
                          sx={{ mb: 1 }}
                        >
                          {hintsUsed.includes(index) ? `Hint ${index + 1} (Used)` : `Get Hint ${index + 1}`}
                        </HintButton>
                      );
                    })}
                  
                  {challenge.hints && challenge.hints.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No hints available for this challenge.
                    </Typography>
                  )}
                </>
              )}
            </CardContent>
          </InfoCard>
        </Grid>
        
        {/* Code Editor and Output */}
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              {activeStep === 0 ? 'Preview Code' : 'Write Your Solution'}
            </Typography>
            
            <EditorContainer>
              {/* Replace AceEditor with Monaco Editor */}
              <Editor
                height="100%"
                width="100%"
                language={codeLanguage}
                value={code}
                onChange={handleCodeChange}
                theme={getMonacoTheme()}
                options={{
                  readOnly: activeStep === 0,
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  suggestOnTriggerCharacters: true
                }}
                loading={
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress size={30} />
                  </Box>
                }
              />
            </EditorContainer>
          </Box>
          
          {/* Output Section */}
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 2, 
              height: '150px', 
              overflowY: 'auto',
              fontFamily: 'monospace',
              backgroundColor: '#f5f5f5'
            }}
          >
            <Typography variant="subtitle2" gutterBottom>
              Output:
            </Typography>
            <Box component="pre" sx={{ m: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {isRunning ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                output || 'Run your code to see the output here'
              )}
            </Box>
          </Paper>
          
          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            {activeStep > 0 && (
              <Button
                variant="outlined"
                onClick={handleBackStep}
                disabled={isRunning || isSubmitting}
              >
                Back
              </Button>
            )}
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              {activeStep >= 1 && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleRun}
                  disabled={isRunning || isSubmitting || !code.trim()}
                  startIcon={isRunning ? <CircularProgress size={20} color="inherit" /> : <CodeIcon />}
                >
                  Run Code
                </Button>
              )}
              
              {activeStep >= 2 && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleSubmit}
                  disabled={isSubmitting || isRunning || !code.trim()}
                  startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                >
                  Submit Solution
                </Button>
              )}
              
              {activeStep < 2 && activeStep > 0 && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleNextStep}
                >
                  Next Step
                </Button>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
      
      {/* Hint Dialog */}
      <Dialog
        open={hintDialogOpen}
        onClose={() => setHintDialogOpen(false)}
        aria-labelledby="hint-dialog-title"
        aria-describedby="hint-dialog-description"
      >
        <DialogTitle id="hint-dialog-title">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LightbulbIcon color="secondary" />
            <Typography variant="h6">Hint</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="hint-dialog-description">
            {currentHint || "Think about the problem differently..."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHintDialogOpen(false)} color="primary">
            Got it!
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Completion Dialog */}
      <Dialog
        open={completionDialog}
        aria-labelledby="completion-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="completion-dialog-title" sx={{ textAlign: 'center' }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h5">Challenge Completed!</Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h6" gutterBottom>
              Congratulations!
            </Typography>
            <Typography variant="body1" paragraph>
              You've successfully completed the challenge "{challenge.title}".
            </Typography>
            
            {completionData && (
              <Box sx={{ my: 3 }}>
                <Chip 
                  label={`+${completionData.points || challenge.points} points`} 
                  color="secondary" 
                  icon={<EmojiEventsIcon />} 
                  sx={{ fontWeight: 'bold', px: 2, py: 3, fontSize: '1.1rem' }}
                />
                
                {completionData.badges && completionData.badges.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      New Badges Earned:
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                      {completionData.badges.map(badge => (
                        <Chip 
                          key={badge.id} 
                          label={badge.name} 
                          color="primary" 
                          variant="outlined"
                          sx={{ fontWeight: 'bold' }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/app/challenges')}
          >
            More Challenges
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/app/dashboard')}
          >
            Go to Dashboard
          </Button>
        </DialogActions>
      </Dialog>
    </ChallengeContainer>
  );
};

export default ChallengePage;