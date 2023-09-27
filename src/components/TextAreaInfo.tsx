interface TextAreaInfoProps{
    wordCount: number;
    backgroundColor: string;
    textColor?: string;
    fileName?: string;
}

const TextAreaInfo: React.FC<TextAreaInfoProps> = ({wordCount, backgroundColor, textColor = "text-black",  fileName = ""}) => {

    const showFileName = fileName === "" ? "" : ` - File name: ${fileName}`;

    return (
        <textarea
        className = {`h-6 w-full ${textColor} ${backgroundColor}`}
        readOnly = {true}
        value = {`${wordCount} words ${showFileName} `}
      ></textarea>
    )
}

export default TextAreaInfo;
