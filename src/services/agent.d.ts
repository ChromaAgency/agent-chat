type Agent = {
    id:string;
    name:string;
    type?:string;
    description?:string;
    skills?:string;
    examples?:string;
    output?:string;
    prompt:string;
    integrations?:string[];
}
type ApiAgent = {
    id:string;
    name:string;
    prompt:string;
    tools:string[];
}