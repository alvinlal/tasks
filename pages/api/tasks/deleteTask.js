import { deleteTask } from '../../../config/dynamodb';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }
  const response = await deleteTask(req.body.id);
  return res.json(response);
}
