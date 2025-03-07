import { ReactNode, useState } from 'react';

const CopyTooltip = ({ text, children }: { text: string, children: ReactNode }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const handleCopyClick = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset the "Copied!" message after 2 seconds
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };
    return (
        <div className="relative inline-block hover:cursor-pointer" onClick={() => handleCopyClick()}>
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
                        {isCopied ? "Copied" : "Click to copy"}
                    </div>
                    {/* CopyTooltip Arrow */}
                    <div className="absolute w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-indigo-300 left-1/2 -translate-x-1/2 rotate-180"></div>
                </div>
            )}
        </div>
    );
};

export default CopyTooltip;