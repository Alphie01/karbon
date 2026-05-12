"use client";

import { useEffect, useRef } from "react";
import { updateUserActivity } from "@/app/manage/users/activity-actions";

export default function ActivityTracker({ session }: { session: any }) {
    const lastUpdate = useRef<number>(0);
    const intervalRef = useRef<NodeJS.Timeout>(null);

    useEffect(() => {
        if (!session?.user) return;

        // Log initial activity
        updateUserActivity();
        lastUpdate.current = Date.now();

        // Set up heartbeat every 3 minutes (180000 ms)
        const heartbeat = async () => {
            // Only update if tab is active/visible
            if (document.visibilityState === 'visible') {
                await updateUserActivity();
                lastUpdate.current = Date.now();
            }
        };

        intervalRef.current = setInterval(heartbeat, 180000);

        // Also update when user comes back to the tab
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                const now = Date.now();
                // If last update was more than 3 mins ago, update now
                if (now - lastUpdate.current > 180000) {
                    heartbeat();
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [session]);

    return null; // Side-effect only component
}
