import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import bcrypt from 'bcryptjs';
import googleIcon from '../../pages/login/google.png';

const Container = styled.div`
  padding: 40px;
  border-radius: 20px;
  border: 8px solid transparent;
  box-shadow: -5px -5px 15px rgba(255, 255, 255, 0.1),
    5px 5px 15px rgba(0, 0, 0, 0.35),
    inset -5px -5px 15px rgba(255, 255, 255, 0.1),
    inset 5px 5px 15px rgba(0, 0, 0, 0.35);
  background: #223243;
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

const GoogleIcon = styled.img`
  width: 20px;
  height: 20px;
`;

const Paragraph = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75em;
  font-weight: 300;

  a {
    font-weight: 500;
    color: #fff;
    cursor: pointer;
  }
`;

const MobileInputBox = styled.div`
  position: relative;
  width: 300px;
  margin-top: 20px;
`;

const MobileSubmitButton = styled.input`
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

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [googleUser, setGoogleUser] = useState(null);
  const [mobileExistsError, setMobileExistsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!mobileExistsError) return;

    const timer = setTimeout(() => {
      setMobileExistsError(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [mobileExistsError]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, hashedPassword);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        mobile,
        adminKey,
      });
      alert('User created successfully');
      navigate('/admin'); // Redirect to admin dashboard
    } catch (error) {
      console.error('Error signing up:', error);
      alert(error.message);
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      // Check if user exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
  
      if (!userDocSnap.exists()) {
        // If user does not exist, create a new document in Firestore
        await setDoc(userDocRef, {
          name: user.displayName,
          email: user.email,
          mobile: '', // Handle mobile number if needed
          adminKey: '', // Handle admin key if needed
        });
        setGoogleUser(user);
      } else {
        alert('User signed up with Google successfully');
        navigate('/admin'); // Redirect to admin dashboard
      }
    } catch (error) {
      console.error('Error signing up with Google:', error);
      alert(error.message); // Display error message to the user
    }
  };

  const handleGoogleMobileSubmit = async () => {
    if (!googleUser) return;

    try {
      // Check if mobile number already exists in Firestore
      const querySnapshot = await getDocs(query(db, 'users', where('mobile', '==', mobile)));
      if (!querySnapshot.empty) {
        setMobileExistsError(true);
        return;
      }

      const userDocRef = doc(db, 'users', googleUser.uid);
      await updateDoc(userDocRef, {
        mobile,
      });
      alert('Mobile number added successfully');
      navigate('/admin'); // Redirect to admin dashboard
    } catch (error) {
      console.error('Error updating mobile number:', error);
      alert(error.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevShowConfirmPassword) => !prevShowConfirmPassword);
  };

  return (
    <Container>
      <Form onSubmit={handleSignUp}>
        <h2>Sign Up</h2>
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
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Icon className="fa-solid fa-lock"></Icon>
          <Span>Password</Span>
          <EyeIcon
            className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
            onClick={togglePasswordVisibility}
          ></EyeIcon>
        </InputBox>
        <InputBox>
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Icon className="fa-solid fa-lock"></Icon>
          <Span>Confirm Password</Span>
          <EyeIcon
            className={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}
            onClick={toggleConfirmPasswordVisibility}
          ></EyeIcon>
        </InputBox>
        <InputBox>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Icon className="fa-regular fa-user"></Icon>
          <Span>Name</Span>
        </InputBox>
        <InputBox>
          <Input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />
          <Icon className="fa-regular fa-mobile"></Icon>
          <Span>Mobile</Span>
        </InputBox>
        <InputBox>
          <Input
            type="text"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            required
          />
          <Icon className="fa-solid fa-key"></Icon>
          <Span>Admin Key</Span>
        </InputBox>
        <SubmitButton type="submit" value="Sign Up" />
        <GoogleButton onClick={handleGoogleSignUp}>
          <GoogleIcon src={googleIcon} alt="Google icon" /> Sign Up with Google
        </GoogleButton>
        <Paragraph>
          Already have an account?{' '}
          <a href="/signin" onClick={(e) => {e.preventDefault();
            navigate('/signin');
          }}>
            Sign In
          </a>
        </Paragraph>
      </Form>
      {googleUser && (
        <Form>
          <MobileInputBox>
            <Input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
            <Icon className="fa-regular fa-mobile"></Icon>
            <Span>Mobile</Span>
          </MobileInputBox>
          <MobileSubmitButton
            type="button"
            value="Submit Mobile Number"
            onClick={handleGoogleMobileSubmit}
          />
          {mobileExistsError && (
            <Paragraph style={{ color: 'red' }}>
              This mobile number is already in use. Please choose a different one.
            </Paragraph>
          )}
        </Form>
      )}
    </Container>
  );
};

export default SignUp;
