import { Router } from 'express';
import { authorize, authorizeAdmin } from '../functions/authentication.functions.js';
import * as productFn from '../functions/product.functions.js';

const router = Router();

// --- ROTAS PÚBLICAS (Apenas leitura) ---

router.get('/', async (req, res) => {
    try {

        const data = await productFn.get_products();

        return res.status(200).json(data);

    } catch (err) {
        return res.status(500).json({ error: err });
    }
});

router.get('/:id', async (req, res) => {
    try {

        const data = await productFn.get_product(req.params.id);

        return res.status(200).json(data);

    } catch (err) {
        return res.status(404).json({ error: err });
    }
});

router.get('/preview/:id', async (req, res) => {
    try {

        const data = await productFn.get_preview(req.params.id);

        return res.status(200).json(data);

    } catch (err) {
        return res.status(404).json({ error: err });
    }
});

router.get('/images/:id', async (req, res) => {
    try {

        const data = await productFn.get_images(req.params.id);

        return res.status(200).json(data);

    } catch (err) {
        return res.status(404).json({ error: err });
    }
});


// ---ADMIN---

router.post('/admin/create', authenticate, authorizeAdmin, async (req, res) => {
    try {

        const { name, description, price } = req.body;

        const data = await productFn.create_product(name, description, price);

        return res.status(201).json(data);

    } catch (err) {
        return res.status(500).json({ error: err });
    }
});

router.post('/admin/upload-image', authenticate, authorizeAdmin, async (req, res) => {
    try {

        const { product_id, image_buffer } = req.body;

        const data = await productFn.upload_image(product_id, image_buffer);

        return res.status(200).json(data);

    } catch (err) {
        return res.status(500).json({ error: err });
    }
});

router.delete('/admin/delete-image', authenticate, authorizeAdmin, async (req, res) => {
    try {

        const { product_id, image_id } = req.body;

        const data = await productFn.delete_image(product_id, image_id);

        return res.status(200).json({ message: 'IMAGE DELETED' });

    } catch (err) {
        return res.status(500).json({ error: err });
    }
});

// Gerenciamento de Tags
router.post('/admin/tag', authenticate, authorizeAdmin, async (req, res) => {
    try {

        const { name, type } = req.body;

        const data = await productFn.create_tag(name, type);

        return res.status(201).json(data);

    } catch (err) {
        return res.status(500).json({ error: err });
    }
});

router.put('/admin/tag/:id', authenticate, authorizeAdmin, async (req, res) => {
    try {

        const data = await productFn.update_tag(req.params.id, req.body);

        return res.status(200).json(data);

    } catch (err) {
        return res.status(500).json({ error: err });
    }
});

router.delete('/admin/tag/:id', authenticate, authorizeAdmin, async (req, res) => {
    try {

        await productFn.delete_tag(req.params.id);

        return res.status(200).json({ message: 'TAG DELETED' });

    } catch (err) {
        return res.status(500).json({ error: err });
    }
});

// Vincular/Desvincular Tags
router.post('/admin/product-tag', authenticate, authorizeAdmin, async (req, res) => {
    try {

        const { product_id, tag_id } = req.body;

        const data = await productFn.add_product_tag(product_id, tag_id);

        return res.status(200).json(data);

    } catch (err) {
        return res.status(500).json({ error: err });
    }
});

router.delete('/admin/product-tag', authenticate, authorizeAdmin, async (req, res) => {
    try {

        const { product_id, tag_id } = req.body;

        await productFn.remove_product_tag(product_id, tag_id);

        return res.status(200).json({ message: 'TAG REMOVED' });

    } catch (err) {
        return res.status(500).json({ error: err });
    }
});

export default router;