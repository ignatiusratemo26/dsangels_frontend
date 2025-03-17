import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Paper,
  Button,
  LinearProgress,
  Alert,
  Divider,
  Fade,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  CircularProgress,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  ArrowBack as BackIcon,
  ArrowForward as NextIcon,
  School as SchoolIcon,
  Refresh as RefreshIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';

const QuizContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  alignItems: 'center',
}));

const QuestionCard = styled(Card)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'visible',
  position: 'relative',
}));

const OptionLabel = styled(FormControlLabel)(({ theme, selected, correct, incorrect, revealed }) => ({
  width: '100%',
  margin: theme.spacing(0.5, 0),
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.2s ease',
  '& .MuiFormControlLabel-label': {
    width: '100%',
  },
  ...(selected && {
    backgroundColor: theme.palette.action.selected,
  }),
  ...(revealed && correct && {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.contrastText,
  }),
  ...(revealed && incorrect && selected && {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.contrastText,
  }),
  '&:hover': {
    backgroundColor: !revealed && theme.palette.action.hover,
  },
}));

const ProgressIndicator = styled(Box)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(3),
}));

const NavButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  marginTop: theme.spacing(2),
}));

const ResultsSummary = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  width: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  textAlign: 'center',
  background: `linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  color: theme.palette.primary.contrastText,
  marginBottom: theme.spacing(3),
}));

const ResultDetail = styled(Paper)(({ theme, correct }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  borderLeft: `4px solid ${correct ? theme.palette.success.main : theme.palette.error.main}`,
  backgroundColor: correct ? theme.palette.success.light + '20' : theme.palette.error.light + '20',
}));

const QuizComponent = ({ quiz, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [revealedAnswers, setRevealedAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Initialize arrays with proper length based on quiz
    if (quiz && quiz.length > 0) {
      setSelectedAnswers(new Array(quiz.length).fill(null));
      setRevealedAnswers(new Array(quiz.length).fill(false));
      setScore({ correct: 0, total: quiz.length });
    }
  }, [quiz]);
  
  // If no quiz data is available
  if (!quiz || quiz.length === 0) {
    return (
      <Alert severity="info">
        No quiz questions are available for this concept.
      </Alert>
    );
  }
  
  const handleAnswerSelect = (value) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestion] = parseInt(value);
    setSelectedAnswers(newSelectedAnswers);
  };
  
  const handleRevealAnswer = () => {
    const newRevealedAnswers = [...revealedAnswers];
    newRevealedAnswers[currentQuestion] = true;
    setRevealedAnswers(newRevealedAnswers);
    
    // Update score if answer is correct
    if (selectedAnswers[currentQuestion] === quiz[currentQuestion].correct_answer) {
      setScore({ ...score, correct: score.correct + 1 });
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // This was the last question
      setShowResults(true);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    
    try {
      // Calculate final score
      let correctCount = 0;
      quiz.forEach((question, index) => {
        if (selectedAnswers[index] === question.correct_answer) {
          correctCount++;
        }
      });
      
      // Update all revealed answers
      setRevealedAnswers(new Array(quiz.length).fill(true));
      setScore({ ...score, correct: correctCount });
      
      // Show results
      setShowResults(true);
      
      // Call the parent component's onComplete callback
      if (onComplete) {
        onComplete(correctCount, quiz.length);
      }
    } catch (err) {
      console.error('Error submitting quiz:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRetakeQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(quiz.length).fill(null));
    setRevealedAnswers(new Array(quiz.length).fill(false));
    setScore({ correct: 0, total: quiz.length });
    setShowResults(false);
  };
  
  // Calculate progress
  const progress = ((currentQuestion + 1) / quiz.length) * 100;
  
  // Show results screen if quiz is complete
  if (showResults) {
    return (
      <QuizContainer>
        <ResultsSummary elevation={3}>
          <SchoolIcon sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Quiz Complete!
          </Typography>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Your Score: {score.correct} / {score.total}
          </Typography>
          <Typography variant="h6">
            {score.correct === score.total ? '🎉 Perfect!' : 
             score.correct / score.total >= 0.8 ? '🌟 Great job!' :
             score.correct / score.total >= 0.6 ? '👍 Good effort!' :
             'Keep practicing!'}
          </Typography>
          
          <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
            <Chip 
              label={`${Math.round((score.correct / score.total) * 100)}%`} 
              color="primary" 
              variant="outlined"
              sx={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}
            />
            <Chip 
              label={`${score.correct} correct`} 
              color="primary" 
              variant="outlined"
              sx={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}
            />
            <Chip 
              label={`${score.total - score.correct} incorrect`} 
              color="primary" 
              variant="outlined"
              sx={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}
            />
          </Box>
        </ResultsSummary>
        
        <Typography variant="h6" gutterBottom sx={{ alignSelf: 'flex-start' }}>
          Question Review
        </Typography>
        
        {quiz.map((question, index) => {
          const isCorrect = selectedAnswers[index] === question.correct_answer;
          return (
            <ResultDetail key={index} correct={isCorrect}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                {isCorrect ? (
                  <CheckIcon color="success" sx={{ mt: 0.5, mr: 1 }} />
                ) : (
                  <CloseIcon color="error" sx={{ mt: 0.5, mr: 1 }} />
                )}
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium">
                    Question {index + 1}: {question.question}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Your answer: {selectedAnswers[index] !== null ? 
                      question.options[selectedAnswers[index]] : 
                      'No answer selected'}
                  </Typography>
                  
                  {!isCorrect && (
                    <Typography variant="body2" color="success.main" sx={{ mt: 0.5 }}>
                      Correct answer: {question.options[question.correct_answer]}
                    </Typography>
                  )}
                </Box>
              </Box>
            </ResultDetail>
          );
        })}
        
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<RefreshIcon />} 
          onClick={handleRetakeQuiz}
          sx={{ mt: 2 }}
        >
          Retake Quiz
        </Button>
      </QuizContainer>
    );
  }
  
  return (
    <QuizContainer>
      <ProgressIndicator>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Question {currentQuestion + 1} of {quiz.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {Math.round(progress)}% complete
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ height: 8, borderRadius: 4 }}
        />
      </ProgressIndicator>
      
      <Fade in={true} timeout={500}>
        <QuestionCard>
          <CardContent>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2 
              }}
            >
              <AssessmentIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                {quiz[currentQuestion].question}
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <RadioGroup 
                value={selectedAnswers[currentQuestion] !== null ? selectedAnswers[currentQuestion].toString() : ''} 
                onChange={(e) => handleAnswerSelect(e.target.value)}
              >
                {quiz[currentQuestion].options.map((option, optionIndex) => (
                  <Paper 
                    key={optionIndex} 
                    elevation={selectedAnswers[currentQuestion] === optionIndex ? 2 : 0}
                    sx={{ mb: 1, overflow: 'hidden' }}
                  >
                    <OptionLabel
                      value={optionIndex.toString()}
                      control={<Radio />}
                      label={option}
                      selected={selectedAnswers[currentQuestion] === optionIndex}
                      correct={optionIndex === quiz[currentQuestion].correct_answer}
                      incorrect={optionIndex !== quiz[currentQuestion].correct_answer}
                      revealed={revealedAnswers[currentQuestion]}
                      sx={{ margin: 0 }}
                    />
                  </Paper>
                ))}
              </RadioGroup>
            </FormControl>
            
            {revealedAnswers[currentQuestion] && (
              <Alert 
                severity={selectedAnswers[currentQuestion] === quiz[currentQuestion].correct_answer ? "success" : "error"}
                sx={{ mt: 2 }}
              >
                {selectedAnswers[currentQuestion] === quiz[currentQuestion].correct_answer ? 
                  "Correct answer!" : 
                  `Incorrect. The correct answer is: ${quiz[currentQuestion].options[quiz[currentQuestion].correct_answer]}`
                }
              </Alert>
            )}
          </CardContent>
        </QuestionCard>
      </Fade>
      
      <NavButtons>
        <Button
          variant="outlined"
          onClick={handlePrevQuestion}
          disabled={currentQuestion === 0}
          startIcon={<BackIcon />}
        >
          Previous
        </Button>
        
        {revealedAnswers[currentQuestion] ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNextQuestion}
            endIcon={currentQuestion < quiz.length - 1 ? <NextIcon /> : null}
          >
            {currentQuestion < quiz.length - 1 ? 'Next' : 'Show Results'}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleRevealAnswer}
            disabled={selectedAnswers[currentQuestion] === null}
          >
            Check Answer
          </Button>
        )}
      </NavButtons>
      
      {selectedAnswers.every(answer => answer !== null) && !revealedAnswers[currentQuestion] && (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSubmitQuiz}
          sx={{ mt: 2, width: '100%' }}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Submit All Answers"
          )}
        </Button>
      )}
    </QuizContainer>
  );
};

export default QuizComponent;