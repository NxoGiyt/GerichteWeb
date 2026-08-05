// ==========================================
// GERICHWEB - APP.JS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // ------------------------------------------
    // ELEMENTE
    // ------------------------------------------

    const modal = document.getElementById("dishModal");
    const openButton = document.getElementById("openAddDish");
    const emptyAddButton = document.getElementById("emptyAddDish");
    const closeButton = document.getElementById("closeModal");
    const form = document.getElementById("dishForm");


    // ------------------------------------------
    // MODAL ÖFFNEN
    // ------------------------------------------

    function openModal() {

        if (!modal) return;

        modal.classList.add("show");
    }


    // ------------------------------------------
    // MODAL SCHLIESSEN
    // ------------------------------------------

    function closeModal() {

        if (!modal) return;

        modal.classList.remove("show");
    }


    // ------------------------------------------
    // BUTTON OBEN
    // ------------------------------------------

    if (openButton) {

        openButton.addEventListener("click", () => {
            openModal();
        });

    }


    // ------------------------------------------
    // BUTTON BEI KEINEN GERICHTEN
    // ------------------------------------------

    if (emptyAddButton) {

        emptyAddButton.addEventListener("click", () => {
            openModal();
        });

    }


    // ------------------------------------------
    // X BUTTON
    // ------------------------------------------

    if (closeButton) {

        closeButton.addEventListener("click", () => {
            closeModal();
        });

    }


    // ------------------------------------------
    // HINTERGRUND KLICK
    // ------------------------------------------

    if (modal) {

        modal.addEventListener("click", (event) => {

            if (event.target === modal) {
                closeModal();
            }

        });

    }


    // ------------------------------------------
    // ESC TASTE
    // ------------------------------------------

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {
            closeModal();
        }

    });


    // ------------------------------------------
    // GERICHT HINZUFÜGEN
    // ------------------------------------------

    if (form) {

        form.addEventListener("submit", async (event) => {

            event.preventDefault();


            const formData = new FormData(form);

            const data = Object.fromEntries(
                formData.entries()
            );


            try {

                const response = await fetch(
                    "/api/dishes",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(data)
                    }
                );


                const result = await response.json();


                if (!response.ok) {

                    alert(
                        result.error ||
                        "Das Gericht konnte nicht hinzugefügt werden."
                    );

                    return;
                }


                form.reset();

                closeModal();

                window.location.reload();


            } catch (error) {

                console.error(
                    "Fehler beim Hinzufügen:",
                    error
                );

                alert(
                    "Es konnte keine Verbindung zum Server hergestellt werden."
                );

            }

        });

    }


    // ------------------------------------------
    // GERICHT LÖSCHEN
    // ------------------------------------------

    const deleteButtons =
        document.querySelectorAll(".delete-button");


    deleteButtons.forEach((button) => {

        button.addEventListener("click", async () => {

            const id = button.dataset.id;


            if (!id) {

                alert(
                    "Fehler: Keine ID für dieses Gericht gefunden."
                );

                return;
            }


            const confirmed = confirm(
                "Möchtest du dieses Gericht wirklich löschen?"
            );


            if (!confirmed) {
                return;
            }


            try {

                const response = await fetch(
                    `/api/dishes/${id}`,
                    {
                        method: "DELETE"
                    }
                );


                const result = await response.json();


                if (!response.ok) {

                    alert(
                        result.error ||
                        "Das Gericht konnte nicht gelöscht werden."
                    );

                    return;
                }


                // Karte sofort entfernen
                const card =
                    button.closest(".dish-card");


                if (card) {
                    card.remove();
                }


                // Seite neu laden,
                // damit Statistik aktualisiert wird
                window.location.reload();


            } catch (error) {

                console.error(
                    "Fehler beim Löschen:",
                    error
                );

                alert(
                    "Das Gericht konnte nicht gelöscht werden."
                );

            }

        });

    });

    // ===============================
// DETAILS MODAL
// ===============================

const detailsModal = document.getElementById("detailsModal");
const closeDetails = document.getElementById("closeDetails");

const detailsName = document.getElementById("detailsName");
const detailsCategory = document.getElementById("detailsCategory");
const detailsCountry = document.getElementById("detailsCountry");
const detailsPreparation = document.getElementById("detailsPreparation");
const detailsDescription = document.getElementById("detailsDescription");
const descriptionRow = document.getElementById("descriptionRow");


