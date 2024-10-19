export interface MenuItem {
  id?: number;
  group: string;
  separator?: boolean;
  selected?: boolean;
  active?: boolean;
  label?: string;
  items: Array<SubMenuItem>;
}

export interface SubMenuItem {
  id?: number;
  icon?: string;
  label?: string;
  route?: string | null;
  expanded?: boolean;
  active?: boolean;
  footer?: boolean;
  permissions?: PermissionSubMenuItem;
  children?: Array<SubMenuItem>;
}


export interface PermissionSubMenuItem {
  create: boolean,
  delete: boolean,
  update: boolean,
  read: boolean
}