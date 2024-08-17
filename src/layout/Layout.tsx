import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Helmet } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import TopLoadingBar from "react-top-loading-bar";
import { useProgress } from "../context/ProgressContext";

interface LayoutProps {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  type?: string;
  url?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  description,
  keywords,
  author,
  type,
  url,
}) => {
  return (
    <div>
      <Helmet>
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={url} />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content={type} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:site_name" content="sudhanshukushwaha" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@sudhanshukushwaha" />
        <meta name="twitter:creator" content={author} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            url: url,
            name: title,
            author: {
              "@type": "Person",
              name: author,
            },
            description: description,
          })}
        </script>
      </Helmet>
      <Header />
      <main>
        <Toaster position="top-right" reverseOrder={false} />
        <TopLoadingBarComponent />
        {children}
      </main>
      <Footer />
    </div>
  );
};

Layout.defaultProps = {
  title: "Bihar Gallery - Explore the Rich History and Culture of Bihar",
  description:
    "Discover the rich history, culture, and beautiful tour places of Bihar through an extensive image gallery and informative blog posts.",
  keywords:
    "Bihar, history, culture, image gallery, tour places, Bihar blog, Bihar history, Bihar tourism",
  author: "Bihar Gallery",
  type: "website",
  url: "https://www.bihargallery.com",
};

const TopLoadingBarComponent: React.FC = () => {
  const { progress, setProgress } = useProgress();
  return (
    <TopLoadingBar
      color="blue"
      height={3}
      progress={progress}
      onLoaderFinished={() => setProgress(0)}
    />
  );
};

export default Layout;
