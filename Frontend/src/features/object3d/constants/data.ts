export interface ObjectItem {
  name: string;
  emoji: string;
  modelId: string;
  info: string;
}

export interface CategoryData {
  [key: string]: ObjectItem[];
}

export const CATEGORIES = [
  'All',
  'Fruits ',
  'Vegetables ',
  'Animals ',
  'Birds ',
  'Colors ',
  'Shapes ',
  'Vehicles',
];

export const DATA: CategoryData = {
  fruits: [
    { name: 'Apple', 
      emoji: '🍎', 
      modelId: '7306582923d5481bab4dd8844051e502', 
      info: 'An apple is a round fruit that comes in red, green, or yellow colors.It is crunchy, juicy, and tastes sweet or slightly sour.Apples are very healthy and help keep our body strong.They are rich in fiber, which helps in good digestion.Eating apples is good for teeth and helps us stay active.Apples can be eaten raw or used in juices and pies.' },
    { name: 'Banana', emoji: '🍌', modelId: '3739bfcdf2474db986f95ec389f49739', info: 'A banana is a long, yellow fruit with a soft inside.It tastes sweet and is easy to eat and digest.Bananas give us instant energy and make us feel full.They are rich in potassium, which is good for muscles.Bananas help us stay active and strong during the day.They are often eaten as a snack or added to milkshakes.' },
    { name: 'Mango', emoji: '🥭', modelId: 'c0c60e60566d4fad83b8118962f83936', info: 'Mango is called the king of fruits because it is very tasty.It is yellow or orange inside and very juicy.Mangoes are rich in vitamins that help us grow healthy.They give energy and make us feel happy and active.Mangoes grow mostly in summer season.They are eaten fresh or made into shakes and desserts.' },
    { name: 'Orange', emoji: '🍊', modelId: 'cbdf758f21924c168c1c3da1afed9754', info: 'An orange is a round fruit with a bright orange color.It is juicy and has a sweet and tangy taste.Oranges are rich in vitamin C, which helps fight sickness.They keep our skin healthy and make us feel fresh.Oranges are mostly eaten fresh or as juice.They are very refreshing, especially in summer.' },
    { name: 'Grapes', emoji: '🍇', modelId: '2d225287a77a4a8397bfb511d5ed8d18', info: 'Grapes are small, round fruits that grow in bunches.They come in green, red, or purple colors.Grapes are juicy and taste sweet.They give energy and keep our body fresh.Grapes can be eaten raw or dried to make raisins.They are fun to eat and very healthy.' },
    { name: 'Pineapple', emoji: '🍍', modelId: '3debe241ac7e401aa36ae944daa1708e', info: 'Pineapple is a large fruit with a hard, spiky outer skin.Inside, it is yellow, juicy, and sweet.Pineapple helps in digestion and keeps the stomach healthy.It is rich in vitamins and minerals.Pineapples grow in warm places.They are eaten fresh or added to juices and dishes.' },
    { name: 'Strawberry', emoji: '🍓', modelId: 'dd6a424807614544835c8cc4529d6f0d', info: 'Strawberry is a small red fruit with tiny seeds on the outside.It has a sweet and slightly sour taste.Strawberries are rich in vitamins that keep us healthy.They are good for our heart and skin.Strawberries smell very nice and look attractive.They are often used in cakes, ice creams, and milkshakes.' },
    { name: 'Watermelon', emoji: '🍉', modelId: '83f6af2628494e0384a995fcc7815240', info: 'Watermelon is a big fruit with green skin and red inside.It is very juicy and sweet.Watermelon contains a lot of water and keeps us hydrated.It is perfect to eat in hot summer days.Watermelon seeds are black or white.This fruit keeps our body cool and fresh.' },
    { name: 'Papaya', emoji: '🍈', modelId: 'a5d253b0abfd445a8013f58cd001ee97', info: 'Papaya is a soft fruit with orange-colored flesh.It tastes sweet and is very good for digestion.Papaya contains many vitamins that keep our body healthy.It helps our stomach work properly.Papaya seeds are black and not usually eaten.This fruit is often eaten in the morning.' },
    { name: 'Guava', emoji: '🍐', modelId: '81e236ac2bf341b385923c68cc08d15b', info: 'Guava is a green or yellow fruit with many small seeds.It tastes sweet or slightly sour.Guava is very rich in vitamin C, even more than oranges.It helps keep us strong and protects us from colds.Guava is also good for digestion.It can be eaten with or without the peel.' }
  ],
  vegetables: [
    {
      name: 'Carrot',
      emoji: '🥕',
      modelId: '58d1b7b817124904a831def938be3b0b',
      info: 'Carrot is an orange root vegetable that grows under the soil. It is crunchy and slightly sweet in taste. Carrots are rich in vitamin A, which helps keep our eyes healthy. Eating carrots helps us see better, especially at night. They also make our skin healthy. Carrots can be eaten raw or cooked in food.'
    },
    {
      name: 'Potato',
      emoji: '🥔',
      modelId: '0f4be86441694633b42c764a4574fd41',
      info: 'Potato is a vegetable that grows under the ground. It is soft inside and tastes good when cooked. Potatoes give us energy because they contain carbohydrates. They can be boiled, fried, or mashed. Potatoes are eaten all over the world. They help us feel full and strong.'
    },
    {
      name: 'Tomato',
      emoji: '🍅',
      modelId: '201d42a9e5e54f1b836eff39a892ed88',
      info: 'Tomato is a red and juicy fruit that is used as a vegetable. It has a slightly sweet and sour taste. Tomatoes are rich in vitamin C, which helps protect us from sickness. They keep our skin healthy and fresh. Tomatoes are used in curries, salads, and sauces. They make food tasty and colorful.'
    },
    {
      name: 'Onion',
      emoji: '🧅',
      modelId: '2e546b2c6a4c4e698fa203c7302ea3a6',
      info: 'Onion is a round vegetable with many layers. It can make our eyes water when cut. Onions add flavor to many dishes. They help keep our body healthy and strong. Onions can be eaten raw or cooked. They are used in almost every kitchen.'
    },
    {
      name: 'Brinjal',
      emoji: '🍆',
      modelId: 'fb8ce6ab87d74000b96eaceddb69fcd1',
      info: 'Brinjal is a purple vegetable also called eggplant. It has a soft inside and mild taste. Brinjal is cooked in many different dishes. It helps keep our body healthy. This vegetable absorbs flavors very well. It is eaten in curries and fried snacks.'
    },
    {
      name: 'Cabbage',
      emoji: '🥬',
      modelId: 'a2ce58a7c4a64a42bfb13af2350d18db',
      info: 'Cabbage is a leafy green vegetable that grows in a round shape. It has many layers of leaves. Cabbage is good for digestion and health. It is rich in vitamins and fiber. Cabbage can be eaten raw in salads or cooked. It helps keep our stomach healthy.'
    },
    {
      name: 'Spinach',
      emoji: '🥬',
      modelId: '2def7f9fd64548ad8351c753da1e10c9',
      info: 'Spinach is a green leafy vegetable. It is very healthy and full of iron. Spinach helps make our blood strong. It gives us energy and strength. Spinach can be eaten cooked or added to dishes. It is very good for growing children.'
    },
    {
      name: 'Peas',
      emoji: '🟢',
      modelId: 'c21fb364c1c0438aabada9fba81cf564',
      info: 'Peas are small green seeds that grow inside pods. They are soft and sweet in taste. Peas are rich in protein and vitamins. They help us grow strong and healthy. Peas are used in many dishes. Children love eating peas because they are tasty.'
    },
    {
      name: 'Corn',
      emoji: '🌽',
      modelId: '3205e25c61934f1d9d3abb5db2a37d9d',
      info: 'Corn is a yellow vegetable that grows on a cob. It is sweet and crunchy. Corn gives us energy and keeps us active. It is eaten boiled, roasted, or cooked. Corn is enjoyed by people all over the world. It is fun and tasty to eat.'
    },
    {
      name: 'Broccoli',
      emoji: '🥦',
      modelId: '8c6f607b7f7b403199b74f9b631922a8',
      info: 'Broccoli is a green vegetable that looks like a small tree. It is very healthy and full of vitamins. Broccoli helps keep our bones strong. It protects our body from sickness. Broccoli can be eaten cooked or steamed. It is very good for growing children.'
    }
  ],
  animals: [
    {
      name: 'Lion',
      emoji: '🦁',
      modelId: '6c47a31a7ad74b19981f27917fbd8a53',
      info: 'Lion is a big wild animal known as the king of the jungle. It has a strong body and sharp teeth. Male lions have a thick mane around their head. Lions live in groups called prides. They are brave and powerful animals. Lions mostly live in forests and grasslands.'
    },
    {
      name: 'Tiger',
      emoji: '🐅',
      modelId: '2472faceb5f74008a2ac1322202ec585',
      info: 'Tiger is a large wild cat with orange fur and black stripes. Each tiger has a unique stripe pattern. Tigers are strong hunters and run very fast. They are good swimmers and love water. Tigers usually live alone in forests. They are one of the strongest animals.'
    },
    {
      name: 'Elephant',
      emoji: '🐘',
      modelId: '78ce17c0b1f84563967bfbd3fc68d85c',
      info: 'Elephant is the largest land animal in the world. It has a long trunk and big ears. Elephants use their trunk to eat, drink, and spray water. They are very intelligent and have good memory. Elephants live in groups called herds. They are gentle and friendly animals.'
    },
    {
      name: 'Dog',
      emoji: '🐕',
      modelId: 'e395f26615ca445ab32f01ded17ff3bf',
      info: 'Dog is a loyal and friendly pet animal. It loves to play and stay with humans. Dogs help guard homes and protect people. They have a strong sense of smell. Dogs come in many sizes and colors. They are called man’s best friend.'
    },
    {
      name: 'Cat',
      emoji: '🐈',
      modelId: 'ddf80c6ba168449682c9de3939d8fd18',
      info: 'Cat is a small and soft pet animal. It likes to sleep and play quietly. Cats are very good climbers and jumpers. They can see well in the dark. Cats make a purring sound when they are happy. They keep homes free from rats.'
    },
    {
      name: 'Horse',
      emoji: '🐴',
      modelId: 'bc691d16cf744d6490c9f1a97aa1bbf3',
      info: 'Horse is a strong and fast animal. It is used for riding and pulling carts. Horses can run very quickly for long distances. They have strong legs and smooth hair. Horses have helped humans for many years. They are gentle and intelligent animals.'
    },
    {
      name: 'Cow',
      emoji: '🐄',
      modelId: '99d333e3b4e4470a8d7d38436489c001',
      info: 'Cow is a farm animal that gives us milk. Milk is used to make curd, butter, and cheese. Cows are calm and gentle animals. They eat grass and plants. Cows live in groups called herds. They are very useful to humans.'
    },
    {
      name: 'Monkey',
      emoji: '🐵',
      modelId: '50e4b1da03494429b1265fc095f2c530',
      info: 'Monkey is a playful animal that lives on trees. It uses its tail to balance and swing. Monkeys love eating fruits and nuts. They are very smart and active animals. Monkeys live in groups. They like to jump and play all day.'
    },
    {
      name: 'Bear',
      emoji: '🐻',
      modelId: '8cec0e6615574edf9ffd4ef45338e0da',
      info: 'Bear is a big and strong wild animal. It has thick fur to keep warm. Bears eat fruits, fish, and honey. They sleep for a long time in winter, called hibernation. Bears can stand on two legs. They live in forests and mountains.'
    },
    {
      name: 'Deer',
      emoji: '🦌',
      modelId: '29b42ccfdb494968ae9dfa5a8cef0e79',
      info: 'Deer is a gentle and graceful animal. Male deer have antlers on their head. Deer run very fast to escape danger. They eat grass, leaves, and plants. Deer usually live in forests. They are shy and quiet animals.'
    }
  ],
  birds: [
    {
      name: 'Parrot',
      emoji: '🦜',
      modelId: '92e36afa506e492eabc12b6fd34c45c9',
      info: 'Parrot is a colorful bird with a curved beak. It can copy sounds and sometimes human speech. Parrots are very intelligent birds. They eat fruits, seeds, and nuts. Parrots live on trees and like warm places. They are playful and friendly birds.'
    },
    {
      name: 'Eagle',
      emoji: '🦅',
      modelId: '707fff56fc93437c81c12674b4736f92',
      info: 'Eagle is a strong bird with wide wings. It has very sharp eyesight and can see far away. Eagles hunt small animals for food. They fly very high in the sky. Eagles build nests on tall trees or mountains. They are symbols of strength and courage.'
    },
    {
      name: 'Owl',
      emoji: '🦉',
      modelId: 'cc55d47eda3e4e90b246b35276b480aa',
      info: 'Owl is a bird that stays awake at night. It can turn its head almost all the way around. Owls have big eyes that help them see in the dark. They hunt small animals quietly. Owls sleep during the day. They live on trees and in forests.'
    },
    {
      name: 'Penguin',
      emoji: '🐧',
      modelId: '76f67a2fcbd44135bb11dd044ab4d4fb',
      info: 'Penguin is a bird that cannot fly but swims very well. It lives in very cold places. Penguins have black and white bodies. They use their wings like flippers in water. Penguins walk by waddling. They eat fish and stay in groups.'
    },
    {
      name: 'Peacock',
      emoji: '🦚',
      modelId: '77ebfe2aa4084e239bebb760bc848363',
      info: 'Peacock is a beautiful bird with colorful feathers. Male peacocks have long tails with eye-shaped designs. Peacocks spread their feathers when they dance. They eat grains, insects, and seeds. Peacocks live in forests and gardens. It is the national bird of India.'
    },
    {
      name: 'Sparrow',
      emoji: '🐦',
      modelId: '66a488ab51894f43aca25d2838216619',
      info: 'Sparrow is a small and brown bird. It is commonly seen near houses. Sparrows eat grains and insects. They live in groups and chirp happily. Sparrows build nests on trees and buildings. They are friendly and social birds.'
    },
    {
      name: 'Swan',
      emoji: '🦢',
      modelId: '041e5f20ed774d658e26062a15e421e0',
      info: 'Swan is a large white bird with a long neck. It swims gracefully on water. Swans have strong wings and can fly. They eat plants and small water animals. Swans usually live near lakes and rivers. They are calm and elegant birds.'
    },
    {
      name: 'Flamingo',
      emoji: '🦩',
      modelId: 'b363f8f4f7394ddb9d5b3a337f2f7fc7',
      info: 'Flamingo is a tall bird with pink feathers. It often stands on one leg. Flamingos get their pink color from the food they eat. They live near lakes and water bodies. Flamingos eat small plants and tiny water animals. They live and move in large groups.'
    },
    {
      name: 'Duck',
      emoji: '🦆',
      modelId: '1ef90928c6994bb28d8069069dd5adce',
      info: 'Duck is a water bird with webbed feet. It can swim, walk, and fly. Ducks have flat beaks to eat food from water. They live near ponds and lakes. Ducks eat plants, insects, and grains. They make a quacking sound.'
    },
    {
      name: 'Crow',
      emoji: '🐦‍⬛',
      modelId: 'd5a9b0df4da3493688b63ce42c8a83e2',
      info: 'Crow is a black bird known for its intelligence. It can recognize people and remember things. Crows eat grains, fruits, and leftovers. They are very clever birds. Crows live near homes and trees. They help keep the environment clean.'
    }
  ],
  colors: [
    {
      name: 'Red',
      emoji: '🔴',
      modelId: 'dc5a0c0c439942d58d038a10d7064c91',
      info: 'Red is a bright and strong color. It is the color of apples, roses, and fire. Red shows energy, love, and excitement. It is also used in stop signs to warn us. Red helps us feel active and alert. It is one of the most noticeable colors.'
    },
    {
      name: 'Blue',
      emoji: '🔵',
      modelId: '9fd977075be94764acd332e4aceca29c',
      info: 'Blue is a calm and cool color. It is the color of the sky and the ocean. Blue makes us feel peaceful and relaxed. It is often linked with trust and calmness. Blue is a very soothing color. Many people like blue because it feels gentle.'
    },
    {
      name: 'Green',
      emoji: '🟢',
      modelId: 'dc55e5313054433d8af7c4888f2f66c2',
      info: 'Green is the color of plants and trees. It shows growth and freshness. Green helps our eyes feel relaxed. It reminds us of nature and gardens. Green makes us feel healthy and calm. It is a very refreshing color.'
    },
    {
      name: 'Yellow',
      emoji: '🟡',
      modelId: 'zbfpTyuC5zKAxaTTso5EUfH701g',
      info: 'Yellow is a bright and happy color. It is the color of the sun and sunshine. Yellow makes us feel cheerful and energetic. It helps us feel warm and positive. Yellow is easy to notice from far away. It is a fun and joyful color.'
    },
    {
      name: 'Orange',
      emoji: '🟠',
      modelId: 'a9d71a86a8344606be0e512669b4acc5',
      info: 'Orange is a lively and warm color. It is a mix of red and yellow. Orange is the color of oranges and carrots. It makes us feel excited and creative. Orange shows energy and happiness. It is a bright and friendly color.'
    },
    {
      name: 'Purple',
      emoji: '🟣',
      modelId: '0dac26b734334ae6bbd6ed1bad985846',
      info: 'Purple is a rich and beautiful color. It is made by mixing red and blue. Purple is often linked with royalty and wisdom. It looks calm and magical. Purple is seen in flowers and clothes. It is a special and elegant color.'
    },
    {
      name: 'Pink',
      emoji: '🩷',
      modelId: '4c0e447ff84542f5a1e2b6af98bc4617',
      info: 'Pink is a soft and gentle color. It shows love, care, and kindness. Pink is made by mixing red and white. It feels calm and friendly. Pink is often seen in flowers and toys. It is a sweet and pleasant color.'
    },
    {
      name: 'Brown',
      emoji: '🟤',
      modelId: 'fce62985f84a41b0a5093117ba650bf1',
      info: 'Brown is the color of soil, wood, and chocolate. It reminds us of the earth and trees. Brown makes us feel safe and comfortable. It is a natural and warm color. Brown is found in many animals and plants. It is a strong and steady color.'
    },
    {
      name: 'Black',
      emoji: '⚫',
      modelId: '30c33a45cdfe45afb5a5462e63dc5cb5',
      info: 'Black is a dark and strong color. It is the color of night and shadows. Black helps other colors look brighter. It shows power and elegance. Black is used in clothes and objects. It is a bold and serious color.'
    },
    {
      name: 'White',
      emoji: '⚪',
      modelId: '21998befc81b4cf88e494b051bb2b1db',
      info: 'White is a clean and bright color. It is the color of milk and clouds. White shows purity and cleanliness. It makes places look fresh and neat. White helps other colors stand out. It is a calm and simple color.'
    }
  ],
  shapes: [
    {
      name: 'Circle',
      emoji: '⭕',
      modelId: '28d64d2115b04ee5ab7d9d0f013701af',
      info: 'A circle is a round shape with no corners. It has no sides and is smooth all around. Many objects like wheels and coins are circles. A circle can roll easily. It looks the same from every side. Circles are found everywhere around us.'
    },
    {
      name: 'Square',
      emoji: '⬜',
      modelId: '6330cc0bdeea4fa8a1ac9342a4bb265e',
      info: 'A square is a shape with four equal sides. It has four corners and four straight edges. All the sides are the same length. Many tiles and boards are square shaped. Squares look neat and balanced. It is a very common shape.'
    },
    {
      name: 'Triangle',
      emoji: '🔺',
      modelId: 'bc1347f9a1ca4f7d9d365593f907f1bf',
      info: 'A triangle is a shape with three sides and three corners. It can look tall or short. Triangles are very strong shapes. They are used in bridges and buildings. A slice of pizza looks like a triangle. It is a simple but important shape.'
    },
    {
      name: 'Rectangle',
      emoji: '▬',
      modelId: '4cdf970a315c47e6957ab8f7f05b5e38',
      info: 'A rectangle has four sides and four corners. Opposite sides are equal in length. Doors, books, and screens are rectangles. Rectangles look long or wide. They are easy to find around us. It is a very useful shape.'
    },
    {
      name: 'Star',
      emoji: '⭐',
      modelId: '5296c3fcf6c24e99a07de7cc77cb1209',
      info: 'A star is a shape with pointed edges. It shines brightly in the sky at night. Star shapes are used to show excellence. Stars are seen on flags and medals. They look bright and beautiful. Children love star shapes.'
    },
    {
      name: 'Heart',
      emoji: '❤️',
      modelId: '6f815b9822dc479eae0a17b8dcab9c75',
      info: 'A heart shape shows love and care. It has two round tops and one pointed bottom. Heart shapes are used to show feelings. We see hearts in cards and drawings. It is a soft and friendly shape. It makes people feel happy.'
    },
    {
      name: 'Diamond',
      emoji: '♦️',
      modelId: 'a4faa63457fb4db3ae7381db8be7d822',
      info: 'A diamond shape looks like a tilted square. It has four equal sides and sharp corners. Diamond shapes are seen on playing cards. A diamond is also a precious stone. This shape looks shiny and strong. It is easy to recognize.'
    },
    {
      name: 'Oval',
      emoji: '⬭',
      modelId: '1021b36999684deab4c2b77a8fc76ec9',
      info: 'An oval is a stretched circle shape. It has no corners or sharp edges. Eggs are oval in shape. Ovals are smooth and soft looking. Many fruits are oval shaped. It is a gentle and simple shape.'
    },
    {
      name: 'Hexagon',
      emoji: '⬡',
      modelId: 'a62a691523564c659673a4147b1212af',
      info: 'A hexagon is a shape with six sides. All sides are usually equal in size. Honeycombs are made of hexagons. Hexagons fit together perfectly. This shape is very strong. It is found in nature and designs.'
    },
    {
      name: 'Arrow',
      emoji: '➡️',
      modelId: 'b180f7cb66c84801b52d6d2985a6eca1',
      info: 'An arrow is a shape that points in a direction. It helps show where to go. Arrows are used on roads and signs. They help guide people. Arrow shapes are simple and useful. They show movement clearly.'
    }
  ],
  vehicles: [
    {
      name: 'Car',
      emoji: '🚗',
      modelId: 'd01b254483794de3819786d93e0e1ebf',
      info: 'A car is a vehicle with four wheels. It is used to travel from one place to another. Cars can carry families and luggage. Some cars run on petrol, diesel, or electricity. Cars make travel faster and comfortable. They are commonly used on roads.'
    },
    {
      name: 'Bus',
      emoji: '🚌',
      modelId: 'cf2dd11a405546baa8a8f14d8d5da0bc',
      info: 'A bus is a large vehicle that carries many people. It is used for public transport. Buses stop at bus stops to pick up passengers. They help reduce traffic on roads. Buses are used for school and city travel. They are very useful for daily travel.'
    },
    {
      name: 'Train',
      emoji: '🚂',
      modelId: 'fbf69610cea1411cae1c2eec5288839d',
      info: 'A train is a long vehicle that runs on tracks. It can carry many people and goods. Trains travel long distances very fast. They have many coaches joined together. Trains stop at railway stations. They are an important means of transport.'
    },
    {
      name: 'Airplane',
      emoji: '✈️',
      modelId: '02c4fa44604243c2bb48db64506a39af',
      info: 'An airplane is a vehicle that flies in the sky. It helps people travel very fast over long distances. Airplanes have wings and engines. They take off from airports. Airplanes can cross oceans and countries. They are used for long journeys.'
    },
    {
      name: 'Bicycle',
      emoji: '🚲',
      modelId: 'da54c239e58a41b0b04c0b3f52d33302',
      info: 'A bicycle has two wheels and is moved by pedaling. It does not need fuel. Riding a bicycle keeps us healthy and strong. It is good for the environment. Bicycles are used for short trips. Children enjoy riding bicycles.'
    },
    {
      name: 'Motorcycle',
      emoji: '🏍️',
      modelId: '77922f619f0c4f2e82ee2b9b26895a96',
      info: 'A motorcycle is a two-wheeled vehicle with an engine. It is faster than a bicycle. Motorcycles are used for quick travel. Riders wear helmets for safety. Motorcycles need fuel to run. They are easy to ride in traffic.'
    },
    {
      name: 'Boat',
      emoji: '🚤',
      modelId: 'cbb811fcff61474797a11d2cc56a1d97',
      info: 'A boat is a vehicle that moves on water. Boats are used in rivers, lakes, and seas. Some boats are small and some are very big. Boats can carry people and goods. Fishermen use boats for fishing. Boats help in water travel.'
    },
    {
      name: 'Truck',
      emoji: '🚚',
      modelId: 'c49f06353e56498bb4b50892d9e04d76',
      info: 'A truck is a large vehicle used to carry goods. It can carry heavy loads. Trucks move items from one place to another. They are important for shops and factories. Trucks travel on highways and roads. They help in transportation of goods.'
    },
    {
      name: 'Helicopter',
      emoji: '🚁',
      modelId: 'aaa0f861e8784f449ccc47ed0864b3b4',
      info: 'A helicopter is a flying vehicle with spinning blades. It can go straight up and down. Helicopters can land in small places. They are used for rescue and emergencies. Helicopters are also used by police and doctors. They are very useful in hard places.'
    },
    {
      name: 'Rocket',
      emoji: '🚀',
      modelId: '60f407824484476f83d70608912e87dc',
      info: 'A rocket is a powerful vehicle that goes into space. It moves very fast using strong engines. Rockets help send astronauts to space. They also carry satellites. Rockets can travel beyond Earth. They help us learn about space.'
    }
  ]
};
