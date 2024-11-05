"use client"

import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'


const ErrorPage = () => {
    return (
        <div className=' h-full flex flex-col items-center justify-center '>
            <AlertTriangle className='  size-6 text-muted-foreground' />
            <p className=' text-sm  text-muted-foreground'>
                Something went wrong
            </p>
            <Button variant="secondary" asChild>
                <Link href="/">
                    Back to  home
                </Link>

            </Button>
        </div>
    )
}

export default ErrorPage