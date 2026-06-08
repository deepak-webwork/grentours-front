module.exports = {
  apps: [
    {
      name: 'grentours-front',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 'max', // Utilize all CPU cores in cluster mode
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000 // Change this port if needed
      }
    }
  ]
};
