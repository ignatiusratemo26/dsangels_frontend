import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, ButtonGroup, Slider, Paper, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  PlayArrow as PlayIcon, 
  Pause as PauseIcon, 
  Replay as ReplayIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';

const VisualizerContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

const VisualCanvas = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '300px',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#f5f5f5',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  position: 'relative',
  border: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const ControlsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  marginTop: theme.spacing(1),
  flexWrap: 'wrap',
  gap: theme.spacing(1),
}));

const VariableBox = styled(Paper)(({ theme, varType }) => {
  let bgColor;
  
  switch(varType) {
    case 'string':
      bgColor = theme.palette.info.light;
      break;
    case 'number':
      bgColor = theme.palette.success.light;
      break;
    case 'boolean':
      bgColor = theme.palette.warning.light;
      break;
    default:
      bgColor = theme.palette.primary.light;
  }
  
  return {
    padding: theme.spacing(1.5),
    margin: theme.spacing(1),
    backgroundColor: bgColor,
    color: theme.palette.getContrastText(bgColor),
    minWidth: '120px',
    maxWidth: '180px',
    borderRadius: theme.shape.borderRadius,
    display: 'inline-block',
    textAlign: 'center',
    boxShadow: theme.shadows[3],
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: theme.shadows[6],
    },
  };
});

const InfoBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(1),
  right: theme.spacing(1),
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: 'white',
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  fontSize: '0.8rem',
}));

// Helper function to determine data type visualization
const getVisualizationType = (value) => {
  if (typeof value === 'string') return 'string';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  return 'object';
};

