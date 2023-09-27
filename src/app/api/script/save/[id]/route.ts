import { saveFile } from '../../../../data_management/crud';

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
  ) {
    const id = params.id;
    const response = await saveFile(request, id);
    return response;
}