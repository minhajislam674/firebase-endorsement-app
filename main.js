import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  push,
  onValue,
  set,
  remove,
} from "firebase/database";
import { v4 as uuidv4 } from "uuid";
const uuid = uuidv4();
const firebaseConfig = {
  databaseURL:
    "https://scrimba-app-default-rtdb.europe-west1.firebasedatabase.app",
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const endorsementListInDB = ref(database, "endorsment");

const inputTextEl = document.getElementById("input-text");
const inputFromEl = document.getElementById("input-from");
const inputToEl = document.getElementById("input-to");
const postButtonEl = document.getElementById("add-button");
const endorsementListEl = document.getElementById("endorsement-list");

postButtonEl.addEventListener("click", function () {
  let inputText = inputTextEl.value;
  let inputFrom = inputFromEl.value;
  let inputTo = inputToEl.value;

  set(ref(database, "endorsment/" + uuidv4()), {
    text: inputText,
    from: inputFrom,
    to: inputTo,
    likes: 0,
    date: Date.now(),
  })
    .then(() => {
      console.log("Data saved successfully");
    })
    .catch((error) => {
      console.log(error);
    });
  clearInputField();
});

onValue(endorsementListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let endorsementArray = Object.entries(snapshot.val());

    endorsementArray.sort((a, b) => b[1].date - a[1].date);

    console.log(endorsementArray);
    clearEndorsementListEl();

    endorsementArray.forEach((endorsement) => {
      appendItemstoList(endorsement);
    });
  }
});

function clearInputField() {
  inputTextEl.value = "";
  inputFromEl.value = "";
  inputToEl.value = "";
}

function clearEndorsementListEl() {
  endorsementListEl.innerHTML = "";
}

function appendItemstoList(item) {
  let itemId = item[0];
  let itemData = item[1];

  let endorsementItemEl = document.createElement("div");

  endorsementItemEl.innerHTML = `

  <div id=${itemId} class="endorsement-container">
    <div class="endorsement-item__to">
       ${itemData.to}
    </div>
    <div class="endorsement-item__text">
    "${itemData.text}"
    </div>
    <div class="endorsement-item__from">
      ${itemData.from}
    </div>

    <div class="endorsement-footer">
    <div class="endorsement-item__date">
    ${new Date(itemData.date).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })}
  </div>
  
      <div class="endorsement-item__likes">
        <i class="fa-solid fa-heart"></i>
        <span>${itemData.likes}</span>
      </div>
    </div>


     
  </div>

`;
  endorsementListEl.appendChild(endorsementItemEl);

  // let deleteButtonEl = endorsementItemEl.querySelector("button");
  // deleteButtonEl.addEventListener("click", function () {
  //   remove(ref(database, "endorsment/" + itemId))
  //     .then(() => {
  //       console.log("Data removed successfully");
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // });

  let likeButtonEl = endorsementItemEl.querySelector(".fa-heart");
  likeButtonEl.addEventListener("click", function () {
    set(ref(database, "endorsment/" + itemId + "/likes"), itemData.likes + 1)
      .then(() => {
        console.log("Data saved successfully");
      })
      .catch((error) => {
        console.log(error);
      });
  });
}
