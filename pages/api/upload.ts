import { NextApiRequest, NextApiResponse } from 'next';
import { Web3Storage, File } from 'web3.storage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const requestMethod = req.method;
    const client = new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3_STORAGE_API_KEY ?? "" });
    const bodyOfImage: string = JSON.parse(req.body).bodyOfImage;
    // Convert the base64 image to a Blob
    const mimeType = bodyOfImage.match(/^data:([^;]+)/)?.[1];
    const byteCharacters = atob(bodyOfImage.replace(/^data:image\/\w+;base64,/, ''));
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: mimeType });

    // Create a File object from the Blob
    const file = new File([blob], 'example.png', { type: mimeType });

    // Create an array of files to upload
    const files = [file];

    // Upload the files to web3.storage

    if (requestMethod == "POST") {
        const cid = await client.put(files);
        console.log(cid);
        res.json({cid});
    }
}