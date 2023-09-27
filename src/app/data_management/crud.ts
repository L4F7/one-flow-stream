import fsPromises from 'fs/promises';
import path from 'path';

export async function openFile(id: number) {
    const filePath = path.resolve(`./src/app/api/script/${id}.js`);

    try {
        const data = await fsPromises.readFile(filePath, 'utf8');
        const jsonData = JSON.stringify({fileContent: data})
        return new Response(jsonData, { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        return new Response('Error reading the file', { status: 500 });
    }
}

export async function saveFile(request: Request) {
    try {
        const jsonData = await request.json();
        const content = jsonData.fileContent;
        const filePath = path.resolve(`./src/app/api/script/4.js`);

        await fsPromises.writeFile(filePath, content, 'utf-8');
        return new Response('File created successfully.', { status: 200 });
    } catch (error) {
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
        return new Response('Error reading the directory', { status: 500 });
    }
}

export async function openEvaluatedFile(){
    const filePath = path.resolve(`./src/app/data/ra_script/ra_fake.txt`);

    try {
        const data = await fsPromises.readFile(filePath, 'utf8');
        const jsonData = JSON.stringify({fileData: data})
        return new Response(jsonData, { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        return new Response('Error reading the file', { status: 500 });
    }

}

const crud = {
    openFile,
    saveFile,
    listFiles,
    openEvaluatedFile
};

export default crud;