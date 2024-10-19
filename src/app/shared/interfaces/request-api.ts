export interface GridTableRequest{
    url: string;
    request: GridRequest
}

export interface GridRequest<T = any> {
    page: number; // Número de página
    size: number; // Tamaño de la página
    orderBy: string; // Campo por el que se debe ordenar
    sort: 'asc' | 'desc'; // Dirección de la ordenación (ascendente o descendente)
    filters: T; // Filtros aplicados; es un objeto genérico que puede contener cualquier propiedad
  }