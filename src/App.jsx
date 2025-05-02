import React, { useState, useEffect } from 'react';
import Navbar from './components/navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Skills from './components/Skills';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import LogoIcon from './assets/logo.jpg'; 

function App() {
  // Initialize dark mode from localStorage or default to false
  const [darkMode, setDarkMode] = useState(() => {
    // Check if we have a saved preference in localStorage
    const savedDarkMode = localStorage.getItem('darkMode');
    // Return the parsed value if it exists, otherwise default to false
    return savedDarkMode ? JSON.parse(savedDarkMode) : false;
  });

  // Save dark mode preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Add smooth scrolling behavior
  useEffect(() => {
    // Set smooth scrolling on the html element
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Clean up function to remove the style when component unmounts
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  // Handler for smooth scrolling that can be passed to components
  const handleSmoothScroll = (e) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    
    if (href && href.startsWith('#')) {
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // Scroll to the element
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update URL without page jump
        window.history.pushState(null, '', href);
      }
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Navbar 
        logo={LogoIcon}
        logoAlt="Portfolio Logo"
        menuItems={[
          { text: "Home", href: "#home", onClick: handleSmoothScroll },
          { text: "Projects", href: "#projects", onClick: handleSmoothScroll },
          { text: "Skills", href: "#skills", onClick: handleSmoothScroll },
          { text: "About", href: "#about", onClick: handleSmoothScroll },
          { text: "Contact", href: "#contact", onClick: handleSmoothScroll }
        ]}
        ctaButton={{ text: "Resume", href: "/resume" }}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      <main>
        <section id="home" className="scroll-mt-16">
          <Hero darkMode={darkMode} />
        </section>
        <section id="projects" className="scroll-mt-16">
          <Projects darkMode={darkMode} />
        </section>
        <section id="skills" className="scroll-mt-16">
          <Skills darkMode={darkMode} />
        </section>
        <section id="about" className="scroll-mt-16">
          <About darkMode={darkMode} />
        </section>
        <section id="contact" className="scroll-mt-16">
          <Contact darkMode={darkMode} />
        </section>
      </main>
      <Footer darkMode={darkMode} />
    </div>
  );
}

export default App;