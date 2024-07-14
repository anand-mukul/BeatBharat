export interface Station {
    name: string
    genre: string
    cover: string
  }
  
  export const topStations: Station[] = [
    {
      name: "Radio One",
      genre: "Pop",
      cover: "/stations/radio-one.jpg",
    },
    {
      name: "Classic FM",
      genre: "Classical",
      cover: "/stations/classic-fm.jpg",
    },
    {
      name: "Rock 101",
      genre: "Rock",
      cover: "/stations/rock-101.jpg",
    },
    {
      name: "Jazz 24/7",
      genre: "Jazz",
      cover: "/stations/jazz-247.jpg",
    },
    {
      name: "Chill Lounge",
      genre: "Ambient",
      cover: "/stations/chill-lounge.jpg",
    },
  ]
  
  export const genreStations: Station[] = [
    {
      name: "Electronic Beats",
      genre: "Electronic",
      cover: "/stations/electronic-beats.jpg",
    },
    {
      name: "Hip Hop Nation",
      genre: "Hip Hop",
      cover: "/stations/hip-hop-nation.jpg",
    },
    {
      name: "Country Roads",
      genre: "Country",
      cover: "/stations/country-roads.jpg",
    },
    {
      name: "Reggae Vibes",
      genre: "Reggae",
      cover: "/stations/reggae-vibes.jpg",
    },
    {
      name: "Metal Mayhem",
      genre: "Metal",
      cover: "/stations/metal-mayhem.jpg",
    },
  ]