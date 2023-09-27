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
  setTypedFilename?: (e : string) => void;
  height?: String;
  width?: String;
  backgroundColor: string;
  textColor?: string;
  setReadOnly?: boolean;
  fileName?: string;
  showInfo?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({content, setContent, setTypedFilename, height = "", width = "", backgroundColor, textColor = "text-black", setReadOnly = false, fileName, showInfo = true}) => {

  const [text, setText] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [keywords, setKeywords] = useState<[]>([])
  const lineCounterAreaRef = useRef<HTMLDivElement | null>(null);
  const [wordCount, setWordCount] = useState<number>(0);
  const [shouldListAppear, setShouldListAppear] = useState<boolean>(false);
  const [candidateKeywords, setCandidateKeywords] = useState<string[]>([]);
  const [cursorPosition, setCursorPosition] = useState<number[]>([0, 0]);

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


  // Calculate the cursor position
  const calculateCursorPosition = (text: string, selectionStart: number) => {
    const textLines = text.slice(0, selectionStart).split('\n');
    const currentLineNumber = textLines.length;
    const currentColumnIndex = textLines[currentLineNumber - 1].length;
    return [currentLineNumber, currentColumnIndex + 1];
  };

  // Get the line number and column index of the cursor
  // Reference: http://web.archive.org/web/20090221140237/http://www.dedestruct.com/2008/03/22/howto-cross-browser-cursor-position-in-textareas/
  const setLineNumberAndColumnNumber = () => {
    if (textareaRef.current) {
      const textAreaValue = textareaRef.current.value;
      const currentPosition = calculateCursorPosition(textAreaValue, textareaRef.current.selectionStart);
      setCursorPosition(currentPosition);
    }
  };

  // Determine if the text should wrap or not
  const shouldWrap = () => setReadOnly ? "whitespace-pre-wrap" : "whitespace-nowrap";

  return (
    <div className={`${height} ${width} p-4 ${bgColor}`}>
      {shouldListAppear && candidateKeywords.length > 0 && (
        <ListOfKeywords
          keywords={candidateKeywords}
          onSelect={handleKeywordSelect}
        />
      )}
      <div className = "flex" style = {{ height: "95%", maxHeight: "800px" }}>

        {showInfo && (
          <LineCounterArea
            content={setReadOnly ? content : text}
            lineCounterAreaRef={lineCounterAreaRef}
          />
        )}

        <textarea
          ref={textareaRef}
          className={`h-auto max-h-full flex-1 p-2 border border-gray-200 text-black resize-none overflow-y-scroll cursor-auto ${textColor} ${backgroundColor} ${shouldWrap()}`}
          value={content}
          onKeyDown={handleOnKeyDown}
          onChange={handleChange}
          readOnly={setReadOnly}
          onKeyUp={setLineNumberAndColumnNumber}
          onMouseUp={setLineNumberAndColumnNumber}
        />
      </div>

      {showInfo && (
        <TextAreaInfo
          setTypedFilename = {setTypedFilename}
          wordCount = {wordCount}
          backgroundColor = {backgroundColor}
          textColor = {textColor}
          fileName = {fileName}
          cursorPosition = {cursorPosition}
          textAreaReadOnly = {false}
        />
      )}

    </div>
  );
};

export default TextArea;
