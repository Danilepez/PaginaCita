export type Plan = { date: string; time: string; food: string[]; activity: string[] };

// `image` es opcional: pon una foto en /public (p. ej. "/img/sushi.jpg") y la tarjeta la usa de fondo.
export type Option = { emoji: string; label: string; image?: string };

export const TIMES = [
  { label: "Tarde", detail: "4:00 PM" },
  { label: "Noche", detail: "7:00 PM" },
  { label: "Cena", detail: "8:30 PM" },
];

export const FOODS: Option[] = [
  { emoji: "🍔", label: "Hamburguesa" },
  { emoji: "🥩", label: "Parrilla" },
  { emoji: "🍕", label: "Pizza" },
  { emoji: "🍣", label: "Sushi" },
  { emoji: "🍝", label: "Pasta" },
  { emoji: "🌮", label: "Tacos" },
  { emoji: "🍦", label: "Postre" },
];

export const ACTIVITIES: Option[] = [
  { emoji: "🍿", label: "Película" },
  { emoji: "🎳", label: "Bolos" },
  { emoji: "🏔️", label: "Ir al cerro" },
  { emoji: "🧺", label: "Picnic" },
  { emoji: "🌳", label: "Paseo" },
  { emoji: "🎲", label: "Juegos de mesa" },
  { emoji: "🏡", label: "Noche en casa" },
];
