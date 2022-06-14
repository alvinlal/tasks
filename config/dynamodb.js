import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  DeleteCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const dbClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    region: process.env.TASKS_AWS_REGION,
    credentials: {
      accessKeyId: process.env.TASKS_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.TASKS_AWS_SECRET_ACCESS_KEY,
    },
  })
);

const getTasks = async () => {
  try {
    const params = {
      TableName: 'Tasks',
    };

    const data = await dbClient.send(new ScanCommand(params));
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const addTask = async (task) => {
  try {
    const id = uuidv4();
    const params = {
      TableName: 'Tasks',
      Item: {
        id,
        ...task,
      },
    };
    await dbClient.send(new PutCommand(params));
    return { data: { id }, errors: {} };
  } catch (error) {
    console.error(error);
    return { data: null, errors: {} };
  }
};

const deleteTask = async (id) => {
  try {
    const params = {
      TableName: 'Tasks',
      Key: {
        id,
      },
      ReturnValues: 'ALL_OLD',
    };
    const data = await dbClient.send(new DeleteCommand(params));
    return { data: { id: data.Attributes.id }, errors: {} };
  } catch (error) {
    console.error(error);
    return { data: null, errors: {} };
  }
};

const updateTask = async (task) => {
  try {
    const params = {
      TableName: 'Tasks',
      Key: {
        id: task.id,
      },
      UpdateExpression: 'SET completed = :newcompleted',
      ExpressionAttributeValues: {
        ':newcompleted': task.completed,
      },
      ReturnValues: 'ALL_NEW',
    };
    const data = await dbClient.send(new UpdateCommand(params));
    return { data: { task: data.Attributes }, errors: {} };
  } catch (error) {
    console.error(error);
    return { data: null, errors: {} };
  }
};

export { dbClient, getTasks, addTask, deleteTask, updateTask };
