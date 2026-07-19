const express = require("express");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

// Store your webhook URL in an environment variable named DISCORD_WEBHOOK
const WEBHOOK = process.env.DISCORD_WEBHOOK;

app.post("/report", async (req, res) => {

    if (!WEBHOOK) {
        return res.status(500).send("Webhook not configured.");
    }

    const body = req.body;

    try {

        await fetch(WEBHOOK, {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({

                embeds:[
                    {
                        title:"⚠ Toxic Chat",

                        color:16711680,

                        fields:[
                            {
                                name:"Player",
                                value:body.player
                            },
                            {
                                name:"UserId",
                                value:String(body.userid)
                            },
                            {
                                name:"Message",
                                value:body.message
                            },
                            {
                                name:"Server",
                                value:body.server
                            }
                        ],

                        timestamp:new Date().toISOString()

                    }
                ]

            })

        });

        res.sendStatus(200);

    } catch(err) {

        console.log(err);

        res.sendStatus(500);

    }

});

app.listen(PORT, () => {

    console.log("Running on port", PORT);

});