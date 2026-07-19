const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());


const PORT = process.env.PORT || 3000;


const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;

const HF_TOKEN = process.env.HF_TOKEN;




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


        let results = response.data[0];


        let toxicScore = 0;


        for (const item of results)
        {

            if(
                item.label.toLowerCase().includes("toxic")
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
            "TOXIC"

        };


    }
    catch(err)
    {

        console.log(
            "AI Error:",
            err.message
        );


        return {
            toxic:false,
            score:0
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
