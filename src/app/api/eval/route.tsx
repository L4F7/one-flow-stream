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
import { openEvaluatedFile } from '../../../data/data_management/crud';
import { resolve } from 'path';
import { errorToJSON } from 'next/dist/server/render';
import vm from 'vm';

import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { promisify } from 'util';

const execPromisified = promisify(exec);

 
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export async function POST(request: Request) {
    try {
        const content = await request.text();
        if (!content || content.length == 0)
            return NextResponse.json(
                { message: 'Error: No hay datos en el area de TA' },
                { status: 500 }
            );

        const filePathLoad = `./src/app/api/script/Output.js`;
        const code = await readFile(filePathLoad, 'utf8');

        // Execute the JavaScript code   
        
        let output : String = "Hola";

        try {
            const { stdout, stderr } = await execPromisified('node ../script/Output.js', {
                cwd: __dirname
            });
            output = stdout;
            console.log('Output result: ' + output);
        } catch (error: any) {
            output = error;
            console.error(`exec error: ${error}`);
        }


        const filePathSave = resolve(`./src/app/api/script/ra_fake.txt`);

        console.log('Code to Execute: '+code)

        console.log('Result:', output);
        await writeFile(filePathSave, output.toString(), 'utf-8'); 
        const fileSaved = await readFile(filePathSave, 'utf8');

        return NextResponse.json(
            { message: 'File evaluated successfully.', result: fileSaved },
            { status: 200 }
        );
        
    } catch (error) {
        console.error('ERROR en try: ' + error);
        return NextResponse.json(
            { message: 'Error evaluating TA script' },
            { status: 500 }
        );
    }
}
