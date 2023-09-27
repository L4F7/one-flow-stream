import { openFile } from '../../../data_management/crud';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
  ) {
    const id = params.id;
    const response = await openFile(id);
    return response;
}