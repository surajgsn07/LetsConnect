import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    email : null
}

export const emailSlice = createSlice({
    name: 'email',
    initialState,
    reducers: {
        addEmail:(state , action)=>{
            const {email} = action.payload;
            
            state.email = email
        }
    },
})
export const { addEmail } = emailSlice.actions
export default emailSlice.reducer