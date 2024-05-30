// import React, { useState } from 'react';
// import { Card, CardContent, CardMedia, Typography, Button, Stack } from '@mui/material';
// import luffyImage from "../../assets/one-piece/luffy.png";
// import zoroImage from "../../assets/one-piece/zoro.png";
// import sanjiImage from "../../assets/one-piece/sanji.png";
// import namiImage from "../../assets/one-piece/nami.png";
// import usoppImage from "../../assets/one-piece/usopp.png";
// import chopperImage from "../../assets/one-piece/chopper.png";
// import robinImage from "../../assets/one-piece/robin.png";
// import frankyImage from "../../assets/one-piece/franky.png";
// import brookImage from "../../assets/one-piece/brook.png";
// import shanksImage from "../../assets/one-piece/shanks.png";

// interface Character {
//   title: string;
//   description: {
//     Role: string;
//     Weapon: string;
//     FunFact: string;
//     FavoriteMoment: string;
//   };
//   imagePath: string;
// }

// const characters: Character[] = [
//   {
//     title: "Monkey D Luffy",
//     description: {
//       Role: "Straw Hat Pirate, Captain",
//       Weapon: "Gum Gum",
//       FunFact: "Is Dumb",
//       FavoriteMoment: "Helping Nami",
//     },
//     imagePath: luffyImage, // Replace with actual image path
//   },
//   {
//     title: "Roronoa Zoro",
//     description: {
//         "Role": "Straw Hat Pirate, Right Wing",
//         "Weapon": "3 Sword Style",
//         "Fun Fact": "Gets Lost",
//         "Favorite Moment": "Nothing Happened"
//     },
//     imagePath: zoroImage,
// },
// {
//     title: "Vinsmoke Sanji",
//     description: {
//         "Role": "Straw Hat Pirate, Chef, Left Wing",
//         "Weapon": "Leg",
//         "Fun Fact": "Nose bleeds",
//         "Favorite Moment": "Bowing to Zeff"
//     },
//     imagePath: sanjiImage
// },
// {
//     title: "Nami",
//     description: {
//         "Role": "Straw Hat Pirate, Navigator",
//         "Weapon": "Weather Thing",
//         "Fun Fact": "Thief",
//         "Favorite Moment": "Asking Luffy for help"
//     },
//     imagePath: namiImage
// },
// {
//     title: "Usopp",
//     description: {
//         "Role": "Straw Hat Pirate, Sniper",
//         "Weapon": "Sniper thing",
//         "Fun Fact": "Liar",
//         "Favorite Moment": "Enies Lobby"
//     },
//     imagePath: usoppImage
// },
// {
//     title: "Tony Tony Chopper",
//     description: {
//         "Role": "Straw Hat Pirate, Doctor",
//         "Weapon": "Human Human",
//         "Fun Fact": "Cotton Candy",
//         "Favorite Moment": "Doctorine Arc"
//     },
//     imagePath: chopperImage
// },
// {
//     title: "Nico Robin",
//     description: {
//         "Role": "Straw Hat Pirate, Archaeologist",
//         "Weapon": "Flower Flower",
//         "Fun Fact": "Randomly got pale",
//         "Favorite Moment": "One day you will find friends"
//     },
//     imagePath: robinImage
// },
// {
//     title: "Franky",
//     description: {
//         "Role": "Straw Hat Pirate, Shipwright",
//         "Weapon": "Cyborg",
//         "Fun Fact": "Coca Cola",
//         "Favorite Moment": "Stopping train"
//     },
//     imagePath: frankyImage
// },
// {
//     title: "Brook",
//     description: {
//         "Role": "Straw Hat Pirate, Musician",
//         "Weapon": "Sword",
//         "Fun Fact": "...",
//         "Favorite Moment": "Bink's Sake"
//     },
//     imagePath: brookImage
// },
// {
//     title: "Shanks",
//     description: {
//         "Role": "Red-Haired Pirate, Captain",
//         "Weapon": "Sword",
//         "Fun Fact": "Is Cool",
//         "Favorite Moment": "Saving Luffy"
//     },
//     imagePath: shanksImage
// },
//   // Add other character objects here
// ];

// const CharacterSwipe: React.FC = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const handleSwipe = (direction: 'left' | 'right') => {
//     setCurrentIndex(prev => {
//       // Calculate next index based on direction
//       let nextIndex = direction === 'left' ? prev - 1 : prev + 1;
//       // Wrap around the characters array
//       if (nextIndex < 0) nextIndex = characters.length - 1;
//       if (nextIndex >= characters.length) nextIndex = 0;
//       return nextIndex;
//     });
//   };

//   return (
//     <Stack spacing={2} alignItems="center">
//       <Card sx={{ maxWidth: 345 }}>
//         <CardMedia
//           component="img"
//           height="140"
//           image={characters[currentIndex].imagePath} // Ensure this points to actual image URLs
//           alt={characters[currentIndex].title}
//         />
//         <CardContent>
//           <Typography gutterBottom variant="h5" component="div">
//             {characters[currentIndex].title}
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             Role: {characters[currentIndex].description.Role}<br />
//             Weapon: {characters[currentIndex].description.Weapon}<br />
//             Fun Fact: {characters[currentIndex].description.FunFact}<br />
//             Favorite Moment: {characters[currentIndex].description.FavoriteMoment}
//           </Typography>
//         </CardContent>
//       </Card>
//       <Stack direction="row" spacing={2}>
//         <Button variant="contained" color="error" onClick={() => handleSwipe('left')}>Dislike</Button>
//         <Button variant="contained" color="success" onClick={() => handleSwipe('right')}>Like</Button>
//       </Stack>
//     </Stack>
//   );
// };

// export default CharacterSwipe;
