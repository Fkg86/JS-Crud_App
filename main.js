//! Gerekli HTML elementlerini sec.
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const submitBtn = document.querySelector(".submit-btn");
const alert = document.querySelector(".alert");
const clearBtn = document.querySelector(".clear-btn");

//* Düzenleme Secenekleri
let editElement;
let editFlag = false; //Düzenleme modunda olup olmadigini belirtir.
let editID = ""; //Düzenleme yapilan ögenin benzersiz kimligi

//! Fonksiyonlar

const setBackToDefault = () => {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "Add to Cart";
};

const displayAlert = (text, action) => {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 2000);
};

//tikladigimiz "article" etiketini ekrandan kaldiracak fonksiyondur.
const deleteItem = (e) => {
  const element = e.currentTarget.parentElement.parentElement; //"article etiketine eristik."
  const id = element.dataset.id;
  list.removeChild(element); //lis etiketi icerisinden "aricle" etiketini kaldiridik.
  displayAlert("Item removed.", "danger");
  setBackToDefault();
  removeFromLocalStorage(id);
};

const editItem = (e) => {
  //"article" etiketine parenElement sayesinde eristik.
  const element = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.previousElementSibling; //butonun kapsayicisina eristikten sonra kapsayicinin lardes etiketine eristik.
  console.log(editElement.innerText);
  //tikladigim "article" etiketi icerisindeki p etiketinin textini inputun icerisine gönderme
  grocery.value = editElement.innerText;

  editFlag = true;
  editID = element.dataset.id; // düzenlenen ögenin kimligine erisme
  submitBtn.textContent = "Edit"; // düzenleme isleminde sabmitBtn ıcerık kısmını gğncelledıkç
};

const addItem = (e) => {
  e.preventDefault(); //Formun otomatik olarak gönderilmesini engelliyor.
  const value = grocery.value; //Form icinde bulunan input degerini aldik.
  const id = new Date().getTime().toString(); //*Benzersiz bir id olusturduk.

  //Eger input bos degilse ve düzenleme modunda degilse calisacak blok yapisi
  if (value !== "" && !editFlag) {
    const element = document.createElement("article"); //yeni bir article elementi olsuturduk.
    let attr = document.createAttribute("data-id"); // Yeni bir veri kimligi olusturur.
    attr.value = id;
    element.setAttributeNode(attr); // Olusturdugumuz id yi article etiketine ekledik.
    element.classList.add("grocery-item"); //olusturdugumuz article etiketine class ekledik.

    element.innerHTML = `
        <p class="title">${value}</p>
        <div class="btn-container">
          <button type="button" class="edit-btn">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button type="button" class="delete-btn">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
`;

    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);
    list.appendChild(element); //kapsayiciya olusturdugumuz "article" etiketini ekledik.
    displayAlert("Successfully added to cart", "success");
    container.classList.add("show-container");
    //local storage a ekleme
    addToLocalStorage(id, value);
    //degerleri varsayilana cevirir.
    setBackToDefault();
  } else if (value !== "" && editFlag) {
    //degistirecegimiz p etiketinin icerik kismina
    //kullanicinin inputa girdigi degeri gönderdik.
    editElement.innerText = value;
    //ekrana alert yapisini bastirdik.
    displayAlert("Edit successful", "success");
    editLocalStorage(editID, value);
    setBackToDefault();
  }
};

const clearItems = () => {
  const items = document.querySelectorAll(".grocery-item");
  //listede öge varsa calisir.
  if (items.length > 0) {
    items.forEach((item) => list.removeChild(item));
  }
  //container yapisini gizle
  container.classList.remove("show-container");
  displayAlert("List Empty", "danger");
  setBackToDefault();
};

const createListItem = (id, value) => {
  const element = document.createElement("article"); //yeni bir article elementi olsuturduk.
  let attr = document.createAttribute("data-id"); // Yeni bir veri kimligi olusturur.
  attr.value = id;
  element.setAttributeNode(attr); // Olusturdugumuz id yi article etiketine ekledik.
  element.classList.add("grocery-item"); //olusturdugumuz article etiketine class ekledik.

  element.innerHTML = `
        <p class="title">${value}</p>
        <div class="btn-container">
          <button type="button" class="edit-btn">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button type="button" class="delete-btn">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
     `;

  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);
  list.appendChild(element); //kapsayiciya olusturdugumuz "article" etiketini ekledik.
  container.classList.add("show-container");
};

const setupItems = () => {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach((item) => {
      createListItem(item.id, item.value);
    });
  }
};

/* local storage */
//yerel depoya öge ekleme islemi
const addToLocalStorage = (id, value) => {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  console.log(items);
  localStorage.setItem("list", JSON.stringify(items));
};
// yerel depodan ögeleri alma islemi
const getLocalStorage = () => {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
};

//localStorageden veriyi silme
const removeFromLocalStorage = (id) => {
  //local storage da bulunan verileri getir.
  let items = getLocalStorage();
  //tikladigim etiketin id si ile localstorageda ki id esit degilse
  //bunu diziden cikar ve yeni bir elemana aktar.
  items = items.filter((item) => {
    if (item.id !== id) {
      return item;
    }
  });
  console.log(items);
  localStorage.setItem("list", JSON.stringify(items));
};

//yerel depodaki verilerin id ile güncellenecek olan verinin id si birbirine esitse
//inputa girilen value degiskenini al localstorageda bulunan verinin valuesina aktar.
const editLocalStorage = (id, value) => {
  let items = getLocalStorage();
  items = items.map((item) => {
    if (item.id == id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
};

//!Olay Izleyicileri
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", setupItems);
