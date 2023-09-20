const TextArea = ({backgroundColor, textColor = "text-black", setReadOnly = false}: {backgroundColor: String; textColor?: String; setReadOnly?: boolean}) => {
    return <textarea 
        className={`h-full w-full h-40 border border-gray-300 rounded p-2 ${textColor} ${backgroundColor}`} 
        readOnly = {setReadOnly}> 
    </textarea>;
}

export default TextArea;