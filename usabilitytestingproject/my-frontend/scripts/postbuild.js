const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'build', 'index.html');

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading index.html:', err);
    return;
  }

  const updatedData = data.replace(
    '<head>',
    '<head>\n    <meta name="csrf-token" content="{{ csrf_token }}">'
  );

  fs.writeFile(filePath, updatedData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing index.html:', err);
    } else {
      console.log('CSRF meta tag added to index.html');
    }
  });
});
