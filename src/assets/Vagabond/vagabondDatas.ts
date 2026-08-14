export interface RankTitle {
  rank: number
  title: string
  description: string
}

const VAGABOND_TITLES: RankTitle[] = [
  { rank: 0, title: "Simple passant", description: "Rien ne distingue tes pas de ceux des autres." },
  { rank: 1, title: "Errant solitaire", description: "Tu erres sans but, guidé par tes pas." },
  { rank: 2, title: "Marcheur égaré", description: "Tu sembles marcher vers un but, sans jamais le trouver." },
  { rank: 3, title: "Voyageur fatigué", description: "La route te pèse, mais tu continues à avancer." },
  { rank: 4, title: "Chiffonnier des routes", description: "Tu rassembles ce que le voyage t'offre, misère ou trésor." },
  { rank: 5, title: "Conteur des carrefours", description: "Tes histoires se dessinent dans chaque feu de camp." },
  { rank: 6, title: "Rôdeur des bois", description: "Tes pas silencieux se fondent dans la forêt." },
  { rank: 7, title: "Nomade", description: "Tu avances au gré des chemins." },
  { rank: 8, title: "Messager oublié", description: "Tu avances, porteur de missives égarées." },
  { rank: 9, title: "Voyageur sans attaches", description: "Tu as appris à te perdre pour mieux te retrouver." },
  { rank: 10, title: "Pèlerin des bourgs", description: "Tu passes de village en village sans jamais t'y fixer." },
  { rank: 11, title: "Passeur de frontières", description: "Nulle barrière ne peut limiter ton errance." },
  { rank: 12, title: "Vagabond insaisissable", description: "Ton nom circule dans les villes." },
  { rank: 13, title: "Pieds-Poussière", description: "Tu donnes un sens à ta route." },
  { rank: 14, title: "Dormeur sous les étoiles", description: "Ton toit est le ciel, ton lit la terre tiède." },
  { rank: 15, title: "Ombre des routes", description: "Tu vis hors des sentiers tracés." },
  { rank: 16, title: "Explorateur des Terres Sauvages", description: "Ta présence éclaire les sentiers obscurs." },
  { rank: 17, title: "Pèlerin des Sentiers Oubliés", description: "Tes pas te mènent vers la vérité." },
  { rank: 18, title: "Nomade du vent", description: "Rien ne t'arrête." },
  { rank: 19, title: "Guide des brumes", description: "Tu aides d'autres voyageurs." },
  { rank: 20, title: "Vagabond légendaire", description: "Tu es devenu l'incarnation du voyage." },
  { rank: 21, title: "Marcheur céleste", description: "Les constellations t'ouvrent la voie." },
  { rank: 22, title: "Maître des chemins", description: "Tous les sentiers te sont familiers." }
]

export function getRankTitleForRank(rank: number): RankTitle {
  const found = VAGABOND_TITLES.find(t => t.rank === rank)
  return found ?? VAGABOND_TITLES[0]  // fallback sur le premier titre si rang inconnu
}

export function getImagePathForRank(rank: number): string {
  const rankTitle = getRankTitleForRank(rank)
  return `/src/assets/Vagabond/images/${rankTitle.rank}-${rankTitle.title}.png`
}
