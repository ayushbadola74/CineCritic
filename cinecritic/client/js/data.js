// CineCritic Master Movie Database
const MOVIES_DATABASE = [
  {
    id: 1368337,
    title: "The Odyssey",
    year: 2026,
    genre: ["Action", "Adventure", "Fantasy"],
    rating: 7.7,
    voteCount: 1420,
    runtime: "2h 45m",
    tagline: "The epic return of a king.",
    featured: true,
    isPopular: true,
    isTrending: true,
    isUpcoming: true,
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    overview: "Odysseus, the legendary King of Ithaca, embarks on a long and perilous journey home following the Trojan War. Throughout his voyage, he is forced to confront the whims of gods, mythological monsters, and trials that stretch both his cunning and his humanity to the breaking point.",
    cast: [
      { name: "Matt Damon", character: "Odysseus", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
      { name: "Charlize Theron", character: "Penelope", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" },
      { name: "Willem Dafoe", character: "Teiresias", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80" }
    ],
    reviews: [
      { author: "CinematicMaster", rating: 9, date: "2 days ago", comment: "Breathtaking visual effects and an awesome classical narrative adapted for modern cinema!" },
      { author: "Sarah Jenkins", rating: 8, date: "Yesterday", comment: "Matt Damon delivers an emotional performance as Odysseus. The pacing is intense throughout." }
    ]
  },
  {
    id: 687163,
    title: "Project Hail Mary",
    year: 2026,
    genre: ["Sci-Fi", "Adventure", "Drama"],
    rating: 8.7,
    voteCount: 3120,
    runtime: "2h 35m",
    tagline: "Science will save humanity.",
    featured: false,
    isPopular: true,
    isTrending: true,
    isTopRated: true,
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    overview: "Ryland Grace is the sole survivor on a desperate, last-chance mission to save humanity from an extinction-level solar crisis. Alone in deep space, he must use science and unexpected camaraderie to solve an impossible mystery.",
    cast: [
      { name: "Ryan Gosling", character: "Ryland Grace", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
      { name: "Sandra Hüller", character: "Eva Stratt", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" }
    ],
    reviews: [
      { author: "SciFiGeek", rating: 10, date: "3 days ago", comment: "Best sci-fi film since Interstellar! Amazing scientific accuracy and heart-wrenching tension." }
    ]
  },
  {
    id: 1108427,
    title: "Moana Live Action",
    year: 2026,
    genre: ["Adventure", "Family", "Fantasy"],
    rating: 5.8,
    voteCount: 980,
    runtime: "1h 55m",
    tagline: "The ocean is calling again.",
    isPopular: true,
    isTrending: true,
    poster: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    overview: "In Ancient Polynesia, when a terrible curse incurred by the Demigod Maui reaches Moana's island, she answers the Ocean's call to seek out the Demigod to set things right.",
    cast: [
      { name: "Dwayne Johnson", character: "Maui", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
      { name: "Catherine Laga'aia", character: "Moana", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" }
    ],
    reviews: []
  },
  {
    id: 1339713,
    title: "Obsession",
    year: 2026,
    genre: ["Thriller", "Drama", "Mystery"],
    rating: 8.3,
    voteCount: 1850,
    runtime: "2h 10m",
    tagline: "Desire knows no boundaries.",
    isPopular: true,
    isTrending: true,
    isUpcoming: true,
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    overview: "A prestigious surgeon's affair with his son's fiancée turns into an erotic obsession that threatens to destroy their lives.",
    cast: [
      { name: "Richard Armitage", character: "William", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80" }
    ],
    reviews: []
  },
  {
    id: 1083381,
    title: "Backrooms",
    year: 2026,
    genre: ["Horror", "Mystery", "Sci-Fi"],
    rating: 7.0,
    voteCount: 1240,
    runtime: "1h 48m",
    tagline: "If you aren't careful, you'll noclip out of reality.",
    isPopular: true,
    isTrending: true,
    isUpcoming: true,
    poster: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    overview: "A young filmmaker noclips into an endless maze of empty yellow rooms with damp carpet and buzzing fluorescent lights, pursued by surreal entities.",
    cast: [],
    reviews: []
  },
  {
    id: 1084244,
    title: "Toy Story 5",
    year: 2026,
    genre: ["Animation", "Comedy", "Family"],
    rating: 7.4,
    voteCount: 2200,
    runtime: "1h 42m",
    tagline: "Tech meets Toys.",
    isPopular: true,
    isTrending: true,
    isUpcoming: true,
    poster: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    overview: "Woody, Buzz Lightyear and the gang face off against the greatest threat to playtime yet: modern electronic gadgets and tablet screens.",
    cast: [
      { name: "Tom Hanks", character: "Woody (voice)", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
      { name: "Tim Allen", character: "Buzz Lightyear (voice)", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80" }
    ],
    reviews: []
  },
  {
    id: 936075,
    title: "Michael",
    year: 2026,
    genre: ["Drama", "Music", "Biography"],
    rating: 8.7,
    voteCount: 4500,
    runtime: "2h 40m",
    tagline: "The King of Pop.",
    isPopular: true,
    isTrending: true,
    isTopRated: true,
    poster: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    overview: "An in-depth portrait of the complicated man who became the King of Pop, featuring iconic performances that defined a generation.",
    cast: [
      { name: "Jaafar Jackson", character: "Michael Jackson", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
      { name: "Colman Domingo", character: "Joe Jackson", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" }
    ],
    reviews: []
  },
  {
    id: 278,
    title: "The Shawshank Redemption",
    year: 1994,
    genre: ["Drama", "Crime"],
    rating: 8.7,
    voteCount: 26000,
    runtime: "2h 22m",
    tagline: "Fear can hold you prisoner. Hope can set you free.",
    isTopRated: true,
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    overview: "Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison.",
    cast: [
      { name: "Tim Robbins", character: "Andy Dufresne", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
      { name: "Morgan Freeman", character: "Ellis Boyd 'Red' Redding", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80" }
    ],
    reviews: []
  },
  {
    id: 238,
    title: "The Godfather",
    year: 1972,
    genre: ["Drama", "Crime"],
    rating: 8.7,
    voteCount: 19800,
    runtime: "2h 55m",
    tagline: "An offer you can't refuse.",
    isTopRated: true,
    poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    overview: "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone, barely survives an attempt on his life, his youngest son, Michael steps in.",
    cast: [
      { name: "Marlon Brando", character: "Don Vito Corleone", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
      { name: "Al Pacino", character: "Michael Corleone", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" }
    ],
    reviews: []
  },
  {
    id: 155,
    title: "The Dark Knight",
    year: 2008,
    genre: ["Action", "Crime", "Drama"],
    rating: 8.5,
    voteCount: 31000,
    runtime: "2h 32m",
    tagline: "Welcome to a world without rules.",
    isTopRated: true,
    poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.",
    cast: [
      { name: "Christian Bale", character: "Bruce Wayne / Batman", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
      { name: "Heath Ledger", character: "Joker", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80" }
    ],
    reviews: []
  },
  {
    id: 157336,
    title: "Interstellar",
    year: 2014,
    genre: ["Sci-Fi", "Drama", "Adventure"],
    rating: 8.5,
    voteCount: 34000,
    runtime: "2h 49m",
    tagline: "Mankind was born on Earth. It was never meant to die here.",
    isTopRated: true,
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    cast: [
      { name: "Matthew McConaughey", character: "Joseph Cooper", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
      { name: "Anne Hathaway", character: "Dr. Amelia Brand", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" }
    ],
    reviews: []
  },
  {
    id: 969681,
    title: "Spider-Man: Brand New Day",
    year: 2026,
    genre: ["Action", "Sci-Fi", "Adventure"],
    rating: 8.2,
    voteCount: 1640,
    runtime: "2h 20m",
    tagline: "A fresh start in a dark neighborhood.",
    isTrending: true,
    isUpcoming: true,
    poster: "https://images.unsplash.com/photo-1635863138275-d9b33299680b?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    overview: "Peter Parker navigates life as a street-level vigilante in New York City with no memory of his past relationships, balancing college life with crime-fighting.",
    cast: [
      { name: "Tom Holland", character: "Peter Parker / Spider-Man", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" }
    ],
    reviews: []
  },
  {
    id: 1311031,
    title: "Demon Slayer: Infinity Castle",
    year: 2025,
    genre: ["Animation", "Action", "Fantasy"],
    rating: 7.7,
    voteCount: 2100,
    runtime: "2h 15m",
    tagline: "The final battle begins in the depths.",
    isUpcoming: true,
    poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1400&q=80",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    overview: "The Demon Slayer Corps plunge into the Infinity Castle to confront Muzan Kibutsuji and the remaining Upper Rank demons in an extraordinary all-out war.",
    cast: [
      { name: "Natsuki Hanae", character: "Tanjiro Kamado (voice)", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" }
    ],
    reviews: []
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MOVIES_DATABASE;
}
