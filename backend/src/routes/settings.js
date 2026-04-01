const express = require('express');
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// GET /api/settings
router.get('/', async (req, res) => {
  try {
    const org = await prisma.organization.findUnique({
      where: { id: req.user.organizationId },
    });
    res.json({ defaultLowStockThreshold: org.defaultLowStockThreshold, orgName: org.name });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings.' });
  }
});

// PUT /api/settings
router.put('/', async (req, res) => {
  try {
    const { defaultLowStockThreshold } = req.body;

    const org = await prisma.organization.update({
      where: { id: req.user.organizationId },
      data: { defaultLowStockThreshold: parseInt(defaultLowStockThreshold) || 5 },
    });

    res.json({ defaultLowStockThreshold: org.defaultLowStockThreshold });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update settings.' });
  }
});

module.exports = router;
