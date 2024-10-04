import 'react';

declare module "*.json" {
    const value: any;
    export default value;
}

declare module 'react' {
    interface CSSProperties {
        [key: `--${string}`]: string | number | undefined;
    }
}
