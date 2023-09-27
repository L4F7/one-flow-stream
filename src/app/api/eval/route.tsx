import { NextResponse } from 'next/server'
import { openEvaluatedFile } from '../../data_management/crud';

export async function POST(request : Request){

    try {
        const content = await request.text();

        if(!content) return NextResponse.json({message: 'Error: No hay datos en el area de TA'}, { status: 500 })

        return openEvaluatedFile();
    } catch (error) {
        console.error('ERROR en try: '+error);
        return NextResponse.json('Error loading about file', { status: 500 });
    }

}