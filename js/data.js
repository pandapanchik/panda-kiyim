// Do'kon ma'lumotlari: shu yerni o'zgartirsangiz, hamma sahifada yangilanadi.
export const SHOP = {
  telegram: 'panda_shop_uz',
  instagram: 'panda.uz',
  phone: '+998 90 000 00 00',
  address: 'Toshkent, Amir Temur koʻchasi, 15',
  hours: 'Har kuni 10:00–21:00',
};

// Rasmlar hozircha Unsplash'dan. O'zingiznikiga almashtirish uchun
// `img` maydoniga to'liq URL yoki 'assets/img/...' yo'lini yozing.
export function imgUrl(src, w = 800) {
  if (!src.startsWith('photo-')) return src;
  return `https://images.unsplash.com/${src}?w=${w}&q=75&auto=format&fit=crop`;
}

export function imgSrcset(src) {
  if (!src.startsWith('photo-')) return '';
  return [400, 800, 1200].map((w) => `${imgUrl(src, w)} ${w}w`).join(', ');
}

export const CATEGORIES = {
  erkak: 'Erkaklar',
  ayol: 'Ayollar',
  bola: 'Bolalar',
};

const ADULT = ['XS', 'S', 'M', 'L', 'XL'];
const KIDS = ['4 yosh', '6 yosh', '8 yosh', '10 yosh'];

