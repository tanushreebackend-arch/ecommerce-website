require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Product = require('./models/Product');
const Pack = require('./models/Pack');
const Section = require('./models/Section');
const Theme = require('./models/Theme');
const Settings = require('./models/Settings');
const Policy = require('./models/Policy');
const Review = require('./models/Review');
const Video = require('./models/Video');
const Coupon = require('./models/Coupon');

const connectDB = require('./config/db');

const seedSections = [
  {
    name: 'announcement',
    content: {
      text: 'FREE SHIPPING ON ALL ORDERS ABOVE ₹499',
      shippingThreshold: 499,
      backgroundColor: '#1a472a',
      textColor: '#ffffff',
      visible: true,
    },
  },
  {
    name: 'faq',
    content: {
      heading: 'Frequently Asked Questions',
      items: [
        {
          question: 'How does it work?',
          answer: 'Our formula delivers concentrated bioavailable nutrients directly to your cells. The advanced delivery system ensures rapid absorption within minutes of taking your daily dose.',
        },
        {
          question: 'What does it help with?',
          answer: 'It helps with low energy, weak immunity, brain fog, slow recovery, stress, and nutrient deficiencies. Most users notice improvements in energy and focus within the first few days.',
        },
        {
          question: 'When will I see results?',
          answer: 'Many users report feeling more energetic within the first few days. Significant improvements in immunity and mental clarity are typically noticed after 2-3 weeks of consistent use.',
        },
        {
          question: 'Who can use it?',
          answer: "It's designed for adults 18+ looking to optimize their health naturally. Busy professionals, athletes, and health-conscious individuals see the best results. Not recommended for pregnant or nursing women.",
        },
        {
          question: 'Is it safe? Any side effects?',
          answer: 'Yes, completely safe. Made from 100% natural ingredients with no artificial additives. Manufactured in GMP-certified facilities. No known side effects when taken as directed.',
        },
      ],
    },
  },
  {
    name: 'howItWorks',
    content: {
      heading: 'How Does It Work?',
      subheading: 'The Science Behind Premium Wellness',
      body: 'In our high-stress modern world, our bodies burn through nutrient reserves faster than we can replace them. This "nutrient gap" is the silent killer of your energy levels.',
      bodySecondary: 'Most supplements are synthetic and hard to digest. Bee Pearl is different. It is concentrated Bee Bread — pollen that has been naturally fermented by bees in the hive.',
      bullets: [
        '**Natural B-Vitamins** — essential for converting food into fuel',
        '**20+ Amino Acids** — the building blocks for recovery and repair',
        '**Live Enzymes** — supporting digestion and gut health',
        '**Macro & Micro Elements** — Zinc, Magnesium, and Iron',
      ],
      closingText: 'Because it is pre-digested by nature, your body absorbs it instantly—fueling your cells with raw, clean energy without the caffeine crash.',
      image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=600&fit=crop',
    },
  },
  {
    name: 'benefitsGrid',
    content: {
      heading: 'What Bee Pearl Helps With',
      cards: [
        { icon: '⚡', title: 'Low Energy & Fatigue', description: 'Delivers a potent dose of natural B-Complex vitamins to restore your body\'s natural energy production cycles—so you feel awake and alert without stimulants.' },
        { icon: '🛡️', title: 'Weak Immunity', description: 'Rich in antimicrobial enzymes and antioxidants that strengthen your body\'s natural defenses, helping you stay resilient during cold seasons or high-stress periods.' },
        { icon: '🧠', title: 'Brain Fog & Focus', description: 'Nourishes the brain with essential amino acids and fatty acids (Omega 3 & 6), helping to clear the mental haze and improve sharpness during work.' },
        { icon: '🔋', title: 'Slow Recovery', description: 'Packed with protein and amino acids to help repair muscle tissue and reduce physical fatigue after exercise or a long day.' },
        { icon: '🧘', title: 'Stress Resilience', description: 'Adaptogenic compounds help regulate your body\'s response to stress, keeping you grounded and preventing burnout.' },
      ],
    },
  },
  {
    name: 'resultsTimeline',
    content: {
      heading: 'When Will I See Results?',
      steps: [
        { icon: '📅', title: 'In the First Few Days', description: 'Many users report a "cleaner" feeling of energy. Unlike coffee, it doesn\'t hit you all at once. Instead, you may notice that you don\'t hit that 2 PM wall, and your focus feels sharper and more sustained throughout the day.' },
        { icon: '📈', title: 'After 2–3 Weeks', description: 'As your nutrient reserves refill, the deep work begins. You may notice you are waking up feeling more refreshed, recovering faster from workouts, and feeling less irritable under stress.' },
        { icon: '🔄', title: 'With Ongoing Use', description: 'Consistency is key. Long-term users report a "new normal" of vitality—where getting sick is rare, energy is constant, and they feel a deep sense of physical well-being they hadn\'t felt in years.' },
      ],
    },
  },
  {
    name: 'whoCanUse',
    content: {
      heading: 'Who Can Use It?',
      intro: 'Our premium supplement is nature\'s ultimate multivitamin, designed for anyone who wants to upgrade their physical baseline naturally.',
      audiences: [
        'Busy Professionals dealing with brain fog and afternoon slumps',
        'Parents who need steady energy to keep up with their kids',
        'Athletes & Active People needing faster recovery and muscle repair',
        'Immune-Conscious Individuals looking for year-round protection',
        'Anyone sensitive to synthetic vitamins looking for a whole-food solution',
      ],
      disclaimer: 'Note: As this is a bee product, it is not suitable for those with severe bee pollen allergies.',
    },
  },
  {
    name: 'statsSection',
    content: {
      heading: 'Why Modern Food Isn\'t Enough',
      paragraph: 'Today\'s food supply is broken. "Empty" calories and nutrient-dead soil mean we have to eat twice as much just to get half the nutrition our grandparents did.',
      stat1: { number: '92%', text: 'of people are deficient in at least one essential vitamin' },
      stat2: { number: '74%', text: 'suffer from chronic low energy due to nutrient gaps' },
      backgroundImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200',
    },
  },
  {
    name: 'goldStandard',
    content: {
      heading: 'Nature\'s Gold Standard',
      paragraph: 'Known as "Nature\'s Perfect Food," Bee Bread has been cherished for centuries for its healing power. Its unique enzymatic profile makes it the ultimate tool for restoring vitality.',
      bullets: [
        'Fuel mitochondria with pre-digested energy your cells absorb instantly.',
        'Repair damaged tissue and neutralize inflammation naturally.',
        'Support deep sleep, mental clarity, and sustained stamina.',
      ],
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600',
    },
  },
  {
    name: 'scienceStats',
    content: {
      title: 'The Science Supporting Our Formula',
      subtitle: 'Results from clinical studies on Bee Bread & Propolis:',
      closingText: 'With Bee Pearl, you\'re giving your body the nutrients it needs to thrive—backed by real results.',
      backgroundColor: '#ffffff',
      stats: [
        { number: '47%', description: 'Reported a significant increase in daily energy and focus within just 21 days.' },
        { number: '33%', description: 'Experienced deeper, more restorative REM sleep cycles and woke up recharged.' },
        { number: '62%', description: 'Showed a measurable reduction in systemic inflammation markers and stress.' },
        { number: '89%', description: 'Noticed improved digestion and gut health due to natural bioactive enzymes.' },
      ],
    },
  },
  {
    name: 'comparison',
    content: {
      heading: 'Why Your Multivitamin Isn\'t Enough',
      intro: 'Most daily supplements are synthetic, made in a lab, and difficult for your body to absorb. Bee Pearl is different — it is a **living, pre-digested superfood**.',
      introSecondary: 'Because the bees have already fermented the pollen, the tough outer shell is broken down, making the nutrients **100% bioavailable** so your cells can use them instantly.',
      categories: [
        {
          name: 'Live Enzymes & Co-Enzymes',
          bullets: [
            'Unlike dry tablets, these active compounds support healthy digestion and nutrient uptake.',
            'Fuel metabolic processes that convert food into natural, sustained energy.',
          ],
        },
        {
          name: 'Complete B-Complex & Vitamins',
          bullets: [
            'Packed with natural B-Vitamins (B1, B2, B3, B6, B12) for mental clarity and focus.',
            'Rich in Vitamins A, C, and E to fight oxidative stress without the "synthetic crash."',
          ],
        },
        {
          name: 'Free-Form Amino Acids',
          bullets: [
            'Contains all 9 essential amino acids necessary for tissue repair and muscle recovery.',
            'Supports neurotransmitter health for better mood and cognitive performance.',
          ],
        },
      ],
      infographic: {
        centerImage: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&fit=crop',
        brandName: 'Premium Wellness',
        labels: [
          { position: 'top', text: 'Concentrated Bee Bread to support vitality and overall wellness' },
          { position: 'left', text: 'B Vitamins & Minerals for natural energy and well-being' },
          { position: 'right', text: 'Antioxidants for immune support and cellular health' },
          { position: 'bottomLeft', text: 'Amino Acids to aid muscle recovery and tissue repair' },
          { position: 'bottomRight', text: 'Enzymes for better digestion and nutrient absorption' },
        ],
      },
    },
  },
  {
    name: 'videoTestimonials',
    content: {
      headingLine1: 'Real Stories, Real Results:',
      headingLine2: 'How Premium Wellness Is Changing Lives',
      ctaText: 'BUY NOW & SAVE',
      placeholderImages: [],
    },
  },
  {
    name: 'nutrientComparison',
    content: {
      heading: 'The Ultimate Nutrient-Rich Superfood for Energy and Vitality',
      productImage: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=80&h=80&fit=crop',
      cards: [
        {
          nutrient: 'Vitamin B Complex',
          claim: '5X MORE Vitamin B12 than Beef Liver*',
          competitorLabel: 'Beef Liver',
          benefits: ['Boosts energy levels', 'Combats fatigue', 'Improves alertness', 'Reduces tiredness'],
        },
        {
          nutrient: 'Iron',
          claim: '3X MORE Iron than Spinach*',
          competitorLabel: 'Spinach',
          benefits: ['Prevents anemia', 'Improves stamina', 'Supports red blood cells', 'Enhances oxygen delivery'],
        },
        {
          nutrient: 'Vitamin D',
          claim: '2X MORE Vitamin D than Milk*',
          competitorLabel: 'Milk',
          benefits: ['Boosts energy and vitality', 'Combats tiredness', 'Supports immune health', 'Improves mood'],
        },
        {
          nutrient: 'Magnesium',
          claim: '4X MORE Magnesium than Kale*',
          competitorLabel: 'Kale',
          benefits: ['Reduces fatigue', 'Supports muscle function', 'Enhances energy production', 'Relieves muscle soreness'],
        },
        {
          nutrient: 'Vitamin C',
          claim: '7X MORE Vitamin C than Oranges*',
          competitorLabel: 'Oranges',
          benefits: ['Strengthens immune system', 'Reduces inflammation', 'Protects against stress', 'Supports healthy skin'],
        },
        {
          nutrient: 'Amino Acids',
          claim: 'More Protein than Eggs*',
          competitorLabel: 'Eggs',
          benefits: ['Muscle repair & recovery', 'Supports neurotransmitters', 'Boosts metabolic rate', 'Enhances endurance'],
        },
      ],
    },
  },
  {
    name: 'reviewsSection',
    content: {
      heading: '400+ People Are Already Thriving With The Healing Power Of Bee Pearl',
      ctaText: 'BUY NOW & SAVE',
    },
  },
  {
    name: 'footer',
    content: {
      copyright: '© 2025 Premium Wellness. All rights reserved.',
      newsletterPlaceholder: 'Enter your email',
      newsletterButton: 'Subscribe',
    },
  },
  {
    name: 'contact',
    content: {
      heading: 'Get In Touch',
      subheading: 'Have questions? We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
      backgroundImage: '',
    },
  },
  {
    name: 'navbar',
    content: {
      brandName: 'Premium Wellness',
      logoUrl: '',
      links: [
        { label: 'Shop', href: '/' },
        { label: 'Contact', href: '/contact' },
        { label: 'Track Your Order', href: '/track-order' },
      ],
    },
  },
];

