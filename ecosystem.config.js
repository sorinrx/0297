module.exports = {
  apps: [{
    name: 'renet',
    script: 'server.js',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
  }],
};