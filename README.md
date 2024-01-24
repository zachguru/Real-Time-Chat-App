# Real-Time Chat App

## Application structure

Application project is divided into two distinct folders: **frontend** and **backend**. As the names imply, the frontend handles the application's visual elements, while the backend manages the logic. Each of these projects operates independently. For instance, altering environment variables in the frontend to a different server host won't affect its functionality. I find this folder structure highly effective as it segments the project into separate components while keeping them unified within a single git repository.

### Technologies used:
Node.js, Express.js, Socket.IO , Redis , JWT, Heroku and Angular.


## How to run?


### Default method:

- Clone the respoistory

#### Set up backend

- Navigate to backend folder via terminal
- Create .env file in **backend** folder
- Set appropriate env variables using examplery env file
- Run 
```
npm install
```
- After that run
```
ts-node index.ts
```
- Your server should be running now

#### Set up frontend

- Navigate to frontend folder via terminal
- Run 
```
npm install
```
**Optional:** Run 
```
ng build
```
- Run
```
ng serve 
```
- Visit [localhost:4200](http://localhost:4200). Your application is running

### Docker method 
- Clone the repository
- Position in ***chat-app*** folder, and run
```
    docker-compouse-up
```


## Credits
Zach Friedel
