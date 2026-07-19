const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());


const PORT = process.env.PORT || 3000;


const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;
const HF_TOKEN = process.env.HF_TOKEN;



// ===============================
// AI Toxicity Detection
// ===============================

async function checkToxicity(message)
{

    // Ignore very short messages
    if(message.length < 4)
    {
        return {
            toxic:false,
            score:0,
            label:"Too short"
        };
    }


    try
    {

        const response = await axios.post(

            "https://api-inference.huggingface.co/models/unitary/toxic-bert",

            {
                inputs: message
            },

            {

                headers:
                {
                    Authorization:
                    `Bearer ${HF_TOKEN}`,

                    "Content-Type":
                    "application/json"
                }

            }

        );



        const results = response.data[0];


        let toxicScore = 0;



        for(const item of results)
        {

            if(
                item.label.toLowerCase()
                .includes("toxic")
            )
            {

                toxicScore = item.score;

            }

        }



        return {

            toxic:
            toxicScore >= 0.90,


            score:
            toxicScore,


            label:
            "Toxic"

        };


    }

    catch(error)
    {

        console.log(
            "AI ERROR:",
            error.response?.data ||
            error.message
        );


        return {

            toxic:false,

            score:0,

            label:"AI Error"

        };

    }

}





// ===============================
// Roblox Report Endpoint
// ===============================

app.post("/report", async(req,res)=>{


    const body = req.body;


    if(!body.message)
    {
        return res.sendStatus(400);
    }



    console.log(
        "Received:",
        body
    );



    const ai =
    await checkToxicity(
        body.message
    );



    console.log(
        "AI Result:",
        ai
    );



    // Only send serious detections

    if(ai.toxic)
    {

        try
        {


            const joinURL =
            `https://roblox-discord-backend-lieu.onrender.com/join?place=${body.placeId}&job=${body.jobId}`;



            await axios.post(

                DISCORD_WEBHOOK,

                {

                    embeds:
                    [

                        {

                            title:
                            "⚠ AI Toxic Chat Detection",


                            color:
                            16711680,


                            description:

                            `**Message:** ${body.message}\n\n`+

                            `[🎮 Join Server](${joinURL})`,



                            fields:
                            [

                                {

                                    name:
                                    "Player",

                                    value:
                                    body.player || "Unknown"

                                },


                                {

                                    name:
                                    "User ID",

                                    value:
                                    String(body.userid || "Unknown")

                                },


                                {

                                    name:
                                    "AI Confidence",

                                    value:
                                    Math.round(ai.score * 100)
                                    + "%"

                                },


                                {

                                    name:
                                    "Category",

                                    value:
                                    ai.label

                                },


                                {

                                    name:
                                    "Server JobId",

                                    value:
                                    body.jobId || "Unknown"

                                }


                            ],


                            timestamp:
                            new Date().toISOString()


                        }

                    ]

                }

            );


        }

        catch(error)
        {

            console.log(
                "Discord Error:",
                error.message
            );

        }

    }



    res.sendStatus(200);


});





// ===============================
// Roblox Join Redirect
// ===============================

app.get("/join",(req,res)=>{


    const place =
    req.query.place;


    const job =
    req.query.job;



    if(!place || !job)
    {

        return res.send(
            "Missing server information"
        );

    }



    const robloxURL =

    `roblox://experiences/start?placeId=${place}&gameInstanceId=${job}`;



    res.send(`

    <html>

    <head>

    <title>
    Joining Roblox Server
    </title>

    </head>


    <body>


    <h2>
    Joining Roblox Server...
    </h2>


    <a href="${robloxURL}">
    Click here if Roblox does not open
    </a>



    <script>

    window.location.href="${robloxURL}";


    </script>


    </body>


    </html>

    `);


});





// ===============================
// Status Check
// ===============================

app.get("/",(req,res)=>{

    res.send(
        "Roblox AI Moderation Backend Online"
    );

});





// ===============================
// Start Server
// ===============================

app.listen(PORT,()=>{

    console.log(
        "Backend running on port " + PORT
    );

});
