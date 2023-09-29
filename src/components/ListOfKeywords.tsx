/**
 * @authors
 *  - Kenneth Alfaro Barboza
 *  - Luis Fuentes Fuentes
 *  - Luis Eduardo Restrepo Veintemilla
 *  - Maria Angelica Robles Azofeifa
 *  - Royer Zuñiga Villareal
 * @version 1.0.0
 */

interface ListOfKeywordsProps {
    keywords: Array<string>;
    onSelect: (e: string) => void;
}

const ListOfKeywords: React.FC<ListOfKeywordsProps> = ({
    keywords,
    onSelect,
}) => {
    keywords = ['Suggestions', ...keywords];
    return (
        <select
            className="text-black"
            value={keywords[0]}
            onChange={(e) => {
                return onSelect(e.target.value);
            }}
        >
            {keywords.map((keyword) => (
                <option key={keyword} value={keyword}>
                    {keyword}
                </option>
            ))}
        </select>
    );
};

export default ListOfKeywords;
