class CharadesGenerator {
    constructor() {
        this.charadesData = {
                movies: [
                { text: "Titanic", hint: "Pretend the floor tilts, cling to something, shiver like it’s freezing" },
                { text: "Harry Potter", hint: "Hold an imaginary wand and cast spells dramatically" },
                { text: "Friends", hint: "Sit casually, gesture like chatting, overreact to jokes" },
                { text: "The Lion King", hint: "Crawl like a lion, roar, or lift something overhead proudly" },
                { text: "Star Wars", hint: "Swing a lightsaber and use the Force with your hand" },
                { text: "Jurassic Park", hint: "Act terrified, look around slowly, mime a giant dinosaur" },
                { text: "The Matrix", hint: "Lean backward in slow motion dodging bullets" },
                { text: "Avengers", hint: "Strike superhero poses and punch imaginary enemies" },
                { text: "Frozen", hint: "Shiver, then throw arms out like creating ice" },
                { text: "Spider-Man", hint: "Shoot webs from wrists and climb walls" },
                { text: "The Office", hint: "Type awkwardly and glance at an invisible camera" },
                { text: "Breaking Bad", hint: "Mix chemicals carefully, then act intense" },
                { text: "Game of Thrones", hint: "Swing a sword or sit regally on a throne" },
                { text: "Stranger Things", hint: "Hold a walkie-talkie and react to something scary" },
                { text: "The Simpsons", hint: "Overact like a cartoon with exaggerated movements" },
                { text: "Toy Story", hint: "Freeze suddenly like a toy, then move again" },
                { text: "Finding Nemo", hint: "Swim like a fish while looking worried" },
                { text: "Inception", hint: "Pretend gravity shifts or spin something mysteriously" },
                { text: "Batman", hint: "Spread a cape and crouch dramatically" },
                { text: "Lord of the Rings", hint: "Sneak while holding a precious ring" },
                { text: "Shrek", hint: "Walk heavily, scratch, and act grumpy" },
                { text: "Pirates of the Caribbean", hint: "Stagger like a pirate and steer a ship" },
                { text: "Back to the Future", hint: "Check your watch and race forward" },
                { text: "Home Alone", hint: "React in pain, scream silently, slip and fall" },
                { text: "Jaws", hint: "Swim slowly, then snap jaws suddenly" },
                { text: "Mean Girls", hint: "Flip hair, whisper, judge others dramatically" },
                { text: "Forrest Gump", hint: "Run in place with determination" },
                { text: "Indiana Jones", hint: "Crack a whip and dodge traps" },
                { text: "Mission Impossible", hint: "Crawl low, dodge lasers, sneak intensely" },
                { text: "Squid Game", hint: "Freeze completely, then panic" },
                { text: "Avatar", hint: "Move gracefully, pretend you have a tail" },
                { text: "The Hunger Games", hint: "Aim a bow and hide cautiously" },
                { text: "Fast & Furious", hint: "Steer wildly and shift gears" },
                { text: "Rocky", hint: "Box the air and celebrate" },
                { text: "Ghostbusters", hint: "Aim a proton pack and get pulled back" },
                { text: "The Wizard of Oz", hint: "Skip forward like following a path" },
                { text: "Kung Fu Panda", hint: "Clumsy martial arts moves" },
                { text: "Black Panther", hint: "Cross arms on chest and crouch" },
                { text: "Despicable Me", hint: "Hunch shoulders and act sneaky" },
                { text: "Monsters Inc.", hint: "Roar loudly, then act scared" },
                { text: "Seinfeld", hint: "Shrug and complain dramatically" },
                { text: "Mad Max", hint: "Drive aggressively and scan the horizon" },
                { text: "Planet of the Apes", hint: "Walk hunched and gesture like an ape" },
                { text: "Doctor Who", hint: "Check watch and run urgently" },
                { text: "The Big Bang Theory", hint: "Gesture excitedly while explaining nerdy things" },
                { text: "Coco", hint: "Strum a guitar and look emotional" },
                { text: "Gladiator", hint: "Sword fight and salute the crowd" },
                { text: "Aladdin", hint: "Rub a lamp and soar on a carpet" }
                ],

                books: [
                { text: "Harry Potter", hint: "Wave a wand and cast spells" },
                { text: "Lord of the Rings", hint: "Sneak while protecting a ring" },
                { text: "Alice in Wonderland", hint: "Shrink down, look confused, explore" },
                { text: "Sherlock Holmes", hint: "Examine clues with a magnifying glass" },
                { text: "Romeo and Juliet", hint: "Act in love, then dramatically collapse" },
                { text: "The Hobbit", hint: "Walk bravely with a backpack" },
                { text: "Charlie and the Chocolate Factory", hint: "Taste candy with amazement" },
                { text: "The Hunger Games", hint: "Aim a bow and hide" },
                { text: "Diary of a Wimpy Kid", hint: "Act awkward and frustrated" },
                { text: "The Cat in the Hat", hint: "Tip an imaginary tall hat mischievously" },
                { text: "Dracula", hint: "Bare fangs and creep forward" },
                { text: "Frankenstein", hint: "Walk stiffly with arms out" },
                { text: "The Great Gatsby", hint: "Toast a drink and gesture grandly" },
                { text: "Cinderella", hint: "Clean floors, then twirl elegantly" },
                { text: "Snow White", hint: "Bite an apple and faint" },
                { text: "Peter Pan", hint: "Fly around and refuse to grow up" },
                { text: "Winnie the Pooh", hint: "Rub belly and search for honey" },
                { text: "Moby Dick", hint: "Scan the sea and harpoon dramatically" },
                { text: "Narnia", hint: "Open a wardrobe and step through" },
                { text: "Pride and Prejudice", hint: "Bow stiffly and act judgmental" },
                { text: "Three Little Pigs", hint: "Build houses and blow them down" },
                { text: "Goldilocks", hint: "Try things, react ‘too hot’ and ‘too cold’" },
                { text: "James and the Giant Peach", hint: "Climb onto something giant" },
                { text: "The Little Prince", hint: "Look curious and explore planets" },
                { text: "Treasure Island", hint: "Follow a map and dig" },
                { text: "The Jungle Book", hint: "Move like animals in the jungle" },
                { text: "A Christmas Carol", hint: "Act grumpy, then joyful" },
                { text: "Hungry Caterpillar", hint: "Eat repeatedly and grow bigger" },
                { text: "Da Vinci Code", hint: "Study art and crack codes" },
                { text: "Percy Jackson", hint: "Fight monsters with a sword" },
                { text: "Twilight", hint: "Act shy, then vampire-like" },
                { text: "The Giving Tree", hint: "Offer things generously" },
                { text: "The Outsiders", hint: "Defend friends and look tough" },
                { text: "Little Women", hint: "Act out different sister personalities" },
                { text: "The Lorax", hint: "Protect trees passionately" },
                { text: "Pinocchio", hint: "Point to nose growing longer" },
                { text: "The Maze Runner", hint: "Run fast and hit invisible walls" },
                { text: "Anne of Green Gables", hint: "Daydream and gesture excitedly" },
                { text: "The Alchemist", hint: "Search and discover meaning" },
                { text: "Gulliver’s Travels", hint: "Act tiny among giants" },
                { text: "Life of Pi", hint: "Row a boat and avoid danger" },
                { text: "Matilda", hint: "Read books and move objects with mind" },
                { text: "Princess Bride", hint: "Sword fight and swoon romantically" },
                { text: "Fahrenheit 451", hint: "Hide books and act nervous" },
                { text: "Catcher in the Rye", hint: "Act confused and rebellious" },
                { text: "Wild Things", hint: "Roar and dance wildly" },
                { text: "Beauty and the Beast", hint: "Transform from scary to gentle" }
                ],

                songs: [
                { text: "Happy", hint: "Smile big and bounce around" },
                { text: "Baby Shark", hint: "Do shark mouth hand motions" },
                { text: "Thriller", hint: "Zombie walk and claw hands" },
                { text: "Let It Go", hint: "Throw arms wide dramatically" },
                { text: "Shape of You", hint: "Outline body shape with hands" },
                { text: "Uptown Funk", hint: "Strut confidently and snap fingers" },
                { text: "Shake It Off", hint: "Shake arms and shrug" },
                { text: "We Will Rock You", hint: "Stomp stomp clap" },
                { text: "Imagine", hint: "Look peaceful and gesture softly" },
                { text: "Dancing Queen", hint: "Spin and dance joyfully" },
                { text: "Bohemian Rhapsody", hint: "Overact dramatically like opera" },
                { text: "Old Town Road", hint: "Ride a horse confidently" },
                { text: "YMCA", hint: "Form letters with arms" },
                { text: "Sweet Caroline", hint: "Sing to a crowd and sway" },
                { text: "Call Me Maybe", hint: "Pretend to call and flirt" },
                { text: "Despacito", hint: "Slow, smooth dancing" },
                { text: "Billie Jean", hint: "Moonwalk and tip hat" },
                { text: "Rolling in the Deep", hint: "Show heartbreak with power" },
                { text: "Single Ladies", hint: "Show off hand with confidence" },
                { text: "Hey Jude", hint: "Encourage a crowd to sing" },
                { text: "Stayin’ Alive", hint: "Disco walk confidently" },
                { text: "Eye of the Tiger", hint: "Box and stare intensely" },
                { text: "Country Roads", hint: "Gesture toward home lovingly" },
                { text: "Poker Face", hint: "Hide emotions completely" },
                { text: "I Will Survive", hint: "Fall, then rise strong" },
                { text: "Gangnam Style", hint: "Horse-riding dance" },
                { text: "Don’t Stop Believin’", hint: "Point upward with hope" },
                { text: "Bad Guy", hint: "Act sneaky and confident" },
                { text: "Firework", hint: "Explode arms outward" },
                { text: "Wonderwall", hint: "Strum guitar and sway" },
                { text: "All of Me", hint: "Gesture heartfelt emotion" },
                { text: "Hotel California", hint: "Enter a place and feel trapped" },
                { text: "Africa", hint: "Point to horizon dramatically" },
                { text: "Chandelier", hint: "Spin wildly like swinging" },
                { text: "Levitating", hint: "Float upward smoothly" },
                { text: "Counting Stars", hint: "Point at stars and dream" },
                { text: "My Heart Will Go On", hint: "Hold arms wide dramatically" },
                { text: "Sorry", hint: "Apologize repeatedly" },
                { text: "Thunder", hint: "Boom arms downward" },
                { text: "Roar", hint: "Clench fists and shout silently" },
                { text: "Blinding Lights", hint: "Cover eyes and stagger" },
                { text: "Hips Don’t Lie", hint: "Dance with hips" },
                { text: "Viva La Vida", hint: "Wear an invisible crown" },
                { text: "Smells Like Teen Spirit", hint: "Headbang wildly" },
                { text: "Waka Waka", hint: "Energetic sports dance" },
                { text: "Take On Me", hint: "Reach forward dramatically" },
                { text: "Beat It", hint: "Break up a fight" },
                { text: "Halo", hint: "Gesture glowing above head" }
                ],

                celebrities: [
                { text: "Taylor Swift", hint: "Pretend to sing and write lyrics" },
                { text: "Beyoncé", hint: "Strike fierce stage poses" },
                { text: "Elvis Presley", hint: "Shake hips and sing" },
                { text: "Michael Jackson", hint: "Moonwalk and grab hat" },
                { text: "The Rock", hint: "Flex muscles and raise eyebrow" },
                { text: "Tom Cruise", hint: "Run intensely forward" },
                { text: "Brad Pitt", hint: "Act cool and confident" },
                { text: "Leonardo DiCaprio", hint: "Toast a drink dramatically" },
                { text: "Oprah Winfrey", hint: "Hand out gifts excitedly" },
                { text: "Rihanna", hint: "Strut confidently like a runway" },
                { text: "Justin Bieber", hint: "Sing with pop-star flair" },
                { text: "Adele", hint: "Sing emotionally with hands on chest" },
                { text: "Barack Obama", hint: "Wave and deliver a speech" },
                { text: "Donald Trump", hint: "Gesture broadly while talking" },
                { text: "Queen Elizabeth", hint: "Wave politely and stand upright" },
                { text: "Albert Einstein", hint: "Messy hair and thinking hard" },
                { text: "Marilyn Monroe", hint: "Pose glamorously" },
                { text: "Lady Gaga", hint: "Strike bold, eccentric poses" },
                { text: "Cristiano Ronaldo", hint: "Kick a ball and celebrate" },
                { text: "Lionel Messi", hint: "Dribble and score a goal" },
                { text: "Serena Williams", hint: "Serve a tennis ball powerfully" },
                { text: "Will Smith", hint: "Act cool and charismatic" },
                { text: "Johnny Depp", hint: "Act quirky and mysterious" },
                { text: "Emma Watson", hint: "Read confidently and speak up" },
                { text: "Morgan Freeman", hint: "Speak slowly with wisdom" },
                { text: "Kim Kardashian", hint: "Pose for cameras" },
                { text: "Kanye West", hint: "Gesture passionately while talking" },
                { text: "Ariana Grande", hint: "Sing high notes dramatically" },
                { text: "Billie Eilish", hint: "Slouch casually and whisper-sing" },
                { text: "Jackie Chan", hint: "Perform comedic martial arts" },
                { text: "Bruce Lee", hint: "Quick martial arts poses" },
                { text: "Madonna", hint: "Strike iconic pop poses" },
                { text: "Keanu Reeves", hint: "Act calm and heroic" },
                { text: "Zendaya", hint: "Model walk and confident pose" },
                { text: "Tom Holland", hint: "Jump and flip energetically" },
                { text: "Selena Gomez", hint: "Sing sweetly and smile" },
                { text: "Shakira", hint: "Dance with hips" },
                { text: "Drake", hint: "Gesture emotionally while rapping" },
                { text: "Eminem", hint: "Rap fast with intense gestures" },
                { text: "MrBeast", hint: "Give away prizes excitedly" },
                { text: "Mark Zuckerberg", hint: "Type and present ideas" },
                { text: "Elon Musk", hint: "Launch a rocket upward" },
                { text: "Steve Jobs", hint: "Present a product confidently" },
                { text: "Mother Teresa", hint: "Care gently for others" },
                { text: "Pope Francis", hint: "Bless and wave warmly" },
                { text: "Gandhi", hint: "Walk calmly and gesture peace" },
                { text: "Abraham Lincoln", hint: "Deliver a historic speech" },
                { text: "Napoleon", hint: "March with authority" },
                { text: "Cleopatra", hint: "Pose regally like royalty" }
                ],

                actions: [
                { text: "Brushing teeth", hint: "Move hand back and forth at mouth" },
                { text: "Dancing", hint: "Move rhythmically to imaginary music" },
                { text: "Sleeping", hint: "Rest head on hands and snore" },
                { text: "Running", hint: "Pump arms and jog in place" },
                { text: "Swimming", hint: "Stroke arms like swimming" },
                { text: "Jumping rope", hint: "Jump while rotating wrists" },
                { text: "Cooking", hint: "Stir and taste food" },
                { text: "Baking", hint: "Mix batter and put in oven" },
                { text: "Driving", hint: "Hold steering wheel and turn" },
                { text: "Flying a kite", hint: "Pull string and look up" },
                { text: "Playing basketball", hint: "Dribble and shoot" },
                { text: "Playing soccer", hint: "Kick an imaginary ball" },
                { text: "Fishing", hint: "Cast a line and reel in" },
                { text: "Reading", hint: "Open a book and scan pages" },
                { text: "Writing", hint: "Write carefully on paper" },
                { text: "Taking a selfie", hint: "Hold phone and pose" },
                { text: "Washing dishes", hint: "Scrub plates" },
                { text: "Vacuuming", hint: "Push vacuum back and forth" },
                { text: "Doing yoga", hint: "Hold a calm stretching pose" },
                { text: "Lifting weights", hint: "Lift heavy imaginary weights" },
                { text: "Ice skating", hint: "Glide smoothly and wobble" },
                { text: "Skiing", hint: "Lean forward and pole push" },
                { text: "Surfing", hint: "Balance and ride a wave" },
                { text: "Riding a bike", hint: "Pedal and steer" },
                { text: "Playing guitar", hint: "Strum and rock out" },
                { text: "Singing", hint: "Sing dramatically" },
                { text: "Painting", hint: "Brush strokes on canvas" },
                { text: "Gardening", hint: "Dig and plant seeds" },
                { text: "Camping", hint: "Set up a tent" },
                { text: "Hiking", hint: "Climb uphill with effort" },
                { text: "Bowling", hint: "Roll a heavy ball" },
                { text: "Gaming", hint: "Hold controller and react" },
                { text: "Texting", hint: "Type rapidly on phone" },
                { text: "Shopping", hint: "Browse shelves and compare" },
                { text: "Wrapping a gift", hint: "Wrap and tape carefully" },
                { text: "Opening a present", hint: "Rip paper excitedly" },
                { text: "Shoveling snow", hint: "Scoop and toss snow" },
                { text: "Taking photos", hint: "Hold camera and click" },
                { text: "Doing laundry", hint: "Load washer and fold clothes" },
                { text: "Making coffee", hint: "Pour and sip carefully" },
                { text: "Stretching", hint: "Reach arms and legs" },
                { text: "Clapping", hint: "Clap hands repeatedly" },
                { text: "Sneezing", hint: "Build up and burst" },
                { text: "Laughing", hint: "Shake shoulders laughing" },
                { text: "Crying", hint: "Wipe tears dramatically" },
                { text: "Whistling", hint: "Pucker lips and blow" },
                { text: "Meditating", hint: "Sit still and breathe deeply" },
                { text: "Doing push-ups", hint: "Lower and raise body" },
                { text: "High-fiving", hint: "Raise hand and slap air" }
                ],

                objects: [
                { text: "Toothbrush", hint: "Brush teeth vigorously" },
                { text: "Smartphone", hint: "Swipe and tap screen" },
                { text: "Laptop", hint: "Type and open screen" },
                { text: "Television", hint: "Change channels with remote" },
                { text: "Remote control", hint: "Point and click buttons" },
                { text: "Chair", hint: "Pull out and sit" },
                { text: "Table", hint: "Wipe surface" },
                { text: "Bed", hint: "Lie down and sleep" },
                { text: "Pillow", hint: "Fluff and rest head" },
                { text: "Blanket", hint: "Wrap around shoulders" },
                { text: "Sunglasses", hint: "Put on coolly" },
                { text: "Watch", hint: "Check time on wrist" },
                { text: "Backpack", hint: "Put on shoulders" },
                { text: "Wallet", hint: "Pull out money" },
                { text: "Keys", hint: "Unlock a door" },
                { text: "Umbrella", hint: "Open above head" },
                { text: "Water bottle", hint: "Twist cap and drink" },
                { text: "Coffee mug", hint: "Sip carefully" },
                { text: "Plate", hint: "Serve food" },
                { text: "Fork", hint: "Stab food and eat" },
                { text: "Spoon", hint: "Scoop and eat" },
                { text: "Knife", hint: "Slice food" },
                { text: "Frying pan", hint: "Flip food in pan" },
                { text: "Refrigerator", hint: "Open door and grab food" },
                { text: "Microwave", hint: "Press buttons and wait" },
                { text: "Oven", hint: "Put food in and close door" },
                { text: "Lamp", hint: "Turn light on" },
                { text: "Book", hint: "Open and read" },
                { text: "Pen", hint: "Write quickly" },
                { text: "Notebook", hint: "Flip pages and write" },
                { text: "Headphones", hint: "Put on and enjoy music" },
                { text: "Speaker", hint: "Turn up volume" },
                { text: "Camera", hint: "Frame shot and click" },
                { text: "Mirror", hint: "Check reflection" },
                { text: "Clock", hint: "Point at time" },
                { text: "Alarm clock", hint: "Hit snooze angrily" },
                { text: "Fan", hint: "Cool off dramatically" },
                { text: "Air conditioner", hint: "Feel cold air" },
                { text: "Bicycle", hint: "Pedal and steer" },
                { text: "Helmet", hint: "Put on for safety" },
                { text: "Shoes", hint: "Tie laces" },
                { text: "Socks", hint: "Pull onto feet" },
                { text: "Hat", hint: "Tip hat" },
                { text: "Jacket", hint: "Zip up" },
                { text: "Suitcase", hint: "Roll while traveling" },
                { text: "Gift box", hint: "Shake and open" },
                { text: "Balloon", hint: "Blow up and release" },
                { text: "Candle", hint: "Light and blow out" },
                { text: "Soap", hint: "Wash hands thoroughly" }
                ],

                places: [
                { text: "Beach", hint: "Swim, sunbathe, and dig sand" },
                { text: "Airport", hint: "Pull luggage and show ticket" },
                { text: "School", hint: "Sit at desk and raise hand" },
                { text: "Hospital", hint: "Check vitals and care for patient" },
                { text: "Library", hint: "Walk quietly and read" },
                { text: "Park", hint: "Walk dog or picnic" },
                { text: "Zoo", hint: "Point and imitate animals" },
                { text: "Museum", hint: "Observe art carefully" },
                { text: "Movie theater", hint: "Eat popcorn and watch screen" },
                { text: "Restaurant", hint: "Order food and eat" },
                { text: "Cafe", hint: "Sip coffee casually" },
                { text: "Mall", hint: "Browse and carry bags" },
                { text: "Supermarket", hint: "Push cart and shop" },
                { text: "Playground", hint: "Swing and slide" },
                { text: "Gym", hint: "Lift weights" },
                { text: "Swimming pool", hint: "Dive and swim" },
                { text: "Stadium", hint: "Cheer loudly" },
                { text: "Train station", hint: "Check schedule and board" },
                { text: "Bus stop", hint: "Wait and wave bus down" },
                { text: "Hotel", hint: "Check in and carry bags" },
                { text: "Office", hint: "Type and answer phone" },
                { text: "Classroom", hint: "Teach or take notes" },
                { text: "Church", hint: "Sit quietly and pray" },
                { text: "Temple", hint: "Bow respectfully" },
                { text: "Mosque", hint: "Pray on a mat" },
                { text: "Castle", hint: "Stand guard and survey land" },
                { text: "Farm", hint: "Feed animals" },
                { text: "Forest", hint: "Walk through trees quietly" },
                { text: "Desert", hint: "Walk tired under sun" },
                { text: "Mountain", hint: "Climb upward" },
                { text: "River", hint: "Row or swim" },
                { text: "Lake", hint: "Fish or relax" },
                { text: "Waterfall", hint: "Stand amazed by falling water" },
                { text: "Island", hint: "Relax like on vacation" },
                { text: "Volcano", hint: "Erupt dramatically" },
                { text: "Jungle", hint: "Push through vines" },
                { text: "City", hint: "Rush through crowds" },
                { text: "Village", hint: "Wave to neighbors" },
                { text: "Bridge", hint: "Walk across carefully" },
                { text: "Tunnel", hint: "Walk through echoing space" },
                { text: "Amusement park", hint: "Ride rollercoaster" },
                { text: "Carnival", hint: "Play games and cheer" },
                { text: "Circus", hint: "Perform tricks" },
                { text: "Resort", hint: "Relax luxuriously" },
                { text: "Campground", hint: "Set up tent" },
                { text: "Parking lot", hint: "Search for your car" },
                { text: "Gas station", hint: "Pump gas" },
                { text: "Police station", hint: "Investigate crime" },
                { text: "Fire station", hint: "Slide down pole and rush out" }
                ],

                animals: [
                { text: "Dog", hint: "Pant, wag tail, and bark silently" },
                { text: "Cat", hint: "Stretch, groom, and ignore others" },
                { text: "Elephant", hint: "Swing arm like a trunk" },
                { text: "Lion", hint: "Roar and stalk proudly" },
                { text: "Tiger", hint: "Crouch and pounce" },
                { text: "Bear", hint: "Walk heavily and growl" },
                { text: "Giraffe", hint: "Stretch neck high" },
                { text: "Zebra", hint: "Gallop and look alert" },
                { text: "Monkey", hint: "Scratch, climb, and chatter" },
                { text: "Gorilla", hint: "Beat chest and stomp" },
                { text: "Panda", hint: "Eat bamboo lazily" },
                { text: "Kangaroo", hint: "Hop with arms tucked" },
                { text: "Koala", hint: "Cling to tree and sleep" },
                { text: "Horse", hint: "Gallop and neigh" },
                { text: "Cow", hint: "Chew slowly and moo" },
                { text: "Pig", hint: "Snort and roll" },
                { text: "Sheep", hint: "Graze and bleat" },
                { text: "Goat", hint: "Climb and head-butt" },
                { text: "Chicken", hint: "Peck ground and flap wings" },
                { text: "Duck", hint: "Waddle and quack" },
                { text: "Eagle", hint: "Soar with wide wings" },
                { text: "Owl", hint: "Turn head slowly" },
                { text: "Penguin", hint: "Waddle and slide" },
                { text: "Dolphin", hint: "Jump and splash" },
                { text: "Whale", hint: "Swim slowly and spout water" },
                { text: "Shark", hint: "Circle and snap jaws" },
                { text: "Octopus", hint: "Wave eight arms" },
                { text: "Crab", hint: "Walk sideways" },
                { text: "Turtle", hint: "Move slowly with shell" },
                { text: "Snake", hint: "Slither smoothly" },
                { text: "Frog", hint: "Hop and croak" },
                { text: "Butterfly", hint: "Flap arms gently" },
                { text: "Bee", hint: "Buzz and hover" },
                { text: "Ant", hint: "Carry something heavy" },
                { text: "Spider", hint: "Crawl and spin web" },
                { text: "Tree", hint: "Stand tall and sway" },
                { text: "Flower", hint: "Bloom slowly" },
                { text: "Rose", hint: "Bloom carefully, show thorns" },
                { text: "Sunflower", hint: "Turn toward the sun" },
                { text: "Cactus", hint: "Stand stiff and prickly" },
                { text: "Mountain", hint: "Rise upward proudly" },
                { text: "Ocean", hint: "Wave arms like waves" },
                { text: "River", hint: "Flow smoothly" },
                { text: "Rain", hint: "Fall gently from above" },
                { text: "Snow", hint: "Drift slowly down" },
                { text: "Thunder", hint: "Boom suddenly" },
                { text: "Lightning", hint: "Flash sharply" },
                { text: "Rainbow", hint: "Arc arms colorfully" },
                { text: "Wind", hint: "Push air forcefully" },
                { text: "Tornado", hint: "Spin rapidly in place" }
                ]

        };

        // DOM Elements
        this.generateBtn = document.getElementById('generateBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.resetItemsBtn = document.getElementById('resetItemsBtn');
        this.categorySelect = document.getElementById('category');
        this.difficultySelect = document.getElementById('difficulty');
        this.countInput = document.getElementById('count');
        this.countValue = document.getElementById('countValue');
        this.timerSelect = document.getElementById('timer');
        this.charadesOutput = document.getElementById('charadesOutput');
        this.errorMsg = document.getElementById('errorMsg');
        this.currentIndex = document.getElementById('currentIndex');
        this.timerDisplay = document.getElementById('timerDisplay');
        this.prevCardBtn = document.getElementById('prevCardBtn');
        this.nextCardBtn = document.getElementById('nextCardBtn');
        this.team1Score = document.getElementById('team1Score');
        this.team2Score = document.getElementById('team2Score');
        this.team1Add = document.getElementById('team1Add');
        this.team1Remove = document.getElementById('team1Remove');
        this.team2Add = document.getElementById('team2Add');
        this.team2Remove = document.getElementById('team2Remove');
        this.resetScoresBtn = document.getElementById('resetScoresBtn');
        this.startGameBtn = document.getElementById('startGameBtn');
        this.skipBtn = document.getElementById('skipBtn');
        this.showHintsBtn = document.getElementById('showHintsBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.printBtn = document.getElementById('printBtn');

        // State
        this.charades = [];
        this.currentCardIndex = 0;
        this.team1Pts = 0;
        this.team2Pts = 0;
        this.timerInterval = null;
        this.timeRemaining = 0;
        this.showHints = true;
        this.usedItems = new Set(); // Locked items across the session
        this.currentGenerationItems = new Set(); // Items in current generation only

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFooterYear();
    }

    setupEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generate());
        this.clearBtn.addEventListener('click', () => this.clear());
        this.resetItemsBtn.addEventListener('click', () => this.resetItems());
        this.countInput.addEventListener('input', () => {
            this.countValue.textContent = this.countInput.value;
        });
        this.prevCardBtn.addEventListener('click', () => this.previousCard());
        this.nextCardBtn.addEventListener('click', () => this.nextCard());
        this.team1Add.addEventListener('click', () => this.updateScore(1, 1));
        this.team1Remove.addEventListener('click', () => this.updateScore(1, -1));
        this.team2Add.addEventListener('click', () => this.updateScore(2, 1));
        this.team2Remove.addEventListener('click', () => this.updateScore(2, -1));
        this.resetScoresBtn.addEventListener('click', () => this.resetScores());
        this.startGameBtn.addEventListener('click', () => this.startTimer());
        this.skipBtn.addEventListener('click', () => this.nextCard());
        this.showHintsBtn.addEventListener('click', () => this.toggleHints());
        this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        this.downloadBtn.addEventListener('click', () => this.download());
        this.printBtn.addEventListener('click', () => this.print());
    }

