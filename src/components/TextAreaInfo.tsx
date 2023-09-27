import React, { ChangeEvent } from "react";

interface TextAreaInfoProps{
    setTypedFilename?: (e : string) => void;
    wordCount: number;
    backgroundColor: string;
    textColor?: string;
    fileName?: string;
    cursorPosition: number[];
    textAreaReadOnly?: boolean;
}

const TextAreaInfo: React.FC<TextAreaInfoProps> = ({setTypedFilename, wordCount, backgroundColor, textColor = "text-black",  fileName, cursorPosition, textAreaReadOnly = false}) => {

    const showFileName = ` - File name: ${fileName}`;
    const showCursorPosition = textAreaReadOnly ? "" : ` - Ln ${cursorPosition[0]}, Col ${cursorPosition[1]}`;

    const handleChange = (e : ChangeEvent<HTMLTextAreaElement>) => {
        let newFilename : string = e.target.value.split(': ')[1];
        if (newFilename === undefined) newFilename = '';
        if (setTypedFilename) {
            setTypedFilename(newFilename);
        }
      }

    return (
        <textarea
        onChange={handleChange}
        className = {`h-6 w-full ${textColor} ${backgroundColor}`}
        readOnly = {false}
        value = {`${wordCount} words ${showCursorPosition} ${showFileName}`}
      ></textarea>
    )
}

export default TextAreaInfo;
