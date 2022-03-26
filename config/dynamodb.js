import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
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
    return { data: null, error: {} };
  }
};

export { dbClient, getTasks, addTask };
