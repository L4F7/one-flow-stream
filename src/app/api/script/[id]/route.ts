import crud from '../../../data_management/crud';

export async function GET(
    request: Request,
    { params }: { params: { id: number } }
  ) {
    const id = params.id;

    const response = await crud.openFile(id);
    return response;
}