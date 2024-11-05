import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    status: false,
    user:null,
    type:null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login:(state,action)=>{
            
            const { user , type } = action.payload;
            state.status = true,
            state.user = user
            state.type = type
        },
        logout:(state)=>{
            state.status = false,
            state.user = null;
            state.type = null;
        }
    },
})
export const { login, logout } = authSlice.actions
export default authSlice.reducer