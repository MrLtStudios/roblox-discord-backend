const express = require("express");

const app = express();

app.use(express.json());


const PORT = process.env.PORT || 3000;


const WEBHOOK = process.env.DISCORD_WEBHOOK;



app.post("/report", async(req,res)=>{


const body = req.body;


try{


await fetch(WEBHOOK,{

method:"POST",

headers:{
"Content-Type":"application/json"
},


body:JSON.stringify({

embeds:[

{

title:"⚠ Toxic Chat Detected",

color:16711680,


fields:[

{
name:"Player",
value:body.player
},


{
name:"User ID",
value:String(body.userid)
},


{
name:"Message",
value:body.message
},


{
name:"Server JobId",
value:body.jobId
}

],


timestamp:new Date()

}

]

,


components:[

{

type:1,


components:[

{

type:2,

style:5,

label:"Join Server",

url:

`https://roblox-discord-backend-lieu.onrender.com/join?place=${body.placeId}&job=${body.jobId}`


}

]

}

]


})


});


res.sendStatus(200);


}catch(err){

console.log(err);

res.sendStatus(500);

}


});





app.get("/join",(req,res)=>{


const place = req.query.place;

const job = req.query.job;



const robloxLink =

`roblox://experiences/start?placeId=${place}&gameInstanceId=${job}`;



res.send(`

<h1>Joining Roblox Server...</h1>

<a href="${robloxLink}">
Click here if Roblox did not open
</a>


<script>

window.location.href="${robloxLink}";

</script>


`);



});





app.listen(PORT,()=>{

console.log("Backend running");

});
