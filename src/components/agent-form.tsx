"use client"

import * as React from "react"
import { useForm } from '@tanstack/react-form'
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query'


// Basic `cn` utility (from Shadcn UI, combines clsx and tailwind-merge)
// You would typically have this in `@/lib/utils.ts`
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

type ClassValue = string | boolean | undefined | null | { [key: string]: ClassValue } | ClassValue[];

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- Shadcn UI Components (Included directly for standalone execution) ---

// ui/input.tsx
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

// ui/checkbox.tsx
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check as CheckIcon } from "lucide-react" // Renamed to avoid conflict with Check from Shadcn

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <CheckIcon className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName


// ui/button.tsx
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"


// ui/command.tsx (Simplified for essential parts)
import { Command as CommandPrimitive } from "cmdk"
import { Search } from "lucide-react"

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className
    )}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
))

CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
))

CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-6 text-center text-sm"
    {...props}
  />
))

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    )}
    {...props}
  />
))

CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  />
))

CommandItem.displayName = CommandPrimitive.Item.displayName


// ui/popover.tsx
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { useAddNewAgent, useAgent, useUpdateAgent } from "@/hooks/agents";

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName


// --- Icons (from lucide-react, included directly) ---
// You would typically import these from 'lucide-react'
const Check = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);
const ChevronsUpDown = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="7 15 12 20 17 15"></polyline>
        <polyline points="7 9 12 4 17 9"></polyline>
    </svg>
);
const XCircle = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
);


// --- Form Field Components (Original) ---

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
            rows={50}
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

// --- New Multi-Select Combobox Components ---

// Data for integrations (replace with your actual data)
const integrationsData = [
    { value: 1, label: "Salesforce" },
    { value: 2, label: "Zendesk" },
    { value: 3, label: "Slack" },
    { value: 4, label: "Jira" },
    { value: 5, label: "HubSpot" },
    { value: 6, label: "Stripe" },
    { value: 7, label: "Google Analytics" },
];

type IntegrationOption = {
    value: number;
    label: string;
};

type TanstackFormComboboxMultiSelectProps = {
    field: any; // TanStack Form field object
    label: string;
    options: IntegrationOption[];
    value: number[]; // Expected value from TanStack Form
};

function TanstackFormComboboxMultiSelect({ field, label, options, value }: TanstackFormComboboxMultiSelectProps) {
    const [open, setOpen] = React.useState(false);
    // `value` from field is the array of selected IDs (numbers)

    const selectedLabels = value
        .map(id => options.find(option => option.value === id)?.label)
        .filter(Boolean) as string[]; // Filter out undefined labels

    const handleSelect = (currentValue: number) => {
        const isSelected = value.includes(currentValue);
        let newSelectedValues: number[];

        if (isSelected) {
            // Remove from selection
            newSelectedValues = value.filter((id) => id !== currentValue);
        } else {
            // Add to selection
            newSelectedValues = [...value, currentValue];
        }
        field.handleChange(newSelectedValues); // Update TanStack Form field
    };

    return (
        <div className="space-y-2">
            <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700"
            >
                {label}
            </label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between min-h-[38px] flex-wrap" // Adjusted width and added flex-wrap
                    >
                        {selectedLabels.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                                {selectedLabels.map((label, index) => (
                                    <span key={index} className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                        {label}
                                        <XCircle
                                            className="ml-1 h-3 w-3 cursor-pointer text-blue-600 hover:text-blue-900"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent popover from closing
                                                const selectedOption = options.find(opt => opt.label === label);
                                                if (selectedOption) {
                                                    handleSelect(selectedOption.value);
                                                }
                                            }}
                                        />
                                    </span>
                                ))}
                            </div>
                        ) : (
                            "Select integrations..." 
                        )}
                        <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command>
                        <CommandInput placeholder={`Search ${label.toLowerCase()}...`} className="h-9" />
                        <CommandList>
                            <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.label} // Use label for search
                                        onSelect={() => {
                                            handleSelect(option.value);
                                            // Keep popover open for multi-select, or close if desired
                                            // setOpen(false); 
                                        }}
                                    >
                                        {option.label}
                                        <Check
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                value.includes(option.value) ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}

function TanstackFormMultiSelectComboboxField({ form, name, label, options }: { form: any, name: string, label: string, options: IntegrationOption[] }) {
    return (
        <form.Field name={name}>
            {(field: any) => (
                <TanstackFormComboboxMultiSelect
                    label={label}
                    options={options}
                    value={form.getFieldValue(field.name) as number[]}
                    field={field}
                />
            )}
        </form.Field>
    );
}


// --- Main Form Components (Modified) ---

export interface AgentFormData {
    name: string
    description: string
    role: string;
    skills: string;
    examples: string;
    output: string;
    prompt: string;
    integrations: number[], // Changed to number[] for multi-select
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
            <>
            {agentId ? <UpdateAgentForm agentId={agentId} /> : <NewAgentForm />}
            </>
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
    integrations: [], // Default to empty array
    advancedMode: false

}
export function NewAgentForm() {
    const queryClient = useQueryClient()
    const { mutate , error, isError, isPending } = useAddNewAgent()
    const onSubmit = async ({ value }: { value: AgentFormData }) => {
        mutate(value)
    }
    return (
        <AgentFormComponent isLoading={isPending} defaultValues={defaultValues} onSubmit={onSubmit} error={error?.message || null} />
    )
}
export function UpdateAgentForm({ agentId }: { agentId: string }) {
    const {data, isLoading: isFetchingAgent } = useAgent(agentId)

    const { mutate, isError, error, isPending } = useUpdateAgent(agentId)
    const onSubmit = async ({ value }: { value: AgentFormData }) => {
        mutate(value)
    }
    // Muestra un estado de carga mientras se obtiene el agente
    if (isFetchingAgent) return <p>Cargando datos del agente...</p>; 

    // Si defaultValues (data) aún no está cargado, puedes mostrar un loader o null
    // para evitar errores si AgentFormComponent espera defaultValues definidos.
    if (!data) return <p>Cargando formulario...</p>; 

    return (
        // @ts-ignore
        <AgentFormComponent isLoading={isPending} onSubmit={onSubmit} defaultValues={data as AgentFormData} error={error?.message || null} />
    )
}
export function AgentFormComponent({ onSubmit, defaultValues, error,isLoading }: {isLoading:boolean, onSubmit: any, defaultValues: AgentFormData, error: string | null }) {
    
    const form = useForm({
        defaultValues:{...defaultValues, advancedMode:true},
        onSubmit: ({ value }) => onSubmit({ value }),
    })

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
            }}
            className="space-y-6  mx-auto p-6 bg-white rounded-lg shadow-md"
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
            {/* <div className="space-y-2">
                <TanstackTextareaField label={labels["description"]} name='description' form={form} />
            </div> */}
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
                {/* Replaced TanstackFormInputField with the new multi-select combobox field */}
                <TanstackFormMultiSelectComboboxField 
                    label={labels["integrations"]} 
                    name='integrations' 
                    form={form} 
                    options={integrationsData} 
                />
            </div>
            <div className="flex justify-end">
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    {isLoading ? 'Saving...' : 'Create Agent'}
                </button>
            </div>
        </form>
    )
}
