'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import TextArea from '../components/TextArea'
import {API_SERVER_URL} from '../components/Url'

const bgColor = "bg-slate-400"

export default function Home() {

  const [keywordsList, setKeywordsList] = useState<string[]>([]);
  const [aboutInfo, setAboutInfo] = useState<string[]>([]);
  const [inputText, setInputText] = useState<string>('')
  const [outputText, setOutputText] = useState<string>('')
  const [aboutModal, setAboutModal] = useState<boolean>(false);

  useEffect(() => {
    
    fetch(`${API_SERVER_URL}/keywords`)
      .then((response) => response.json())
      .then((data) => setKeywordsList(data.keywords))
      .catch((error) => console.error('Error fetching keywords:', error));

      fetch(`${API_SERVER_URL}/about`)
      .then((response) => response.json())
      .then((data) => setAboutInfo(JSON.parse(data.about)))
      .catch((error) => console.error('Error fetching about Info:', error));
  }, []);

  const handleInputChange = (e : ChangeEvent<HTMLTextAreaElement>) => {
    const newText : string = e.target.value;
    const words : string[] = newText.split(/\s+/); 
  
    const individualWords: string[] = words
                                      .map((word) => word.trim())
                                      .filter((trimmedWord) => keywordsList.includes(trimmedWord));

    //Original 
    const processedText: string = individualWords.join(' ');

    //Temporary Testing
    //const processedText: string = words.join(' ');
  
    setInputText(newText);
    setOutputText(processedText);
  };

  const handleSendToServer = () => {
      // 
      fetch(`${API_SERVER_URL}/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      })
        .then((response) => response.json())
        .then((data) => setOutputText(data.result))
        .catch((error) => console.error('Error sending data to server:', error));
    };

  // About API Call
  const callAboutAPI = async () => {
    await fetch('/api/about',{
      method: 'GET',
      //body: JSON.stringify(aboutInfo),
    })
  }

  const handleAboutModal = () => setAboutModal(!aboutModal)

  return (
    <div className="h-screen flex flex-col">

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
            <button className="bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded" onClick={callAboutAPI}>
              About
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col justify-center items-center ${bgColor}`}>
        <div className="h-1/2 flex justify-between w-full">

          {/*EA*/}
          <div className={`w-1/2 p-4 ${bgColor}`}>
            <TextArea
                keywordsList = {keywordsList}
                backgroundColor = "bg-neutral-100"
                valueReceived = {inputText}
                handleInputChange = {handleInputChange}
            />
          </div>
          <div className="flex flex-col justify-evenly p-4">
            <button className="h-1/5 bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded" onClick={handleSendToServer}>Compile</button>
            <button className="h-1/5 bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded">Execute</button>
            <button className="h-1/5 bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded">Analyze</button>
          </div>

          {/*TA*/}
          <div className={`w-1/2 p-4 ${bgColor}`}>
            <TextArea
              backgroundColor = "bg-neutral-100"
              setReadOnly = {true}
              valueReceived = {outputText}
            />
          </div>
        </div>

        {/*RA*/}
        <div className={`h-1/2 w-full p-4 ${bgColor}`}>
          <TextArea
            backgroundColor = "bg-black"
            textColor = "text-white"
            setReadOnly = {true}
          />
        </div>
      </main>
    </div>
  )
}