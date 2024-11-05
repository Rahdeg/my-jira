"use client"

import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'


const NotFoundPage = () => {
    return (
        <div className=' h-screen flex gap-y-3 flex-col items-center justify-center '>
            <AlertTriangle className=' size-10 text-red-400' />
            <p className=' text-sm text-muted-foreground text-red-700'>
                Page  not found
            </p>
            <Button variant="secondary" asChild>
                <Link href="/">
                    Back to  home
                </Link>

            </Button>
        </div>
    )
}

export default NotFoundPage