const ConceptVisualizer = ({ concept }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(1.0);
  const [zoom, setZoom] = useState(1.0);
  const animationRef = useRef(null);

  // Determine visualization type based on concept
  const getVisualizationData = () => {
    // This would be based on the concept type/category
    const conceptType = concept?.category?.toLowerCase() || '';
    
    if (conceptType.includes('variable') || conceptType.includes('data')) {
      return {
        type: 'variables',
        steps: [
          {
            message: "Let's create some variables",
            variables: {}
          },
          {
            message: "Creating a string variable",
            variables: {
              name: "Sarah"
            }
          },
          {
            message: "Adding a number variable",
            variables: {
              name: "Sarah",
              age: 12
            }
          },
          {
            message: "Adding a boolean variable",
            variables: {
              name: "Sarah",
              age: 12,
              isStudent: true
            }
          },
          {
            message: "Variables can be updated",
            variables: {
              name: "Sarah",
              age: 13, // Age changed
              isStudent: true
            },
            highlight: 'age'
          }
        ]
      };
    } else if (conceptType.includes('loop') || conceptType.includes('iteration')) {
      return {
        type: 'loops',
        steps: [
          {
            message: "Starting a loop with i = 0",
            variables: { i: 0, sum: 0 }
          },
          {
            message: "Iteration 1: Adding i to sum",
            variables: { i: 0, sum: 0 + 0 }
          },
          {
            message: "Incrementing i",
            variables: { i: 1, sum: 0 }
          },
          {
            message: "Iteration 2: Adding i to sum",
            variables: { i: 1, sum: 0 + 1 }
          },
          {
            message: "Incrementing i",
            variables: { i: 2, sum: 1 }
          },
          {
            message: "Iteration 3: Adding i to sum",
            variables: { i: 2, sum: 1 + 2 }
          },
          {
            message: "Incrementing i",
            variables: { i: 3, sum: 3 }
          },
          {
            message: "Iteration 4: Adding i to sum",
            variables: { i: 3, sum: 3 + 3 }
          },
          {
            message: "Incrementing i",
            variables: { i: 4, sum: 6 }
          },
          {
            message: "Iteration 5: Adding i to sum",
            variables: { i: 4, sum: 6 + 4 }
          },
          {
            message: "Loop completed, final sum = 10",
            variables: { i: 5, sum: 10 }
          }
        ]
      };
    } else {
      // Default visualization for other concepts
      return {
        type: 'generic',
        steps: [
          {
            message: "Visualizing the concept",
            variables: {}
          },
          {
            message: "Step 1 of the process",
            variables: { step: 1 }
          },
          {
            message: "Step 2 of the process",
            variables: { step: 2, data: "example" }
          },
          {
            message: "Completion",
            variables: { step: 3, data: "example", complete: true }
          }
        ]
      };
    }
  };

  const visualizationData = getVisualizationData();
  const totalSteps = visualizationData.steps.length;
  
  // Handle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  // Handle restart
  const restartAnimation = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };
  
  // Handle speed change
  const handleSpeedChange = (event, newValue) => {
    setSpeed(newValue);
  };
  
  // Handle zoom change
  const handleZoomChange = (event, newValue) => {
    setZoom(newValue);
  };
  
  // Animation loop
  useEffect(() => {
    if (isPlaying) {
      animationRef.current = setTimeout(() => {
        if (currentStep < totalSteps - 1) {
          setCurrentStep(prevStep => prevStep + 1);
        } else {
          setIsPlaying(false);
        }
      }, 2000 / speed); // Speed factor affects time between steps
    }
    
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isPlaying, currentStep, totalSteps, speed]);
  
  const currentStepData = visualizationData.steps[currentStep] || { message: "", variables: {} };
  
  return (
    <VisualizerContainer>
      <VisualCanvas sx={{ transform: `scale(${zoom})`, transition: 'transform 0.3s ease' }}>
        {Object.keys(currentStepData.variables).length === 0 ? (
          <Typography variant="h6" color="text.secondary">
            Press play to start visualization
          </Typography>
        ) : (
          <Box sx={{ padding: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {Object.entries(currentStepData.variables).map(([name, value], index) => (
              <VariableBox 
                key={index} 
                varType={getVisualizationType(value)}
                elevation={currentStepData.highlight === name ? 8 : 2}
                sx={{
                  transform: currentStepData.highlight === name ? 'scale(1.1)' : 'scale(1)',
                  border: currentStepData.highlight === name ? '2px solid orange' : 'none'
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold">
                  {name}
                </Typography>
                <Typography variant="body1">
                  {value === true ? 'true' : 
                   value === false ? 'false' : 
                   String(value)}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {getVisualizationType(value)}
                </Typography>
              </VariableBox>
            ))}
          </Box>
        )}
        
        <InfoBox>
          {currentStepData.message}
        </InfoBox>
      </VisualCanvas>
      
      <ControlsContainer>
        <ButtonGroup variant="contained" size="small">
          <Button 
            onClick={togglePlay}
            startIcon={isPlaying ? <PauseIcon /> : <PlayIcon />}
            color="primary"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <Button 
            onClick={restartAnimation}
            startIcon={<ReplayIcon />}
            color="secondary"
          >
            Restart
          </Button>
        </ButtonGroup>
        
        <Box sx={{ display: 'flex', alignItems: 'center', width: { xs: '100%', sm: 'auto' } }}>
          <SpeedIcon sx={{ mr: 1, color: 'text.secondary' }} />
          <Slider
            value={speed}
            min={0.5}
            max={2}
            step={0.1}
            onChange={handleSpeedChange}
            valueLabelDisplay="auto"
            valueLabelFormat={value => `${value}x`}
            sx={{ width: 100, mr: 2 }}
          />
          
          <ZoomOutIcon sx={{ mr: 1, color: 'text.secondary' }} />
          <Slider
            value={zoom}
            min={0.5}
            max={1.5}
            step={0.1}
            onChange={handleZoomChange}
            valueLabelDisplay="auto"
            valueLabelFormat={value => `${Math.round(value * 100)}%`}
            sx={{ width: 100 }}
          />
        </Box>
      </ControlsContainer>
      
      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
        Step {currentStep + 1} of {totalSteps} - {currentStepData.message}
      </Typography>
    </VisualizerContainer>
  );
};

export default ConceptVisualizer;