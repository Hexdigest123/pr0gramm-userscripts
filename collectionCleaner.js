/*
Dieses Tool dient dazu, Kollektionen wie Favoriten usw. einfach und bequem vollständig zu leeren.


Die Anwendung ist kinderleicht. 
Man muss lediglich in seiner Kollektion, 
in diesem Beispiel bei den Favoriten unter "https://pr0gramm.com/user/BENUTZERNAME/favoriten", 
sein und das Skript in die Konsole kopieren. 

Danach wird die Kollektion vollständig gereinigt.

Bitte setze im vorhinein die Konstanten BENUTZERNAME

*/

const BENUTZERNAME = "";

async function findCollection(name) {
  const response = await fetch(
    `https://pr0gramm.com/api/profile/info?name=${BENUTZERNAME}&flags=4`
  );
  const json = await response.json();
  const collections = json.collections;
  let collectionID = collections.filter((item) => {
    if (item.keyword === name) {
      return item.id;
    }
  })[0].id;
  return collectionID;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

const streamRows = document.querySelectorAll(".stream-row");
const collectionName = document.location.pathname.split("/")[3];
let collectionID = await findCollection(collectionName);

let ids = [];
streamRows.forEach((item) => {
  const items = item.children;
  for (let item of items) {
    ids.push(item.id.split("-")[1]);
  }
});

for (let id of ids) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  let formData = new FormData();
  formData.append("collectionId", collectionID);
  formData.append("itemId", id);
  formData.append(
    "_nonce",
    JSON.parse(decodeURIComponent(getCookie("me"))).id.slice(0, 16)
  );
  fetch("https://pr0gramm.com/api/collections/remove", {
    method: "POST",
    body: formData,
  }).then((data) => {
    console.log(data.status);
  });
}
