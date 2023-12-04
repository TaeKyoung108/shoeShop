import logo from './logo.svg';
import { createContext, lazy,Suspense, useEffect, useState,useTransition } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button,Navbar,Container,Nav,Row,Col } from 'react-bootstrap';
import shoesData from './data.js';
import {Routes, Route, Link, useNavigate, Outlet, json}from 'react-router-dom'

import axios from 'axios';

import { useQuery } from 'react-query';


// import Detail from './routes/Detail.js';
// import Cart from './routes/Cart.js';
// 필요할때 로딩하게 만듬
// 단점 : Cart 나 Detail 페이지 접속 시 로딩 시간 필요
const Detail = lazy(()=>import('./routes/Detail.js'));
const Cart = lazy(()=>import('./routes/Cart.js'))


export let Context1 = createContext(); //state 보관함

function App() {

  useEffect(()=>{
    if(!localStorage.getItem('watched')){
      
      localStorage.setItem('watched',JSON.stringify([]))
    }
  },[])

  // let obj = {name : 'kim'}
  // // 로컬스토리지에 array나 obj에 넣는 방법
  // localStorage.setItem('data',JSON.stringify(obj));

  //다시 꺼내는 방법
  // let 꺼낸거 = localStorage.getItem('data');
  // console.log(JSON.parse(꺼낸거))
  
  let [shoes,setShoes] = useState(shoesData);
  let [shoesStock,setShoesStock] = useState([10,11,12]);
  let [clickTime,setClickTime] = useState(0);
  let navigate = useNavigate();



  // axios.get('https://codingapple1.github.io/userdata.json').then((result)=>{
  //   console.log(result.data)
  // })

  // useQuery 장점 : 성공/실패/로딩중 쉽게 파악 가능
  let result = useQuery('getUserData',()=>{
    return axios.get('https://codingapple1.github.io/userdata.json').then((result)=>{
      // console.log(result.data)
      console.log('요청됨')
      return result.data
    })
    // ,{staleTime : 2000}  //몇초간격으로 refetch할지 정할 수 있음
  })
  // console.log(result.data)   //ajax 요청 성공시 데이터 담겨있음
  // console.log(result.isLoading)  //ajax요청이 로딩(요청)중일때 true로 나옴
  // console.log(result.error)    //ajax요청 실패시 true로 나옴

  let [name, setName] = useState('');
  let [isPending, startTransition] = useTransition(); //이녀석으로 성능저하 일으키는 (state 변경 부분같은거=>예시 내용이 state에 연관된 데이터가 10000개이니까)
  return (
    <div className="App">
       {/* <Button variant="primary">Primary</Button>{' '} */}
      
       <Navbar bg="light" variant='light' className='shopNavBar'>
        <Container>
          <Navbar.Brand href="/">GoodsShop</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={()=>{navigate('/')}}>Home</Nav.Link>
            {/* <Nav.Link onClick={()=>{navigate('/detail')}}>detail</Nav.Link> */}
            <Nav.Link onClick={()=>{navigate('/cart')}}>Cart</Nav.Link>
            <Nav.Link onClick={()=>{navigate('/event')}}>event</Nav.Link>
          </Nav>
          <Nav className='ms-auto'>
            {/* {result.isLoading?'로딩중입니다':result.data.name} */}
            {result.isLoading&&'로딩중'}
            {result.error&&'에러남'}
            {result.data&&result.data.name}
          </Nav>
        </Container>
      </Navbar>

      {name}
      <input onChange={(e)=>{startTransition(()=>{setName(e.target.value)})}}></input>

      {/* <Link to={'/'}>홈</Link>
      <Link to={'/detail'}>상세페이지</Link> */}
      <Suspense>
        <Routes>
          <Route path='/' element={
            <>
            <MainPage shoes={shoes} setShoes={setShoes} clickTime={clickTime} setClickTime={setClickTime} navigate={navigate}></MainPage>
          </>}/>
          <Route path='/detail/:id' element={
            // <Context1.Provider value={{shoesStock, shoes}}> 
            <Suspense>
              <Detail shoes={shoes}/>
            </Suspense>
            // </Context1.Provider>
          }/>
          <Route path='/about' element={<About></About>}>
            <Route path='member' element={<div>멤버임</div>}/>
            <Route path='location' element={<About/>}/>
          </Route>
          <Route path='*' element={<div>없는 페이지임</div>}/>
          <Route path='/event' element={<EventPage/>}>
            <Route path='one' element={<p>첫 주문시 양배추즙 서비스</p>}/>
            <Route path='two' element={<p>생일기념 쿠폰 받기</p>}/>
          </Route>
          <Route path='/cart' element={
          // <Suspense>
            <Cart></Cart>
          // </Suspense>
        }>

          </Route>
        </Routes>
        </Suspense>
    
      
    </div>
  );
}



