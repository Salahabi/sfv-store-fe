// HOOK where we can safely access the window object in Next.js. It is tricky to access the window object in Next.js because it is not available during server-side rendering. This hook will return the origin of the current window location. On the server side the window object is not available, so the hook will return an empty string. This hook is useful when you need to get the origin of the current window location in Next.js.

import { useState, useEffect} from "react"


export const useOrigin = () => {
    const [mounted, setMounted] = useState(false);
    const origin = typeof window != "undefined" && window.location.origin ? window.location.origin : '';

    useEffect(() => {
        setMounted(true);

    }, []);

    if (!mounted) {
        return '';
    }

    return origin
};