const inputId = document.getElementById("id-input");
const inputName = document.getElementById("name-input");
const inputNum = document.getElementById("num-input");
const inputMail = document.getElementById("mail-input");
const submitBtn = document.getElementById("submit-btn");
const clrBtn = document.getElementById("clr-btn");
const form = document.getElementById("form");

form.addEventListener("submit", validate);


function validate(event){
    event.preventDefault();

    inputNum.style.border = ""
    inputMail.style.border = "";
    let isValid = true;
    const regexNum = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if(!regexNum.test(inputNum.value.trim())){
        isValid = false;
        inputNum.style.border = "1px solid red";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inputMail.value.trim())) {
        inputMail.style.border = "1px solid red";
      isValid = false;
    }

    if(isValid){
        storeData();
    }
}