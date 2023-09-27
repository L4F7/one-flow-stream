import fsPromises from 'fs/promises';
import path from 'path';

export async function openFile(id: number) {
    const filePath = path.resolve(`./src/app/api/script/${id}.js`);

    try {
        const data = await fsPromises.readFile(filePath, 'utf8');
        return new Response(data, { status: 200 });
    } catch (error) {
        console.error(error)
        return new Response('Error reading the file', { status: 500 });
    }
}

export async function saveFile(request: Request) {
    try {
        const content = await request.text();
        const filePath = path.resolve(`./src/app/api/script/4.js`);

        await fsPromises.writeFile(filePath, content, 'utf-8');
        return new Response('File created successfully.', { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response('Error saving the file', { status: 500 });
    }
}

export async function listFiles() {
    const directoryPath = path.resolve(`./src/app/api/script`);

    try {
        const files = (await fsPromises.readdir(directoryPath, 'utf8')).filter(file => file.endsWith('.js'));
        const jsonFiles = JSON.stringify(files);
        return new Response(jsonFiles, { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error(error)
        return new Response('Error reading the directory', { status: 500 });
    }
}

const crud = {
    openFile,
    saveFile,
    listFiles
};

export default crud;