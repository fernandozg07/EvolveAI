import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
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

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
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
  );
};

export default App;