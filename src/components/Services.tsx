import React from 'react'
import { Link } from 'react-router-dom'
import image from './logork.jpg'

const AnimatedSection: React.FC<{
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}> = ({ children, delay = 0, direction = 'up', className = '' }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  const directionClasses = {
    up: 'translate-y-8',
    down: '-translate-y-8',
    left: 'translate-x-8',
    right: '-translate-x-8'
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 translate-x-0 translate-y-0' 
          : `opacity-0 ${directionClasses[direction]}`
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default function Services() {
  const services = [
    {
      title: 'Fuel Supply & Logistics',
      description: 'Reliable fuel procurement, storage and distribution for commercial and industrial clients.'
    },
    {
      title: 'Drilling & Well Support',
      description: 'Field operations support including rig services, wellsite logistics and maintenance.'
    },
    {
      title: 'Equipment Maintenance',
      description: 'Preventive and corrective maintenance for heavy petroleum equipment and fleets.'
    },
    {
      title: 'Pipeline & Terminal Services',
      description: 'Pipeline inspection, integrity support and terminal operations assistance.'
    },
    {
      title: 'Environmental & Compliance',
      description: 'Environmental monitoring, compliance advisory and waste management solutions.'
    },
    {
      title: 'Technical Consulting',
      description: 'Operational audits, safety reviews and technical advisory from experienced engineers.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-100">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-orange-500">
                <img 
                  src={image}
                  alt="DOJ COREFIELD LOGO"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">DOJ COREFIELD ENERGY</div>
                <div className="text-xs text-gray-600">Petroleum Services</div>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Home</Link>
              <Link to="/about" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">About</Link>
              <Link to="/services" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Services</Link>
              <Link to="/profiles" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Profiles</Link>
              <Link to="/contact" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <AnimatedSection direction="up" delay={200}>
            <h1 className="text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Comprehensive petroleum services tailored for energy operators and industrial clients.
            </p>
          </AnimatedSection>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <AnimatedSection direction="up" delay={300}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h3>
                <p className="text-gray-600">{s.description}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
