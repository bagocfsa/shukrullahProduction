import { Product, Category } from '../types/index';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Kuli-kuli',
    slug: 'kuli-kuli',
    description: 'Traditional Nigerian groundnut snacks and related products',
    image: '/images/categories/kuli-kuli.jpg',
    subcategories: [
      { id: '1-1', name: 'Kuli-kuli Snacks', slug: 'kuli-kuli-snacks', description: 'Traditional groundnut snacks' },
      { id: '1-2', name: 'Dankowa', slug: 'dankowa', description: 'Traditional Nigerian sweets' },
      { id: '1-3', name: 'Yaji', slug: 'yaji', description: 'Nigerian spice blend' }
    ]
  },
  {
    id: '2',
    name: 'Cooking Oils',
    slug: 'cooking-oils',
    description: 'Premium quality cooking oils and extracts',
    image: '/images/categories/oils.jpg',
    subcategories: [
      { id: '2-1', name: 'Groundnut Oil', slug: 'groundnut-oil', description: 'Pure groundnut cooking oil' },
      { id: '2-2', name: 'Palm Oil', slug: 'palm-oil', description: 'Traditional palm oil' },
      { id: '2-3', name: 'Coconut Oil', slug: 'coconut-oil', description: 'Pure coconut oil' }
    ]
  },

];

