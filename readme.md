# Risevest Junior backend test
Repository containing test for Risevests Junior Backend role, It is a simple Cloud backup API.

## How to run the app
To run the app, clone this repositoy to your machine, create a .env file and copy the .env.example file to it,
and fill up the required values in it.


### Running the app with docker
There is a docker-compose.yml file in the project that you can use to spin up a dev environment. To do that,
make sure you have docker installed and run the following command:
```
 docker-compose up --build
 ```
 Your API should now be running at http://localhost:8000/api

 ### Running the app without docker
 Make sure to install the dependencies and execute this command:
 ```
 npm run start:dev
 ```

 ### Running the tests
 To run the tests in this application, execute the following command:
 ```
 npm run test:unit
 ```