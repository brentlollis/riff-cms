'use client'

import React, { useState, useEffect } from 'react'

interface PropertyPanelProps {
    component: { id: string; type: string; props: any } | null
    onUpdate: (updatedProps: any) => void
    onClose: () => void
}

export default function PropertyPanel({ component, onUpdate, onClose }: PropertyPanelProps) {
    const [formData, setFormData] = useState<any>({})

    // Update local state when selection changes
    useEffect(() => {
        if (component) {
            setFormData(component.props || {})
        }
    }, [component])

    // Handle Input Changes
    const handleChange = (key: string, value: string) => {
        const newProps = { ...formData, [key]: value }
        setFormData(newProps)
        onUpdate(newProps) // Send up to parent immediately (Realtime)
    }

    if (!component) return null

    return (
        <div className="w-80 bg-slate-900 border-l border-slate-700 h-screen flex flex-col shadow-xl z-50">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                <h2 className="text-white font-bold flex items-center gap-2">
                    <span className="text-blue-400">⚡</span> {component.type}
                </h2>
                <button onClick={onClose} className="text-slate-400 hover:text-white">
                    ✕
                </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-4">
                {Object.keys(formData).map((key) => {
                    // Check if value is a string (basic editor support)
                    const value = formData[key]
                    const isString = typeof value === 'string'

                    if (!isString) return null // Skip complex objects for now

                    const isLongText = value.length > 50

                    return (
                        <div key={key}>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                {key.replace(/([A-Z])/g, ' $1').trim()} {/* camelCase to Title Case */}
                            </label>

                            {isLongText ? (
                                <textarea
                                    value={value}
                                    onChange={(e) => handleChange(key, e.target.value)}
                                    className="w-full bg-slate-800 border-slate-700 text-slate-200 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm min-h-[100px]"
                                />
                            ) : (
                                <input
                                    type="text"
                                    value={value}
                                    onChange={(e) => handleChange(key, e.target.value)}
                                    className="w-full bg-slate-800 border-slate-700 text-slate-200 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                                />
                            )}
                        </div>
                    )
                })}

                {Object.keys(formData).length === 0 && (
                    <div className="text-slate-500 text-sm italic py-4 text-center">
                        No editable properties found.
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-slate-700 bg-slate-900/50">
                <button
                    onClick={onClose}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium text-sm transition-colors"
                >
                    Done
                </button>
            </div>
        </div>
    )
}
