export interface ResponseApi<T = any> {
    code: number;
    data?: T;
    message: string;
}
  
export interface ResponseLogin{
    access_token: string;
}

export interface PaginatedResponse<T = any> {
    content: T[];
    total: number,
    currentPage: number,
    pageSize: number,
    totalPages: number
}