import React, {ChangeEventHandler, useMemo, useRef, useState } from "react";
import LineNumbersStyle, { css } from "styled-components";

const LineNumberDiv = LineNumbersStyle.div`
  border-radius: 2px;
  width: 100%;
  height: 400px;
`;

const sharedStyle = css`
  margin: 0;
  padding: 8px 0;
  height: 400px;
  border-radius: 0;
  resize: none;
  outline: none;
  font-family: monospace;
  font-size: 16px;
  line-height: 1.2;
  &:focus-visible {
    outline: none;
  }
`;

const StyledTextarea = LineNumbersStyle.textarea`
  ${sharedStyle}
  padding-left: 3rem;
  width: calc(100% - 3.5rem);
  border: none;
  textColor: text-black;
`;

const Numbers = LineNumbersStyle.div`
  ${sharedStyle}
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  text-align: right;
  box-shadow: none;
  position: absolute;
  color: grey;
  border-right: solid 2px;
  background-color: lightblue;
  padding: 8px;
  width: 2.5rem;
`;

const Number = LineNumbersStyle.div<{ active: boolean }>`
`;

const NumberedTextArea = ({value,numOfLines, backgroundColor, textColor = "text-black", name, allHandleChange, wordCount} : {value: string, numOfLines: number, backgroundColor: String, textColor: string, name?: string, allHandleChange ?: ChangeEventHandler, wordCount : number}) => {
  const lineNumber = useMemo(() => value.split("\n").length, [value]);
  const lineNumberArray = useMemo(
    () =>
      Array.from({ length: Math.max(numOfLines, lineNumber) }, (_, i) => i + 1),
    [lineNumber, numOfLines]
  );

  const lineNumberRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleTextareaScroll = () => {
    if (lineNumberRef.current && textareaRef.current) {
        lineNumberRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  return (
    <>
      <LineNumberDiv>
      <Numbers ref={lineNumberRef}>
        {lineNumberArray.map((count) => (
          <Number active={count <= lineNumber} key={count}>
            {count}
          </Number>
        ))}
      </Numbers>
      <StyledTextarea
      className = {`h-full w-full h-40 border border-gray-300 rounded p-2 ${textColor}`}
        name = {name}
        onChange = {allHandleChange}
        onScroll = {handleTextareaScroll}
        ref = {textareaRef}
        value = {value}
      />
      </LineNumberDiv>
      { name == "EA" &&
        <StyledTextarea 
            className = {`h-full w-full h-20 border border-gray-300 rounded p-2 ${textColor} ${backgroundColor}`}
            //className={`h-6 w-full ${textColor} `}
            readOnly = {true}
            value = {`${wordCount} words`}
        />
      }
    </>
  );
};

export default NumberedTextArea;