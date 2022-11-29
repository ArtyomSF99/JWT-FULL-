const bcryptjs = require('bcryptjs')
const uuid = require('uuid')
const db = require('../db')
const mailService = require('./mail_service')
const tokenService = require('./token_serviec')
const UserDto = require('../dtos/user_dto')
const ApiError = require('../exceptions/api_error')

class AuthService {
    async registration(login, password, first_name, last_name, email, phone, region  ){
        try{
             const candidate = await db.query(`SELECT login FROM users WHERE login = $1`, [login])
            
            if(candidate.rows.length !=0){
                throw ApiError.BadRequest("Пользователь c таким email уже существует")
            } 
            const activation_link = uuid.v4();
             const hashPassword = bcryptjs.hashSync(password,7)
             const newPerson = await db.query(`INSERT INTO users (login, password, first_name, last_name, email, phone, region, activate_link) values ($1, $2, $3,$4, $5,$6,$7,$8) RETURNING *`, [login, hashPassword, first_name, last_name,email,phone,region, activation_link])
            
         await mailService.sendActivationMail(login, `${process.env.API_URL}/activate/${activation_link}`)
             const userDto = new UserDto(newPerson.rows[0])
            
            const tokens = tokenService.generateToken({...userDto})
            await tokenService.saveToken(userDto.id, tokens.refreshToken)
          return {...tokens, user: userDto}
               
            
        }
        catch (e){
            console.log(e)

        }
    }
    async activate(activationLink){
        const user = await db.query(`SELECT activate_link FROM users WHERE activate_link = $1`, [activationLink])
        if(!user){
            throw ApiError.BadRequest('Некорректная ссылка активации')
        }
        await db.query(`UPDATE users SET is_activated = $1`,[true])
       
    }
    async login(login, password){
        const user = await db.query(`SELECT * FROM users WHERE login = $1`, [login])
      
            if(user.rows.length == 0){
                throw ApiError.BadRequest("Пользователь c таким Email не найден")
            }
            const validPassword =bcryptjs.compareSync(password, user.rows[0].password)
            if(!validPassword){
                throw ApiError.BadRequest('Введен неправильный пароль')
            }
            const userDto = new UserDto(user.rows[0]);
            const tokens = tokenService.generateToken({...userDto})
            await tokenService.saveToken(userDto.id, tokens.refreshToken)
            return {...tokens, user: userDto}
    }
    async logout(refreshToken){
        const token = await tokenService.removeToken(refreshToken)
        return token
    }
    async refresh(refreshToken){
        if(!refreshToken){
            throw ApiError.UnauthorizedError()
        }
       
        const userData = tokenService.validateRefrshToken(refreshToken)
        
        const tokenFromDB = await tokenService.findToken(refreshToken)
        if(!userData || !tokenFromDB){
            throw ApiError.UnauthorizedError()
        }
        const user = await db.query(`SELECT * FROM users WHERE id = $1`, [userData.id])
        
        const userDto = new UserDto(user.rows[0]);
     
            const tokens = tokenService.generateToken({...userDto})
            await tokenService.saveToken(userDto.id, tokens.refreshToken)
            return {...tokens, user: userDto}
    }
}

module.exports = new AuthService()