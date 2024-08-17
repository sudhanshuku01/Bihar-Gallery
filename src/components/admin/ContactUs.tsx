import React from "react";
import Layout from "../../layout/Layout";

const ContactUs: React.FC = () => {
  return (
    <Layout>
      <div className="contact-us">
        <header className="contact-us-header">
          <h1>Contact Us</h1>
        </header>
        <section className="contact-us-content">
          <p>
            We'd love to hear from you! Whether you have questions, feedback, or
            simply want to share your thoughts, feel free to get in touch with
            us.
          </p>
          <form className="contact-us-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your Name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your Email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Your Message"
                required
              ></textarea>
            </div>
            <button type="submit">Send Message</button>
          </form>
          <p className="contact-us-details">
            <strong>Email:</strong> contact@bihargallery.com
            <br />
            <strong>Phone:</strong> +91-7903277008
            <br />
            <strong>Address:</strong>Lakhisarai, Bihar, India
          </p>
        </section>
        <footer className="contact-us-footer">
          <p>&copy; 2024 Bihar Gallery. All rights reserved.</p>
        </footer>
      </div>
    </Layout>
  );
};

export default ContactUs;
