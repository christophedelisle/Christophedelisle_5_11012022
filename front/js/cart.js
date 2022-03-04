// lecture des données du LocalStorage aprés les avoir "reformées" (tableau),
// ou création d'un tableau vide si LS est vide
let productStorage = JSON.parse(localStorage.getItem("product")) || [];

// Récupération dans l'API, de l'emplacement (ligne du tableau data) où se situe l'id des produits ajoutés au panier,
// afin de pouvoir y sélectionner les élements réstant à ajouter au DOM ( image, description, prix ...)

function findElementById(data, product) {
  let idFound = (element) => element._id === product.id;
  return data.find(idFound);
}

// Fonction pour mettre à jours le LS et recharger la page
function upLocalStorageAndReload() {
  localStorage.setItem("product", JSON.stringify(productStorage));
  location.reload();
}

// Fonction pour supprimer l'élément dans le DOM et dans le Local Storage
// lors du clique sur le bnt "supprimer"
function suppElement() {
  const deleteItem = document.querySelectorAll(".deleteItem");

  deleteItem.forEach((currentItem, i) => {
    currentItem.addEventListener("click", (event) => {
      event.preventDefault();

      let suppIdSelect = productStorage[i].id;
      let colorSelect = productStorage[i].color;

      productStorage = productStorage.filter(
        (elt) => elt.id !== suppIdSelect || elt.color !== colorSelect
      );
      upLocalStorageAndReload();
    });
  });
}

// *** Fonction pour modifier la quantité d'un élément ***
function modifQty() {
  const modifQuantity = document.querySelectorAll(".itemQuantity");
  console.log(modifQuantity);

  modifQuantity.forEach((qtySelect, j) => {
    qtySelect.addEventListener("change", (event) => {
      event.preventDefault();

      let newQty = qtySelect.value;
      let modifQtyIdSelect = productStorage[j].id;
      let modifQtyColorSelect = productStorage[j].color;
      let modifiedElement = productStorage.find(
        (element) =>
          element.id === modifQtyIdSelect &&
          element.color == modifQtyColorSelect
      );
      if (newQty <= 0 || newQty > 100) {
        return alert(
          "Merci de choisir un nombre d'article(s) compris entre 1 et 100 "
        );
      } else {
        modifiedElement.quantity = newQty;
        upLocalStorageAndReload();
      }
    });
  });
}

