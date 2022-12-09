let addBtn = document.getElementById("submit-btn");
let cancelBtn = document.getElementById("cancel-btn");
let resetBtn = document.getElementById("reset-btn");
let editBtn = document.getElementById("edit-btn");
let deleteBtn = document.getElementById("delete-btn");
let recordContainer = document.querySelector(".record-container");
let mainModal = document.querySelector(".main-modal");
let inpEdit = document.querySelector(".inp-edit");
let btnSave = document.querySelector(".btn-save");
let btnClose = document.querySelector(".btn-close");
//! inputs

let name = document.getElementById("name");
let treaty = document.getElementById("treaty");
let number = document.getElementById("contact-num");
let amount = document.getElementById("amount");

let ContactArray = [];
let id = 0;

//! constructor for contact

function Contact(name, treaty, number, amount) {
  this.name = name;
  this.treaty = treaty;
  this.number = number;
  this.amount = amount;
}

//! display record

document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("contacts") == null) {
    ContactArray = [];
  } else {
    ContactArray = JSON.parse(localStorage.getItem("contacts"));
    lastID(ContactArray);
  }
  displayRecord();
});

function lastID(ContactArray) {
  if (ContactArray.length > 0) {
    id = ContactArray[ContactArray.length - 1].id;
  } else {
    id = 0;
  }
}

//! Display function

function displayRecord() {
  ContactArray.forEach(function (singleContact) {
    addToList(singleContact);
  });
}

//! Finding the last id

//! add contact record

addBtn.addEventListener("click", function () {
  if (
    [
      !name.value.trim() ||
        !treaty.value.trim() ||
        !number.value.trim() ||
        !amount.value.trim,
    ]
  ) {
    setMessage("success", "Record added successfully!");
    id++;
    const contact = new Contact(
      id,
      name.value,
      treaty.value,
      number.value,
      amount.value
    );
    ContactArray.push(contact);

    addToList(contact);
  } else {
    setMessage("error", "Empty input fields or invalid input!");
  }
});

//! Add to list

function addToList(item) {
  let newRecordDiv = document.createElement("div");
  newRecordDiv.classList.add("record-item");
  newRecordDiv.innerHTML = `
    <div class="record-el">
    <span class="labelling">Name: </span>
    <span id="name">${item.name}</span>
  </div>

  <div class="record-el">
    <span class="labelling">Treaty: </span>
    <span id="treaty">${item.treaty}</span>
  </div>

  <div class="record-el">
    <span class="labelling">Number: </span>
    <span id="num">${item.number}</span>
  </div>
  <div class="record-el">
  <span class="labelling">Amount: </span>
  <span id="amount">${item.amount}</span>
</div>

  <button type="button" id="edit-btn">
    <span>
      <i class="fas fa-edit"></i>
    </span>
    Edit
  </button>

  <button type="button" id="delete-btn">
    <span>
      <i class="fas fa-trash"></i>
    </span>
    Delete
  </button>`;
  recordContainer.appendChild(newRecordDiv);
}

//! Deletion of record
recordContainer.addEventListener("click", function (event) {
  //   console.log(event.target);
  if (event.target.id === "delete-btn") {
    let recordItem = event.target.parentElement;
    recordContainer.removeChild(recordItem);
    let tempContactList = ContactArray.filter(function (record) {
      return (
        record.id !==
        parseInt(recordItem.firstElementChild.lastElementChild.textContect)
      );
    });
    ContactArray = tempContactList;
    localStorage.setItem("contacts", JSON.stringify(ContactArray));
  }
});

//! click on reset
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

//! clear all input's fields
cancelBtn.addEventListener("click", function () {
  clearInputFields();
});

function clearInputFields() {
  amount.value = "";
  name.value = "";
  treaty.value = "";
  number.value = "";
}

//! remove status/alerts
function removeMessage(status, messageBox) {
  setTimeout(function () {
    messageBox.classList.remove(`${status}`);
  }, 1500);
}

//! input field check
function checkInputFields(inputArr) {
  for (let i = 0; i < inputArr.length; i++) {
    if (inputArr[i].value === "") {
      return false;
    }
  }
  if (!phoneNumCheck(inputArr[2].value)) {
    return false;
  }
  return true;
}

function phoneNumCheck(inputtxt) {
  let phoneNo = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if (inputtxt.match(phoneNo)) {
    return true;
  } else {
    return false;
  }
}
function createElement() {
  let newData = JSON.parse(localStorage.getItem("contacts"));
  recordContainer.innerHTML = "";
  newData.forEach((item, index) => {
    let li = document.createElement("li");
    li.innerText = item.data;

    li.append(editBtn);

    editBtn.addEventListener("click", () => {
      editElement(index);
      mainModal.style.display = "block";
    });

    recordContainer.append(li);
  });
}

function editElement(index) {
  let data = JSON.parse(localStorage.getItem("contacts"));
  inpEdit.setAttribute("id", index);
  inpEdit.value = data[index].id;
}

btnClose.addEventListener("click", () => {
  mainModal.style.display = "none";
});

btnSave.addEventListener("click", () => {
  let data = JSON.parse(localStorage.getItem("contacts"));
  let index = inpEdit.id;
  if (!inpEdit.value.trim()) {
    alert("Make changes to the field!");
    return;
  }
  let newContact = { ContactArray: inpEdit.value };
  data.splice(index, 1, newContact);
  localStorage.setItem("contacts", JSON.stringify(data));
  mainModal.style.display = "none";
});
