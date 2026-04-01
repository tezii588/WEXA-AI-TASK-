const express = require('express');
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { organizationId: req.user.organizationId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
});

// POST /api/products
router.post('/', async (req, res) => {
  try {
    const { name, sku, description, quantityOnHand, costPrice, sellingPrice, lowStockThreshold } = req.body;

    if (!name || !sku) return res.status(400).json({ error: 'Name and SKU are required.' });

    const existing = await prisma.product.findUnique({
      where: { sku_organizationId: { sku, organizationId: req.user.organizationId } },
    });
    if (existing) return res.status(400).json({ error: 'SKU already exists in your organization.' });

    const product = await prisma.product.create({
      data: {
        name,
        sku,
        description: description || null,
        quantityOnHand: parseInt(quantityOnHand) || 0,
        costPrice: costPrice ? parseFloat(costPrice) : null,
        sellingPrice: sellingPrice ? parseFloat(sellingPrice) : null,
        lowStockThreshold: lowStockThreshold ? parseInt(lowStockThreshold) : null,
        organizationId: req.user.organizationId,
      },
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create product.' });
  }
});

// PUT /api/products/:id
router.put('/:id', async (req, res) => {
  try {
    const { name, sku, description, quantityOnHand, costPrice, sellingPrice, lowStockThreshold } = req.body;

    const product = await prisma.product.findFirst({
      where: { id: req.params.id, organizationId: req.user.organizationId },
    });
    if (!product) return res.status(404).json({ error: 'Product not found.' });

    const updated = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name,
        sku,
        description: description || null,
        quantityOnHand: parseInt(quantityOnHand) || 0,
        costPrice: costPrice ? parseFloat(costPrice) : null,
        sellingPrice: sellingPrice ? parseFloat(sellingPrice) : null,
        lowStockThreshold: lowStockThreshold ? parseInt(lowStockThreshold) : null,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update product.' });
  }
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findFirst({
      where: { id: req.params.id, organizationId: req.user.organizationId },
    });
    if (!product) return res.status(404).json({ error: 'Product not found.' });

    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: 'Product deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product.' });
  }
});

module.exports = router;
