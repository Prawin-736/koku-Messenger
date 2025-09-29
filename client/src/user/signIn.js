
//

const form = document.querySelector(".login__form");
const errorBox = document.querySelector("#error-box");
const successBox = document.querySelector("#success-box");

form.addEventListener("submit",async(event)=>{
    
    event.preventDefault();
const username = document.querySelector("#form-input").value.trim();
    const response = await fetch("/api/user/signIn",{
        method:"POST",
        credentials:"include",
        headers:{
            "content-Type":"application/json"
        },
        body:JSON.stringify({username})
    });


    const result = await response.json();

    
    // error message
            if (!response.ok) {
                if (result.errors && Array.isArray(result.errors) && result.errors.length > 0) {
            let firstError = `<small class="bg-danger-subtle px-4 py-2 rounded-2">${result.errors[0].message}</small>`;
                    errorBox.innerHTML=firstError;
                    errorBox.classList.remove("d-none");
                    errorBox.style.display="block";                }
            } 
            // success message
            if(response.ok) {
                let successBoxStructure = `<small class="bg-success-subtle px-4 py-2 rounded-2">${result}</small>`;
                successBox.innerHTML=successBoxStructure;
                successBox.classList.remove("d-none");
                successBox.style.display="block";
  
            setTimeout(() => {
                // consider loginForm is a <form> element //important to know
              form.reset(); 
              errorBox.innerHTML = "";
              errorBox.style.display = "none";
              successBox.innerHTML = "";
              successBox.style.display = "none";
              window.location.href = "/api/main";
              }, 500);
              }

})