import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { onAuthStateChanged, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import bcrypt from 'bcryptjs';

const Container = styled.div`
  padding: 40px;
  background-color: #f7f7f7;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    padding: 20px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const Header = styled.h1`
  margin-bottom: 20px;
  font-size: 2em;

  @media (max-width: 768px) {
    font-size: 1.5em;
  }

  @media (max-width: 480px) {
    font-size: 1.2em;
  }
`;

const Section = styled.div`
  width: 100%;
  max-width: 600px;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;

  @media (max-width: 768px) {
    padding: 15px;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    padding: 10px;
    border-radius: 5px;
  }
`;

const SectionTitle = styled.h2`
  margin-bottom: 10px;
  font-size: 1.5em;

  @media (max-width: 768px) {
    font-size: 1.2em;
  }

  @media (max-width: 480px) {
    font-size: 1em;
  }
`;

const SectionContent = styled.p`
  margin-bottom: 20px;
  color: #666;
  font-size: 1em;

  @media (max-width: 768px) {
    font-size: 0.9em;
    margin-bottom: 15px;
  }

  @media (max-width: 480px) {
    font-size: 0.8em;
    margin-bottom: 10px;
  }
`;

const EditButton = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    border-radius: 3px;
  }
`;

const PasswordContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 1em;
  width: calc(100% - 40px);
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;

  @media (max-width: 768px) {
    font-size: 0.9em;
  }

  @media (max-width: 480px) {
    font-size: 0.8em;
  }
`;

const EyeButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background-color: transparent;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #f7f7f7;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.9em;
  margin-top: -10px;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 0.8em;
  }

  @media (max-width: 480px) {
    font-size: 0.7em;
  }
`;

const SuccessMessage = styled.p`
  color: green;
  font-size: 0.9em;
  margin-top: -10px;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 0.8em;
  }

  @media (max-width: 480px) {
    font-size: 0.7em;
  }
`;

const LoginSecurityPage = () => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reenterPassword, setReenterPassword] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // eslint-disable-next-line
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [isTwoStepVerificationEnabled, setIsTwoStepVerificationEnabled] = useState(false);
  const [twoStepVerificationCode, setTwoStepVerificationCode] = useState('');
  const [twoStepVerificationError, setTwoStepVerificationError] = useState('');
  const [managedDevices, setManagedDevices] = useState([]);
  const [managedDevicesError, setManagedDevicesError] = useState('');

  const generateTwoStepVerificationCode = useCallback(async () => {
    // Generate a random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000);
    return code.toString();
  }, []);

  const handleTwoStepVerificationToggle = useCallback(async () => {
    if (isTwoStepVerificationEnabled) {
      // Disable two-step verification
      try {
        await updateDoc(doc(db, "users", auth.currentUser.uid), { twoStepVerificationEnabled: false });
        setIsTwoStepVerificationEnabled(false);
      } catch (error) {
        console.error("Error disabling two-step verification:", error);
      }
    } else {
      // Enable two-step verification
      try {
        const user = auth.currentUser;
        if (!user) {
          setTwoStepVerificationError("No user is signed in");
          return;
        }
  
        const currentPassword = currentPasswordInput; // Get the current password from the state variable
        const hashedPassword = await bcrypt.hash(currentPassword, 10);
        const credential = EmailAuthProvider.credential(user.email, hashedPassword);
  
        await reauthenticateWithCredential(user, credential);
  
        const twoStepVerificationCode = await generateTwoStepVerificationCode();
        setTwoStepVerificationCode(twoStepVerificationCode);
  
        await updateDoc(doc(db, "users", auth.currentUser.uid), { twoStepVerificationEnabled: true, twoStepVerificationCode });
        setIsTwoStepVerificationEnabled(true);
      } catch (error) {
        console.error("Error enabling two-step verification:", error);
        setTwoStepVerificationError("Failed to enable two-step verification. Please try again.");
      }
    } // eslint-disable-next-line
  }, [currentPasswordInput, isTwoStepVerificationEnabled, generateTwoStepVerificationCode]);

  const handleTwoStepVerificationCodeInput = useCallback((event) => {
    setTwoStepVerificationCode(event.target.value);
  }, []);

  const handleTwoStepVerificationCodeSubmit = useCallback(async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setTwoStepVerificationError("No user is signed in");
        return;
      }

      if (twoStepVerificationCode!== user.twoStepVerificationCode) {
        setTwoStepVerificationError("Invalid two-step verification code");
        return;
      }

      // Two-step verification code is valid, allow login
      setTwoStepVerificationError('');
    } catch (error) {
      console.error("Error verifying two-step verification code:", error);
      setTwoStepVerificationError("Failed to verify two-step verification code. Please try again.");
    }
  }, [twoStepVerificationCode]);

  

  const loadUserData = useCallback(async (uid) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setName(userData.name);
        setEmail(userData.email);
        setPhone(userData.phone);
        setPassword(userData.password); // Store hashed password
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);

  const loadManagedDevices = useCallback(async (uid) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setManagedDevices(userData.managedDevices || []);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching managed devices:", error);
      setManagedDevicesError("Failed to fetch managed devices. Please try again.");
    }
  }, []);

  const removeDevice = useCallback(async (deviceId) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setManagedDevicesError("No user is signed in");
        return;
      }

      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        managedDevices: user.managedDevices.filter((device) => device.deviceId !== deviceId),
      });

      loadManagedDevices(user.uid);
    } catch (error) {
      console.error("Error removing device:", error);
      setManagedDevicesError("Failed to remove device. Please try again.");
    }
  }, [loadManagedDevices]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        loadUserData(user.uid);
        loadManagedDevices(user.uid);
      }
    });
    return () => unsubscribe();
  }, [loadUserData, loadManagedDevices]);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        loadUserData(user.uid);
      }
    });
    return () => unsubscribe();
  }, [loadUserData]);

  

  const handleSaveClick = useCallback(async (setter, field, value) => {
    setter(false);
    try {
      const docRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(docRef, { [field]: value });
      loadUserData(auth.currentUser.uid); // Refresh user data after update
    } catch (error) {
      console.error("Error updating document:", error);
    }
  }, [loadUserData]);

  const handlePasswordSaveClick = useCallback(async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setErrorMessage("No user is signed in");
        return;
      }

      if (newPassword !== reenterPassword) {
        setErrorMessage("New passwords do not match");
        return;
      }

 // eslint-disable-next-line
   const hashedPassword = await bcrypt.hash(newPassword, 10);

      const credential = EmailAuthProvider.credential(user.email, currentPasswordInput);
      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);
      
      setErrorMessage("");
      setSuccessMessage("Password updated successfully!");
      setIsEditingPassword(false);
    } catch (error) {
      console.error("Error updating password:", error);
      setErrorMessage("Failed to update password. Please try again.");
    }
  }, [currentPasswordInput, newPassword, reenterPassword]);

  const validateInput = (input, fieldType) => {
    if (input.trim() === "") {
      return "This field cannot be empty";
    }
    if (input.length < 3) {
      return "Input must be at least 3 characters long";
    }
    if (fieldType === 'email' && !/\S+@\S+\.\S+/.test(input)) {
      return "Invalid email format";
    }
    if (fieldType === 'phone' && !/^\d{10}$/.test(input)) {
      return "Invalid phone number format";
    }
    return "";
  };
  

  return (
    <Container>
      <Header>Login and Security</Header>

      <Section>
        <SectionTitle>Name</SectionTitle>
        {isEditingName ? (
          <div>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <EditButton onClick={() => handleSaveClick(setIsEditingName, 'name', name)}>Save</EditButton>
            {validateInput(name) && <ErrorMessage>{validateInput(name)}</ErrorMessage>}
          </div>
        ) : (
          <div>
            <SectionContent>{name}</SectionContent>
            <EditButton onClick={() => setIsEditingName(true)}>Edit</EditButton>
          </div>
        )}
      </Section>

      <Section>
        <SectionTitle>Email</SectionTitle>
        {isEditingEmail ? (
          <div>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <EditButton onClick={() => handleSaveClick(setIsEditingEmail, 'email', email)}>Save</EditButton>
            {validateInput(email) && <ErrorMessage>{validateInput(email)}</ErrorMessage>}
          </div>
        ) : (
          <div>
            <SectionContent>{email}</SectionContent>
            <EditButton onClick={() => setIsEditingEmail(true)}>Edit</EditButton>
          </div>
        )}
      </Section>

      <Section>
        <SectionTitle>Primary mobile number</SectionTitle>
        {isEditingPhone ? (
          <div>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <EditButton onClick={() => handleSaveClick(setIsEditingPhone, 'phone', phone)}>Save</EditButton>
            {validateInput(phone) && <ErrorMessage>{validateInput(phone)}</ErrorMessage>}
          </div>
        ) : (
          <div>
            <SectionContent>{phone}</SectionContent>
            <EditButton onClick={() => setIsEditingPhone(true)}>Edit</EditButton>
          </div>
        )}
      </Section>

      <Section>
        <SectionTitle>Password</SectionTitle>
        {isEditingPassword ? (
          <div>
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
            <PasswordContainer>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Current Password"
                value={currentPasswordInput}
                onChange={(e) => setCurrentPasswordInput(e.target.value)}
              />
              <EyeButton onClick={() => setShowPassword(!showPassword)}>
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </EyeButton>
            </PasswordContainer>
            <PasswordContainer>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </PasswordContainer>
            <PasswordContainer>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter New Password"
                value={reenterPassword}
                onChange={(e) => setReenterPassword(e.target.value)}
              />
              <EyeButton onClick={() => setShowPassword(!showPassword)}>
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </EyeButton>
            </PasswordContainer>
            <EditButton onClick={handlePasswordSaveClick}>Save</EditButton>
          </div>
        ) : (
          <div>
            <SectionContent>********</SectionContent>
            <EditButton onClick={() => setIsEditingPassword(true)}>Edit</EditButton>
          </div>
        )}
      </Section>

      <Section>
        <SectionTitle>2-step verification</SectionTitle>
        {isTwoStepVerificationEnabled? (
          <div>
            <SectionContent>Two-step verification is enabled.</SectionContent>
            <Input
              type="text"
              value={twoStepVerificationCode}
              onChange={handleTwoStepVerificationCodeInput}
              placeholder="Enter two-step verification code"
            />
            <EditButton onClick={handleTwoStepVerificationCodeSubmit}>Verify</EditButton>
             {twoStepVerificationError && <ErrorMessage>{twoStepVerificationError}</ErrorMessage>}
              </div>
                ) : (
               <div>
            <SectionContent>Add a layer of security. Require a code in addition to your password.</SectionContent>
            <EditButton onClick={handleTwoStepVerificationToggle}>Turn on</EditButton>
          </div>
        )}
      </Section>

      <Section>
        <SectionTitle>Manage Devices</SectionTitle>
        {managedDevicesError && <ErrorMessage>{managedDevicesError}</ErrorMessage>}
        {managedDevices.length === 0 ? (
          <SectionContent>No devices found.</SectionContent>
        ) : (
          <ul>
            {managedDevices.map((device) => (
              <li key={device.deviceId}>
                <SectionContent>
                  {device.deviceName} ({device.browserName} on {device.osName})
                </SectionContent>
                <EditButton onClick={() => removeDevice(device.deviceId)}>Remove</EditButton>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section>
        <SectionTitle>Compromised account?</SectionTitle>
        <SectionContent>Take steps like changing your password and signing out everywhere.</SectionContent>
        <EditButton>Start</EditButton>
      </Section>

      <Link to="/account">Return to Account</Link>
    </Container>
  );
};

export default LoginSecurityPage;
