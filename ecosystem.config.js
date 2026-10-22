module.exports = {
  apps: [
    {
      name: 'balanse',
      script: 'node_modules/next/dist/bin/next',
      args: 'dev',
      cwd: 'C:/Personal Projects/first claude pro project',
      interpreter: 'node',
      watch: false,
      autorestart: true,
      max_restarts: 20,
    },
  ],
};
