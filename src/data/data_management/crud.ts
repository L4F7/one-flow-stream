/**
 * @authors
 *  - Kenneth Alfaro Barboza
 *  - Luis Fuentes Fuentes
 *  - Luis Eduardo Restrepo Veintemilla
 *  - Maria Angelica Robles Azofeifa
 *  - Royer Zuñiga Villareal
 * @version 1.0.0
 */

import { readFile, writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import { resolve, dirname } from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import File from '@/models/File';
import connect from '@/utils/db';
import dns from 'node:dns';
import { writeFileSync } from 'fs';

// This function is used to open the file
export async function openFile(filename: string) {
    try {
        await connect();
        const file = await File.findOne({ filename: filename });
        const jsonFile = JSON.stringify(file);
        return new Response(jsonFile, {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        return new NextResponse(error, {
            status: 500,
        });
    }
}

// This function is used to save the file
export async function saveFile(request: Request, pFilename: string) {
    try {
        await connect();
        const { fileContent } = await request.json();
        const existingFile = await File.findOne({ filename: pFilename });

        // If the file already exists, it will be updated
        if (existingFile) {
            existingFile.data = fileContent;
            await existingFile.save();
            return new NextResponse('File updated successfully', {
                status: 200,
            });
        }

        // If the file does not exist, it will be created
        const file = new File({
            filename: pFilename,
            data: fileContent,
        });

        await file.save();

        return new NextResponse('File saved successfully', {
            status: 200,
        });
    } catch (error: any) {
        return new NextResponse(error, {
            status: 500,
        });
    }
}

// This function is used to list all the files in the directory
export async function listFiles() {
    try {
        await connect();
        const files = await File.find();
        const filesNames = files.map((file) => file.filename);
        const jsonFilesNames = JSON.stringify(filesNames);
        return new Response(jsonFilesNames, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error: any) {
        return new NextResponse(error, {
            status: 500,
        });
    }
}

// This function is used to compile the file
export async function compileFile(filepath : string) {
    try {

        const compiledFile = await readFile(filepath, 'utf8');
        return NextResponse.json(
            { message: 'File compiled successfully.', result: compiledFile },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json('Error compiling file', { status: 500 });
    }
}

// This function is used to open the file that contains the evaluated script
export async function openEvaluatedFile(request: Request) {
    const execPromisified = promisify(exec); // Promisify the exec function
    const __filename = fileURLToPath(import.meta.url); // Get the current file path
    const __dirname = dirname(__filename); // Get the current directory path

    try {
        const content = await request.json();

        if (!content || content.code.length == 0)
            return NextResponse.json(
                { message: `Error: No hay datos en el area de TA` },
                { status: 500 }
            );

        const filePathLoad = `../../data/js_scripts/${content.filename}`;

        let output: String = '';

        await execPromisified(`node ${filePathLoad}`, {
            cwd: __dirname,
        })
            .then((result) => {
                output = result.stdout;
            })
            .catch((error) => {
                output = error;
            });

        const filePathSave = resolve(`./src/data/ra_script/ra_output.txt`);

        await writeFile(filePathSave, output.toString(), 'utf-8');
        const fileSaved = await readFile(filePathSave, 'utf8');

        return NextResponse.json(
            { message: `File evaluated successfully.`, result: fileSaved },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: `Error evaluating TA script` },
            { status: 500 }
        );
    }
}

// This function is used to read the about file
export async function readAbout() {
    try {
        await connect();
        const file = await File.findOne({ filename: 'about.json' });
        const content = file.data;

        const jsonFile = JSON.stringify({
            about: content,
            message: 'About file loaded successfully.',
        });
        return new Response(jsonFile, {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response('Error reading the file', { status: 500 });
    }
}

// This function is used to get the keywords
export async function getKeywords() {
    try {
        await connect();
        const file = await File.findOne({ filename: 'keywords.json' });
        const content = file.data;

        return NextResponse.json(
            { message: 'Keywords file loaded successfully.', keywords: content },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: 'Error loading keywords file', keywords: [] },
            { status: 500 }
        );
    }
}

// Fetch prolog server
export const fetchPrologServer = (filename: string, code: string) => {

    return new Promise((resolve, reject) => {
        dns.setDefaultResultOrder('ipv4first');

        fetch('http://20.163.183.153:8000/eval', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ filename : filename, code : code}),
        })
            .then((response) => {
                if (!response.ok) {
                    reject(new Error('Failed to fetch content'));
                }
                resolve(response.json());
            })
            .then((data) => {
                console.log(`Data from Prolog: ${data}`);
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            });
        });
};

export function createFile(filename: string, code: string) {
    try {
        const filePath = resolve(`./src/data/js_scripts/${filename}`);
        writeFileSync(filePath, code, 'utf-8');
        return filePath;
    } catch (error) {
        return false;
    }
}

// This object is used to export all the functions
const crud = {
    openFile,
    saveFile,
    listFiles,
    compileFile,
    openEvaluatedFile,
    readAbout,
    getKeywords,
    fetchPrologServer,
    createFile,
};

export default crud;
