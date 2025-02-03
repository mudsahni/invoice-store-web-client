import React from 'react'
import {CollectionWithDocuments} from "@/types/collections";
import {FolderOpenIcon, PencilSquareIcon} from '@heroicons/react/20/solid'
import {CollectionStatusComponent} from "@/components/collection/utils";

export interface CollectionMetadataProps {
    collection: CollectionWithDocuments;
}

interface CollectionMetadataHeaderProps {
    collection: CollectionWithDocuments;
}

const CollectionMetadataHeader: React.FC<CollectionMetadataHeaderProps> = ({collection}) => {
    return (
        <div className="max-w-full">
            <div className="flex align-middle items-center mb-1 text-sky-800 justify-between">
                <div className="flex align-middle items-center">
                    <FolderOpenIcon className="sm:h-4 h-3 sm:mr-2 mr-1"/>
                    <span className="sm:text-sm text-xs tracking-wide font-semibold">Collection</span>
                </div>
                {
                    collection.updatedAt ? <em className="text-xs sm:pb-2">
                            Last Updated
                            On: {new Date(collection.updatedAt.seconds * 1000).toDateString()}
                        </em> :
                        <em className="text-xs sm:pb-2">
                            Created
                            On: {new Date(collection.createdAt.seconds * 1000).toDateString()}
                        </em>
                }
            </div>
            <div className="flex flex-wrap align-middle items-center justify-between max-w-full">
                <span className="truncate text-sky-900 text-xl sm:text-2xl/7 mb-1 sm:mb-0">{collection.name}</span>
                <CollectionStatusComponent status={collection.status} size={'large'}/>
            </div>
        </div>
    )
}

interface CollectionMetadataSectionProps {
    children: React.ReactNode;
}

const CollectionMetadataSection: React.FC<CollectionMetadataSectionProps> = ({children}) => {
    return (
        <div className="mt-8 divider divide-y divide-sky-900 divide-opacity-10">
            {children}
        </div>
    )
}

interface CollectionMetadataBadgeProps {
    title: string;
    labels: string[];
}

const CollectionMetadataBadge: React.FC<CollectionMetadataBadgeProps> = ({title, labels}) => {
    return (
        <div className="mt-2">
            <div className="mt-4 flex flex-wrap">
                {
                    labels.length > 0 ? labels.map((label, index) => (
                        <span
                            key={index}
                            className="items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20 mr-2 mb-2">
                        {label}
                    </span>
                    )) : (
                        <em className="text-sky-700 text-sm">{`No ${title} were found for this collection.`}</em>
                    )
                }
            </div>
        </div>
    )
}

interface CollectionMetadataSectionHeaderProps {
    title: string;
}

const CollectionMetadataSectionHeader: React.FC<CollectionMetadataSectionHeaderProps> = ({title}) => {
    return (
        <span className="text-sky-700 font-semibold">{title}</span>
    )
}

interface CollectionMetadataContentProps {
    collection: CollectionWithDocuments;
}

const CollectionMetadataContent: React.FC<CollectionMetadataContentProps> = ({collection}) => {
    return (
        <div>
            <CollectionMetadataHeader collection={collection}/>
            <CollectionMetadataSection>
                <CollectionMetadataSectionHeader title={"Type"}/>
                <CollectionMetadataBadge labels={[collection.type]} title={"types"}/>
            </CollectionMetadataSection>
            <CollectionMetadataSection>
                <CollectionMetadataSectionHeader title={"Number of Documents"}/>
                <div className="mt-2">
                    <div className="mt-4">
                        <span
                            className="text-sky-700 text-sm">
                            {Object.entries(collection.documents).length}
                        </span>
                    </div>
                </div>
            </CollectionMetadataSection>

            <CollectionMetadataSection>
                <div className="flex justify-between items-center align-middle">
                    <CollectionMetadataSectionHeader title={"Tags"}/>
                    <PencilSquareIcon
                        className="h-5 text-sky-700 text-opacity-80 hover:text-opacity-100 hover:bg-sky-100 rounded-lg cursor-pointer"/>
                </div>
                <CollectionMetadataBadge
                    labels={Object.entries(collection.tags).map(([key, value]) => `${key}: ${value}`)}
                    title={"tags"}/>
            </CollectionMetadataSection>
        </div>
    )
}
export const CollectionMetadata: React.FC<CollectionMetadataProps> = ({collection}) => {
    return (
        <div className="max-w-7xl mx-auto p-8">
            <div className="bg-sky-50 rounded-xl">
                <div className="flex flex-col p-8">
                    <CollectionMetadataContent collection={collection}/>
                </div>
            </div>
        </div>
    )
}