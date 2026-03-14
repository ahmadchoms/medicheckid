import "./bootstrap";
import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "@/components/ui/feedback";
import { Toaster } from "./components/ui/sonner";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 10,
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

createInertiaApp({
    title: (title) =>
        title
            ? `${title} — MediCheck ID`
            : "MediCheck ID | Platform Literasi Kesehatan Indonesia",

    resolve: (name) => {
        const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });
        return pages[`./Pages/${name}.jsx`];
    },

    setup({ el, App, props }) {
        createRoot(el).render(
            <QueryClientProvider client={queryClient}>
                <ErrorBoundary>
                    <App {...props} />
                    <Toaster position="top-right" richColors />
                </ErrorBoundary>
            </QueryClientProvider>,
        );
    },

    progress: {
        color: "#2563eb",
        showSpinner: false,
    },
});
