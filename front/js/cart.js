// lecture des données du LocalStorage aprés les avoir "reformées" (tableau)
const productStorage = JSON.parse(localStorage.getItem("product"));
console.log(productStorage);

//Utilisation de "fetch" pour récupérer les données de l'API :
fetch("http://localhost:3000/api/products")
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    console.log(data);

    // *( la récupération de certain éléments comme les images, ou les prix doivent se faire dans l'API
    // et non dans le Local Storage afin d'éviter des incohérences
    // dans le cas d'une mise à jour / modifications de ses élements dans l'API )*

    // Fonction pour insérer dans le DOM l'ensemble des éléments récupérés dans le Local Storage et dans l'API
    function creatCart() {
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
        productContentDescription.className =
          "cart__item__content__description";

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
        productContentDelete.className =
          "cart__item__content__settings__delete";

        const productDeleteItem = document.createElement("p");
        productContentDelete.appendChild(productDeleteItem);
        productDeleteItem.className = "deleteItem";
        productDeleteItem.innerHTML = "Supprimer";

        // Calcul prix total
        totalPrice = totalPrice + ligneFound.price * product.quantity;
        document.querySelector("#totalPrice").innerHTML = totalPrice;

        // Calcul nombre d'articles total
        totalQty = parseInt(totalQty) + parseInt(productItemQuantity.value);
        document.querySelector("#totalQuantity").innerHTML = totalQty;

        ///
        const resetAndRestartPage = () => {
          document.querySelector("#cart__items").innerHTML = "";
          creatCart();
        };

        document.querySelector(".deleteItem").addEventListener("click", () => {
          productStorage.filter(
            (el) => el.id !== product.id && el.color !== product.color
          );
          resetAndRestartPage();
        });
      }
    }

    creatCart();
  })

  // Création d'un message d'alerte en cas d'erreur
  .catch(function (err) {
    alert(err);
  });
