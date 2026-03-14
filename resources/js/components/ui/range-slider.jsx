export default function RangeSlider({ label, value, min, max, step = 1, onChange }) {
    return (
        <div className="py-2">
            {label && (
                <p className="font-display text-xl md:text-2xl font-bold text-clinical-text mb-5 leading-tight">{label}</p>
            )}
            <div className="flex items-center gap-4">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    aria-label={label || "Range Slider"}
                    className="flex-1 h-2 appearance-none bg-clinical-bg border border-clinical-border rounded-full cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                        [&::-webkit-slider-thumb]:bg-clinical-primary [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:shadow-clinical-sm [&::-webkit-slider-thumb]:cursor-grab
                        [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6
                        [&::-moz-range-thumb]:bg-clinical-primary [&::-moz-range-thumb]:rounded-full"
                />
                <span className="w-12 h-12 flex items-center justify-center rounded-clinical-lg bg-clinical-primary text-white font-display text-xl">
                    {value}
                </span>
            </div>
        </div>
    );
}
