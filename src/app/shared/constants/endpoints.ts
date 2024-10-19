import { environment } from '../../../environments/environment';

export const USERS: string = 'users';
export const ROLES: string = 'roles';
export const REPORTS: string = 'users';
export const CLIENTS: string = 'clients';
export const MEASURES: string = 'measures';
export const PRODUCTS: string = 'products';
export const SERVICES: string = 'sewing-services';
export const ORDERS: string = 'orders';
export const TASKS: string = 'tasks';


export const API_BASE: string = `${environment.apiUrl}`;
export const URL_AUTH: string = `${API_BASE}/`;
export const URL_DASHBOARD: string = `${API_BASE}/`;
export const URL_HOME: string = `${API_BASE}/`;
export const URL_REPORTS: string = `${API_BASE}/`;
export const URL_RECEIPTS: string = `${API_BASE}reports/orders-day`;

export const URL_USERS: string = `${API_BASE}${USERS}`;
export const URL_CLIENTS: string = `${API_BASE}${CLIENTS}`;
export const URL_MEASURES: string = `${API_BASE}${MEASURES}`;
export const URL_PRODUCTS: string = `${API_BASE}${PRODUCTS}`;
export const URL_SERVICES: string = `${API_BASE}${SERVICES}`;
export const URL_ORDERS: string = `${API_BASE}${ORDERS}`;
export const URL_TASK: string = `${API_BASE}${TASKS}`;



export const URL_PERMISSIONS: string = `${API_BASE}${ROLES}/permissions/user`;
export const URL_LOGIN: string = `http://localhost:3001/authentication/login`;

// export const URL_: string = `${API_BASE}/`;
// export const URL_: string = `${API_BASE}/`;
// export const URL_: string = `${API_BASE}/`;
// export const URL_: string = `${API_BASE}/`;
// export const URL_: string = `${API_BASE}/`;
// export const URL_: string = `${API_BASE}/`;
// export const URL_: string = `${API_BASE}/`;
// export const URL_: string = `${API_BASE}/`;
// export const URL_: string = `${API_BASE}/`;
