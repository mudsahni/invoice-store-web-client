import React from 'react';
import { CircleIcon } from 'lucide-react';

const WaveEllipsisButton = ({ name }: { name: string }) => {
    React.useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes wave {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-6px); }
            }
            
            .animate-wave-1 {
                animation: wave 1s ease-in-out infinite;
            }
            
            .animate-wave-2 {
                animation: wave 1s ease-in-out infinite;
                animation-delay: 0.2s;
            }
            
            .animate-wave-3 {
                animation: wave 1s ease-in-out infinite;
                animation-delay: 0.4s;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);
    return (
            <a href="#" className="text-sky-900 text-opacity-80 hover:text-opacity-100 group min-h-[12px] align-middle items-center flex p-2">
                <div className="flex space-x-1">
                    <div className="translate-y-0 [transition:transform_0.2s] group-hover:animate-wave-1">
                        <CircleIcon className="h-1 w-1 fill-current"/>
                    </div>
                    <div className="translate-y-0 [transition:transform_0.2s] group-hover:animate-wave-2">
                        <CircleIcon className="h-1 w-1 fill-current"/>
                    </div>
                    <div className="translate-y-0 [transition:transform_0.2s] group-hover:animate-wave-3">
                        <CircleIcon className="h-1 w-1 fill-current"/>
                    </div>
                </div>
                <span className="sr-only">, {name}</span>
            </a>
    );
};

export default WaveEllipsisButton;