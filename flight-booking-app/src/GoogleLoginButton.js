import React from 'react';
import { GoogleLogin } from 'react-google-login';

const GoogleLoginButton = () => {
  const responseGoogleSuccess = (response) => {
    console.log('Login Success:', response);
    // Handle successful login, e.g., send token to backend for authentication
  };

  const responseGoogleFailure = (error) => {
    console.error('Login Failed:', error);
    // Handle login failure
  };

  return (
    <GoogleLogin
      clientId="343868580934-ul2tfj1va6d7voutma5pi403tujp9cea.apps.googleusercontent.com"
      buttonText="Login with Google"
      onSuccess={responseGoogleSuccess} // Handle successful login
      onFailure={responseGoogleFailure} // Handle login failure
      cookiePolicy={'single_host_origin'}
    />
  );
};

export default GoogleLoginButton;
