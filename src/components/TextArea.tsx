'use client'
import {useState, useRef} from 'react'
import {bgColor} from '../app/shared'

const TextArea = ({ height = "", width = "", backgroundColor, textColor = "text-black", setReadOnly = false }: { height?: String; width?: String; backgroundColor: string; textColor?: string; setReadOnly?: boolean }) => {
    const [wordCount, setWordCount] = useState(0);
    const ref = useRef<HTMLTextAreaElement | null>(null);

    const handleChange = () => {

        if (!ref.current) return; 
        
        if (ref.current.value === "") { 
            setWordCount(0);
            return;
        }

        const text : string = ref.current.value;
        const cleanText : string = text.replace(/[^a-zA-Z0-9\s]|\n| +/g, ' ').trim(); // remove all non-alphanumeric characters, newlines, and extra spaces
        const newWordCount = (cleanText.match(/ /g) || []).length + 1;
        setWordCount(newWordCount);
    };

    return (<div className={`${height} ${width} p-4 ${bgColor}`}>
            <textarea
                className={`h-80 w-full h-40 border border-gray-300 rounded p-2 ${textColor} ${backgroundColor}`}
                readOnly={setReadOnly}
                ref={ref}
                onChange={()=>{handleChange}}
            ></textarea>
            <textarea 
                className={`h-6 w-full ${textColor} ${backgroundColor}`}
                readOnly={true}
                value={`${wordCount} words`}
            ></textarea>
        </div>
    );
};

export default TextArea;