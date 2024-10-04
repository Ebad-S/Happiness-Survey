import React, { useState } from 'react';
import '../styles/Contact.css';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to a server
    console.log('Form submitted:', { name, email, message });
    // Reset form fields
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="Contact">
      <h1>Get in Touch</h1>
      <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Your email address"
          />
        </div>
        <div>
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            placeholder="Your message"
          ></textarea>
        </div>
        <button type="submit">Send Message</button>
      </form>
      <div className="contact-info">
        <h2>Our Office</h2>
        <p>123 Happiness Street, Joyful City, 12345</p>
        <p>Phone: (123) 456-7890</p>
        <p>Email: info@worldhappiness.com</p>
      </div>
    </div>
  );
}

export default Contact;
