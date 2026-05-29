const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const savedCartItemSchema = new mongoose.Schema({
  productId: String,
  packId: String,
  name: String,
  packLabel: String,
  price: Number,
  originalPrice: Number,
  quantity: Number,
  image: String,
});

const addressSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  address: String,
  apartment: String,
  city: String,
  state: String,
  pinCode: String,
  country: { type: String, default: 'India' },
  phone: String,
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: String,
    addresses: [addressSchema],
    savedCart: [savedCartItemSchema],
    cartLastUpdated: Date,
    cartAbandonedEmailSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
