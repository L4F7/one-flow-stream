/**
 * @authors
 *  - Kenneth Alfaro Barboza
 *  - Luis Fuentes Fuentes
 *  - Luis Eduardo Restrepo Veintemilla
 *  - Maria Angelica Robles Azofeifa
 *  - Royer Zuñiga Villareal
 * @version 1.0.0
 */

interface LineCounterAreaProps {
    content: String;
    lineCounterAreaRef: React.RefObject<HTMLDivElement>;
}

const LineCounterArea: React.FC<LineCounterAreaProps> = ({
    content,
    lineCounterAreaRef,
}) => {
    return (
        <div
            className="bg-gray-200 text-gray-600 text-center overflow-y-scroll"
            ref={lineCounterAreaRef}
            style={{
                paddingTop: '10px',
                paddingBottom: '22px',
                minWidth: '40px',
                width: 'auto',
            }}
        >
            {/* Splits the content at each new line and adds a div with the according number */}
            {content.split('\n').map((_, index) => (
                <div key={index}>{index + 1}</div>
            ))}
        </div>
    );
};

export default LineCounterArea;