    generate() {
        this.clearError();
        
        const category = this.categorySelect.value;
        const count = parseInt(this.countInput.value);
        const difficulty = this.difficultySelect.value;

        if (!count || count < 1 || count > 50) {
            this.showError('Please select a valid number of charades (1-50)');
            return;
        }

        this.charades = [];
        this.currentGenerationItems = new Set();
        this.currentCardIndex = 0;

        const categories = category === 'mixed' ? Object.keys(this.charadesData) : [category];

        for (let i = 0; i < count; i++) {
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];
            const items = this.charadesData[randomCategory];
            let item;
            let attempts = 0;

            do {
                item = items[Math.floor(Math.random() * items.length)];
                attempts++;
            } while ((this.usedItems.has(item.text) || this.currentGenerationItems.has(item.text)) && attempts < 10);

            if (!this.usedItems.has(item.text) && !this.currentGenerationItems.has(item.text)) {
                this.usedItems.add(item.text);
                this.currentGenerationItems.add(item.text);
                this.charades.push({
                    text: item.text,
                    hint: item.hint,
                    category: randomCategory,
                    difficulty: difficulty
                });
            }
        }

        if (this.charades.length === 0) {
            this.showError('No new charades available. All items have been used in this session. Click "Reset Items" to start fresh.');
            return;
        }

