export const config = {
  app: {
    title: 'Cubos Test',
    description: 'A test application',
    url: 'http://localhost:3000'
  },

  port: process.env.NODEJS_PORT || 3000,
  hostname: process.env.NODEJS_IP || 'localhost',
  basePath: process.env.BASE_PATH || '/',

  authorization: process.env.SECRET || 'mysecrettoken',

  clients: {
    user: process.env.USER_API || 'https://api.fitdance.com/v2-0-0/user-staging',
    materials: process.env.MATERIALS_API || 'https://api.fitdance.com/v2-0-0/material-staging'
  },

  toggle: {
    apidoc: process.env.TOGGLE_APIDOC || false,
    log: {
      files: process.env.ENABLE_LOG_FILE || false,
      console: process.env.ENABLE_CONSOLE || true
    }
  }
};
