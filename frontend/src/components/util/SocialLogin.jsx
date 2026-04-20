import { GoogleLogin } from '@react-oauth/google';

const SocialLogin = ({ onGoogleSuccess, onGoogleFailure }) => {
  return (
    <div className="social-login-buttons">
      <GoogleLogin
        onSuccess={onGoogleSuccess ?? ((cred) => console.log("Google:", cred))}
        onError={onGoogleFailure ?? (() => console.error("Google login failed"))}
        useOneTap
      />
    </div>
  );
};

export default SocialLogin;