import { createSlice } from '@reduxjs/toolkit'

const initVal = {
    building:{}
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