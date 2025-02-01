import {NewCollectionContextProvider} from "@/components/collections/context/NewCollectionContextProvider";
import {NewCollectionTool} from "@/components/collections/NewCollectionTool";
import React from "react";


export const CreateNewCollection: React.FC = () => {
    return (
        <NewCollectionContextProvider>
            <NewCollectionTool />
        </NewCollectionContextProvider>
    )
}