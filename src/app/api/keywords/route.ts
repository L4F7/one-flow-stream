import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises';
const path = require('path');

export async function GET(){

    try {
        const filePath = path.resolve(`./src/app/data/keywords.json`);
        const file = await readFile(filePath, 'utf-8');
        return NextResponse.json({message: 'Keywords file loaded successfully.', keywords: file}, { status: 200 })

    } catch (error) {
        console.error('ERROR en try: '+error);
        return NextResponse.json({message: 'Error loading keywords file', keywords : []}, { status: 500 });
    }

}