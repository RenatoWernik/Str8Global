'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    debounceMs?: number;
    className?: string;
}

export function SearchInput({ 
    value, 
    onChange, 
    placeholder = 'Pesquisar...', 
    debounceMs = 300,
    className = ""
}: SearchInputProps) {
    const [localValue, setLocalValue] = useState(value);

    // Sync from upper state if needed
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (localValue !== value) {
                onChange(localValue);
            }
        }, debounceMs);

        return () => clearTimeout(handler);
    }, [localValue, onChange, debounceMs, value]);

    return (
        <div className={`relative group ${className}`}>
            <Search 
                size={16} 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-cyan-400 transition-colors pointer-events-none" 
            />
            <input
                type="text"
                placeholder={placeholder}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                className="w-full bg-[#1A1A24] border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-medium"
            />
            {localValue && (
                <button
                    onClick={() => {
                        setLocalValue('');
                        onChange('');
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/80 p-1 rounded-md hover:bg-white/5 transition-colors"
                >
                    <X size={14} />
                </button>
            )}
        </div>
    );
}
