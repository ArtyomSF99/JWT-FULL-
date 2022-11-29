const db = require('../db')
const jwt = require('jsonwebtoken')
require('dotenv').config()

class TokenService {
    generateToken(payload){
        const accessToken = jwt.sign(payload, process.env.JWT_ACCSESS_SECRET, {expiresIn:'15m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn:'30d'})
      
        return{
            accessToken,
            refreshToken
        }
        
    }

    validateAccsessToken(token){
        try{
            const userData = jwt.verify(token , process.env.JWT_ACCSESS_SECRET)
      
            return userData;
        } catch(e){
           
        }
    }
    validateRefrshToken(token){
        try{    
        
            const userData = jwt.verify(token,process.env.JWT_REFRESH_SECRET)
            return userData;
        } catch(e){
            
        }
    }

    async saveToken(userId, refreshToken) {
        try{
            const tokenData = await db.query(`SELECT user_id FROM token WHERE user_id = $1`, [userId])
            console.log(tokenData.rows[0])
            if(tokenData.rows.length>0){
              
                return await db.query(`UPDATE token SET refresh_token = $1 WHERE user_id = $2 `, [refreshToken,userId])
            }
           
            const token = await db.query(`INSERT INTO token (user_id, refresh_token) values ($1, $2) RETURNING *`, [userId, refreshToken])
            
            return token;
        }catch(e){
            console.log(e)
        }
        
    }

    async removeToken(refreshToken){
        console.log(refreshToken)
        const tokenData = await db.query(`DELETE FROM token WHERE refresh_token = $1`, [refreshToken]);
        return tokenData
    }
    async findToken(refreshToken){
       
        const tokenData = await db.query(`SELECT * FROM token WHERE refresh_token = $1`, [refreshToken]);
        return tokenData
    }
}

module.exports = new TokenService()