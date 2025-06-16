import ChannelForm from "@/components/channel-form";

export default function Page() {
    return (
        <>
            <div className="flex flex-1 flex-col bg-slate-100 min-h-screen">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 ">
                        <div className="px-4 lg:px-6">     
                         <ChannelForm />
                        </div>              
                    </div>
                </div>
            </div>
        </>
    )
}