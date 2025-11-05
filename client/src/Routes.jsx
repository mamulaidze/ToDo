// src/AppRoutes.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Tasks from "./pages/Tasks";
import AddTasks from "./pages/AddTasks";
import CompletedTask from "./pages/CompletedTask";
import Login from "./pages/Login";          // ✅ added
import Register from "./pages/Register";    // ✅ added
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ added
import { AuthProvider } from "./context/AuthContext";    // ✅ added

function NotFound() {
  return <div>404 - Page Not Found</div>;
}

export default function AppRoutes() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />


          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-task"
            element={
              <ProtectedRoute>
                <AddTasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/completed-tasks"
            element={
              <ProtectedRoute>
                <CompletedTask />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
