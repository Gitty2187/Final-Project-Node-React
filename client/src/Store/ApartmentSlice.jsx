import { createSlice } from '@reduxjs/toolkit'

const initVal = {
    apartment:{}
}

const aprrtmentSlice =createSlice({
    name:"apartment",
    initialState:initVal,
    reducers:{
        updateApartment:(state,action)=>{
            console.log(action.payload);
            
            state.apartment = action.payload
            console.log(state.apartment);
        }
    }
})

export const {updateApartment} = aprrtmentSlice.actions
export default aprrtmentSlice.reducer