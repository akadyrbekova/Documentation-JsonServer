let API = "http://localhost:8000/data";

let addBtn = document.querySelector("#submit-btn");
(cancelBtn = document.querySelector("#cancel-btn")),
  (resetBtn = document.querySelector("#reset-btn")),
  (editBtn = document.querySelector("#btn-edit")),
  (deleteBtn = document.querySelector("#delete-btn"));

let recordContainer = document.querySelector(".record-container"),
  mainModal = document.querySelector(".main-modal"),
  inpEdit = document.querySelector(".inp-edit"),
  btnSave = document.querySelector(".btn-save"),
  btnClose = document.querySelector(".btn-close");

//! inputs
let name = document.getElementById("name");
(photo = document.getElementById("photo")),
  (treaty = document.getElementById("treaty")),
  (num = document.getElementById("num"));

//! edit inputs
let editName = document.querySelector("#edit-name"),
  editPhoto = document.querySelector("#edit-photo"),
  editTreaty = document.querySelector("#edit-treaty"),
  editNum = document.querySelector("#edit-num"),
  saveChange = document.querySelector("#save-change"),
  exampleModal = document.querySelector("#exampleModal");

//!search
let inpSearch = document.querySelector("#search");
let searchVal = "";

//! paginate
let currentPage = 1;
let pageTotalCount = 1;
let paginationList = document.querySelector(".pagination-list");
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");

//! put info to database
addBtn.addEventListener("click", async function () {
  let obj = {
    name: name.value,
    photo: photo.value,
    treaty: treaty.value,
    num: num.value,
  };

  if (
    !obj.name.trim() ||
    !obj.photo.trim() ||
    !obj.treaty.trim() ||
    !obj.num.trim()
  ) {
    alert`Поле не должно быть пустым`;
    return;
  }
  if (!obj.treaty || +obj.name || +obj.photo || !+obj.num) {
    alert`Заполните поля правильно`;
    return;
  }

  fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(obj),
  });
  name.value = "";
  photo.value = "";
  treaty.value = "";
  num.value = "";
  infoFunc();
});

//! displaying data on a browser page
infoFunc();
async function infoFunc() {
  let info = await fetch(`${API}?q=${searchVal}&_page=${currentPage}&_limit=3`)
    .then((result) => result.json())
    .catch((error) => console.log(error));
  drawPaginationButtons();
  recordContainer.innerHTML = "";
  info.forEach((item) => {
    let newInfo = document.createElement("div");
    newInfo.id = item.id;

    newInfo.innerHTML = `
    <div class="record-el">
    <span class="labelling">Name: </span>
    <span id="name">${item.name}</span>
  </div>

  <div class="record-el">
    <span class="labelling">Photo: </span>
   
    <img  class ="photo" src=${item.photo} alt="...">
  </div>

  <div class="record-el">
    <span class="labelling">Treaty: </span>
    <img  class ="photo"  src=${item.treaty} alt="...">
  </div>
  <div class="record-el">
  <span class="labelling">Phone: </span>
  <span id="num">${item.num}</span>
</div>

  <button type="button" data-bs-target="#exampleModal" data-bs-toggle="modal" class ="btn-edit" id=${item.id}>Edit
    <span>
      <i class="fas fa-edit"></i>
     
    </span>
    
  </button>
  
  <button type="button" class="btn-delete" id=${item.id} >
    <span>
      <i class="fas fa-trash"></i>
    </span>
    Delete
  </button>`;
    recordContainer.append(newInfo);
  });
}

// //! click on reset
resetBtn.addEventListener("click", function () {
  ContactArray = [];
  localStorage.setItem("contacts", JSON.stringify(ContactArray));
  location.reload();
});

function setMessage(status, message) {
  let messageBox = document.querySelector(".message");
  if (status == "error") {
    messageBox.innerHTML = `${message}`;
    messageBox.classList.add("error");
    removeMessage(status, messageBox);
  }
  if (status == "success") {
    messageBox.innerHTML = `${message}`;
    messageBox.classList.add("success");
    removeMessage(status, messageBox);
  }
}

// //! clear all input's fields
cancelBtn.addEventListener("click", function () {
  clearInputFields();
});

function clearInputFields() {
  name.value = "";
  photo.value = "";
  treaty.value = "";
  num.value = "";
}

//!delete data
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-delete")) {
    let id = e.target.id;
    fetch(`${API}/${id}`, {
      method: "DELETE",
    }).then(() => {
      recordContainer.innerHTML = "";
      infoFunc();
    });
  }
});

//! edit data
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-edit")) {
    let id = e.target.id;
    console.log("clicked");
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        editName.value = data.name;
        editPhoto.value = data.photo;
        editTreaty.value = data.treaty;
        editNum.value = data.num;

        saveChange.setAttribute("id", data.id);
      });
  }
});

saveChange.addEventListener("click", function () {
  let id = this.id;
  let name = editName.value,
    photo = editPhoto.value,
    phoneTreaty = editTreaty.value,
    num = editNum.value;

  if (!name || !photo || !phoneTreaty || !num) return;
  if (+phoneTreaty || +name || +photo || !+num) {
    alert`Поля должны быть заполнены корректно`;
    return;
  }

  let editedInfo = {
    name: name,
    photo: photo,
    phoneTreaty: phoneTreaty,
    num: num,
  };
  saveEdit(editedInfo, id);
});

async function saveEdit(editedInfo, id) {
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(editedInfo),
  });
  infoFunc();
  let modal = bootstrap.Modal.getInstance(exampleModal);
  modal.hide();
}

//!search
inpSearch.addEventListener("input", () => {
  searchVal = inpSearch.value;
  infoFunc();
});

inpSearch.addEventListener("input", (e) => {
  searchVal = e.target.value;
  infoFunc();
});

//! pagination
function drawPaginationButtons() {
  fetch(`${API}?q=${searchVal}`)
    .then((res) => res.json())
    .then((data) => {
      pageTotalCount = Math.ceil(data.length / 3);                   // pageTotalCount = кол-во страниц

      paginationList.innerHTML = "";
      for (let i = 1; i <= pageTotalCount; i++) {
        if (currentPage == i) {
          let page1 = document.createElement("li");
          page1.innerHTML = `<li class="page-item active"><a class="page-link page_number" href="#">${i}</a></li>`;
          paginationList.append(page1);
        } else {
          let page1 = document.createElement("li");
          page1.innerHTML = `<li class="page-item"><a class="page-link page_number" href="#">${i}</a></li>`;
          paginationList.append(page1);
        }
      }

      if (currentPage == 1) {
        prev.classList.add("disabled");
      } else {
        prev.classList.remove("disabled");
      }
      if (currentPage == pageTotalCount) {
        next.classList.add("disabled");
      } else {
        next.classList.remove("disabled");
      }
    });
}

prev.addEventListener("click", () => {
  if (currentPage <= 1) {
    return;
  }
  currentPage--;
  infoFunc();
});

next.addEventListener("click", () => {
  if (currentPage >= pageTotalCount) {
    return;
  }
  currentPage++;
  infoFunc();
});

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("page_number")) {
    currentPage = e.target.innerText;
    infoFunc();
  }
});
