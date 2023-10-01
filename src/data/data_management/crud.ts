/**
 * @authors
 *  - Kenneth Alfaro Barboza
 *  - Luis Fuentes Fuentes
 *  - Luis Eduardo Restrepo Veintemilla
 *  - Maria Angelica Robles Azofeifa
 *  - Royer Zuñiga Villareal
 * @version 1.0.0
 */

import { readFile, readdir, writeFile } from 'fs/promises';
import { createHash } from 'crypto';
import { resolve } from 'path';

// This function is used to open the file
export async function openFile(id: string) {
    try {
        const filePath = resolve(`./src/data/scripts/${id}.ofs`);
        const data = await readFile(filePath, 'utf8');
        const jsonData = JSON.stringify({ fileContent: data });
        return new Response(jsonData, {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response('Error reading the file', { status: 500 });
    }
}

// This function is used to save the file
export async function saveFile(request: Request, id: string) {
    try {
        const jsonData = await request.json();
        const content = jsonData.fileContent;
        const filePath = resolve(`./src/data/scripts/${id}.ofs`);

        await writeFile(filePath, content, 'utf-8');
        return new Response('File created successfully.', { status: 200 });
    } catch (error) {
        return new Response('Error saving the file', { status: 500 });
    }
}

// This function is used to list all the files in the directory
export async function listFiles() {
    try {
        const directoryPath = resolve(`./src/data/scripts`);
        const files = (await readdir(directoryPath, 'utf8')).filter(
            (file) => file.endsWith('.ofs')
        );
        const jsonFiles = JSON.stringify(files);
        console.log
        return new Response(jsonFiles, {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response('Error reading the directory', { status: 500 });
    }
}

// This function is used to hash the file name
export async function hashFileName(request: Request) {
    try {
        const jsonData = await request.json();
        const fileName = jsonData.fileName;
        const hashedFilename = createHash('sha256')
            .update(fileName)
            .digest('hex');

        const jsonFileName = JSON.stringify(hashedFilename);
        return new Response(jsonFileName, {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response('Error reading the directory', { status: 500 });
    }
}

// This function is used to open the file that contains the evaluated script
export async function openEvaluatedFile() {
    try {
        const filePath = resolve(`./src/data/ra_script/ra_fake.txt`);
        const data = await readFile(filePath, 'utf8');
        const jsonData = JSON.stringify({ fileData: data });
        return new Response(jsonData, {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response('Error reading the file', { status: 500 });
    }
}

export async function readAbout() {
    try {
        const filePath = resolve(`./src/data/about.json`);
        const file = await readFile(filePath, 'utf-8');
        const jsonFile = JSON.stringify({
            about: file,
            message: 'About file loaded successfully.',
        });
        return new Response(jsonFile, {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('ERROR en try: ' + error);
        return new Response('Error reading the file', { status: 500 });
    }
}

// This object is used to export all the functions
const crud = {
    openFile,
    saveFile,
    listFiles,
    hashFileName,
    openEvaluatedFile,
    readAbout,
};

export default crud;
