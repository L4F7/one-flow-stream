// types.ts
interface Proyecto {
    Nombre: string;
    Integrantes: { Nombre: string; Identificacion: string }[];
}

interface Curso {
    Nombre: string;
    Codigo: string;
    Horario: string;
    Semestre: string;
    Año: string;
    Escuela: string;
    Universidad: string;
}

export interface AboutInfo {
    Proyecto?: Proyecto;
    Curso?: Curso;
}
