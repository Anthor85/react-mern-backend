const jwt = require('jsonwebtoken');

const generarJWT = ( uid, name) => {

  return new Promise( (resolve, reject) => {
    const payload = { uid, name };

    jwt.sign( payload, process.env.SECRET_JWT_SEED, {
      expiresIn: '2h'
    }, (err, token) => {
      if (err) {
        console.error(err);
        reject('No se pudo generar el JWT');
      } else {
        resolve(token);
      }
    });
  })
}

module.exports = {
  generarJWT
}