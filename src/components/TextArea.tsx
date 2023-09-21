import { ChangeEventHandler } from 'react'

const TextArea = ({keywordsList, backgroundColor, textColor = "text-black", setReadOnly = false, valueReceived ,handleInputChange}: {keywordsList?: Array<String>, backgroundColor: String; textColor?: String; setReadOnly?: boolean, valueReceived ?: string, handleInputChange ?: ChangeEventHandler}) => {

    return <textarea 
        className={`h-full w-full h-40 border border-gray-300 rounded p-2 ${textColor} ${backgroundColor}`} 
        readOnly = {setReadOnly}
        value = {valueReceived}
        onChange = {handleInputChange}> 
    </textarea>;
}

export default TextArea;