import {NewCollectionContextProvider} from "@/components/parser/context/NewCollectionContextProvider";
import {NewCollectionTool} from "@/components/parser/NewCollectionTool";
import React from "react";


export const CreateNewCollection: React.FC = () => {
    return (
        <NewCollectionContextProvider>
            <NewCollectionTool />
        </NewCollectionContextProvider>
    )
}