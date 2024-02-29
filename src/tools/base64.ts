// Contains function to convert file to base64.
export function getBase64(data: File){
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(data as File);

        reader.onerror = function (error) {
            console.error('Error: ', error);
            reject(error);
        }

        reader.onload = function () {
            console.debug('Base64: ', reader.result);
            resolve(reader.result);
        }
    });
}