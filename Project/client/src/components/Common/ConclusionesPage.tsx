import React, { useState } from 'react';
import { 
  TrendingUp, 
  Target, 
  Shield, 
  Award, 
  ChevronRight, 
  ChevronDown
} from 'lucide-react';
import { getConclusiones } from '../../utils/mockConclusiones';

const ConclusionesPage: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  
  const conclusiones = getConclusiones();

  const iconMap = {
    TrendingUp,
    Target,
    Shield
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <div className="p-6 overflow-y-auto h-full bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl p-8 text-white">
            <h1 className="text-3xl font-bold mb-4">{conclusiones.title}</h1>
            <p className="text-blue-100 leading-relaxed text-lg">
              {conclusiones.introduction}
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {conclusiones.sections.map((section) => {
            const IconComponent = iconMap[section.icon as keyof typeof iconMap];
            const isExpanded = expandedSections[section.id];

            return (
              <div key={section.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-800">{section.title}</h2>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6">
                    <div className="space-y-6">
                      {section.content.map((item, index) => (
                        <div key={index} className="border-l-4 border-blue-200 pl-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            {item.subtitle}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {item.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>


        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg">
            <Award className="h-5 w-5" />
            <span className="font-medium">Sistema de Dinámica de Sistemas - Análisis Completo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConclusionesPage;