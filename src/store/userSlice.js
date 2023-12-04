import { createSlice } from "@reduxjs/toolkit";



let user = createSlice({   //useState 역할
    name : 'userName',
    initialState : { name : 'MaceRem', age : 20},
    reducers : {
        changeName(state){
            state.name = 'park'
        },
        addAge(state, action){
            state.age+=action.payload;
        }
    }
})

export let {changeName, addAge} = user.actions

export default user