        this.displayCard();
        this.updateButtons();
        window.MicroTools.utils.showNotification(`Generated ${this.charades.length} charades!`, 'success');
    }

    displayCard() {
        if (this.charades.length === 0) {
            this.charadesOutput.innerHTML = `
                <div class="empty-state">
                    <h4>No charades generated yet</h4>
                    <p>Click "Generate" to start!</p>
                </div>
            `;
            this.currentIndex.textContent = '0/0';
            return;
        }

        const card = this.charades[this.currentCardIndex];
        let categoryHint = '';
        let supportingHint = '';

        if (this.showHints) {
            const categoryIcons = {
                movies: '🎬',
                books: '📚',
                songs: '🎵',
                celebrities: '⭐',
                actions: '🏃',
                objects: '📦',
                places: '🌍',
                animals: '🐾'
            };
            categoryHint = `<div class="charade-hint">${categoryIcons[card.category] || '?'} ${card.category.charAt(0).toUpperCase() + card.category.slice(1)}</div>`;
            supportingHint = `<div class="charade-supporting-hint">${card.hint}</div>`;
        }

        this.charadesOutput.innerHTML = `
            <div class="charade-card">
                <div class="charade-text">${card.text}</div>
                ${categoryHint}
                ${supportingHint}
            </div>
        `;

        this.currentIndex.textContent = `${this.currentCardIndex + 1}/${this.charades.length}`;
    }

    previousCard() {
        if (this.currentCardIndex > 0) {
            this.currentCardIndex--;
            this.displayCard();
            this.updateButtons();
        }
    }

    nextCard() {
        if (this.currentCardIndex < this.charades.length - 1) {
            this.currentCardIndex++;
            this.displayCard();
            this.updateButtons();
        }
    }

    updateButtons() {
        this.prevCardBtn.disabled = this.currentCardIndex === 0;
        this.nextCardBtn.disabled = this.currentCardIndex === this.charades.length - 1;
    }

    updateScore(team, amount) {
        if (team === 1) {
            this.team1Pts = Math.max(0, this.team1Pts + amount);
            this.team1Score.textContent = this.team1Pts;
        } else {
            this.team2Pts = Math.max(0, this.team2Pts + amount);
            this.team2Score.textContent = this.team2Pts;
        }
    }

    resetScores() {
        this.team1Pts = 0;
        this.team2Pts = 0;
        this.team1Score.textContent = '0';
        this.team2Score.textContent = '0';
        window.MicroTools.utils.showNotification('Scores reset', 'success');
    }

    startTimer() {
        const timerSeconds = parseInt(this.timerSelect.value);
        if (timerSeconds === 0) {
            window.MicroTools.utils.showNotification('No timer selected', 'warning');
            return;
        }

        if (this.timerInterval) clearInterval(this.timerInterval);

        this.timeRemaining = timerSeconds;
        this.updateTimerDisplay();
        this.startGameBtn.disabled = false;
        this.startGameBtn.textContent = 'Restart Timer';

        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();

            if (this.timeRemaining <= 0) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
                window.MicroTools.utils.showNotification('Time\'s up!', 'warning');
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const mins = Math.floor(this.timeRemaining / 60);
        const secs = this.timeRemaining % 60;
        this.timerDisplay.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    toggleHints() {
        this.showHints = !this.showHints;
        this.showHintsBtn.textContent = this.showHints ? 'Hide Hints' : 'Show Hints';
        this.displayCard();
        window.MicroTools.utils.showNotification(this.showHints ? 'Hints & supporting info shown' : 'Hints & supporting info hidden', 'info');
    }

    clear() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.charades = [];
        this.currentGenerationItems.clear();
        this.currentCardIndex = 0;
        this.timeRemaining = 0;
        this.displayCard();
        this.updateButtons();
        this.timerDisplay.textContent = '--:--';
        this.startGameBtn.disabled = false;
        this.startGameBtn.textContent = 'Start Timer';
        this.clearError();
        window.MicroTools.utils.showNotification('Cleared', 'success');
    }

    resetItems() {
        this.usedItems.clear();
        this.charades = [];
        this.currentGenerationItems.clear();
        this.currentCardIndex = 0;
        this.timeRemaining = 0;
        this.displayCard();
        this.updateButtons();
        this.timerDisplay.textContent = '--:--';
        this.startGameBtn.disabled = false;
        this.startGameBtn.textContent = 'Start Timer';
        this.clearError();
        window.MicroTools.utils.showNotification('All items reset. Ready to generate again!', 'success');
    }

    copyToClipboard() {
        if (this.charades.length === 0) {
            window.MicroTools.utils.showNotification('No charades to copy', 'warning');
            return;
        }

        const text = this.charades.map((c, i) => `${i + 1}. ${c.text}`).join('\n');
        window.MicroTools.utils.copyToClipboard(text, this.copyBtn);
    }

    download() {
        if (this.charades.length === 0) {
            window.MicroTools.utils.showNotification('No charades to download', 'warning');
            return;
        }

        const text = this.charades.map((c, i) => `${i + 1}. ${c.text}`).join('\n');
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'charades.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        window.MicroTools.utils.showNotification('Downloaded successfully', 'success');
    }

    print() {
        if (this.charades.length === 0) {
            window.MicroTools.utils.showNotification('No charades to print', 'warning');
            return;
        }

        const printWindow = window.open('', '', 'width=800,height=600');
        const content = this.charades.map((c, i) => `<div>${i + 1}. ${c.text}</div>`).join('');
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Charades</title>
                <style>
                    body { font-family: Arial; margin: 20px; }
                    div { margin: 10px 0; font-size: 16px; }
                </style>
            </head>
            <body>
                <h1>Random Charades</h1>
                ${content}
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }

    showError(message) {
        if (this.errorMsg) {
            this.errorMsg.textContent = message;
            this.errorMsg.classList.add('show');
        }
    }

    clearError() {
        if (this.errorMsg) {
            this.errorMsg.classList.remove('show');
        }
    }

    setupFooterYear() {
        const currentYear = document.getElementById('currentYear');
        if (currentYear) {
            currentYear.textContent = new Date().getFullYear();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CharadesGenerator();
});
