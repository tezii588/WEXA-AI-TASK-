const express = require('express');
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// GET /api/dashboard
router.get('/', async (req, res) => {
  try {
    const orgId = req.user.organizationId;

    const org = await prisma.organization.findUnique({ where: { id: orgId } });
    const products = await prisma.product.findMany({ where: { organizationId: orgId } });

    const totalProducts = products.length;
    const totalQuantity = products.reduce((sum, p) => sum + p.quantityOnHand, 0);
    const globalThreshold = org.defaultLowStockThreshold;

    const lowStockItems = products.filter(p => {
      const threshold = p.lowStockThreshold ?? globalThreshold;
      return p.quantityOnHand <= threshold;
    });

    res.json({ totalProducts, totalQuantity, globalThreshold, lowStockItems });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch dashboard data.' });
  }
});

module.exports = router;
