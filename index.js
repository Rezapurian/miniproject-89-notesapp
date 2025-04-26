const addBox = document.querySelector(".add-box"),
  popupBox = document.querySelector(".popup-box"),
  content = document.querySelector(".content"),
  popupTitle = document.querySelector("header p"),
  closeIcon = popupBox.querySelector("header i"),
  titleTag = popupBox.querySelector("input"),
  descTag = popupBox.querySelector("textarea"),
  addBtn = popupBox.querySelector("#add-btn"),
  fileInput = document.querySelector("#file-input"),
  fileUploadWrapper = document.querySelector(".file-upload-wrapper"),
  fileUploadWrapperImage = document.querySelector("#file-upload-wrapper-image"),
  fileCancel = document.querySelector("#file-cancel"),
  popupImage = document.querySelector(".popup-image");

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

document.querySelector("#file-upload").addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    fileUploadWrapper.querySelector("img").src = e.target.result;
    fileUploadWrapper.classList.add("file-uploaded");
    popupImage.querySelector("img").src = e.target.result;

    fileInput.value = "";
  };
  reader.readAsDataURL(file);
});

fileCancel.addEventListener("click", () => {
  fileUploadWrapper.classList.remove("file-uploaded");
});

const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false,
  updateId;

addBox.addEventListener("click", () => {
  titleTag.focus();
  fileUploadWrapperImage.src = "";
  popupImage.querySelector("img").src = "";
  popupBox.classList.add("show");
});

closeIcon.addEventListener("click", () => {
  isUpdate = false;
  titleTag.value = "";
  descTag.value = "";
  fileUploadWrapper.classList.remove("file-uploaded");
  addBtn.innerText = "Add Note";
  popupTitle.innerText = "Add a new Note";
  popupBox.classList.remove("show");
});

function showNotes() {
  document.querySelectorAll(".note").forEach((note) => note.remove());
  notes.forEach((note, index) => {
    
    let liTag = `<li class="note">
        <div class="details">
          <p>${note.title}</p>
          <span>${note.description}</span>
          <img src="${note.image}" >
        </div>
        <div class="bottom-content">
          <span>${note.date}</span>
          <div class="settings">
            <i onclick="showMenu(this)" class="fa fa-ellipsis-h"></i>
            <ul class="menu">
             <li onclick="updateNote(${index}, '${note.title}', '${note.description}', '${note.image}')"><i class="fa fa-pen"></i>Edit</li>
             <li onclick="deleteNote(${index})"><i class="fa-solid fa-trash"></i>Delete</li>
            </ul>
          </div>
        </div>
      </li>`;

    addBox.insertAdjacentHTML("afterend", liTag);
  });
}

showNotes();

function showMenu(elem) {
  elem.parentElement.classList.add("show");
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  });
}

function deleteNote(noteId) {
  let confirmDel = confirm("Are you sure you want to delete this note?");
  if (!confirmDel) return;
  notes.splice(noteId, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  showNotes();
}

function updateNote(noteId, title, desc, img) {
  isUpdate = true;
  updateId = noteId;
  addBox.click();
  titleTag.value = title;
  descTag.value = desc;
  fileUploadWrapperImage.src = img;
  popupImage.querySelector("img").src = img;
  addBtn.innerText = "Update Note";
  popupTitle.innerText = "Update a Note";
}

addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let noteTitle = titleTag.value;
  let noteDesc = descTag.value;
  let noteImg = fileUploadWrapperImage.src;

  if (noteTitle || noteDesc) {
    let dateObj = new Date();
    let month = months[dateObj.getMonth()];
    let day = dateObj.getDate();
    let year = dateObj.getFullYear();

    let noteInfo = {
      title: noteTitle,
      description: noteDesc,
      image: noteImg,
      date: `${month} ${day}, ${year}`,
    };
    if (!isUpdate) {
      notes.push(noteInfo);
    } else {
      isUpdate = false;
      notes[updateId] = noteInfo;
    }
    localStorage.setItem("notes", JSON.stringify(notes));
    closeIcon.click();
    showNotes();
  }
});
