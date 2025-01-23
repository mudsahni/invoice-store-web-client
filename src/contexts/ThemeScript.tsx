'use client'

import { useEffect } from 'react'

export function ThemeScript() {
    useEffect(() => {
        document.documentElement.className = localStorage.getItem('theme') || 'dark'
    }, [])

    return null
}

