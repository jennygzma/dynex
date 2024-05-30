import React, { useState } from "react";
import { InfoBlock } from "../type";

const GPT = ({ dataArray }: { dataArray: InfoBlock[] }) => {
  const [index, setIndex] = useState(0);
  const htmlStringNewsFeed = `
    <div class="news-feed-container">
    <div class="feed-item">
      <img src="luffyImage" alt="Monkey D Luffy"/>
      <h2>Monkey D Luffy</h2>
      <p>Role: Straw Hat Pirate, Captain</p>
      <p>Weapon: Gum Gum</p>
      <p>Fun Fact: Is Dumb</p>
      <p>Favorite Moment: Helping Nami</p>
    </div>
    <div class="feed-item">
      <img src="zoroImage" alt="Roronoa Zoro"/>
      <h2>Roronoa Zoro</h2>
      <p>Role: Straw Hat Pirate, Right Wing</p>
      <p>Weapon: 3 Sword Style</p>
      <p>Fun Fact: Gets Lost</p>
      <p>Favorite Moment: Nothing Happened</p>
    </div>
    <div class="feed-item">
      <img src="sanjiImage" alt="Vinsmoke Sanji"/>
      <h2>Vinsmoke Sanji</h2>
      <p>Role: Straw Hat Pirate, Chef, Left Wing</p>
      <p>Weapon: Leg</p>
      <p>Fun Fact: Nose bleeds</p>
      <p>Favorite Moment: Bowing to Zeff</p>
    </div>
    <div class="feed-item">
      <img src="namiImage" alt="Nami"/>
      <h2>Nami</h2>
      <p>Role: Straw Hat Pirate, Navigator</p>
      <p>Weapon: Weather Thing</p>
      <p>Fun Fact: Thief</p>
      <p>Favorite Moment: Asking Luffy for help</p>
    </div>
    <div class="feed-item">
      <img src="usoppImage" alt="Usopp"/>
      <h2>Usopp</h2>
      <p>Role: Straw Hat Pirate, Sniper</p>
      <p>Weapon: Sniper thing</p>
      <p>Fun Fact: Liar</p>
      <p>Favorite Moment: Enies Lobby</p>
    </div>
    <div class="feed-item">
      <img src="chopperImage" alt="Tony Tony Chopper"/>
      <h2>Tony Tony Chopper</h2>
      <p>Role: Straw Hat Pirate, Doctor</p>
      <p>Weapon: Human Human</p>
      <p>Fun Fact: Cotton Candy</p>
      <p>Favorite Moment: Doctorine Arc</p>
    </div>
    <div class="feed-item">
      <img src="robinImage" alt="Nico Robin"/>
      <h2>Nico Robin</h2>
      <p>Role: Straw Hat Pirate, Archaeologist</p>
      <p>Weapon: Flower Flower</p>
      <p>Fun Fact: Randomly got pale</p>
      <p>Favorite Moment: One day you will find friends</p>
    </div>
    <div class="feed-item">
      <img src="frankyImage" alt="Franky"/>
      <h2>Franky</h2>
      <p>Role: Straw Hat Pirate, Shipwright</p>
      <p>Weapon: Cyborg</p>
      <p>Fun Fact: Coca Cola</p>
      <p>Favorite Moment: Stopping train</p>
    </div>
    <div class="feed-item">
      <img src="brookImage" alt="Brook"/>
      <h2>Brook</h2>
      <p>Role: Straw Hat Pirate, Musician</p>
      <p>Weapon: Sword</p>
      <p>Fun Fact: ...</p>
      <p>Favorite Moment: Bink's Sake</p>
    </div>
    <div class="feed-item">
      <img src="shanksImage" alt="Shanks"/>
      <h2>Shanks</h2>
      <p>Role: Red-Haired Pirate, Captain</p>
      <p>Weapon: Sword</p>
      <p>Fun Fact: Is Cool</p>
      <p>Favorite Moment: Saving Luffy</p>
    </div>
  </div>
  <style>
    .news-feed-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .feed-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      border-radius: 10px;
    }
    .feed-item img {
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: 50%;
    }
    .feed-item h2 {
      margin: 10px 0;
    }
    .feed-item p {
      margin: 5px 0;
    }
  </style>
`;

  // const htmlStringCardSwipe= `
  // <div class="swipe-container">
  //   <div class="card" style="background-image: url(luffyImage);">
  //     <div class="card-info">
  //       <h2>Monkey D Luffy</h2>
  //       <p>Role: Straw Hat Pirate, Captain</p>
  //       <p>Weapon: Gum Gum</p>
  //       <p>Fun Fact: Is Dumb</p>
  //       <p>Favorite Moment: Helping Nami</p>
  //     </div>
  //   </div>
  //   <div class="card" style="background-image: url(zoroImage);">
  //     <div class="card-info">
  //       <h2>Roronoa Zoro</h2>
  //       <p>Role: Straw Hat Pirate, Right Wing</p>
  //       <p>Weapon: 3 Sword Style</p>
  //       <p>Fun Fact: Gets Lost</p>
  //       <p>Favorite Moment: Nothing Happened</p>
  //     </div>
  //   </div>
  //   <div class="card" style="background-image: url(sanjiImage);">
  //     <div class="card-info">
  //       <h2>Vinsmoke Sanji</h2>
  //       <p>Role: Straw Hat Pirate, Chef, Left Wing</p>
  //       <p>Weapon: Leg</p>
  //       <p>Fun Fact: Nose bleeds</p>
  //       <p>Favorite Moment: Bowing to Zeff</p>
  //     </div>
  //   </div>
  //   <div class="card" style="background-image: url(namiImage);">
  //     <div class="card-info">
  //       <h2>Nami</h2>
  //       <p>Role: Straw Hat Pirate, Navigator</p>
  //       <p>Weapon: Weather Thing</p>
  //       <p>Fun Fact: Thief</p>
  //       <p>Favorite Moment: Asking Luffy for help</p>
  //     </div>
  //   </div>
  //   <!-- Further cards omitted for brevity -->
  // </div>
  // <style>
  //   .swipe-container {
  //     display: flex;
  //     flex-wrap: wrap;
  //     gap: 10px;
  //     justify-content: center;
  //   }
  //   .card {
  //     width: 300px;
  //     height: 400px;
  //     border-radius: 20px;
  //     background-size: cover;
  //     position: relative;
  //     display: flex;
  //     justify-content: flex-end;
  //     flex-direction: column;
  //     overflow: hidden;
  //   }
  //   .card-info {
  //     background-color: rgba(0, 0, 0, 0.5);
  //     color: #fff;
  //     padding: 20px;
  //   }
  //   .card h2 {
  //     margin: 0;
  //   }
  //   .card p {
  //     margin: 5px 0;
  //   }
  // </style>
  // `;

  const htmlStringGmailTable = `
<table style="width:100%; border-collapse: collapse;">
  <thead>
    <tr style="background-color: #f3f3f3;">
      <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Image</th>
      <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Name</th>
      <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Role</th>
      <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Weapon</th>
      <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Fun Fact</th>
      <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Favorite Moment</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #ddd; padding: 8px;"><img src="luffyImage" alt="Monkey D Luffy" style="width:50px; height:50px;"></td>
      <td style="border: 1px solid #ddd; padding: 8px;">Monkey D Luffy</td>
      <td style="border: 1px solid #ddd; padding: 8px;">Straw Hat Pirate, Captain</td>
      <td style="border: 1px solid #ddd; padding: 8px;">Gum Gum</td>
      <td style="border: 1px solid #ddd; padding: 8px;">Is Dumb</td>
      <td style="border: 1px solid #ddd; padding: 8px;">Helping Nami</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ddd; padding: 8px;"><img src="zoroImage" alt="Roronoa Zoro" style="width:50px; height:50px;"></td>
      <td style="border: 1px solid #ddd; padding: 8px;">Roronoa Zoro</td>
      <td style="border: 1px solid #ddd; padding: 8px;">Straw Hat Pirate, Right Wing</td>
      <td style="border: 1px solid #ddd; padding: 8px;">3 Sword Style</td>
      <td style="border: 1px solid #ddd; padding: 8px;">Gets Lost</td>
      <td style="border: 1px solid #ddd; padding: 8px;">Nothing Happened</td>
    </tr>
    <!-- Repeat for each character -->
    <tr>
      <td style="border: 1px solid #ddd; padding: 8px;"><img src="sanjiImage" alt="Vinsmoke Sanji" style="width:50px; height:50px;"></td>
      <td style="border: 1px solid #ddd; padding: 8px;">Vinsmoke Sanji</td>
      <td style="border: 1px solid #ddd; padding: 8px;">Straw Hat Pirate, Chef, Left Wing</td>
      <td style="border: 1px solid #ddd; padding: 8px;">Leg</td>
      <td style="border: 1px solid #ddd; padding: 8px;">Nose bleeds</td>
      <td style="border: 1px solid #ddd; padding: 8px;">Bowing to Zeff</td>
    </tr>
    <!-- Repeat for the rest -->
  </tbody>
</table>
`;

  const htmlStringTinder = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tinder-like Character UI</title>
    <style>
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #ececec; }
        .card { width: 300px; background: #fff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin: 20px; padding: 20px; text-align: center; }
        .card img { max-width: 100%; border-radius: 10px; }
        .buttons { text-align: center; margin-top: 20px; }
        button { padding: 10px 20px; margin: 0 10px; border: none; border-radius: 5px; cursor: pointer; }
        .like { background-color: #4CAF50; color: white; }
        .dislike { background-color: #f44336; color: white; }
    </style>
</head>
<body>

<div class="card">
    <img src="" alt="Character Image" id="charImage">
    <h2 id="charTitle"></h2>
    <p id="charDescription"></p>
</div>

<div class="buttons">
    <button class="dislike" onclick="changeCharacter(-1)">Dislike</button>
    <button class="like" onclick="changeCharacter(1)">Like</button>
</div>

<script>
const characters = [
    { title: "Monkey D Luffy", description: "Role: Straw Hat Pirate, Captain. Fun Fact: Is Dumb. Favorite Moment: Helping Nami", imagePath: "luffyImage.jpeg" }, 
    { title: "Roronoa Zoro", description: "Role: Straw Hat Pirate, Right Wing. Fun Fact: Gets Lost. Favorite Moment: Nothing Happened", imagePath: "zoroImage.jpeg" }, 
    { title: "Vinsmoke Sanji", description: "Role: Straw Hat Pirate, Chef, Left Wing. Fun Fact: Nose bleeds. Favorite Moment: Bowing to Zeff", imagePath: "sanjiImage.jpeg" }, 
    { title: "Nami", description: "Role: Straw Hat Pirate, Navigator. Fun Fact: Thief. Favorite Moment: Asking Luffy for help", imagePath: "namiImage.jpeg" }, 
    { title: "Usopp", description: "Role: Straw Hat Pirate, Sniper. Fun Fact: Liar. Favorite Moment: Enies Lobby", imagePath: "usoppImage.jpeg" }, 
    { title: "Tony Tony Chopper", description: "Role: Straw Hat Pirate, Doctor. Fun Fact: Cotton Candy. Favorite Moment: Doctorine Arc", imagePath: "chopperImage.jpeg" }, 
    { title: "Nico Robin", description: "Role: Straw Hat Pirate, Archaeologist. Fun Fact: Randomly got pale. Favorite Moment: One day you will find friends", imagePath: "robinImage.jpeg" }, 
    { title: "Franky", description: "Role: Straw Hat Pirate, Shipwright. Fun Fact: Coca Cola. Favorite Moment: Stopping train", imagePath: "frankyImage.jpeg" }, 
    { title: "Brook", description: "Role: Straw Hat Pirate, Musician. Fun Fact: .... Favorite Moment: Bink's Sake", imagePath: "brookImage.jpeg" }, 
    { title: "Shanks", description: "Role: Red-Haired Pirate, Captain. Fun Fact: Is Cool. Favorite Moment: Saving Luffy", imagePath: "shanksImage.jpeg" }
];

let currentIndex = 0;

function displayCharacter(index) {
    const { title, description, imagePath } = characters[index];
    document.getElementById('charImage').src = imagePath; // Placeholder, replace with actual paths or URLs
    document.getElementById('charImage').alt = title;
    document.getElementById('charTitle').innerText = title;
    document.getElementById('charDescription').innerText = description;
}

function changeCharacter(direction) {
    currentIndex += direction;
    if (currentIndex < 0) currentIndex = characters.length - 1;
    if (currentIndex >= characters.length) currentIndex = 0;
    displayCharacter(currentIndex);
}

displayCharacter(currentIndex);
</script>

</body>
</html>`;
  // Usage example with React:
  // <div dangerouslySetInnerHTML={{ __html: htmlString }} />
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: htmlStringTinder }} />
      <div dangerouslySetInnerHTML={{ __html: htmlStringGmailTable }} />
      {/* <div dangerouslySetInnerHTML={{ __html: htmlStringNewsFeed }} /> */}
    </>
  );
};

export default GPT;
