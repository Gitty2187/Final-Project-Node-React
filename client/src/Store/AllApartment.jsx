import { createSlice } from '@reduxjs/toolkit'

const initVal = {
    Allapartments:null
}

const allApartmentSlice = createSlice({
    name:"Allapartments",
    initialState:initVal,
    reducers:{
        updateAllApar:(state,action)=>{
            state.Allapartments = action.payload
        }
    }
})

export const {updateAllApar} = allApartmentSlice.actions
export default allApartmentSlice.reducer