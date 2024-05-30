export interface InfoBlock {
  title: string;
  description: Record<string, string>;
  imagePath: any;
}

export const onePieceData: InfoBlock[] = [
  {
    title: "Monkey D Luffy",
    description: {
      Role: "Straw Hat Pirate, Captain",
      Weapon: "Gum Gum",
      "Fun Fact": "Is Dumb",
      "Favorite Moment": "Helping Nami",
    },
    imagePath: require("../assets/luffy.png"),
  },
  {
    title: "Roronoa Zoro",
    description: {
      Role: "Straw Hat Pirate, Right Wing",
      Weapon: "3 Sword Style",
      "Fun Fact": "Gets Lost",
      "Favorite Moment": "Nothing Happened",
    },
    imagePath: require("../assets/zoro.png"),
  },
  {
    title: "Vinsmoke Sanji",
    description: {
      Role: "Straw Hat Pirate, Chef, Left Wing",
      Weapon: "Leg",
      "Fun Fact": "Nose bleeds",
      "Favorite Moment": "Bowing to Zeff",
    },
    imagePath: require("../assets/sanji.png"),
  },
  {
    title: "Nami",
    description: {
      Role: "Straw Hat Pirate, Navigator",
      Weapon: "Weather Thing",
      "Fun Fact": "Thief",
      "Favorite Moment": "Asking Luffy for help",
    },
    imagePath: require("../assets/nami.png"),
  },
  {
    title: "Usopp",
    description: {
      Role: "Straw Hat Pirate, Sniper",
      Weapon: "Sniper thing",
      "Fun Fact": "Liar",
      "Favorite Moment": "Enies Lobby",
    },
    imagePath: require("../assets/usopp.png"),
  },
  {
    title: "Tony Tony Chopper",
    description: {
      Role: "Straw Hat Pirate, Doctor",
      Weapon: "Human Human",
      "Fun Fact": "Cotton Candy",
      "Favorite Moment": "Doctorine Arc",
    },
    imagePath: require("../assets/chopper.png"),
  },
  {
    title: "Nico Robin",
    description: {
      Role: "Straw Hat Pirate, Archaeologist",
      Weapon: "Flower Flower",
      "Fun Fact": "Randomly got pale",
      "Favorite Moment": "One day you will find friends",
    },
    imagePath: require("../assets/robin.png"),
  },
  {
    title: "Franky",
    description: {
      Role: "Straw Hat Pirate, Shipwright",
      Weapon: "Cyborg",
      "Fun Fact": "Coca Cola",
      "Favorite Moment": "Stopping train",
    },
    imagePath: require("../assets/franky.png"),
  },
  {
    title: "Brook",
    description: {
      Role: "Straw Hat Pirate, Musician",
      Weapon: "Sword",
      "Fun Fact": "...",
      "Favorite Moment": "Bink's Sake",
    },
    imagePath: require("../assets/brook.png"),
  },
  {
    title: "Shanks",
    description: {
      Role: "Red-Haired Pirate, Captain",
      Weapon: "Sword",
      "Fun Fact": "Is Cool",
      "Favorite Moment": "Saving Luffy",
    },
    imagePath: require("../assets/shanks.png"),
  },
];
