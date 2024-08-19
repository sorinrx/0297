module.exports = {
  apps: [
    {
      name: "renet",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
