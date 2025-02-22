import React from 'react'
import {allExpanded, defaultStyles, JsonView} from "react-json-view-lite";
import {StyleProps} from "react-json-view-lite/dist/DataRenderer";

interface RawContentViewerProps {
    loading: boolean;
    content: string;
}

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
                                                                {<JsonView
                                                                    data={JSON.stringify(JSON.parse(content), null, 2)}
                                                                    shouldExpandNode={allExpanded}
                                                                    style={customJsonViewStyles}/>}
                        {/*{JSON.stringify(value.data.raw, null, 2)}*/}
                                                            </pre>

            }
        </>
    )
}