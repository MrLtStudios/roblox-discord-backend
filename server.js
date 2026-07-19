const express = require("express");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

const WEBHOOK = process.env.DISCORD_WEBHOOK;


// =========================
// Roblox sends reports here
// =========================

app.post("/report", async (req, res) => {

    const body = req.body;

    console.log("Report received:", body);


    if (!WEBHOOK) {
        console.log("Missing Discord webhook");
        return res.sendStatus(500);
    }


    try {

        const joinLink =
        `https://roblox-discord-backend-lieu.onrender.com/join?place=${body.placeId}&job=${body.jobId}`;


        await fetch(WEBHOOK, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },


            body: JSON.stringify({

                embeds: [

                    {

                        title: "⚠ Toxic Chat Detected",

                        color: 16711680,


                        description:
                        `**Message:** ${body.message}\n\n` +
                        `[🎮 Join Server](${joinLink})`,


                        fields: [

                            {
                                name: "Player",
                                value: body.player || "Unknown",
                                inline: true
                            },


                            {
                                name: "User ID",
                                value: String(body.userid || "Unknown"),
                                inline: true
                            },


                            {
                                name: "Server JobId",
                                value: body.jobId || "Unknown"
                            },


                            {
                                name: "Place ID",
                                value: String(body.placeId || "Unknown")
                            }

                        ],


                        footer: {

                            text: "Roblox Moderation System"

                        },


                        timestamp: new Date().toISOString()

                    }

                ]

            })

        });


        res.sendStatus(200);


    } catch (err) {

        console.error("Discord Error:", err);

        res.sendStatus(500);

    }

});




// =========================
// Join Server Redirect
// =========================

app.get("/join", (req, res) => {


    const place = req.query.place;

    const job = req.query.job;


    if (!place || !job) {

        return res.send(
            "Missing PlaceId or JobId"
        );

    }



    const robloxLink =
    `roblox://experiences/start?placeId=${place}&gameInstanceId=${job}`;



    res.send(`

        <!DOCTYPE html>

        <html>

        <head>

        <title>Joining Roblox Server</title>

        </head>


        <body>

        <h2>Joining Roblox Server...</h2>

        <p>If Roblox does not open automatically:</p>


        <a href="${robloxLink}">
            Click here to join
        </a>


        <script>

        window.location.href = "${robloxLink}";

        </script>


        </body>

        </html>

    `);


});




// =========================
// Health Check
// =========================

app.get("/", (req,res)=>{

    res.send("Roblox Discord Backend Online");

});




// =========================
// Start Server
// =========================

app.listen(PORT, () => {

    console.log(
        `Backend running on port ${PORT}`
    );

});
