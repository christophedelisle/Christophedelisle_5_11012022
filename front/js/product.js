// Récupération de l'id du produit séléctionné, dans l'url de la page :
const str = window.location.href;
const url = new URL(str);
const idPicked = url.searchParams.get("id");
//console.log(id);

//console.log(`http://localhost:3000/api/products/${id}`);

//fetch("http://localhost:3000/api/products/" + id)

//Utilisation de "fetch" pour récupérer les données liées au produit séléctionné (par l'id)

//Fonction permétant d'insérer l'image, le nom, le prix, la decription et les différentes couleurs
// du canapé séléctionné, dans la page (DOM) produit

function addParam(productSelect) {
  const paramImg = document.createElement("img");
  document.querySelector(".item .item__img").appendChild(paramImg);
  paramImg.src = productSelect.imageUrl;
  paramImg.alt = productSelect.altTxt;

  const paramTitle = document.querySelector("#title");
  //console.log(paramTitle);
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
}

fetch(`http://localhost:3000/api/products/${idPicked}`)
  .then(function (res) {
    return res.json();
  })
  .then(function (productSelect) {
    // console.log(productSelect);
    if (productSelect) {
      addParam(productSelect);
    }
    //console.log(productSelect);
  });

// Evenement lors du clique sur btn "Ajout au panier", permétant d'envoyer dans le local storage
// les éléments qui seront nécéssaires à la conception de la page panier
const addToCart = document.querySelector("#addToCart");
addToCart.addEventListener("click", function () {
  const colorPicked = document.querySelector("#colors");
  const quantityPicked = document.querySelector("#quantity");
  const productSelect = "";
  const optionSelected = {
    id: idPicked,
    color: colorPicked.value,
    quantity: quantityPicked.value,
  };

  // lecture des données du LocalStorage ou création d'un tableau vide si LocalStorage vide
  const productStorage = JSON.parse(localStorage.getItem("product")) || [];
  //Comparaison entre les éléments présent dans le LS et ceux en cours de remontés
  //Si éléments avec même id et même couleur, augmentation de la quantité
  const elementsFound = productStorage.find(
    (element) => element.id === idPicked && element.color === colorPicked.value
  );
  if (elementsFound) {
    elementsFound.quantity =
      parseInt(elementsFound.quantity) + parseInt(optionSelected.quantity);
    // Sinon, remontée des données telles quelles
  } else {
    productStorage.push(optionSelected);
  }

  //Stockage des données dans le LocalStorage aprés les avoir transformées en chaine de caractères
  localStorage.setItem("product", JSON.stringify(productStorage));

  console.log(productStorage);

  // Transformation en JSON des éléments du tableau "optionSelected" afin de pouvoir les
  // stoquer dans le local storage
  /*const optionSelectedObj = JSON.stringify(optionSelected);
  localStorage.setItem("obj", optionSelectedObj);
  console.log(optionSelectedObj);*/
});
