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
  FormHelperText
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Auth context
import { useAuth } from '../contexts/AuthContext';

// Logo (replace with your actual logo import)
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

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  // State for steps
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Your Info', 'Account Security', 'Age & Interests'];
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    password: '',
    password2: '',
    date_of_birth: '',
    age_group_id: '',
    interests: []
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
  
  const validateStep = (step) => {
    const newErrors = {};
    let isValid = true;
    
    if (step === 0) {
      // Validate personal info
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
      // Validate age
      if (!formData.date_of_birth) {
        newErrors.date_of_birth = 'Date of birth is required';
        isValid = false;
      }
      
      if (!formData.age_group_id) {
        newErrors.age_group_id = 'Age group is required';
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
      
      await register(formData);
      navigate('/app');
    } catch (err) {
      console.error('Registration error:', err);
      
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
              id="name"
              label="Display Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={!!errors.name}
              helperText={errors.name}
              disabled={isLoading}
            />
          </>
        );
      
      case 1:
        return (
          <>
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
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Password must be at least 8 characters long and include at least one uppercase letter, 
              one lowercase letter, and one number.
            </Typography>
          </>
        );
      
      case 2:
        return (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              id="date_of_birth"
              label="Date of Birth"
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleInputChange}
              error={!!errors.date_of_birth}
              helperText={errors.date_of_birth}
              disabled={isLoading}
              InputLabelProps={{
                shrink: true,
              }}
            />
            
            <FormControl 
              fullWidth 
              margin="normal" 
              error={!!errors.age_group_id}
              disabled={isLoading}
            >
              <InputLabel id="age-group-label">Age Group</InputLabel>
              <Select
                labelId="age-group-label"
                id="age_group_id"
                name="age_group_id"
                value={formData.age_group_id}
                label="Age Group"
                onChange={handleInputChange}
              >
                <MenuItem value={1}>8-10 years</MenuItem>
                <MenuItem value={2}>11-13 years</MenuItem>
                <MenuItem value={3}>14-16 years</MenuItem>
                <MenuItem value={4}>17-18 years</MenuItem>
              </Select>
              {errors.age_group_id && (
                <FormHelperText>{errors.age_group_id}</FormHelperText>
              )}
            </FormControl>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              If you're under 13, please make sure to have a parent or guardian help you with registration!
            </Typography>
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
            Create Account
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Join the DSAngels community and start your coding adventure!
          </Typography>
          
          <Stepper activeStep={activeStep} sx={{ width: '100%', mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
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
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : "Create Account"}
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
          
          <Box sx={{ mt: 4, width: '100%', textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" color="secondary">
                Log In
              </Link>
            </Typography>
          </Box>
          
          <Box sx={{ mt: 2, width: '100%', textAlign: 'center' }}>
            <Typography variant="body2">
              Parent registering for a child?{' '}
              <Link component={RouterLink} to="/register/parent" color="secondary">
                Parent Registration
              </Link>
            </Typography>
          </Box>
          
          <Box sx={{ mt: 2, width: '100%', textAlign: 'center' }}>
            <Typography variant="body2">
              Want to be a mentor?{' '}
              <Link component={RouterLink} to="/register/mentor" color="secondary">
                Mentor Registration
              </Link>
            </Typography>
          </Box>
        </StyledPaper>
      </Box>
    </Container>
  );
};

export default RegisterPage;