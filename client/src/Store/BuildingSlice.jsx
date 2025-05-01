import { createSlice } from '@reduxjs/toolkit'

const initVal = {
    building:null
}

const buildingSlice =createSlice({
    name:"building",
    initialState:initVal,
    reducers:{
        updateBuild:(state,action)=>{
            state.building = action.payload
        }
    }
})

export const {updateBuild} = buildingSlice.actions
export default buildingSlice.reducer