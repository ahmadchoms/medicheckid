import { useState, useEffect, useRef, useCallback } from "react";


export function useSpeechRecognition({ lang = "id-ID" } = {}) {
    const [text, setText] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
            setIsSupported(true);
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = lang;

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        } else {
            setIsSupported(false);
        }
    }, [lang]);

    const start = useCallback(() => {
        if (!recognitionRef.current) return;
        
        
        const currentText = text;

        recognitionRef.current.onresult = (event) => {
            let interimTranscript = "";
            let finalTranscript = "";

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + " ";
                } else {
                    interimTranscript += transcript;
                }
            }

            const newText = (
                currentText +
                (currentText && !currentText.endsWith(" ") ? " " : "") +
                finalTranscript +
                interimTranscript
            ).trim();
            
            setText(newText);
        };

        recognitionRef.current.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        try {
            recognitionRef.current.start();
            setIsListening(true);
        } catch (e) {
            console.error("Error starting speech recognition", e);
        }
    }, [text]);

    const stop = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, [isListening]);

    const reset = useCallback(() => {
        setText("");
    }, []);

    const setManualText = useCallback((newText) => {
        setText(newText);
    }, []);

    return {
        text,
        isListening,
        isSupported,
        start,
        stop,
        reset,
        setText: setManualText
    };
}
