"use client"
import {  useForm } from '@tanstack/react-form'
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Input } from './ui/input'
import { Checkbox } from './ui/checkbox'
import { addNewAgent, updateAgent, getAgentById } from '@/services/agentService'; 

function TanstackTextareaField({ form, name, label }: { form: any, name: string, label: string }) {
    return <form.Field name={name} >
        {(field: any) => <TanstackFormTextarea label={label} value={form.getFieldValue(field.name) as string} field={field} />}
    </form.Field>
}
type TanstackFormTextareaProps = {
    field: any,
    label: string,
    value: string
}
function TanstackFormTextarea({ field, label, value }: TanstackFormTextareaProps) {
    return <>
        <label
            htmlFor={field.name}
            className="block text-sm font-medium text-gray-700"
        >
            {label}
        </label>
        <textarea
            id={field.name}
            defaultValue={value}
            onChange={e => {
                console.log(e.target.value)
                field.handleChange(e.target.value)}}
            rows={4}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
    </>
}

function TanstackFormCheckboxField({ form, name, label }: { form: any, name: string, label: string }) {
    return <form.Field name={name} >
        {(field: any) => <TanstackFormCheckbox label={label} value={form.getFieldValue(field.name) as boolean} field={field} />}
    </form.Field>
}
type TanstackFormCheckboxProps = {
    field: any,
    label: string,
    value: boolean
}
function TanstackFormCheckbox({ label, value, field }: TanstackFormCheckboxProps) {
    return <div className='flex flex-row space-x-3 items-center'>
        <label
            htmlFor={field.name}
            className="block text-sm font-medium text-gray-700"
        >
            {label}
        </label>
        <Checkbox defaultChecked={value} name={field.name} onCheckedChange={(e) => {
            field.handleChange(e as boolean)
        }} />
    </div>
}

function TanstackFormInputField({ form, name, label }: { form: any, name: string, label: string }) {
    return <form.Field name={name} >
        {(field: any) => <TanstackFormInput label={label} value={form.getFieldValue(field.name) as string} field={field} />}
    </form.Field>

}

type TanstackFormInputProps = {
    field: any,
    label: string,
    value: string
}
function TanstackFormInput({ field, label, value }: TanstackFormInputProps) {
    return <>
        <label
            htmlFor={field.name}
            className="block text-sm font-medium text-gray-700"
        >
            {label}
        </label>
        <Input defaultValue={value} name={field.name} onChange={(e) => field.handleChange(e.target.value)} />
    </>
}

interface AgentFormData {
    name: string
    description: string
    role: string;
    skills: string;
    examples: string;
    output: string;
    prompt: string;
    integrations: string,
    advancedMode: boolean;
}

const labels = {
    name: 'Agent Name',
    description: 'Description',
    role: 'Role',
    skills: 'Skills',
    examples: 'Examples',
    output: 'Output Format',
    prompt: 'Prompt',
    integrations: 'Integrations',
    advancedMode: 'Advanced Mode'
}
export const queryClient = new QueryClient()
export default function AgentFormWrapper({
    agentId = null,
}: { agentId?: null | string }) {
    return (
        <QueryClientProvider client={queryClient}>
            {agentId ? <UpdateAgentForm agentId={agentId} /> : <NewAgentForm />}
        </QueryClientProvider>
    )

}
const defaultValues: AgentFormData = {
    name: '',
    description: '',
    role: '',
    skills: '',
    examples: '',
    output: '',
    prompt: '',
    integrations: '',
    advancedMode: false

}
export function NewAgentForm() {
    const queryClient = useQueryClient()
    const { mutate , error, isError, isPending } = useMutation({mutationFn: async (data: AgentFormData) => {
           addNewAgent({name:data.name, prompt:data.prompt, integrations:[1]})
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agents'] })
            console.log('onSuccess')
        },
        onError: (error) => {
            console.error('onError', error)
        }
    })
    const onSubmit = async ({ value }: { value: AgentFormData }) => {
        mutate(value)
    }
    return (
        <AgentFormComponent isLoading={isPending} defaultValues={defaultValues} onSubmit={onSubmit} error={error?.message || null} />
    )
}
export function UpdateAgentForm({ agentId }: { agentId: string }) {
    const {data, isLoading: isFetchingAgent } = useQuery({
        queryKey: ['agents', agentId], 
        queryFn: async ({}) => {
           return await getAgentById(agentId)
        },
    });

    const { mutate, isError, error, isPending } = useMutation({
        mutationKey: ['agents', agentId],
        mutationFn: async (data: AgentFormData) => {
            return updateAgent({id:agentId,name:data.name,prompt:data.prompt,integrations:[1]})
        },
        onError: (error) => {
            console.error('onError', error)
        },
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: ['agents'] })
            queryClient.invalidateQueries({ queryKey: ['agents', data.id] })
            console.log('onSuccess')
        },

    })
    const onSubmit = async ({ value }: { value: AgentFormData }) => {
        mutate(value)
    }
    // Muestra un estado de carga mientras se obtiene el agente
    if (isFetchingAgent) return <p>Cargando datos del agente...</p>; 

    // Si defaultValues (data) aún no está cargado, puedes mostrar un loader o null
    // para evitar errores si AgentFormComponent espera defaultValues definidos.
    if (!data) return <p>Cargando formulario...</p>; 

    return (
        <AgentFormComponent isLoading={isPending} onSubmit={onSubmit} defaultValues={data} error={error?.message || null} />
    )
}
export function AgentFormComponent({ onSubmit, defaultValues, error,isLoading }: {isLoading:boolean, onSubmit: any, defaultValues: AgentFormData, error: string | null }) {
    const form = useForm({
        defaultValues,
        onSubmit: ({ value }) => onSubmit({ value }),

    })

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
            }}
            className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md"
        >
            {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md">{error}</div>
            )}
            <div className="space-y-2">
                <TanstackFormInputField label={labels["name"]} name='name' form={form} />
            </div>
            <div className="space-y-2">
                <TanstackFormCheckboxField label={labels["advancedMode"]} name='advancedMode' form={form} />
            </div>
            <div className="space-y-2">
                <TanstackTextareaField label={labels["description"]} name='description' form={form} />
            </div>
            <form.Subscribe
                selector={(state) => state.values.advancedMode}>
                {(advancedMode) => (
                    advancedMode ? <>
                        <div className="space-y-2">
                            <TanstackTextareaField label={labels["prompt"]} name='prompt' form={form} />
                        </div>

                    </>
                        : <>
                            <div className="space-y-2">
                                <TanstackTextareaField label={labels["role"]} name='role' form={form} />
                            </div>
                            <div className="space-y-2">
                                <TanstackTextareaField label={labels["skills"]} name='skills' form={form} />
                            </div>
                            <div className="space-y-2">
                                <TanstackTextareaField label={labels["examples"]} name='examples' form={form} />
                            </div>
                            <div className="space-y-2">
                                <TanstackTextareaField label={labels["output"]} name='output' form={form} />
                            </div>
                        </>

                )}
            </form.Subscribe>
            <div className="space-y-2">
                <TanstackFormInputField label={labels["integrations"]} name='integrations' form={form} />
            </div>
            <div className="flex justify-end">
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Create Agent
                </button>
            </div>
        </form>
    )
}
