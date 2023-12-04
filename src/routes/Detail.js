import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import { useDispatch } from "react-redux";
import { addItem } from "../store";

//Context1 가져오는 부분
// import { Context1 } from "./../App";

//예전에 컴포넌트 만들던방법
class Detail2 extends React.Component{
    componentDidMount(){ //컴포넌트 mount시 여기 코드 실행됨

    }
    componentDidUpdate(){//컴포넌트 update시 실행

    }
    componentWillUnmount(){//컴포넌트 unMount 즉 종료될때

    }
}


let Btn = styled.button`
    background : ${props=>props.bg};
    color: ${props=>props.bg=='white'?'black':'white'};
    padding : 10px;
    margin-top : 5px;
    border : 1px solid #dc3545;
    border-radius : 0.375rem;
    padding: 8px 18px;  
    font-size: 14px;
    font-weight : 500;
    font-family : 'NanumGothicCoding';
`
let NewBtn = styled.button(Btn);

let Box = styled.div`
    background : grey;
    padding : 20px;
`

function Detail(props){

    //hook 다는법
    //Detail 컴포넌트가 mount(실행) 되거나 update시 여기 부분 코드 실행
    // useEffect는 renderint(html 로드가 끝나고)이 다되고 실행됨
    //      그래서 장점은 연산이 오래걸릴떄 로딩이 오래걸리는 그런문제 해결
    //      그래서 타이머, 어려운 연산, 서버에서 데이터 가져오는 작업등을 여기서 수행 



    //이런 context는 별로 좋지 않음
    // let {shoesStock, shoes} = useContext(Context1);
    // console.log(shoesStock)


    
    let [alert, setAlert] = useState(true); //위에 2초경고창
    let [count, setCount] = useState(1);    //입력수량
    let [countAlert, setCountAlert] = useState(false);  //입력수량 올바른지 (숫자인지)

    let [tab,setTab]= useState(0);

    let [orderComplete, setOrderComplete] = useState(false);


    let [fade2, setFade2] = useState('')

    let dispatch = useDispatch();

    useEffect(()=>{
        setFade2('end')
        return ()=>{
        setFade2('')
        }
    },[])
    
    useEffect(()=>{
        // 2번 실행되는것처럼 보이는건 테스트상에서만 그런것
        // 없애는법은 <React.StrictMode> 를 index.js에서 제거하거나해야함


        let timeDealTimer = setTimeout(()=>{setAlert(false)},2000)
        
        //이안에서 return() => {코드~~0} 작성시 useEffect 동작전에 실행됨
        // 만약 위 연산 전에 미리 코드 실행 원할때 작성 가능
        return()=>{
            //쓰레기들이 생기면 자주 랜더링될때 데이터낭비가 일어나는데
            //그걸 해결하기 위해 기존 타이머 등 제거할때 사용
            setAlert(true);
            clearTimeout(timeDealTimer);
        }
        
    },[])//뒤에 들어간 대상이 변할때만 실행되게 할수있음. 
    //만약 count빼고 빈칸으로 해놓으면 mount될때 1회만 실행되게 가능
    useEffect(()=>{
        isNaN(count)?setCountAlert(true):setCountAlert(false);
        
        console.log("count : "+count)
    },[count])


    useEffect(()=>{

        let alertTimer = setTimeout(()=>{setOrderComplete(false)},3000)
        
        //이안에서 return() => {코드~~0} 작성시 useEffect 동작전에 실행됨
        // 만약 위 연산 전에 미리 코드 실행 원할때 작성 가능
        return()=>{
            clearTimeout(alertTimer);
        }
        
    },[orderComplete])//뒤에 들어간 대상이 변할때만 실행되게 할수있음. 



    let {id}= useParams();
    let target = props.shoes.find(function(x){
        return x.id == id
    });

    useEffect(()=>{
        let watchedData = JSON.parse(localStorage.getItem('watched'))
        if(watchedData){
            watchedData=watchedData.filter(id=>id!=target.id)
        }
        watchedData.push(target.id);
        if(watchedData.length>5){
            watchedData= watchedData.slice(-5)
        }
        localStorage.setItem('watched',JSON.stringify([...new Set(watchedData)]));


        // localStorage.setItem('watched',JSON.stringify([...new Set(watchedData)]));
        console.log('1 : '+watchedData)
        
    },[])
    return(
        <>
        <div className={`container start ${fade2}`}>
            {/* {
                alert==true?
                <TimeDeal/>:
                null
            } */}
            

        

            {/* <Btn bg = '#dc3545' onClick={()=>{}}>버튼</Btn> */}
            <div className="row">
            {
                orderComplete==true?
                <Alert alertText='주문 완료'></Alert>:
                null
            }
        
            <div className="col-md-6">
                <img src={'https://codingapple1.github.io/shop/shoes'+(Number(id)+1)+'.jpg'} width="100%" />
            </div>
            <div className="col-md-6">
                <h4 className="pt-5">{target.title}</h4>
                <p>{target.content}</p>
                <p>{target.price}</p>
                {/* {
                    countAlert==true?<Alert alertText="숫자만 입력하세요"></Alert>:<Alert hidden={true}/>
                } */}
                <div className="d-flex align-items-center" style={{justifyContent : 'center',marginBottom : '30px'}}>
                    <Button variant="outline-primary" style={{width : '55px'}} onClick={()=>{
                        if(count>1){
                            setCount(count-1)
                        }
                        }}><span style={{userSelect : 'none', cursor : 'pointer',fontSize : '20px',fontWeight : '800'}}>-</span></Button>
                    <Form.Control  
                        value={count} 
                        style={{maxWidth : '100px',textAlign : 'center'}}
                        onChange={(e)=>{
                            let newCount = parseInt(e.target.value, 10); // 숫자로 변환
                            if (!isNaN(newCount)) {
                                setCount(newCount); // 유효한 숫자일 때만 상태 업데이트
                            }
                        }}  
                        />
                    <Button variant="outline-primary" style={{width : '55px'}} onClick={()=>{setCount(count+1)}}><span style={{userSelect : 'none', cursor : 'pointer', fontSize : '20px',fontWeight : '800'}}>+</span></Button>
                </div>
                
             
                <button className="btn btn-danger" onClick={()=>{
                    setOrderComplete(true)
                    dispatch(addItem( {id : target.id, name : target.title, count : count} ))
                }}>주문하기</button>
                
            </div>
            <DetailTab tab={tab} setTab={setTab}></DetailTab>
            </div>
        </div> 
        </>
    )
}

