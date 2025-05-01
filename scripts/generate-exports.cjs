const fs = require('fs');
const path = require('path');

// Define paths
const cjsDir = path.resolve(__dirname, '../dist/cjs/formulas');
const esmDir = path.resolve(__dirname, '../dist/esm/formulas');
const pkgPath = path.resolve(__dirname, '../package.json');

// Get all JavaScript files in the ESM directory
const files = fs.readdirSync(esmDir).filter(file => file.endsWith('.js'));

// Initialize the exports field with the default index file
const exportsField = {
  '.': {
    require: './dist/cjs/index.cjs',
    import: './dist/esm/index.js',
  },
};

// Add entries for other files dynamically
files.forEach(file => {
  const name = `./${path.basename(file, '.js')}`;
  exportsField[name] = {
    require: `./dist/cjs/formulas/${file.replace('.js', '.cjs')}`,
    import: `./dist/esm/formulas/${file}`,
  };
});

// Read, update, and write the package.json file
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
pkg.exports = exportsField;

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
console.log('Updated exports in package.json');