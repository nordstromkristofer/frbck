const express = require('express');

const app = express();



document.addEventListener("submit", (event)=>{
    console.log("Validating")
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let request = new XMLHttpRequest();
    request.open("POST", "http://localhost:5500/authorize");
    //request.send(new FormData(formElement));
    console.log("Validated")

    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send(`user=${username}&password=${password}`);
event.preventDefault() 
})


// re-CAPTCHA submitbutton/muspekare.
function recaptcha_callback(){
    var submitBtn = document.querySelector('#submtbtn');
    submitBtn.removeAttribute('disabled');
    submitBtn.style.cursor = 'pointer';
}