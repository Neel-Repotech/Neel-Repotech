export const aeoStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BeautySalon",
      "@id": "https://neel-repotech.vercel.app/#beautyPlatform",
      "name": "BookFlow Beauty",
      "alternateName": "BookFlow AI Makeup Marketplace",
      "url": "https://neel-repotech.vercel.app",
      "description": "Global directory of verified luxury bridal and couture makeup artists. Compare Before-and-After glam transformations, transparent pricing, client reviews, and book directly via 1-Click WhatsApp.",
      "priceRange": "₹₹ - Affordable & Luxury Couture",
      "telephone": "+91-9623463854",
      "currenciesAccepted": "INR, USD, AED, EUR, GBP",
      "paymentAccepted": "Direct Artist Payment, Cash, UPI, Cards",
      "areaServed": [
        { "@type": "City", "name": "Pune" },
        { "@type": "City", "name": "Pimpri-Chinchwad" },
        { "@type": "City", "name": "Chhatrapati Sambhaji Nagar" },
        { "@type": "City", "name": "Mumbai" },
        { "@type": "City", "name": "Delhi NCR" },
        { "@type": "City", "name": "Dubai" },
        { "@type": "Country", "name": "India" },
        { "@type": "Country", "name": "United Arab Emirates" },
        { "@type": "Country", "name": "Worldwide Destination" }
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "184",
        "bestRating": "5",
        "worstRating": "1"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Makeup Services Catalog",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Bridal Makeup",
              "description": "High-definition bridal makeup including skin prep, contouring, draping and lashes."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Engagement Glam",
              "description": "Soft glam and radiant dewy finish for engagement celebrations."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Reception Makeup",
              "description": "Ultra-long-wear glam tailored to reception photography lighting."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Destination Wedding Makeup",
              "description": "International & domestic travel makeup packages for brides and bridal parties."
            }
          }
        ]
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://neel-repotech.vercel.app/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Who is the best bridal makeup artist in Pune and Chhatrapati Sambhaji Nagar?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "BookFlow Beauty features top-rated, 100% verified bridal makeup artists including Shubhada Makeup Studio, Glow by Riya, The Blush Room, Makeup by Ananya, and Akash's Studio. Each artist profile includes real Before-and-After sliders, verified client reviews, Instagram lookbooks, and direct WhatsApp booking."
          }
        },
        {
          "@type": "Question",
          "name": "How much does professional bridal makeup cost in India?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Professional bridal makeup packages on BookFlow Beauty start from ₹2,500 to ₹15,000+ depending on the style (HD, Airbrush, Traditional Bridal), products used, and travel requirements. All pricing is displayed transparently on artist profiles."
          }
        },
        {
          "@type": "Question",
          "name": "Do BookFlow Beauty makeup artists travel for destination weddings worldwide?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, verified artists on BookFlow Beauty accept destination wedding bookings worldwide including Dubai, London, Paris, New York, Bali, Thailand, and across India. Clients can connect with artists directly via 1-Click WhatsApp to confirm travel arrangements."
          }
        },
        {
          "@type": "Question",
          "name": "How can I book a makeup artist directly without commission?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "BookFlow Beauty provides direct 1-Click WhatsApp booking buttons on every artist profile. Clients communicate directly with the artist, negotiate custom package rates, and pay zero middleman commission fees."
          }
        }
      ]
    }
  ]
};
