

export class FeesBydate {
    constructor() {

    }

  
  init(){

           // Asignamos la llamada al botón
           const sendBtn = document.getElementById("sendBtn");
           if (sendBtn) {
               sendBtn.addEventListener("click", (event) => {  // Usamos función de flecha aquí
                   event.preventDefault();  // Evitar el comportamiento predeterminado del formulario
                   const date = document.getElementById("date").value;
                   this.findByDate(date);  
                   alert("Funciona el botón")
               });
           }
       }


    
    

    async findByDate(date){
        alert(date)

    }





  


















}