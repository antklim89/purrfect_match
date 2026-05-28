export declare function uploadImages({ images, folderPath, folderUrl, }: {
    images: File[];
    folderPath: string;
    folderUrl: string;
}): Promise<{
    fileName: string;
    filePath: string;
    fileUrl: string;
    blurDataUrl: string;
}[]>;
