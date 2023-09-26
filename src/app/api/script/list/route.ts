import { readdir } from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
    const directoryPath = path.resolve(`./src/app/api/script`);

    try {
        const files = (await readdir(directoryPath, 'utf8')).filter(file => file.endsWith('.js'));
        const jsonFiles = JSON.stringify(files);
        return new Response(jsonFiles, { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error(error)
        return new Response('Error reading the directory', { status: 500 });
    }
  }