import { AlertTriangle, Phone } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function EmergencyModal({ isOpen, onOpenChange }) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent 
                className="sm:max-w-md border-clinical-danger border-2 p-0 overflow-hidden" 
                showCloseButton={false}
                onPointerDownOutside={(e) => e.preventDefault()} 
                onEscapeKeyDown={(e) => e.preventDefault()} 
            >
                <div className="bg-clinical-danger text-white p-6 flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-2 animate-pulse">
                        <AlertTriangle size={32} className="text-white" />
                    </div>
                    
                    <DialogHeader className="text-white w-full space-y-2">
                        <DialogTitle className="text-2xl font-display font-bold text-center">
                            PERINGATAN DARURAT
                        </DialogTitle>
                        <DialogDescription className="text-white/90 font-body text-center text-base">
                            Sistem mendeteksi kemungkinan kondisi medis darurat berdasarkan keluhan Anda.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="bg-white/10 rounded-clinical-lg p-4 w-full mt-2 backdrop-blur-sm border border-white/20">
                        <p className="font-body font-medium mb-3">Harap segera menuju IGD rumah sakit terdekat atau hubungi layanan darurat medis.</p>
                        
                        <a 
                            href="tel:119" 
                            className="bg-white text-clinical-danger text-xl font-display font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 hover:bg-clinical-danger-light transition-colors w-full shadow-clinical-lg mb-2"
                        >
                            <Phone size={24} fill="currentColor" />
                            Telepon 119
                        </a>
                    </div>

                    <button 
                        onClick={() => onOpenChange(false)}
                        className="text-white/70 hover:text-white text-sm font-body underline underline-offset-4 mt-2 transition-colors"
                    >
                        Saya mengerti, tampilkan rincian hasil
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
