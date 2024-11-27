import React from 'react';
import { Book, GraduationCap, Video, Code, Wind, Activity, FileText, Users, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
  {
    title: 'Getting Started',
    resources: [
      {
        title: 'CFD Fundamentals',
        description: 'Essential concepts and principles of computational fluid dynamics',
        icon: <Book className="w-6 h-6 text-black" />,
        link: 'https://www.nasa.gov/sites/default/files/atoms/files/cfd_vision_2030.pdf',
        type: 'Documentation'
      },
      {
        title: 'Basic Tutorial Series',
        description: 'Step-by-step introduction to CFD simulation',
        icon: <Video className="w-6 h-6 text-black" />,
        link: 'https://www.youtube.com/playlist?list=PLnJ8lZQF6nxLFGxuFvZUH7gE3z5iPxW9Q',
        type: 'Video'
      }
    ]
  },
  {
    title: 'Advanced Topics',
    resources: [
      {
        title: 'Turbulence Modeling',
        description: 'Deep dive into different turbulence models and their applications',
        icon: <Wind className="w-6 h-6 text-black" />,
        link: 'https://turbmodels.larc.nasa.gov/',
        type: 'Article'
      },
      {
        title: 'Mesh Generation Guide',
        description: 'Best practices for creating high-quality computational meshes',
        icon: <Code className="w-6 h-6 text-black" />,
        link: 'https://www.cfdsupport.com/OpenFOAM-Training-by-CFD-Support/node287.html',
        type: 'Guide'
      }
    ]
  },
  {
    title: 'Tools & Software',
    resources: [
      {
        title: 'OpenFOAM Documentation',
        description: 'Complete guide to using OpenFOAM for CFD simulations',
        icon: <FileText className="w-6 h-6 text-black" />,
        link: 'https://www.openfoam.com/documentation/user-guide',
        type: 'Documentation'
      },
      {
        title: 'ParaView Learning Resources',
        description: 'Learn to visualize and analyze CFD results effectively',
        icon: <Activity className="w-6 h-6 text-black" />,
        link: 'https://docs.paraview.org/en/latest/Tutorials/index.html',
        type: 'Tutorial'
      }
    ]
  },
  {
    title: 'Community & Support',
    resources: [
      {
        title: 'CFD Online Forums',
        description: 'Connect with CFD professionals and get help',
        icon: <Users className="w-6 h-6 text-black" />,
        link: 'https://www.cfd-online.com/Forums/',
        type: 'Community'
      },
      {
        title: 'Research Papers Database',
        description: 'Access latest CFD research and publications',
        icon: <Globe className="w-6 h-6 text-black" />,
        link: 'https://arxiv.org/search/?query=computational+fluid+dynamics&searchtype=all',
        type: 'Research'
      }
    ]
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export const Resources: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-400 mb-4">CFD Learning Hub</h1>
        <p className="text-gray-400">Comprehensive resources to master computational fluid dynamics</p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {categories.map((category, categoryIndex) => (
          <motion.div
            key={categoryIndex}
            variants={item}
            className="bg-gradient-to-br from-gray-900 to-black border border-green-500/20 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-green-400 mb-4">{category.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.resources.map((resource, resourceIndex) => (
                <motion.a
                  key={resourceIndex}
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 bg-black/40 border border-green-500/10 rounded-lg hover:border-green-500/30 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="p-3 bg-gradient-to-br from-green-400 to-green-600 rounded-lg">
                    {resource.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-green-400">{resource.title}</h3>
                        <p className="text-sm text-gray-400 mt-1">{resource.description}</p>
                      </div>
                    </div>
                    <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                      {resource.type}
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};