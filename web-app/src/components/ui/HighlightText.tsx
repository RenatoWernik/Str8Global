'use client';

import React from 'react';

/**
 * Renders text with **keyword** markers as accent-colored spans.
 * Usage: <HighlightText text="This is **important** text" />
 */
export function HighlightText({
    text,
    className = '',
}: {
    text: string;
    className?: string;
}) {
    const parts = text.split(/\*\*(.*?)\*\*/g);

    return (
        <span className={className}>
            {parts.map((part, i) =>
                i % 2 === 1 ? (
                    <span key={i} className="text-[var(--color-accent)] font-semibold">
                        {part}
                    </span>
                ) : (
                    <React.Fragment key={i}>{part}</React.Fragment>
                )
            )}
        </span>
    );
}

export default HighlightText;
