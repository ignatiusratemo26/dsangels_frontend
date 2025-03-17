import React from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Paper, 
  Typography, 
  Collapse, 
  Alert, 
  AlertTitle,
  LinearProgress,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { keyframes } from '@mui/system';

// Animation for success result
const celebrateAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const ResultContainer = styled(Paper)(({ theme, success, error }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2, 0),
  borderRadius: theme.shape.borderRadius,
  animation: success ? `${celebrateAnimation} 0.5s ease` : 'none',
  border: success ? `1px solid ${theme.palette.success.main}` : 
         error ? `1px solid ${theme.palette.error.main}` : 
         `1px solid ${theme.palette.divider}`,
  backgroundColor: success ? theme.palette.success.light + '15' : 
                  error ? theme.palette.error.light + '15' : 
                  theme.palette.background.paper,
}));

const OutputContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#f5f5f5',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1.5),
  fontFamily: 'monospace',
  fontSize: '0.875rem',
  overflowX: 'auto',
  maxHeight: '200px',
  overflowY: 'auto',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  border: `1px solid ${theme.palette.divider}`,
}));

// Component for displaying code execution results
const ChallengeResult = ({
  success = false,
  error = false,
  message = '',
  output = '',
  testResults = [],
  isLoading = false,
  hidden = false,
}) => {
  if (hidden && !isLoading) {
    return null;
  }
  
  let statusIcon;
  let alertSeverity;
  
  if (success) {
    statusIcon = <CheckCircleIcon color="success" />;
    alertSeverity = 'success';
  } else if (error) {
    statusIcon = <ErrorIcon color="error" />;
    alertSeverity = 'error';
  } else {
    statusIcon = <InfoIcon color="info" />;
    alertSeverity = 'info';
  }
  
  return (
    <Collapse in={!hidden}>
      {isLoading ? (
        <Box sx={{ width: '100%', my: 2 }}>
          <LinearProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
            Running your code...
          </Typography>
        </Box>
      ) : (
        <ResultContainer success={success} error={error}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            {statusIcon}
            <Typography 
              variant="subtitle1" 
              sx={{ ml: 1, fontWeight: 'medium' }}
              color={
                success ? "success.main" : 
                error ? "error.main" : 
                "text.primary"
              }
            >
              {success ? 'Success!' : error ? 'Error' : 'Result'}
            </Typography>
          </Box>
          
          {message && (
            <Alert 
              severity={alertSeverity} 
              variant="outlined"
              sx={{ mb: 2 }}
            >
              {message}
            </Alert>
          )}
          
          {/* Test Results */}
          {testResults && testResults.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Test Results:
              </Typography>
              
              {testResults.map((test, index) => (
                <Alert 
                  key={index}
                  severity={test.passed ? "success" : "error"}
                  variant="outlined"
                  icon={test.passed ? <CheckCircleIcon /> : <ErrorIcon />}
                  sx={{ mb: 1 }}
                >
                  <AlertTitle>{test.name || `Test ${index + 1}`}</AlertTitle>
                  {test.message}
                </Alert>
              ))}
            </Box>
          )}
          
          {/* Output */}
          {output && (
            <>
              <Typography variant="subtitle2" gutterBottom>
                Output:
              </Typography>
              <OutputContainer>
                {output}
              </OutputContainer>
            </>
          )}
          
        </ResultContainer>
      )}
    </Collapse>
  );
};

ChallengeResult.propTypes = {
  success: PropTypes.bool,
  error: PropTypes.bool,
  message: PropTypes.string,
  output: PropTypes.string,
  testResults: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      passed: PropTypes.bool,
      message: PropTypes.string,
    })
  ),
  isLoading: PropTypes.bool,
  hidden: PropTypes.bool,
};

export default ChallengeResult;