const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const INPUT_DIR = './assets/sports-images'; 
const OUTPUT_DIR = './targets/widget/Assets.xcassets';

function getImagesRecursively(dir, basePath = '') {
    let results = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const fullPath = path.join(dir, file);
        const relPath = path.join(basePath, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getImagesRecursively(fullPath, relPath));
        } else {
            if (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')) {
                results.push({ fullPath, relPath });
            }
        }
    }
    return results;
}

async function optimizeImages() {
    const files = getImagesRecursively(INPUT_DIR);

    for (const fileObj of files) {
        const { fullPath, relPath } = fileObj;
        const name = path.basename(relPath, path.extname(relPath));
        const relDir = path.dirname(relPath);
        
        const imagesetDir = path.join(OUTPUT_DIR, relDir, `${name}.imageset`);

        // Ordner erstellen
        fs.mkdirSync(imagesetDir, { recursive: true });

        // Ensure intermediate folders in xcassets have a basic Contents.json for Xcode
        let currentDir = '';
        if (relDir !== '.') {
            const parts = relDir.split(path.sep);
            for (const dirPart of parts) {
                currentDir = path.join(currentDir, dirPart);
                const absoluteDir = path.join(OUTPUT_DIR, currentDir);
                const contentsPath = path.join(absoluteDir, 'Contents.json');
                
                // We overwrite it to ensure provides-namespace is set
                fs.writeFileSync(
                    contentsPath, 
                    JSON.stringify({ 
                        info: { author: "xcode", version: 1 },
                        properties: { "provides-namespace": true }
                    }, null, 2)
                );
            }
        }

        // Bild optimieren und kopieren
        await sharp(fullPath)
            .resize(400, null, { withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toFile(path.join(imagesetDir, `${name}.jpg`));

        // Contents.json erstellen
        const contents = {
            images: [
                { filename: `${name}.jpg`, idiom: "universal", scale: "1x" },
                { idiom: "universal", scale: "2x" },
                { idiom: "universal", scale: "3x" }
            ],
            info: { author: "xcode", version: 1 }
        };

        fs.writeFileSync(
            path.join(imagesetDir, 'Contents.json'),
            JSON.stringify(contents, null, 2)
        );

        console.log(`✅ ${relPath}`);
    }

    console.log(`\nDone — ${files.length} images optimized`);
}

optimizeImages().catch(console.error);