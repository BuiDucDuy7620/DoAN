import db from "../models/index";
import bcrypt from 'bcryptjs'; 

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    })
}

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};

            let isExist = await checkUserEmail(email);
            if (isExist) {
                //user ton tai
                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password', 'firstName', 'lastName'],
                    where: { email: email }, 
                    raw: true,
                    
                });
                if (user) {
                    //compare password
                    let check = await bcrypt.compareSync( password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'Ok';
                        delete user.password;
                        userData.user = user;

                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User's not found`;
                }
                
            } else {
                //return error 
                userData.errCode = 1;
                userData.errMessage = `Your's Email isn't exist in your system. Please try other Email!`;               
            }
            resolve(userData);
        }catch(e){
            reject(e);
        }
    })
}


let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail}
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude:['password']
                    }
                })
            } if(userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude:['password']
                    }
                    
                })
            }
            resolve(users)

        } catch (e) {
            reject(e);
        }
    })
}

let handleUserRegister = (data) => {
    return new Promise( async (resolve, reject) => {
        try {
            //check email cos ton tai khong ???
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Email da duoc su dung. Vui long su dung email khac'
                })
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                })
                resolve({
                    errCode: 0,
                    errMessage:'OK'
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

let createNewUser = (data) => {
    return new Promise( async (resolve, reject) => {
        try {
            //check email cos ton tai khong ???
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Email da duoc su dung. Vui long su dung email khac'
                })
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.avatar
                })
                resolve({
                    errCode: 0,
                    errMessage:'OK'
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let foundUser = await db.User.findOne({
            where: { id: userId}
        })
        if(!foundUser) {
            resolve({
                errCode: 2,
                errMessage: `The user isn't exist`
            })
        }
        await db.User.destroy({
            where: { id: userId}
        })
        resolve({
            errCode: 0,
            errMessage: `The user is delete`
        })
    })
}

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.roleId || !data.positionId || !data.gender) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameter!'
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.phoneNumber = data.phoneNumber;
                user.gender = data.gender;
                user.positionId = data.positionId;
                user.roleId = data.roleId;
                if (data.avatar) {
                    user.image = data.avatar;
                }
                
                await user.save();
                // await db.User.save({
                //     firstName: data.firstName,
                //     lastName: data.lastName,
                //     address: data.address,
                // }, { where: { id: userId} })
                resolve({
                    errCode: 0,
                    errMessage:"Sua thanh cong" ,
                    
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage:"Khong tim thay user",
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where: {type: typeInput}
                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res);
            }           
        } catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    handleUserLogin: handleUserLogin,
    handleUserRegister: handleUserRegister,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
    getAllCodeService: getAllCodeService,
}