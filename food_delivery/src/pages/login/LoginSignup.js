import React, { useState } from 'react';
import styled from 'styled-components';
import SignIn from './SignIn';
import SignUp from './SignUp';

const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background: #223243;
  overflow: hidden;
`;

const Box = styled.div`
  position: relative;
  width: 500px;
  height: 500px;
  border-radius: 20px;
  background: #223243;
  box-shadow: 15px 15px 30px rgba(0, 0, 0, 0.5), -15px -15px 30px rgba(0, 0, 0, 0.5);
`;

const InnerBox = styled.div`
  position: absolute;
  top: -50px;
  left: 100px;
  width: 400px;
  height: 500px;
  border-radius: 20px;
  background: #223243;
  box-shadow: -5px -5px 15px rgba(255, 255, 255, 0.1),
    5px 5px 15px rgba(0, 0, 0, 0.35),
    inset -5px -5px 15px rgba(255, 255, 255, 0.1),
    inset 5px 5px 15px rgba(0, 0, 0, 0.35);
`;

const LoginSignUp = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <MainContainer>
      <Box>
        <InnerBox>
          {isSignIn ? (
            <SignIn setIsSignIn={setIsSignIn} />
          ) : (
            <SignUp setIsSignIn={setIsSignIn} />
          )}
        </InnerBox>
      </Box>
    </MainContainer>
  );
};

export default LoginSignUp;
