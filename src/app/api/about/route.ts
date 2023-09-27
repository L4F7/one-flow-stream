import { readAbout } from '../../data_management/crud';

export async function GET(request: Request) {
    const response = await readAbout();
    return response;
}