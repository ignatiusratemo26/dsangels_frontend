import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  ButtonGroup,
  Divider,
  CircularProgress,
  Fade,
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  FastForward as NextIcon,
  FastRewind as PrevIcon,
  Refresh as RestartIcon,
  Help as HelpIcon,
  Speed as SpeedIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';

// Import the CodeEditor component
import CodeEditor from '../challenges/CodeEditor';
import ChallengeResult from '../challenges/ChallengeResult';

// Services
import { contentService } from '../../services/contentService';

const TutorialContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
}));

const TutorialHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

const TutorialControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
  gap: theme.spacing(1),
}));

const StepContentWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
  borderRadius: theme.shape.borderRadius,
}));

const InteractiveTutorial = ({ concept }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tutorialSpeed, setTutorialSpeed] = useState(1);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fetchedTutorial, setFetchedTutorial] = useState(null);
  const timerRef = useRef(null);
  
  // Steps for the interactive tutorial
  const getTutorialSteps = () => {
    // If we have fetched a tutorial, use it
    if (fetchedTutorial) {
      return fetchedTutorial.steps;
    }
    
    // Otherwise create a default tutorial based on the concept category
    const conceptType = concept?.category?.toLowerCase() || '';
    
    if (conceptType.includes('variable') || conceptType.includes('data')) {
      return [
        {
          title: 'Introduction to Variables',
          content: 'Variables are containers for storing data values. Think of a variable as a labeled box that holds a value.',
          code: '# No code yet',
        },
        {
          title: 'Creating Variables',
          content: 'In Python, you can create a variable by assigning a value to it using the equals sign (=).',
          code: '# Creating a variable\nname = "Sarah"',
        },
        {
          title: 'Different Data Types',
          content: 'Variables can store different types of data: strings (text), integers (whole numbers), floats (decimal numbers), and booleans (True/False).',
          code: '# Different data types\nname = "Sarah"  # string\nage = 12      # integer\nheight = 1.58  # float (decimal)\nis_student = True  # boolean',
        },
        {
          title: 'Using Variables',
          content: 'Once you\'ve created variables, you can use them in your code. For example, you can print their values.',
          code: '# Using variables\nname = "Sarah"\nage = 12\n\n# Printing variables\nprint("My name is", name)\nprint("I am", age, "years old")',
          runnable: true,
          expected_output: 'My name is Sarah\nI am 12 years old',
        },
        {
          title: 'Changing Variable Values',
          content: 'You can change the value of a variable at any time by assigning a new value to it.',
          code: '# Changing variable values\nname = "Sarah"\nprint("Hello,", name)\n\n# Change the value\nname = "Emma"\nprint("Hello,", name)',
          runnable: true,
          expected_output: 'Hello, Sarah\nHello, Emma',
        },
      ];
    } else if (conceptType.includes('loop') || conceptType.includes('iteration')) {
      return [
        {
          title: 'Introduction to Loops',
          content: 'Loops allow you to repeat a block of code multiple times. This is useful when you want to perform the same action on different items.',
          code: '# No code yet',
        },
        {
          title: 'For Loops',
          content: 'A for loop iterates over a sequence (like a list, string, or range) and executes a block of code for each item in the sequence.',
          code: '# Basic for loop\nfor i in range(5):\n    print(i)',
          runnable: true,
          expected_output: '0\n1\n2\n3\n4',
        },
        // More steps for loops...
      ];
    } else {
      // Default tutorial for any concept
      return [
        {
          title: 'Introduction',
          content: `Welcome to this interactive tutorial on ${concept.title || 'this concept'}. Let's explore it step by step!`,
          code: '# Welcome to the tutorial\nprint("Hello, world!")',
        },
        {
          title: 'Getting Started',
          content: 'Let\'s try a simple example to understand how this works.',
          code: '# A simple example\n# Try running this code!\n\nprint("I am learning to code!")',
          runnable: true,
          expected_output: 'I am learning to code!',
        },
        {
          title: 'Going Further',
          content: 'Now let\'s try something a bit more advanced.',
          code: '# A more advanced example\n\n# Define a function\ndef greet(name):\n    return f"Hello, {name}!"\n\n# Call the function\nresult = greet("Learner")\nprint(result)',
          runnable: true,
          expected_output: 'Hello, Learner!',
        },
      ];
    }
  };
  
  const tutorialSteps = getTutorialSteps();
  
  // Fetch tutorial data based on concept id
  useEffect(() => {
    const fetchTutorial = async () => {
      if (!concept || !concept.id) return;
      
      try {
        const tutorialData = await contentService.getConceptTutorial(concept.id);
        if (tutorialData && tutorialData.steps && tutorialData.steps.length > 0) {
          setFetchedTutorial(tutorialData);
        }
      } catch (error) {
        console.error('Error fetching tutorial:', error);
        // Fall back to default tutorial steps
      }
    };
    
    fetchTutorial();
  }, [concept]);
  
  // Set code when active step changes
  useEffect(() => {
    if (tutorialSteps[activeStep]) {
      setCode(tutorialSteps[activeStep].code || '');
      setShowOutput(false);
    }
  }, [activeStep, tutorialSteps]);
  
  // Handle the auto-play function
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setTimeout(() => {
        if (activeStep < tutorialSteps.length - 1) {
          setActiveStep((prevStep) => prevStep + 1);
        } else {
          setIsPlaying(false);
        }
      }, 5000 / tutorialSpeed); // Adjust speed based on tutorialSpeed
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, activeStep, tutorialSteps.length, tutorialSpeed]);
  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleReset = () => {
    setActiveStep(0);
    setIsPlaying(false);
  };
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const cycleTutorialSpeed = () => {
    setTutorialSpeed((prevSpeed) => {
      const speeds = [0.5, 1, 1.5, 2];
      const currentIndex = speeds.indexOf(prevSpeed);
      const nextIndex = (currentIndex + 1) % speeds.length;
      return speeds[nextIndex];
    });
  };
  
  const handleRunCode = async () => {
    const currentStep = tutorialSteps[activeStep];
    if (!currentStep || !currentStep.runnable) return;
    
    setLoading(true);
    setShowOutput(true);
    setIsSuccess(false);
    
    try {
      // In a real app, this would call your backend to execute the code
      // For now, we'll simulate the execution
      const result = await simulateCodeExecution(code, currentStep.expected_output);
      
      setOutput(result.output);
      setIsSuccess(result.success);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to simulate code execution
  const simulateCodeExecution = (code, expectedOutput) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // This is just a simulation - in a real app you'd send the code to a server
        let output;
        let success = false;
        
        try {
          // For demo purposes, let's pretend we're executing Python code
          // In a real app, this would be done on the server
          if (code.includes('print(')) {
            // Extract what's inside the print statement
            const printMatch = code.match(/print\((.*)\)/g);
            if (printMatch) {
              output = printMatch
                .map(p => {
                  // Very simple simulation, replace quotes and format
                  const content = p.substring(6, p.length - 1);
                  return content.replace(/"/g, '').replace(/,/g, ' ');
                })
                .join('\n');
            } else {
              output = 'Code executed successfully but produced no output.';
            }
          } else {
            output = 'Code executed successfully but produced no output.';
          }
          
          // Check if output matches expected
          if (expectedOutput) {
            success = output.trim() === expectedOutput.trim();
          } else {
            success = true;
          }
        } catch (e) {
          output = `Error executing code: ${e.message}`;
          success = false;
        }
        
        resolve({ output, success });
      }, 1000); // Simulate processing time
    });
  };
  
  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };
  
  // Skip the introduction step if there's more than one step
  useEffect(() => {
    if (tutorialSteps.length > 1 && activeStep === 0 && isPlaying) {
      const timer = setTimeout(() => {
        setActiveStep(1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [tutorialSteps.length, activeStep, isPlaying]);
  
  const currentStep = tutorialSteps[activeStep];
  
  return (
    <TutorialContainer elevation={3}>
      <TutorialHeader>
        <PsychologyIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
        <Typography variant="h6">Interactive Tutorial</Typography>
      </TutorialHeader>
      
      <TutorialControls>
        <ButtonGroup size="small" variant="outlined">
          <Button
            onClick={togglePlayPause}
            startIcon={isPlaying ? <PauseIcon /> : <PlayIcon />}
            color="primary"
          >
            {isPlaying ? 'Pause' : 'Auto-Play'}
          </Button>
          
          <Button
            onClick={handleReset}
            startIcon={<RestartIcon />}
            disabled={activeStep === 0}
          >
            Restart
          </Button>
        </ButtonGroup>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Adjust Speed">
            <IconButton onClick={cycleTutorialSpeed} size="small">
              <SpeedIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="caption" sx={{ ml: 0.5 }}>
            {tutorialSpeed}x
          </Typography>
        </Box>
      </TutorialControls>
      
      <Stepper activeStep={activeStep} orientation="vertical">
        {tutorialSteps.map((step, index) => (
          <Step key={index}>
            <StepLabel>
              <Typography variant="subtitle1">{step.title}</Typography>
            </StepLabel>
            <StepContent>
              <StepContentWrapper>
                <Typography variant="body2" paragraph>
                  {step.content}
                </Typography>
                
                {step.code && (
                  <Box sx={{ my: 2 }}>
                    <CodeEditor
                      initialCode={step.code}
                      language="python" // Default to Python, adjust as needed
                      onChange={handleCodeChange}
                      height="200px"
                      readOnly={!step.runnable}
                    />
                    
                    {step.runnable && (
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleRunCode}
                          disabled={loading}
                          startIcon={loading ? <CircularProgress size={20} /> : null}
                        >
                          Run Code
                        </Button>
                      </Box>
                    )}
                    
                    <ChallengeResult
                      success={isSuccess}
                      error={showOutput && !isSuccess}
                      output={output}
                      isLoading={loading}
                      hidden={!showOutput}
                      message={isSuccess ? "Great job! Your code works as expected." : "The output doesn't match what was expected. Try again!"}
                    />
                  </Box>
                )}
              </StepContentWrapper>
              
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  startIcon={<PrevIcon />}
                  size="small"
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  endIcon={<NextIcon />}
                  size="small"
                  disabled={activeStep === tutorialSteps.length - 1}
                >
                  Continue
                </Button>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      
      {activeStep === tutorialSteps.length && (
        <Fade in={true} timeout={1000}>
          <Box sx={{ p: 3, bgcolor: 'success.light', borderRadius: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom color="success.dark">
              Tutorial Completed!
            </Typography>
            <Typography variant="body1" paragraph>
              Congratulations! You've completed the tutorial on {concept?.title || 'this concept'}.
            </Typography>
            <Button
              onClick={handleReset}
              variant="outlined"
              color="primary"
              startIcon={<RestartIcon />}
            >
              Start Over
            </Button>
          </Box>
        </Fade>
      )}
      
      {/* Help tooltip for when users get stuck */}
      {currentStep && currentStep.runnable && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Tooltip 
            title={
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Expected Output:
                </Typography>
                <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                  {currentStep.expected_output}
                </Typography>
              </Box>
            }
          >
            <Button
              variant="text"
              color="secondary"
              size="small"
              startIcon={<HelpIcon />}
            >
              Need a hint?
            </Button>
          </Tooltip>
        </Box>
      )}
      
      {/* Tutorial navigation at the bottom */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Step {activeStep + 1} of {tutorialSteps.length}
        </Typography>
      </Box>
    </TutorialContainer>
  );
};

InteractiveTutorial.propTypes = {
  concept: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    category: PropTypes.string,
  }),
};

export default InteractiveTutorial;