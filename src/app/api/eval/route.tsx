/**
 * @authors
 *  - Kenneth Alfaro Barboza
 *  - Luis Fuentes Fuentes
 *  - Luis Eduardo Restrepo Veintemilla
 *  - Maria Angelica Robles Azofeifa
 *  - Royer Zuñiga Villareal
 * @version 1.0.0
 */

import { openEvaluatedFile } from '../../../data/data_management/crud';

export async function POST(request: Request) {
    const response = await openEvaluatedFile(request);
    return response;
}