export const products: Product[] = [
  {
    id: '1',
    name: 'Kuli-kuli 1Kg (Local Nylon)',
    description: 'Traditional Nigerian groundnut snacks made from premium quality groundnuts. 1 kilogram pack in local nylon packaging.',
    price: 4000, // ₦4,000 (online price)
    physicalShopPrice: 4000, // ₦4,000 (same price for physical shop)
    originalPrice: 4000,
    category: 'Kuli-kuli',
    subcategory: 'Kuli-kuli',
    images: [
      '/images/products/kuli1kg.jpeg',
      '/images/products/kuliPaint.jpeg',
      '/images/products/ParkagingNynlon1200.jpg'
    ],
    inStock: true,
    stockQuantity: 50,
    rating: 4.9,
    reviewCount: 89,
    tags: ['kuli-kuli', 'groundnut', 'traditional', 'snacks', 'nigerian', '1kg', 'bulk'],
    nutritionFacts: {
      calories: 180,
      protein: 8,
      carbohydrates: 12,
      fat: 12,
      fiber: 3,
      sugar: 2,
      sodium: 25
    },
    ingredients: ['Groundnuts', 'Ginger', 'Pepper', 'Salt', 'Natural Spices'],
    servingSize: '50g',
    servingsPerContainer: 20,
    benefits: [
      'Rich in protein and healthy fats',
      'Traditional Nigerian taste',
      'Natural energy boost',
      'No artificial preservatives',
      'Bulk size for families'
    ],
    usage: 'Ready to eat. Perfect as a snack or with drinks. Store in cool, dry place.',
    warnings: ['Contains nuts. May contain traces of other allergens.'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-08-01')
  },
  {
    id: '1b',
    name: 'Kuli-kuli 125g (Local Nylon)',
    description: 'Traditional Nigerian groundnut snacks in convenient 125g local nylon packaging. Perfect portion size for individuals.',
    price: 500, // ₦500 (online price)
    physicalShopPrice: 450, // ₦450 (physical shop price)
    originalPrice: 500,
    category: 'Kuli-kuli',
    subcategory: 'Kuli-kuli',
    images: [
      '/images/products/kuli125gram.png',
      '/images/products/130gramparkagedkuli.jpg',
      '/images/products/localmudunylon450.jpg'
    ],
    inStock: true,
    stockQuantity: 200,
    rating: 4.8,
    reviewCount: 156,
    tags: ['kuli-kuli', 'groundnut', 'traditional', 'snacks', 'nigerian', '125g', 'individual'],
    nutritionFacts: {
      calories: 180,
      protein: 8,
      carbohydrates: 12,
      fat: 12,
      fiber: 3,
      sugar: 2,
      sodium: 25
    },
    ingredients: ['Groundnuts', 'Ginger', 'Pepper', 'Salt', 'Natural Spices'],
    servingSize: '50g',
    servingsPerContainer: 2.5,
    benefits: [
      'Rich in protein and healthy fats',
      'Traditional Nigerian taste',
      'Natural energy boost',
      'No artificial preservatives',
      'Perfect individual portion'
    ],
    usage: 'Ready to eat. Perfect as a snack or with drinks.',
    warnings: ['Contains nuts. May contain traces of other allergens.'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-08-01')
  },
  {
    id: '1c',
    name: 'Kuli-kuli 130g (Fancy Pouch)',
    description: 'Premium Kuli-kuli in attractive fancy pouch packaging. Perfect for gifts and special occasions.',
    price: 700, // ₦700 (online price)
    physicalShopPrice: 600, // ₦600 (physical shop price)
    originalPrice: 700,
    category: 'Kuli-kuli',
    subcategory: 'Kuli-kuli',
    images: [
      '/images/products/130gramparkagedkuli.jpg',
      '/images/products/kuli250gram.png',
      '/images/products/kuli850gramModu.webp'
    ],
    inStock: true,
    stockQuantity: 150,
    rating: 4.9,
    reviewCount: 78,
    tags: ['kuli-kuli', 'groundnut', 'traditional', 'snacks', 'nigerian', '130g', 'fancy', 'gift'],
    nutritionFacts: {
      calories: 180,
      protein: 8,
      carbohydrates: 12,
      fat: 12,
      fiber: 3,
      sugar: 2,
      sodium: 25
    },
    ingredients: ['Groundnuts', 'Ginger', 'Pepper', 'Salt', 'Natural Spices'],
    servingSize: '50g',
    servingsPerContainer: 2.6,
    benefits: [
      'Rich in protein and healthy fats',
      'Traditional Nigerian taste',
      'Natural energy boost',
      'No artificial preservatives',
      'Premium packaging'
    ],
    usage: 'Ready to eat. Perfect as a snack, gift, or with drinks.',
    warnings: ['Contains nuts. May contain traces of other allergens.'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-08-01')
  },
  {
    id: '1d',
    name: 'Kuli-kuli 250g (Fancy Pouch)',
    description: 'Premium Kuli-kuli in large fancy pouch packaging. Ideal for sharing and special occasions.',
    price: 2500, // ₦2,500 (online price)
    physicalShopPrice: 2200, // ₦2,200 (physical shop price)
    originalPrice: 2500,
    category: 'Kuli-kuli',
    subcategory: 'Kuli-kuli',
    images: [
      '/images/products/kuli250gram.png',
      '/images/products/kuli850gramModu.webp',
      '/images/products/130gramparkagedkuli.jpg'
    ],
    inStock: true,
    stockQuantity: 80,
    rating: 4.9,
    reviewCount: 45,
    tags: ['kuli-kuli', 'groundnut', 'traditional', 'snacks', 'nigerian', '250g', 'fancy', 'sharing'],
    nutritionFacts: {
      calories: 180,
      protein: 8,
      carbohydrates: 12,
      fat: 12,
      fiber: 3,
      sugar: 2,
      sodium: 25
    },
    ingredients: ['Groundnuts', 'Ginger', 'Pepper', 'Salt', 'Natural Spices'],
    servingSize: '50g',
    servingsPerContainer: 5,
    benefits: [
      'Rich in protein and healthy fats',
      'Traditional Nigerian taste',
      'Natural energy boost',
      'No artificial preservatives',
      'Premium packaging for sharing'
    ],
    usage: 'Ready to eat. Perfect for sharing, gifts, or family consumption.',
    warnings: ['Contains nuts. May contain traces of other allergens.'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-08-01')
  },
  {
    id: '2a',
    name: 'Pure Groundnut Oil (75cl)',
    description: 'Premium quality groundnut oil in convenient 75cl bottle. Perfect for small households and cooking needs.',
    price: 2600, // ₦2,600 (online price)
    physicalShopPrice: 2600, // ₦2,600 (same price)
    category: 'Cooking Oils',
    subcategory: 'Groundnut Oil',
    images: [
      '/images/products/75CLOil.PNG',
      '/images/products/groundnut.jpeg'
    ],
    inStock: true,
    stockQuantity: 200,
    rating: 4.7,
    reviewCount: 89,
    tags: ['groundnut-oil', 'cooking-oil', 'natural', 'pure', '75cl'],
    nutritionFacts: {
      calories: 884,
      protein: 0,
      carbohydrates: 0,
      fat: 100,
      fiber: 0,
      sugar: 0,
      sodium: 0
    },
    ingredients: ['100% Pure Groundnut Oil'],
    servingSize: '1 tablespoon (15ml)',
    servingsPerContainer: 50,
    benefits: [
      'High smoke point for frying',
      'Rich in vitamin E',
      'Natural and unrefined',
      'Traditional taste'
    ],
    usage: 'Use for cooking, frying, and salad dressing. Store in cool, dry place.',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-07-15')
  },
  {
    id: '2b',
    name: 'Pure Groundnut Oil (1 Liter)',
    description: 'Premium quality groundnut oil in standard 1 liter bottle. Perfect for regular cooking and frying.',
    price: 3800, // ₦3,800 (online price)
    physicalShopPrice: 3800, // ₦3,800 (same price)
    category: 'Cooking Oils',
    subcategory: 'Groundnut Oil',
    images: [
      '/images/products/1litreOil.PNG',
      '/images/products/groundnut.jpeg'
    ],
    inStock: true,
    stockQuantity: 180,
    rating: 4.7,
    reviewCount: 156,
    tags: ['groundnut-oil', 'cooking-oil', 'natural', 'pure', '1liter'],
    nutritionFacts: {
      calories: 884,
      protein: 0,
      carbohydrates: 0,
      fat: 100,
      fiber: 0,
      sugar: 0,
      sodium: 0
    },
    ingredients: ['100% Pure Groundnut Oil'],
    servingSize: '1 tablespoon (15ml)',
    servingsPerContainer: 67,
    benefits: [
      'High smoke point for frying',
      'Rich in vitamin E',
      'Natural and unrefined',
      'Traditional taste'
    ],
    usage: 'Use for cooking, frying, and salad dressing. Store in cool, dry place.',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-07-15')
  },
  {
    id: '2c',
    name: 'Pure Groundnut Oil (2 Liters)',
    description: 'Premium quality groundnut oil in family-size 2 liter bottle. Great value for larger households.',
    price: 7500, // ₦7,500 (online price)
    physicalShopPrice: 7500, // ₦7,500 (same price)
    category: 'Cooking Oils',
    subcategory: 'Groundnut Oil',
    images: [
      '/images/products/2litre.jpeg',
      '/images/products/groundnut.jpeg'
    ],
    inStock: true,
    stockQuantity: 120,
    rating: 4.8,
    reviewCount: 78,
    tags: ['groundnut-oil', 'cooking-oil', 'natural', 'pure', '2liters', 'family-size'],
    nutritionFacts: {
      calories: 884,
      protein: 0,
      carbohydrates: 0,
      fat: 100,
      fiber: 0,
      sugar: 0,
      sodium: 0
    },
    ingredients: ['100% Pure Groundnut Oil'],
    servingSize: '1 tablespoon (15ml)',
    servingsPerContainer: 133,
    benefits: [
      'High smoke point for frying',
      'Rich in vitamin E',
      'Natural and unrefined',
      'Traditional taste',
      'Family size value pack'
    ],
    usage: 'Use for cooking, frying, and salad dressing. Store in cool, dry place.',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-07-15')
  },
  {
    id: '2d',
    name: 'Pure Groundnut Oil (4 Liters)',
    description: 'Premium quality groundnut oil in bulk 4 liter container. Perfect for restaurants and large families.',
    price: 15000, // ₦15,000 (online price)
    physicalShopPrice: 15000, // ₦15,000 (same price)
    category: 'Cooking Oils',
    subcategory: 'Groundnut Oil',
    images: [
      '/images/products/4litreOil.PNG',
      '/images/products/groundnut.jpeg'
    ],
    inStock: true,
    stockQuantity: 80,
    rating: 4.8,
    reviewCount: 45,
    tags: ['groundnut-oil', 'cooking-oil', 'natural', 'pure', '4liters', 'bulk'],
    nutritionFacts: {
      calories: 884,
      protein: 0,
      carbohydrates: 0,
      fat: 100,
      fiber: 0,
      sugar: 0,
      sodium: 0
    },
    ingredients: ['100% Pure Groundnut Oil'],
    servingSize: '1 tablespoon (15ml)',
    servingsPerContainer: 267,
    benefits: [
      'High smoke point for frying',
      'Rich in vitamin E',
      'Natural and unrefined',
      'Traditional taste',
      'Bulk size for commercial use'
    ],
    usage: 'Use for cooking, frying, and salad dressing. Store in cool, dry place.',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-07-15')
  },

  {
    id: '2f',
    name: 'Pure Groundnut Oil (25 Liters)',
    description: 'Premium quality groundnut oil in industrial 25 liter container. Perfect for large-scale food production.',
    price: 93750, // ₦93,750 (online price)
    physicalShopPrice: 93750, // ₦93,750 (same price)
    category: 'Cooking Oils',
    subcategory: 'Groundnut Oil',
    images: [
      '/images/products/25litreOil.png',
      '/images/products/groundnut.jpeg'
    ],
    inStock: true,
    stockQuantity: 20,
    rating: 4.9,
    reviewCount: 12,
    tags: ['groundnut-oil', 'cooking-oil', 'natural', 'pure', '25liters', 'industrial'],
    nutritionFacts: {
      calories: 884,
      protein: 0,
      carbohydrates: 0,
      fat: 100,
      fiber: 0,
      sugar: 0,
      sodium: 0
    },
    ingredients: ['100% Pure Groundnut Oil'],
    servingSize: '1 tablespoon (15ml)',
    servingsPerContainer: 1667,
    benefits: [
      'High smoke point for frying',
      'Rich in vitamin E',
      'Natural and unrefined',
      'Traditional taste',
      'Industrial size for large operations'
    ],
    usage: 'Use for cooking, frying, and salad dressing. Store in cool, dry place.',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-07-15')
  },
  {
    id: '3',
    name: 'Traditional Dankowa (Per Piece)',
    description: 'Authentic Nigerian sweet treats made with traditional recipes. Sold per piece for individual enjoyment.',
    price: 150, // ₦150 per piece (online price)
    physicalShopPrice: 150, // ₦150 per piece (same price)
    category: 'Kuli-kuli',
    subcategory: 'Dankowa',
    images: [
      '/images/products/Dankuwa1.jpg',
      '/images/products/slide3 copy.jpg'
    ],
    inStock: true,
    stockQuantity: 500,
    rating: 4.6,
    reviewCount: 167,
    tags: ['dankowa', 'sweets', 'traditional', 'nigerian', 'treats', 'per-piece'],
    nutritionFacts: {
      calories: 45,
      protein: 1,
      carbohydrates: 10,
      fat: 1,
      fiber: 0,
      sugar: 9,
      sodium: 2
    },
    ingredients: ['Sugar', 'Groundnuts', 'Ginger', 'Natural Flavoring', 'Food Coloring'],
    servingSize: '1 piece (10g)',
    servingsPerContainer: 1,
    benefits: [
      'Traditional Nigerian taste',
      'Perfect for celebrations',
      'Made with natural ingredients',
      'Quick energy boost',
      'Affordable individual serving'
    ],
    usage: 'Ready to eat. Perfect for special occasions, gifts, or individual treats.',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-08-05')
  },

  {
    id: '4b',
    name: 'Yaji Spice Mix (1Kg)',
    description: 'Traditional Nigerian spice blend perfect for grilled meat, suya, and other dishes. Premium quality spices.',
    price: 1200, // ₦1,200 per kg (online price)
    physicalShopPrice: 1200, // ₦1,200 per kg (same price)
    category: 'Kuli-kuli',
    subcategory: 'Spices',
    images: [
      '/images/products/yaji.jpeg',
      '/images/products/yagiSpices.jpeg'
    ],
    inStock: true,
    stockQuantity: 150,
    rating: 4.9,
    reviewCount: 134,
    tags: ['yaji', 'spice-mix', 'suya', 'traditional', 'nigerian', 'seasoning'],
    nutritionFacts: {
      calories: 25,
      protein: 1,
      carbohydrates: 5,
      fat: 1,
      fiber: 2,
      sugar: 1,
      sodium: 200
    },
    ingredients: ['Groundnuts', 'Ginger', 'Garlic', 'Cloves', 'Red Pepper', 'Onion Powder', 'Salt', 'Traditional Spices'],
    servingSize: '1 tablespoon (5g)',
    servingsPerContainer: 200,
    benefits: [
      'Authentic Nigerian flavor',
      'Perfect for grilled meats',
      'Natural ingredients',
      'Traditional recipe',
      'Versatile seasoning'
    ],
    usage: 'Sprinkle on grilled meat, chicken, fish, or vegetables. Store in airtight container.',
    createdAt: new Date('2024-04-20'),
    updatedAt: new Date('2024-07-30')
  }
];
