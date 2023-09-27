"use client";
// components/TextArea.tsx

import React, { useState, useEffect, useRef, KeyboardEvent, ChangeEvent } from "react";
import { bgColor } from "../app/shared";
import TextAreaInfo from "./TextAreaInfo";
import LineCounterArea from './LineCounterArea';
import ListOfKeywords from './ListOfKeywords';
import mitt from "next/dist/shared/lib/mitt";

interface TextAreaProps {
  content: string;
  setContent: (e : string) => void;
  height?: String;
  width?: String;
  backgroundColor: string;
  textColor?: string;
  setReadOnly?: boolean;
  fileName?: string;
  showInfo?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({content, setContent, height = "", width = "", backgroundColor, textColor = "text-black", setReadOnly = false, fileName = "", showInfo = true}) => {

  const [text, setText] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [keywords, setKeywords] = useState<[]>([])
  const lineCounterAreaRef = useRef<HTMLDivElement | null>(null);
  const [wordCount, setWordCount] = useState<number>(0);
  const [shouldListAppear, setShouldListAppear] = useState<boolean>(false);
  const [candidateKeywords, setCandidateKeywords] = useState<string[]>([]);

  // Handle keywords when words are typed in, a selector will show up automatically suggesting words from keywords list
  const handleChange = (e : ChangeEvent<HTMLTextAreaElement>) => {
    const newText : string = e.target.value;
    setText(newText);
    setContent(newText);
    if(newText.length == 0 || candidateKeywords.length == 0) setShouldListAppear(false);

    const words : string[] = (text != null) ? newText.split(/\s+/) : [];
    const lastWord : string = words[words.length - 1];

    if(newText.length == 1){
      setCandidateKeywords( keywords.filter((keyword: string) => keyword.startsWith(lastWord)));
      setShouldListAppear(true);
    }
    else setCandidateKeywords(keywords.filter((keyword: string) => keyword.startsWith(lastWord)));

    if(candidateKeywords.length > 0) setShouldListAppear(true);

  }

  const handleOnKeyDown = (e : KeyboardEvent<HTMLTextAreaElement>) => {
    if(e.key === ' ' || e.key === 'Enter' || e.key === 'Backspace') setShouldListAppear(false);

  }

  // Handle function when keyword is selected, it will replace last word of the text with the selection
  const handleKeywordSelect = (keyword: string) => {

    const replacedText = text.replace(/\S+$/, keyword); // This line takes the last word from the TextArea and replaces it with the Keyword selected

    setText(replacedText);
    setContent(replacedText);
    setShouldListAppear(false);
  };

  // Function to count Words in the TextArea
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

  // Fetch Keywords from API service
  useEffect(() => {

    fetch(`api/keywords`)
    .then((response) => response.json())
    .then((data) => setKeywords(JSON.parse(data.keywords)))
    .catch((error) => console.error('Error fetching keywords:', error));

  }, []);

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
  const showNumbersArea = () => (
    showInfo && (
      <LineCounterArea 
        content={setReadOnly ? content : text}
        lineCounterAreaRef={lineCounterAreaRef} 
      />
    )
  );
  

  return (
    <div className={`${height} ${width} p-4 ${bgColor}`}>
      {shouldListAppear && candidateKeywords.length > 0 && (
        <ListOfKeywords
          keywords={candidateKeywords}
          onSelect={handleKeywordSelect}
        />
      )}
      <div className = "flex" style = {{ height: "95%", maxHeight: "800px" }}>

        {showNumbersArea()} 

        <textarea
          ref={textareaRef}
          className={`h-auto max-h-full flex-1 p-2 border border-gray-200 text-black resize-none overflow-y-scroll cursor-auto ${textColor} ${backgroundColor}`}
          //style={{ whiteSpace: 'nowrap' }}
          value={content}
          onKeyDown={handleOnKeyDown}
          onChange={handleChange}
          readOnly={setReadOnly}
        />
      </div>

      {showTextAreaInfo()}

    </div>
  );
};

export default TextArea;
