import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, ButtonGroup, Slider, Paper, Alert, Grid } from '@mui/material';
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

const GridCell = styled(Box)(({ theme, isStart, isGoal, isObstacle, isHighlighted }) => {
  let bgColor = 'transparent';
  
  if (isStart) bgColor = theme.palette.primary.light + '40'; // Transparent version
  if (isGoal) bgColor = theme.palette.success.light + '40';
  if (isObstacle) bgColor = theme.palette.error.light + '40';
  if (isHighlighted) bgColor = theme.palette.secondary.light + '40';
  
  return {
    width: 48,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    border: '1px solid',
    borderColor: theme.palette.divider,
    backgroundColor: bgColor,
    borderRadius: theme.shape.borderRadius / 2,
    transition: 'transform 0.2s, background-color 0.2s',
    '&:hover': {
      transform: 'scale(1.05)',
    }
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
  const [visualizationType, setVisualizationType] = useState('standard');

  // Check for grid visualization
  useEffect(() => {
    if (concept?.visual_aids?.grid) {
      setVisualizationType('grid');
    } else {
      setVisualizationType('standard');
    }
  }, [concept]);

  // Grid-specific state
  const [gridHighlight, setGridHighlight] = useState([]);
  const [gridStep, setGridStep] = useState(0);
  const [gridSteps, setGridSteps] = useState([]);
  const [gridMessage, setGridMessage] = useState('');

  // Initialize grid path steps if in grid visualization mode
  useEffect(() => {
    if (visualizationType === 'grid' && concept?.visual_aids?.path) {
      setGridSteps(concept.visual_aids.path || []);
      setGridMessage(concept.visual_aids.message || 'Follow the path to reach the goal!');
    }
  }, [visualizationType, concept]);

  // Handle grid animation
  useEffect(() => {
    if (isPlaying && visualizationType === 'grid') {
      animationRef.current = setTimeout(() => {
        if (gridStep < gridSteps.length - 1) {
          setGridStep(prevStep => prevStep + 1);
          setGridHighlight(gridSteps[gridStep + 1]);
        } else {
          setIsPlaying(false);
        }
      }, 1000 / speed);
    }
    
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isPlaying, gridStep, gridSteps.length, speed, visualizationType]);

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
    setGridStep(0);
    setGridHighlight([]);
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
  
  // Animation loop for standard visualization
  useEffect(() => {
    if (isPlaying && visualizationType === 'standard') {
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
  }, [isPlaying, currentStep, totalSteps, speed, visualizationType]);
  
  const currentStepData = visualizationData.steps[currentStep] || { message: "", variables: {} };
  
  // Render grid visualization
  const renderGridVisualization = () => {
    const { grid, start, goal } = concept.visual_aids;
    
    if (!grid || !grid.length) {
      return (
        <Typography variant="body1" color="text.secondary">
          Grid data not available for this visualization.
        </Typography>
      );
    }
    
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center',
        p: 2
      }}>
        <Typography variant="subtitle1" gutterBottom>
          {gridMessage}
        </Typography>
        
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: `repeat(${grid[0].length}, 48px)`,
          gap: 1,
          justifyContent: 'center'
        }}>
          {grid.map((row, rowIndex) => (
            row.map((cell, colIndex) => {
              const isStart = start && start[0] === rowIndex && start[1] === colIndex;
              const isGoal = goal && goal[0] === rowIndex && goal[1] === colIndex;
              const isHighlighted = gridHighlight && 
                gridHighlight.length === 2 && 
                gridHighlight[0] === rowIndex && 
                gridHighlight[1] === colIndex;
              const isObstacle = cell === '🌳' || cell === '🧱' || cell === '🌊';
              
              return (
                <GridCell 
                  key={`${rowIndex}-${colIndex}`}
                  isStart={isStart}
                  isGoal={isGoal}
                  isObstacle={isObstacle}
                  isHighlighted={isHighlighted}
                >
                  {cell}
                </GridCell>
              );
            })
          ))}
        </Box>
        
        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
          <Typography variant="body2">
            <strong>🦄</strong> - Starting point (Unicorn)
          </Typography>
          <Typography variant="body2">
            <strong>🏰</strong> - Goal (Enchanted Castle)
          </Typography>
          <Typography variant="body2">
            <strong>🌳</strong> - Obstacle (Trees)
          </Typography>
          <Typography variant="body2">
            <strong>Empty space</strong> - Path the unicorn can travel
          </Typography>
        </Box>
      </Box>
    );
  };

  // Render standard visualization
  const renderStandardVisualization = () => {
    return (
      <>
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
      </>
    );
  };
  
  // If no visualization data is available
  if (!concept) {
    return (
      <Typography color="text.secondary">
        No visualization available for this concept.
      </Typography>
    );
  }

  return (
    <VisualizerContainer>
      <VisualCanvas sx={{ transform: `scale(${zoom})`, transition: 'transform 0.3s ease' }}>
        {visualizationType === 'grid' 
          ? renderGridVisualization() 
          : renderStandardVisualization()
        }
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
        {visualizationType === 'grid' 
          ? `Step ${gridStep + 1} of ${gridSteps.length}`
          : `Step ${currentStep + 1} of ${totalSteps} - ${currentStepData.message}`
        }
      </Typography>
    </VisualizerContainer>
  );
};

export default ConceptVisualizer;