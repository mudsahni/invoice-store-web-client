export interface PDFFile {
    id: string;
    selected: boolean;
    name: string;
    webkitRelativePath: string;
    type: string;
    size: number;
    lastModified: number;
    file: File;  // Store the actual File object
    fileType: string;
}

export interface ProcessedData {
    [filename: string]: any;  // The parsed JSON data for each file
}
