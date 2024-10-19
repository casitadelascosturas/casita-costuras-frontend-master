// Interface for the entire CRUD configuration
export interface CrudConfig {
  develop: boolean;
  name: string;
  path: string;
  description: string;
  service: string;
  icon: string;
  refresh: boolean;
  table: TableConfig;
  form: FormConfig;
  custom?: CustomConfig;
  print?: PrintConfig;
  sort?: string;
  orderBy?: string;
}

// Interface for table configuration
export interface TableConfig {
  columns: TableColumn[];
  actions: TableAction[];
  pagination: number[];
  filter: {
    field: string,
    type: 'date' | 'string',
    label: string,
    icon: string,
    isObject: boolean,
    location: string
    min: string,
    max: string
  }
}


// Interface for table column configuration
export interface TableColumn {
  name: string;
  label: string;
  sortable: boolean;
  filterable: boolean;
  minDate: string; // possible values  -> today, endMonth, initMonth or custom date in format yyyy-mm-dd
  maxDate: string;// possible values  -> today, endMonth, initMonth or custom date in format yyyy-mm-dd
  type: string;
  isObject?: boolean;  // For nested objects
  path?: string;  // Path for nested objects
  values?: ValueConfig[];  // For boolean or custom values
  format?: boolean;  // For number format
  formatDate?: string;  // For date format
  class?: string;
  style?: { [key: string]: string };
  resolver?: string;
  service?: string;
  icon?: string;
  helpMessage?: string;
}

// Interface for actions in the table
export interface TableAction {
  label: string;
  value: string;
  color: string;
  icon?: string;
  service?: string;  // Optional service URL for actions like print or export
}

// Interface for value configurations (for boolean types or custom values)
export interface ValueConfig {
  color?: string;
  icon?: string;
  label?: string;
  value: any;
}

// Interface for form configuration
export interface FormConfig {
  defaultProperties?: DefaultProperty[];  // Default properties for form
  fields: FormField[];
}

// Interface for form field configurations
export interface FormField {
  name: string;
  label: string;
  helpMessage: string;
  type: string;
  icon?: string;
  resolver?: string;  // For dynamic select or radio options
  values?: ValueConfig[];  // For static select or radio options
  validators?: ValidatorConfig;  // Validators for the field
}

// Interface for default properties in the form
export interface DefaultProperty {
  label: string;
  field: string;
  type: string;
  value: any;
  icon: string;
}

// Interface for custom configuration paths
export interface CustomConfig {
  path_new: string;
  path_edit: string;
}

// Interface for printing configuration
export interface PrintConfig {
  service: string;
}

// Interface for validator configuration
export interface ValidatorConfig {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: any;
  max?: any;
  regex: string;
}


export interface DefaultPropertyDisplay {
  label: string;   // Texto que describe la propiedad
  value: any;      // Valor de la propiedad (puede ser de tipo boolean, string, etc.)
  icon?: string;   // Icono asociado, opcional (puede ser 'check_circle', 'cancel', etc.)
  type: 'boolean' | 'date' | 'text';  // Tipo de la propiedad (puede ser 'boolean', 'date', 'text')
}
