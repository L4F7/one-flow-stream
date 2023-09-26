import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises';
const path = require('path');

export async function GET(){

    try {
        const filePath = path.resolve(`./src/app/data/about.json`);
        const file = await readFile(filePath, 'utf-8');
        return NextResponse.json({message: 'About file loaded successfully.', about: file}, { status: 200 })

    } catch (error) {
        console.error('ERROR en try: '+error);
        return NextResponse.json('Error loading about file', { status: 500 });
    }

}