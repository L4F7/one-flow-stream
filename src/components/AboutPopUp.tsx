import PopUp from 'react-modal';

PopUp.setAppElement('#main');

interface Proyecto {
  Nombre: string;
  Integrantes: { Nombre: string; Identificacion: string }[];
}

interface Curso {
  Nombre: string;
  Codigo: string;
  Horario: string;
  Semestre: string;
  Año: string;
  Escuela: string;
  Universidad: string;
}

const aboutDialogStyle: PopUp.Styles = {
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

interface aboutInfo {
  Proyecto?: Proyecto;
  Curso?: Curso;
}

const readableJSON = (data: aboutInfo): string => {
  let result = '';
  if (data.Proyecto) {
    const { Nombre, Integrantes } = data.Proyecto;
    result += `\n\nProyecto:\n\n${Nombre}\nIntegrantes:\n\n`;
    Integrantes.forEach((integrante) => {
      result += `*  ${integrante.Nombre}\nIdentificación: ${integrante.Identificacion}\n\n`;
    });
  }
  if (data.Curso) {
    const { Nombre, Codigo, Horario, Semestre, Año, Escuela, Universidad} = data.Curso;
    result += `Curso: ${Nombre}\n  Código: ${Codigo}\n  Horario: ${Horario}\n  Semestre: ${Semestre}\n  Año: ${Año}\n  Escuela: ${Escuela}\n  Universidad: ${Universidad}\n`;
  }
  return result;
};

const AboutPopUp = ({ isOpen, onClose, data}:{isOpen: boolean; onClose: () => void; data: aboutInfo[];}) => {
  
  return (
    <PopUp isOpen={isOpen} onRequestClose={onClose} contentLabel="Popup Modal" style={aboutDialogStyle}>
      <div>
      {data.map((item, index) => (
        <div key={index}>
          <pre>{readableJSON(item)}</pre>
        </div>
      ))}
    </div>
      <br></br>
      <button onClick={onClose} className="h-1/10 bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded">Cerrar</button>
    </PopUp>
  );
};

export default AboutPopUp;