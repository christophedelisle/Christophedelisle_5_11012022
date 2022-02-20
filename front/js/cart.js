// lecture des données du LocalStorage aprés les avoir "reformées" (tableau)
let productStorage = JSON.parse(localStorage.getItem("product"));

// Fonction pour recharger la page
const RestartPage = () => {
  location.reload();
};

//       ***** Fonction pour créer/insérer dans le DOM *****
//  l'ensemble des éléments récupérés dans le Local Storage et dans l'API

function creatCart(data) {
  let totalPrice = 0;
  let totalQty = 0;
  for (let product of productStorage) {
    // Création de l'article dans le DOM

    const productArticle = document.createElement("article");
    document.querySelector("#cart__items").appendChild(productArticle);
    productArticle.className = "cart__item";
    productArticle.setAttribute("data-id", product.id);
    productArticle.setAttribute("data-color", product.color);

    // Récupération dans l'API, de l'emplacement (ligne du tableau data) où se situe l'id des produits ajoutés au panier,
    // afin de pouvoir y sélectionner les élements réstant à ajouter au DOM ( image, description, prix ...)
    const idFound = (element) => element._id === product.id;
    const ligneFound = data.find(idFound);

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

    // Calcul / insertion prix total
    totalPrice = totalPrice + ligneFound.price * product.quantity;
    document.querySelector("#totalPrice").innerHTML = totalPrice;

    // Calcul / insertion nombre d'articles total
    totalQty = parseInt(totalQty) + parseInt(productItemQuantity.value);
    document.querySelector("#totalQuantity").innerHTML = totalQty;
  }

  let deleteItem = document.querySelectorAll(".deleteItem");

  deleteItem.forEach((currentItem, i) => {
    currentItem.addEventListener("click", (event) => {
      event.preventDefault();

      let idSelect = productStorage[i].id;
      let colorSelect = productStorage[i].color;

      productStorage = productStorage.filter(
        (elt) => elt.id !== idSelect || elt.color !== colorSelect
      );

      localStorage.setItem("product", JSON.stringify(productStorage));

      RestartPage(data);
    });
  });
}
// ( la récupération de certain éléments comme les images, ou les prix doivent se faire dans l'API
// et non dans le Local Storage afin d'éviter des incohérences
// dans le cas d'une mise à jour / modifications de ses élements dans l'API )

//Utilisation de "fetch" pour récupérer les données de l'API :
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

// ***** CONTROLE DES DONNEES UTILISATEUR DU FORMULAIRE (REGEXP) *****

function getForm() {
  let form = document.querySelector(".cart__order__form");
  const baseRegExp = new RegExp("^[-a-zA-Zàâäéèêëïîôöùûüç ]*$");
  const addressRegExp = new RegExp("^[-a-zA-Zàâäéèêëïîôöùûüç0-9.-_ ]*$");
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
    if (testFirstName) {
      firstNameSelector.innerHTML = "Selection valide";
    } else {
      firstNameSelector.innerHTML = "Selection non valide";
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
    } else {
      lastNameSelector.innerHTML = "Selection non valide";
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
    } else {
      addressSelector.innerHTML = "Selection non valide";
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
    } else {
      citySelector.innerHTML = "Selection non valide";
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
    } else {
      emailSelector.innerHTML = "Selection non valide";
    }
  };
}

getForm();
