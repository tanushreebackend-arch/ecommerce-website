/**
 * Removes section records that are not on the CoreVita product page.
 * Run once on an existing DB: node src/scripts/cleanupExtraSections.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Section = require('../models/Section');
const connectDB = require('../config/db');

const EXTRA_SECTIONS = [
  'benefitsNumbered',
  'supplementFacts',
  'socialProofBanner',
  'asFeaturedIn',
  'whatMakesUsDifferent',
  'trustedBy',
];

(async () => {
  try {
    await connectDB();
    const result = await Section.deleteMany({ name: { $in: EXTRA_SECTIONS } });
    console.log(`Removed ${result.deletedCount} extra section(s): ${EXTRA_SECTIONS.join(', ')}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
