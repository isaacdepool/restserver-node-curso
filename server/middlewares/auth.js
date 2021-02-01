const jwt = require('jsonwebtoken');

// ==================
//   Verificar token
// ==================

let verificarToken = (req, res, next) =>{

    let token = req.get('auth');

    jwt.verify( token, process.env.SEED_token, (err, decoded) =>{ 

        if(err){
            return res.status(401).json({
                ok: false,
                err:{
                    message: 'Toquen no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });

};

// ==================
//   Verificar Admin_role
// ==================

let verificarAdmin_Role = (req, res, next) =>{

    let usuario = req.usuario;
    console.log(usuario.role);

    if(usuario.role === 'ADMIN_ROLE'){
        next();
    }else{
        
       return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }

}

module.exports= {
    verificarToken,
    verificarAdmin_Role
}