export const PRODUCTS = [
  { id: 'kostyum-qora', cat: 'erkak', name: 'Qora klassik kostyum', price: 2450000, img: 'photo-1618886614638-80e3c103d31a', colors: ['Qora'], sizes: ADULT, fabric: 'Jun 70%, poliester 30%', care: 'Faqat kimyoviy tozalash', isNew: true },
  { id: 'kostyum-slim', cat: 'erkak', name: 'Tor bichimli kostyum', price: 2300000, img: 'photo-1777969381875-6332d207cc68', colors: ['Qora'], sizes: ADULT, fabric: 'Jun 80%, elastan 20%', care: 'Faqat kimyoviy tozalash' },
  { id: 'kostyum-chiziq', cat: 'erkak', name: 'Chiziqli ikki qator tugmali kostyum', price: 2790000, img: 'photo-1480429370139-e0132c086e2a', colors: ['Oq', 'Qora'], sizes: ADULT, fabric: 'Jun 100%', care: 'Faqat kimyoviy tozalash' },
  { id: 'palto-qora', cat: 'erkak', name: 'Qora jun palto', price: 1890000, img: 'photo-1553209717-ddc5aa729bd2', colors: ['Qora'], sizes: ADULT, fabric: 'Jun 80%, kashemir 20%', care: 'Faqat kimyoviy tozalash', isNew: true },
  { id: 'palto-kulrang', cat: 'erkak', name: 'Kulrang palto', price: 1750000, img: 'photo-1619208382871-96f4d45bc840', colors: ['Qora', 'Oq'], sizes: ADULT, fabric: 'Jun 70%, poliamid 30%', care: 'Faqat kimyoviy tozalash' },
  { id: 'palto-uzun', cat: 'erkak', name: 'Uzun klassik palto', price: 1950000, img: 'photo-1619603364904-c0498317e145', colors: ['Qora'], sizes: ADULT, fabric: 'Jun 90%, kashemir 10%', care: 'Faqat kimyoviy tozalash' },
  { id: 'sviter-qora', cat: 'erkak', name: 'Qora trikotaj sviter', price: 590000, img: 'photo-1578681994506-b8f463449011', colors: ['Qora', 'Oq'], sizes: ADULT, fabric: 'Merinos jun 100%', care: '30° da qoʻlda yuvish' },
  { id: 'koylak-oq', cat: 'erkak', name: 'Oq klassik koʻylak', price: 420000, img: 'photo-1603252109303-2751441dd157', colors: ['Oq'], sizes: ADULT, fabric: 'Paxta 100%', care: '40° da yuvish' },
  { id: 'longsliv-oq', cat: 'erkak', name: 'Oq uzun yengli futbolka', price: 290000, img: 'photo-1620799140408-edc6dcb6d633', colors: ['Oq', 'Qora'], sizes: ADULT, fabric: 'Paxta 100%', care: '30° da yuvish' },
  { id: 'futbolka-oq', cat: 'erkak', name: 'Oq futbolka', price: 190000, img: 'photo-1581655353564-df123a1eb820', colors: ['Oq'], sizes: ADULT, fabric: 'Paxta 100%', care: '30° da yuvish' },
  { id: 'futbolka-qora', cat: 'erkak', name: 'Qora futbolka', price: 190000, img: 'photo-1618354691373-d851c5c3a990', colors: ['Qora'], sizes: ADULT, fabric: 'Paxta 100%', care: '30° da yuvish' },

  { id: 'koylak-uzun', cat: 'ayol', name: 'Qora uzun koʻylak', price: 980000, img: 'photo-1599662875272-64de8289f6d8', colors: ['Qora'], sizes: ADULT, fabric: 'Viskoza 95%, elastan 5%', care: '30° da nozik yuvish', isNew: true },
  { id: 'jaket-qora', cat: 'ayol', name: 'Qora jaket', price: 1150000, img: 'photo-1616065297556-f05bc00c9a3e', colors: ['Qora'], sizes: ADULT, fabric: 'Jun 60%, viskoza 40%', care: 'Faqat kimyoviy tozalash' },
  { id: 'jaket-kulrang', cat: 'ayol', name: 'Kulrang jaket', price: 1090000, img: 'photo-1604904612715-47bf9d9bc670', colors: ['Qora', 'Oq'], sizes: ADULT, fabric: 'Jun 60%, viskoza 40%', care: 'Faqat kimyoviy tozalash' },
  { id: 'jaket-chiziq', cat: 'ayol', name: 'Chiziqli jaket', price: 1190000, img: 'photo-1604914509335-9001944f23d5', colors: ['Qora'], sizes: ADULT, fabric: 'Jun 70%, poliester 30%', care: 'Faqat kimyoviy tozalash' },
  { id: 'sviter-oq', cat: 'ayol', name: 'Oq trikotaj sviter', price: 650000, img: 'photo-1574201635302-388dd92a4c3f', colors: ['Oq'], sizes: ADULT, fabric: 'Jun 50%, paxta 50%', care: '30° da qoʻlda yuvish', isNew: true },
  { id: 'trench', cat: 'ayol', name: 'Trench palto', price: 1650000, img: 'photo-1676716105765-e19fe6a01851', colors: ['Qora', 'Oq'], sizes: ADULT, fabric: 'Paxta 100%', care: 'Faqat kimyoviy tozalash' },
  { id: 'palto-ayol', cat: 'ayol', name: 'Qora kamarli palto', price: 1790000, img: 'photo-1592833578500-1082e18665a3', colors: ['Qora'], sizes: ADULT, fabric: 'Jun 80%, poliamid 20%', care: 'Faqat kimyoviy tozalash' },

  { id: 'kardigan-bola', cat: 'bola', name: 'Bolalar kardigani', price: 390000, img: 'photo-1519238263530-99bdd11df2ea', colors: ['Qora', 'Oq'], sizes: KIDS, fabric: 'Paxta 100%', care: '30° da yuvish' },
  { id: 'koylak-qiz', cat: 'bola', name: 'Qizlar uchun bayram koʻylagi', price: 450000, img: 'photo-1578897367107-2828e351c8a8', colors: ['Qora', 'Oq'], sizes: KIDS, fabric: 'Paxta 80%, poliester 20%', care: '30° da nozik yuvish' },
  { id: 'futbolka-bola', cat: 'bola', name: 'Bolalar futbolkasi', price: 120000, img: 'photo-1611428813653-aa606c998586', colors: ['Oq', 'Qora'], sizes: KIDS, fabric: 'Paxta 100%', care: '30° da yuvish' },
];

export function formatPrice(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' soʻm';
}

export function orderLink(p, color, size) {
  const text = `Assalomu alaykum! Buyurtma bermoqchiman:\n${p.name}\nRangi: ${color}\nOʻlchami: ${size}\nNarxi: ${formatPrice(p.price)}`;
  return `https://t.me/${SHOP.telegram}?text=${encodeURIComponent(text)}`;
}
