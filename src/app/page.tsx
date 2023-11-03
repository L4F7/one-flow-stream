/**
 * @authors
 *  - Kenneth Alfaro Barboza
 *  - Luis Fuentes Fuentes
 *  - Luis Eduardo Restrepo Veintemilla
 *  - Maria Angelica Robles Azofeifa
 *  - Royer Zuñiga Villareal
 * @version 1.0.0
 */

'use client';

import { useReducer } from 'react';
import { AboutInfo } from '@/utils/types';
import TextArea from '@/components/TextArea';
import AboutPopUp from '@/components/AboutPopUp';
import AlertPopUp from '@/components/AlertPopUp';

const bgColor = 'bg-slate-400';

export default function Home() {
    // Define the types of actions that can be dispatched
    type ActionType =
        | 'SET_ALERT_IS_OPEN'
        | 'SET_ALERT_MESSAGE'
        | 'SET_ALERT_TYPE'
        | 'SET_IS_OPEN'
        | 'SET_ABOUT_INFO'
        | 'SET_OUTPUT_TEXT'
        | 'SET_FILENAMES'
        | 'SET_SELECTED_FILENAME'
        | 'SET_TYPED_FILENAME'
        | 'SET_SHOW_MODAL'
        | 'SET_CONTENT'
        | 'RA_SET_CONTENT'
        | 'SET_IS_LOADING'
        | 'SET_TA_FILENAME';

    // Define the types of state that can be used in the reducer
    interface State {
        alertIsOpen: boolean;
        alertMessage: string;
        alertType: string;
        isOpen: boolean;
        aboutInfo: AboutInfo[];
        outputText: string;
        filenames: string[];
        selectedFilename: string;
        typedFilename: string;
        showModal: boolean;
        content: string;
        raContent: string;
        isLoading: boolean;
        taFilename: string;
    }

    // Define the initial state of the reducer
    const initialState: State = {
        alertIsOpen: false,
        alertMessage: '',
        alertType: '',
        isOpen: false,
        aboutInfo: [],
        outputText: '',
        filenames: [],
        selectedFilename: '',
        typedFilename: '',
        showModal: false,
        content: '',
        raContent: '',
        isLoading: false,
        taFilename: '',
    };

    interface Action {
        type: ActionType;
        value: any;
    }

    // Define the reducer
    const reducer = (state: State, { type, value }: Action): State => {
        switch (type) {
            case 'SET_ALERT_IS_OPEN':
                return { ...state, alertIsOpen: value };
            case 'SET_ALERT_MESSAGE':
                return { ...state, alertMessage: value };
            case 'SET_ALERT_TYPE':
                return { ...state, alertType: value };
            case 'SET_IS_OPEN':
                return { ...state, isOpen: value };
            case 'SET_ABOUT_INFO':
                return { ...state, aboutInfo: value };
            case 'SET_OUTPUT_TEXT':
                return { ...state, outputText: value };
            case 'SET_FILENAMES':
                return { ...state, filenames: value };
            case 'SET_SELECTED_FILENAME':
                return { ...state, selectedFilename: value };
            case 'SET_TYPED_FILENAME':
                return { ...state, typedFilename: value };
            case 'SET_SHOW_MODAL':
                return { ...state, showModal: value };
            case 'SET_CONTENT':
                return { ...state, content: value };
            case 'RA_SET_CONTENT':
                return { ...state, raContent: value };
            case 'SET_IS_LOADING':
                return { ...state, isLoading: value };
            case 'SET_TA_FILENAME':
                return { ...state, taFilename: value };
            default:
                return state;
        }
    };

    const [
        {
            alertIsOpen,
            alertMessage,
            alertType,
            isOpen,
            aboutInfo,
            outputText,
            filenames,
            selectedFilename,
            typedFilename,
            showModal,
            content,
            raContent,
            isLoading,
            taFilename,
        },
        dispatch,
    ] = useReducer(reducer, initialState);

    // About functions
    const openAboutPopup = () => {
        fetch(`api/about`, { cache: 'no-store' })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error calling About API');
                }
                return response.json();
            })
            .then((data) =>
                dispatch({
                    type: 'SET_ABOUT_INFO',
                    value: JSON.parse(data.about),
                })
            )
            .catch((error) =>
                console.error('Error fetching about Info:', error)
            );
        dispatch({ type: 'SET_IS_OPEN', value: true });
    };

    const closeAboutPopup = () => {
        dispatch({ type: 'SET_IS_OPEN', value: false });
    };

    // Alert Dialog functions
    const closeAlertPopup = () => {
        dispatch({ type: 'SET_ALERT_IS_OPEN', value: false });
    };

    //API to call /Compile service from server using POST
    const handleSendToServer = () => {
        const data = {
            code: content,
            filename: typedFilename ? typedFilename.split('.')[0] + '.mjs' : '',
            filepath: typedFilename,
        };

        fetch(`api/compile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        'Unable to compile, please type a script before continue'
                    );
                }
                return response.json();
            })
            .then((data) => {
                dispatch({ type: 'SET_OUTPUT_TEXT', value: data.result });
                dispatch({
                    type: 'SET_TA_FILENAME',
                    value: typedFilename
                        ? typedFilename.split('.')[0] + '.mjs'
                        : '',
                });
            })
            .catch((error) => {
                dispatch({ type: 'SET_ALERT_MESSAGE', value: `${error}` });
                dispatch({ type: 'SET_ALERT_TYPE', value: 'Error' });
                dispatch({ type: 'SET_ALERT_IS_OPEN', value: true });
            });
    };

    //API to call /Eval service from server using GET
    const callEvaluateScript = async () => {
        const data = {
            code: outputText,
            filename: typedFilename ? typedFilename.split('.')[0] + '.mjs' : '',
        };

        fetch(`api/eval`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        'Unable to evaluate, please type a script in EA and compile it before continue'
                    );
                }
                return response.json();
            })
            .then((data) => {
                dispatch({ type: 'RA_SET_CONTENT', value: data.result });
            })
            .catch((error) => {
                dispatch({ type: 'RA_SET_CONTENT', value: error.message });
                dispatch({ type: 'SET_ALERT_MESSAGE', value: `${error}` });
                dispatch({ type: 'SET_ALERT_TYPE', value: 'Error' });
                dispatch({ type: 'SET_ALERT_IS_OPEN', value: true });
            });
    };

    // Scripts Calls
    const callOpenScriptAPI = async () => {
        fetch(`/api/script/${selectedFilename}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch content');
                }
                clearContent();
                return response.json();
            })
            .then((data) => {
                const fileData = data.data;
                dispatch({ type: 'SET_CONTENT', value: fileData });
                dispatch({
                    type: 'SET_TYPED_FILENAME',
                    value: selectedFilename,
                });
                dispatch({ type: 'SET_OUTPUT_TEXT', value: '' });
            })
            .catch((error) => {
                dispatch({ type: 'SET_ALERT_MESSAGE', value: `${error}` });
                dispatch({ type: 'SET_ALERT_TYPE', value: 'Error' });
                dispatch({ type: 'SET_ALERT_IS_OPEN', value: true });
            });
    };

    const callSaveScriptAPI = async () => {
        dispatch({ type: 'SET_IS_LOADING', value: true });
        try {
            if (content.length === 0)
                throw new Error('Please type a script to save.');

            if (typedFilename === '')
                throw new Error('Please type a name for the script.');

            const requestBody = JSON.stringify({
                fileContent: content,
            });

            await fetch(`/api/script/save/${typedFilename}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: requestBody,
            });
            dispatch({ type: 'SET_ALERT_MESSAGE', value: `File: ${typedFilename} was successfully saved in the DB` });
            dispatch({ type: 'SET_ALERT_TYPE', value: 'Success' });
            dispatch({ type: 'SET_ALERT_IS_OPEN', value: true });
        } catch (error) {
            dispatch({ type: 'SET_ALERT_MESSAGE', value: `${error}` });
            dispatch({ type: 'SET_ALERT_TYPE', value: 'Error' });
            dispatch({ type: 'SET_ALERT_IS_OPEN', value: true });
        }
        dispatch({ type: 'SET_IS_LOADING', value: false });
    };

    const callListScriptAPI = async () => {
        dispatch({ type: 'SET_IS_LOADING', value: true });

        await fetch(`/api/script/list`, { cache: 'no-store' })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch filenames');
                }
                return response.json();
            })
            .then((data) => {
                dispatch({ type: 'SET_FILENAMES', value: data });
                dispatch({ type: 'SET_SHOW_MODAL', value: true });
            })
            .catch((error) => {
                dispatch({ type: 'SET_ALERT_MESSAGE', value: `${error}` });
                dispatch({ type: 'SET_ALERT_TYPE', value: 'Error' });
                dispatch({ type: 'SET_ALERT_IS_OPEN', value: true });
            });

        dispatch({ type: 'SET_IS_LOADING', value: false });
    };

    const handleTypedFilenameChange = (value: string) => {
        dispatch({ type: 'SET_TYPED_FILENAME', value: value });
    };

    const handleFilenameChange = ({
        target: { value },
    }: {
        target: { value: string };
    }) => {
        dispatch({ type: 'SET_SELECTED_FILENAME', value: value });
    };

    const clearContent = () => {
        dispatch({ type: 'SET_CONTENT', value: '' });
        dispatch({ type: 'SET_OUTPUT_TEXT', value: '' });
        dispatch({ type: 'RA_SET_CONTENT', value: '' });
        dispatch({ type: 'SET_TYPED_FILENAME', value: '' });
        dispatch({ type: 'SET_TA_FILENAME', value: '' });
    };

    return (
        <div
            className={`h-screen flex flex-col ${
                isLoading ? 'opacity-50 pointer-events-none' : ''
            }`}
        >
            {/* Alert PopUp Section */}
            {alertIsOpen && (
                <AlertPopUp
                    isOpen={alertIsOpen}
                    onClose={closeAlertPopup}
                    message={alertMessage}
                    type={alertType}
                />
            )}
            {/* Header Section */}
            <header className="bg-slate-700 text-white p-4">
                <div className="flex justify-between">
                    <div className="flex justify-start w-3/4">
                        <h1 className="text-2xl font-bold">
                            OneFlowStream Playground
                        </h1>
                    </div>
                    <div className="flex justify-end w-1/4">
                        <button className="mr-4 bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded">
                            Pref.
                        </button>
                        <button
                            className="bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded"
                            onClick={openAboutPopup}
                        >
                            About
                        </button>
                        {isOpen && (
                            <AboutPopUp
                                isOpen={isOpen}
                                onClose={closeAboutPopup}
                                data={aboutInfo}
                            />
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main
                className={`flex-1 flex flex-col justify-center items-center ${bgColor}`}
                id="main"
            >
                <div className="h-1/2 flex justify-between w-full">
                    {/*EA*/}
                    <TextArea
                        content={content}
                        setContent={(newContent: String) =>
                            dispatch({
                                type: 'SET_CONTENT',
                                value: newContent,
                            })
                        }
                        fileName={typedFilename}
                        setTypedFilename={handleTypedFilenameChange}
                        width="w-1/2"
                        backgroundColor="bg-neutral-100"
                    />
                    <div className="flex flex-col justify-evenly p-4">
                        <button
                            className="h-16 bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded"
                            onClick={handleSendToServer}
                        >
                            Compile
                        </button>
                        <button
                            className="h-16 bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded"
                            onClick={callEvaluateScript}
                        >
                            Evaluate
                        </button>
                        <button
                            className="h-16 bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded"
                            onClick={clearContent}
                        >
                            Clear
                        </button>
                        <button
                            className="h-16 bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded"
                            onClick={callListScriptAPI}
                        >
                            Open
                        </button>
                        <button
                            className="h-16 bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded"
                            onClick={callSaveScriptAPI}
                        >
                            Save
                        </button>
                    </div>

                    {/* Open File */}
                    <div>
                        {showModal && (
                            <div
                                className="modal fade show"
                                id="myModal"
                                role="dialog"
                            >
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">
                                                Select a File:
                                            </h5>
                                        </div>
                                        <div className="modal-body">
                                            <select
                                                value={selectedFilename}
                                                onChange={handleFilenameChange}
                                                style={{
                                                    color: 'black',
                                                }}
                                            >
                                                <option value="" disabled>
                                                    Select a filename
                                                </option>
                                                {filenames.map((filename) => (
                                                    <option
                                                        key={filename}
                                                        value={filename}
                                                    >
                                                        {filename}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="modal-footer">
                                            <button
                                                className="h-1/5 bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded"
                                                onClick={() => {
                                                    callOpenScriptAPI();
                                                    dispatch({
                                                        type: 'SET_SHOW_MODAL',
                                                        value: false,
                                                    });
                                                }}
                                            >
                                                Open File
                                            </button>
                                            <button
                                                className="h-1/5 bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded"
                                                onClick={() =>
                                                    dispatch({
                                                        type: 'SET_SHOW_MODAL',
                                                        value: false,
                                                    })
                                                }
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/*TA*/}
                    <TextArea
                        content={outputText}
                        setContent={(newContent: String) =>
                            dispatch({
                                type: 'SET_CONTENT',
                                value: newContent,
                            })
                        }
                        width="w-1/2"
                        backgroundColor="bg-neutral-100"
                        setReadOnly={true}
                        fileName={taFilename}
                    />
                </div>

                {/*RA*/}
                <div className={`h-1/2 w-full p-4 ${bgColor}`}>
                    <TextArea
                        content={raContent}
                        setContent={(newContent: String) =>
                            dispatch({
                                type: 'SET_CONTENT',
                                value: newContent,
                            })
                        }
                        height={'h-full'}
                        backgroundColor="bg-black"
                        textColor="text-white"
                        setReadOnly={true}
                        fileName="Output.js"
                        showInfo={false}
                    />
                </div>
            </main>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
                </div>
            )}
        </div>
    );
}
