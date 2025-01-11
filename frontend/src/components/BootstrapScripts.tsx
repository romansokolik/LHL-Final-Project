'use client';
import {useEffect} from "react";

export default function BootstrapScripts() {

    useEffect(() => {
        import("bootstrap/dist/js/bootstrap.min.js");
        // import("bootstrap/dist/js/bootstrap.bundle.js");
    }, []);

    return null;
}