const seed = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    let admin = await Admin.findOne({ email: adminEmail });
    if (!admin) {
      admin = await Admin.create({ email: adminEmail, password: adminPassword });
      console.log(`Admin created: ${admin.email}`);
    } else {
      console.log(`Admin already exists: ${admin.email}`);
    }

    const count = await Product.countDocuments();
    if (count > 0) {
      console.log('DB already seeded, skipping...');
      process.exit(0);
    }

    console.log('Database is empty — seeding initial data...');

    const product = await Product.create({
      name: 'Bee Pearl — Premium Wellness Supplement',
      brandName: 'Premium Wellness',
      salePrice: 999,
      mrp: 3499,
      stock: 47,
      rating: 4.7,
      ratingText: 'Loved by 400+ herbalists',
      description: 'Bee Pearl is designed to restore natural vitality — the hidden root cause behind faster aging, nutrient depletion, and accelerated weight gain. Just one daily dose helps restore balance from within — naturally supporting your steady energy, recovery, and mental clarity.',
      benefits: [
        'All day energy without any crashes',
        'Strengthens natural immune defense',
        'Sharper focus & mental clarity',
        'Rich in vitamins for faster recovery',
      ],
      images: [
        { url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&fit=crop', sortOrder: 0 },
        { url: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=800&fit=crop', sortOrder: 1 },
        { url: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=800&fit=crop', sortOrder: 2 },
        { url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&fit=crop', sortOrder: 3 },
        { url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&fit=crop', sortOrder: 4 },
      ],
      logo: { url: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=200' },
      comparisonImage: { url: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=80&h=80&fit=crop' },
    });
    console.log('Product created');

    // Create packs
    await Pack.insertMany([
      { label: 'Buy 1 + Get 1 FREE', description: '2 bottles total', price: 999, originalPrice: 3499, savingsPercent: 72, badge: 'POPULAR', sortOrder: 0 },
      { label: 'Buy 2 + Get 2 FREE', description: '4 bottles total', price: 1799, originalPrice: 6998, savingsPercent: 74, badge: 'BEST VALUE', sortOrder: 1 },
      { label: 'Buy 3 + Get 3 FREE', description: '6 bottles total', price: 2499, originalPrice: 10497, savingsPercent: 76, badge: 'MEGA SAVE', sortOrder: 2 },
    ]);
    console.log('Packs created');

    // Create sections
    await Section.insertMany(seedSections);
    console.log('Sections created');

    // Create theme
    await Theme.create({
      headingFont: 'Inter',
      bodyFont: 'Poppins',
      accentFont: 'Poppins',
      primaryColor: '#1a472a',
      secondaryColor: '#c9a227',
      bgColor: '#ffffff',
      textColor: '#1a1a1a',
      headingColor: '#1a1a1a',
      linkColor: '#1a472a',
      sectionAltBg: '#f7f8f5',
      footerBg: '#c9a227',
      cardBorderColor: '#e5e7eb',
      announcementBg: '#1a472a',
      announcementText: '#ffffff',
    });
    console.log('Theme created');

    // Settings
    await Settings.insertMany([
      { key: 'freeShippingThreshold', value: 499 },
      { key: 'codEnabled', value: true },
      { key: 'shippingCost', value: 99 },
    ]);

    // Policies
    await Policy.insertMany([
      { type: 'refund', title: 'Refund Policy', content: '<h2>Refund Policy</h2><p>We offer a 30-day money-back guarantee. If you\'re not satisfied with your purchase, contact us within 30 days for a full refund.</p>' },
      { type: 'privacy', title: 'Privacy Policy', content: '<h2>Privacy Policy</h2><p>We respect your privacy and are committed to protecting your personal data. We collect only the information necessary to process your orders and improve your experience.</p>' },
      { type: 'terms', title: 'Terms of Service', content: '<h2>Terms of Service</h2><p>By using our website, you agree to these terms. All products are sold as-is with our satisfaction guarantee.</p>' },
      { type: 'shipping', title: 'Shipping Policy', content: '<h2>Shipping Policy</h2><p>We ship across India within 3-5 business days. Free shipping on orders above ₹499.</p>' },
    ]);

    // Sample approved reviews
    await Review.insertMany([
      { name: 'Priya Sharma', email: 'priya@example.com', rating: 5, title: 'Life changing!', text: 'I\'ve been taking this for 3 weeks and my energy levels have completely transformed. No more afternoon crashes!', status: 'approved', isPinned: true },
      { name: 'Rahul Mehta', email: 'rahul@example.com', rating: 5, title: 'Best supplement I\'ve tried', text: 'Tried many supplements before but this one actually works. My immunity has improved significantly.', status: 'approved', isPinned: true },
      { name: 'Ananya Patel', email: 'ananya@example.com', rating: 4, title: 'Great product', text: 'Noticeable difference in my focus and energy. Will definitely reorder!', status: 'approved', isPinned: false },
    ]);

    // Sample coupon
    await Coupon.create({
      code: 'WELCOME10',
      discountType: 'percentage',
      value: 10,
      minOrder: 500,
      expiryDate: new Date('2026-12-31'),
      usageLimit: 1000,
    });

    console.log('\n✅ Seed completed successfully!');
    console.log(`\nAdmin login:\n  Email: ${process.env.ADMIN_EMAIL || 'admin@example.com'}\n  Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
