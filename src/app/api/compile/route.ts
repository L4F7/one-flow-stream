/**
 * @authors
 *  - Kenneth Alfaro Barboza
 *  - Luis Fuentes Fuentes
 *  - Luis Eduardo Restrepo Veintemilla
 *  - Maria Angelica Robles Azofeifa
 *  - Royer Zuñiga Villareal
 * @version 1.0.0
 */

import { compileFile, fetchPrologServerCompile, createFile } from '../../../data/data_management/crud';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {

    const requestData = await request.json();

    if (!requestData || !requestData.code) {
        return requestData.json(
            { message: 'Error: No hay datos en el editor EA' },
            { status: 500 }
        );
    }

    const filename = requestData.filename;
    const code = requestData.code;
    
    return fetchPrologServerCompile(code).then(res => {
            console.log(`Prolog call successfull: ${JSON.stringify(res)}`);

            const jsonRes = JSON.stringify(res);
            const prologResponse = JSON.parse(jsonRes);
            //const resFilename = prologResponse.filename;
            const resCode = prologResponse.code;
            const filepath = createFile("transpiledFile", resCode);

            // If the file was not created, throw an error
            if(!filepath)
                throw new Error('Error creating file');
            
            const response = compileFile(filepath);
            return response;
        }
    ).catch((error) =>{
        console.log(`Error from Prolog call: ${error}`);
        return NextResponse.json('Error compiling file', { status: 500 });
    });
}