//       ***** Fonctions pour créer/insérer dans le DOM *****
//  l'ensemble des éléments récupérés dans le Local Storage et dans l'API
function creatArticle(data, product) {
  let ligneFound = findElementById(data, product);

  // Création de l'article dans le DOM
  const productArticle = document.createElement("article");
  document.querySelector("#cart__items").appendChild(productArticle);
  productArticle.className = "cart__item";
  productArticle.setAttribute("data-id", product.id);
  productArticle.setAttribute("data-color", product.color);

  // Insertion de l'image
  const productImgCart = document.createElement("div");
  productArticle.appendChild(productImgCart);
  productImgCart.className = "cart__item__img";

  const productImg = document.createElement("img");
  productImgCart.appendChild(productImg);

  productImg.src = ligneFound.imageUrl;
  productImg.alt = ligneFound.altTxt;

  // Insertion de la description, du nom du produit, de sa couleur et de son prix
  const productContent = document.createElement("div");
  productArticle.appendChild(productContent);
  productContent.className = "cart__item__content";

  const productContentDescription = document.createElement("div");
  productContent.appendChild(productContentDescription);
  productContentDescription.className = "cart__item__content__description";

  const productTitle = document.createElement("h2");
  productContentDescription.appendChild(productTitle);

  productTitle.innerHTML = ligneFound.name;

  const productColor = document.createElement("p");
  productContentDescription.appendChild(productColor);
  productColor.innerHTML = product.color;

  const productPrice = document.createElement("p");
  productContentDescription.appendChild(productPrice);
  productPrice.innerHTML = ligneFound.price + " €";

  // Insertion du bouton de gestion des quantités
  const productContentSetting = document.createElement("div");
  productContent.appendChild(productContentSetting);
  productContentSetting.className = "cart__item__content__settings";

  const productContentSettingQuantity = document.createElement("div");
  productContentSetting.appendChild(productContentSettingQuantity);
  productContentSettingQuantity.className =
    "cart__item__content__settings__quantity";

  const productQuantity = document.createElement("p");
  productContentSettingQuantity.appendChild(productQuantity);
  productQuantity.innerHTML = "Qté : ";

  const productItemQuantity = document.createElement("input");
  productContentSettingQuantity.appendChild(productItemQuantity);
  productItemQuantity.type = "number";
  productItemQuantity.className = "itemQuantity";
  productItemQuantity.name = "itemQuantity";
  productItemQuantity.min = "1";
  productItemQuantity.max = "100";
  productItemQuantity.value = product.quantity;

  // Insertion du bouton de suppression du produit
  const productContentDelete = document.createElement("div");
  productContentSetting.appendChild(productContentDelete);
  productContentDelete.className = "cart__item__content__settings__delete";

  const productDeleteItem = document.createElement("p");
  productContentDelete.appendChild(productDeleteItem);
  productDeleteItem.className = "deleteItem";
  productDeleteItem.innerHTML = "Supprimer";
}
//       ***** Fonctions pour créer/insérer dans le DOM *****
//  l'ensemble des éléments récupérés dans le Local Storage et dans l'API

const creatCart = (data) => {
  let totalQty = 0;
  let totalPrice = 0;

  for (let product of productStorage) {
    creatArticle(data, product);

    let ligneFound = findElementById(data, product);

    // insertion calcul prix total
    totalPrice = totalPrice + ligneFound.price * product.quantity;
    document.querySelector("#totalPrice").innerHTML = totalPrice;

    // insertion calcul nombre d'articles total
    totalQty = parseInt(totalQty) + parseInt(product.quantity);
    document.querySelector("#totalQuantity").innerHTML = totalQty;
  }
  suppElement();

  modifQty();
};

// (la récupération de certain éléments comme les images, ou les prix doivent se faire dans l'API
// et non dans le Local Storage afin d'éviter des incohérences
// dans le cas d'une mise à jour / modification de ses élements dans l'API)

//Utilisation de "fetch" pour récupérer les données de l'API, et lancer la fonction creatCart():
fetch("http://localhost:3000/api/products")
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    creatCart(data);
  })
  // Création d'un message d'alerte en cas d'erreur
  .catch(function (err) {
    alert(err);
  });

// Fonction de récupération et d'envoi des données (formulaire et produits) en commande
const form = document.querySelector(".cart__order__form");

const getOrder = () => {
  const inputOrder = document.querySelector("#order");

  const contact = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    address: document.getElementById("address").value,
    city: document.getElementById("city").value,
    email: document.getElementById("email").value,
  };

  const idProduct = [];
  for (let idrecup of productStorage) {
    idProduct.push(idrecup.id);
  }

  // Tableau regroupant les données du formulaire et l'ID des produits
  const order = {
    contact,
    products: idProduct,
  };

  // Methode POST pour envoyer le tableau "order", afin de récupérer en réponse le numéro de commande
  const postOrder = {
    method: "POST",
    body: JSON.stringify(order),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  fetch("http://localhost:3000/api/products/order", postOrder)
    .then(function (response) {
      return response.json();
    })
    .then(function (dataOrder) {
      console.log(dataOrder);

      document.location.href = `confirmation.html?orderId=${dataOrder.orderId}`;
    })
    .catch(function (err) {
      alert(err);
    });
};

// ***** CONTROLE DES DONNEES UTILISATEUR DU FORMULAIRE (REGEXP) *****

