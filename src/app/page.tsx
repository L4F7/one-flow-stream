'use client'

import { useState, useEffect, ChangeEvent } from 'react'
//import { useRouter } from 'next/navigation'
import TextArea from '../components/TextArea'
import AboutPopUp from '../components/AboutPopUp'
import AlertPopUp from '../components/AlertPopUp'

const bgColor = "bg-slate-400"

export default function Home() {

  //const router = useRouter()
  const [alertIsOpen, setAlertIsOpen] = useState<boolean>(false)
  const [alertMessage, setAlertMessage] = useState<string>('')
  const [alertType, setAlertType] = useState<string>('')
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [aboutInfo, setAboutInfo] = useState<string[]>([])
  const [outputText, setOutputText] = useState<string>('')
  const [filenames, setFilenames] = useState([])
  const [selectedFilename, setSelectedFilename] = useState('')
  const [typedFilename, setTypedFilename] = useState('')
 // const [hashedFilename, sethashedFilename] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [content, setContent] = useState<string>('');
  const [raContent, raSetContent] = useState<string>('');

  useEffect(() => {

      fetch(`api/about`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error calling About API');
        }
        return response.json()})
      .then((data) => setAboutInfo(JSON.parse(data.about)))
      .catch((error) => console.error('Error fetching about Info:', error));
  }, []);

  // About functions
  const openAboutPopup = () => {
    setIsOpen(true);
  };

  const closeAboutPopup = () => {
    setIsOpen(false);
  };

  // Alert Dialog functions
  const closeAlertPopup = () => {
    setAlertIsOpen(false);
  };

  //API to call /Compile service from server using POST
  const handleSendToServer = () => {
      fetch(`api/compile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: content,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Unable to compile, please type a script before continue');
          }
          return response.json()
        })
        .then((data) => {setOutputText(data.result);})
        .catch((error) => {
            setAlertMessage(`${error}`);
            setAlertType('Error');
            setAlertIsOpen(true);
        });
    };

  //API to call /Eval service from server using GET
  const callEvaluateScript = async () => {

    fetch(`api/eval`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: outputText,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to evaluate, please type a script in EA and compile it before continue');
        }
        return response.json()
      })
      .then((data) => {raSetContent(data.result); console.log(`RESULT: ${data.result}`)})
      .catch((error) => {
          raSetContent(error.message);
          setAlertMessage(`${error}`);
          setAlertType('Error');
          setAlertIsOpen(true);
      });
  }

  // Scripts Calls
  const callOpenScriptAPI = async () => {
    try {
      const filename = selectedFilename.split('.')[0];
      const response = await fetch(`/api/script/${filename}`);
      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }
      const data = await response.json();
      setContent(data.fileContent);
      setTypedFilename(filename);
    } catch (error) {
      console.error(error);
      setAlertMessage(`${error}`);
      setAlertType('Error');
      setAlertIsOpen(true);
    }
  }

  const callSaveScriptAPI = async () => {
    try {
      if (content.length > 0){
        if (typedFilename !== '') {
          const requestBody = JSON.stringify({ fileContent: content });
          await fetch(`/api/script/save/${typedFilename}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: requestBody
          });
        } else {
          throw new Error('Please type a name for the script.');
        }
      } else {
        throw new Error('Please type a script to save.');
      }
    } catch (error) {
      console.error(error);
      setAlertMessage(`${error}`);
      setAlertType('Error');
      setAlertIsOpen(true);
    }
  }

  const callListScriptAPI = async () => {
    try {
      const response = await fetch('/api/script/list');
      if (!response.ok) {
        throw new Error('Failed to fetch filenames');
      }
      const data = await response.json();
      setFilenames(data);
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  }

  /*const callHashNameScriptAPI = async () => {
    try {
      const requestBody = JSON.stringify({ fileName: typedFilename });
      const response = await fetch('/api/script/hashName', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: requestBody
      });
      const data = await response.json();
      sethashedFilename(data);
    } catch (error) {
      console.error(error);
      setAlertMessage(`${error}`);
      setAlertType('Error');
      setAlertIsOpen(true);
    }
  }*/

  const handleTypedFilenameChange = (value: string) => {
    setTypedFilename(value);
    //callHashNameScriptAPI();
  }

  const handleFilenameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilename(event.target.value);
  };


  return (
    <div className="h-screen flex flex-col">
      {/* Alert PopUp Section */}
      {alertIsOpen && <AlertPopUp isOpen = {alertIsOpen} onClose = {closeAlertPopup} message = {alertMessage} type = {alertType} />}
      {/* Header Section */}
      <header className="bg-slate-700 text-white p-4">
        <div className="flex justify-between">
          <div className="flex justify-start w-3/4">
            <h1 className="text-2xl font-bold">OneFlowStream Playground</h1>
          </div>
          <div className="flex justify-end w-1/4">
            <button className="mr-4 bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded">
              Pref.
            </button>
            <button className="bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded" onClick={openAboutPopup}>About</button>
            {isOpen && <AboutPopUp isOpen={isOpen} onClose={closeAboutPopup} data={aboutInfo} />}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col justify-center items-center ${bgColor}`} id="main">
        <div className="h-1/2 flex justify-between w-full">

          {/*EA*/}
          <TextArea
            content={content}
            setContent={setContent}
            fileName={typedFilename}
            setTypedFilename={handleTypedFilenameChange}
            //wordCount = {wordCount}
            //handleInputChange={handleInputChange}
            width = "w-1/2"
            backgroundColor = "bg-neutral-100"
          />
          <div className="flex flex-col justify-evenly p-4">
            <button className="h-1/5 bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded" onClick={handleSendToServer}>Compile</button>
            <button className="h-1/5 bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded" onClick={callEvaluateScript}>Evaluate</button>
            <button className="h-1/5 bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded" >Execute</button>
            <button className="h-1/6 bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded" onClick={callListScriptAPI}>Open</button>
            <button className="h-1/6 bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded" onClick={callSaveScriptAPI}>Save</button>
          </div>

          {/* Open File */}
          <div>
            {showModal && (
              <div className="modal fade show" id="myModal" role="dialog">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Select a File:</h5>
                    </div>
                    <div className="modal-body">
                      <select value={selectedFilename} onChange={handleFilenameChange} style={{color: 'black'}}>
                        <option value="" disabled>
                          Select a filename
                        </option>
                        {filenames.map((filename) => (
                          <option key={filename} value={filename}>
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
                          setShowModal(false);
                        }}
                      >
                        Open File
                      </button>
                      <button className="h-1/5 bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded" onClick={() => setShowModal(false)}>
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
            setContent={setContent}
            //handleInputChange={handleInputChange}
            width = "w-1/2"
            backgroundColor = "bg-neutral-100"
            setReadOnly = {true}
            fileName="Output.js"
          />
        </div>

        {/*RA*/}
        <div className={`h-1/2 w-full p-4 ${bgColor}`}>
          <TextArea
            content={raContent}
            setContent={setContent}
            //handleInputChange={handleInputChange}
            height={"h-full"}
            backgroundColor = "bg-black"
            textColor = "text-white"
            setReadOnly = {true}
            fileName="Output.js"
            showInfo = {false}
          />
        </div>
      </main>
    </div>
  )
}