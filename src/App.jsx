import './App.css'
import Forgot from './Pages/Forgot';
import Reset from './Pages/Reset';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Home from "./Pages/Home";
import Upload from "./Pages/Upload";
import Favorites from './Pages/Favorites';
import Library from './Pages/Library';
import Genre from './Pages/Genre';
import AdminReview from './Pages/AdminReview';
import PageNotFound from './Pages/Pagenotfound';
import Layout from './Components/Layout';
import AdminRoute from './Components/AdminRoute';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Provider } from 'react-redux';
import store from './store/store';
import SongDetails from './Components/SongDetails/SongDetails';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

function AppContent() {
  const { resolvedTheme } = useTheme();
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="song/:id" element={<SongDetails />} />
            <Route path="upload" element={<Upload />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="library" element={<Library />} />
            <Route path="genre/:genre" element={<Genre />} />
            <Route
              path="admin/review"
              element={
                <AdminRoute>
                  <AdminReview />
                </AdminRoute>
              }
            />
          </Route>
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="forgot" element={<Forgot />} />
          <Route path="reset" element={<Reset />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </ThemeProvider>
  );
}

export default App;
