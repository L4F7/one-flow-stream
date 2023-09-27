import crud from '../../../data_management/crud';

export async function POST(request: Request) {
    const response = await crud.saveFile(request);
    return response;
}