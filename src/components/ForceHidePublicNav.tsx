"use client";

import { useEffect } from "react";

export default function ForceHidePublicNav() {
    useEffect(() => {
        // Aggressively hide elements that shouldn't be here
        const hideElements = () => {
            const header = document.getElementById("global-header");
            const sidebar = document.getElementById("public-sidebar");

            if (header) {
                header.style.setProperty("display", "none", "important");
                // Also hide by class if id fails
                header.classList.add("hidden");
            }

            if (sidebar) {
                sidebar.style.setProperty("display", "none", "important");
                sidebar.classList.add("hidden");
            }
        };

        // Run immediately
        hideElements();

        // Run on mutation (in case they re-appear)
        const observer = new MutationObserver(hideElements);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, []);

    return null;
}
