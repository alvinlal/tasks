export default function handler(req, res) {
  return res.json([
    { title: 'buy groceries', completed: false },
    { title: 'Go to school', completed: false },
    { title: 'Ride bike', completed: true },
  ]);
}
