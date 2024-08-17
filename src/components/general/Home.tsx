import Layout from "../../layout/Layout";
// import Introduction from "../home/Introduction";

import Hero from "../home/Hero";
import WelcomePage from "../home/WelcomePage";
const Home = () => {
  console.log(import.meta.env.VITE_API_BASE_URL);

  return (
    <Layout>
      <div className="home">
        <Hero />
        <WelcomePage />
      </div>
    </Layout>
  );
};

export default Home;
