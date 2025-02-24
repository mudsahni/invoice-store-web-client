import React from 'react'
import {allExpanded, defaultStyles, JsonView} from "react-json-view-lite";
import {StyleProps} from "react-json-view-lite/dist/DataRenderer";

interface RawContentViewerProps {
    loading: boolean;
    content: string;
}

interface SafeJsonViewProps {
    rawData: any;
    allExpanded?: boolean;
    customJsonViewStyles?: Record<string, any>;
}

interface DocumentData {
    data: {
        raw: string | Record<string, any> | null;
    };
    // Add other properties your document data has
}

const SafeJsonView: React.FC<SafeJsonViewProps> = ({
                                                       rawData,
                                                       customJsonViewStyles = {}
                                                   }) => {

    try {
        // First try to parse if it's a string
        const parsedData = typeof rawData === 'string'
            ? JSON.parse(rawData)
            : rawData;

        return (
            <JsonView
                data={parsedData}
                shouldExpandNode={() => true}
                style={customJsonViewStyles}
            />
        );
    } catch (error) {
        // console.error('JSON Parse Error:', error);

        return (
            <>
                <div className="text-red-500 mb-2 p-2 bg-red-50 rounded">
                    Error parsing JSON data
                </div>
                <div className="whitespace-pre-wrap font-mono text-sm">
                    {typeof rawData === 'string' ? rawData : JSON.stringify(rawData, null, 2)}
                </div>
            </>
        );
    }
};

const customJsonViewStyles: StyleProps = {
    ...defaultStyles,  // Spread the default styles if you want to keep some
    container: 'bg-white rounded-xl',
    label: 'text-gray-800 mr-2',
    numberValue: 'text-red-700',
};

export const RawContentViewer: React.FC<RawContentViewerProps> = ({loading, content}) => {
    return (
        <>
            {
                loading ? <div>Loading...</div> :
                    <pre
                        className="bg-white rounded-xl p-4 overflow-auto overflow-y-scroll max-h-screen w-full">
                                                                                <SafeJsonView
                                                                                    rawData={content ?? {}}
                                                                                    customJsonViewStyles={{
                                                                                        // Your custom styles
                                                                                    }}
                                                                                />

                        {/*{<JsonView*/}
                        {/*                                                data={JSON.stringify(JSON.parse(content), null, 2)}*/}
                        {/*                                                shouldExpandNode={allExpanded}*/}
                        {/*                                                style={customJsonViewStyles}/>}*/}
                        {/*    /!*{JSON.stringify(value.data.raw, null, 2)}*!/*/}
                                                            </pre>

            }
        </>
    )
}