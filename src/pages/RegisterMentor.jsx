import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Divider,
  Tooltip,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Visibility, 
  VisibilityOff, 
  HelpOutline as HelpIcon,
  Info as InfoIcon,
  Work as WorkIcon,
  AccountCircle as AccountIcon,
  Security as SecurityIcon,
  Psychology as PsychologyIcon,
  School as SchoolIcon,
  Code as CodeIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';

// Auth context
import { useAuth } from '../contexts/AuthContext';

// Logo
import logo from '../assets/images/logo.png';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
}));

const Logo = styled('img')({
  height: '60px',
  marginBottom: '16px'
});

const StepIcon = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: '50%',
  width: 40,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.primary.contrastText,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
}));

const ExpertiseChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  '&.selected': {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  }
}));

// Sample expertise areas - in a real app this would likely come from an API
const expertiseAreas = [
  { id: 'web', label: 'Web Development' },
  { id: 'mobile', label: 'Mobile Apps' },
  { id: 'game', label: 'Game Development' },
  { id: 'ml', label: 'Machine Learning' },
  { id: 'data', label: 'Data Science' },
  { id: 'robotics', label: 'Robotics' },
  { id: 'cyber', label: 'Cybersecurity' },
  { id: 'design', label: 'UI/UX Design' },
  { id: 'cloud', label: 'Cloud Computing' },
  { id: 'blockchain', label: 'Blockchain' },
  { id: 'python', label: 'Python' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'java', label: 'Java' },
  { id: 'cs', label: 'Computer Science' },
];

