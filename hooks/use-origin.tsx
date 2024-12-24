import { useState, useEffect} from "react"


export const useOrigin = () => {
    const [mounted, settMounted] = useState(false);
    const origin = typeof window != "undefined" && window.location.origin ? window.location.origin : '';

    useEffect(() => {
        settMounted(true);

    }, []);

    if (!mounted) {
        return '';
    }

    return origin
};