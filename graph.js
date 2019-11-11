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

     // removing activity and add active class

     btns.forEach(btn=>btn.classList.remove("active"))

     e.target.classList.add("active")
    //  console.log(e.target.classList.add("active"));
    //  // set input field id
    //
    input.setAttribute("id" , activity)
    // console.log(input.setAttribute("id" , activity));
    formAct.textContent = activity

   })


))
