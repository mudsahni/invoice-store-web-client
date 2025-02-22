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
            <div className="rounded-lg py-6 space-y-6">
                {/* Collection Name Input */}
                <div className="space-y-2">
                    <label className="block text-sky-800 text-base font-medium">
                        Collection Name
                    </label>
                    <div className="flex items-center bg-white rounded-lg border border-sky-200 p-2">
                        <PencilSquareIcon className="h-5 w-5 text-sky-800 mr-2"/>
                        <input
                            type="text"
                            value={collectionName}
                            onChange={(e) => setCollectionName(e.target.value)}
                            placeholder="Enter collection name"
                            className="flex-1 outline-none text-sky-800 placeholder-sky-800 placeholder-opacity-40"
                        />
                    </div>
                </div>

                {/* Collection Type Dropdown */}
                <div className="space-y-2">
                    <label className="block text-sky-800 text-base font-medium">
                        Collection Type
                    </label>
                    <select
                        value={collectionType}
                        onChange={(e) => setCollectionType(e.target.value)}
                        className="w-full bg-white rounded-lg border border-sky-200 p-2 text-sky-800 outline-none"
                    >
                        {CollectionTypeOptions.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Tags Section */}
                <div className="space-y-2">
                    <label className="block text-sky-800 text-base font-medium">
                        Tags
                    </label>
                    <div className="space-y-3">
                        {/* Existing Tags */}
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, index) => (
                                <div
                                    key={index}
                                    className="bg-sky-100 text-sky-800 pr-2 py-1 rounded-full flex items-center"
                                >
                      <span
                          className="py-2 px-3 bg-yellow-50 rounded-md text-yellow-800 font-semibold text-base border-yellow-800 border-2 border-dashed">{tag.key}: {tag.value}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(index)}
                                        className="ml-2 text-sky-800 hover:text-sky-700"
                                    >
                                        <XMarkIcon
                                            className="h-5 w-5 hover:scale-110 transition-transform duration-500"/>
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add Tag Button or Input Fields */}
                        {!showTagInput ? (
                            <button
                                type="button"
                                onClick={() => setShowTagInput(true)}
                                className="flex items-center text-sky-600 hover:text-sky-800"
                            >
                                <PlusIcon className="h-4 w-4 mr-1"/>
                                <span className="text-base">Add Tag</span>
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newTagKey}
                                    onChange={(e) => setNewTagKey(e.target.value)}
                                    placeholder="Key"
                                    className="flex-1 bg-white rounded-lg border border-sky-200 p-2 text-sky-800 outline-none"
                                />
                                <input
                                    type="text"
                                    value={newTagValue}
                                    onChange={(e) => setNewTagValue(e.target.value)}
                                    placeholder="Value"
                                    className="flex-1 bg-white rounded-lg border border-sky-200 p-2 text-sky-800 outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddTag}
                                    className="bg-sky-700 text-white px-4 py-2 rounded-lg hover:bg-sky-800"
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
                    className={`w-full ${
                        loading
                            ? 'bg-gray-50 border-gray-400 '
                            : 'bg-green-50 hover:bg-green-100 border-green-800'
                    } border-2 font-semibold rounded-lg py-3 flex items-center justify-center`}
                >
                    {(
                        <span
                            className={`${loading ? 'text-gray-400' : 'text-green-800'} flex justify-center space-x-2 align-middle items-center`}>
                            {loading ? <LoadingSpinner size={4}/> :
                                <PlusIcon className="h-5 w-5 mr-2"/>}
                            <span>Create Collection</span>
                        </span>
                    )}
                </button>
            </div>
        </form>
    );
};

export default InputWithButton;