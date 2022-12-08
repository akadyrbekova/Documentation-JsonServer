let API = "http://localhost:8000/data";
// SignUp
let signEmail = document.querySelector("#sign-log"),
  signPass = document.querySelector("#sign-pass"),
  signBtn = document.querySelector("#btn-sign");
// LogIn
let email = document.querySelector("#inp-log"),
  password = document.querySelector("#inp-pass"),
  btnLogin = document.querySelector("#btn-login");


signBtn.addEventListener("click", signFunc);
signFunc();
async function signFunc() {
  let authObj = {
    email: signEmail.value,
    password: signPass.value,
  };
  console.log(authObj);

  if (!authObj.email.trim() || !authObj.password.trim()) {
    alert(`Заполните поля`);
    return;
  }
  await fetch(API, {
    method: "POST", //? метод запроса
    headers: {
      "Content-Type": "application/json; charset=utf-8", //? кодировка
    },
    body: JSON.stringify(authObj), //? содержимое
  });

  signEmail.value = "";
  signPass.value = "";
}

//getFunc
btnLogin.addEventListener("click", function () {
    fetch(API)
    .then((res) => res.json())
    .then((data) => {
      data.title = email.value;
     
    });
 
    
  });





