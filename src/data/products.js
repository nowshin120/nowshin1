// Mock Product Data for all categories
// Using ONLY product images - NO human models, faces, or body parts
// NOTE: Sari, Panjabi, and Three Piece use placeholder images

const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY3Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iI2MzYzRjNyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii40ZW0iPkltYWdlIENvbWluZyBTb29uPC90ZXh0Pjx0ZXh0IHg9IjUwJSIgeT0iNTglJSIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2FhYSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii40ZW0iPlByb2R1Y3QgUGhvdG8gUGVuZGluZzwvdGV4dD48L3N2Zz4=';

export const products = {
  sari: [
    {
      id: 'sari-1',
      name: 'Silk Banarasi Sari',
      price: 4500,
      deliveryCharge: 100,
      image: placeholderImage,
      category: 'sari'
    },
    {
      id: 'sari-2',
      name: 'Cotton Jamdani Sari',
      price: 3200,
      deliveryCharge: 100,
      image: placeholderImage,
      category: 'sari'
    },
    {
      id: 'sari-3',
      name: 'Georgette Party Sari',
      price: 2800,
      deliveryCharge: 100,
      image: placeholderImage,
      category: 'sari'
    },
    {
      id: 'sari-4',
      name: 'Mul Cotton Daily Sari',
      price: 1500,
      deliveryCharge: 100,
      image: placeholderImage,
      category: 'sari'
    }
  ],
  threePiece: [
    {
      id: 'three-1',
      name: 'Premium Lawn Three Piece',
      price: 3500,
      deliveryCharge: 100,
      image: placeholderImage,
      category: 'threePiece'
    },
    {
      id: 'three-2',
      name: 'Silk Three Piece Set',
      price: 5500,
      deliveryCharge: 100,
      image: placeholderImage,
      category: 'threePiece'
    },
    {
      id: 'three-3',
      name: 'Cotton Churidar Set',
      price: 2800,
      deliveryCharge: 100,
      image: placeholderImage,
      category: 'threePiece'
    }
  ],
  shirt: [
    {
      id: 'shirt-1',
      name: 'Formal White Shirt',
      price: 1200,
      deliveryCharge: 100,
      image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&h=500&fit=crop',
      category: 'shirt'
    },
    {
      id: 'shirt-2',
      name: 'Casual Denim Shirt',
      price: 1500,
      deliveryCharge: 100,
      image: 'https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=400&h=500&fit=crop',
      category: 'shirt'
    },
    {
      id: 'shirt-3',
      name: 'Patterned Office Shirt',
      price: 1100,
      deliveryCharge: 100,
      image: 'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=400&h=500&fit=crop',
      category: 'shirt'
    },
    {
      id: 'shirt-4',
      name: 'Linen Summer Shirt',
      price: 1350,
      deliveryCharge: 100,
      image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&h=500&fit=crop',
      category: 'shirt'
    }
  ],
  panjabi: [
    {
      id: 'panjabi-1',
      name: 'Cotton Panjabi White',
      price: 1800,
      deliveryCharge: 100,
      image: placeholderImage,
      category: 'panjabi'
    },
    {
      id: 'panjabi-2',
      name: 'Silk Panjabi Gold',
      price: 2500,
      deliveryCharge: 100,
      image: placeholderImage,
      category: 'panjabi'
    },
    {
      id: 'panjabi-3',
      name: 'Muslin Panjabi Cream',
      price: 2200,
      deliveryCharge: 100,
      image: placeholderImage,
      category: 'panjabi'
    }
  ],
  pants: [
    {
      id: 'pants-1',
      name: 'Slim Fit Jeans Blue',
      price: 1600,
      deliveryCharge: 100,
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop',
      category: 'pants'
    },
    {
      id: 'pants-2',
      name: 'Formal Trousers Black',
      price: 1400,
      deliveryCharge: 100,
      image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop',
      category: 'pants'
    },
    {
      id: 'pants-3',
      name: 'Chino Pants Khaki',
      price: 1300,
      deliveryCharge: 100,
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop',
      category: 'pants'
    }
  ],
  tshirts: [
    {
      id: 'tshirt-1',
      name: 'Cotton Polo T-Shirt',
      price: 650,
      deliveryCharge: 100,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
      category: 'tshirts'
    },
    {
      id: 'tshirt-2',
      name: 'Graphic Print Tee',
      price: 550,
      deliveryCharge: 100,
      image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=500&fit=crop',
      category: 'tshirts'
    },
    {
      id: 'tshirt-3',
      name: 'V-Neck Casual Tee',
      price: 480,
      deliveryCharge: 100,
      image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=500&fit=crop',
      category: 'tshirts'
    },
    {
      id: 'tshirt-4',
      name: 'Striped Round Neck',
      price: 600,
      deliveryCharge: 100,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
      category: 'tshirts'
    }
  ],
  babyProducts: [
    {
      id: 'baby-1',
      name: 'Baby Romper Set',
      price: 850,
      deliveryCharge: 100,
      image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&h=500&fit=crop',
      category: 'babyProducts'
    },
    {
      id: 'baby-2',
      name: 'Baby Dress Pink',
      price: 750,
      deliveryCharge: 100,
      image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=500&fit=crop',
      category: 'babyProducts'
    },
    {
      id: 'baby-3',
      name: 'Infant Onesie Pack',
      price: 950,
      deliveryCharge: 100,
      image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&h=500&fit=crop',
      category: 'babyProducts'
    }
  ],
  shoes: [
    {
      id: 'shoes-1',
      name: 'Leather Formal Shoes',
      price: 2500,
      deliveryCharge: 150,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop',
      category: 'shoes'
    },
    {
      id: 'shoes-2',
      name: 'Canvas Sneakers White',
      price: 1200,
      deliveryCharge: 100,
      image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=500&fit=crop',
      category: 'shoes'
    },
    {
      id: 'shoes-3',
      name: 'Casual Slip-On Shoes',
      price: 1100,
      deliveryCharge: 100,
      image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=500&fit=crop',
      category: 'shoes'
    },
    {
      id: 'shoes-4',
      name: 'Sports Running Shoes',
      price: 1800,
      deliveryCharge: 100,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop',
      category: 'shoes'
    }
  ],
  watches: [
    {
      id: 'watch-1',
      name: 'Classic Analog Watch',
      price: 3500,
      deliveryCharge: 100,
      image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=500&fit=crop',
      category: 'watches'
    },
    {
      id: 'watch-2',
      name: 'Digital Sports Watch',
      price: 2200,
      deliveryCharge: 100,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=500&fit=crop',
      category: 'watches'
    },
    {
      id: 'watch-3',
      name: 'Leather Strap Watch',
      price: 2800,
      deliveryCharge: 100,
      image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400&h=500&fit=crop',
      category: 'watches'
    },
    {
      id: 'watch-4',
      name: 'Minimalist Steel Watch',
      price: 4200,
      deliveryCharge: 150,
      image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=500&fit=crop',
      category: 'watches'
    }
  ]
};

export const getCategoryProducts = (category) => {
  return products[category] || [];
};

export const getProductById = (id) => {
  for (const category in products) {
    const product = products[category].find(p => p.id === id);
    if (product) return product;
  }
  return null;
};
