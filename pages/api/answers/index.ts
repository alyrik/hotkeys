import type { NextApiRequest, NextApiResponse } from 'next';

async function handleSaveIndividualAnswer() {
  // TODO: send request to Lambda
  return true;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      try {
        await handleSaveIndividualAnswer();
        res.status(200).end();
      } catch (e) {
        res.status(500).end();
      }
      break;
    default:
      res.status(405).end('Method Not Allowed');
  }
};

export default handler;
