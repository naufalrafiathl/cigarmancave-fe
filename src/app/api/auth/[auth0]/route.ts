import { 
  handleAuth, 
  handleLogin, 
  handleLogout, 
  handleCallback 
} from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  login: handleLogin({
    returnTo: '/dashboard',
    authorizationParams: {
      prompt: 'login',
    },
  }),
  logout: handleLogout({
    returnTo: '/',
  }),
  callback: handleCallback()
});

// Enable POST method for form submissions
export const POST = handleAuth();