// Fonction de controle de l'ensemble des données du formulaire avec l'outil RegExp
function controlFormAndOrder() {
  const baseRegExp = new RegExp(/^\S[-a-zA-Zàâäéèêëïîôöùûüç ]*$/);
  const addressRegExp = new RegExp(/^\S[-a-zA-Zàâäéèêëïîôöùûüç0-9.-_ ]*$/);
  const emailRegExp = new RegExp(
    "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$"
  );
  const firstNameSelector = document.querySelector("#firstNameErrorMsg");
  const lastNameSelector = document.querySelector("#lastNameErrorMsg");
  const addressSelector = document.querySelector("#addressErrorMsg");
  const citySelector = document.querySelector("#cityErrorMsg");
  const emailSelector = document.querySelector("#emailErrorMsg");

  //   -----  PRENOM  -----
  // Ecoute de la modification de la case Prénom
  form.firstName.addEventListener("change", function () {
    validFirstName(this);
  });

  // Test validation RegExp de la case Prénom
  const validFirstName = function (inputFirstName) {
    let testFirstName = baseRegExp.test(inputFirstName.value);

    // Message d'erreur ou de validation de la case Prénom
    if (testFirstName && testFirstName !== "") {
      firstNameSelector.innerHTML = "Selection valide";
      return true;
    } else {
      firstNameSelector.innerHTML = "Selection non valide";
      return false;
    }
  };

  //   -----  NOM  -----
  // Ecoute de la modification de la case nom
  form.lastName.addEventListener("change", function () {
    validLastName(this);
  });

  // Test validation RegExp de la case nom
  const validLastName = function (inputLastName) {
    let testLastName = baseRegExp.test(inputLastName.value);

    // Message d'erreur ou de validation de la case nom
    if (testLastName) {
      lastNameSelector.innerHTML = "Selection valide";
      return true;
    } else {
      lastNameSelector.innerHTML = "Selection non valide";
      return false;
    }
  };

  //   -----  ADRESSE  -----
  // Ecoute de la modification de la case adresse
  form.address.addEventListener("change", function () {
    validAddress(this);
  });

  // Test validation RegExp de la case adresse
  const validAddress = function (inputAddress) {
    let testAddress = addressRegExp.test(inputAddress.value);

    // Message d'erreur ou de validation de la case adresse
    if (testAddress) {
      addressSelector.innerHTML = "Selection valide";
      return true;
    } else {
      addressSelector.innerHTML = "Selection non valide";
      return false;
    }
  };

  //   -----  VILLE  -----
  // Ecoute de la modification de la case Ville
  form.city.addEventListener("change", function () {
    validCity(this);
  });

  // Test validation RegExp de la case Ville
  const validCity = function (inputCity) {
    let testCity = baseRegExp.test(inputCity.value);

    // Message d'erreur ou de validation de la case Ville
    if (testCity) {
      citySelector.innerHTML = "Selection valide";
      return true;
    } else {
      citySelector.innerHTML = "Selection non valide";
      return false;
    }
  };

  //   -----  EMAIL  -----
  // Ecoute de la modification de la case Email
  form.email.addEventListener("change", function () {
    validEmail(this);
  });

  // Test validation RegExp de la case Email
  const validEmail = function (inputEmail) {
    let testEmail = emailRegExp.test(inputEmail.value);

    // Message d'erreur ou de validation de la case Email
    if (testEmail) {
      emailSelector.innerHTML = "Selection valide";
      return true;
    } else {
      emailSelector.innerHTML = "Selection non valide";
      return false;
    }
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (
      validEmail(form.email) &&
      validCity(form.city) &&
      validAddress(form.address) &&
      validLastName(form.lastName) &&
      validFirstName(form.firstName) &&
      localStorage.length != 0
    ) {
      getOrder();
    } else {
      alert("Élément(s) du formulaire non valide ou Panier vide");
    }
  });
}
controlFormAndOrder();
