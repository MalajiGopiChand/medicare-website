const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { calculateDiseaseRisk, generateSOAPNotes } = require('../utils/aiHelper');

// Disease risk prediction
router.post('/disease-risk', auth, async (req, res) => {
  try {
    const { age, bmi, bloodPressure, sugarHistory, familyHistory, diseaseType } = req.body;

    const result = calculateDiseaseRisk({
      age,
      bmi,
      bloodPressure,
      sugarHistory,
      familyHistory,
      diseaseType
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate SOAP notes
router.post('/soap-notes', auth, async (req, res) => {
  try {
    const { subjective, objective, assessment, plan } = req.body;

    const soapNotes = generateSOAPNotes(subjective, objective, assessment, plan);

    res.json(soapNotes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

