export const auth0Config = {
    baseURL: 'https://cigarmancave.com',
    session: {
      absoluteDuration: 24 * 60 * 60,
      cookie: {
        domain: 'cigarmancave.com', // Important for Safari
        httpOnly: true,
        secure: true,
        sameSite: 'lax'  // Important for Safari
      }
    },
    auth: {
      params: {
        returnTo: '/app/profile'
      }
    }
  };