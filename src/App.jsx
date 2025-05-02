import React, { useState, useEffect } from 'react';
import Navbar from './components/navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Skills from './components/Skills';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import LogoIcon from './assets/logo.jpg'; 
import useScrollTo from './utils/useScrollTo'; // Import our custom hook

function App() {
  // Initialize dark mode from localStorage or default to false
  const [darkMode, setDarkMode] = useState(() => {
    // Check if we have a saved preference in localStorage
    const savedDarkMode = localStorage.getItem('darkMode');
    // Return the parsed value if it exists, otherwise default to false
    return savedDarkMode ? JSON.parse(savedDarkMode) : false;
  });

  // Use our custom scroll hook
  const { handleLinkClick } = useScrollTo(64); // Assuming navbar height is 64px

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

  // Prevent default hash behavior
  useEffect(() => {
    // Prevent the browser from jumping to the element when hash changes
    const preventScrollOnHashChange = (e) => {
      if (e.target.location.hash) {
        e.preventDefault();
      }
    };
    
    window.addEventListener('hashchange', preventScrollOnHashChange);
    
    return () => {
      window.removeEventListener('hashchange', preventScrollOnHashChange);
    };
  }, []);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Navbar 
        logo={LogoIcon}
        logoAlt="Portfolio Logo"
        menuItems={[
          { text: "Home", href: "#home", onClick: handleLinkClick },
          { text: "Projects", href: "#projects", onClick: handleLinkClick },
          { text: "Skills", href: "#skills", onClick: handleLinkClick },
          { text: "About", href: "#about", onClick: handleLinkClick },
          { text: "Contact", href: "#contact", onClick: handleLinkClick }
        ]}
        ctaButton={{ text: "Resume", href: "/resume" }}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      <main className="pt-16">
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