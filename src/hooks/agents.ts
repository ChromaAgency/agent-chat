import { AgentFormData, queryClient } from "@/components/agent-form"
import { addNewAgent, getAgentById, updateAgent } from "@/services/agentService"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useAddNewAgent = () => useMutation({mutationFn: async (data: AgentFormData) => {
           // Ensure addNewAgent expects number[] for integrations
           return addNewAgent({name:data.name, prompt:data.prompt})
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agents'] })
            console.log('onSuccess: New agent added successfully.')
        },
        onError: (error) => {
            console.error('onError: Failed to add new agent', error)
        }
    })

export const useAgent = (agentId: string) => useQuery({
        queryKey: ['agents', agentId], 
        queryFn: async () => { // Removed empty destructuring from here
           return await getAgentById(agentId)
        },
    });

export const useUpdateAgent = (agentId: string) => useMutation({
        mutationKey: ['agents', agentId],
        mutationFn: async (data: AgentFormData) => {
            // Ensure updateAgent expects number[] for integrations
            return updateAgent({id:agentId,name:data.name,prompt:data.prompt})
        },
        onError: (error) => {
            console.error('onError: Failed to update agent', error)
        },
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: ['agents'] })
            queryClient.invalidateQueries({ queryKey: ['agents', data.id] })
            console.log('onSuccess: Agent updated successfully.')
        },

    })
    