export interface Select {
}

export interface PossibleValueSelect {
    label: string,
    value: any
    validate?: any;
}


export interface PossibleValueSelectList {
    name: string;    
    options: PossibleValueSelect[];
}
