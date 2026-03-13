import grandfatherImg from '../assets/grandfather.png';
import daughterImg from '../assets/daughter.png';
import wifeImg from '../assets/wife.png';
import sonImg from '../assets/son.png';
import weddingImg from '../assets/wedding.png';
import familyGardenImg from '../assets/family_garden.png';

export const patient = {
  name: "Ramesh Kumar",
  age: 72,
  location: "Green Park, New Delhi",
  photo: grandfatherImg,
  bio: "You are Ramesh Kumar, a retired professor of Hindi literature from Delhi University. You love reading poetry, gardening, and spending time with your grandchildren. You have lived in Green Park for over 35 years.",
  favoriteThings: ["Reading Premchand novels", "Morning walks in Deer Park", "Listening to classical music", "Gardening roses"],
};

export const familyMembers = [
  {
    id: 1,
    name: "Meera Kumar",
    relationship: "Wife",
    photo: wifeImg,
    bio: "Meera is your loving wife. You have been married for 45 years. She is a wonderful cook and loves to make your favorite dal makhani. She takes care of you every day.",
    funFact: "She always hums old Lata Mangeshkar songs while cooking.",
  },
  {
    id: 2,
    name: "Sarah Kumar",
    relationship: "Daughter",
    photo: daughterImg,
    bio: "Sarah is your daughter. She is 30 years old and works as a doctor at AIIMS hospital. She visits you every weekend and brings your favorite sweets from Bengali Market.",
    funFact: "She used to sit on your lap and listen to your poetry readings as a child.",
  },
  {
    id: 3,
    name: "Arjun Kumar",
    relationship: "Son",
    photo: sonImg,
    bio: "Arjun is your eldest son. He is 35 years old and is a software engineer. He lives nearby in Hauz Khas with his wife Priya and your grandson Aarav.",
    funFact: "He inherited your love for gardening and has a beautiful terrace garden.",
  },
];

export const routines = [
  { id: 1, time: "6:30 AM", activity: "Wake up & morning prayer", icon: "Sun", category: "morning" },
  { id: 2, time: "7:00 AM", activity: "Morning walk in Deer Park", icon: "Footprints", category: "morning" },
  { id: 3, time: "8:00 AM", activity: "Breakfast with Meera", icon: "Coffee", category: "morning" },
  { id: 4, time: "9:00 AM", activity: "Read newspaper & books", icon: "BookOpen", category: "morning" },
  { id: 5, time: "10:00 AM", activity: "Morning medication", icon: "Pill", category: "morning" },
  { id: 6, time: "12:30 PM", activity: "Lunch", icon: "UtensilsCrossed", category: "afternoon" },
  { id: 7, time: "2:00 PM", activity: "Afternoon rest", icon: "Moon", category: "afternoon" },
  { id: 8, time: "4:00 PM", activity: "Tea time & gardening", icon: "Flower2", category: "afternoon" },
  { id: 9, time: "5:30 PM", activity: "Evening medication", icon: "Pill", category: "evening" },
  { id: 10, time: "6:00 PM", activity: "Watch TV or listen to music", icon: "Music", category: "evening" },
  { id: 11, time: "8:00 PM", activity: "Dinner", icon: "UtensilsCrossed", category: "evening" },
  { id: 12, time: "9:30 PM", activity: "Night medication & sleep", icon: "Moon", category: "night" },
];

