import sharp from 'sharp'
import { supabase } from './index.js'

//========================================================
// PRODUTOS
//========================================================

export async function create_product(product_name, product_description = '', product_price) {
    try {
        const { data, error } = await supabase.from('product')
            .insert({
                product_name: product_name,
                product_description: product_description,
                product_price: product_price
            })
            .select()
            .single();

        if (error || !data) {
            throw error?.message || 'FAILED TO CREATE PRODUCT';
        }

        return data;
    } catch (error) {
        throw error || 'UNKNOWN ERROR';
    }
};

export async function get_products() {
    try {
        const { data, error } = await supabase.from('product')
            .select('product_id, product_name, product_price, created_at')
            .eq('product_available', true);

        if (error || !data || data.length === 0) {
            throw error?.message || 'PRODUCTS NOT FOUND';
        }

        return data;
    } catch (error) {
        throw error || 'UNKNOWN ERROR';
    }
};

export async function get_product(product_id) {
    try {
        const { data, error } = await supabase.from('product')
            .select('product_id, product_name, product_price, created_at')
            .eq('product_id', product_id)
            .eq('product_available', true)
            .single();

        if (error || !data) {
            throw error?.message || 'PRODUCT NOT FOUND';
        }

        return data;
    } catch (error) {
        throw error || 'UNKNOWN ERROR';
    }
};

export async function update_product(product_id, updates) {
    try {
        const { data, error } = await supabase.from('product')
            .update(updates)
            .eq('product_id', product_id)
            .select()
            .single();

        if (error || !data) {
            throw error?.message || 'FAILED TO UPDATE PRODUCT';
        }

        return data;
    } catch (error) {
        throw error || 'UNKNOWN ERROR';
    }
};

//========================================================
// IMAGENS
//========================================================

export async function upload_image(product_id, image_buffer) {
    try {
        const compressed_image = await sharp(image_buffer)
            .webp({ quality: 85 })
            .toBuffer();

        const { data: product_image_id, error: product_image_error } = await supabase.from('product_image')
            .insert({ product_id: product_id, product_image_url: "" })
            .select('product_image_id')
            .single();

        if (product_image_error || !product_image_id) {
            throw product_image_error?.message || 'FAILED TO INITIALIZE IMAGE RECORD';
        }

        const { data: image_upload, error: image_upload_error } = await supabase.storage.from('product_images')
            .upload(`${product_id}/${product_image_id.product_image_id}`, compressed_image, { contentType: 'image/webp' });

        if (image_upload_error) {
            throw image_upload_error?.message || 'FAILED TO UPLOAD IMAGE TO STORAGE';
        }

        const { data: image_url } = await supabase.storage.from('product_images')
            .getPublicUrl(`${product_id}/${product_image_id.product_image_id}`);

        const { data, error } = await supabase.from('product_image')
            .update({ product_image_url: image_url.publicUrl })
            .eq('product_image_id', product_image_id.product_image_id)
            .select()
            .single();

        if (error || !data) {
            throw error?.message || 'FAILED TO UPDATE IMAGE URL';
        }

        return data;
    } catch (error) {
        throw error || 'UNKNOWN ERROR';
    }
};

export async function get_preview(product_id) {
    try {
        const { data, error } = await supabase.from('product_image')
            .select('product_image_url')
            .eq('product_id', product_id)
            .eq('is_preview', true)
            .single();

        if (error || !data) {
            throw error?.message || 'PREVIEW IMAGE NOT FOUND';
        }

        return data;
    } catch (error) {
        throw error || 'UNKNOWN ERROR';
    }
};

export async function get_images(product_id) {
    try {
        const { data, error } = await supabase.from('product_image')
            .select('product_image_id, product_image_url, is_preview')
            .eq('product_id', product_id);

        if (error || !data || data.length === 0) {
            throw error?.message || 'IMAGES NOT FOUND';
        }

        return data;
    } catch (error) {
        throw error || 'UNKNOWN ERROR';
    }
};

export async function delete_image(product_id, product_image_id) {
    try {
        const { error: storage_error } = await supabase.storage.from('product_images')
            .remove([`${product_id}/${product_image_id}`]);

        const { data, error } = await supabase.from('product_image')
            .delete()
            .eq('product_image_id', product_image_id)
            .select();

        if (error || !data) {
            throw error?.message || 'FAILED TO DELETE IMAGE RECORD';
        }

        return data;
    } catch (error) {
        throw error || 'UNKNOWN ERROR';
    }
};

//========================================================
// VARIANTES
//========================================================

export async function create_variant() {}

export async function get_variants() {}

export async function update_variant() {}

export async function delete_variant() {}

//=========================================================
// TAGS
//=========================================================

export async function create_tag(tag_name, tag_type) {
    try {
        const { data, error } = await supabase.from('product_tag')
            .insert({
                product_tag_name: tag_name,
                product_tag_type: tag_type
            })
            .select()
            .single();

        if (error || !data) {
            throw error?.message || 'FAILED TO CREATE TAG';
        }

        return data;
    } catch (error) {
        throw error || 'UNKNOWN ERROR';
    }
};

export async function update_tag(product_tag_id, updates) {
    try {
        const { data, error } = await supabase.from('product_tag')
            .update(updates)
            .eq('product_tag_id', product_tag_id)
            .select()
            .single();

        if (error || !data) {
            throw error?.message || 'FAILED TO UPDATE TAG';
        }

        return data;
    } catch (error) {
        throw error || 'UNKNOWN ERROR';
    }
};

export async function delete_tag(product_tag_id) {
    try {
        const { data, error } = await supabase.from('product_tag')
            .delete()
            .eq('product_tag_id', product_tag_id)
            .select();

        if (error || !data) {
            throw error?.message || 'FAILED TO DELETE TAG';
        }

        return data;
    } catch (error) {
        throw error || 'UNKNOWN ERROR';
    }
};

export async function add_product_tag(product_id, product_tag_id) {
    try {
        const { data, error } = await supabase.from('product_tagged')
            .insert({
                product_id: product_id,
                product_tag_id: product_tag_id
            })
            .select()
            .single();

        if (error || !data) {
            throw error?.message || 'FAILED TO LINK TAG TO PRODUCT';
        }

        return data;
    } catch (error) {
        throw error || 'UNKNOWN ERROR';
    }
};

export async function remove_product_tag(product_id, product_tag_id) {
    try {
        const { data, error } = await supabase.from('product_tagged')
            .delete()
            .eq('product_id', product_id)
            .eq('product_tag_id', product_tag_id)
            .select();

        if (error || !data) {
            throw error?.message || 'FAILED TO REMOVE TAG FROM PRODUCT';
        }

        return data;
    } catch (error) {
        throw error || 'UNKNOWN ERROR';
    }
};