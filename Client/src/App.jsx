import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import { useEffect, useRef } from 'react';
import { UserInfo } from './services/auth';
import { AuthStates } from './utils/enums';
import { setUser } from './store/reducers/userReducer';
import { Route, Routes, useNavigate } from 'react-router-dom';
import VerifyEmail from './component/verfiyEmail';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './component/forgetpassword';
import ResetPassword from './component/resetpassword';
import AuthToggle from './pages/AuthToggle';

function App() {

  const { authState, loading } = useSelector((state) => state.user);
  console.log("authState", authState);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const initializeAuth = () => {

      console.log("function invoked")
      dispatch(UserInfo())
    }
    initializeAuth();
  }, [dispatch]);

  useEffect(() => {
    console.log("authstated", authState)
    if (authState === AuthStates.AUTHENTICATED) {
      navigate('/'); 
    }
    else{
      dispatch(setUser({authState: AuthStates.IDLE}))
    }
  }, [authState, navigate]);

  if (loading || authState === AuthStates.INITIALIZING)
    return <p>Loading...</p>;


  return (
    <Routes>
      {authState !== AuthStates.AUTHENTICATED ? (
        <>
          <Route path='/' element={<AuthToggle/>}/>
          <Route path="/verify-email/:verificationToken" element={<VerifyEmail />} />
          <Route path="/forget-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} /> 
        </>
      ) : (
        <>
          <Route path='/' element={<Dashboard />} />
        </>
      )}
    </Routes>
  )
}

export default App
