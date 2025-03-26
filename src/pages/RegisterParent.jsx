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
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Visibility, 
  VisibilityOff, 
  HelpOutline as HelpIcon,
  Info as InfoIcon,
  ChildCare as ChildIcon,
  AccountCircle as AccountIcon,
  Security as SecurityIcon,
  Person as PersonIcon
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

const RegisterParentPage = () => {
  const navigate = useNavigate();
  const { registerParent } = useAuth();
  
  // State for steps
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Parent Info', 'Account Security', 'Child Info'];
  
  // Form state
  const [formData, setFormData] = useState({
    // Parent info
    username: '',
    email: '',
    name: '',
    password: '',
    password2: '',
    
    // Child info
    child_username: '',
    child_email: '',
    child_age_group: '',
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
      // Validate parent info
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
      
      if (!formData.name.trim()) {
        newErrors.name = 'Display name is required';
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
      // Validate child info
      if (!formData.child_username.trim()) {
        newErrors.child_username = 'Child username is required';
        isValid = false;
      } else if (formData.child_username.length < 3) {
        newErrors.child_username = 'Child username must be at least 3 characters';
        isValid = false;
      }
      
      if (formData.child_email && !/\S+@\S+\.\S+/.test(formData.child_email)) {
        newErrors.child_email = 'Email address is invalid';
        isValid = false;
      }
      
      if (!formData.child_age_group) {
        newErrors.child_age_group = 'Age group is required';
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
      
      // Convert age_group from string to integer
      const parentData = {
        // ...formData,
        // child_age_group: parseInt(formData.child_age_group)
        user: {
          username: formData.cchild_username,
          email: formData.email,
          name: formData.name,
          password: formData.password,
          password2: formData.password2,
        },
        // Child data
        child_username: formData.child_username,
        child_email: formData.child_email || formData.email, // Use parent email as fallback
        child_age_group: parseInt(formData.child_age_group)
      };
      
      await registerParent(parentData);
      
      // Show success notification and redirect
      navigate('/app');
    } catch (err) {
      console.error('Parent registration error:', err);
      
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
              Parent Information
            </SectionTitle>
            
            <Alert severity="info" sx={{ mb: 3, width: '100%' }}>
              <Typography variant="body2">
                As a parent, you'll have special access to monitor your child's progress and manage their account settings.
              </Typography>
            </Alert>
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Parent Username"
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
              label="Parent Email Address"
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
              label="Parent Display Name"
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
              <ChildIcon color="primary" />
              Child Information
            </SectionTitle>
            
            <Alert severity="info" sx={{ mb: 3, width: '100%' }}>
              <Typography variant="body2">
                Create an account for your child. You'll be able to monitor their progress and ensure their safety.
              </Typography>
            </Alert>
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="child_username"
              label="Child's Username"
              name="child_username"
              value={formData.child_username}
              onChange={handleInputChange}
              error={!!errors.child_username}
              helperText={errors.child_username || "This is the username your child will use to log in"}
              disabled={isLoading}
            />
            
            <TextField
              margin="normal"
              fullWidth
              id="child_email"
              label="Child's Email (Optional)"
              name="child_email"
              value={formData.child_email}
              onChange={handleInputChange}
              error={!!errors.child_email}
              helperText={errors.child_email}
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="This is optional. If not provided, your email will be used for both accounts.">
                      <HelpIcon color="action" fontSize="small" />
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
            
            <FormControl 
              fullWidth 
              margin="normal" 
              error={!!errors.child_age_group}
              disabled={isLoading}
              required
            >
              <InputLabel id="child-age-group-label">Child's Age Group</InputLabel>
              <Select
                labelId="child-age-group-label"
                id="child_age_group"
                name="child_age_group"
                value={formData.child_age_group}
                label="Child's Age Group"
                onChange={handleInputChange}
              >
                <MenuItem value={1}>8-10 years</MenuItem>
                <MenuItem value={2}>11-13 years</MenuItem>
                <MenuItem value={3}>14-16 years</MenuItem>
                <MenuItem value={4}>17-18 years</MenuItem>
              </Select>
              {errors.child_age_group && (
                <FormHelperText>{errors.child_age_group}</FormHelperText>
              )}
            </FormControl>
            
            <Alert severity="warning" sx={{ mt: 3, width: '100%' }}>
              <Typography variant="body2">
                By creating an account, you acknowledge that you are the parent or legal guardian of this child and consent to their use of DSAngels in accordance with our <Link component={RouterLink} to="/terms" color="secondary">Terms of Service</Link> and <Link component={RouterLink} to="/privacy" color="secondary">Privacy Policy</Link>.
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
            Parent Registration
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Register as a parent to create and manage your child's account
          </Typography>
          
          <Stepper activeStep={activeStep} sx={{ width: '100%', mb: 4 }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel 
                  StepIconComponent={(props) => (
                    <StepIcon {...props}>
                      {index === 0 ? <PersonIcon /> : 
                       index === 1 ? <SecurityIcon /> : 
                       <ChildIcon />}
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
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : "Create Parent Account"}
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
              Registering for yourself?{' '}
              <Link component={RouterLink} to="/register" color="secondary">
                Standard Registration
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

export default RegisterParentPage;