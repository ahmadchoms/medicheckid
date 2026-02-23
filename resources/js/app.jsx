import "./bootstrap";
import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ErrorBoundary } from "@/components/ui/feedback";

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
                    <Toaster
                        position="top-right"
                        richColors
                        toastOptions={{
                            style: {
                                border: "3px solid #0A0A0A",
                                borderRadius: "0px",
                                boxShadow: "4px 4px 0px 0px #0A0A0A",
                                fontFamily: '"DM Sans", sans-serif',
                            },
                        }}
                    />
                </ErrorBoundary>
            </QueryClientProvider>,
        );
    },

    progress: {
        color: "#FFE500",
        showSpinner: false,
    },
});
