import { createSlice } from '@reduxjs/toolkit'

const initVal = {
    apartment:null
}

const aprrtmentSlice =createSlice({
    name:"apartment",
    initialState:initVal,
    reducers:{
        updateApartment:(state,action)=>{
            state.apartment = action.payload
        }
    }
})

export const {updateApartment} = aprrtmentSlice.actions
export default aprrtmentSlice.reducer