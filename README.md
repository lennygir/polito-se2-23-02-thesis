# Office Queue Management System

## Run in production

### Prerequisites

- Docker

### Run

You can either retrieve the image from the docker hub either build it yourself.

```bash

# Build the docker image 
docker build -t polito-thesis .

# Retrieve the image from the docker hub
docker pull <TODO>/polito-thesis

```

Once you have the image locally you can run it with the following command:

```bash

docker run -p 80:80 --name polito-thesis polito-thesis

```

and stop it with:

```bash

docker stop polito-thesis
docker rm polito-thesis

```

Once the docker container is running you can access the application using [localhost:80](http://localhost:80).

## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...

## API Server

- POST `/api/login`
  - request parameters and request body content
  - response body content
- GET `/api/something`
  - request parameters
  - response body content
- POST `/api/something`
  - request parameters and request body content
  - response body content
- ...

## Database Tables

- Table `users` - contains xx yy zz
- Table `something` - contains ww qq ss
- ...

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- username, password (plus any other requested info)
- username, password (plus any other requested info)
