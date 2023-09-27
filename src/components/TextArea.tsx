"use client";
// components/TextArea.tsx

import React, { useState, useEffect, useRef, ChangeEventHandler } from "react";
import { bgColor } from "../app/shared";
import TextAreaInfo from "./TextAreaInfo";
import LineCounterArea from './LineCounterArea';

interface TextAreaProps {
  content: string;
  height?: String;
  width?: String;
  backgroundColor: string;
  textColor?: string;
  setReadOnly?: boolean;
  fileName?: string;
  showInfo?: boolean;
  handleInputChange?: ChangeEventHandler;
}

const TextArea: React.FC<TextAreaProps> = ({content, height = "", width = "", backgroundColor, textColor = "text-black", setReadOnly = false, fileName = "", showInfo = true}, handleInputChange = () => {}) => {

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const lineCounterAreaRef = useRef<HTMLDivElement | null>(null);
  const [wordCount, setWordCount] = useState<number>(0);

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
    const lineCounterArea = lineCounterAreaRef.current;

    const handleScroll = () => {
      if (textarea && lineCounterArea) {
        lineCounterArea.scrollTop = textarea.scrollTop;
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

  // Show the word count, file name, and number of lines if enabled
  const showTextAreaInfo = () => (
    showInfo && (
        <TextAreaInfo
          wordCount = {wordCount}
          backgroundColor = {backgroundColor}
          textColor = {textColor}
          fileName = {fileName}
        />
      )
  );

  // Show the line numbers if enabled
  const showLineCounterArea = () => (
    showInfo && (
      <LineCounterArea 
        content={content}
        lineCounterAreaRef={lineCounterAreaRef} 
      />
    )
  );

  return (
    <div className={`${height} ${width} p-4 ${bgColor}`}>
      <div className = "flex" style = {{ height: "95%", maxHeight: "800px" }}>
        {showLineCounterArea()}
        <textarea
          ref={textareaRef}
          className={`h-auto max-h-full flex-1 p-2 border border-gray-200 text-black resize-none overflow-y-scroll cursor-auto ${textColor} ${backgroundColor}`}
          style={{ whiteSpace: 'nowrap' }}
          value={content}
          onChange={handleInputChange}
          readOnly={setReadOnly}
        />
      </div>
      {showTextAreaInfo()}
    </div>
  );
};

export default TextArea;
