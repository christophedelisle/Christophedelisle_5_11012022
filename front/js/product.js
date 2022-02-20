// Récupération de l'id du produit séléctionné, dans l'url de la page :
const str = window.location.href;
const url = new URL(str);
const idPicked = url.searchParams.get("id");

//Fonction permétant d'insérer l'image, le nom, le prix, la decription et les différentes couleurs du canapé séléctionné, dans la page (DOM) produit
const addParamHtml = (productSelect) => {
  const paramImg = document.createElement("img");
  document.querySelector(".item .item__img").appendChild(paramImg);
  paramImg.src = productSelect.imageUrl;
  paramImg.alt = productSelect.altTxt;

  const paramTitle = document.querySelector("#title");

  paramTitle.innerHTML = productSelect.name;

  const paramPrice = document.querySelector("#price");
  paramPrice.innerHTML = productSelect.price;

  const paramDescription = document.querySelector("#description");
  paramDescription.innerHTML = productSelect.description;

  for (let color of productSelect.colors) {
    const paramColor = document.createElement("option");
    document.querySelector("#colors").appendChild(paramColor);
    paramColor.innerHTML = color;
  }
};

// Utilisation de "fetch" pour récupérer les données liées au produit séléctionné (par l'id)
fetch(`http://localhost:3000/api/products/${idPicked}`)
  .then(function (res) {
    return res.json();
  })
  .then(function (productSelect) {
    if (productSelect) {
      // Si des éléments éxistes, appel de la fonction "addParam"
      addParamHtml(productSelect);
    }
  })

  // Création d'un message d'alerte en cas d'erreur
  .catch(function (err) {
    alert(err);
  });

// Evenement lors du clique sur btn "Ajout au panier", permétant d'envoyer les éléments qui seront nécéssaires à la conception de la page panier vers le local storage
const addToCart = document.querySelector("#addToCart");
addToCart.addEventListener("click", function () {
  const colorPicked = document.querySelector("#colors");
  const quantityPicked = document.querySelector("#quantity");
  const optionSelected = {
    id: idPicked,
    color: colorPicked.value,
    quantity: quantityPicked.value,
  };

  // Fonction faisant la comparaison entre les éléments présent dans le LS et ceux en cours de remontés
  // Si des éléments ont le même id et la même couleur, augmentation uniquement de la quantité, sinon remontée des données telles quelles
  const updateStorage = (productStorage) => {
    const elementsFound = productStorage.find(
      (element) =>
        element.id === idPicked && element.color === colorPicked.value
    );
    if (elementsFound) {
      elementsFound.quantity =
        parseInt(elementsFound.quantity) + parseInt(optionSelected.quantity);
    } else {
      productStorage.push(optionSelected);
    }
    // Stockage des données dans le LocalStorage aprés les avoir transformées en chaine de caractères
    localStorage.setItem("product", JSON.stringify(productStorage));
  };

  // Si couleur et quantité sont remplis correctement, message "Ajout panier"
  if (
    quantityPicked.value > 0 &&
    quantityPicked.value <= 100 &&
    colorPicked.value != ""
  ) {
    alert("Ajout dans votre panier terminé !");

    // Sinon message d'alerte et fin de la fonction
  } else {
    return alert(
      "Merci de choisir une couleur et un nombre d'article(s) (1-100) "
    );
  }

  // lecture des données du LocalStorage ou création d'un tableau vide si LocalStorage vide
  const productStorage = JSON.parse(localStorage.getItem("product")) || [];

  // Appel de la fonction "updateStorage"
  updateStorage(productStorage);
});
