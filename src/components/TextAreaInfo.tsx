interface TextAreaInfoProps{
    wordCount: number;
    backgroundColor: string;
    textColor?: string;
    fileName?: string;
    cursorPosition: number[];
    textAreaReadOnly?: boolean;
}

const TextAreaInfo: React.FC<TextAreaInfoProps> = ({wordCount, backgroundColor, textColor = "text-black",  fileName = "", cursorPosition, textAreaReadOnly = false}) => {

    const showFileName = fileName === "" ? "" : ` - File name: ${fileName}`;
    const showCursorPosition = textAreaReadOnly ? "" : ` - Ln ${cursorPosition[0]}, Col ${cursorPosition[1]}`;

    return (
        <textarea
        className = {`h-6 w-full ${textColor} ${backgroundColor}`}
        readOnly = {true}
        value = {`${wordCount} words ${showCursorPosition} ${showFileName}`}
      ></textarea>
    )
}

export default TextAreaInfo;
