// Récupération dans l'URL du numéro de commande
const strConfirm = window.location.href;
const urlConfirm = new URL(strConfirm);
const orderIdPicked = urlConfirm.searchParams.get("orderId");

// Affichage du numéro de commande dans le DOM
function getOrderId() {
  document.getElementById("orderId").innerText = orderIdPicked;
}
getOrderId();
