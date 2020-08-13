# Serverless University Project Application

This application will allow creating/removing/updating/fetching projects that you, as a university student, have to complete before a given deadline. Each project can optionally have an attachment image. Each user only has access to project that he/she has added.

# Projects

The application stores projects, and each project contains the following fields:

* `todoId` (string) - a unique id for a prohect
* `createdAt` (string) - date and time when project was created
* `name` (string) - name of a project (e.g. "Computer project")
* `dueDate` (string) - date and time by which a project should be completed
* `done` (boolean) - true if a project was completed, false otherwise
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a project
* `userId` (string) - the id of the user who created a project


# Frontend

The `client` folder contains a web application that can use the API that should be developed in the project.

This frontend should work with your serverless application once it is developed, you don't need to make any changes to the code. The only file that you need to edit is the `config.ts` file in the `client` folder. This file configures your client application just as it was done in the course and contains an API endpoint and Auth0 configuration:

```ts
const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless TODO application.

