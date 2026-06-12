import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        <title>Hotel y Cabañas Brisas de Oro | Villa Carlos Paz, Córdoba</title>
        {/* ===== SEO BÁSICO ===== */}
        <meta name="description" content="Complejo familiar en Villa Carlos Paz, Córdoba. Cabañas y habitaciones de hotel con pileta, desayuno buffet casero y atención personalizada de sus dueños. A pasos del río San Antonio y las Sierras de Córdoba." />
        <meta name="keywords" content="hotel Villa Carlos Paz, cabañas Villa Carlos Paz, Brisas de Oro, hotel cabañas Brisas de Oro, complejo familiar Villa Carlos Paz, cabañas con pileta Carlos Paz, alojamiento Villa Carlos Paz, cabañas sierras de Córdoba, hotel familiar Córdoba, cabañas Córdoba Argentina, alquiler cabañas Carlos Paz, hospedaje Villa Carlos Paz, apart hotel Carlos Paz, cabañas con desayuno Carlos Paz, turismo Villa Carlos Paz, vacaciones sierras Córdoba, cabañas río San Antonio, Playas de Oro Carlos Paz, complejo turístico Córdoba, brisas de oro Carlos Paz, cabañas atendidas por sus dueños Villa Carlos Paz, alojamiento familiar con pileta sierras Córdoba, cabañas con asador y pileta Carlos Paz, hotel boutique Villa Carlos Paz, alquiler temporario Villa Carlos Paz, complejo de cabañas y habitaciones Carlos Paz, cabañas para familias sierras de Córdoba, hospedaje con desayuno buffet Carlos Paz, cabañas económicas Villa Carlos Paz, alojamiento cerca del río San Antonio Carlos Paz" />
        <meta name="author" content="Hotel y Cabañas Brisas de Oro" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="Spanish" />
        <meta name="geo.region" content="AR-X" />
        <meta name="geo.placename" content="Villa Carlos Paz, Córdoba, Argentina" />
        <meta name="geo.position" content="-31.4285;-64.4872" />
        <meta name="ICBM" content="-31.4285, -64.4872" />
        <link rel="canonical" href="https://www.brisasdeoro.com.ar/" />
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNiIgZmlsbD0iIzIwMUUxQiIvPjx0ZXh0IHg9IjE2IiB5PSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9Ikdlb3JnaWEsc2VyaWYiIGZvbnQtc2l6ZT0iMjIiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiNDOEEwMjgiPkI8L3RleHQ+PC9zdmc+" />
        <link rel="shortcut icon" href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNiIgZmlsbD0iIzIwMUUxQiIvPjx0ZXh0IHg9IjE2IiB5PSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9Ikdlb3JnaWEsc2VyaWYiIGZvbnQtc2l6ZT0iMjIiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiNDOEEwMjgiPkI8L3RleHQ+PC9zdmc+" />
        <link rel="apple-touch-icon" href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNiIgZmlsbD0iIzIwMUUxQiIvPjx0ZXh0IHg9IjE2IiB5PSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9Ikdlb3JnaWEsc2VyaWYiIGZvbnQtc2l6ZT0iMjIiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiNDOEEwMjgiPkI8L3RleHQ+PC9zdmc+" />
        <meta name="theme-color" content="#201E1B" />
        <meta name="msapplication-TileColor" content="#201E1B" />
        <link rel="alternate" hrefLang="es" href="https://www.brisasdeoro.com.ar/" />
        <link rel="alternate" hrefLang="en" href="https://www.brisasdeoro.com.ar/?lang=en" />
        <link rel="alternate" hrefLang="pt" href="https://www.brisasdeoro.com.ar/?lang=pt" />
        <link rel="alternate" hrefLang="x-default" href="https://www.brisasdeoro.com.ar/" />

        {/* ===== OPEN GRAPH (WhatsApp, Facebook, etc.) ===== */}
        <meta property="og:type" content="business.business" />
        <meta property="og:title" content="Hotel y Cabañas Brisas de Oro | Villa Carlos Paz" />
        <meta property="og:description" content="Complejo familiar atendido por sus dueños. Cabañas y habitaciones con pileta, desayuno buffet casero y ambiente hogareño en las Sierras de Córdoba." />
        <meta property="og:image" content="https://img.alqastatic.com/_propiedades_/aw75/o_aw75_Cabana_8YKDOJVE.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content="https://www.brisasdeoro.com.ar/" />
        <meta property="og:locale" content="es_AR" />
        <meta property="og:site_name" content="Brisas de Oro Hotel y Cabañas" />
        <meta property="business:contact_data:street_address" content="Av. Ramón J. Cárcano 2590" />
        <meta property="business:contact_data:locality" content="Villa Carlos Paz" />
        <meta property="business:contact_data:region" content="Córdoba" />
        <meta property="business:contact_data:country_name" content="Argentina" />
        <meta property="business:contact_data:phone_number" content="+54 9 3541 548053" />

        {/* ===== TWITTER / X CARD ===== */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Hotel y Cabañas Brisas de Oro | Villa Carlos Paz" />
        <meta name="twitter:description" content="Complejo familiar con pileta, desayuno buffet casero y atención personalizada. En las Sierras de Córdoba." />
        <meta name="twitter:image" content="https://img.alqastatic.com/_propiedades_/aw75/o_aw75_Cabana_8YKDOJVE.jpg" />

        {/* ===== SCHEMA.ORG — Hotel + LocalBusiness (Google lo usa para posicionar) ===== */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["Hotel", "LodgingBusiness"],
              "name": "Hotel y Cabañas Brisas de Oro",
              "alternateName": ["Brisas de Oro", "Complejo Brisas de Oro", "Brisas de Oro Carlos Paz"],
              "description": "Complejo familiar en Villa Carlos Paz atendido por sus dueños. 8 cabañas y 8 habitaciones disponibles — incluyendo 2 apart hotel. Pileta compartida, desayuno buffet casero, parque, asadores privados y WiFi. A pasos del Río San Antonio y las Sierras de Córdoba.",
              "url": "https://www.brisasdeoro.com.ar/",
              "telephone": "+54 9 3541 548053",
              "email": "brisasdeoro@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Av. Ramón J. Cárcano 2590",
                "addressLocality": "Villa Carlos Paz",
                "addressRegion": "Córdoba",
                "addressCountry": "AR",
                "postalCode": "X5152"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": -31.4285,
                "longitude": -64.4872
              },
              "image": [
                "https://img.alqastatic.com/_propiedades_/aw75/o_aw75_Cabana_8YKDOJVE.jpg",
                "https://img.alqastatic.com/_propiedades_/aw75/o_aw75_Cabana_DDWSIFEL.jpg"
              ],
              "priceRange": "$$",
              "currenciesAccepted": "ARS",
              "paymentAccepted": "Cash, Credit Card, Bank Transfer",
              "amenityFeature": [
                {"@type": "LocationFeatureSpecification", "name": "Pileta", "value": true},
                {"@type": "LocationFeatureSpecification", "name": "Desayuno buffet", "value": true},
                {"@type": "LocationFeatureSpecification", "name": "WiFi gratuito", "value": true},
                {"@type": "LocationFeatureSpecification", "name": "Estacionamiento gratuito", "value": true},
                {"@type": "LocationFeatureSpecification", "name": "Aire acondicionado", "value": true},
                {"@type": "LocationFeatureSpecification", "name": "Mascotas permitidas", "value": true},
                {"@type": "LocationFeatureSpecification", "name": "Asador", "value": true},
                {"@type": "LocationFeatureSpecification", "name": "Parque", "value": true}
              ],
              "checkinTime": "13:00",
              "checkoutTime": "10:00",
              "petsAllowed": "Restricted to cabins",
              "numberOfRooms": 16,
              "numberOfRoomsNote": "8 cabañas y 8 habitaciones disponibles para huéspedes, incluyendo 2 apart hotel",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5.0",
                "reviewCount": "10",
                "bestRating": "5"
              },
              "sameAs": [
                "https://www.welcomeargentina.com/villacarlospaz/cabanas-brisas-de-oro.html",
                "https://www.alquilerargentina.com/alojamientos/aw75-Caba%C3%B1a-Hotel-y-Caba%C3%B1as-Brisas-de-Oro-Villa-Carlos-Paz.html",
                "https://www.tripadvisor.com.ar/Hotel_Review-g312774-d5777680-Reviews-Brisas_de_Oro_Hotel_y_Cabanas-Villa_Carlos_Paz_Province_of_Cordoba_Central_Argentina.html"
              ],
              "hasMap": "https://maps.google.com/?q=Av.+Ramón+J.+Cárcano+2590,+Villa+Carlos+Paz",
              "tourBookingPage": "https://wa.me/543541548053"
            })
          }}
        />

        {/* ===== GOOGLE FONTS ===== */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Nunito:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
