'use client'

import React from 'react'
import Sidebar from '@/components/editor/Sidebar'
import FrameBridge from '@/components/editor/FrameBridge'
import PropertyPanel from '@/components/editor/PropertyPanel'

export default function EditorPage() {
    // Use env var or fallback to the server IP (which works for both local and remote if on VPN/same network, but strictly for server deploy we want the IP)
    // For local dev, localhost:4002 is fine. For server, we need the IP.
    // Ideally this is in .env.local
    const TARGET_SITE_URL = process.env.NEXT_PUBLIC_TARGET_SITE_URL || 'http://34.29.234.193:4002'
    const frameRef = React.useRef<any>(null)

    // Selection State
    const [selectedComponent, setSelectedComponent] = React.useState<any>(null)

    const handleSelectComponent = (component: any) => {
        setSelectedComponent(component)
    }

    const handleUpdateComponent = (updatedProps: any) => {
        if (!selectedComponent) return

        // 1. Update local state (optimistic)
        const updated = { ...selectedComponent, props: updatedProps }
        setSelectedComponent(updated)

        // 2. Send update to Iframe
        frameRef.current?.sendMessage('UPDATE_COMPONENT', {
            id: selectedComponent.id,
            props: updatedProps
        })
    }

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-slate-950">
            {/* Left Sidebar always visible */}
            <div className="flex-shrink-0">
                <Sidebar />
            </div>

            {/* Main Canvas */}
            <main className="flex-1 relative bg-slate-100">
                <FrameBridge
                    ref={frameRef}
                    url={TARGET_SITE_URL}
                    onSelectComponent={handleSelectComponent}
                />
            </main>

            {/* Right Property Panel (Overlay or Split) */}
            {selectedComponent && (
                <div className="flex-shrink-0 border-l border-slate-700">
                    <PropertyPanel
                        component={selectedComponent}
                        onUpdate={handleUpdateComponent}
                        onClose={() => setSelectedComponent(null)}
                    />
                </div>
            )}
        </div>
    )
}
