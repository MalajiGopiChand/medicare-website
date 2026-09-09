const mongoose = require('mongoose');

const dietPlanSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dietician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  disease: String,
  planName: String,
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  meals: [{
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack']
    },
    items: [{
      name: String,
      quantity: String,
      calories: Number,
      nutrients: {
        protein: Number,
        carbs: Number,
        fats: Number
      }
    }],
    timing: String
  }],
  recommendations: [String],
  restrictions: [String],
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DietPlan', dietPlanSchema);

