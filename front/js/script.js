//Utilisation de "fetch" pour récupérer les données de l'API :
fetch("http://localhost:3000/api/products")
  // Promesses pour récupérer les données, aprés les avoir transformées en format JSON :
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    console.log(data);

    // Boucle permétant de parcourir le tableau des données récupérées:
    for (let product of data) {
      // Création d'éléments et insertion des données dans le DOM :

      // Création de l'élément <a> et insertion de l'ID du produit
      const linkItems = document.createElement("a");
      document.querySelector("#items").appendChild(linkItems);
      linkItems.href = `./product.html?id=${product._id}`;

      // Insertion de l'élément article
      const articleItems = document.createElement("article");
      linkItems.appendChild(articleItems);

      // Insertion de l'image + alt
      const imgItems = document.createElement("img");
      articleItems.appendChild(imgItems);
      imgItems.src = product.imageUrl;
      imgItems.alt = product.altTxt;

      // Insertion du nom du produit
      const nameItems = document.createElement("h3");
      articleItems.appendChild(nameItems);
      nameItems.classList.add("productName");
      nameItems.innerHTML = product.name;

      // Insertion de la description
      const descriptionItems = document.createElement("p");
      articleItems.appendChild(descriptionItems);
      descriptionItems.classList.add("productDescription");
      descriptionItems.innerHTML = product.description;
    }
  })

  // Création d'un message d'alerte en cas d'erreur
  .catch(function (err) {
    alert(err);
  });
