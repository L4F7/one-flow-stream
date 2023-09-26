import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises';
const fs = require('fs');
const path = require('path');

export async function GET(request : Request){

    console.log(`Trying to get about data`)
    try {
        const filePath = path.resolve(`./src/app/data/about.json`);
        console.log(`Trying to get about data #2`)
        const file = await readFile(filePath, 'utf-8');
        console.log(`Trying to get about data #3`)
        return NextResponse.json({message: 'About file loaded successfully.', about: file}, { status: 200 })

    } catch (error) {
        console.error('ERROR en try: '+error);
        return NextResponse.json('Error loading about file', { status: 500 });
    }

}

export async function POST(req : Request){
    const body =  await req.json()
    console.log(body)

    return  Response.json(body)
}
