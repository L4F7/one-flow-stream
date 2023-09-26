import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
    request: Request,
    { params }: { params: { id: number } }
  ) {
    const id = params.id;
    const filePath = path.resolve(`./src/app/api/script/${id}.js`);

    try {
        const data = await readFile(filePath, 'utf8');
        return new Response(data, { status: 200 });
    } catch (error) {
        console.error(error)
        return new Response('Error reading the file', { status: 500 });
    }
  }