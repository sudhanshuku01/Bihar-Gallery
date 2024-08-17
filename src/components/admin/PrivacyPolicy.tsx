import React from "react";
import Layout from "../../layout/Layout";
const PrivacyPolicy: React.FC = () => {
  return (
    <Layout>
      <div className="privacy-policy">
        <header className="privacy-policy-header">
          <h1>Privacy Policy</h1>
        </header>
        <section className="privacy-policy-content">
          <p>
            Welcome to Bihar Gallery. We respect your privacy and are committed
            to protecting your personal data. This privacy policy will inform
            you about how we look after your personal data when you visit our
            website and tell you about your privacy rights and how the law
            protects you.
          </p>
          <h2>1. Important Information</h2>
          <p>
            This privacy policy aims to give you information on how Bihar
            Gallery collects and processes your personal data through your use
            of this website.
          </p>
          <h2>2. The Data We Collect About You</h2>
          <p>
            We may collect, use, store, and transfer different kinds of personal
            data about you which we have grouped together as follows:
          </p>
          <ul>
            <li>
              Identity Data: includes first name, last name, username or similar
              identifier.
            </li>
            <li>Contact Data: includes email address and telephone numbers.</li>
            <li>
              Technical Data: includes internet protocol (IP) address, browser
              type and version, time zone setting and location,
            </li>
            <li>
              Technical Data: includes internet protocol (IP) address, browser
              type and version, time zone setting and location, browser plug-in
              types and versions, operating system and platform, and other
              technology on the devices you use to access this website.
            </li>
            <li>
              Usage Data: includes information about how you use our website,
              products, and services.
            </li>
            <li>
              Marketing and Communications Data: includes your preferences in
              receiving marketing from us and your communication preferences.
            </li>
          </ul>

          <h2>3. How We Use Your Personal Data</h2>
          <p>
            We will only use your personal data when the law allows us to. Most
            commonly, we will use your personal data in the following
            circumstances:
          </p>
          <ul>
            <li>To provide and improve our services to you.</li>
            <li>
              To communicate with you, including sending you newsletters,
              marketing materials, and updates about Bihar Gallery.
            </li>
            <li>
              To analyze the use of our website and improve its content and
              functionality.
            </li>
            <li>
              To comply with legal obligations or regulatory requirements.
            </li>
          </ul>

          <h2>4. Disclosure of Your Personal Data</h2>
          <p>
            We may share your personal data with third parties who provide
            services to us, such as hosting providers, analytics providers, and
            advertising partners. We require all third parties to respect the
            security of your personal data and to treat it in accordance with
            the law.
          </p>

          <h2>5. Data Security</h2>
          <p>
            We have put in place appropriate security measures to prevent your
            personal data from being accidentally lost, used, or accessed in an
            unauthorized way. We limit access to your personal data to those
            employees, agents, contractors, and other third parties who have a
            legitimate need to know.
          </p>

          <h2>6. Your Legal Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding
            your personal data, including rights to access, correct, delete, or
            restrict the processing of your personal data. If you wish to
            exercise any of these rights, please contact us using the details
            provided below.
          </p>

          <h2>7. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our privacy
            practices, please contact us at:
          </p>
          <p className="contact-details">
            Email: support@bihargallery.com
            <br />
            Phone: +91-7903277008
            <br />
            Address:Lakhisarai Bihar, India
          </p>
        </section>
        <footer className="privacy-policy-footer">
          <p>&copy; 2024 Bihar Gallery. All rights reserved.</p>
        </footer>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
