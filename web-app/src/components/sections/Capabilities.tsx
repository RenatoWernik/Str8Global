'use client';

import { ResultsComparison } from '@/components/sections/ResultsComparison';
import { CapabilitiesOrbit } from '@/components/sections/CapabilitiesOrbit';

export function Capabilities() {
    return (
        <section className="relative bg-black py-24 md:py-32 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Results Comparison Chart */}
                <ResultsComparison />

                {/* Spacer */}
                <div className="mb-24 md:mb-32" />

                {/* Capabilities Orbit */}
                <CapabilitiesOrbit />
            </div>
        </section>
    );
}

export default Capabilities;
