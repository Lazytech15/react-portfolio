import React, { useEffect } from 'react';
import Navbar from './components/navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Skills from './components/Skills';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import LogoIcon from './assets/logo.jpg'; 

function App() {
  // Add smooth scrolling behavior using a React approach
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
    <>
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
      />
      <main>
        <section id="home" className="scroll-mt-16">
          <Hero />
        </section>
        <section id="projects" className="scroll-mt-16">
          <Projects />
        </section>
        <section id="skills" className="scroll-mt-16">
          <Skills />
        </section>
        <section id="about" className="scroll-mt-16">
          <About />
        </section>
        <section id="contact" className="scroll-mt-16">
          <Contact />
        </section>
      </main>
      <Footer />
    </>
  );
}

export default App;