import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises';
const path = require('path');

export async function POST(request : Request){

    try {
        const content = await request.text();
        const timestampedText = `Echo from server: at ${new Date().toISOString()}:\n ${content}`;
        console.log(timestampedText)
        console.log(`Body Text: ${content}`)
        return NextResponse.json({message: 'File compiled successfully.', result : timestampedText}, { status: 200 })
    } catch (error) {
        console.error('ERROR en try: '+error);
        return NextResponse.json('Error loading about file', { status: 500 });
    }

}