function Card(props){
  
  return(
    <Col key={props.eachShoe.id} onClick={()=>{


      props.navigate('/detail/'+props.eachShoe.id)

      }} style={{cursor :'pointer', userSelect : 'none'}}>
      <img src={`https://codingapple1.github.io/shop/shoes${props.eachShoe.id+1}.jpg`} width={"80%"} />
      <h4>{props.eachShoe.title}</h4>
      <p>{props.eachShoe.content}</p>
    </Col>
  )
}

//현재는안쓰는 부분
function CardCase(props) {
  console.log("component 시작")
  const n = 3; 

  let groups = [];
  for (let i = 0; i < props.shoes.length; i += n) {
    groups.push(props.shoes.slice(i, i + n));
  }
  console.log(groups)

  return (
    <>
        {
          groups.map((group, groupIndex) => (
            <Row key={groupIndex}>
              {
                group.map((eachShoe, i) => (
                  <Card eachShoe={eachShoe} navigate={props.navigate} key={i} />
                ))
              }
            </Row>
          ))
        }
    </>
  );
  
}
function MainPage(props){

  let itemsPerGroup = 3;
  let [showMorebtnOn,setShowMorebtnOn] = useState(true);
  useEffect(()=>{
    if(props.clickTime>1){
      setShowMorebtnOn(false);
    }
  },[props.clickTime])
  return(
    <>
      <div className='main-bg'>
      </div>
      <Container>
        {
          // <CardCase shoes={props.shoes} navigate={props.navigate}></CardCase>
        } 
        <Row sm={3}>
          {props.shoes.map((eachShoe,i) =>{
            return(
              <Card eachShoe={eachShoe} navigate={props.navigate}></Card>
            )
          })}
        
        
          {/* <img src={process.env.PUBLIC_URL + '/logo192.png'} width={"80%"}></img>
          <img src='https://codingapple1.github.io/shop/shoes1.jpg' width={"80%"}></img> */}
        </Row>
        {
          showMorebtnOn?(
            <button onClick={()=>{
              axios.get(`https://codingapple1.github.io/shop/data${props.clickTime+2}.json`)
              .then((result)=>{
                console.log("추가 데이터 확인");
                let copy = [...props.shoes,...result.data];
                props.setShoes(copy);
                props.setClickTime(props.clickTime+1);
                console.log("clicktime 업 실행 "+props.clickTime)
                
                
                //또는 
                //copy 생략하고
                //setShoes(shoes.concat(result.data))
          
              })
              .catch(()=>{
                console.log('실패');
              })
            }}>상품 더보기</button>
          ):null
          
        }
      
        
      </Container>
    </>
  )
}

function About(){
  return(
    <div>
      <h4>회사정보임</h4>
      <Outlet></Outlet>
    </div>
  )
}

function EventPage(){
  return (
    <div>
      <h4>오늘의 이벤트</h4>
      <Outlet></Outlet>
    </div>
  )
} 

export default App;
