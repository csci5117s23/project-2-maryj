import style from '../styles/jenkinsGuy.module.css';
import{ useState } from 'react';
import Modal from "react-modal";


Modal.setAppElement('body');

export default function JenkinsGuy() {
  const [funFact, setFunFact]=useState('');
  const [isOpen, setIsOpen] = useState(false);


  async function getFunFact() {
    // const response = await fetch('/api/facts');
    // const factResponse = await response.json();
    // const fact = factResponse.fact;
    //this is only a mock so we don't run out of the max api calls
    const fact = "Over the course of one year, a coffee tree only produces about 1.5 pounds of coffee";
    setFunFact(fact);
    setIsOpen(true);
  }

  const closeModal = () => setIsOpen(false);

  return (
    <div>
        <button onClick={getFunFact}>FACT</button>
        <Modal className={style.funFactModal} isOpen={isOpen} onRequestClose={closeModal}>
            <div className={style.funFactText} >Fun fact: {funFact}</div>
        </Modal>
    </div>
  );

}