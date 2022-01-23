fetch("http://localhost:3000/api/products")
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    console.log(data);
    for (product of data) {
      let linkItems = document.createElement("a");
      document.querySelector("#items").appendChild(linkItems);
      linkItems.href = product._id;

      let articleItems = document.createElement("article");
      linkItems.appendChild(articleItems);

      let imgItems = document.createElement("img");
      articleItems.appendChild(imgItems);
      imgItems.src = product.imageUrl;
      imgItems.alt = product.altTxt;

      let h3Items = document.createElement("h3");
      articleItems.appendChild(h3Items);
      h3Items.classList.add("productName");
      h3Items.innerHTML = product.name;

      let descriptionItems = document.createElement("p");
      articleItems.appendChild(descriptionItems);
      descriptionItems.classList.add("productDescription");
      descriptionItems.innerHTML = product.description;
    }
  })
  .catch(function (err) {
    alert(err);
  });
