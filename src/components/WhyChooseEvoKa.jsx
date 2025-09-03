import React from 'react';
import { Search, Calendar, Users, Check, Languages } from 'lucide-react';
import getTranslation from '../languages';
const WhyChooseEvoKa = ({language}) => {
  const features = [
    {
      icon: <Search className="w-8 h-8 text-purple-400" aria-hidden="true" />,
      title: getTranslation(language,'why_choose_feture.1.title'),
      description: getTranslation(language,'why_choose_feture.1.description'),
    },
    {
      icon: <Calendar className="w-8 h-8 text-purple-400" aria-hidden="true" />,
      title: getTranslation(language,'why_choose_feture.2.title'),
      description: getTranslation(language,'why_choose_feture.2.description'),
    },
    {
      icon: <Users className="w-8 h-8 text-purple-400" aria-hidden="true" />,
      title: getTranslation(language,'why_choose_feture.3.title'),
      description: getTranslation(language,'why_choose_feture.3.description'),
    },
    {
      icon: <Check className="w-8 h-8 text-purple-400" aria-hidden="true" />,
      title: getTranslation(language,'why_choose_feture.4.title'),
      description: getTranslation(language,'why_choose_feture.4.description'),
    },
  ];

  return (
    <section className="mt-10 py-12 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white text-center mb-12">
          {getTranslation(language, 'why_choose_title')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-700 p-6 flex flex-col items-start transition-all duration-200 hover:shadow-md dark:hover:shadow-gray-600"
              role="article"
              aria-labelledby={`feature-title-${index}`}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3
                id={`feature-title-${index}`}
                className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-left"
              >
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed text-left">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
);
};

export default WhyChooseEvoKa;