

export class FeesBydate {
    constructor() {

    }

  
  init(){

    const sendDateBtn = document.getElementById("sendDateBtn")
    sendDateBtn.addEventListener("click", function () { 
        FeesBydate.findByDate();
        alert("Entrando al primer método")
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


    
    

    async findByDate(){
        alert("Entrando al segundo método")

    }





  


















}