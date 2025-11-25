"use client"
import { useForm } from '@tanstack/react-form';
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient as useTanstackQueryClient } from '@tanstack/react-query';
import { Input } from './ui/input';
import { Button } from './ui/button'; // Assuming you have a Button component
import { getChannelById, addNewChannel, updateChannel } from '@/services/channelsService';
import { Channel, NewChannel, UpdateChannel } from '@/services/channel';

// Re-using TanstackFormInput and TanstackTextareaField from agent-form.tsx
// You might want to move these to a shared location if not already done.
function TanstackFormInputField({ form, name, label, type = "text" }: { form: any, name: string, label: string, type?: string }) {
    return <form.Field name={name} >
        {(field: any) => (
            <div className="space-y-1">
                <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700"
                >
                    {label}
                </label>
                <Input 
                    id={field.name}
                    name={field.name}
                    defaultValue={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)} 
                    type={type}
                />
                {field.state.meta.touchedErrors ? (
                    <em>{field.state.meta.touchedErrors}</em>
                ) : null}
            </div>
        )}
    </form.Field>
}

function TanstackTextareaField({ form, name, label }: { form: any, name: string, label: string }) {
    return <form.Field name={name} >
        {(field: any) => (
             <div className="space-y-1">
                <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700"
                >
                    {label}
                </label>
                <textarea
                    id={field.name}
                    name={field.name}
                    defaultValue={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    rows={4}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {field.state.meta.touchedErrors ? (
                    <em>{field.state.meta.touchedErrors}</em>
                ) : null}
            </div>
        )}
    </form.Field>
}

interface ChannelFormData {
    name: string;
    channel_type: string;
    channel_integration: string;
    external_id: string;
    description: string;
    agent: number; // Or string, depending on your API needs for creation/update
    access_token: string;
}

const labels: { [key in keyof ChannelFormData]: string } = {
    name: 'Channel Name',
    channel_type: 'Channel Type',
    channel_integration: 'Channel Integration',
    external_id: 'External ID',
    description: 'Description',
    agent: 'Agent ID',
    access_token: 'Access Token'
};

export const queryClient = new QueryClient();

export default function ChannelFormWrapper({ channelId }: { channelId?: string }) {
    return (
        <QueryClientProvider client={queryClient}>
            {channelId ? <UpdateChannelForm channelId={channelId} /> : <NewChannelForm />}
            
        </QueryClientProvider>
    );
}

const defaultValues: ChannelFormData = {
    name: '',
    channel_type: '',
    channel_integration: '',
    external_id: '',
    description: '',
    agent: 0, // Default agent ID, adjust as needed
    access_token: ''
};

export function NewChannelForm() {
    const tanstackQueryClient = useTanstackQueryClient();
    const { mutate, error, isPending } = useMutation<Channel, Error, NewChannel>({
        mutationFn: async (data: NewChannel) => {
            return addNewChannel(data);
        },
        onSuccess: () => {
            tanstackQueryClient.invalidateQueries({ queryKey: ['channels'] });
            console.log('Channel created successfully');
            // Potentially redirect or show a success message
        },
        onError: (error) => {
            console.error('Error creating channel:', error);
        }
    });

    const onSubmit = async ({ value }: { value: ChannelFormData }) => {
        mutate(value as NewChannel); // Cast to NewChannel, ensure types match
    };

    return (
        <ChannelFormComponent isLoading={isPending} defaultValues={defaultValues} onSubmit={onSubmit} error={error?.message || null} />
    );
}

export function UpdateChannelForm({ channelId }: { channelId: string }) {
    const tanstackQueryClient = useTanstackQueryClient();
    const { data, isLoading: isFetchingChannel } = useQuery<Channel, Error, ChannelFormData>({
        queryKey: ['channels', channelId],
        // @ts-ignore
        queryFn: async () => {
            const channel = await getChannelById(channelId);
            // Map Channel to ChannelFormData if necessary, or ensure types are compatible
            return {
                name: channel.name,
                channel_type: channel.channel_type,
                channel_integration: channel.channel_integration,
                external_id: channel.external_id,
                description: channel.description,
                agent: channel.agent,
                access_token: channel.access_token,
            };
        },
    });

    const { mutate, error, isPending } = useMutation<Channel, Error, UpdateChannel>({
        mutationKey: ['channels', channelId],
        mutationFn: async (formData: ChannelFormData) => {
            return updateChannel({ ...formData, id: channelId } as UpdateChannel);
        },
        onSuccess: (updatedChannel) => {
            tanstackQueryClient.invalidateQueries({ queryKey: ['channels'] });
            tanstackQueryClient.invalidateQueries({ queryKey: ['channels', updatedChannel.id] });
            console.log('Channel updated successfully');
        },
        onError: (error) => {
            console.error('Error updating channel:', error);
        }
    });

    const onSubmit = async ({ value }: { value: ChannelFormData }) => {
        mutate(value as UpdateChannel); // Cast, ensure 'id' is handled correctly if not in form
    };

    if (isFetchingChannel) return <p>Loading channel data...</p>;
    if (!data) return <p>Loading form...</p>;

    return (
        <ChannelFormComponent isLoading={isPending} onSubmit={onSubmit} defaultValues={data} error={error?.message || null} />
    );
}

export function ChannelFormComponent({ onSubmit, defaultValues, error, isLoading }: { isLoading: boolean, onSubmit: any, defaultValues: ChannelFormData, error: string | null }) {
        // @ts-ignore
    const form = useForm<ChannelFormData>({
        defaultValues,
        onSubmit: async ({ value }) => {
            await onSubmit({ value });
        },
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md"
        >
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}

            <TanstackFormInputField label={labels.name} name='name' form={form} />
            <TanstackFormInputField label={labels.channel_type} name='channel_type' form={form} />
            <TanstackFormInputField label={labels.channel_integration} name='channel_integration' form={form} />
            <TanstackFormInputField label={labels.external_id} name='external_id' form={form} />
            <TanstackTextareaField label={labels.description} name='description' form={form} />
            <TanstackFormInputField label={labels.agent} name='agent' form={form} type='number' />
            <TanstackFormInputField label={labels.access_token} name='access_token' form={form} />
            
            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading || form.state.isSubmitting}>
                    {isLoading || form.state.isSubmitting ? 'Saving...' : (defaultValues.name ? 'Update Channel' : 'Create Channel')}
                </Button>
            </div>
        </form>
    );
}