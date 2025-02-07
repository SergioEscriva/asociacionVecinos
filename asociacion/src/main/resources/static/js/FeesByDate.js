

export class FeesByDate {
    constructor() {

    }


    async init() {

        const sendDateBtn = document.getElementById("sendDateBtn")
        console.log(sendDateBtn)
        sendDateBtn.addEventListener("click", function () {
            alert("Entrando al primer método")
            FeesByDate.findByDate();
        });

        //buttonFeesBydate.textContent = "¿Deudas?"

        // Asignamos la llamada al botón
        /* const sendDateBtn = document.getElementById("sendDateBtn");
         if (sendDateBtn) {
             sendBtn.addEventListener("click", (event) => {  // Usamos función de flecha aquí
                 event.preventDefault();  // Evitar el comportamiento predeterminado del formulario
                 const date = document.getElementById("date").value;
                 this.findByDate(date);  
                 alert("Funciona el botón")
             });
         }*/
    }

    static findByDate() {
        alert("Entrando al segundo método")

    }
























}