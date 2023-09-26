import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    try {
        const content = await request.text();
        const filePath = path.resolve(`./src/app/api/script/4.js`);

        await writeFile(filePath, content, 'utf-8');
        return new Response('File created successfully.', { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response('Error saving the file', { status: 500 });
    }
}