import React, { useState } from 'react';
import { Search, Apple, Loader2 } from 'lucide-react';
import { searchByNutrient } from '../services/geminiService';
import { SearchResult } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export const NutrientSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const data = await searchByNutrient(query);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-16 p-8 bg-stone-900 rounded-[2.5rem] text-white shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
        <Apple size={120} />
      </div>

      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-2">Nutrient-Based Search</h2>
        <p className="text-stone-400 text-sm mb-6">Find fruits and vegetables rich in specific nutrients</p>

        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Vitamin C, Potassium, Fiber..."
            className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-emerald-600 transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Search'}
          </button>
        </form>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 space-y-4"
            >
              <h3 className="text-emerald-400 font-bold uppercase text-xs tracking-widest">
                Rich in {result.nutrient}:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.items.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10"
                  >
                    <span className="font-medium">{item.name}</span>
                    <span className="text-stone-400 text-sm">{item.amount}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
