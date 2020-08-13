// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'vo7jjgsykb'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-2.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-du1071hk.us.auth0.com',            // Auth0 domain
  clientId: 'vuzt2ZW8NnZ7qbDhc0CBESKE3dRzAFix',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
