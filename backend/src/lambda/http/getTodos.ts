import 'source-map-support/register';
import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {getTodoList} from '../../logic/todoLogic';
import * as middy from 'middy';
import {cors} from 'middy/middlewares';

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    // Get all projects for a current user
    const authorization = event.headers.Authorization;
    const jwtToken = authorization.split(' ')[1];

    const list = await getTodoList(jwtToken);

    return {
        statusCode: 200,
        body: JSON.stringify({
            items: list
        })
    };
});

handler.use(
    cors({
        credentials: true
    })
);