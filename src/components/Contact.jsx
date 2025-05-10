import React, { useState, useRef } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import emailjs from '@emailjs/browser';

const Contact = ({ darkMode }) => {
  const form = useRef();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    // Send email using EmailJS
    // Replace these with your actual EmailJS service, template, and user IDs
    emailjs.sendForm(
      'service_84ds9ei', 
      'template_lkfygnb', 
      form.current, 
      'oISKdHxQTlz06KQWx'
    )
      .then((result) => {
        console.log('Email sent successfully:', result.text);
        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      })
      .catch((error) => {
        console.error('Failed to send email:', error);
        setIsSubmitting(false);
        setError('Failed to send message. Please try again later.');
      });
  };

  return (
    <div className={`py-20 px-4 sm:px-6 lg:px-8 National-Park ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 Rowdies ${darkMode ? 'text-white' : 'text-gray-900'}`}>Get In Touch</h2>
          <p className={`text-lg max-w-2xl mx-auto Open-Sans ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Have a project in mind or want to chat? Feel free to reach out!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className={`p-8 rounded-xl ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-700' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
            <h3 className={`text-2xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Contact Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-blue-600 p-3 rounded-lg text-white mr-4">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className={`text-lg font-medium Roboto-Slab ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Email</h4>
                  <a href="mailto:emmanuelablao16@gmail.com" className={`hover:text-blue-500 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'} Open-Sans`}>
                    emmanuelablao16@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-600 p-3 rounded-lg text-white mr-4">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className={`text-lg font-medium Roboto-Slab ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Phone</h4>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    <span className="block Open-Sans">
                      <strong>Globe:</strong> <a href="tel:+639955116005" className="hover:text-blue-500 transition-colors">+63 9955116005</a>
                    </span>
                    <span className="block mt-2 Open-Sans">
                      <strong>Smart:</strong> <a href="tel:+639519044954" className="hover:text-blue-500 transition-colors">+63 9519044954</a>
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-600 p-3 rounded-lg text-white mr-4">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className={`text-lg font-medium Roboto-Slab ${darkMode ? 'text-gray-200' : 'text-gray-900'} Open-Sans`}>Location</h4>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    Pililla Rizal, Philippines
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-12">
              <h4 className={`text-lg font-medium mb-4 Roboto-Slab ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Follow Me</h4>
              <div className="flex space-x-4">
                {/* Social Media Icons */}
                <a href="https://www.facebook.com/emman.ablao" className={`p-3 rounded-full transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 text-blue-400 hover:bg-blue-600 hover:text-white' 
                    : 'bg-white text-blue-600 hover:bg-blue-600 hover:text-white'
                }`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="https://github.com/Lazytech15/" className={`p-3 rounded-full transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 text-blue-400 hover:bg-blue-600 hover:text-white' 
                    : 'bg-white text-blue-600 hover:bg-blue-600 hover:text-white'
                }`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className={`p-8 rounded-xl ${darkMode ? 'bg-gray-800 shadow-lg' : 'bg-white shadow-lg'}`}>
            <h3 className={`text-2xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Send Me a Message</h3>
            
            {isSubmitted ? (
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-900 border border-green-700 text-green-300' : 'bg-green-50 border border-green-200 text-green-700'}`}>
                <p className="font-medium">Thank you for your message!</p>
                <p>I'll get back to you as soon as possible.</p>
              </div>
            ) : (
              <form ref={form} onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="user_name" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="user_name"
                    name="user_name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                        : 'border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="Jose Dela Cruz"
                  />
                </div>
                
                <div>
                  <label htmlFor="user_email" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="user_email"
                    name="user_email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                        : 'border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="josecruz@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className={`w-full px-4 py-3 rounded-lg transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                        : 'border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="Hello! I'd like to talk about a project..."
                  ></textarea>
                </div>
                
                {error && (
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-red-900 border border-red-700 text-red-300' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                    {error}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                >
                  {isSubmitting ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;