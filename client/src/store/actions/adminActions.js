import actionTypes from './actionTypes';
import { getAllCodeService,createNewUserService, getAllUsers, deleteUserService,
    editUserService, getTopDoctorHomeService, getAllDoctorService,
    saveDetailDoctorService, } from '../../services/userService'
import { toast } from "react-toastify";

// export const fetchGenderStart = () => ({
//     type: actionTypes.FETCH_GENDER_START,
// });

export const fetchGenderStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_GENDER_START })
            let res = await getAllCodeService('GENDER')
            if (res && res.errCode === 0) {
                //console.log('getState',getState)
                dispatch(fetchGenderSuccess(res.data));
            } else {
                dispatch(fetchGenderFailed());
            }
        } catch (e) {
            dispatch(fetchGenderFailed());
        }
    }
};

export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData
});

export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAILED,
});

//POSITION
export const fetchPositionStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService('POSITION')
            if (res && res.errCode === 0) {
                dispatch(fetchPositionSuccess(res.data));
            } else {
                dispatch(fetchPositionFailed());
            }
        } catch (e) {
            dispatch(fetchPositionFailed());
        }
    }
}

export const fetchPositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: positionData
})
export const fetchPositionFailed = () => ({
    type: actionTypes.FETCH_POSITION_FAILED
})

//ROLES
export const fetchRoleStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService('ROLE')
            if (res && res.errCode === 0) {
                dispatch(fetchRoleSuccess(res.data));
            } else {
                dispatch(fetchRoleFailed());
            }
        } catch (e) {
            dispatch(fetchRoleFailed());
        }
    }
}

export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData
})
export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED
})

//CREATE-NEW_USER
export const createNewUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await createNewUserService(data);
            if (res && res.errCode === 0) {
                toast.success("Tạo tài khoản thành công");
                dispatch(saveUserSuccess());
                dispatch(fetchAllUsersStart());
            } else {
                dispatch(saveUserFailed());
                toast.error("Lỗi tạo tài khoản");
            }
        } catch (e) {
            dispatch(saveUserFailed());
        }
    }
}

export const saveUserSuccess = () => ({
    type: actionTypes.CREATE_USER_SUCCESS
})

export const saveUserFailed = () => ({
    type: actionTypes.CREATE_USER_FAILED
})

//ALL-USER
export const fetchAllUsersStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllUsers('ALL');
            if (res && res.errCode === 0) {
                dispatch(fetchAllUsersSuccess(res.users.reverse()));
            } else {
                toast.error("Không tìm thấy tài khoản nào");
                dispatch(fetchAllUsersFailed());
            }
        } catch (e) {
            toast.error("Không tìm thấy tài khoản nào");
            dispatch(fetchAllUsersFailed());
        }
    }
}
export const fetchAllUsersSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_USER_SUCCESS,
    users: data
})
export const fetchAllUsersFailed = () => ({
    type: actionTypes.FETCH_ALL_USER_FAILED
})

//DELETE_USER
export const deleteUser = (userId) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteUserService(userId);
            if (res && res.errCode === 0) {
                toast.success("Xóa tài khoản thành công");
                dispatch(saveUserSuccess());
                dispatch(fetchAllUsersStart());
            } else {
                dispatch(saveUserFailed());
                toast.error("Xóa không thành công");
            }
        } catch (e) {
            dispatch(saveUserFailed());
        }
    }
}

export const deleteUserSuccess = () => ({
    type: actionTypes.CREATE_USER_SUCCESS
})

export const deleteUserFailed = () => ({
    type: actionTypes.CREATE_USER_FAILED
})

//EDIT-USER
export const editUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await editUserService(data);
            if (res && res.errCode === 0) {
                toast.success("Cập nhập tài khoản thành công");
                dispatch(editUserSuccess());
                dispatch(fetchAllUsersStart());
            } else {
                dispatch(editUserFailed());
                toast.error("Lỗi cập nhập tài khoản");
            }
        } catch (e) {
            dispatch(editUserFailed());
        }
    }
}

export const editUserSuccess = () => ({
    type: actionTypes.EDIT_USER_SUCCESS
})

export const editUserFailed = () => ({
    type: actionTypes.EDIT_USER_FAILED
})

//TOP-DOCTOR-HOMEPAGE
export const fetchTopDoctor = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getTopDoctorHomeService('')
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTORS_SUCCESS,
                    dataDoctor: res.data
                })
                
            } else {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTORS_FAILED
                })
            }
        } catch (e) {
            console.log(e)
            dispatch({
                type: actionTypes.FETCH_TOP_DOCTORS_FAILED
            })
        }
    }
}

//ALL-DOCTOR-ADMIN
export const fetchAllDoctors = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllDoctorService()
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_SUCCESS,
                    dataDoctors: res.data
                })
                
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_FAILED
                })
            }
        } catch (e) {
            console.log(e)
            dispatch({
                type: actionTypes.FETCH_ALL_DOCTORS_FAILED
            })
        }
    }
}


//CREATE-DETAIL-DOCTOR-ADMIN
export const createDetailDoctors = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await saveDetailDoctorService(data)
            if (res && res.errCode === 0) {
                toast.success("Lưu thông tin bác sĩ thành công");
                dispatch({
                    type: actionTypes.CREATE_DETAIL_DOCTORS_SUCCESS,
                })
                
            } else {
                toast.error("Lỗi lưu thông tin bác sĩ. Vui lòng kiểm tra lại thông tin.");
                dispatch({
                    type: actionTypes.CREATE_DETAIL_DOCTORS_FAILED
                })
            }
        } catch (e) {
            toast.error("Lỗi lưu thông tin bác sĩ. Vui lòng kiểm tra lại thông tin.");
            console.log(e)
            dispatch({
                type: actionTypes.CREATE_DETAIL_DOCTORS_FAILED
            })
        }
    }
}