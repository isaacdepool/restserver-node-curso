// =============
//   Puerto
// =============

process.env.PORT = process.env.PORT || 3000;

//===================
//   ENTORNO
//===================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===================
//   BDD
//===================
let urlDB; 

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost/cafe';

}else{
    urlDB = 'mongodb+srv://isaacdepool:a17PQfgaBg1A2Qtp@cluster0.xujz2.mongodb.net/cafe'
}

process.env.URLDB = urlDB;

