const crypto = require('crypto');

function generateJwtSecret() {
  const secretKey = crypto.randomBytes(64).toString('hex');
  console.log('Your JWT Secret Key:', secretKey);
}

generateJwtSecret();
