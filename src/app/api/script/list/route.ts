import crud from '../../../data_management/crud';

export async function GET(request: Request) {
    const response = await crud.listFiles();
    return response;
}