import { useState, useEffect } from 'react';

// Animation hook for skills
const useSkillAnimation = () => {
  const [animated, setAnimated] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
      observer.observe(skillsSection);
    }
    
    return () => {
      if (skillsSection) observer.disconnect();
    };
  }, []);
  
  return animated;
};

export default function SkillsPreview({ darkMode }) {
  const animated = useSkillAnimation();
  
  const skillCategories = [
    {
      title: "Frontend",
      icon: "🎨",
      skills: [
        { name: "React", proficiency: 90 },
        { name: "JavaScript", proficiency: 85 },
        { name: "HTML", proficiency: 95 },
        { name: "CSS", proficiency: 88 },
        { name: "Tailwind CSS", proficiency: 80 }
      ]
    },
    {
      title: "Backend & Database",
      icon: "⚙️",
      skills: [
        { name: "Firebase", proficiency: 75 },
        { name: "SQL", proficiency: 70 },
        { name: "Java", proficiency: 65 },
        { name: "Node.js", proficiency: 60 },
        { name: "REST API", proficiency: 72 }
      ]
    },
    {
      title: "Tools & Others",
      icon: "🔧",
      skills: [
        { name: "Vite", proficiency: 85 },
        { name: "Flutter", proficiency: 68 },
        { name: "Git", proficiency: 80 },
        { name: "Responsive Design", proficiency: 90 },
        { name: "Cross-platform Development", proficiency: 75 }
      ]
    }
  ];

  return (
    <div href="#skills" className={`py-20 px-4 sm:px-6 lg:px-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>My Skills</h2>
          <div className="h-1 w-24 bg-blue-600 mx-auto"></div>
          <p className={`mt-6 text-xl max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Technologies and tools I work with to bring ideas to life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <div 
              key={categoryIndex}
              className={`rounded-xl shadow-md p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-center mb-6">
                <span className="text-4xl mb-2">{category.icon}</span>
              </div>
              <h3 className={`text-2xl font-bold text-center mb-6 border-b pb-4 ${
                darkMode ? 'text-white border-gray-700' : 'text-gray-800 border-gray-200'
              }`}>
                {category.title}
              </h3>
              <div className="space-y-6">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex}>
                    <div className="flex justify-between mb-2">
                      <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        {skill.name}
                      </span>
                      <span className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        {skill.proficiency}%
                      </span>
                    </div>
                    <div className={`w-full rounded-full h-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div 
                        className={`bg-blue-600 h-3 rounded-full transition-all duration-1000 ease-out ${
                          darkMode ? 'bg-blue-500' : 'bg-blue-600'
                        }`}
                        style={{ 
                          width: animated ? `${skill.proficiency}%` : '0%',
                          boxShadow: darkMode ? 
                            '0 0 5px rgba(59, 130, 246, 0.7)' : 
                            '0 0 5px rgba(37, 99, 235, 0.5)'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}