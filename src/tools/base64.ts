// Contains function to convert file to base64.
export function getBase64(data: File): Promise<string>{
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(data as File);

        reader.onerror = function (error) {
            console.error('Error: ', error);
            reject(error);
        }

        reader.onload = function () {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject('Failed to read file as base64 string');
            }
        }
    });
}