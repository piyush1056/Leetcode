import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './redux/slices/authSlice';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LandingPage from './pages/LandingPage';
import Navbar from './components/Navbar';
import ProblemsPage from './pages/ProblemsPage';
import WorkspacePage from './pages/WorkspacePage/index';
import WorkspaceNavbar from './components/workspace/WorkspaceNavbar'; 
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard';
import ProblemList from './pages/admin/ProblemList';
import UsersList from './pages/admin/UsersList';
import ProblemForm from './components/admin/ProblemForm';
import ProfilePage from './pages/user/ProfilePage';
import SubmissionsPage from './pages/user/SubmissionsPage';
import EditProfilePage from './pages/user/EditProfilePage';
import SolvedProblemsPage from './pages/user/SolvedProblemsPage';
import LeaderboardPage from './pages/user/LeaderboardPage';
import SavedProblemsPage from './pages/user/SavedProblemsPage';
import PublicProfilePage from './pages/user/PublicProfilePage';



const AdminGuard = ({ children }) => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) return <div className="h-screen flex items-center justify-center"><span className="loading loading-spinner"></span></div>;
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppContent() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  

  const isWorkspaceRoute = location.pathname.startsWith('/problem/');
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>

       {!isAdminRoute && (isWorkspaceRoute ? <WorkspaceNavbar /> : <Navbar />)}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <SignupPage /> : <Navigate to="/" />} />

        {/* User Routes */}
        <Route path="/problems" element={isAuthenticated ? <ProblemsPage /> : <LoginPage />} />
        <Route path="/problem/:id" element={isAuthenticated ? <WorkspacePage /> : <LoginPage />} />
        <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <LoginPage />} />
        <Route path="/submissions" element={isAuthenticated ? <SubmissionsPage /> : <LoginPage />} />
        <Route path="/profile/edit" element={isAuthenticated ? <EditProfilePage /> : <LoginPage />} />
        <Route  path="/my-problems/solved" element={isAuthenticated ? <SolvedProblemsPage /> : <LoginPage />} />
        <Route path="/leaderboard" element={isAuthenticated ? <LeaderboardPage /> : <LoginPage />} />
        <Route path="/my-problems/saved" element={isAuthenticated ? <SavedProblemsPage /> : <LoginPage />} />
        <Route path="/user/:userId" element={isAuthenticated ? <PublicProfilePage /> : <LoginPage />} />


        {/*Admin Routes (Nested) */}
        <Route path="/admin" element={
          <AdminGuard>
            <AdminLayout />
          </AdminGuard>
        }>
    
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="problems" element={<ProblemList />} />
            <Route path="users" element={<UsersList />} />
            <Route path="problem/create" element={<ProblemForm />} />
            <Route path="problem/edit/:id" element={<ProblemForm />} />   
        </Route>

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

