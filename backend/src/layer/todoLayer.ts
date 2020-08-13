import * as AWS from 'aws-sdk';
import {DocumentClient} from 'aws-sdk/clients/dynamodb';
import {TodoItem} from '../models/TodoItem';
import {TodoUpdate} from '../models/TodoUpdate';
import {createLogger} from '../utils/logger';

const AWSXRay = require('aws-xray-sdk');
const logger = createLogger('todo');
const XrayAWS = AWSXRay.captureAWS(AWS);

// testing DynamoDB
function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        console.log('The app is offline. Creating a DynamoDB instance..');
        return new XrayAWS.DynamoDB.DocumentClient({region: 'localhost', endpoint: 'http://localhost:8000'});
    }
    return new XrayAWS.DynamoDB.DocumentClient();
}
export class TodoDataLayer {
    constructor(private readonly docClient: DocumentClient = createDynamoDBClient(),
                private readonly todoTable = process.env.TODO_TABLE) {
        console.log(`docClient ==> \n ${JSON.stringify(docClient)}`);
        console.log(`todoTable ==> \n ${todoTable}`);
    }

    //Create project 
    public async createTodoItem(todo: TodoItem): Promise<TodoItem> {
        logger.info(`Creating a project..`);
        await this.docClient.put({
            TableName: this.todoTable,
            Item: todo
        }).promise();
        return todo;
    }

    //Get project 
    public async getTodoItem(todoId: string, userId: string): Promise<TodoItem> {
        logger.info(`Getting project for: ${userId}`);
        const pull = await this.docClient.query({
            TableName: this.todoTable,
            KeyConditionExpression: 'userId = :userId, todoId = :todoId',
            ExpressionAttributeValues: {':userId': userId, ':todoId': todoId}
        }).promise();
        return pull.Items[0] as TodoItem;
    }

    //Get project list
    public async getTodoList(userId: string): Promise<TodoItem[]> {
        logger.info(`Getting projects list for: ${userId}`);
        const result = await this.docClient
            .query({
                TableName: this.todoTable,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            })
            .promise();
        return result.Items as TodoItem[];
    }

    //Update project
    public async updateTodoItem(todo: TodoUpdate, todoId: string, userId: string) {
        logger.info('Updating project for: ', {user: userId, todo});
        await this.docClient.update({
            TableName: this.todoTable,
            Key: {'userId': userId, 'todoId': todoId},
            UpdateExpression: 'set #name = :n, dueDate = :dd, done = :d',
            ExpressionAttributeNames: {'#name': 'name'},
            ExpressionAttributeValues: {':dd': todo.dueDate, ':d': todo.done, ':n': todo.name},
            ReturnValues: 'UPDATED_NEW'
        }).promise();
    }

    //Update project attachment
    public async updateTodoItemAttachment(attachmentUrl: string, todoId: string, userId: string) {
        logger.info(`Updating prohect image URL for: ${userId}`);
        await this.docClient.update({
            TableName: this.todoTable,
            Key: {'userId': userId, 'todoId': todoId},
            UpdateExpression: 'set attachmentUrl = :url',
            ExpressionAttributeValues: {':url': attachmentUrl},
            ReturnValues: "UPDATED_NEW"
        }).promise();
    }
    
    //Delete project
    public async deleteTodoItem(todoId: string, userId: string) {
        logger.info(`Deleting project for: ${userId}`);
        await this.docClient.delete({
            TableName: this.todoTable,
            Key: {"userId": userId, "todoId": todoId}
        }).promise();
    }
}