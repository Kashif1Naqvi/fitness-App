let btns =  document.querySelectorAll("button")
let form = document.querySelector("form")
let formAct  = document.querySelector("form span")
let input = document.querySelector("input")
let error = document.querySelector(".error")
var activity = "cycling"

btns.forEach(btn=>(
   btn.addEventListener("click",e=>{
     // get activity
     activity = e.target.dataset.activity




   })


))
