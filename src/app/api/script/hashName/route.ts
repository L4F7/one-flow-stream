import { hashFileName } from '../../../data_management/crud';

export async function POST(request: Request) {
    const response = await hashFileName(request);
    return response;
}