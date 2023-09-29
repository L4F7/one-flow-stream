/**
 * @authors
 *  - Kenneth Alfaro Barboza
 *  - Luis Fuentes Fuentes
 *  - Luis Eduardo Restrepo Veintemilla
 *  - Maria Angelica Robles Azofeifa
 *  - Royer Zuñiga Villareal
 * @version 1.0.0
 */

interface TextAreaInfoProps {
    setTypedFilename?: (e: string) => void;
    wordCount: number;
    backgroundColor: string;
    textColor?: string;
    fileName?: string;
    cursorPosition: number[];
    textAreaReadOnly?: boolean;
}

const TextAreaInfo: React.FC<TextAreaInfoProps> = ({
    setTypedFilename,
    wordCount,
    backgroundColor,
    textColor = 'text-black',
    fileName,
    cursorPosition,
    textAreaReadOnly = false,
}) => {
    const showFileName = ` - File name: ${fileName}`;
    const showCursorPosition = textAreaReadOnly
        ? ''
        : ` - Ln ${cursorPosition[0]}, Col ${cursorPosition[1]}`;

    const handleChange = ({
        target: { value },
    }: {
        target: { value: string };
    }) => {
        let newFilename: string = value.split(': ')[1];
        if (newFilename === undefined) newFilename = '';

        if (setTypedFilename) {
            setTypedFilename(newFilename);
        }
    };

    return (
        <textarea
            onChange={handleChange}
            className={`h-6 w-full ${textColor} ${backgroundColor}`}
            readOnly={false}
            value={`${wordCount} words ${showCursorPosition} ${showFileName}`}
        ></textarea>
    );
};

export default TextAreaInfo;
