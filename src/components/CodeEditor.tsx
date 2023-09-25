'use client'
// components/CodeEditor.tsx

import React, { useState, useEffect, useRef, ChangeEventHandler } from 'react';
import {bgColor} from '../app/shared'

interface CodeEditorProps {
  content : string;
  wordCount :  number;
  handleTextareaChange : ChangeEventHandler;
  height? : String; 
  width? : String; 
  backgroundColor : string; 
  textColor? : string; 
  setReadOnly? : boolean
}

const CodeEditor: React.FC<CodeEditorProps> = ({ content, wordCount, handleTextareaChange, height = "", width = "", backgroundColor, textColor = "text-black", setReadOnly = false }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const lineNumbersRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    const lineNumbers = lineNumbersRef.current;
  
    // Synchronize scrolling of textarea and line numbers
    const handleScroll = () => {
      if (textarea && lineNumbers) {
        lineNumbers.scrollTop = textarea.scrollTop;
      }
    };
  
    if (textarea) {
      textarea.addEventListener('scroll', handleScroll);
    }
  
    return () => {
      if (textarea) {
        textarea.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);


  return (
    <div className={`${height} ${width} p-4 ${bgColor}`}>
      <div className="flex" style={{ height: '95%', maxHeight: '800px' }}>
        <div className="w-10 bg-gray-200 text-gray-600 text-center overflow-y-scroll" ref={lineNumbersRef} style={{ paddingTop: '8px' }}>
          {/* Line numbers */}
          {content.split('\n').map((_, index) => (
            <div key={index}>
              {index + 1}
            </div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          className="h-auto max-h-full flex-1 p-2 border border-gray-200 text-black resize-none overflow-y-scroll cursor-auto"
          value={content}
          onChange={handleTextareaChange}
          readOnly={setReadOnly}
        />
      </div>
      <textarea 
            className={`h-6 w-full ${textColor} ${backgroundColor}`}
            readOnly={true}
            value={`${wordCount} words`}
        ></textarea>
    </div>
  );
};

export default CodeEditor;