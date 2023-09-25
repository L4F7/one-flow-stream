'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import {API_SERVER_URL} from '../components/Url'
import TextArea from '../components/TextArea'
import CodeEditor from '../components/CodeEditor'

const bgColor = "bg-slate-400"

export default function Home() {

  const router = useRouter()
  const [keywordsList, setKeywordsList] = useState<string[]>([])
  const [aboutInfo, setAboutInfo] = useState<string[]>([])
  const [inputText, setInputText] = useState<string>('')
  const [outputText, setOutputText] = useState<string>('')
  const [wordCount, setWordCount] = useState<number>(0);
  const [content, setContent] = useState<string>('');

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


  const countWords = (validationText : string) => {

    if (validationText === "") { 
      setWordCount(0);
      return;
    }

    const text : string = validationText;
    const cleanText : string = text.replace(/[^a-zA-Z0-9\s]|\n| +/g, ' ').trim(); // remove all non-alphanumeric characters, newlines, and extra spaces
    const newWordCount = (cleanText.match(/ /g) || []).length + 1;
    setWordCount(newWordCount);
  };


  const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newText: string = event.target.value;

    // Call multiple handleChange functions
    handleInputChange(event);
    setContent(event.target.value);
    countWords(event.target.value);
  };

  const handleInputChange = (e : ChangeEvent<HTMLTextAreaElement>) => {
    console.log(`HandleInputChange Called`)
    const newText : string = e.target.value;
    const words : string[] = newText.split(/\s+/); 
  
    const individualWords: string[] = words
                                      .map((word) => word.trim())
                                      .filter((trimmedWord) => keywordsList.includes(trimmedWord));

    const processedText: string = individualWords.join(' ');
  
    setInputText(newText);
    setOutputText(processedText);
  };

  const handleSendToServer = () => {
      // 
      fetch(`${API_SERVER_URL}/compile`, {
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
      method: 'POST',
      body: JSON.stringify(aboutInfo),
    })
    router.push('/about', {})
  }

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
          <CodeEditor 
            content={inputText}
            wordCount = {wordCount} 
            handleTextareaChange={handleTextareaChange}
            width = "w-1/2"
            backgroundColor = "bg-neutral-100"
          />
          <div className="flex flex-col justify-evenly p-4">
            <button className="h-1/5 bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded" onClick={handleSendToServer}>Compile</button>
            <button className="h-1/5 bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded">Execute</button>
            <button className="h-1/5 bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded">Analyze</button>
          </div>

          {/*TA*/}
          <CodeEditor 
            content={outputText}
            wordCount = {wordCount} 
            handleTextareaChange={handleTextareaChange} 
            width = "w-1/2"
            backgroundColor = "bg-neutral-100"
          />
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