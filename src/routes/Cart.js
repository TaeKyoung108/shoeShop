import Table from 'react-bootstrap/Table';
import { useDispatch, useSelector } from 'react-redux';
import { changeName, addAge } from '../store/userSlice';
import { changeCount } from '../store';
import { useState, memo } from 'react';

let Child = memo( function(){
    console.log('재랜더링됨')
    return <div>자식임</div>
})

function Cart(){

    let reduxState = useSelector((state)=>{return state});
    // let reduxStateStock = useSelector((state)=>{return state.stock});

    let cart = useSelector((state)=>state.cart);
    let dispatch = useDispatch();

    let [count,setCount] = useState(0);

    return(
        <div>
            {/* <Child></Child>
            <button onClick={
                    ()=>{setCount(count+1)}
                }>+</button> */}

            <h4>{reduxState.user.name}의 장바구니</h4>
            {/* <button onClick={()=>{dispatch(addAge(10))}}>버튼</button> */}
            <Table>
            <thead>
                <tr>
                <th>#</th>
                <th>상품명</th>
                <th>수량</th>
                <th>변경하기</th>
                </tr>
            </thead>
            <tbody>
                {
                    cart.map((eachCart,i)=>{
                        return(
                            <tr key={eachCart.id}>
                                <td>{eachCart.id}</td>
                                <td>{eachCart.name}</td>
                                <td>{eachCart.count}</td>
                                <td><p><span style={{marginLeft : '10px', marginRight : '10px', fontSize : '25px', cursor : 'pointer', userSelect : 'none'}} onClick={()=>{
                                    dispatch(changeCount({id : eachCart.id,upDown : true}))
                                }}>+</span>/<span style={{marginLeft : '10px', marginRight : '10px', fontSize : '25px', cursor : 'pointer', userSelect : 'none'}} onClick={()=>{
                                    dispatch(changeCount({id : eachCart.id,upDown : false}))
                                }}>-</span></p></td>
                            </tr>
                        )
                    })
                }
            </tbody>
            </Table>
        </div>
    )
}

export default Cart;