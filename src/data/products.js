// src/data/products.js
import kuli125gram from "../assets/images/kuli125gram.png";
import kuli250gram from "../assets/images/kuli250gram.png";
import kuli850gramModu from "../assets/images/kuli850gramModu.webp";
import kuliPaint from "../assets/images/kuliPaint.jpeg";
import kuli1kg from "../assets/images/kuli1kg.jpeg";

const products = [
  { id: 1, name: "125g Fancy Pouch", price: 600, image: kuli125gram, alt: "125g Fancy Pouch" },
  { id: 2, name: "250g Fancy Pouch", price: 1200, image: kuli250gram, alt: "250g Fancy Pouch" },
  { id: 3, name: "Mudu (850g Nylon Pack)", price: 3500, image: kuli850gramModu, alt: "Mudu (850g Nylon Pack)" },
  { id: 4, name: "Paint Kuli Pack", price: 5000, image: kuliPaint, alt: "Paint Kuli Pack" },
  { id: 5, name: "Small Nylon Logo Pack", price: 450, image: kuli125gram, alt: "Small Nylon Logo Pack" },
  { id: 6, name: "1Kg Nylon Pack", price: 4000, image: kuli1kg, alt: "1Kg Nylon Pack" },
];

export default products;
