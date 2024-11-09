import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebaseConfig';
import { signInWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import googleIcon from '../../pages/login/google.png';

const Container = styled.div`
  padding: 40px;
  border-radius: 20px;
  border: 8px solid transparent;
  box-shadow: 
    -5px -5px 15px rgba(255, 255, 255, 0.1),
    5px 5px 15px rgba(0, 0, 0, 0.35),
    inset -5px -5px 15px rgba(255, 255, 255, 0.1),
    inset 5px 5px 15px rgba(0, 0, 0, 0.35);
  background: #223243;
`;

const GoogleIcon = styled.img`
  width: 20px;
  height: 20px;
`;

const Form = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 25px;
  color: #fff;

  h2 {
    font-weight: 500;
    letter-spacing: 0.1em;
  }
`;

const InputBox = styled.div`
  position: relative;
  width: 300px;
`;

const Input = styled.input`
  padding: 12px 10px 12px 48px;
  border: none;
  width: 100%;
  background: #223243;
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #fff;
  font-weight: 300;
  border-radius: 25px;
  font-size: 1em;
  box-shadow: -5px -5px 15px rgba(255, 255, 255, 0.1),
    5px 5px 15px rgba(0, 0, 0, 0.35);
  transition: 0.5s;
  outline: none;

  &:valid ~ span,
  &:focus ~ span {
    color: #00dfc4;
    border: 1px solid #00dfc4;
    background: #223243;
    transform: translateX(25px) translateY(-7px);
    font-size: 0.6em;
    padding: 0 8px;
    border-radius: 10px;
    letter-spacing: 0.1em;
  }

  &:valid,
  &:focus {
    border: 1px solid #00dfc4;
  }
`;

const Span = styled.span`
  position: absolute;
  left: 0;
  padding: 12px 10px 12px 48px;
  pointer-events: none;
  font-size: 1em;
  font-weight: 300;
  transition: 0.5s;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.5);
`;

const Icon = styled.i`
  position: absolute;
  top: 15px;
  left: 16px;
  width: 25px;
  padding: 2px 0;
  padding-right: 8px;
  color: #00dfc4;
  border-right: 1px solid #00dfc4;
`;

const EyeIcon = styled.i`
  position: absolute;
  top: 15px;
  right: 16px;
  cursor: pointer;
  color: #00dfc4;
`;

const SubmitButton = styled.input`
  background: #00dfc4;
  color: #223243;
  padding: 10px 0;
  font-weight: 500;
  cursor: pointer;
  border: none;
  width: 300px;
  border-radius: 25px;
  box-shadow: -5px -5px 15px rgba(255, 255, 255, 0.1),
    5px 5px 15px rgba(0, 0, 0, 0.35),
    inset -5px -5px 15px rgba(255, 255, 255, 0.1),
    inset 5px 5px 15px rgba(0, 0, 0, 0.35);
`;

const GoogleButton = styled.button`
  background: #ffffff;
  color: #223243;
  padding: 10px 0;
  font-weight: 500;
  cursor: pointer;
  border: none;
  width: 300px;
  text-align: center;
  border-radius: 25px;
  box-shadow: -5px -5px 15px rgba(255, 255, 255, 0.1),
    5px 5px 15px rgba(0, 0, 0, 0.35),
    inset -5px -5px 15px rgba(255, 255, 255, 0.1),
    inset 5px 5px 15px rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const Paragraph = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75em;
  font-weight: 300;

  a{
    font-weight: 500;
   color: #fff;
    cursor: pointer;
  }
`;

const usePasswordVisibilityToggle = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return { showPassword, togglePasswordVisibility };
};

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { showPassword, togglePasswordVisibility } = usePasswordVisibilityToggle();
  const debouncedEmail = useDebounce(email, 300);
  const debouncedPassword = useDebounce(password, 300);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, debouncedEmail, debouncedPassword);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists() && userDoc.data().isAdmin) {
        console.log('Admin signed in:', user);
        navigate('/admin');
      } else {
        console.log('User signed in:', user);
        navigate('/');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      alert(error.message);
      throw error;
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists() && userDoc.data().isAdmin) {
        console.log('Admin signed in:', user);
        navigate('/admin');
      } else {
        console.log('User signed in:', user);
        navigate('/');
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      alert(error.message);
      throw error;
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert('Please enter your email address.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, debouncedEmail);
      alert('Password reset email sent. Please check your inbox.');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      alert(error.message);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSignIn}>
        <h2>Sign In</h2>
        <InputBox>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Icon className="fa-regular fa-envelope"></Icon>
          <Span>Email address</Span>
        </InputBox>
        <InputBox>
          <Input
            type={showPassword? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Icon className="fa-solid fa-lock"></Icon>
          <Span>Password</Span>
          <EyeIcon
            className={`fa-solid ${showPassword? 'fa-eye-slash' : 'fa-eye'}`}
            onClick={togglePasswordVisibility}
          ></EyeIcon>
        </InputBox>
        <SubmitButton type="submit" value="Sign In" />
        <GoogleButton onClick={handleGoogleSignIn}>
        <GoogleIcon src={googleIcon} alt="Google icon" /> Log In with Google
        </GoogleButton>
        <Paragraph>
          Forgot password?{' '}
          <span onClick={handleForgotPassword} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
            Reset Password
          </span>
        </Paragraph>
        <Paragraph>
          Don't have an account?{' '}
          <span onClick={() => navigate('/signup')} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
            Sign Up
          </span>
        </Paragraph>
      </Form>
    </Container>
  );
};

export default SignIn;
