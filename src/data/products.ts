// product types and hardcoded catalogue
// using paise for prices to dodge floating-point weirdness (3400 = ₹34)
// same data as the kotlin version basically

export type Category = {
  id: string;
  title: string;
};

export interface Product {
  id: string;
  name: string;
  pricePaise: number;
  imageUrl: string;
  categoryId: string;
}

export const CATEGORIES: Category[] = [
  {id: 'all', title: 'All'},
  {id: 'dairy', title: 'Dairy'},
  {id: 'bakery', title: 'Bakery'},
  {id: 'snacks', title: 'Snacks'},
  {id: 'drinks', title: 'Drinks'},
  {id: 'produce', title: 'Veg & Fruit'},
];

// static product list — would come from an api in real app
export const ALL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Amul Gold Milk 500ml',
    pricePaise: 3400,
    imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143d00e2a4?w=400',
    categoryId: 'dairy',
  },
  {
    id: 'p2',
    name: 'Brown Bread (pack)',
    pricePaise: 4500,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
    categoryId: 'bakery',
  },
  {
    id: 'p3',
    name: "Lay's Classic Salted",
    pricePaise: 2000,
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400',
    categoryId: 'snacks',
  },
  {
    id: 'p4',
    name: 'Coca-Cola 750ml',
    pricePaise: 5500,
    imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
    categoryId: 'drinks',
  },
  {
    id: 'p5',
    name: 'Bananas (6 pcs)',
    pricePaise: 4900,
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400',
    categoryId: 'produce',
  },
  {
    id: 'p6',
    name: 'Curd 400g',
    pricePaise: 3800,
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
    categoryId: 'dairy',
  },
  {
    id: 'p7',
    name: 'Eggs (6)',
    pricePaise: 5200,
    imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400',
    categoryId: 'dairy',
  },
  {
    id: 'p8',
    name: 'Orange Juice 1L',
    pricePaise: 12900,
    imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
    categoryId: 'drinks',
  },
  {
    id: 'p9',
    name: 'Paneer 200g',
    pricePaise: 8500,
    imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400',
    categoryId: 'dairy',
  },
  {
    id: 'p10',
    name: 'Pav Buns (8 pcs)',
    pricePaise: 3000,
    imageUrl: 'https://images.unsplash.com/photo-1586444248879-bc604bc77dbe?w=400',
    categoryId: 'bakery',
  },
  {
    id: 'p11',
    name: 'Kurkure Masala Munch',
    pricePaise: 2000,
    imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400',
    categoryId: 'snacks',
  },
  {
    id: 'p12',
    name: 'Tomatoes 500g',
    pricePaise: 2500,
    imageUrl: 'https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=400',
    categoryId: 'produce',
  },
];

// converts paise to a nice display string
export const formatPrice = (paise: number): string => {
  const rupees = paise / 100;
  // only show decimals if there actually are some
  if (rupees % 1 === 0) {
    return `₹${rupees.toFixed(0)}`;
  }
  return `₹${rupees.toFixed(2)}`;
};

// filter by category + free-text search
export function filterProducts(categoryId: string, query: string): Product[] {
  const q = (query || '').trim().toLowerCase();
  return ALL_PRODUCTS.filter(p => {
    const catMatch = categoryId === 'all' || p.categoryId === categoryId;
    const textMatch = q.length === 0 || p.name.toLowerCase().includes(q);
    return catMatch && textMatch;
  });
}
