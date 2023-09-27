import { NextResponse } from 'next/server'
import fsPromises from 'fs/promises';
import { openEvaluatedFile } from '../../data_management/crud';
import path from 'path';

export async function POST(request : Request){

    try {

        const content = await request.text();
        if(!content || content.length == 0) return NextResponse.json({message: 'Error: No hay datos en el area de TA'}, { status: 500 })
        const filePathLoad = `./src/app/api/script/Output.js`;
        const code = await fsPromises.readFile(filePathLoad, 'utf8');
        // Execute the JavaScript code
        const filePathSave = path.resolve(`./src/app/api/script/ra_fake.txt`);
        const result = eval(code);
        await fsPromises.writeFile(filePathSave, result.toString(), 'utf-8');
        
        const fileSaved = await fsPromises.readFile(filePathSave, 'utf8');

        return NextResponse.json({message: 'File evaluated successfully.', result : fileSaved}, { status: 200 })

    } catch (error) {
        console.error('ERROR en try: '+error);
        return NextResponse.json({message: 'Error evaluating TA script'}, { status: 500 });
    }

}