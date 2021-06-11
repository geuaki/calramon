

//Radio button unidades
$("input[type=radio][name=quant]").change(function () {
    console.log("aasdf");
    $(this).parent().addClass("focus active").siblings().removeClass("focus active");
  });
  $(document).ready(function(){
  //navbar1 sign up sign in
  document.addEventListener("click", function(event) {
    if(event.target.classList.contains("nav1")) {
      document.getElementById("navbarNav").classList.toggle("show");
    } else if (event.target.classList.contains("nav-link")) {
      document.getElementById("navbarNav").classList.remove("show");
    }
  });
  //navbar2 pestañas
  document.addEventListener("click", function(event) {
    if(event.target.classList.contains("nav2")) {
        console.log("a");
      document.getElementById("navbarNav1").classList.toggle("show");
    } else if (event.target.classList.contains("nav-link")) {
      document.getElementById("navbarNav1").classList.remove("show");
    }
  });
});