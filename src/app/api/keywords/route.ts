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
import { readFile } from 'fs/promises';
const path = require('path');

export async function GET() {
    try {
        const filePath = path.resolve(`./src/data/keywords.json`);
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
