"use client";
// components/CodeEditor.tsx

import React, { useState, useEffect, useRef, ChangeEventHandler } from "react";
import { bgColor } from "../app/shared";

interface CodeEditorProps {
  content: string;
  handleInputChange: ChangeEventHandler;
  height?: String;
  width?: String;
  backgroundColor: string;
  textColor?: string;
  setReadOnly?: boolean;
  fileName?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({content, handleInputChange, height = "", width = "", backgroundColor, textColor = "text-black", setReadOnly = false, fileName = "" }) => {

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const numbersAreaRef = useRef<HTMLDivElement | null>(null);
  const [wordCount, setWordCount] = useState<number>(0);
  const showFileName = fileName === "" ? "" : ` - File name: ${fileName}`;

  const countWords = (validationText: string) => {

    // If the text is empty, set the word count to 0
    if (validationText === "") {
      setWordCount(0);
      return;
    }

    // remove all non-alphanumeric characters, newlines, and extra spaces
    const cleanText: string = validationText
      .replace(/[^a-zA-Z0-9\s]|\n| +/g, " ")
      .trim();

    // Count the number of spaces in the text and add 1 to get the word count
    const newWordCount = (cleanText.match(/ /g) || []).length + 1;

    setWordCount(newWordCount);
  };

  // Update the word count when the content changes
  useEffect(() => {
    countWords(content);
  }, [content]);

  // Synchronize scrolling of textarea and line numbers
  useEffect(() => {
    const textarea = textareaRef.current;
    const numbersArea = numbersAreaRef.current;

    const handleScroll = () => {
      if (textarea && numbersArea) {
        numbersArea.scrollTop = textarea.scrollTop;
      }
    };

    if (textarea) {
      textarea.addEventListener("scroll", handleScroll);
    }

    /*
    return () => {
      if (textarea) {
        textarea.removeEventListener("scroll", handleScroll);
      }
    };
    */

  }, []);


  return (
    <div className={`${height} ${width} p-4 ${bgColor}`}>
      <div className="flex" style={{ height: "95%", maxHeight: "800px" }}>
        <div
          className="bg-gray-200 text-gray-600 text-center overflow-y-scroll"
          ref={numbersAreaRef}
          style={{ paddingTop: "10px", paddingBottom: "22px", minWidth: "40px", width: "auto" }}
        >
          {/* Splits the context at each new line and add a div with the according number */}
          {content.split("\n").map((_, index) => (
            <div key={index}>{index + 1}</div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          className="h-auto max-h-full flex-1 p-2 border border-gray-200 text-black resize-none overflow-y-scroll cursor-auto"         
          style={{ whiteSpace: 'nowrap' }}
          value={content}
          onChange={handleInputChange}
          readOnly={setReadOnly}
        />
      </div>
      <textarea
        className={`h-6 w-full ${textColor} ${backgroundColor}`}
        readOnly={setReadOnly}
        value={`${wordCount} words ${showFileName} `}
        onChange={() => null}
      ></textarea>
    </div>
  );
};

export default CodeEditor;
