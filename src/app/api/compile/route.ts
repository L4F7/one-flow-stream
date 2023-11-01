/**
 * @authors
 *  - Kenneth Alfaro Barboza
 *  - Luis Fuentes Fuentes
 *  - Luis Eduardo Restrepo Veintemilla
 *  - Maria Angelica Robles Azofeifa
 *  - Royer Zuñiga Villareal
 * @version 1.0.0
 */

import { NextResponse } from 'next/server';
import { readFile, writeFile} from 'fs/promises';
import { resolve } from 'path';

export async function POST(request: Request) {
    try {
        const content = await request.json();

        if (!content || !content.code){
            return NextResponse.json(
                { message: 'Error: No hay datos en el editor EA' },
                { status: 500 }
            );
        }

        const code = content.code;
        console.log(`filename: ${content.filename}`)

        const jsFilePath = resolve(`./src/data/js_scripts/${content.filename}`);

        const preloadJSFile = await readFile(jsFilePath, 'utf8');

        const timestampedText = `Echo from server: at ${new Date().toISOString()}: \n${preloadJSFile}`;

        const filePathSaveOutput = `./src/data/js_scripts/Output.mjs`;

        await writeFile(filePathSaveOutput, preloadJSFile, 'utf-8');

        return NextResponse.json(
            { message: 'File compiled successfully.', result: timestampedText },
            { status: 200 }
        );
    } catch (error) {
        console.error('ERROR en try: ' + error);
        return NextResponse.json('Error loading about file', { status: 500 });
    }
}
