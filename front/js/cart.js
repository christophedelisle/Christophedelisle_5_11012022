const productStorage = JSON.parse(localStorage.getItem("product"));
console.log(productStorage);

// Function pour insérer dans le DOM l'ensembles des éléments récupérés dans le Local Storage et dans l'API
function creatCart() {
  for (let product of productStorage) {
    // Création de l'article
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

    productImg.src = "Image";
    productImg.alt = "Image alt";

    // Insertion de la description, du nom du produit, de sa couleur et de son prix
    const productContent = document.createElement("div");
    productArticle.appendChild(productContent);
    productContent.className = "cart__item__content";

    const productContentDescription = document.createElement("div");
    productContent.appendChild(productContentDescription);
    productContent.className = "cart__item__content__description";

    const productTitle = document.createElement("h2");
    productContentDescription.appendChild(productTitle);
    productTitle.innerHTML = "Nom du canapé";

    const productColor = document.createElement("p");
    productTitle.appendChild(productColor);
    productColor.innerHTML = product.color;

    const productPrice = document.createElement("p");
    productColor.appendChild(productPrice);
    productPrice.innerHTML = "prix en €";

    // Insertion du bouton de gestion des quantités
    const productContentSetting = document.createElement("div");
    productContent.appendChild(productContentSetting);
    productContent.className = "cart__item__content__settings";

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
    productContentSetting.className = "cart__item__content__settings__delete";

    const productDeleteItem = document.createElement("p");
    productContentDelete.appendChild(productDeleteItem);
    productDeleteItem.className = "deleteItem";
    productDeleteItem.innerHTML = "Supprimer";
  }
}

creatCart();
