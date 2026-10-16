export type SupportedLanguage = 'en' | 'hi' | 'mr' | 'ar' | 'fr' | 'es' | 'it' | 'de';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  dir?: 'ltr' | 'rtl';
}

export const supportedLanguages: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇦🇪', dir: 'rtl' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr' }
];

export interface TranslationDictionary {
  topAnnouncement: string;
  navFindArtists: string;
  navHowItWorks: string;
  navForArtists: string;
  navSignIn: string;
  navListBusiness: string;
  heroEyebrow: string;
  heroTitle1: string;
  heroTitleEm: string;
  heroSubtitle: string;
  searchLocationLabel: string;
  searchLocationPlaceholder: string;
  searchServiceLabel: string;
  searchBtn: string;
  allServices: string;
  trustVerified: string;
  trustDestination: string;
  trustLookbook: string;
  trustWhatsApp: string;
  sectionEyebrow: string;
  sectionTitle1: string;
  sectionTitleEm: string;
  sectionSubtitle: string;
  sortBy: string;
  sortRecommended: string;
  sortPriceLow: string;
  sortRatingHigh: string;
  sortDistance: string;
  startingFrom: string;
  verifiedPro: string;
  viewLooks: string;
  enquireBtn: string;
  howTitle1: string;
  howTitleEm: string;
  howSubtitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  ctaEyebrow: string;
  ctaTitle1: string;
  ctaTitleEm: string;
  ctaDesc: string;
  ctaBtn: string;
  destinationNotice: string;
  resetWorldwide: string;
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    topAnnouncement: '✨ Find your artist. Feel your best. Certified Bridal & Couture Experts.',
    navFindArtists: 'Find artists',
    navHowItWorks: 'How it works',
    navForArtists: 'For artists',
    navSignIn: 'Sign in',
    navListBusiness: 'List your business',
    heroEyebrow: 'LUXURY BRIDAL & BEAUTY DIRECTORY',
    heroTitle1: 'Your moment.',
    heroTitleEm: 'Your artist.',
    heroSubtitle: 'Discover verified couture makeup artists worldwide for weddings, destination celebrations, and all the high-glam moments that matter.',
    searchLocationLabel: 'YOUR LOCATION (WORLDWIDE)',
    searchLocationPlaceholder: 'Type country or city (e.g. India, Dubai, London...)',
    searchServiceLabel: 'SERVICE CATEGORY',
    searchBtn: 'Find Artists',
    allServices: 'All services',
    trustVerified: '100% Verified Artist Profiles',
    trustDestination: 'Local & Worldwide Destination Bookings',
    trustLookbook: 'Portfolio & Before-After Discovery',
    trustWhatsApp: 'Direct WhatsApp & Instant Connection',
    sectionEyebrow: 'GLOBAL BEAUTY DIRECTORY',
    sectionTitle1: 'Artists worth',
    sectionTitleEm: 'glowing for.',
    sectionSubtitle: 'Explore curated makeup artists and find a couture look that feels unmistakably like you.',
    sortBy: 'Sort by',
    sortRecommended: 'Recommended & Top Rated',
    sortPriceLow: 'Price: Low to High',
    sortRatingHigh: 'Highest Client Rating',
    sortDistance: 'Nearest Distance',
    startingFrom: 'STARTING FROM',
    verifiedPro: 'VERIFIED PRO',
    viewLooks: 'View Looks',
    enquireBtn: 'Enquire',
    howTitle1: 'From “I need a look” to',
    howTitleEm: '“I found my artist.”',
    howSubtitle: 'Three simple, transparent steps to discover and secure your makeup artist anywhere in the world.',
    step1Title: 'Explore Local & Global Talent',
    step1Desc: 'Compare real portfolios, Before-and-After glam sliders, client reviews, Instagram lookbooks and starting prices.',
    step2Title: 'Share Event Details',
    step2Desc: 'Pick your event date, locality, and preferred aesthetic. Reach the artist directly on WhatsApp or submit an enquiry.',
    step3Title: 'Connect & Glow',
    step3Desc: 'Confirm availability, finalize pricing directly with your chosen artist, and look unforgettable on your big day.',
    ctaEyebrow: 'FOR PROFESSIONAL MAKEUP ARTISTS',
    ctaTitle1: 'Your artistry deserves',
    ctaTitleEm: 'to be celebrated worldwide.',
    ctaDesc: 'Join BookFlow Beauty to showcase your lookbook, Before-and-After transformations, Instagram feed, and receive direct enquiries from brides worldwide.',
    ctaBtn: 'List Your Business',
    destinationNotice: 'Showing verified artists available for Worldwide Destination Weddings & Travel Bookings ✈️',
    resetWorldwide: 'Reset to All Worldwide'
  },
  mr: {
    topAnnouncement: '✨ तुमच्या खास दिवसासाठी सर्वोत्तम मेकअप आर्टिस्ट शोधा. प्रमाणित ब्राइडल तज्ज्ञ.',
    navFindArtists: 'आर्टिस्ट शोधा',
    navHowItWorks: 'कसे कार्य करते',
    navForArtists: 'आर्टिस्टसाठी',
    navSignIn: 'लॉगिन करा',
    navListBusiness: 'व्यवसाय नोंदणी करा',
    heroEyebrow: 'लक्झरी ब्राइडल आणि ब्युटी डिरेक्टरी',
    heroTitle1: 'तुमचा खास क्षण.',
    heroTitleEm: 'तुमची हक्काची आर्टिस्ट.',
    heroSubtitle: 'लग्न, साखरपुडा आणि सर्व सणांसाठी तुमच्या परिसरातील आणि जगभरातील सर्वोत्तम प्रमाणित मेकअप आर्टिस्ट शोधा.',
    searchLocationLabel: 'तुमचे ठिकाण (स्थान किंवा देश)',
    searchLocationPlaceholder: 'ठिकाण किंवा शहर शोधा (उदा. पुणे, संभाजीनगर, मुंबई, दुबई...)',
    searchServiceLabel: 'सेवेचा प्रकार',
    searchBtn: 'आर्टिस्ट शोधा',
    allServices: 'सर्व सेवा',
    trustVerified: '१००% पडताळणी केलेले प्रोफाइल',
    trustDestination: 'स्थानिक आणि डेस्टिनेशन बुकिंग',
    trustLookbook: 'रिअल पोर्टफोलिओ आणि बिफोर-आफ्टर लूक',
    trustWhatsApp: 'थेट व्हॉट्सॲपवर संपर्क आणि बुकिंग',
    sectionEyebrow: 'निवडक मेकअप आर्टिस्ट',
    sectionTitle1: 'सौंदर्याला साजेशी',
    sectionTitleEm: 'उत्कृष्ट कला.',
    sectionSubtitle: 'तुमच्या व्यक्तिमत्त्वाला खुलवणारा सुंदर आणि मोहक ब्राइडल लूक मिळवा.',
    sortBy: 'क्रमवारी',
    sortRecommended: 'शिफारस केलेले आणि टॉप रेटेड',
    sortPriceLow: 'किंमत: कमी ते जास्त',
    sortRatingHigh: 'सर्वोच्च रेटिंग',
    sortDistance: 'जवळचे ठिकाण',
    startingFrom: 'किमान दर',
    verifiedPro: 'प्रमाणित आर्टिस्ट',
    viewLooks: 'लूक पहा',
    enquireBtn: 'चौकशी करा',
    howTitle1: '“मला लूक हवाय” पासून ते',
    howTitleEm: '“मला आर्टिस्ट मिळाली!” पर्यंत.',
    howSubtitle: 'तीन सोप्या पायऱ्यांमध्ये तुमच्या आवडीची मेकअप आर्टिस्ट बुक करा.',
    step1Title: 'आर्टिस्ट पोर्टफोलिओ पहा',
    step1Desc: 'खरे फोटो, बिफोर-आफ्टर स्लाइडर, इन्स्टाग्राम काम आणि क्लायंटचे रिव्ह्यू तपासा.',
    step2Title: 'तपशील पाठवा',
    step2Desc: 'कार्यक्रमाची तारीख, ठिकाण आणि बजेट कळवा किंवा थेट व्हॉट्सॲपवर बोला.',
    step3Title: 'निश्चिंत राहा आणि चमका',
    step3Desc: 'तारीख बुक करा आणि तुमच्या खास दिवशी दिसा अत्यंत सुंदर आणि देखणी.',
    ctaEyebrow: 'व्यावसायिक मेकअप आर्टिस्टसाठी',
    ctaTitle1: 'तुमच्या कलेला मिळायला हवी',
    ctaTitleEm: 'हक्काची ओळख आणि ग्राहक.',
    ctaDesc: 'बुकफ्लो ब्युटीवर आपले प्रोफाइल तयार करा, फोटो शेअर करा आणि थेट ग्राहकांचे बुकिंग मिळवा.',
    ctaBtn: 'आताच नोंदणी करा',
    destinationNotice: 'डेस्टिनेशन वेडिंग आणि प्रवासासाठी उपलब्ध असलेल्या प्रमाणित आर्टिस्ट दाखवत आहोत ✈️',
    resetWorldwide: 'सर्व आर्टिस्ट पहा'
  },
  hi: {
    topAnnouncement: '✨ अपने खास दिन के लिए सर्वश्रेष्ठ मेकअप आर्टिस्ट खोजें। प्रमाणित ब्राइडल विशेषज्ञ।',
    navFindArtists: 'आर्टिस्ट खोजें',
    navHowItWorks: 'यह कैसे काम करता है',
    navForArtists: 'मेकअप आर्टिस्ट के लिए',
    navSignIn: 'साइन इन',
    navListBusiness: 'व्यवसाय लिस्ट करें',
    heroEyebrow: 'लग्जरी ब्राइडल एवं ब्यूटी डायरेक्टरी',
    heroTitle1: 'आपका खास पल।',
    heroTitleEm: 'आपकी पसंदीदा आर्टिस्ट।',
    heroSubtitle: 'शादियों, सगाई और खास अवसरों के लिए प्रमाणित मेकअप आर्टिस्ट खोजें और सीधे व्हाट्सएप पर बुक करें।',
    searchLocationLabel: 'आपका स्थान (शहर या देश)',
    searchLocationPlaceholder: 'शहर या देश टाइप करें (उदा. पुणे, दिल्ली, मुंबई, दुबई...)',
    searchServiceLabel: 'सेवा श्रेणी',
    searchBtn: 'आर्टिस्ट खोजें',
    allServices: 'सभी सेवाएं',
    trustVerified: '100% सत्यापित आर्टिस्ट प्रोफाइल',
    trustDestination: 'लोकल एवं डेस्टिनेशन वेडिंग बुकिंग',
    trustLookbook: 'बिफोर-आफ्टर ग्लैमर स्लाइडर एवं पोर्टफोलियो',
    trustWhatsApp: 'सीधे व्हाट्सएप पर त्वरित बुकिंग',
    sectionEyebrow: 'सर्वश्रेष्ठ मेकअप डायरेक्टरी',
    sectionTitle1: 'कला जो आपको दे',
    sectionTitleEm: 'एक अनोखा निखार।',
    sectionSubtitle: 'अपनी पसंद और स्किन टोन के अनुसार सर्वश्रेष्ठ ब्राइडल और पार्टी लूक चुनें।',
    sortBy: 'क्रमबद्ध करें',
    sortRecommended: 'अनुशंसित एवं टॉप रेटेड',
    sortPriceLow: 'कीमत: कम से ज्यादा',
    sortRatingHigh: 'सर्वश्रेष्ठ रेटिंग',
    sortDistance: 'निकटतम दूरी',
    startingFrom: 'शुरुआती कीमत',
    verifiedPro: 'सत्यापित प्रो',
    viewLooks: 'लूक देखें',
    enquireBtn: 'पूछताछ करें',
    howTitle1: '“मुझे मेकअप चाहिए” से',
    howTitleEm: '“मुझे अपनी आर्टिस्ट मिल गई!”',
    howSubtitle: 'तीन आसान चरणों में अपने लिए परफेक्ट मेकअप आर्टिस्ट चुनें।',
    step1Title: 'पोर्टफोलियो एवं लूक देखें',
    step1Desc: 'असली क्लाइंट तस्वीरें, बिफोर-आफ्टर परिवर्तन और रेटिंग्स की तुलना करें।',
    step2Title: 'इवेंट की जानकारी दें',
    step2Desc: 'अपनी तारीख, स्थान और बजट शेयर करें अथवा सीधे व्हाट्सएप पर बात करें।',
    step3Title: 'कन्फर्म करें और चमकें',
    step3Desc: 'बुकिंग फाइनल करें और अपने खास अवसर पर सबसे खूबसूरत दिखें।',
    ctaEyebrow: 'मेकअप आर्टिस्ट्स के लिए',
    ctaTitle1: 'आपकी कला को मिले',
    ctaTitleEm: 'पूरे देश में नई पहचान।',
    ctaDesc: 'बुकफ्लो ब्यूटी पर अपनी प्रोफाइल बनाएं, पोर्टफोलियो शेयर करें और सीधे नए क्लाइंट्स पाएं।',
    ctaBtn: 'आज ही प्रोफाइल बनाएं',
    destinationNotice: 'डेस्टिनेशन वेडिंग्स और इंटरनेशनल ट्रैवल के लिए उपलब्ध सत्यापित आर्टिस्ट प्रदर्शित हैं ✈️',
    resetWorldwide: 'सभी आर्टिस्ट देखें'
  },
  ar: {
    topAnnouncement: '✨ اكتشفي خبيرات التجميل والمكياج الفاخر لجميع مناسباتك وحفلات الزفاف.',
    navFindArtists: 'البحث عن خبيرات',
    navHowItWorks: 'كيف يعمل',
    navForArtists: 'لخبيرات التجميل',
    navSignIn: 'تسجيل الدخول',
    navListBusiness: 'سجلي صالونك',
    heroEyebrow: 'دليل التجميل والمكياج الفاخر',
    heroTitle1: 'لحظتك المميزة.',
    heroTitleEm: 'خبيرة تجميلكِ المثالية.',
    heroSubtitle: 'اكتشفي أفضل خبيرات المكياج المعتمدات لحفلات الزفاف والمناسبات الخاصة حول العالم مع حجز مباشر عبر واتساب.',
    searchLocationLabel: 'موقعكِ (المدينة أو الدولة)',
    searchLocationPlaceholder: 'اكتبي المدينة أو الدولة (مثل دبي، الرياض، باريس...)',
    searchServiceLabel: 'نوع الخدمة',
    searchBtn: 'ابحثي الآن',
    allServices: 'جميع الخدمات',
    trustVerified: 'ملفات تعريف موثقة 100%',
    trustDestination: 'حجوزات محلية ولحفلات الزفاف الخارجية',
    trustLookbook: 'معرض إطلالات وصور قبل وبعد',
    trustWhatsApp: 'تواصل وحجز فوري عبر واتساب',
    sectionEyebrow: 'دليل الجمال العالمي',
    sectionTitle1: 'خبيرات يستحققن',
    sectionTitleEm: 'تألقكِ وإشراقتكِ.',
    sectionSubtitle: 'استكشفي نخبة من فنانات المكياج لإطلالة استثنائية تعكس جمالك الطبيعي.',
    sortBy: 'ترتيب حسب',
    sortRecommended: 'الأعلى تقييماً والموصى به',
    sortPriceLow: 'السعر: من الأقل للأعلى',
    sortRatingHigh: 'أعلى التقييمات',
    sortDistance: 'الأقرب مسافة',
    startingFrom: 'يبدأ من',
    verifiedPro: 'خبيرة معتمدة',
    viewLooks: 'عرض الإطلالات',
    enquireBtn: 'استفسار',
    howTitle1: 'من “أبحث عن إطلالة” إلى',
    howTitleEm: '“وجدتُ خبيرتي المفضلة.”',
    howSubtitle: 'ثلاث خطوات بسيطة لاكتشاف خبيرة التجميل وحجز موعدك.',
    step1Title: 'استكشفي الأعمال والإطلالات',
    step1Desc: 'قارني بين الصور الواقعية ومقارنات قبل وبعد التجميل وتقييمات العرائس.',
    step2Title: 'شاركي تفاصيل المناسبة',
    step2Desc: 'حددي تاريخ الحفل والموقع والميزانية وتواصلي مباشرة عبر واتساب.',
    step3Title: 'تأكدي وتألقي',
    step3Desc: 'أكدي الحجز واستعدي لتكوني الأجمل في ليلتك الكبرى.',
    ctaEyebrow: 'لخبيرات وصالونات التجميل',
    ctaTitle1: 'إبداعكِ يستحق',
    ctaTitleEm: 'أن يُعرف ويُحتفى به عالمياً.',
    ctaDesc: 'انضمي إلى BookFlow Beauty لعرض إطلالاتكِ واستقبال حجوزات مباشرة من العرائس.',
    ctaBtn: 'سجلي عملكِ الآن',
    destinationNotice: 'عرض خبيرات المكياج المتاحات للسفر وحفلات الزفاف العالمية ✈️',
    resetWorldwide: 'عرض جميع الخبيرات حول العالم'
  },
  fr: {
    topAnnouncement: '✨ Trouvez votre maquilleuse de rêve. Expertes beauté mariée et haute couture.',
    navFindArtists: 'Trouver une artiste',
    navHowItWorks: 'Comment ça marche',
    navForArtists: 'Pour les artistes',
    navSignIn: 'Connexion',
    navListBusiness: 'Inscrire mon salon',
    heroEyebrow: 'ANNUAIRE BEAUTÉ ET MARIAGE HAUT DE GAMME',
    heroTitle1: 'Votre grand moment.',
    heroTitleEm: 'Votre maquilleuse.',
    heroSubtitle: 'Découvrez les maquilleuses professionnelles certifiées pour mariages et cérémonies d’exception dans le monde entier.',
    searchLocationLabel: 'VOTRE VILLE OU PAYS',
    searchLocationPlaceholder: 'Rechercher une ville ou pays (ex. Paris, Nice, Dubai...)',
    searchServiceLabel: 'CATÉGORIE DE SERVICE',
    searchBtn: 'Rechercher',
    allServices: 'Tous les services',
    trustVerified: 'Profils 100% vérifiés et certifiés',
    trustDestination: 'Réservations locales et mariages à l’étranger',
    trustLookbook: 'Lookbook & Transformations Avant/Après',
    trustWhatsApp: 'Réservation directe WhatsApp instantanée',
    sectionEyebrow: 'ANNUAIRE MONDIAL',
    sectionTitle1: 'Des artistes d’exception pour',
    sectionTitleEm: 'rayonner le grand jour.',
    sectionSubtitle: 'Explorez les looks haute définition adaptés à votre carnation et votre style.',
    sortBy: 'Trier par',
    sortRecommended: 'Recommandé & Mieux noté',
    sortPriceLow: 'Prix : Croissant',
    sortRatingHigh: 'Meilleures évaluations',
    sortDistance: 'Distance la plus proche',
    startingFrom: 'À PARTIR DE',
    verifiedPro: 'PRO VÉRIFIÉE',
    viewLooks: 'Voir les looks',
    enquireBtn: 'Contacter',
    howTitle1: 'De l’inspiration à la',
    howTitleEm: 'maquilleuse idéale.',
    howSubtitle: 'Trois étapes simples pour réserver votre mise en beauté en toute sérénité.',
    step1Title: 'Découvrez les portfolios',
    step1Desc: 'Comparez les transformations avant/après, avis clientes et galeries Instagram.',
    step2Title: 'Partagez vos détails',
    step2Desc: 'Précisez votre date, lieu et budget, ou discutez directement sur WhatsApp.',
    step3Title: 'Confirmez et rayonnez',
    step3Desc: 'Validez vos disponibilités et soyez sublime pour votre événement.',
    ctaEyebrow: 'POUR LES MAKEUP ARTISTS',
    ctaTitle1: 'Votre talent mérite',
    ctaTitleEm: 'd’être reconnu partout.',
    ctaDesc: 'Rejoignez BookFlow Beauty pour valoriser votre portfolio et recevoir des demandes directes de futures mariées.',
    ctaBtn: 'Inscrire votre activité',
    destinationNotice: 'Maquilleuses disponibles pour mariages internationaux et déplacements ✈️',
    resetWorldwide: 'Voir le monde entier'
  },
  es: {
    topAnnouncement: '✨ Encuentra tu maquilladora ideal para bodas y eventos de alta costura.',
    navFindArtists: 'Buscar artistas',
    navHowItWorks: 'Cómo funciona',
    navForArtists: 'Para maquilladoras',
    navSignIn: 'Iniciar sesión',
    navListBusiness: 'Registrar estudio',
    heroEyebrow: 'DIRECTORIO DE BELLEZA Y NOVIAS DE LUJO',
    heroTitle1: 'Tu gran momento.',
    heroTitleEm: 'Tu maquilladora ideal.',
    heroSubtitle: 'Descubre maquilladoras profesionales verificadas para bodas y eventos en todo el mundo con reserva directa por WhatsApp.',
    searchLocationLabel: 'TU CIUDAD O PAÍS',
    searchLocationPlaceholder: 'Escribe tu ciudad o país (ej. Madrid, Barcelona, México...)',
    searchServiceLabel: 'CATEGORÍA DE SERVICIO',
    searchBtn: 'Buscar',
    allServices: 'Todos los servicios',
    trustVerified: 'Perfiles 100% verificados',
    trustDestination: 'Bodas locales e internacionales',
    trustLookbook: 'Lookbook y Comparador Antes y Después',
    trustWhatsApp: 'Conexión y reserva directa por WhatsApp',
    sectionEyebrow: 'DIRECTORIO GLOBAL DE BELLEZA',
    sectionTitle1: 'Artistas con las que vale la pena',
    sectionTitleEm: 'brillar al máximo.',
    sectionSubtitle: 'Encuentra el look nupcial personalizado que resalte tu belleza única.',
    sortBy: 'Ordenar por',
    sortRecommended: 'Recomendado y mejor valorado',
    sortPriceLow: 'Precio: Menor a mayor',
    sortRatingHigh: 'Mejor calificación',
    sortDistance: 'Más cercano',
    startingFrom: 'DESDE',
    verifiedPro: 'PRO VERIFICADA',
    viewLooks: 'Ver looks',
    enquireBtn: 'Consultar',
    howTitle1: 'De buscar inspiración a',
    howTitleEm: 'encontrar tu artista.',
    howSubtitle: 'Tres sencillos pasos para asegurar tu maquillaje con total confianza.',
    step1Title: 'Explora portafolios reales',
    step1Desc: 'Compara fotos reales, deslizador antes/después y opiniones de novias.',
    step2Title: 'Comparte tu fecha y lugar',
    step2Desc: 'Indica tu fecha y presupuesto o contacta directamente por WhatsApp.',
    step3Title: 'Confirma y luce radiante',
    step3Desc: 'Asegura tu fecha y prepárate para lucir inolvidable en tu gran día.',
    ctaEyebrow: 'PARA MAQUILLADORAS PROFESIONALES',
    ctaTitle1: 'Tu arte merece',
    ctaTitleEm: 'ser reconocido en todo el mundo.',
    ctaDesc: 'Únete a BookFlow Beauty para mostrar tu portafolio y recibir clientas directamente.',
    ctaBtn: 'Únete como artista',
    destinationNotice: 'Mostrando artistas disponibles para bodas de destino y viajes internacionales ✈️',
    resetWorldwide: 'Ver todas las ciudades'
  },
  it: {
    topAnnouncement: '✨ Trova la tua make-up artist ideale per il giorno del tuo matrimonio.',
    navFindArtists: 'Trova artiste',
    navHowItWorks: 'Come funziona',
    navForArtists: 'Per le professioniste',
    navSignIn: 'Accedi',
    navListBusiness: 'Iscrivi il tuo salone',
    heroEyebrow: 'DIRECTORY DI BELLEZZA E SPOSA DI LUSSO',
    heroTitle1: 'Il tuo momento.',
    heroTitleEm: 'La tua make-up artist.',
    heroSubtitle: 'Scopri le migliori professioniste del trucco sposa ed eventi speciali nel mondo, con contatto diretto su WhatsApp.',
    searchLocationLabel: 'LA TUA CITTÀ O NAZIONE',
    searchLocationPlaceholder: 'Cerca città o paese (es. Milano, Roma, Parigi...)',
    searchServiceLabel: 'TIPO DI SERVIZIO',
    searchBtn: 'Cerca artiste',
    allServices: 'Tutti i servizi',
    trustVerified: 'Profili verificati al 100%',
    trustDestination: 'Servizi locali e matrimoni internazionali',
    trustLookbook: 'Lookbook e cursore Prima/Dopo',
    trustWhatsApp: 'Contatto e prenotazione diretta su WhatsApp',
    sectionEyebrow: 'DIRECTORY INTERNAZIONALE',
    sectionTitle1: 'Artiste d’eccellenza per',
    sectionTitleEm: 'farti risplendere.',
    sectionSubtitle: 'Trova il look couture che valorizza al meglio la tua bellezza naturale.',
    sortBy: 'Ordina per',
    sortRecommended: 'Consigliati e più votati',
    sortPriceLow: 'Prezzo: Dal più basso',
    sortRatingHigh: 'Valutazione massima',
    sortDistance: 'Distanza più vicina',
    startingFrom: 'A PARTIRE DA',
    verifiedPro: 'PRO VERIFICATA',
    viewLooks: 'Guarda i look',
    enquireBtn: 'Richiedi info',
    howTitle1: 'Dal desiderio al',
    howTitleEm: 'tuo look perfetto.',
    howSubtitle: 'Tre semplici passaggi per prenotare la tua make-up artist preferita.',
    step1Title: 'Scopri i portfoli reali',
    step1Desc: 'Confronta immagini reali, comparatore prima/dopo e recensioni autentiche.',
    step2Title: 'Invia i tuoi dettagli',
    step2Desc: 'Specifica data, luogo e budget o chatta subito su WhatsApp.',
    step3Title: 'Conferma e splendi',
    step3Desc: 'Blocca la tua data e preparati a vivere un’esperienza di bellezza unica.',
    ctaEyebrow: 'PER MAKE-UP ARTIST',
    ctaTitle1: 'Il tuo talento merita',
    ctaTitleEm: 'visibilità internazionale.',
    ctaDesc: 'Unisciti a BookFlow Beauty e ricevi richieste dirette da future spose di tutto il mondo.',
    ctaBtn: 'Iscriviti ora',
    destinationNotice: 'Artiste disponibili per trasferte e matrimoni all’estero ✈️',
    resetWorldwide: 'Mostra tutto il mondo'
  },
  de: {
    topAnnouncement: '✨ Finden Sie Ihre perfekte Braut-Make-up-Stylistin für Ihren großen Tag.',
    navFindArtists: 'Stylisten finden',
    navHowItWorks: 'So funktioniert es',
    navForArtists: 'Für Make-up Artists',
    navSignIn: 'Anmelden',
    navListBusiness: 'Studio eintragen',
    heroEyebrow: 'EXKLUSIVES BRAUT- UND BEAUTY-VERZEICHNIS',
    heroTitle1: 'Ihr großer Moment.',
    heroTitleEm: 'Ihre Make-up Stylistin.',
    heroSubtitle: 'Entdecken Sie zertifizierte Braut-Stylistinnen weltweit für Hochzeiten und glamouröse Events mit direkter WhatsApp-Buchung.',
    searchLocationLabel: 'IHR STANDORT (STADT ODER LAND)',
    searchLocationPlaceholder: 'Stadt oder Land eingeben (z. B. Berlin, München, Zürich...)',
    searchServiceLabel: 'SERVICE-KATEGORIE',
    searchBtn: 'Stylisten suchen',
    allServices: 'Alle Dienstleistungen',
    trustVerified: '100% verifizierte Stylistinnen-Profile',
    trustDestination: 'Lokale & internationale Destination-Buchungen',
    trustLookbook: 'Lookbook & Vorher-Nachher Glamour Slider',
    trustWhatsApp: 'Direkter WhatsApp-Kontakt & Sofortbuchung',
    sectionEyebrow: 'GLOBALES BEAUTY-VERZEICHNIS',
    sectionTitle1: 'Künstlerinnen, die Sie zum',
    sectionTitleEm: 'Strahlen bringen.',
    sectionSubtitle: 'Finden Sie den perfekten Look, der Ihre natürliche Eleganz unterstreicht.',
    sortBy: 'Sortieren nach',
    sortRecommended: 'Empfohlen & Bestbewertet',
    sortPriceLow: 'Preis: Aufsteigend',
    sortRatingHigh: 'Beste Kundenbewertung',
    sortDistance: 'Kürzeste Entfernung',
    startingFrom: 'AB',
    verifiedPro: 'VERIFIZIERTER PROFI',
    viewLooks: 'Looks ansehen',
    enquireBtn: 'Anfragen',
    howTitle1: 'Von der Inspiration bis zur',
    howTitleEm: 'perfekten Stylistin.',
    howSubtitle: 'Drei einfache Schritte zur sicheren Buchung Ihres Hochzeits-Stylings.',
    step1Title: 'Portfolios & Looks vergleichen',
    step1Desc: 'Vergleichen Sie echte Arbeiten, Vorher-Nachher-Bilder und Kundenbewertungen.',
    step2Title: 'Event-Details teilen',
    step2Desc: 'Geben Sie Datum, Ort und Budget an oder chatten Sie direkt via WhatsApp.',
    step3Title: 'Bestätigen und strahlen',
    step3Desc: 'Sichern Sie sich Ihren Termin und genießen Sie Ihren perfekten Auftritt.',
    ctaEyebrow: 'FÜR MAKE-UP ARTISTS',
    ctaTitle1: 'Ihre Kunst verdient',
    ctaTitleEm: 'weltweite Anerkennung.',
    ctaDesc: 'Werden Sie Teil von BookFlow Beauty und erhalten Sie direkte Kundenanfragen von Bräuten weltweit.',
    ctaBtn: 'Jetzt registrieren',
    destinationNotice: 'Stylistinnen verfügbar für internationale Destination-Hochzeiten und Reisen ✈️',
    resetWorldwide: 'Weltweit anzeigen'
  }
};

