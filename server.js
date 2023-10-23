const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
const{MongoClient, ObjectId} = require('mongodb');
app.use(express.static(__dirname + '/public'))
let db;
const url =`mongodb+srv://admin:qwe1234@cluster0.5lmfgcd.mongodb.net/`

new MongoClient(url).connect().then((client)=>{
    db=client.db("CodingApple");
    console.log('DB 연결완료');
    app.listen(8080,()=>{
        console.log('8080번호에서 서버 실행 중')
    })
}).catch((error)=>{
    console.log(error)
})

//listen (서버띄울 포트번호, 띄운 후 실행할 코드)
//port? 컴퓨터에는  외부와 네트워크를 통신을 하기 위한 6만개의 구멍이 있음. 그 중에 8080을 통해서 들어오는 사람들은 콘솔창을 볼 수 있음

//요청을 처리하는 기계 제작하기 
//  /pet 으로 GET 요청을 하면 펫상품들을 보여줌
// app.get('/pet',function(req,res){
//     res.send('펫용품 쇼핑할 수 있는 페이지입니다.')
// })
// app.get('경로',function(요청,응답){ 응답 .send('') });
// 고객 (client) : 주소창에 URL을 입력해서 서버에 GET요청을 할 수 있음
// 서버(server) : 누군가 /pet으로 들어오면 xx를 보내주세요~ 라고 코드 짬
// app.get('/beauty',function(req,res){
//     res.send('뷰티용품 쇼핑할 수 있는 페이지입니다.')
// })
//.get() 여러개로 경로를 많이 생성가능


app.get('/',(req,res)=>{
    res.sendFile(__dirname +'/page/index.html')
})
// .sendFile(보낼파일경로)

app.get('/about',(req,res)=>{
    res.sendFile(__dirname +'/page/about.html')
    // db.collection("TodoApp").insertOne({
    //     title:"오늘의 할일",
    //     desc:"자기소개서 수정하기"
    // }) => about 페이지를 새로고침 할 때마다 데이터가 추가됨
})

app.get("/view/:id",async(req,res)=>{
    const result = await db.collection("TodoApp").findOne({
        _id: new ObjectId(req.params.id) //내가 찾는 id는 오브젝트 id 찾는걸  받는다
    }) 
    console.log(result);
    res.render("view.ejs",{ 
        data : result
    }); 
})

app.get('/list', async(req,res)=>{ 
    const result = await db.collection("TodoApp").find().toArray(); 
    console.log(result[0]);
    res.render("list.ejs",{ 
        data : result 
        //전체 데이터를 가져와서 보내주기 위해서 array로 담아서 object 형태로 보내줌
    }); //props로 데이터를 보냄

})


app.get('/write',(req,res)=>{
    res.render('write.ejs')//write 페이지 라우트
})
//몽고DB에서 데이터를 도큐먼트 단위로 입력, 도큐먼트는 JSON형태의 데이터로 구성됨
//데이터를 삽입하는 방법 1.insert 2.insertOne(단일 도큐먼트) 3.inserMany(다수 도큐먼트)
app.post('/add',async(req,res)=>{
    console.log(req.body)
    try{await db.collection("TodoApp").insertOne({ 
        title: req.body.title,
        desc:req.body.desc
    })
    }catch(error){
        console.log(error)
    }
    res.redirect('/list') // try,catch문이 끝나면 URL의 경로를 /list 로 재설정해줌
})

app.put('/edit',async(req,res)=>{
    //  수정하는 방법 updateOne({문서},{
    //     $set : {원하는 키 : 변경값}
    // })
    console.log(req.body)
    await db.collection("TodoApp").updateOne({
        _id: new ObjectId(req.body._id)
    },{
        $set :{
            title: req.body.title,
            desc: req.body.desc
        }
    })
    const result = "";
    // res.send(result)
    res.redirect('/list')
})

app.get('/edit/:id',async(req,res)=>{ 
    const result = await db.collection("TodoApp").findOne({
        _id: new ObjectId(req.params.id) 
    }) 
    res.render('edit.ejs',{
       data:result
    }) 

})