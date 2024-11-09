// SignIn.test.js

import { render, fireEvent } from '@testing-library/react';
import SignIn from './SignInForm';

test('displays an error message when an invalid email address is entered', async () => {
  const { getByLabelText, getByText } = render(<SignIn />);

  const emailInput = getByLabelText('Email address');
  fireEvent.change(emailInput, 'invalid-email@example.com');

  const submitButton = getByText('Sign In');
  fireEvent.click(submitButton);

  const errorMessage = getByText('Please enter a valid email address.');
  expect(errorMessage).toBeInTheDocument();
});// SignIn.test.js

test('should prevent sign-in when password is less than 8 characters', async () => {
  const { getByLabelText, getByText } = render(<SignIn />);

  const emailInput = getByLabelText('Email address');
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

  const passwordInput = getByLabelText('Password');
  fireEvent.change(passwordInput, { target: { value: 'short' } });

  const submitButton = getByText('Sign In');
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(getByText('Password must be at least 8 characters')).toBeInTheDocument();
  });
});

test('should display a confirmation message when the user resets their password', async () => {
  const { getByLabelText, getByText } = render(<SignIn />);

  const emailInput = getByLabelText('Email address');
  fireEvent.change(emailInput, 'user@example.com');

  const resetPasswordButton = getByText('Reset Password');
  fireEvent.click(resetPasswordButton);

  await waitFor(() => {
    expect(getByText('Password reset email sent. Please check your inbox.')).toBeInTheDocument();
  });
});

test('should not allow sign-in when the email address is not registered', async () => {
  const { getByLabelText, getByText } = render(<SignIn />);

  const emailInput = getByLabelText('Email address');
  const passwordInput = getByLabelText('Password');
  const submitButton = getByText('Sign In');

  fireEvent.change(emailInput, 'notRegistered@example.com');
  fireEvent.change(passwordInput, 'password123');
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(getByText('Error signing in:')).toBeInTheDocument();
    expect(getByText('Error signing in:')).toHaveTextContent('Error signing in: The email address is not registered.');
  });
});

test('shows loading spinner while waiting for sign-in process', async () => {
  const { getByText } = render(<SignIn />);

  // Wait for the loading spinner to appear
  const loadingSpinner = getByText('Loading...');
  expect(loadingSpinner).toBeInTheDocument();

  // Wait for the sign-in process to complete
  await waitFor(() => {
    // Check if the loading spinner is no longer in the document
    expect(loadingSpinner).not.toBeInTheDocument();
  });
});

test('should validate password strength during sign-up', () => {
  const { getByLabelText } = render(<SignIn />);

  const passwordInput = getByLabelText('Password');

  // Test with weak password
  fireEvent.change(passwordInput, { target: { value: 'weak' } });
  expect(passwordInput).toHaveClass('password-weak');

  // Test with medium password
  fireEvent.change(passwordInput, { target: { value: 'medium123' } });
  expect(passwordInput).toHaveClass('password-medium');

  // Test with strong password
  fireEvent.change(passwordInput, { target: { value: 'strong123!@#' } });
  expect(passwordInput).toHaveClass('password-strong');
});// Unit test for SignIn component
// File: SignIn.test.js



test('should log out the user when the "log out" button is clicked', () => {
  // Arrange
  const { getByText } = render(<SignIn />);
  const logoutButton = getByText('Log Out');

  // Act
  fireEvent.click(logoutButton);

  // Assert
  // You can add assertions to verify the user has been logged out
  // For example, you can check if the user's state or the application's state has been updated
  // You can use libraries like "jest" for assertions
  // Example: expect(user.isLoggedIn).toBe(false);
});