const fs = require('fs');

let content = fs.readFileSync('src/data/initialSeedData.ts', 'utf8');

const regexMap = [
  { prefix: 'bestSmartphones', slug: 'smartphones' },
  { prefix: 'bestLaptops', slug: 'laptops' },
  { prefix: 'bestEarbuds', slug: 'audio' }, // using 'audio' because that's the category
  { prefix: 'bestSmartwatches', slug: 'wearables' },
  { prefix: 'bestPowerbanks', slug: 'accessories' },
  { prefix: 'bestMonitors', slug: 'monitors' }
];

for (const {prefix, slug} of regexMap) {
  const re = new RegExp(`\\s*${prefix}: true,\\n\\s*${prefix}Order: (\\d+),\\n\\s*${prefix}Label: '(.*?)'`, 'g');
  content = content.replace(re, (match, order, label) => {
    return `\n    bestRankings: [{ categorySlug: '${slug}', rank: ${order}, label: '${label}' }]`;
  });
}

fs.writeFileSync('src/data/initialSeedData.ts', content);
