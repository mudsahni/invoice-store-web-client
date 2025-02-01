// Create the context
import {createContext, useContext} from "react";
import {NewCollectionContextType} from "@/components/collections/context/NewCollectionContextType";

export const NewCollectionContext = createContext<NewCollectionContextType | undefined>(undefined);

export const useNewCollectionContext = () => {
    const context = useContext(NewCollectionContext);
    if (context === undefined) {
        throw new Error('useShared must be used within a NewCollectionContextProvider');
    }
    return context;
};

