// =============
//   Puerto
// =============

process.env.PORT = process.env.PORT || 3000;

//===================
//   ENTORNO
//===================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=====================
//   Vencimiento Token
//=====================
// 60s
// 60min
// 24h
// 30D

process.env.Caducidad_token = '48h';


//===================
//   SEED de aut
//===================

process.env.SEED_token = process.env.SEED_token || 'secret-desarrollo';

//===================
//   BDD
//===================
let urlDB; 

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost/cafe';

}else{
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//===================
//   GOOGLE CLIENT ID
//===================

process.env.CLIENT_ID = process.env.CLIENT_ID || '383086674284-5an0nhjqihjjqe1cvkdv0qr88g1pc4bk.apps.googleusercontent.com';