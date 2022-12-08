const API = "  http://localhost:8001/data";
let contactbook = document.querySelector(".acont");
let search = document.querySelector(".search");
let btnNewContact = document.querySelector(".newcont");
let name = document.querySelector("#name");
let surname = document.querySelector("#surname");
let num = document.querySelector("#number");
let photo = document.querySelector("#photo");
let btnCreate = document.querySelector("#create");

// !Create

btnCreate.addEventListener("click", () => {
  let newPerson = {
    name: name.value,
    surname: surname.value,
    num: num.value,
    photo: photo.value,
  };
  console.log(newPerson);
  if (
    newPerson.name.trim() === "" ||
    newPerson.surname.trim() === "" ||
    newPerson.num.trim() === "" ||
    newPerson.photo.trim() === ""
  ) {
    alert("Заполните все поля!");
    return;
  }
  fetch(API, {
    method: "POST",
    body: JSON.stringify(newPerson),
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  });

  name.value = "";
  surname.value = "";
  num.value = "";
  photo.value = "";
  getPerson();
});
getPerson();

let list = document.querySelector("#list");

async function getPerson() {
  let response = await fetch(API).then((response) => response.json());

  list.innerHTML = "";
  response.forEach((item) => {
    let newElem = document.createElement("div");
    newElem.id = item.id;
    newElem.innerHTML += `<p>Name: ${item.name}</p>
    <p> Surname: ${item.surname}</p>
    <p> Number: ${item.num}</p>
    <p> Your photo: <img src="${item.photo}"></img></p>
    <button class='btn-delete' id='${item.id}'>Delete</button>
    <button class="btn-edit" id='${item.id}'>Edit</button>
    `;
    newElem.style.fontSize = "20px";
    newElem.style.marginTop = "5px";
    newElem.style.marginBottom = "5px";
    list.append(newElem);
  });
}

// !! delete
document.addEventListener("click", async (e) => {
  if (e.target.className === "btn-delete") {
    fetch(`${API}/${e.target.id}`, {
      method: "DELETE",
    });
    getPerson();
  } else if (e.target.className === "btn-edit") {
    modalEdit.style.display = "flex";
    let id = e.target.id;
    let response = await fetch(`${API}/${id}`)
      .then((response) => response.json())
      .catch((err) => console.log(err));
    //   console.log(response)
    inpEditname.value = response.name;
    inpEditSurname.value = response.surname;
    inpEditNum.value = response.num;
    inpEditPhoto.value = response.photo;

    inpEditname.className = response.id;
  }
});

// ! update - изменения
let modalEdit = document.getElementById("modal-edit");
let modalEditClose = document.getElementById("modal-edit-close");
let btnSaveEdit = document.getElementById("btn-save-edit");

let inpEditname = document.getElementById("inp-edit-name");
let inpEditSurname = document.getElementById("inp-edit-surname");
let inpEditNum = document.getElementById("inp-edit-num");
let inpEditPhoto = document.getElementById("inp-edit-photo");

modalEditClose.addEventListener("click", function () {
  modalEdit.style.display = "none";
});

btnSaveEdit.addEventListener("click", async () => {
  let editedPerson = {
    name: inpEditname.value,
    surname: inpEditSurname.value,
    num: inpEditNum.value,
    photo: inpEditPhoto.value,
  };
  let id = inpEditname.className;
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(editedPerson),
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  });
  modalEdit.style.display = "none";
  getPerson();
});
