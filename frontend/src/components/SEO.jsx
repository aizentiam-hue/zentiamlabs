import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = "Zentiam - AI Solutions That Transform Your Business",
  description = "Transform your business with AI solutions that deliver 3.7x ROI, 40% productivity gains, and measurable results in weeks. AI consulting, custom solutions, and automation.",
  keywords = "AI consulting, artificial intelligence, business automation, AI solutions, machine learning, digital transformation, AI strategy",
  author = "Zentiam",
  ogImage = "/og-image.jpg",
  ogType = "website",
  twitterCard = "summary_large_image",
  canonical,
  structuredData
}) => {
  const siteUrl = process.env.REACT_APP_SITE_URL || window.location.origin;
  const currentUrl = canonical || window.location.href;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:site_name" content="Zentiam" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
