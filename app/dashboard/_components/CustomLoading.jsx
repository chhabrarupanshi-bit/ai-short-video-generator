import React from 'react'
import Image from 'next/image'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


const CustomLoading = ({loading}) => {
    return (
        <AlertDialog open={loading}>

            <AlertDialogContent className="w-[calc(100%-2rem)] max-w-sm overflow-hidden rounded-2xl border border-[#232b56] bg-gradient-to-b from-[#0c1124] to-[#080b1a] p-8 text-white shadow-[0_20px_60px_-15px_rgba(99,102,241,0.5)]">

                {/* Upar ki soft glow */}
                <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/25 blur-3xl" />

                <div className="relative flex flex-col items-center text-center">

                    {/* GIF ka background white hai, isliye usko rounded white card me rakha hai */}
                    <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl bg-white shadow-[0_0_40px_-6px_rgba(99,102,241,0.7)] ring-4 ring-indigo-400/20">
                        <Image src={'/progress.gif'} alt="Loading..." width={100} height={100} className='mx-auto' unoptimized />
                    </div>

                    <AlertDialogTitle className="mt-6 text-lg font-semibold tracking-tight text-white">
                        Generating Video Script...
                    </AlertDialogTitle>

                    <AlertDialogDescription className="mt-1.5 text-sm text-[#8a94b8]">
                        Don&apos;t refresh the page.
                    </AlertDialogDescription>

                    {/* Bouncing dots */}
                    <div className="mt-5 flex items-center gap-1.5" aria-hidden="true">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-[#7b8ef8]" style={{ animationDelay: '0ms' }} />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-[#7b8ef8]" style={{ animationDelay: '150ms' }} />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-[#7b8ef8]" style={{ animationDelay: '300ms' }} />
                    </div>

                </div>

            </AlertDialogContent>
        </AlertDialog>
    )
}

export default CustomLoading