import { useState } from 'react';
import { ImageInput } from './components/ImageInput';
import { ResultsDisplay } from './components/ResultsDisplay';
import { NutrientSearch } from './components/NutrientSearch';
import { analyzeImage } from './services/geminiService';
import { AnalysisResult } from './types';
import { Apple, Salad, Info } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageCapture = async (base64: string) => {
    setCurrentImage(base64);
    setIsLoading(true);
    setResults([]);
    
    try {
      const data = await analyzeImage(base64);
      setResults(data);
    } catch (err) {
      console.error("Analysis failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <Salad size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-stone-900">NutriVision</h1>
              <p className="text-[10px] text-stone-400 uppercase font-bold tracking-widest leading-none">AI Nutrient Analysis</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-stone-600 hover:text-emerald-600 transition-colors">Analyzer</a>
            <a href="#" className="text-sm font-medium text-stone-600 hover:text-emerald-600 transition-colors">Nutrient Search</a>
            <a href="#" className="text-sm font-medium text-stone-600 hover:text-emerald-600 transition-colors">History</a>
          </nav>

          <button className="p-2 text-stone-400 hover:text-stone-900 transition-colors">
            <Info size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider"
          >
            <Apple size={14} />
            Powered by Gemini 1.5
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-black text-stone-900 tracking-tight">
            Analyze Your Food <br />
            <span className="text-emerald-500">Instantly.</span>
          </h2>
          <p className="text-stone-500 max-w-xl mx-auto text-lg">
            Detect fruits and vegetables, estimate volume, and get complete nutritional data with a single photo.
          </p>
        </div>

        {/* Action Section */}
        <ImageInput onImageCapture={handleImageCapture} isLoading={isLoading} />

        {/* Results Section */}
        {currentImage && results.length > 0 && (
          <ResultsDisplay results={results} image={currentImage} />
        )}

        {/* Search Section */}
        <NutrientSearch />

        {/* Footer Info */}
        <div className="mt-24 pt-12 border-t border-stone-200 text-center space-y-4">
          <div className="flex justify-center gap-8 text-stone-400">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-stone-900">98%</span>
              <span className="text-[10px] uppercase font-bold tracking-widest">Accuracy</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-stone-900">10+</span>
              <span className="text-[10px] uppercase font-bold tracking-widest">Nutrients</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-stone-900">2s</span>
              <span className="text-[10px] uppercase font-bold tracking-widest">Analysis</span>
            </div>
          </div>
          <p className="text-stone-400 text-xs">
            © 2026 NutriVision AI. For educational purposes only. Always consult a nutritionist.
          </p>
        </div>
      </main>
    </div>
  );
}