export const memories = [
  {
    id: 1,
    title: "Our Wedding Day",
    date: "March 15, 1981",
    description: "You married Meera in a beautiful ceremony in Jaipur. It was a grand celebration with over 500 guests. Your mother said it was the happiest day of her life. The mandap was decorated with marigolds and roses.",
    photo: weddingImg,
    category: "milestone",
  },
  {
    id: 2,
    title: "Family Garden Picnic",
    date: "November 2019",
    description: "A wonderful family gathering in Lodhi Garden. All the grandchildren were there. Aarav took his first steps that day, and everyone cheered. Meera had packed her famous aloo parathas.",
    photo: familyGardenImg,
    category: "family",
  },
  {
    id: 3,
    title: "Retirement from Delhi University",
    date: "June 2018",
    description: "After 35 years of teaching Hindi literature, you retired as the Head of Department. Your students organized a farewell where they read your favorite poems. The Vice Chancellor presented you with a lifetime achievement award.",
    photo: null,
    category: "milestone",
  },
  {
    id: 4,
    title: "Arjun's First Day at School",
    date: "April 1996",
    description: "You walked Arjun to his first day at DPS school. He held your hand tightly and didn't want to let go. You promised him ice cream after school, and he finally smiled and went inside.",
    photo: null,
    category: "family",
  },
];

export const aiResponses = {
  "who am i": (p) =>
    `You are ${p.name}. You are ${p.age} years old. ${p.bio}`,
  "where am i": (p) =>
    `You are at home in ${p.location}. This is your house where you have lived for over 35 years. You are safe here.`,
  "what time is it": () => {
    const now = new Date();
    const hours = now.getHours();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    let period = "";
    if (hours < 12) period = "It's morning time.";
    else if (hours < 17) period = "It's afternoon.";
    else if (hours < 21) period = "It's evening.";
    else period = "It's nighttime.";
    return `The time is ${timeStr}. ${period}`;
  },
  "what day is it": () => {
    const now = new Date();
    return `Today is ${now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`;
  },
  default: (p) =>
    `Hello ${p.name}, you are safe at home in ${p.location}. Your family loves you very much. Is there something specific you'd like to know? You can ask me "Who am I?", "Where am I?", or about your family members.`,
};

export const medications = [
  { id: 1, name: "Donepezil", dosage: "10mg", time: "10:00 AM", category: "morning", notes: "Take with breakfast. For memory support.", icon: "💊" },
  { id: 2, name: "Vitamin D3", dosage: "1000 IU", time: "10:00 AM", category: "morning", notes: "Take with food for bone health.", icon: "☀️" },
  { id: 3, name: "Memantine", dosage: "5mg", time: "5:30 PM", category: "evening", notes: "Evening dose. Helps with cognitive function.", icon: "💊" },
  { id: 4, name: "Blood Pressure Med", dosage: "5mg", time: "5:30 PM", category: "evening", notes: "Amlodipine for blood pressure.", icon: "❤️" },
  { id: 5, name: "Melatonin", dosage: "3mg", time: "9:30 PM", category: "night", notes: "Helps with sleep. Take 30 minutes before bed.", icon: "🌙" },
];

export const musicPlaylist = [
  { id: 1, title: "Raag Yaman - Evening Raga", artist: "Pt. Hariprasad Chaurasia", category: "classical", duration: "5:30", emoji: "🎵", url: "/music/raag-yaman.mp3" },
  { id: 2, title: "Raag Bhairavi - Morning Melody", artist: "Pt. Ravi Shankar", category: "classical", duration: "6:15", emoji: "🎶", url: "/music/raag-bhairavi.mp3" },
  { id: 3, title: "Lag Ja Gale", artist: "Lata Mangeshkar", category: "bollywood", duration: "4:20", emoji: "🎤", url: "/music/lag-ja-gale.mp3" },
  { id: 4, title: "Ek Pyar Ka Nagma Hai", artist: "Lata Mangeshkar & Mukesh", category: "bollywood", duration: "4:45", emoji: "💕", url: "/music/ek-pyar-ka-nagma.mp3" },
  { id: 5, title: "Tujhe Dekha Toh", artist: "Kumar Sanu & Lata Mangeshkar", category: "bollywood", duration: "5:10", emoji: "🌹", url: "/music/tujhe-dekha-toh.mp3" },
  { id: 6, title: "Om Jai Jagdish Hare", artist: "Anuradha Paudwal", category: "devotional", duration: "6:00", emoji: "🙏", url: "/music/om-jai-jagdish.mp3" },
  { id: 7, title: "Gayatri Mantra", artist: "Traditional", category: "devotional", duration: "4:30", emoji: "🕉️", url: "/music/gayatri-mantra.mp3" },
  { id: 8, title: "Hanuman Chalisa", artist: "Hariharan", category: "devotional", duration: "8:00", emoji: "🙏", url: "/music/hanuman-chalisa.mp3" },
  { id: 9, title: "Mere Sapno Ki Rani", artist: "Kishore Kumar", category: "bollywood", duration: "4:35", emoji: "🎵", url: "/music/mere-sapno-ki-rani.mp3" },
  { id: 10, title: "Raag Desh - Patriotic Raga", artist: "Ustad Bismillah Khan", category: "classical", duration: "7:00", emoji: "🎶", url: "/music/raag-desh.mp3" },
];

