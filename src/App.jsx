import './App.css'
import Forgot from './Pages/Forgot';
import Reset from './Pages/Reset';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Home from "./Pages/Home";
import PageNotFound from './Pages/Pagenotfound';
import Layout from './Components/Layout';
import {Route, Routes, BrowserRouter as Router} from 'react-router-dom';
import {ToastContainer} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { Provider } from 'react-redux';
import store from './store/store';
import SongDetails from './Components/SongDetails';

function App() {
  return (
    <Provider store={store}>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="song/:id" element={<SongDetails/>}/>
          </Route>
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="forgot" element={<Forgot />} />
          <Route path="reset" element={<Reset />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App