// src/custom.d.ts
declare global {
    namespace JSX {
        interface IntrinsicElements {
            input: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
                webkitdirectory?: boolean;
            };
        }
    }
}