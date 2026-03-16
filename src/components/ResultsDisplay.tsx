import React from 'react';
import { AnalysisResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Droplets, Layers, Box, Weight, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface ResultsDisplayProps {
  results: AnalysisResult[];
  image: string;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, image }) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const selected = results[selectedIndex];

  if (!results.length) return null;

  const nutrientData = [
    { name: 'Carbs', value: selected.nutrients.carbohydrates, unit: 'g' },
    { name: 'Fiber', value: selected.nutrients.fiber, unit: 'g' },
    { name: 'Sugar', value: selected.nutrients.sugar, unit: 'g' },
    { name: 'Protein', value: selected.nutrients.protein, unit: 'g' },
    { name: 'Potassium', value: selected.nutrients.potassium / 100, unit: 'mg x100' },
    { name: 'Magnesium', value: selected.nutrients.magnesium, unit: 'mg' },
  ];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
      {/* Visual Analysis */}
      <div className="space-y-6">
        <div className="relative rounded-3xl overflow-hidden shadow-xl bg-stone-100 aspect-square">
          <img src={image} alt="Analysis" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
          
          {/* Bounding Boxes */}
          {results.map((res, idx) => {
            const [ymin, xmin, ymax, xmax] = res.boundingBox;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setSelectedIndex(idx)}
                className={`absolute border-2 cursor-pointer transition-all ${
                  selectedIndex === idx ? 'border-emerald-500 bg-emerald-500/10 z-10' : 'border-white/50 bg-white/5 hover:border-white'
                }`}
                style={{
                  top: `${ymin / 10}%`,
                  left: `${xmin / 10}%`,
                  width: `${(xmax - xmin) / 10}%`,
                  height: `${(ymax - ymin) / 10}%`,
                }}
              >
                <span className="absolute -top-6 left-0 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                  {res.name} ({Math.round(res.confidence * 100)}%)
                </span>
              </motion.div>
            );
          })}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {results.map((res, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                selectedIndex === idx ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white text-stone-600 hover:bg-stone-100'
              }`}
            >
              {res.name}
            </button>
          ))}
        </div>
      </div>

      {/* Details Panel */}
      <motion.div
        key={selectedIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-3xl p-8 shadow-xl border border-stone-100 space-y-8"
      >
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-stone-900 capitalize">{selected.name}</h2>
            <p className="text-stone-500 flex items-center gap-1 mt-1">
              <Info size={14} />
              Analysis based on {selected.weight_g}g estimated weight
            </p>
          </div>
          <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-2xl font-bold text-xl">
            {selected.nutrients.calories} <span className="text-xs uppercase">kcal</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-stone-50 rounded-2xl flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <Droplets size={20} />
            </div>
            <div>
              <p className="text-xs text-stone-500 uppercase font-bold tracking-wider">Moisture</p>
              <p className="font-semibold text-stone-900 capitalize">{selected.moisture}</p>
            </div>
          </div>
          <div className="p-4 bg-stone-50 rounded-2xl flex items-center gap-3">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
              <Layers size={20} />
            </div>
            <div>
              <p className="text-xs text-stone-500 uppercase font-bold tracking-wider">Texture</p>
              <p className="font-semibold text-stone-900 capitalize">{selected.texture}</p>
            </div>
          </div>
          <div className="p-4 bg-stone-50 rounded-2xl flex items-center gap-3">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-xl">
              <Box size={20} />
            </div>
            <div>
              <p className="text-xs text-stone-500 uppercase font-bold tracking-wider">Volume</p>
              <p className="font-semibold text-stone-900">{selected.volume_cm3} cm³</p>
            </div>
          </div>
          <div className="p-4 bg-stone-50 rounded-2xl flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
              <Weight size={20} />
            </div>
            <div>
              <p className="text-xs text-stone-500 uppercase font-bold tracking-wider">Weight</p>
              <p className="font-semibold text-stone-900">{selected.weight_g} g</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-stone-900">Nutrient Breakdown</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={nutrientData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-2 shadow-lg rounded-lg border border-stone-100 text-xs">
                          <p className="font-bold">{payload[0].payload.name}</p>
                          <p>{payload[0].value} {payload[0].payload.unit}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {nutrientData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-stone-100">
          <div className="text-center">
            <p className="text-[10px] text-stone-400 uppercase font-bold">Vit A</p>
            <p className="font-bold text-stone-700">{selected.nutrients.vitaminA} IU</p>
          </div>
          <div className="text-center border-x border-stone-100">
            <p className="text-[10px] text-stone-400 uppercase font-bold">Vit C</p>
            <p className="font-bold text-stone-700">{selected.nutrients.vitaminC} mg</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-stone-400 uppercase font-bold">Vit K</p>
            <p className="font-bold text-stone-700">{selected.nutrients.vitaminK} mcg</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
