/**
 * Optimize portfolio images for web deployment.
 * Resizes images to max 2000px wide and compresses to ~80% quality JPEG.
 * This brings ~250MB+ of raw photos down to reasonable web sizes (<500KB each).
 */
import sharp from 'sharp';
import { readdir, stat, rename } from 'fs/promises';
import { join, extname } from 'path';

const PORTFOLIO_DIR = join(process.cwd(), 'public', 'images', 'portfolio');
const MAX_WIDTH = 2000;
const QUALITY = 80;

async function getImageFiles(dir) {
    const files = [];
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...await getImageFiles(fullPath));
        } else {
            const ext = extname(entry.name).toLowerCase();
            if (['.jpg', '.jpeg', '.png'].includes(ext)) {
                files.push(fullPath);
            }
        }
    }
    return files;
}

async function optimizeImage(filePath) {
    const stats = await stat(filePath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    // Skip files that are already small (< 500KB)
    if (stats.size < 500 * 1024) {
        console.log(`  SKIP ${filePath} (${sizeMB}MB - already small)`);
        return { skipped: true, originalSize: stats.size, newSize: stats.size };
    }

    try {
        // Read and optimize
        const buffer = await sharp(filePath)
            .rotate() // Auto-rotate based on EXIF
            .resize(MAX_WIDTH, null, {
                withoutEnlargement: true,
                fit: 'inside'
            })
            .jpeg({ quality: QUALITY, mozjpeg: true })
            .toBuffer();

        // Backup original and write optimized
        const backupPath = filePath + '.original';
        await rename(filePath, backupPath);

        // Write the optimized version - need to handle case sensitivity
        // Normalize to .jpg extension
        const ext = extname(filePath);
        let outputPath = filePath;
        if (ext === '.JPG' || ext === '.PNG' || ext === '.JPEG') {
            outputPath = filePath.slice(0, -ext.length) + ext.toLowerCase();
        }

        const { writeFile } = await import('fs/promises');
        await writeFile(outputPath, buffer);

        const newSizeMB = (buffer.length / (1024 * 1024)).toFixed(2);
        const reduction = ((1 - buffer.length / stats.size) * 100).toFixed(0);
        console.log(`  ✓ ${filePath}`);
        console.log(`    ${sizeMB}MB → ${newSizeMB}MB (${reduction}% reduction)`);

        return { skipped: false, originalSize: stats.size, newSize: buffer.length, renamedExt: ext !== extname(outputPath) };
    } catch (err) {
        console.error(`  ✗ ERROR ${filePath}: ${err.message}`);
        return { skipped: true, originalSize: stats.size, newSize: stats.size, error: true };
    }
}

async function main() {
    console.log('🖼️  Portfolio Image Optimizer');
    console.log(`   Directory: ${PORTFOLIO_DIR}`);
    console.log(`   Max width: ${MAX_WIDTH}px, Quality: ${QUALITY}%\n`);

    const files = await getImageFiles(PORTFOLIO_DIR);
    console.log(`Found ${files.length} image files\n`);

    let totalOriginal = 0;
    let totalNew = 0;
    let optimized = 0;
    let skippedCount = 0;
    const renamedFiles = [];

    for (const file of files) {
        const result = await optimizeImage(file);
        totalOriginal += result.originalSize;
        totalNew += result.newSize;
        if (result.skipped) {
            skippedCount++;
        } else {
            optimized++;
            if (result.renamedExt) {
                renamedFiles.push(file);
            }
        }
    }

    console.log('\n📊 Summary:');
    console.log(`   Files processed: ${files.length}`);
    console.log(`   Optimized: ${optimized}`);
    console.log(`   Skipped: ${skippedCount}`);
    console.log(`   Total before: ${(totalOriginal / (1024 * 1024)).toFixed(1)}MB`);
    console.log(`   Total after:  ${(totalNew / (1024 * 1024)).toFixed(1)}MB`);
    console.log(`   Reduction:    ${((1 - totalNew / totalOriginal) * 100).toFixed(0)}%`);

    if (renamedFiles.length > 0) {
        console.log('\n⚠️  Files with uppercase extensions were renamed to lowercase.');
        console.log('   You may need to update code references:');
        renamedFiles.forEach(f => console.log(`     ${f}`));
    }

    console.log('\n💡 Original files backed up with .original extension.');
    console.log('   Delete them after verifying: del /s *.original');
}

main().catch(console.error);
