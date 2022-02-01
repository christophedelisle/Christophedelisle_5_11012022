// Récupération de l'id du produit séléctionné, dans l'url de la page :
let str = window.location.href;
let url = new URL(str);
let idPicked = url.searchParams.get("id");
//console.log(id);

//console.log(`http://localhost:3000/api/products/${id}`);

//fetch("http://localhost:3000/api/products/" + id)

//Utilisation de "fetch" pour récupérer les données liées au produit séléctionné (par l'id)

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

    function addParam(productSelect) {
      let paramImg = document.createElement("img");
      document.querySelector(".item .item__img").appendChild(paramImg);
      paramImg.src = productSelect.imageUrl;
      paramImg.alt = productSelect.altTxt;

      let paramTitle = document.querySelector("#title");
      //console.log(paramTitle);
      paramTitle.innerHTML = productSelect.name;

      let paramPrice = document.querySelector("#price");
      paramPrice.innerHTML = productSelect.price;

      let paramDescription = document.querySelector("#description");
      paramDescription.innerHTML = productSelect.description;

      for (let color of productSelect.colors) {
        let paramColor = document.createElement("option");
        document.querySelector("#colors").appendChild(paramColor);
        paramColor.innerHTML = color;
      }
    }
  });

let addToCart = document.querySelector("#addToCart");
addToCart.addEventListener("click", function () {
  let colorPicked = document.querySelector("#colors");
  let quantityPicked = document.querySelector("#quantity");
  let productSelect = "";
  let optionSelected = {
    id: idPicked,
    color: colorPicked.value,
    name: productSelect.name,
    price: productSelect.price,
    image: productSelect.imageUrl,
    description: productSelect.description,
    alt: productSelect.altTxt,
    quantity: quantityPicked.value,
  };

  let optionSelectedObj = JSON.stringify(optionSelected);
  localStorage.setItem("obj", optionSelectedObj);
  console.log(optionSelectedObj);
});
