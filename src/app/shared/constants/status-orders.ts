import { OrdersStatus } from "../interfaces/orders-status";

export const STATUS_ORDERS: OrdersStatus[] = [
  { key: 'PENDING', label: 'Pendiente' },//Orden pendinete
  { key: 'IN_PROCESS', label: 'Cargado' },//Orden en proceso
  { key: 'PENDING_DELIVERY', label: 'Entrega pendiente' },//Orden lista para entregar
  { key: 'LATE', label: 'Atrasado' },//Orden lista para entregar
  { key: 'FINALIZED', label: 'Finalizado' },//Orden entregada y finalizada
  { key: 'CANCEL', label: 'Anulado' }
]
