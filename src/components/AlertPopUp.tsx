/**
 * @authors
 *  - Kenneth Alfaro Barboza
 *  - Luis Fuentes Fuentes
 *  - Luis Eduardo Restrepo Veintemilla
 *  - Maria Angelica Robles Azofeifa
 *  - Royer Zuñiga Villareal
 * @version 1.0.0
 */

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import PopUp from 'react-modal';

PopUp.setAppElement('#main');

const popUpStyle: PopUp.Styles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: {
        width: '350px',
        height: '250px',
        margin: 'auto',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        color: 'black',
        textAlign: 'center',
    },
};

interface AlertPopUpProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
    type: string;
}

const AlertPopUp: React.FC<AlertPopUpProps> = ({
    isOpen,
    onClose,
    message,
    type,
}) => {
    return (
        <PopUp
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Popup Modal"
            style={popUpStyle}
        >
            <div className="flex items-center">
                <div>
                    <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        className="text-red-500 text-2xl mr-2"
                    />{' '}
                    Alert
                    <br />
                    <br />
                    <p>{message}</p>
                </div>
            </div>
            <br />
            <button
                onClick={onClose}
                className="h-1/10 bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded"
            >
                {' Cerrar '}
            </button>
        </PopUp>
    );
};

export default AlertPopUp;
