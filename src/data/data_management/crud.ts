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
import File from '@/models/file';
import connect from '@/utils/db';
import { promisify } from 'util';
import { get } from 'http';
import dns from 'node:dns';
import { StringExpressionOperator } from 'mongoose';

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
            existingFile.fileData = fileContent;
            await existingFile.save();
            return new NextResponse('File updated successfully', {
                status: 200,
            });
        }

        // If the file does not exist, it will be created
        const file = new File({
            filename: pFilename,
            fileData: fileContent,
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
        console.log(`compilingL ${filepath}`)
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

// This function is used to get the keywords
export async function getKeywords() {
    try {
        const filePath = resolve(`./src/data/keywords.json`);
        const file = await readFile(filePath, 'utf-8');
        return NextResponse.json(
            { message: 'Keywords file loaded successfully.', keywords: file },
            { status: 200 }
        );
    } catch (error) {
        console.error('ERROR en try: ' + error);
        return NextResponse.json(
            { message: 'Error loading keywords file', keywords: [] },
            { status: 500 }
        );
    }
}

// Fetch prolog server
export const fetchPrologServer = (filePath: string) => {

    return new Promise((resolve, reject) => {
        dns.setDefaultResultOrder('ipv4first');

        fetch('http://localhost:8000/eval', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileName : filePath}),
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
};

export default crud;
