export interface Role {
    id: number;
    name: string;
    description: string;
  }
  
  export interface Permissions {
    create: boolean;
    delete: boolean;
    update: boolean;
    read: boolean;
  }
  
  export interface Item {
    icon: string;
    label: string;
    route: string;
    permissions: Permissions;
  }
  
  export interface Page {
    id: number;
    group: string;
    label: string;
    separator: boolean;
    items: Item[];
  }
  
  export interface UserPermissions {
    role: Role;
    pages: Page[];
  }
  