/**
 * Updates existing MongoDB section content to match CoreVita defaults.
 * Run: node src/scripts/syncCoreVitaSections.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Section = require('../models/Section');
const Theme = require('../models/Theme');
const connectDB = require('../config/db');

const UPDATES = {
  howItWorks: {
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
  },
  benefitsGrid: {
    heading: 'What Bee Pearl Helps With',
    cards: [
      { icon: '⚡', title: 'Low Energy & Fatigue', description: 'Delivers a potent dose of natural B-Complex vitamins to restore your body\'s natural energy production cycles—so you feel awake and alert without stimulants.' },
      { icon: '🛡️', title: 'Weak Immunity', description: 'Rich in antimicrobial enzymes and antioxidants that strengthen your body\'s natural defenses, helping you stay resilient during cold seasons or high-stress periods.' },
      { icon: '🧠', title: 'Brain Fog & Focus', description: 'Nourishes the brain with essential amino acids and fatty acids (Omega 3 & 6), helping to clear the mental haze and improve sharpness during work.' },
      { icon: '🔋', title: 'Slow Recovery', description: 'Packed with protein and amino acids to help repair muscle tissue and reduce physical fatigue after exercise or a long day.' },
      { icon: '🧘', title: 'Stress Resilience', description: 'Adaptogenic compounds help regulate your body\'s response to stress, keeping you grounded and preventing burnout.' },
    ],
  },
  resultsTimeline: {
    heading: 'When Will I See Results?',
    steps: [
      { icon: '📅', title: 'In the First Few Days', description: 'Many users report a "cleaner" feeling of energy. Unlike coffee, it doesn\'t hit you all at once. Instead, you may notice that you don\'t hit that 2 PM wall, and your focus feels sharper and more sustained throughout the day.' },
      { icon: '📈', title: 'After 2–3 Weeks', description: 'As your nutrient reserves refill, the deep work begins. You may notice you are waking up feeling more refreshed, recovering faster from workouts, and feeling less irritable under stress. Your immune system is now primed and active.' },
      { icon: '🔄', title: 'With Ongoing Use', description: 'Consistency is key. Long-term users of Bee Pearl report a "new normal" of vitality—where getting sick is rare, energy is constant, and they feel a deep sense of physical well-being they hadn\'t felt in years.' },
    ],
  },
  whoCanUse: {
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
  scienceStats: {
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
  comparison: {
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
};

const REMOVE = ['benefitsNumbered', 'supplementFacts', 'socialProofBanner', 'asFeaturedIn', 'whatMakesUsDifferent', 'trustedBy'];

(async () => {
  try {
    await connectDB();
    for (const [name, content] of Object.entries(UPDATES)) {
      await Section.findOneAndUpdate({ name }, { content }, { upsert: true });
      console.log(`Updated section: ${name}`);
    }
    const removed = await Section.deleteMany({ name: { $in: REMOVE } });
    console.log(`Removed ${removed.deletedCount} extra section(s)`);
    await Theme.findOneAndUpdate({}, { footerBg: '#c9a227' }, { upsert: true });
    console.log('Theme footer set to gold (#c9a227)');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
