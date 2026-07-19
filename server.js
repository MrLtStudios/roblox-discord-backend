const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());


const PORT = process.env.PORT || 3000;


const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;

const HF_TOKEN = process.env.HF_TOKEN;



async function checkToxicity(message)
{

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
                    `Bearer ${HF_TOKEN}`
                }
            }

        );


        let result = response.data;


        if(!result || !result[0])
        {
            return {
                toxic:false,
                score:0
            };
        }



        let highest = result[0].reduce(
            (a,b)=>
            a.score > b.score ? a:b
        );



        return {

            toxic:
            highest.label.toLowerCase().includes("toxic")
            &&
            highest.score > 0.75,


            score:
            highest.score,


            label:
            highest.label

        };


    }
    catch(err)
    {

        console.log(
            "AI Error:",
            err.message
        );


        return {
            toxic:false
        };

    }

}







app.post("/report", async(req,res)=>{


    const body=req.body;



    const ai =
    await checkToxicity(
        body.message
    );



    console.log(ai);



    if(ai.toxic)
    {


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


                        fields:
                        [

                            {
                                name:"Player",
                                value:body.player
                            },


                            {
                                name:"Message",
                                value:body.message
                            },


                            {
                                name:"AI Confidence",
                                value:
                                Math.round(ai.score*100)
                                +"%"
                            },


                            {
                                name:"Category",
                                value:
                                ai.label
                            },


                            {
                                name:"Server",
                                value:
                                body.jobId
                            }

                        ],


                        timestamp:
                        new Date()

                    }

                ]

            }

        );


    }



    res.sendStatus(200);


});





app.get("/",(req,res)=>{

    res.send(
        "AI Roblox Moderation Online"
    );

});





app.listen(PORT,()=>{

    console.log(
        "Backend running"
    );

});
