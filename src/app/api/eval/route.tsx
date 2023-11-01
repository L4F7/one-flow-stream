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
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { promisify } from 'util';

const execPromisified = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export async function POST(request: Request) {
    try {

        const content = await request.json();

        if (!content || content.code.length == 0)
            return NextResponse.json(
                { message: `Error: No hay datos en el area de TA` },
                { status: 500 }
            );


        const filePathLoad = `../../../data/js_scripts/${content.filename}`;

        //const filePathLoad = `../../../data/js_scripts/Output.js`;

        // Execute the JavaScript code   
        
        let output : String = "";

        try {
            const { stdout, stderr } = await execPromisified(`node ${filePathLoad}`, {
                cwd: __dirname
            });
            output = stdout;
        } catch (error: any) {
            output = error;
        }

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
