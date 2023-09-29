/**
 * @authors
 *  - Kenneth Alfaro Barboza
 *  - Luis Fuentes Fuentes
 *  - Luis Eduardo Restrepo Veintemilla
 *  - Maria Angelica Robles Azofeifa
 *  - Royer Zuñiga Villareal
 * @version 1.0.0
 */

import { saveFile } from '../../../../data_management/crud';

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    const id = params.id;
    const response = await saveFile(request, id);
    return response;
}
