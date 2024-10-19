export interface SewingServiceDetail {
    id: number;
    name: string;
    measure_value: string;
    description: string;
    image: string;
}

export interface SewingService {
    id: number;
    name: string;
    cost: number;
    cost_material: number;
    init_price: number;
    end_price: number;
    details: SewingServiceDetail[];
}



export interface MeasureServiceOrder {
    name_measures: string;
    value_measures: string;
}

export interface Task {
    payment_employee: number;
    idUser: number;
    status: string;
    init_day: string;
    end_day: string | null;
}

export interface ServiceOrder {
    idService: number;
    price_final: string;
    task: Task;
    measuresServiceOrders: MeasureServiceOrder[];
}