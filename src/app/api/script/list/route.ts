import { listFiles } from '../../../data_management/crud';

export async function GET(request: Request) {
    const response = await listFiles();
    return response;
}