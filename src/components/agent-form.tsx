"use client"
import { FieldApi, ReactFormApi, useForm } from '@tanstack/react-form'
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Checkbox } from './ui/checkbox'

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
export default function AgentFormWrapper({
    agentId = null,
}: { agentId?: null | string }) {
    return (
        <QueryClientProvider client={new QueryClient()}>
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

    const { mutate ,error,isError} = useMutation({
        mutationFn: async (data: AgentFormData) => {
            // WIP Should call agents api
            // We should use supabase for auth and db.
            //   const response = await fetch('/api/agents', {
            //     method: 'POST',
            //     headers: {
            //       'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(data),
            //   })
            //   if (!response.ok) {
            //     throw new Error('Failed to create agent')
            //   }
            //   return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agents'] })

        },

    })

    const onSubmit = async ({ value }: { value: AgentFormData }) => {
        console.log('onSubmit', value)
        mutate(value)
    }

    return (
        <AgentFormComponent defaultValues={defaultValues} onSubmit={onSubmit} error={error?.message || null} />
    )

}
export function UpdateAgentForm({ agentId }: { agentId: string }) {
    const {data } = useQuery({queryFn:async (query)=>{
        return await fetch(`/api/agents/${query.queryKey[1]}`)
            .then(response => response.json())
            .then(data => {
                console.log('data', data)
                return data.result
            })
    },  queryKey: ['agents', agentId]})
    const { mutate, isError, error } = useMutation({
        mutationFn: async (data: AgentFormData) => {

        }
    })

    const onSubmit = async ({ value }: { value: AgentFormData }) => {
        mutate(value)
    }
    console.log('data', data)


    return (
        <AgentFormComponent onSubmit={onSubmit} defaultValues={data} error={error?.message || null} />
    )
}

export function AgentFormComponent({ onSubmit, defaultValues, error }: { onSubmit: any, defaultValues: AgentFormData, error: string | null }) {
    const form = useForm({
        defaultValues,
        onSubmit,
    })
    useEffect(() => {
        return () => {
            console.log('unmount');
            form.reset()
        }
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
                <form.Field
                    name="name"

                >
                    {(field) => (
                        <>
                            <label
                                htmlFor={field.name}
                                className="block text-sm font-medium text-gray-700"
                            >
                                {labels[field.name]}
                            </label>
                            <Input defaultValue={form.getFieldValue(field.name) as string} name={field.name} onChange={(e) => field.handleChange(e.target.value)} />
                        </>
                    )}
                </form.Field>
            </div>
            <div className="space-y-2">
                <form.Field
                    name="advancedMode"
                >
                    {(field) => (
                        <div className='flex flex-row space-x-3 items-center'>
                            <label
                                htmlFor={field.name}
                                className="block text-sm font-medium text-gray-700"
                            >
                                {labels[field.name]}
                            </label>
                            <Checkbox defaultChecked={form.getFieldValue(field.name) as boolean} name={field.name} onCheckedChange={(e) => {
                                field.handleChange(e as boolean)
                            }} />
                        </div>
                    )}
                </form.Field>
            </div>
            <div className="space-y-2">
                                <form.Field
                                    name="description"
                                >
                                    {(field) => (
                                        <>
                                            <label
                                                htmlFor={field.name}
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                {labels[field.name]}
                                            </label>

                                            <textarea
                                                id={field.name}
                                                defaultValue={form.getFieldValue(field.name) as string}
                                                onChange={e => field.handleChange(e.target.value)}
                                                rows={4}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </>
                                    )}
                                </form.Field>
                            </div>
            <form.Subscribe
                selector={(state) => state.values.advancedMode}>
                {(advancedMode) => (
                    advancedMode ? <>
                        <div className="space-y-2">
                            <form.Field
                                name="prompt"
                            >
                                {(field) => (
                                    <>
                                        <label
                                            htmlFor={field.name}
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            {labels[field.name]}
                                        </label>

                                        <textarea
                                            id={field.name}
                                            defaultValue={form.getFieldValue(field.name) as string}
                                            onChange={e => field.handleChange(e.target.value)}
                                            rows={4}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </>
                                )}
                            </form.Field>
                        </div>
                        <div className="space-y-2">
                            <form.Field
                                name="integrations"

                            >
                                {(field) => (
                                    <>
                                        <label
                                            htmlFor={field.name}
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            {labels[field.name]}
                                        </label>
                                        <Input defaultValue={form.getFieldValue(field.name) as string} name={field.name} onChange={(e) => field.handleChange(e.target.value)} />
                                    </>
                                )}
                            </form.Field>
                        </div>

                    </>
                        : <>
                           
                            <div className="space-y-2">
                                <form.Field
                                    name="role"
                                >
                                    {(field) => (
                                        <>
                                            <label
                                                htmlFor={field.name}
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                {labels[field.name]}
                                            </label>

                                            <textarea
                                            defaultValue={form.getFieldValue(field.name) as string}
                                                id={field.name}
                                                onChange={e => field.handleChange(e.target.value)}
                                                rows={4}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </>
                                    )}
                                </form.Field>
                            </div>
                            <div className="space-y-2">
                                <form.Field
                                    name="skills"
                                >
                                    {(field) => (
                                        <>
                                            <label
                                                htmlFor={field.name}
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                {labels[field.name]}
                                            </label>

                                            <textarea
                                            defaultValue={form.getFieldValue(field.name) as string}
                                                id={field.name}
                                                onChange={e => field.handleChange(e.target.value)}
                                                rows={4}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </>
                                    )}
                                </form.Field>
                            </div>
                            <div className="space-y-2">
                                <form.Field
                                    name="examples"
                                >
                                    {(field) => (
                                        <>
                                            <label
                                                htmlFor={field.name}
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                {labels[field.name]}
                                            </label>

                                            <textarea
                                            defaultValue={form.getFieldValue(field.name) as string}
                                                id={field.name}
                                                onChange={e => field.handleChange(e.target.value)}
                                                rows={4}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </>
                                    )}
                                </form.Field>
                            </div>
                            <div className="space-y-2">
                                <form.Field
                                    name="output"
                                >
                                    {(field) => (
                                        <>
                                            <label
                                                htmlFor={field.name}
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                {labels[field.name]}
                                            </label>

                                            <textarea
                                            defaultValue={form.getFieldValue(field.name) as string}
                                                id={field.name}
                                                onChange={e => field.handleChange(e.target.value)}
                                                rows={4}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </>
                                    )}
                                </form.Field>
                            </div>
                            <div className="space-y-2">
                                <form.Field
                                    name="integrations"

                                >
                                    {(field) => (
                                        <>
                                            <label
                                                htmlFor={field.name}
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                {labels[field.name]}
                                            </label>
                                            <Input defaultValue={form.getFieldValue(field.name) as string} name={field.name} onChange={(e) => field.handleChange(e.target.value)} />
                                        </>
                                    )}
                                </form.Field>
                            </div>
                        </>

                )}
            </form.Subscribe>
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
