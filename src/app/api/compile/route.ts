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
import { writeFile } from 'fs/promises';

export async function POST(request: Request) {
    try {
        const content = await request.text();

        if (!content){
            return NextResponse.json(
                { message: 'Error: No hay datos en el editor EA' },
                { status: 500 }
            );
        }

        const timestampedText = `Echo from server: at ${new Date().toISOString()}: \n${content}`;
        const filePathSaveOutput = `./src/app/api/script/Output.js`;

        await writeFile(filePathSaveOutput, content, 'utf-8');

        return NextResponse.json(
            { message: 'File compiled successfully.', result: timestampedText },
            { status: 200 }
        );
    } catch (error) {
        console.error('ERROR en try: ' + error);
        return NextResponse.json('Error loading about file', { status: 500 });
    }
}