const RegisterMentorPage = () => {
  const navigate = useNavigate();
  const { registerMentor } = useAuth();
  
  // State for steps
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Account Info', 'Security', 'Mentor Profile'];
  
  // Form state
  const [formData, setFormData] = useState({
    // Basic info
    username: '',
    email: '',
    display_name: '',
    password: '',
    password2: '',
    
    // Mentor profile
    expertise: '',
    bio: '',
    years_experience: '',
    
    // Selected expertise areas for UI (will be combined into expertise string)
    selectedExpertise: [],
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const handleExpertiseChipClick = (expertiseId) => {
    const newSelectedExpertise = [...formData.selectedExpertise];
    
    if (newSelectedExpertise.includes(expertiseId)) {
      // Remove if already selected
      const index = newSelectedExpertise.indexOf(expertiseId);
      if (index > -1) {
        newSelectedExpertise.splice(index, 1);
      }
    } else {
      // Add if not selected
      newSelectedExpertise.push(expertiseId);
    }
    
    // Update both the selectedExpertise array and the expertise string
    const selectedLabels = newSelectedExpertise.map(id => 
      expertiseAreas.find(area => area.id === id)?.label
    ).filter(Boolean);
    
    setFormData({
      ...formData,
      selectedExpertise: newSelectedExpertise,
      expertise: selectedLabels.join(', ')
    });
    
    // Clear expertise error if any
    if (errors.expertise) {
      setErrors({ ...errors, expertise: '' });
    }
  };
  
  const validateStep = (step) => {
    const newErrors = {};
    let isValid = true;
    
    if (step === 0) {
      // Validate basic info
      if (!formData.username.trim()) {
        newErrors.username = 'Username is required';
        isValid = false;
      } else if (formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
        isValid = false;
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email address is invalid';
        isValid = false;
      }
      
      if (!formData.display_name.trim()) {
        newErrors.display_name = 'Display name is required';
        isValid = false;
      }
    } else if (step === 1) {
      // Validate password
      if (!formData.password) {
        newErrors.password = 'Password is required';
        isValid = false;
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
        isValid = false;
      }
      
      if (!formData.password2) {
        newErrors.password2 = 'Please confirm your password';
        isValid = false;
      } else if (formData.password !== formData.password2) {
        newErrors.password2 = 'Passwords do not match';
        isValid = false;
      }
    } else if (step === 2) {
      // Validate mentor profile
      if (!formData.expertise.trim()) {
        newErrors.expertise = 'At least one area of expertise is required';
        isValid = false;
      }
      
      if (!formData.bio.trim()) {
        newErrors.bio = 'Bio is required';
        isValid = false;
      } else if (formData.bio.length < 50) {
        newErrors.bio = 'Bio must be at least 50 characters';
        isValid = false;
      }
      
      if (!formData.years_experience) {
        newErrors.years_experience = 'Years of experience is required';
        isValid = false;
      } else if (isNaN(formData.years_experience) || parseInt(formData.years_experience) < 0) {
        newErrors.years_experience = 'Please enter a valid number';
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(activeStep)) {
      return;
    }
    
    try {
      setGeneralError('');
      setIsLoading(true);
      
      // Convert years_experience to integer
      const mentorData = {
        ...formData,
        years_experience: parseInt(formData.years_experience)
      };
      
      // Remove the selectedExpertise array since it's just for UI
      delete mentorData.selectedExpertise;
      
      await registerMentor(mentorData);
      
      // Show success notification and redirect
      navigate('/app');
    } catch (err) {
      console.error('Mentor registration error:', err);
      
      if (err.response && err.response.data) {
        // Handle field-specific errors from API
        const apiErrors = err.response.data;
        const fieldErrors = {};
        
        Object.keys(apiErrors).forEach(key => {
          fieldErrors[key] = Array.isArray(apiErrors[key])
            ? apiErrors[key].join(' ')
            : apiErrors[key];
        });
        
        setErrors(fieldErrors);
        
        // If there's a non-field error
        if (apiErrors.detail || apiErrors.non_field_errors) {
          setGeneralError(
            apiErrors.detail || 
            (Array.isArray(apiErrors.non_field_errors) 
              ? apiErrors.non_field_errors.join(' ') 
              : apiErrors.non_field_errors)
          );
        }
      } else {
        setGeneralError('Registration failed. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <SectionTitle variant="h6">
              <AccountIcon color="primary" />
              Account Information
            </SectionTitle>
            
            <Alert severity="info" sx={{ mb: 3, width: '100%' }}>
              <Typography variant="body2">
                Join as a mentor to inspire and guide the next generation of tech talent!
              </Typography>
            </Alert>
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              value={formData.username}
              onChange={handleInputChange}
              error={!!errors.username}
              helperText={errors.username}
              disabled={isLoading}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={isLoading}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="display_name"
              label="Display Name"
              name="display_name"
              value={formData.display_name}
              onChange={handleInputChange}
              error={!!errors.display_name}
              helperText={errors.display_name || "This is how you'll appear to students"}
              disabled={isLoading}
            />
          </>
        );
      
      case 1:
        return (
          <>
            <SectionTitle variant="h6">
              <SecurityIcon color="primary" />
              Account Security
            </SectionTitle>
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password}
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password2"
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              id="password2"
              autoComplete="new-password"
              value={formData.password2}
              onChange={handleInputChange}
              error={!!errors.password2}
              helperText={errors.password2}
              disabled={isLoading}
            />
            
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                Password must be at least 8 characters long and include at least one uppercase letter, 
                one lowercase letter, and one number.
              </Typography>
            </Alert>
          </>
        );
      
      case 2:
        return (
          <>
            <SectionTitle variant="h6">
              <PsychologyIcon color="primary" />
              Mentor Profile
            </SectionTitle>
            
            <Alert severity="info" sx={{ mb: 3, width: '100%' }}>
              <Typography variant="body2">
                As a mentor, you'll guide young students on their tech journey. Your expertise and experience can make a real difference!
              </Typography>
            </Alert>
            
            <Box sx={{ mb: 3, width: '100%' }}>
              <Typography variant="subtitle1" gutterBottom required>
                Areas of Expertise* 
                <Tooltip title="Select all that apply">
                  <HelpIcon fontSize="small" sx={{ ml: 1, verticalAlign: 'middle', color: 'text.secondary' }} />
                </Tooltip>
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 1 }}>
                {expertiseAreas.map((area) => (
                  <ExpertiseChip
                    key={area.id}
                    label={area.label}
                    onClick={() => handleExpertiseChipClick(area.id)}
                    className={formData.selectedExpertise.includes(area.id) ? 'selected' : ''}
                    clickable
                  />
                ))}
              </Box>
              
              {errors.expertise && (
                <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                  {errors.expertise}
                </Typography>
              )}
            </Box>
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="years_experience"
              label="Years of Experience"
              name="years_experience"
              type="number"
              InputProps={{ 
                inputProps: { min: 0 },
                startAdornment: (
                  <InputAdornment position="start">
                    <WorkIcon color="action" />
                  </InputAdornment>
                ),
              }}
              value={formData.years_experience}
              onChange={handleInputChange}
              error={!!errors.years_experience}
              helperText={errors.years_experience}
              disabled={isLoading}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              multiline
              rows={4}
              id="bio"
              label="Professional Bio"
              name="bio"
              placeholder="Share your professional background, teaching experience, and why you want to mentor young tech enthusiasts..."
              value={formData.bio}
              onChange={handleInputChange}
              error={!!errors.bio}
              helperText={errors.bio || "Minimum 50 characters"}
              disabled={isLoading}
            />
            
            <Alert severity="warning" sx={{ mt: 3, width: '100%' }}>
              <Typography variant="body2">
                By registering as a mentor, you agree to our <Link component={RouterLink} to="/terms" color="secondary">Terms of Service</Link>, <Link component={RouterLink} to="/privacy" color="secondary">Privacy Policy</Link>, and <Link component={RouterLink} to="/mentor-guidelines" color="secondary">Mentor Guidelines</Link>, which include a background check and code of conduct.
              </Typography>
            </Alert>
          </>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 6,
          marginBottom: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <StyledPaper sx={{ width: '100%' }}>
          <Logo src={logo} alt="DSAngels Logo" />
          
          <Typography component="h1" variant="h4" gutterBottom>
            Mentor Registration
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Share your knowledge and inspire the next generation of tech talent
          </Typography>
          
          <Stepper activeStep={activeStep} sx={{ width: '100%', mb: 4 }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel 
                  StepIconComponent={(props) => (
                    <StepIcon {...props}>
                      {index === 0 ? <AccountIcon /> : 
                       index === 1 ? <SecurityIcon /> : 
                       <PsychologyIcon />}
                    </StepIcon>
                  )}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {generalError && (
            <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
              {generalError}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            {renderStepContent(activeStep)}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0 || isLoading}
                onClick={handleBack}
                variant="outlined"
                sx={{ borderRadius: 2 }}
              >
                Back
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                  sx={{ borderRadius: 2 }}
                >
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : "Register as Mentor"}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={isLoading}
                  sx={{ borderRadius: 2 }}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
          
          <Divider sx={{ width: '100%', my: 3 }} />
          
          <Box sx={{ width: '100%', textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" color="secondary">
                Log In
              </Link>
            </Typography>
          </Box>
          
          <Box sx={{ mt: 2, width: '100%', textAlign: 'center' }}>
            <Typography variant="body2">
              Registering as a student?{' '}
              <Link component={RouterLink} to="/register" color="secondary">
                Student Registration
              </Link>
            </Typography>
          </Box>
          
          <Box sx={{ mt: 2, width: '100%', textAlign: 'center' }}>
            <Typography variant="body2">
              Registering for your child?{' '}
              <Link component={RouterLink} to="/register/parent" color="secondary">
                Parent Registration
              </Link>
            </Typography>
          </Box>
        </StyledPaper>
      </Box>
    </Container>
  );
};

export default RegisterMentorPage;