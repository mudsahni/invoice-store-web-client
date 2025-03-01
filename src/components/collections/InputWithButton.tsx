import React, {useState} from 'react';
import {Check, Tag, Plus, X, Loader2} from 'lucide-react';
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
        setShowError(false);
        setCollectionName(e.target.value);
    };

    const handleRemoveTag = (index: number) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleSubmit(e);
    };

    return (
        <form className="w-full mt-6" onSubmit={handleFormSubmit}>
            <div className="space-y-6">
                {/* Collection Details Section */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
                    <h2 className="text-lg font-medium text-gray-800 mb-4">Collection Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Collection Type */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Collection Type
                            </label>
                            <div className="relative">
                                <select
                                    value={collectionType}
                                    onChange={(e) => setCollectionType(e.target.value)}
                                    className="w-full bg-white rounded-lg border border-gray-300 py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all appearance-none"
                                >
                                    {CollectionTypeOptions.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M19 9l-7 7-7-7"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Collection Name */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Collection Name
                            </label>
                            <input
                                type="text"
                                value={collectionName}
                                onChange={handleInputChange}
                                placeholder="Enter collection name"
                                className="w-full bg-white rounded-lg border border-gray-300 py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Tags Section */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium text-gray-800">Tags</h2>
                    </div>

                    {/* Existing Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {tags.map((tag, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-1 bg-gray-100 text-gray-800 rounded-lg px-3 py-1.5 text-sm"
                            >
                                <Tag className="h-3.5 w-3.5 text-gray-500"/>
                                <span>
                  {tag.key}: <span className="font-medium">{tag.value}</span>
                </span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTag(index)}
                                    className="ml-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    <X className="h-3.5 w-3.5"/>
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Add Tag Button or Input Fields */}
                    {!showTagInput ? (
                        <button
                            type="button"
                            onClick={() => setShowTagInput(true)}
                            className="flex items-center text-sm text-sky-600 hover:text-sky-800 transition-colors"
                        >
                            <Plus className="h-4 w-4 mr-1"/>
                            <span>Add Tag</span>
                        </button>
                    ) : (
                        <div
                            className="flex flex-col sm:flex-row gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <input
                                type="text"
                                value={newTagKey}
                                onChange={(e) => setNewTagKey(e.target.value)}
                                placeholder="Key"
                                className="flex-1 bg-white rounded-lg border border-gray-300 py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                            />
                            <input
                                type="text"
                                value={newTagValue}
                                onChange={(e) => setNewTagValue(e.target.value)}
                                placeholder="Value"
                                className="flex-1 bg-white rounded-lg border border-gray-300 py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                            />
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleAddTag}
                                    className="px-3 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-medium text-sm"
                                >
                                    Add
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowTagInput(false)}
                                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Create Collection Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`
            w-full p-3 rounded-lg font-medium text-center
            transition-all duration-200
            ${loading
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-sky-600 text-white hover:bg-sky-700 shadow-sm hover:shadow'
                    }
          `}
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <Loader2 className="h-5 w-5 mr-2 animate-spin"/>
                            <span>Creating Collection...</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center">
                            <Check className="h-5 w-5 mr-2"/>
                            <span>Create Collection</span>
                        </div>
                    )}
                </button>
            </div>
        </form>
    );
};

export default InputWithButton;