import style from '../styles/jenkinsGuy.module.css';
import { useState } from 'react';
import Modal from "react-modal";
import Image from 'next/image';
import Logo from "../../public/jenkinsGuy.png";
import AltLogo from "../../public/jenkinsGuyFolded.png";


Modal.setAppElement('body');

export default function JenkinsGuy() {
  const [funFact, setFunFact] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);


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
      <Image 
        className={style.image}
        onClick={getFunFact}
        alt="Jenkins"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        src={isHovered ? Logo : AltLogo} // use the alt image if isHovered is true
      />
      <Modal className={style.funFactModal} isOpen={isOpen} onRequestClose={closeModal}>
        <div className={style.funFactText} >Fun fact: {funFact}</div>
      </Modal>
    </div>
  );

}