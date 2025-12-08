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

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
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
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;