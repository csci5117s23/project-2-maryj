import type { NextApiRequest, NextApiResponse } from 'next'

const ninjaKey = process.env.NINJAS_KEY;

export default async function getFact(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ) {
    try {
        const headers = new Headers();
        if (ninjaKey) {
        headers.append('X-Api-Key', ninjaKey);
        }
        const result = await fetch("https://api.api-ninjas.com/v1/facts?limit=1", {
        method: 'GET',
        headers: headers
      });
  
      if (result.status !== 200) {
        throw new Error(`Failed to get fact from API-NINJAS, the returned status: ${result.status}`);
      }
      const returnedResponse = await result.json();
      res.status(200).json(returnedResponse[0]);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something is wrong I can feel it ' });
    }
}