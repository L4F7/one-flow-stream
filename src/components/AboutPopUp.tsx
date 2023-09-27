import { bgColor } from '@/app/shared';
import { Content } from 'next/font/google';
import React, { useState, useEffect } from 'react';
import PopUp from 'react-modal';

PopUp.setAppElement('#main');

const popUpStyle: PopUp.Styles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    width: '600px',
    margin: 'auto',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    color:'black',
    textAlign:'center',
  },
};

interface AboutPopUpProps {
  isOpen: boolean;
  onClose: () => void
  data: any;
}

const AboutPopUp : React.FC<AboutPopUpProps> = ({ isOpen, onClose, data}) => {
  
console.log(JSON.stringify(data))

  return (
    <PopUp isOpen={isOpen} onRequestClose={onClose} contentLabel="Popup Modal" style={popUpStyle}>
      <h2>{data.Nombre}</h2>
      <h2>{data.Identificacion}</h2>
      <br></br>
      <button onClick={onClose} className="h-1/10 bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded">Cerrar</button>
    </PopUp>
  );
};

export default AboutPopUp;