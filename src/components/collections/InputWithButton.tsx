import React, {useState} from 'react';
import {PencilSquareIcon, PlusIcon, XMarkIcon} from '@heroicons/react/20/solid';
import {LoadingSpinner} from '@/components/LoadingSpinner';
import {useNewCollectionContext} from "@/components/collections/context/NewCollectionContext";

interface Tag {
    key: string;
    value: string;
}

interface InputWithButtonProps {
    loading: boolean;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
}

const CollectionTypeOptions = [
    'Invoice'
];

export const InputWithButton: React.FC<InputWithButtonProps> = ({
                                                                    loading,
                                                                    handleSubmit
                                                                }) => {
    const {
        collectionName,
        setCollectionName,
        setShowError
    } = useNewCollectionContext();

    const [collectionType, setCollectionType] = useState(CollectionTypeOptions[0]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [newTagKey, setNewTagKey] = useState('');
    const [newTagValue, setNewTagValue] = useState('');
    const [showTagInput, setShowTagInput] = useState(false);

    const handleAddTag = () => {
        if (newTagKey && newTagValue) {
            setTags([...tags, {key: newTagKey, value: newTagValue}]);
            setNewTagKey('');
            setNewTagValue('');
            setShowTagInput(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShowError(false)
        setCollectionName(e.target.value)
    }

    const handleRemoveTag = (index: number) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleSubmit(e);
    };

    return (
        <form className="w-full mx-auto">
            <div className="rounded-lg space-y-6">
                <div className="w-full flex space-x-4 align-middle items-center justify-between">
                    {/* Collection Type Dropdown */}
                    <div className="space-y-2 w-full">
                        <label className="block text-gray-700 text-sm font-medium">
                            Collection Type
                        </label>
                        <select
                            value={collectionType}
                            onChange={(e) => setCollectionType(e.target.value)}
                            className="w-full bg-white rounded-lg border border-gray-200 p-3 text-gray-900 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-200"
                        >
                            {CollectionTypeOptions.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Collection Name Input */}
                    <div className="space-y-2 w-full">
                        <label className="block text-gray-700 text-sm font-medium">
                            Collection Name
                        </label>
                        <div
                            className="flex items-center bg-white rounded-lg border border-gray-200 p-3 focus-within:ring-2 focus-within:ring-sky-500/20 focus-within:border-sky-500 transition-all duration-200">
                            <PencilSquareIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-500"/>
                            <input
                                type="text"
                                value={collectionName}
                                onChange={(e) => setCollectionName(e.target.value)}
                                placeholder="Enter collection name"
                                className="flex-1 ml-3 outline-none text-gray-900 placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                </div>

                {/* Tags Section */}
                <div className="space-y-2">
                    <label className="block text-gray-700 text-sm font-medium">
                        Tags
                    </label>
                    <div className="space-y-3">
                        {/* Existing Tags */}
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, index) => (
                                <div
                                    key={index}
                                    className="group bg-white border border-gray-200 rounded-lg px-3 py-2 flex items-center gap-2 hover:border-gray-300 transition-colors duration-200"
                                >
                                    <span className="text-gray-900 text-sm">
                                        {tag.key}: <span className="font-medium">{tag.value}</span>
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(index)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <XMarkIcon
                                            className="h-4 w-4 hover:scale-110 transition-transform duration-200"/>
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add Tag Button or Input Fields */}
                        {!showTagInput ? (
                            <button
                                type="button"
                                onClick={() => setShowTagInput(true)}
                                className="flex items-center text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200"
                            >
                                <PlusIcon className="h-4 w-4 mr-2"/>
                                <span className="text-sm font-medium">Add Tag</span>
                            </button>
                        ) : (
                            <div className="flex gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <input
                                    type="text"
                                    value={newTagKey}
                                    onChange={(e) => setNewTagKey(e.target.value)}
                                    placeholder="Key"
                                    className="flex-1 bg-white rounded-lg border border-gray-200 px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-200"
                                />
                                <input
                                    type="text"
                                    value={newTagValue}
                                    onChange={(e) => setNewTagValue(e.target.value)}
                                    placeholder="Value"
                                    className="flex-1 bg-white rounded-lg border border-gray-200 px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-200"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddTag}
                                    className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors duration-200 font-medium"
                                >
                                    Add
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    onClick={handleSubmit}
                    className={`
                        w-full px-4 py-3 rounded-lg font-medium 
                        flex items-center justify-center gap-2
                        transition-all duration-200
                        ${loading
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-800 font-semibold shadow-sm hover:shadow'
                    }
                    `}
                >
                    {loading ? (
                        <>
                            <LoadingSpinner size={4}/>
                            <span>Processing...</span>
                        </>
                    ) : (
                        <>
                            <PlusIcon className="h-5 w-5"/>
                            <span>Create Collection</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default InputWithButton;