module.exports = class UserDto {
    login;
    id;
    first_name;
    last_name;
    email;
    phone;
    region;
    is_activated;

    constructor(model){
        this.login = model.login;
        this.id = model.id;
        this.first_name = model.first_name;
        this.last_name = model.last_name;
        this.email = model.email;
        this.phone = model.phone;
        this.region = model.region;
        this.is_activated = model.is_activated;
    }
}