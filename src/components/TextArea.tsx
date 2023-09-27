"use client";
// components/TextArea.tsx

import React, { useReducer, useEffect, useRef, KeyboardEvent, ChangeEvent } from "react";
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


  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const lineCounterAreaRef = useRef<HTMLDivElement | null>(null);

  // Define the types of actions that can be dispatched
  type ActionType =
  | "SET_TEXT"
  | "SET_KEYWORDS"
  | "SET_WORD_COUNT"
  | "SET_CURSOR_POSITION"
  | "SET_SHOULD_LIST_APPEAR"
  | "SET_CANDIDATE_KEYWORDS";


  // Define the types of state that can be used in the reducer
  interface State {
    text: string;
    keywords: string[];
    wordCount: number;
    cursorPosition: [number, number];
    shouldListAppear: boolean;
    candidateKeywords: string[];
  }

  // Define the initial state of the reducer
  const initialState: State = {
    text: "",
    keywords: [],
    wordCount: 0,
    cursorPosition: [0, 0],
    shouldListAppear: false,
    candidateKeywords: [],
  };

  interface Action {
    type: ActionType;
    value: any; 
  }

  const reducer = (state: State, { type, value }: Action): State => {
    switch (type) {
      case "SET_TEXT":
        return { ...state, text: value };
      case "SET_KEYWORDS":
        return { ...state, keywords: value };
      case "SET_WORD_COUNT":
        return { ...state, wordCount: value };
      case "SET_CURSOR_POSITION":
        return { ...state, cursorPosition: value };
      case "SET_SHOULD_LIST_APPEAR":
        return { ...state, shouldListAppear: value };
      case "SET_CANDIDATE_KEYWORDS":
        return { ...state, candidateKeywords: value };
      default:
        return state;
    }
  };

  const [ { text, keywords, wordCount, cursorPosition, shouldListAppear, candidateKeywords }, dispatch] = useReducer(reducer, initialState);

  // Handle keywords when words are typed in, a selector will show up automatically suggesting words from keywords list
  const handleChange = ({ target: { value } }: { target: { value: string } }) => {

    const newText : string = value;

    dispatch({ type: 'SET_TEXT', value: newText });
    setContent(newText);

    if(newText.length == 0 || candidateKeywords.length == 0) dispatch({ type: 'SET_SHOULD_LIST_APPEAR', value: false });

    const words : string[] = (text != null) ? newText.split(/\s+/) : [];
    const lastWord : string = words[words.length - 1];
    const filteredKeywords = keywords.filter((keyword: string) => keyword.startsWith(lastWord));

    dispatch({ type: 'SET_CANDIDATE_KEYWORDS', value: filteredKeywords });

    if (newText.length === 1 || filteredKeywords.length > 0) {
      dispatch({ type: 'SET_SHOULD_LIST_APPEAR', value: true })
    }

  }

  const handleOnKeyDown = (e : KeyboardEvent<HTMLTextAreaElement>) => {
    if(e.key === ' ' || e.key === 'Enter' || e.key === 'Backspace') dispatch({ type: 'SET_SHOULD_LIST_APPEAR', value: false });

  }

  // Handle function when keyword is selected, it will replace last word of the text with the selection
  const handleKeywordSelect = (keyword: string) => {

    const replacedText = text.replace(/\S+$/, keyword); // This line takes the last word from the TextArea and replaces it with the Keyword selected

    setContent(replacedText);
    dispatch({ type: 'SET_TEXT', value: replacedText });
    dispatch({ type: 'SET_SHOULD_LIST_APPEAR', value: false });
  };

  // Function to count Words in the TextArea
  const countWords = (validationText: string) => {

    // If the text is empty, set the word count to 0
    if (validationText === "") {
      dispatch({ type: 'SET_WORD_COUNT', value: 0 });
      return;
    }

    // remove all non-alphanumeric characters, newlines, and extra spaces
    const cleanText: string = validationText
      .replace(/[^a-zA-Z0-9\s]|\n| +/g, " ")
      .trim();

    // Count the number of spaces in the text and add 1 to get the word count
    const newWordCount = (cleanText.match(/ /g) || []).length + 1;
    dispatch({ type: 'SET_WORD_COUNT', value: newWordCount });
  };

  // Fetch Keywords from API service
  useEffect(() => {

    fetch(`api/keywords`)
    .then((response) => response.json())
    .then((data) => dispatch({type: 'SET_KEYWORDS', value: JSON.parse(data.keywords)}))
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
      dispatch({ type: 'SET_CURSOR_POSITION', value: currentPosition });
    }
  };

  // Determine if the text should wrap or not
  const shouldWrap = () => setReadOnly ? "whitespace-pre-wrap" : "whitespace-nowrap";
  
  return (
    <div className={`${height} ${width} p-4 ${bgColor}`}>
      {shouldListAppear && candidateKeywords.length > 0 && ( // If shouldListAppear is true, show the ListOfKeywords
        <ListOfKeywords
          keywords={candidateKeywords}
          onSelect={handleKeywordSelect}
        />
      )}
      <div className = "flex" style = {{ height: "95%", maxHeight: "800px" }}>

        {showInfo && ( // If showInfo is true, show the LineCounterArea
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

      {showInfo && ( // If showInfo is true, show the TextAreaInfo
        <TextAreaInfo
          wordCount = {wordCount}
          backgroundColor = {backgroundColor}
          textColor = {textColor}
          fileName = {fileName}
          cursorPosition = {cursorPosition}
          textAreaReadOnly = {setReadOnly}
        />
      )}

    </div>
  );
};

export default TextArea;
