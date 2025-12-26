import Product from "../model/Product.js";

function slugifyTitle(title, fallback) {
    const base = String(title ?? "")
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return base || String(fallback);
}

function buildImageUrlsFromTitle(title, id) {
    // picsum.photos luôn trả về ảnh thật và hiển thị được.
    // Dùng seed theo title => link “phù hợp” và ổn định.
    const slug = slugifyTitle(title, id);
    const thumb = `https://picsum.photos/seed/${encodeURIComponent(slug)}/600/600`;

    const images = [
        `https://picsum.photos/seed/${encodeURIComponent(`${slug}-1`)}/1000/1000`,
        `https://picsum.photos/seed/${encodeURIComponent(`${slug}-2`)}/1000/1000`,
        `https://picsum.photos/seed/${encodeURIComponent(`${slug}-3`)}/1000/1000`,
    ];

    return { thumb, images };
}

/**
 * Fix product thumbnail/images theo title.
 * Yêu cầu: mongoose đã connect sẵn.
 */
export async function fixProductImages({ skip = 9, limit, all = false, dryRun = false } = {}) {
    const products = await Product.find().sort({ id: 1 });
    const targets = all ? products : products.slice(skip);
    const limitedTargets = limit ? targets.slice(0, limit) : targets;

    let updated = 0;

    for (const product of limitedTargets) {
        const { thumb, images } = buildImageUrlsFromTitle(product.title, product.id);

        const currentThumbnail = product.thumbnail;
        const currentImages = Array.isArray(product.images) ? product.images : [];
        const isAlreadyCorrect =
            currentThumbnail === thumb &&
            currentImages.length === images.length &&
            currentImages.every((url, idx) => url === images[idx]);

        if (isAlreadyCorrect) continue;

        if (dryRun) {
            console.log(
                `[DRY RUN] id=${product.id} title="${product.title}" => thumbnail=${thumb}`
            );
            continue;
        }

        await Product.updateOne(
            { _id: product._id },
            {
                $set: {
                    thumbnail: thumb,
                    images,
                    "meta.updatedAt": new Date(),
                },
            }
        );

        updated += 1;
    }

    return { updated, total: limitedTargets.length, dryRun };
}
