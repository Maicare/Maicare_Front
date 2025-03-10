import { ReactNode, useState } from 'react';

const Tooltip = ({ text, children }: { text: string, children: ReactNode }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="relative inline-block hover:cursor-pointer">
            {/* Trigger Element */}
            <div
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
            >
                {children}
            </div>

            {/* CopyTooltip */}
            {isVisible && (
                <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2">
                    <div className="bg-indigo-300 text-white text-sm px-3 py-2 rounded-md whitespace-nowrap">
                        {text}
                    </div>
                    {/* CopyTooltip Arrow */}
                    <div className="absolute w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-indigo-300 left-1/2 -translate-x-1/2 rotate-180"></div>
                </div>
            )}
        </div>
    );
};

export default Tooltip;