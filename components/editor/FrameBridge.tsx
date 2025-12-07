'use client'

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react'

interface FrameBridgeProps {
    url: string
    onSelectComponent: (component: any) => void
}

export interface FrameBridgeRef {
    sendMessage: (type: string, payload: any) => void
}

const FrameBridge = forwardRef<FrameBridgeRef, FrameBridgeProps>(({ url, onSelectComponent }, ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const [loading, setLoading] = useState(true)

    useImperativeHandle(ref, () => ({
        sendMessage: (type: string, payload: any) => {
            if (iframeRef.current?.contentWindow) {
                iframeRef.current.contentWindow.postMessage({ type, payload }, '*')
            }
        }
    }))

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            // Relaxed security for debugging: just warn but don't block localhost variations
            if (!event.origin.includes('localhost')) {
                console.warn('FrameBridge: Message ignored from', event.origin)
                return
            }

            console.log('CMS Bridge Raw Message:', event.data)

            if (event.data.type === 'READY') {
                setLoading(false)
            }

            if (event.data.type === 'SELECT_COMPONENT') {
                console.log('Component Selected:', event.data)
                // { type: 'SELECT_COMPONENT', id, type, props }
                onSelectComponent(event.data)
            }
        }

        window.addEventListener('message', handleMessage)
        return () => window.removeEventListener('message', handleMessage)
    }, [onSelectComponent])

    return (
        <div className="w-full h-full bg-slate-100 flex items-center justify-center p-8 overflow-hidden">
            <div className="relative w-full h-full max-w-[1400px] shadow-2xl rounded-sm overflow-hidden bg-white ring-1 ring-slate-900/5">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
                    </div>
                )}
                <iframe
                    ref={iframeRef}
                    src={url}
                    className="w-full h-full border-0"
                    sandbox="allow-scripts allow-same-origin allow-forms"
                    title="Site Editor"
                />
            </div>
        </div>
    )
})

FrameBridge.displayName = 'FrameBridge'

export default FrameBridge
