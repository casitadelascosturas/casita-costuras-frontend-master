export interface OrdersStatus {
  key: 'PENDING' | 'IN_PROCESS' |'FINALIZED'|'CANCEL'|'PENDING_DELIVERY'|'LATE';
  label: string;
}
