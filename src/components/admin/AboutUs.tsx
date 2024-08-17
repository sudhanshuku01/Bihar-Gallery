import React from "react";
import Layout from "../../layout/Layout";

const AboutUs: React.FC = () => {
  return (
    <Layout>
      <div className="about-us">
        <header className="about-us-header">
          <h1>About Bihar Gallery</h1>
        </header>
        <section className="about-us-content">
          <p>
            Welcome to <strong>Bihar Gallery</strong> – your one-stop
            destination to explore the rich cultural heritage, history, and
            beauty of Bihar. Our mission is to provide an insightful, engaging,
            and comprehensive platform that showcases the essence of Bihar.
          </p>
          <p>
            Bihar is a land of ancient civilizations, profound spirituality, and
            diverse traditions. From the sacred city of Bodh Gaya, where Lord
            Buddha attained enlightenment, to the historic ruins of Nalanda
            University, Bihar is a treasure trove of historical and cultural
            marvels.
          </p>
          <p>
            At Bihar Gallery, we are passionate about highlighting the vibrant
            arts, festivals, and cuisines that make Bihar unique. Our gallery
            features stunning photographs, in-depth articles, and personal
            stories that bring the state's rich heritage to life.
          </p>
          <p>
            Our team of dedicated writers, photographers, and historians work
            tirelessly to ensure that every piece of content is accurate,
            informative, and inspiring. We aim to be a trusted resource for both
            locals and visitors who wish to learn more about this incredible
            state.
          </p>
          <p>
            Thank you for visiting Bihar Gallery. We hope our website inspires
            you to explore Bihar and appreciate its beauty and cultural
            significance. If you have any questions, suggestions, or
            contributions, please feel free to <a href="/contactus">contact us</a>
            .
          </p>
        </section>
        <footer className="about-us-footer">
          <p>&copy; 2024 Bihar Gallery. All rights reserved.</p>
        </footer>
      </div>
    </Layout>
  );
};

export default AboutUs;
