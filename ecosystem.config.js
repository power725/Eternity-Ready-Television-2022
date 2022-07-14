module.exports = {
  apps : [
      {
        name: "client",
        script: "./build/server-bundle.js",
        watch: true,
        env: {
          "PORT": "3000",
        }
      },
      {
        name: "admin",
        script: "./build/server-bundle.js",
        watch: true,
        env: {
          "ADMIN": true,
          "MONGODB_URI": "mongodb://127.0.0.1:27017/eternity-ready",//mongodb://localhost/eternity-ready",
          "PORT": "3030",
        }
      },
      {
          name: "keystone",
          script: "/usr/bin/npm",
          cwd: "/home/Keystone-JS",
          args: "run start",
          watch: false,
          env: {
              "PORT": "3001",
          }
      }
  ]
}