/**
 * Automatically maps a searched or selected location to the most natural regional language!
 */
export function detectLanguageFromLocation(location: string): SupportedLanguage {
  if (!location) return 'en';
  const loc = location.toLowerCase();

  // Maharashtra / Regional India
  if (loc.includes('pune') || loc.includes('pimpri') || loc.includes('wakad') || loc.includes('chhatrapati') || loc.includes('sambhaji') || loc.includes('aurangabad') || loc.includes('cidco') || loc.includes('garkheda') || loc.includes('osmanpura') || loc.includes('waluj') || loc.includes('mumbai') || loc.includes('nagpur') || loc.includes('nashik') || loc.includes('maharashtra')) {
    return 'mr'; // Marathi
  }

  // Northern / Central India
  if (loc.includes('delhi') || loc.includes('jaipur') || loc.includes('lucknow') || loc.includes('indore') || loc.includes('bhopal') || loc.includes('patna') || loc.includes('varanasi') || loc.includes('chandigarh') || loc.includes('uttar pradesh') || loc.includes('madhya pradesh') || loc.includes('rajasthan')) {
    return 'hi'; // Hindi
  }

  // Middle East / Gulf
  if (loc.includes('dubai') || loc.includes('uae') || loc.includes('emirates') || loc.includes('abu dhabi') || loc.includes('saudi') || loc.includes('riyadh') || loc.includes('jeddah') || loc.includes('qatar') || loc.includes('doha') || loc.includes('kuwait') || loc.includes('oman') || loc.includes('bahrain') || loc.includes('egypt') || loc.includes('cairo')) {
    return 'ar'; // Arabic
  }

  // France / Francophone
  if (loc.includes('france') || loc.includes('paris') || loc.includes('nice') || loc.includes('cannes') || loc.includes('lyon') || loc.includes('marseille') || loc.includes('monaco')) {
    return 'fr'; // French
  }

  // Spain / Hispanic
  if (loc.includes('spain') || loc.includes('madrid') || loc.includes('barcelona') || loc.includes('mexico') || loc.includes('colombia') || loc.includes('argentina') || loc.includes('chile')) {
    return 'es'; // Spanish
  }

  // Italy
  if (loc.includes('italy') || loc.includes('italia') || loc.includes('rome') || loc.includes('milan') || loc.includes('milano') || loc.includes('florence') || loc.includes('venice')) {
    return 'it'; // Italian
  }

  // Germany / Austria / Switzerland (German)
  if (loc.includes('germany') || loc.includes('deutschland') || loc.includes('berlin') || loc.includes('munich') || loc.includes('frankfurt') || loc.includes('austria') || loc.includes('vienna') || loc.includes('zurich')) {
    return 'de'; // German
  }

  return 'en';
}
