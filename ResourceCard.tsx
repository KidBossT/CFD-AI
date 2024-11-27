import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface ResourceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ title, description, icon, link }) => {
  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-6 bg-gradient-to-br from-gray-900 to-black border border-green-500/20 rounded-xl hover:border-green-400/50 transition-all duration-300"
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-gradient-to-br from-green-400 to-green-600 rounded-lg">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-green-400">{title}</h3>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </div>
          <p className="mt-2 text-sm text-gray-400">{description}</p>
        </div>
      </div>
    </motion.a>
  );
};