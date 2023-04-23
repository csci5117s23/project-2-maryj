import { useState } from 'react';
import { getFact} from "../modules/facts";




export default function JenkinsGuy() {
  const [funFact, setFunFact]=useState('');

  async function getFunFact() {
    const apiKey = process.env.MY_API_KEY;
    const response = await getFact();
    console.log(response);
  }

  return (
    <div>
      <button onClick={getFunFact}>FACT</button>
    </div>
  );

}