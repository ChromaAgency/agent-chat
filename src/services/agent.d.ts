type NewAgent = {
    name:string;
    type?:string;
    description?:string;
    skills?:string;
    examples?:string;
    output?:string;
    prompt:string;
    integrations?:string[];
}
type UpdateAgent = {
    name:string;
    type?:string;
    description?:string;
    skills?:string;
    examples?:string;
    output?:string;
    prompt:string;
    integrations?:string[];
}
type Agent = {   
    id:string;
} & NewAgent 

type ApiAgent = {
    id:string;
    name:string;
    prompt:string;
    tools:string[];
}