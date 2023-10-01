/**
 * @authors
 *  - Kenneth Alfaro Barboza
 *  - Luis Fuentes Fuentes
 *  - Luis Eduardo Restrepo Veintemilla
 *  - Maria Angelica Robles Azofeifa
 *  - Royer Zuñiga Villareal
 * @version 1.0.0
 */

import { openFile } from '../../../../data/data_management/crud';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const id = params.id;
    const response = await openFile(id);
    return response;
}
