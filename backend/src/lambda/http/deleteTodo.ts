import 'source-map-support/register';
import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {deleteTodoItem} from '../../logic/todoLogic';
import * as middy from 'middy';
import {cors} from 'middy/middlewares';

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const todoId = event.pathParameters.todoId;
    const authorization = event.headers.Authorization;
    const jwtToken = authorization.split(' ')[1];

    // Delete project from the list
    await deleteTodoItem(todoId, jwtToken);
    return {
        statusCode: 201,
        body: "{}"
    };
});

handler.use(
    cors({
        credentials: true
    })
);