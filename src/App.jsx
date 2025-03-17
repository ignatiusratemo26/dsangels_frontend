import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Theme
import girlsTechTheme from './assets/themes/girlsTechTheme';

// Contexts
import { AuthProvider } from './contexts/AuthContext';

// Layout
import MainLayout from './components/layout/MainLayout';

// Pages
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
// import RegisterParentPage from './pages/RegisterParent';
// import RegisterMentorPage from './pages/RegisterMentor';
import DashboardPage from './pages/Dashboard';
import ProfilePage from './pages/Profile';
import ChallengesPage from './pages/Challenges';
import ChallengePage from './pages/Challenge';
import LearningPage from './pages/Learning';
import ConceptPage from './pages/Concept';
import BadgesPage from './pages/Badges';
import LeaderboardPage from './pages/Leaderboard';
import ForumPage from './pages/Forum';
import TopicPage from './pages/Topic';
// import MentorsPage from './pages/Mentors';
// import RoleModelsPage from './pages/RoleModels';
import NotFoundPage from './pages/NotFound';

// Route guard component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={girlsTechTheme}>
        <CssBaseline />
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* <Route path="/register/parent" element={<RegisterParentPage />} />
            <Route path="/register/mentor" element={<RegisterMentorPage />} /> */}
            
            {/* Protected routes */}
            <Route path="/app" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="challenges" element={<ChallengesPage />} />
              <Route path="challenges/:id" element={<ChallengePage />} />
              <Route path="learning" element={<LearningPage />} />
              <Route path="learning/:id" element={<ConceptPage />} />
              <Route path="badges" element={<BadgesPage />} />
              <Route path="leaderboard" element={<LeaderboardPage />} />
              <Route path="forum" element={<ForumPage />} />
              <Route path="forum/topics/:id" element={<TopicPage />} />
              {/* <Route path="mentors" element={<MentorsPage />} />
              <Route path="role-models" element={<RoleModelsPage />} /> */}
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;