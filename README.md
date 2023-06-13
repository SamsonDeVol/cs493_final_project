# CS 493 Final Project
###### By Melissa Swearingen, Samson DeVol, Ian Snyder, and Jonah Broyer

In this course, a final programming project will take the place of formal exams to test your understanding of the material. The final project will involve working with a team of 3-4 people to implement a complete RESTful API for an application called Tarpaulin. You can find more details about Tarpaulin below. The API you implement will need to utilize most the components of a modern API that we talked about in class.

## Tarpaulin, a Canvas replacement

The application for which you’ll write an API for this project is Tarpaulin, a lightweight course management tool that’s an "alternative" to Canvas. In particular, Tarpaulin allows users (instructors and students) to see information about the courses they’re teaching/taking. It allows instructors to create assignments for their courses, and it allows students to submit solutions to those assignments.

The Tarpaulin API you implement must support all of the endpoints described in the Tarpaulin OpenAPI specification. Importantly, you are free to implement the endpoints described in the OpenAPI specification however you see fit. For example, you may use whatever database you want, and you may design your API architecture to meet your own needs.

The OpenAPI specification linked above will provide most of the details of the API you’ll implement, but some more details are included below.

## Running Locally

This application was generated using the express application generator initialized with ```npx express-generator``` 

Here is a list of the npm package dependencies

```
npm install cookie-parser
npm install http-errors
npm install sequelize
npm install mysql2
npm install jsonwebtoken
npm install bcryptjs
```

The applications default port is on localhost:3000

## Creation of the Database

This application uses a MySQL database. The database was created using the following commands:

1. Create a Docker image using ```docker pull mysql```.
2. Create a Docker network using ```docker network create --driver bridge cs493_final_network```.
3. Launch the Docker container:
```
docker run -d --name cs493_final_server            \
     --network cs493_final_network                 \
     -p "3306:3306"                                \
     -e "MYSQL_RANDOM_ROOT_PASSWORD=yes"           \
     -e "MYSQL_DATABASE=${MYSQL_DATABASE}"         \
     -e "MYSQL_USER=${MYSQL_USER}"                 \
     -e "MYSQL_PASSWORD=${MYSQL_PASSWORD}"         \
     mysql
```
4. Check to make sure the container is running using ```docker container ls```.
5. Run the MySQL terminal monitor using the Docker image:
```
docker run --rm -it                                \
     --network cs493_final_network                 \
     mysql                                         \
          mysql -h cs493_final_server -u cs493_final_user -p
```
6. Once the MySQL terminal monitor is running, use the database you created in step 3 using ```mysql> USE ${MYSQL_DATABASE}```.
7. In a separate terminal and while the MySQL terminal is still running, initialize the database using ```npm run initdb```. This will populate the database with the tables and data needed for the application.
8. Start the package using ```npm start```.

