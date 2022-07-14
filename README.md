## REQUIREMENTS
- node 6.x
- npm 3.1x
- mongodb server
- yarn (optional)

## WEB APP SETUP

### Install Packages
```
npm i
```
### Server Development
```
npm run start
```
Runs at [http://localhost:3000]()

### Server Production
```
npm run build
```


--------------

## ADMIN APP SETUP
(May not be current)
1. Execute: `yarn install`
2. Execute: `yarn server:build && yarn client:build`
3. Execute: `yarn start-admin`
4. Go to build folder: `cd build`
5. Run the application: `ADMIN=true MONGODB_URI=mongodb://localhost/eternity-ready node ./server-bundle.js`. (For Windows users: `SET ADMIN=true && SET MONGODB_URI=mongodb://localhost/eternity-ready && node ./server-bundle.js`)
6. Open the application in the browser: http://localhost:3030/admin/login
7. Credentials: Create a user via web app, then edit user in MongoDB toggle `validated` to `true`
