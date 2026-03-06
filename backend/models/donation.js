import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    donorName: { type: String, trim: true, default: '' },
    donorEmail: { type: String, trim: true, lowercase: true, default: '' },
    message: { type: String, trim: true, default: '' },
    amount: { type: Number, required: true, min: 0, default: 0 }, // cents
    paymentId: { type: String, trim: true, index: true, default: '' },
    paymentStatus: { type: String, trim: true, default: 'paid' },
    donationType: { type: String, trim: true, default: 'generic' },
    status: { type: String, trim: true, default: 'active' },
    source: { type: String, trim: true, default: 'stripe_checkout' },
    paidAt: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);

const Donation = mongoose.models.Donation || mongoose.model('Donation', donationSchema);
export default Donation;
