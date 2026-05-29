/**
 * Updates product text + all section copy for NOW Foods SAMe 400 mg.
 * Preserves existing images/URLs in the database.
 * Run: node src/scripts/syncSameContent.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Section = require('../models/Section');
const Theme = require('../models/Theme');
const Review = require('../models/Review');
const connectDB = require('../config/db');

const IMAGE_KEYS = ['image', 'imageUrl', 'backgroundImage', 'logoUrl', 'heroImage', 'productImage', 'placeholderImages', 'logo'];

function mergeContent(newContent, oldContent = {}) {
  const merged = { ...newContent };
  for (const key of IMAGE_KEYS) {
    if (oldContent[key] !== undefined && oldContent[key] !== '' && oldContent[key] !== null) {
      merged[key] = oldContent[key];
    }
  }
  if (newContent.infographic && oldContent.infographic?.centerImage) {
    merged.infographic = { ...newContent.infographic, centerImage: oldContent.infographic.centerImage };
  }
  if (Array.isArray(oldContent.placeholderImages) && oldContent.placeholderImages.length) {
    merged.placeholderImages = oldContent.placeholderImages;
  }
  return merged;
}

const PRODUCT_TEXT = {
  name: 'NOW Foods SAMe 400 mg — Nervous System Support',
  brandName: 'NOW Foods',
  ratingText: 'Trusted quality — loved by 400+ customers',
  description:
    'NOW Foods SAMe 400 mg delivers stabilized S-Adenosyl-L-Methionine — a compound your body naturally produces that supports neurotransmitter balance, emotional well-being, and joint comfort from everyday strain.* Just one tablet daily on an empty stomach helps you feel more balanced, mobile, and mentally clear.',
  benefits: [
    'Supports emotional well-being & mood balance*',
    'Nervous system & neurotransmitter support*',
    'Helps joint comfort from overexertion*',
    'Stabilized formula — smaller, easy-to-swallow tablet',
  ],
};

const SECTIONS = {
  announcement: {
    text: 'FREE SHIPPING ON ALL ORDERS ABOVE ₹499',
    shippingThreshold: 499,
    backgroundColor: '#FACC15',
    textColor: '#1a1a1a',
    visible: true,
  },
  faq: {
    heading: 'Frequently Asked Questions',
    items: [
      {
        question: 'What is SAMe and how does it work?',
        answer:
          'SAMe (S-Adenosyl-L-Methionine) is a compound naturally found in your body. It plays a key role in methylation — a process involved in neurotransmitter production, mood regulation, and healthy joint function. NOW Foods SAMe 400 mg provides stabilized SAMe to support these pathways.*',
      },
      {
        question: 'What does NOW Foods SAMe help with?',
        answer:
          'SAMe supports emotional well-being, nervous system health, and joint comfort from everyday strain or overexertion.* Many people take it for mood balance, mental clarity, and maintaining comfortable movement.',
      },
      {
        question: 'When will I see results?',
        answer:
          'SAMe typically needs consistent daily use for at least 2 weeks before benefits become noticeable. Take on an empty stomach for best absorption. Individual results vary based on diet, lifestyle, and overall health.',
      },
      {
        question: 'Who should NOT take SAMe?',
        answer:
          'Do not use if you have bipolar disorder. Avoid if pregnant or nursing. Consult your physician before use if you take antidepressants, Parkinson\'s medications, or any prescription drugs. SAMe may interact with certain medications.',
      },
      {
        question: 'How should I take it?',
        answer:
          'Adults: Take 1 tablet daily on an empty stomach, or as directed by your healthcare practitioner. Store in a cool, dry place. Refrigerate after opening if indicated on your bottle label.',
      },
    ],
  },
  statsSection: {
    heading: 'Why Your Body Needs SAMe',
    paragraph:
      'Stress, aging, and poor diet can lower your natural SAMe levels — affecting mood, mental energy, and how your joints feel day to day. Replenishing SAMe helps support the biochemical pathways your brain and body rely on every day.',
    stat1: { number: '80%', text: 'of adults report feeling stressed enough to affect daily mood and focus' },
    stat2: { number: '65%', text: 'experience occasional joint stiffness from daily activity or exercise' },
  },
  goldStandard: {
    heading: 'The NOW Foods Quality Standard',
    paragraph:
      'Since 1968, NOW Foods has been a leader in natural supplements — manufactured in GMP-certified facilities with rigorous quality testing. Every batch of SAMe is stabilized for potency and delivered in a convenient 400 mg strength.',
    bullets: [
      'Stabilized SAMe for reliable potency and absorption.*',
      'Supports neurotransmitter synthesis for mood and mental clarity.*',
      'Helps maintain joint comfort from everyday strain.*',
    ],
  },
  scienceStats: {
    title: 'The Science Behind SAMe',
    subtitle: 'What research says about S-Adenosyl-L-Methionine:',
    closingText:
      'With NOW Foods SAMe 400 mg, you\'re supporting the natural pathways your body uses for mood, mind, and movement — backed by decades of clinical interest.*',
    backgroundColor: '#ffffff',
    stats: [
      { number: '40+', description: 'Years of SAMe research in mood and emotional well-being studies.*' },
      { number: '2 wks', description: 'Minimum recommended use before evaluating benefits — consistency matters.*' },
      { number: '400mg', description: 'Maximum-strength dose per tablet — fewer pills needed daily.*' },
      { number: 'GMP', description: 'Manufactured in GMP-certified facilities with strict quality standards.*' },
    ],
  },
  comparison: {
    heading: 'Why SAMe Is Different From a Basic Multivitamin',
    intro:
      'A daily multivitamin covers basic vitamins and minerals — but it does not provide **S-Adenosyl-L-Methionine**, the compound your body uses for methylation, neurotransmitter production, and joint biochemistry.',
    introSecondary:
      'NOW Foods SAMe 400 mg delivers **stabilized, bioactive SAMe** in one tablet — supporting mood, nervous system health, and joint comfort in a way standard multivitamins cannot.*',
    categories: [
      {
        name: 'Neurotransmitter & Mood Support',
        bullets: [
          'SAMe is required for the synthesis of serotonin, dopamine, and norepinephrine — key mood regulators.*',
          'Supports emotional well-being and mental balance without stimulants.*',
        ],
      },
      {
        name: 'Joint Comfort & Mobility',
        bullets: [
          'Clinical studies suggest SAMe may help alleviate minor aches from overexertion or strain.*',
          'Supports healthy cartilage metabolism for comfortable daily movement.*',
        ],
      },
      {
        name: 'Cellular Methylation',
        bullets: [
          'SAMe donates methyl groups needed for over 200 biochemical reactions in the body.*',
          'Supports brain energy production and healthy cell membrane function.*',
        ],
      },
    ],
    infographic: {
      brandName: 'NOW Foods',
      labels: [
        { position: 'top', text: 'Stabilized SAMe for mood and emotional well-being*' },
        { position: 'left', text: 'Methylation support for brain chemistry balance*' },
        { position: 'right', text: 'Joint comfort from everyday strain and overexertion*' },
        { position: 'bottomLeft', text: 'Smaller tablet — easier daily compliance*' },
        { position: 'bottomRight', text: '400 mg strength — maximum potency per dose*' },
      ],
    },
  },
  videoTestimonials: {
    headingLine1: 'Real Stories, Real Results:',
    headingLine2: 'How NOW Foods SAMe Is Changing Lives',
    ctaText: 'BUY NOW & SAVE',
    placeholderImages: [],
  },
  nutrientComparison: {
    heading: 'Why NOW Foods SAMe 400 mg Stands Out',
    intro: 'Here\'s why NOW Foods SAMe 400 mg stands out — stabilized, maximum-strength SAMe your body actually uses.*',
    cards: [
      {
        nutrient: 'SAMe Potency',
        claim: '2X MORE SAMe per tablet than standard 200 mg formulas*',
        competitorLabel: 'Standard 200 mg SAMe',
        benefits: ['Maximum strength dosing', 'Fewer tablets daily', 'Better value per mg', 'Consistent potency'],
      },
      {
        nutrient: 'Stabilization',
        claim: 'Stabilized formula — no enteric coating needed*',
        competitorLabel: 'Unstable SAMe',
        benefits: ['Protected from degradation', 'Room-temperature stable', 'Easy to take anywhere', 'Reliable absorption'],
      },
      {
        nutrient: 'Mood Support',
        claim: 'Direct neurotransmitter support — not just B-vitamins*',
        competitorLabel: 'Basic B-Complex',
        benefits: ['Supports serotonin pathways', 'Emotional well-being', 'Mental clarity', 'Nervous system health'],
      },
      {
        nutrient: 'Joint Comfort',
        claim: 'Studied for joint function — natural approach*',
        competitorLabel: 'OTC Pain Relievers',
        benefits: ['Supports cartilage health', 'Everyday mobility', 'No stomach irritation*', 'Long-term wellness'],
      },
      {
        nutrient: 'Tablet Size',
        claim: 'Smaller tablet — easier to swallow daily*',
        competitorLabel: 'Large Enteric Tablets',
        benefits: ['Compact size', 'No coating needed', 'Better compliance', 'Comfortable daily use'],
      },
      {
        nutrient: 'Methylation',
        claim: 'Broad methylation support beyond folate alone*',
        competitorLabel: 'Folate Supplement',
        benefits: ['200+ biochemical reactions', 'Brain energy support', 'Cell membrane health', 'Whole-body balance'],
      },
    ],
  },
  howItWorks: {
    heading: 'How Does SAMe Work?',
    subheading: 'The Science Behind S-Adenosyl-L-Methionine',
    body: 'SAMe (S-Adenosyl-L-Methionine) is a compound your body produces naturally — but stress, aging, and lifestyle can deplete your levels over time.',
    bodySecondary:
      'Unlike a basic multivitamin, NOW Foods SAMe 400 mg delivers stabilized SAMe that supports methylation — the biochemical process behind mood, brain chemistry, and joint comfort.*',
    bullets: [
      '**Mood & Emotional Well-Being** — supports serotonin and dopamine pathways*',
      '**Nervous System Support** — helps maintain healthy neurotransmitter balance*',
      '**Joint Comfort** — studied for relief from everyday strain and overexertion*',
      '**400 mg Strength** — maximum potency in a compact, easy-to-swallow tablet*',
    ],
    closingText: 'Take one tablet daily on an empty stomach. Most people notice benefits within 2 weeks of consistent use.*',
  },
  benefitsGrid: {
    heading: 'What NOW Foods SAMe Helps With',
    cards: [
      {
        icon: '😊',
        title: 'Mood & Emotional Balance',
        description: 'SAMe supports the synthesis of serotonin and dopamine — helping you feel more balanced, calm, and emotionally steady throughout the day.*',
      },
      {
        icon: '🧠',
        title: 'Nervous System Support',
        description: 'Helps maintain healthy neurotransmitter levels for mental clarity, focus, and overall nervous system wellness — without stimulants.*',
      },
      {
        icon: '🦴',
        title: 'Joint Comfort & Mobility',
        description: 'Clinical studies suggest SAMe may help alleviate minor aches from everyday strain or overexertion, supporting comfortable daily movement.*',
      },
      {
        icon: '⚡',
        title: 'Mental Clarity & Focus',
        description: 'By supporting methylation and brain chemistry, SAMe helps clear mental fog and sustain sharper focus during busy days.*',
      },
      {
        icon: '💪',
        title: 'Whole-Body Wellness',
        description: 'SAMe participates in over 200 biochemical reactions — supporting cellular energy, membrane health, and your body\'s natural balance.*',
      },
    ],
  },
  resultsTimeline: {
    heading: 'When Will I See Results?',
    steps: [
      {
        icon: '📅',
        title: 'In the First Few Days',
        description: 'SAMe works at the biochemical level — you may not feel dramatic changes immediately. Focus on taking your tablet daily on an empty stomach for best absorption.',
      },
      {
        icon: '📈',
        title: 'After 2–3 Weeks',
        description: 'Most users begin noticing improved mood balance, clearer mental focus, and more comfortable joint movement. Consistency is key — SAMe needs time to build up in your system.',
      },
      {
        icon: '🔄',
        title: 'With Ongoing Use',
        description: 'Long-term SAMe users report a sustained sense of emotional well-being, sharper daily focus, and easier mobility — a new baseline of mind-and-body balance they can feel every day.*',
      },
    ],
  },
  whoCanUse: {
    heading: 'Who Can Use It?',
    intro: 'NOW Foods SAMe 400 mg is designed for adults who want targeted support for mood, nervous system health, and joint comfort — in one convenient daily tablet.*',
    audiences: [
      'Adults seeking natural mood and emotional well-being support*',
      'People experiencing occasional joint stiffness from daily activity or exercise',
      'Busy professionals who want mental clarity without stimulants',
      'Active individuals looking for joint comfort from everyday strain',
      'Anyone interested in methylation support for whole-body wellness',
    ],
    disclaimer: 'Note: Do not use if you have bipolar disorder. Consult your physician before use if pregnant, nursing, or taking antidepressants or other prescription medications.',
  },
  reviewsSection: {
    heading: '400+ People Are Already Feeling Better With NOW Foods SAMe',
    ctaText: 'BUY NOW & SAVE',
  },
  footer: {
    copyright: '© 2025 NOW Foods — Authorized Retailer. All rights reserved.',
    newsletterPlaceholder: 'Enter your email',
    newsletterButton: 'Subscribe',
  },
  contact: {
    heading: 'Get In Touch',
    subheading: 'Questions about NOW Foods SAMe? Send us a message — we\'ll respond as soon as possible.',
  },
  navbar: {
    brandName: 'NOW Foods',
    links: [
      { label: 'Shop', href: '/' },
      { label: 'Contact', href: '/contact' },
      { label: 'Track Your Order', href: '/track-order' },
    ],
  },
};

const THEME = {
  primaryColor: '#FACC15',
  secondaryColor: '#F7941D',
  bgColor: '#ffffff',
  textColor: '#1a1a1a',
  headingColor: '#1a1a1a',
  linkColor: '#CA8A04',
  sectionAltBg: '#FFFBEB',
  footerBg: '#F7941D',
  cardBorderColor: '#FEF9C3',
  announcementBg: '#FACC15',
  announcementText: '#1a1a1a',
};

const SAMPLE_REVIEWS = [
  {
    name: 'Priya Sharma',
    email: 'priya@example.com',
    rating: 5,
    title: 'Mood feels so much better',
    text: 'After 3 weeks of NOW Foods SAMe, I feel more balanced and less irritable. My joints feel better after my morning walks too!',
    status: 'approved',
    isPinned: true,
  },
  {
    name: 'Rahul Mehta',
    email: 'rahul@example.com',
    rating: 5,
    title: 'Finally something that works',
    text: 'I\'ve tried many supplements for mood and joint comfort. This SAMe 400 mg is the first one where I noticed a real difference within 2 weeks.',
    status: 'approved',
    isPinned: true,
  },
  {
    name: 'Ananya Patel',
    email: 'ananya@example.com',
    rating: 4,
    title: 'Great quality SAMe',
    text: 'Small tablet, easy to take on empty stomach. Feeling more focused at work and my knees feel less stiff in the mornings.',
    status: 'approved',
    isPinned: false,
  },
];

(async () => {
  try {
    await connectDB();

    await Product.updateOne({}, { $set: PRODUCT_TEXT });
    console.log('Product text updated (images & prices unchanged)');

    for (const [name, content] of Object.entries(SECTIONS)) {
      const existing = await Section.findOne({ name });
      const merged = mergeContent(content, existing?.content || {});
      await Section.findOneAndUpdate({ name }, { content: merged }, { upsert: true });
      console.log(`Section updated: ${name}`);
    }

    await Theme.findOneAndUpdate({}, THEME, { upsert: true });
    console.log('Theme updated (bright yellow + orange)');

    const reviewCount = await Review.countDocuments({ status: 'approved' });
    if (reviewCount === 0) {
      await Review.insertMany(SAMPLE_REVIEWS);
      console.log('Sample SAMe reviews seeded');
    } else {
      console.log(`Reviews unchanged (${reviewCount} existing)`);
    }

    console.log('\n✅ SAMe content sync complete!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
