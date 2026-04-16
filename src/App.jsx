import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './store';
import Navbar from './components/Layout/Navbar';

import Home from './pages/Home';
import Login from './pages/Auth/Login';
import DashboardLayout from './components/Layout/DashboardLayout';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminCourses from './pages/Admin/Courses';
import AdminStudents from './pages/Admin/Students';
import AdminLeaves from './pages/Admin/Leaves';
import StudentDashboard from './pages/Student/Dashboard';
import StudentCourses from './pages/Student/Courses';
import StudentLeaves from './pages/Student/Leaves';
import PublicCourses from './pages/PublicCourses';
import AdmissionForm from './pages/AdmissionForm';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
          <Navbar />
          <main className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/courses" element={<PublicCourses />} />
              <Route path="/registration" element={<AdmissionForm />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<DashboardLayout role="admin" />}>
                <Route index element={<AdminDashboard />} />
                <Route path="courses" element={<AdminCourses />} />
                <Route path="students" element={<AdminStudents />} />
                <Route path="leaves" element={<AdminLeaves />} />
              </Route>

              {/* Student Routes */}
              <Route path="/student" element={<DashboardLayout role="student" />}>
                <Route index element={<StudentDashboard />} />
                <Route path="leaves" element={<StudentLeaves />} />
              </Route>
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
