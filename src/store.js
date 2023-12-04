import { configureStore, createSlice } from '@reduxjs/toolkit'
import user from './store/userSlice'


let stock = createSlice({
    name : 'stock',
    initialState : [10,11,12]
})

let cart = createSlice({
    name : 'cart',
    initialState : [
        {id : 0, name : 'White and Black', count : 2},
        {id : 2, name : 'Grey Yordan', count : 1}] ,
    reducers : {
        changeCount(state, action){
            let {id,upDown}= action.payload;
            let target = state.find((x)=>x.id===id)
            console.log(id+" "+upDown)
            if(target){
                if(upDown){
                    state.find((x)=>x.id===id).count+=1;
                }
                else{
                    state.find(x=>x.id===id).count-=1;
                }
            }
        },
        addItem(state, action){
            let addTarget = action.payload;
            let isTarget = state.find((x)=>x.id==addTarget.id);
            if(isTarget){
                isTarget.count+=addTarget.count;
            }
            else{
                state.push(action.payload)
            }
        }

    }
    
})

export let {changeCount, addItem} = cart.actions
export default configureStore({
  reducer: {
    user : user.reducer,
    stock : stock.reducer,
    cart : cart.reducer
  }
}) 