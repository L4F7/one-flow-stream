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
import { openEvaluatedFile } from '../../data_management/crud';
import { resolve } from 'path';

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
        const filePathSave = resolve(`./src/app/api/script/ra_fake.txt`);
        const result = eval(code);

        await writeFile(filePathSave, result.toString(), 'utf-8');

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