export const ambientSounds = [
  { id: 1, title: "Gentle Rain", emoji: "🌧️", description: "Calming rainfall sounds", url: "/sounds/rain.mp3" },
  { id: 2, title: "Birds Singing", emoji: "🐦", description: "Morning bird chorus", url: "/sounds/birds.mp3" },
  { id: 3, title: "Temple Bells", emoji: "🔔", description: "Peaceful temple ambiance", url: "/sounds/temple.mp3" },
  { id: 4, title: "River Stream", emoji: "🏞️", description: "Flowing water sounds", url: "/sounds/river.mp3" },
  { id: 5, title: "Wind Chimes", emoji: "🎐", description: "Gentle wind chime melody", url: "/sounds/chimes.mp3" },
  { id: 6, title: "Cricket Night", emoji: "🦗", description: "Peaceful night sounds", url: "/sounds/crickets.mp3" },
];

export const timelineEvents = [
  { id: 1, year: 1954, title: "Born in Jaipur", description: "You were born on March 15, 1954 in a loving joint family in Jaipur, Rajasthan. Your father was a schoolteacher.", emoji: "👶", category: "personal" },
  { id: 2, year: 1972, title: "Graduated from Rajasthan University", description: "You completed your Master's in Hindi Literature with distinction. Your professors praised your poetic analysis.", emoji: "🎓", category: "milestone" },
  { id: 3, year: 1976, title: "First Teaching Job", description: "You joined Delhi University as an Assistant Professor of Hindi Literature. You moved to Delhi and started a new life.", emoji: "📚", category: "milestone" },
  { id: 4, year: 1981, title: "Married Meera", description: "You married Meera in a beautiful ceremony in Jaipur with over 500 guests. The mandap was decorated with marigolds and roses.", photo: weddingImg, emoji: "💒", category: "family" },
  { id: 5, year: 1991, title: "Arjun Was Born", description: "Your first child, Arjun, was born. You were so happy you wrote a poem about him that same night.", emoji: "👶", category: "family" },
  { id: 6, year: 1996, title: "Sarah Was Born", description: "Your daughter Sarah was born. She had your eyes and Meera's smile. Arjun was excited to be a big brother.", emoji: "👶", category: "family" },
  { id: 7, year: 2000, title: "Promoted to Professor", description: "You became a full Professor at Delhi University. Your students organized a celebration party.", emoji: "🏆", category: "milestone" },
  { id: 8, year: 2010, title: "Published Poetry Collection", description: "Your poetry collection 'Memories of Monsoon' was published and received critical acclaim.", emoji: "📖", category: "milestone" },
  { id: 9, year: 2018, title: "Retired from Delhi University", description: "After 35 years of teaching, you retired as Head of Department. Students read your favorite poems at the farewell.", emoji: "🎉", category: "milestone" },
  { id: 10, year: 2019, title: "Family Garden Picnic", description: "A wonderful family gathering in Lodhi Garden. Aarav took his first steps that day!", photo: familyGardenImg, emoji: "👨‍👩‍👧‍👦", category: "family" },
  { id: 11, year: 2022, title: "Grandson Aarav's Birthday", description: "Aarav turned 3. You taught him to say 'Dadaji' and he hasn't stopped saying it since!", emoji: "🎂", category: "family" },
];
