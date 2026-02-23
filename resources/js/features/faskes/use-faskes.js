import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useDebounce } from "@/hooks";
import { FASKES_DATA } from "./faskes-data";

// Simulates an async fetch for realistic UX and future API migration.
function fetchFaskes() {
    return new Promise((resolve) => {
        setTimeout(() => resolve(FASKES_DATA), 400);
    });
}

// ─── useFaskes ──────────────────────────────────────────────
// TanStack Query hook with client-side filtering.
// Wraps static data now, easily switchable to real API later.

export function useFaskes({ search = "", city = "", type = "", igdOnly = false } = {}) {
    const debouncedSearch = useDebounce(search, 300);

    const query = useQuery({
        queryKey: ["faskes"],
        queryFn: fetchFaskes,
        staleTime: 1000 * 60 * 30, // Data is static, cache 30 min
    });

    const filtered = useMemo(() => {
        if (!query.data) return [];

        return query.data.filter((item) => {
            // Search by name or address
            if (debouncedSearch) {
                const q = debouncedSearch.toLowerCase();
                const matchName = item.name.toLowerCase().includes(q);
                const matchAddress = item.address.toLowerCase().includes(q);
                if (!matchName && !matchAddress) return false;
            }

            // Filter by city
            if (city && item.city !== city) return false;

            // Filter by type
            if (type && item.type !== type) return false;

            // IGD only
            if (igdOnly && !item.hasIGD) return false;

            return true;
        });
    }, [query.data, debouncedSearch, city, type, igdOnly]);

    return {
        ...query,
        data: filtered,
        totalCount: query.data?.length ?? 0,
    };
}
