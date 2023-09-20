import React from 'react'
import TextArea from '../components/TextArea'

const bgColor = "bg-slate-400"

export default function Home() {
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
            <button className="bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded">
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
                backgroundColor = "bg-neutral-100"
            />
          </div>
          <div className="flex flex-col justify-evenly p-4">
            <button className="h-1/5 bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded">Compile</button>
            <button className="h-1/5 bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded">Execute</button>
            <button className="h-1/5 bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded">Analyze</button>
          </div>

          {/*TA*/}
          <div className={`w-1/2 p-4 ${bgColor}`}>
            <TextArea
              backgroundColor = "bg-neutral-100"
              setReadOnly = {true}
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