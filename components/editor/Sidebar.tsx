'use client'

import React from 'react'

const AVAILABLE_COMPONENTS = [
    { id: 'Hero', label: 'Hero Section', icon: '🖼️' },
    { id: 'Services', label: 'Services List', icon: '🛠️' },
    { id: 'Gallery', label: 'Photo Gallery', icon: '📷' },
    { id: 'Testimonials', label: 'Testimonials', icon: '💬' },
    // { id: 'Process', label: 'Process Steps', icon: '➡️' },
    // { id: 'Footer', label: 'Footer', icon: '⬇️' },
]

export default function Sidebar() {
    const handleDragStart = (e: React.DragEvent, componentId: string) => {
        e.dataTransfer.setData('componentType', componentId)
    }

    return (
        <div className="w-64 bg-slate-900 border-r border-slate-700 h-screen flex flex-col">
            <div className="p-4 border-b border-slate-700">
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                    ⚡ Riff CMS
                </h1>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Components
                </h2>

                <div className="space-y-2">
                    {AVAILABLE_COMPONENTS.map((comp) => (
                        <div
                            key={comp.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, comp.id)}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-3 rounded-lg cursor-grab active:cursor-grabbing hover:shadow-md transition-all flex items-center gap-3 border border-slate-700 hover:border-slate-500"
                        >
                            <span className="text-xl">{comp.icon}</span>
                            <span className="font-medium">{comp.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-4 border-t border-slate-700">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    v2.0 Visual Editor
                </div>
            </div>
        </div>
    )
}
