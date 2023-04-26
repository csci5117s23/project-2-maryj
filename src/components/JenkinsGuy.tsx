import { useState } from 'react';


export default function JenkinsGuy() {
  const [funFact, setFunFact]=useState('');

  async function getFunFact() {
    const response = await fetch('/api/facts');
    const factResponse = await response.json();
    const fact = factResponse.fact;
    setFunFact(fact);
    console.log(funFact);
  }

  return (
    <div>
      <button onClick={getFunFact}>FACT</button>
    </div>
  );

}