/**
 * 格式化文件大小
 * @param size 文件大小，单位为字节 File.size
 * @returns 格式化后的文件大小，单位可能为B、KB、MB、GB或TB
 */
export function formatFileSize(size: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return size.toFixed(2) + ' ' + units[unitIndex];
}