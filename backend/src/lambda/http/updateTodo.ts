import 'source-map-support/register';
import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import * as middy from 'middy';
import {cors} from 'middy/middlewares';
import {updateTodoItem} from '../../logic/todoLogic';
import {UpdateTodoRequest} from '../../requests/UpdateTodoRequest';

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId;
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);

    // Update a project with the provided id using values in the "updatedTodo" object
    const authorization = event.headers.Authorization;
    const jwtToken = authorization.split(' ')[1];

    await updateTodoItem(updatedTodo, todoId, jwtToken);

    return {
        statusCode: 200,
        body: '{}'
    };
});

handler.use(
    cors({
        credentials: true
    })
);