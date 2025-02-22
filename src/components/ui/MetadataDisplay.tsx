import React from 'react';
import {FolderOpen, Pencil} from 'lucide-react';
import {CollectionWithDocuments} from "@/types/collections";
import {FolderOpenIcon} from "@heroicons/react/20/solid";
import {CollectionStatusComponent} from "@/components/collection/utils";

interface MetadataItem {
    id: string;
    label: string;
    value: string | string[] | undefined;
    editable?: boolean;
    onEdit?: () => void;
}

interface MetadataDisplayProps {
    name: string;
    type: string;
    icon: React.ReactNode;
    date: string;
    status: React.ReactNode;
    headerContent?: React.ReactNode;
    items: MetadataItem[];
    className?: string;
    badgeClassName?: string;
    iconClassName?: string;
    headerClassName?: string;
    sectionClassName?: string;
}

const MetadataBadge: React.FC<{
    label: string | undefined;
    className?: string;
}> = ({label, className = ""}) => (
    <span
        className={`items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20 mr-2 mb-2 ${className}`}
    >
    {label}
  </span>
);

const MetadataSection: React.FC<{
    item: MetadataItem;
    badgeClassName?: string;
    sectionClassName?: string;
    onEdit?: () => void;
}> = ({item, badgeClassName, sectionClassName, onEdit}) => {
    const values = Array.isArray(item.value) ? item.value : [item.value];

    return (
        <div className={`mt-8 divider divide-y divide-sky-900 divide-opacity-10 ${sectionClassName}`}>
            <div className="flex justify-between items-center align-middle">
                <span className="text-sky-700 font-semibold">{item.label}</span>
                {item.editable && (
                    <Pencil
                        onClick={onEdit}
                        className="h-5 w-5 text-sky-700 text-opacity-80 hover:text-opacity-100 hover:bg-sky-100 rounded-lg cursor-pointer"
                    />
                )}
            </div>
            <div className="mt-2">
                <div className="mt-4 flex flex-wrap">
                    {values.length > 0 ? (
                        values.map((value, index) => (
                            <MetadataBadge
                                key={`${item.id}-${index}`}
                                label={value}
                                className={badgeClassName}
                            />
                        ))
                    ) : (
                        <em className="text-sky-700 text-sm">{`No ${item.label.toLowerCase()} available.`}</em>
                    )}
                </div>
            </div>
        </div>
    );
};

interface MetadataHeaderProps {
    icon: React.ReactNode;
    type: string;
    title: string;
    date: string;
    status: React.ReactNode;
}

export const MetadataHeader: React.FC<MetadataHeaderProps> = ({
                                                                  icon,
                                                                  type,
                                                                  title,
                                                                  date,
                                                                  status
                                                              }) => {
    return (
        <div className="max-w-full">
            <div className="flex align-middle items-center mb-1 text-sky-800 justify-between">
                <div className="flex align-middle items-center truncate">
                    {icon}
                    <span className="sm:text-sm text-xs tracking-wide font-semibold">{type}</span>
                </div>
                <em className="text-xs sm:pb-2 truncate">
                    Last Updated On: {date}
                </em>
            </div>
            <div className="flex flex-wrap align-middle items-center justify-between max-w-full">
                <span className="truncate text-sky-900 text-xl sm:text-2xl/7 mb-1 sm:mb-0">{title}</span>
                {status}
            </div>
        </div>
    )
}

export const MetadataDisplay: React.FC<MetadataDisplayProps> = ({
                                                                    type,
                                                                    name,
                                                                    date,
                                                                    status,
                                                                    icon = <FolderOpen/>,
                                                                    headerContent,
                                                                    items,
                                                                    className = "",
                                                                    badgeClassName = "",
                                                                    iconClassName = "",
                                                                    headerClassName = "",
                                                                    sectionClassName = "",
                                                                }) => {
    return (
        <div className={`p-8 bg-sky-50 rounded-xl ${className}`}>
            <MetadataHeader icon={icon} type={type} title={name} date={date} status={status}/>

            {items.map((item) => (
                <MetadataSection
                    key={item.id}
                    item={item}
                    badgeClassName={badgeClassName}
                    sectionClassName={sectionClassName}
                    onEdit={item.editable ? item.onEdit : undefined}
                />
            ))}
        </div>
    );
};
