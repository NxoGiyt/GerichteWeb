require("dotenv").config();
const express = require("express");
const path = require("path");
const db = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// ===============================
// STARTSEITE
// ===============================

app.get("/", async (req, res) => {

    try {

        const result = await db.query(
    "SELECT * FROM dishes ORDER BY name ASC"
);

        res.render("index", {
            dishes: result.rows
        });


    } catch(error) {

        console.error(error);

        res.send(
            "Fehler beim Laden der Gerichte."
        );

    }

});

app.post("/api/dishes", async (req, res) => {


    const {
        name,
        category,
        preparation,
        country,
        description

    } = req.body;



    if (!name || !category) {

        return res.status(400).json({

            error:
            "Name und Ernährungsart sind erforderlich."

        });

    }



    try {


        const result = await db.query(

            `
            INSERT INTO dishes
            (
                name,
                category,
                preparation,
                country,
                description
            )

            VALUES ($1,$2,$3,$4,$5)

            RETURNING *

            `,


            [

                name,

                category,

                preparation || "Keine Angabe",

                country || "Keine Angabe",

                description || ""

            ]

        );



        res.json({

            success:true,

            dish: result.rows[0]

        });



    } catch(error) {


        console.error(error);


        res.status(500).json({

            error:
            "Gericht konnte nicht gespeichert werden."

        });


    }


});


// ===============================
// GERICHT LÖSCHEN
// ===============================

app.delete("/api/dishes/:id", async (req, res) => {


    const id = req.params.id;



    try {


        const result = await db.query(

            "DELETE FROM dishes WHERE id=$1 RETURNING *",

            [id]

        );



        if(result.rowCount === 0){


            return res.status(404).json({

                error:
                "Gericht nicht gefunden."

            });


        }



        res.json({

            success:true

        });



    } catch(error) {


        console.error(error);


        res.status(500).json({

            error:
            "Gericht konnte nicht gelöscht werden."

        });


    }


});


// ===============================
// SERVER
// ===============================

app.listen(PORT, () => {
    console.log(`GerichteWeb läuft auf Port ${PORT}`);
});