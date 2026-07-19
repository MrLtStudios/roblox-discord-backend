const express = require("express");


const app = express();


app.use(express.json());



const PORT = process.env.PORT || 3000;



const DISCORD_WEBHOOK =
process.env.DISCORD_WEBHOOK;






app.post("/report", async(req,res)=>{


	const body = req.body;



	console.log(
		"Report:",
		body
	);




	try{


		await fetch(DISCORD_WEBHOOK,{


			method:"POST",


			headers:{

				"Content-Type":
				"application/json"

			},


			body:JSON.stringify({


				embeds:[


					{


						title:
						"⚠ Toxic Chat Detected",



						color:
						16711680,



						fields:[


							{

								name:
								"Player",

								value:
								body.player || "Unknown"

							},



							{

								name:
								"Display Name",

								value:
								body.displayName || "Unknown"

							},



							{

								name:
								"User ID",

								value:
								String(body.userid)

							},



							{

								name:
								"Message",

								value:
								body.message

							},



							{

								name:
								"Detected",

								value:
								body.detected

							},



							{

								name:
								"Server JobId",

								value:
								body.jobId

							}



						],



						timestamp:
						new Date().toISOString()


					}


				]


			})


		});



		res.sendStatus(200);



	}catch(err){


		console.log(
			"Discord Error:",
			err
		);


		res.sendStatus(500);


	}


});






app.get("/",(req,res)=>{


	res.send(
		"Roblox Moderation Backend Online"
	);


});






app.listen(PORT,()=>{


	console.log(
		"Backend running on port",
		PORT
	);


});
