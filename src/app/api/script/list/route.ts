/**
 * @authors
 *  - Kenneth Alfaro Barboza
 *  - Luis Fuentes Fuentes
 *  - Luis Eduardo Restrepo Veintemilla
 *  - Maria Angelica Robles Azofeifa
 *  - Royer Zuñiga Villareal
 * @version 1.0.0
 */

import { listFiles } from '../../../../data/data_management/crud';

export async function GET() {
    const response = await listFiles();
    return response;
}

export const dynamic = "force-dynamic";