document.querySelectorAll(".details-button").forEach(button => {

    button.addEventListener("click", () => {

        detailsName.textContent = button.dataset.name;

        detailsCategory.textContent = button.dataset.category;

        detailsCountry.textContent =
            button.dataset.country || "-";

        detailsPreparation.textContent =
            button.dataset.preparation || "-";


        if (
            button.dataset.description &&
            button.dataset.description.trim() !== ""
        ) {

            detailsDescription.textContent =
                button.dataset.description;

            descriptionRow.style.display = "flex";

        } else {

            descriptionRow.style.display = "none";

        }

        detailsModal.classList.add("show");

    });

});


closeDetails.addEventListener("click", () => {

    detailsModal.classList.remove("show");

});


detailsModal.addEventListener("click", (event) => {

    if (event.target === detailsModal) {

        detailsModal.classList.remove("show");

    }

});


// =====================================
// LIVE SUCHE
// =====================================


const searchInput =
document.getElementById("searchInput");


const resultCount =
document.getElementById("resultCount");



function updateCards(){


    const cards =
    document.querySelectorAll(".dish-card");


    const search =
    searchInput
    ?
    searchInput.value.toLowerCase().trim()
    :
    "";


    let count = 0;



    cards.forEach(card => {


        const text = (

            card.dataset.name +

            " " +

            card.dataset.category +

            " " +

            card.dataset.country +

            " " +

            card.dataset.preparation

        ).toLowerCase();



        let visible = true;



        // Suche

        if(
            search &&
            !text.includes(search)
        ){

            visible = false;

        }



        // Kategorie Filter

        if(
            currentCategory !== "alle" &&
            card.dataset.category !== currentCategory
        ){

            visible = false;

        }



        // Zubereitung Filter

        if(
            preparationFilter &&
            preparationFilter.value !== "Alle Zubereitungsarten" &&
            card.dataset.preparation !== preparationFilter.value.toLowerCase()
        ){

            visible = false;

        }



        // Herkunft Filter

        if(
            countryFilter &&
            countryFilter.value !== "Alle Länder" &&
            card.dataset.country !== countryFilter.value.toLowerCase()
        ){

            visible = false;

        }



        if(visible){

            card.style.display = "";

            count++;

        }
        else{

            card.style.display = "none";

        }


    });



    if(resultCount){

        resultCount.textContent =
        `${count} ${count === 1 ? "Gericht" : "Gerichte"} gefunden`;

    }


}



if(searchInput){

    searchInput.addEventListener(
        "input",
        updateCards
    );

}

// =====================================
// FILTER
// =====================================


const categoryButtons =
document.querySelectorAll(".filter");


const preparationFilter =
document.getElementById("preparationFilter");


const countryFilter =
document.getElementById("countryFilter");



let currentCategory = "alle";



function applyFilters(){


const cards =
document.querySelectorAll(".dish-card");



cards.forEach(card=>{


let show = true;



const category =
card.dataset.category;



const preparation =
card.dataset.preparation;



const country =
card.dataset.country;



if(
currentCategory !== "alle" &&
category !== currentCategory
){

show = false;

}



if(
preparationFilter &&
preparationFilter.value !== "Alle Zubereitungsarten"
&&
preparation !== preparationFilter.value.toLowerCase()
){

show = false;

}



if(
countryFilter &&
countryFilter.value !== "Alle Länder"
&&
country !== countryFilter.value.toLowerCase()
){

show = false;

}



card.style.display =
show ? "" : "none";


});


}




categoryButtons.forEach(button=>{


button.addEventListener("click",()=>{


categoryButtons.forEach(btn=>{

btn.classList.remove("active");

});


button.classList.add("active");


currentCategory =
button.dataset.category;



updateCards();


});


});



if(preparationFilter){

preparationFilter.addEventListener(
"change",
updateCards
);

}



if(countryFilter){

countryFilter.addEventListener(
"change",
updateCards
);

}

// =====================================
// SORTIERUNG
// =====================================


const sortFilter =
document.getElementById("sortFilter");



if(sortFilter){


sortFilter.addEventListener(
"change",
()=>{


const grid =
document.querySelector(".dish-grid");


const cards =
Array.from(
grid.querySelectorAll(".dish-card")
);



const value =
sortFilter.value;



cards.sort((a,b)=>{


const nameA =
a.dataset.name;


const nameB =
b.dataset.name;



if(value === "az"){

return nameA.localeCompare(nameB);

}



if(value === "za"){

return nameB.localeCompare(nameA);

}



if(value === "newest"){


return (
Number(b.querySelector(".delete-button").dataset.id)
-
Number(a.querySelector(".delete-button").dataset.id)
);


}



});



cards.forEach(card=>{

grid.appendChild(card);

});


});


}

});