function TimeDeal(props){
    return(
        <div className="alert alert-warning">
                2초 이내 구매시 할인
            </div>
    )
}

function Alert(props){
    return(
        <div className="alert alert-warning" style={{ alignItems: 'center', justifyContent: 'center', width : '100%',display : 'flex',zIndex: '999', visibility: props.hidden ? 'hidden' : 'visible' }}>
                {props.alertText||"경고"}
            </div>
    )
}

function TabContent({tab}){ //이런식으로 props 안쓸경우 {}로 표현 가능 ->이름 보낸거랑 똑같이
    // if(tab==0){
    //     return <div className="start end">내용0</div>
    // }
    // else if(tab==1){
    //     return <div className="start end">내용1</div>
    // }
    // else if(tab==2){
    //     return <div className="start end">내용2</div>
    // }

    let [fade,setFade] = useState('');
    useEffect(()=>{
        let timer = setTimeout(()=>{setFade('end')},100)
        return()=>{
            setFade('')
            clearTimeout(timer)
        }
        

    },[tab])

    return (<div className={`start ${fade}`}>
        {[<div>내용0</div>, <div>내용1</div>, <div>내용2</div>][tab]}
    </div>)
}

function DetailTab(props){
    
    return(
        <>
            <Nav fill variant="tabs"  defaultActiveKey="link0" style={{marginTop : '50px'}}>
                <Nav.Item >
                <Nav.Link eventKey="link0" onClick={()=>{props.setTab(0)}}>버튼0</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                <Nav.Link eventKey="link1" onClick={()=>{props.setTab(1)}}>버튼1</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                <Nav.Link eventKey="link2" onClick={()=>{props.setTab(2)}}>버튼2</Nav.Link>
                </Nav.Item>
            </Nav>
            <TabContent tab={props.tab}/>
            
        </>
        
    )
}

export default Detail;