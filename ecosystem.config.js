require("dotenv").config();

module.exports = {
  apps: [
    {
      name: process.env.CONTAINER_NAME, // pm2 server name
      script:
        process.env.NODE_ENV === "production"
          ? "./dist/index.js"
          : "./src/index.ts",
      cwd: "./",
      instances: process.env.NODE_ENV === "production" ? 2 : 1, // run pm2 instance as per environment

      env_production: {
        NODE_ENV: "production",
        PORT: process.env.INTERNAL_PORT,
        exec_mode: "cluster_mode",

        // Logging
        max_memory_restart: "1024M",
        out_file: "./logs/out.log",
        error_file: "./logs/error.log",
        merge_logs: true,
        log_date_format: "DD-MM HH:mm:ss Z",
        log_type: "json",
      },

      env_development: {
        NODE_ENV: "development",
        PORT: process.env.INTERNAL_PORT,
        watch: true,
        watch_delay: 1000,
        ignore_watch: ["node_modules", "./sql", "./logs"],
      },
    },
  ],
};
