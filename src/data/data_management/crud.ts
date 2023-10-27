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
import File from '@/models/file';
import connect from '@/utils/db';
import { NextResponse } from 'next/server';

// This function is used to open the file
export async function openFile(id: string) {

    try {
        await connect();
        const file = await File.findOne({ filename: id });
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
export async function saveFile(request: Request, fileName: string) {
    try {

        await connect();
        const { fileContent } = await request.json();
        const existingFile = await File.findOne({ filename: fileName });

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
            filename: fileName,
            extension: 'ofs',
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
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        return new NextResponse(error, {
            status: 500,
        });
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
