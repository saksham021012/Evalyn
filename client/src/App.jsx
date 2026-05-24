import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import NewSessionPage from './pages/NewSessionPage';
import InterviewPage from './pages/InterviewPage';
import ResultsPage from './pages/ResultsPage';
import InterviewCompletedPage from './pages/InterviewCompletedPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import OpenRoute from './components/auth/OpenRoute';

import HistoryPage from './pages/HistoryPage';
import ResumesPage from './pages/ResumesPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={
                    <OpenRoute>
                        <LoginPage />
                    </OpenRoute>
                } />
                <Route path="/signup" element={
                    <OpenRoute>
                        <SignupPage />
                    </OpenRoute>
                } />
                <Route path="/forgot-password" element={
                    <OpenRoute>
                        <ForgotPasswordPage />
                    </OpenRoute>
                } />

                {/* Protected Routes */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                } />
                <Route path="/interviews" element={
                    <ProtectedRoute>
                        <HistoryPage />
                    </ProtectedRoute>
                } />
                <Route path="/resumes" element={
                    <ProtectedRoute>
                        <ResumesPage />
                    </ProtectedRoute>
                } />
                <Route path="/new-session" element={
                    <ProtectedRoute>
                        <NewSessionPage />
                    </ProtectedRoute>
                } />
                <Route path="/interview" element={
                    <ProtectedRoute>
                        <InterviewPage />
                    </ProtectedRoute>
                } />
                <Route path="/interview/completed/:sessionId" element={
                    <ProtectedRoute>
                        <InterviewCompletedPage />
                    </ProtectedRoute>
                } />
                <Route path="/interview/results/:sessionId" element={
                    <ProtectedRoute>
                        <ResultsPage />
                    </ProtectedRoute>
                } />
            </Routes>
        </Router>
    );
}

export default App;
