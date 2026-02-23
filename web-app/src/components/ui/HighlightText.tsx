'use client';

import React from 'react';

/**
 * Renders text with rich visual markers:
 * - **text** = accent-colored bold (magenta)
 * - __text__ = accent underline decoration
 * - ~~text~~ = italic accent glow
 *
 * Usage: <HighlightText text="This is **important**, __underlined__ and ~~italic~~ text" />
 */
export function HighlightText({
    text,
    className = '',
    variant = 'dark',
}: {
    text: string;
    className?: string;
    variant?: 'dark' | 'light';
}) {
    // Process markers in order: **bold**, __underline__, ~~italic~~
    const tokens = tokenize(text);
    const underlineColor = variant === 'light' ? 'text-black' : 'text-white';

    return (
        <span className={className}>
            {tokens.map((token, i) => {
                if (token.type === 'bold') {
                    return (
                        <span key={i} className="text-[var(--color-accent)] font-semibold">
                            {token.content}
                        </span>
                    );
                }
                if (token.type === 'underline') {
                    return (
                        <span
                            key={i}
                            className={`${underlineColor} font-semibold underline decoration-[var(--color-accent)] decoration-2 underline-offset-4`}
                        >
                            {token.content}
                        </span>
                    );
                }
                if (token.type === 'italic') {
                    return (
                        <em
                            key={i}
                            className="text-[var(--color-accent)]/80 not-italic font-medium"
                            style={{ fontStyle: 'italic' }}
                        >
                            {token.content}
                        </em>
                    );
                }
                return <React.Fragment key={i}>{token.content}</React.Fragment>;
            })}
        </span>
    );
}

interface Token {
    type: 'text' | 'bold' | 'underline' | 'italic';
    content: string;
}

function tokenize(text: string): Token[] {
    const tokens: Token[] = [];
    // Match **bold**, __underline__, ~~italic~~ in order
    const regex = /\*\*(.*?)\*\*|__(.*?)__|~~(.*?)~~/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
        // Text before this match
        if (match.index > lastIndex) {
            tokens.push({ type: 'text', content: text.slice(lastIndex, match.index) });
        }

        if (match[1] !== undefined) {
            tokens.push({ type: 'bold', content: match[1] });
        } else if (match[2] !== undefined) {
            tokens.push({ type: 'underline', content: match[2] });
        } else if (match[3] !== undefined) {
            tokens.push({ type: 'italic', content: match[3] });
        }

        lastIndex = match.index + match[0].length;
    }

    // Remaining text
    if (lastIndex < text.length) {
        tokens.push({ type: 'text', content: text.slice(lastIndex) });
    }

    return tokens;
}

export default HighlightText;
