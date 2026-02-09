import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import WorkoutGenerator from './pages/WorkoutGenerator';
import DietGenerator from './pages/DietGenerator';
import ExerciseLibrary from './pages/ExerciseLibrary';
import Progress from './pages/Progress';
import Chat from './pages/Chat';
import MyWorkouts from './pages/MyWorkouts';
import LiveCoach from './pages/LiveCoach';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import PhotoComparison from './pages/PhotoComparison';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, needsOnboarding } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 flex items-center justify-center">
        <div className="text-white text-2xl font-bold">Carregando...</div>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/login" />;
  if (needsOnboarding) return <Navigate to="/onboarding" />;
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Home />} />
            <Route path="live-coach" element={<LiveCoach />} />
            <Route path="workout" element={<WorkoutGenerator />} />
            <Route path="diet" element={<DietGenerator />} />
            <Route path="exercises" element={<ExerciseLibrary />} />
            <Route path="progress" element={<Progress />} />
            <Route path="chat" element={<Chat />} />
            <Route path="my-workouts" element={<MyWorkouts />} />
            <Route path="profile" element={<Profile />} />
            <Route path="photos" element={<PhotoComparison />} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;