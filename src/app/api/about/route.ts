import { redirect } from 'next/navigation';

export async function GET(request : Request){

    redirect('http://localhost:3000/About')

}

export async function POST(req : Request){
    const body =  await req.json()
    console.log(body)

    return  Response.json(body)
}
