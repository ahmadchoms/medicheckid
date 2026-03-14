import {
    CircleCheckIcon,
    InfoIcon,
    Loader2Icon,
    OctagonXIcon,
    TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
    return (
        <Sonner
            theme="light"
            className="toaster group font-body"
            position="top-center"
            icons={{
                success: (
                    <CircleCheckIcon className="size-5 text-clinical-success" />
                ),
                info: <InfoIcon className="size-5 text-clinical-primary" />,
                warning: (
                    <TriangleAlertIcon className="size-5 text-clinical-warning" />
                ),
                error: <OctagonXIcon className="size-5 text-clinical-danger" />,
                loading: (
                    <Loader2Icon className="size-5 animate-spin text-clinical-primary" />
                ),
            }}
            style={{
                "--normal-bg": "#ffffff",
                "--normal-text": "#334155",
                "--normal-border": "#e2e8f0",
                "--border-radius": "1rem",
            }}
            toastOptions={{
                classNames: {
                    toast: "shadow-clinical-lg font-body",
                    title: "font-display font-bold text-sm",
                    description:
                        "text-clinical-text-secondary font-body text-xs mt-0.5",
                    actionButton:
                        "bg-clinical-primary text-white font-body font-semibold rounded-clinical-md px-4 py-2",
                    cancelButton:
                        "bg-clinical-bg text-clinical-text font-body font-semibold rounded-clinical-md border border-clinical-border px-4 py-2",
                },
            }}
            {...props}
        />
    );
};

export { Toaster };
