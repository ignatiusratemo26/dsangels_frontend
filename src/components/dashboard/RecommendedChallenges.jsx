import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Tab, Tabs, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { Code, AutoStories } from '@mui/icons-material';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const RecommendedChallenges = ({ challenges, concepts }) => {
  const theme = useTheme();
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange}
        sx={{
          '& .MuiTabs-indicator': {
            backgroundColor: theme.palette.secondary.main,
          },
        }}
      >
        <Tab 
          icon={<Code />} 
          label="Challenges" 
          sx={{
            '&.Mui-selected': {
              color: theme.palette.secondary.main,
            },
          }}
        />
        <Tab 
          icon={<AutoStories />} 
          label="Concept Notes" 
          sx={{
            '&.Mui-selected': {
              color: theme.palette.secondary.main,
            },
          }}
        />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        {challenges && challenges.length > 0 ? (
          challenges.map((challenge) => (
            <Box
              key={challenge.id}
              component={Link}
              to={`/app/challenges/${challenge.id}`}
              sx={{
                display: 'block',
                textDecoration: 'none',
                mb: 2,
                p: 2,
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                },
              }}
            >
              <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
                {challenge.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {challenge.problem_statement.substring(0, 100)}...
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    bgcolor: theme.palette.primary.light, 
                    color: theme.palette.primary.contrastText,
                    px: 1,
                    py: 0.5,
                    borderRadius: 1
                  }}
                >
                  Difficulty: {challenge.difficulty_base}/5
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    bgcolor: theme.palette.secondary.light, 
                    color: theme.palette.secondary.contrastText,
                    px: 1,
                    py: 0.5,
                    borderRadius: 1
                  }}
                >
                  {challenge.points} points
                </Typography>
              </Box>
            </Box>
          ))
        ) : (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography color="text.secondary">No challenges found</Typography>
          </Box>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {concepts && concepts.length > 0 ? (
          concepts.map((concept) => (
            <Box
              key={concept.id}
              component={Link}
              to={`/app/learning/${concept.id}`}
              sx={{
                display: 'block',
                textDecoration: 'none',
                mb: 2,
                p: 2,
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                },
              }}
            >
              <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
                {concept.title}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.info.main, mb: 1 }}>
                {concept.concept}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {concept.content.substring(0, 120)}...
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                  Reading level: {concept.reading_level}
                </Typography>
                {concept.themed_explanation && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      bgcolor: theme.palette.secondary.light, 
                      color: theme.palette.secondary.contrastText,
                      px: 1,
                      py: 0.5,
                      borderRadius: 1
                    }}
                  >
                    Themed: {concept.theme}
                  </Typography>
                )}
              </Box>
            </Box>
          ))
        ) : (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography color="text.secondary">No concept notes found</Typography>
          </Box>
        )}
      </TabPanel>
    </Box>
  );
};

RecommendedChallenges.propTypes = {
  challenges: PropTypes.array.isRequired,
  concepts: PropTypes.array.isRequired
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default RecommendedChallenges;