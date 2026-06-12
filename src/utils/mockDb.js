// Client-side JSON database using localStorage
const STORAGE_PREFIX = 'creacarte_b2b_';

const defaultUsers = [
  {
    id: 'user-admin',
    fullName: 'Admin User',
    email: 'admin@creacarte.com',
    password: 'Admin@123',
    phone: '+1-555-0100',
    address: '123 Admin Street, New York, NY 10001',
    role: 'admin',
    isActive: true,
  },
  {
    id: 'user-client',
    fullName: 'John Smith',
    email: 'client@creacarte.com',
    password: 'Client@123',
    phone: '+1-555-0200',
    address: '456 Business Ave, Los Angeles, CA 90210',
    role: 'client',
    isActive: true,
  }
];

const defaultCategories = [
  { id: 'cat-1', name: 'Mariage', slug: 'mariage', description: 'Cartes d\'invitation mariage, fiançailles, Save the Date, menus, remerciements...', icon: '💍', isActive: true },
  { id: 'cat-2', name: 'Études & Université', slug: 'etudes-universite', description: 'Cartes de soutenance, invitations de soutenance, diplômes, certificats...', icon: '🎓', isActive: true },
  { id: 'cat-3', name: 'Professionnel', slug: 'professionnel', description: 'Cartes de visite, badges professionnels, certificats d\'appréciation...', icon: '🏢', isActive: true },
  { id: 'cat-4', name: 'Événements', slug: 'evenements', description: 'Invitations de congrès, séminaires, anniversaire, conférences...', icon: '🎉', isActive: true },
  { id: 'cat-5', name: 'Événements religieux', slug: 'evenements-religieux', description: 'Cartes de circoncision, Omra/Hajj, félicitations...', icon: '🕌', isActive: true },
  { id: 'cat-6', name: 'Remerciements', slug: 'remerciements', description: 'Cartes pour enseignants, félicitations, remerciement...', icon: '👨‍🏫', isActive: true },
  { id: 'cat-7', name: 'Personnalisation', slug: 'personnalisation', description: 'Créer ma carte, importer mon design, design sur mesure...', icon: '🎨', isActive: true },
];

const defaultProducts = [
  {
    id: 'prod-1',
    name: 'Cartes d\'invitation Mariage Premium',
    slug: 'invitation-mariage-premium',
    description: 'Cartes d\'invitation mariage élégantes sur papier texturé avec dorure à chaud dorée ou argentée. Enveloppes incluses.',
    unitPrice: 2.50,
    wholesalePrice: 1.50,
    wholesaleMinQty: 100,
    stock: 5000,
    categoryId: 'cat-1',
    sku: 'MAR-001',
    isFeatured: true,
    isActive: true,
    images: [
      { imageUrl: 'https://picsum.photos/seed/MAR-001-1/600/600', isPrimary: true, sortOrder: 0 }
    ]
  },
  {
    id: 'prod-2',
    name: 'Save the Date Rustique',
    slug: 'save-the-date-rustique',
    description: 'Cartes d\'annonce Save the Date avec style kraft rustique et dentelle imprimée, parfaites pour annoncer votre mariage.',
    unitPrice: 1.80,
    wholesalePrice: 1.10,
    wholesaleMinQty: 100,
    stock: 8000,
    categoryId: 'cat-1',
    sku: 'MAR-002',
    isFeatured: true,
    isActive: true,
    images: [
      { imageUrl: 'https://picsum.photos/seed/MAR-002-1/600/600', isPrimary: true, sortOrder: 0 }
    ]
  },
  {
    id: 'prod-3',
    name: 'Diplôme Universitaire Cartonné',
    slug: 'diplome-universitaire-cartonne',
    description: 'Diplômes personnalisés sur papier parchemin rigide 300g avec lettrage gothique et emplacement pour sceau en cire.',
    unitPrice: 5.00,
    wholesalePrice: 3.50,
    wholesaleMinQty: 50,
    stock: 2000,
    categoryId: 'cat-2',
    sku: 'UNI-001',
    isFeatured: true,
    isActive: true,
    images: [
      { imageUrl: 'https://picsum.photos/seed/UNI-001-1/600/600', isPrimary: true, sortOrder: 0 }
    ]
  },
  {
    id: 'prod-4',
    name: 'Cartes de Visite Soft Touch',
    slug: 'cartes-de-visite-soft-touch',
    description: 'Cartes de visite professionnelles haut de gamme avec pelliculage mat soft touch (effet peau de pêche) 350g, impression recto/verso.',
    unitPrice: 0.15,
    wholesalePrice: 0.08,
    wholesaleMinQty: 500,
    stock: 100000,
    categoryId: 'cat-3',
    sku: 'PRO-001',
    isFeatured: true,
    isActive: true,
    images: [
      { imageUrl: 'https://picsum.photos/seed/PRO-001-1/600/600', isPrimary: true, sortOrder: 0 }
    ]
  },
  {
    id: 'prod-5',
    name: 'Badges Professionnels Magnétiques',
    slug: 'badges-professionnels-magnetiques',
    description: 'Badges nominatifs en acrylique avec fixation magnétique ultra-forte, personnalisables avec votre logo et nom d\'entreprise.',
    unitPrice: 4.50,
    wholesalePrice: 2.99,
    wholesaleMinQty: 50,
    stock: 5000,
    categoryId: 'cat-3',
    sku: 'PRO-002',
    isFeatured: false,
    isActive: true,
    images: [
      { imageUrl: 'https://picsum.photos/seed/PRO-002-1/600/600', isPrimary: true, sortOrder: 0 }
    ]
  },
  {
    id: 'prod-6',
    name: 'Invitations de Congrès & Séminaires',
    slug: 'invitation-congres-seminaires',
    description: 'Cartes d\'invitation officielles pour événements professionnels, conférences et séminaires d\'entreprise sur papier glacé.',
    unitPrice: 1.20,
    wholesalePrice: 0.75,
    wholesaleMinQty: 200,
    stock: 12000,
    categoryId: 'cat-4',
    sku: 'EVE-001',
    isFeatured: true,
    isActive: true,
    images: [
      { imageUrl: 'https://picsum.photos/seed/EVE-001-1/600/600', isPrimary: true, sortOrder: 0 }
    ]
  },
  {
    id: 'prod-7',
    name: 'Cartes de Circoncision Traditionnelles',
    slug: 'cartes-circoncision-traditionnelles',
    description: 'Cartes d\'invitation dorées pour cérémonie de circoncision avec motifs arabesques traditionnels raffinés.',
    unitPrice: 1.50,
    wholesalePrice: 0.99,
    wholesaleMinQty: 100,
    stock: 6000,
    categoryId: 'cat-5',
    sku: 'REL-001',
    isFeatured: true,
    isActive: true,
    images: [
      { imageUrl: 'https://picsum.photos/seed/REL-001-1/600/600', isPrimary: true, sortOrder: 0 }
    ]
  },
  {
    id: 'prod-8',
    name: 'Cartes pour Enseignants & Remerciement',
    slug: 'cartes-enseignants-remerciement',
    description: 'Jolies cartes de remerciement pliées avec enveloppe pour exprimer votre gratitude aux enseignants, tuteurs et mentors.',
    unitPrice: 1.99,
    wholesalePrice: 1.20,
    wholesaleMinQty: 50,
    stock: 4000,
    categoryId: 'cat-6',
    sku: 'REM-001',
    isFeatured: false,
    isActive: true,
    images: [
      { imageUrl: 'https://picsum.photos/seed/REM-001-1/600/600', isPrimary: true, sortOrder: 0 }
    ]
  }
];

function getStorage(key, fallback) {
  const item = localStorage.getItem(STORAGE_PREFIX + key);
  if (!item) {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(item);
  } catch {
    return fallback;
  }
}

function setStorage(key, value) {
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
}

// Initialise DB
let users = getStorage('users', defaultUsers);
let categories = getStorage('categories', defaultCategories);
let products = getStorage('products', defaultProducts);

// Force reset local storage if it contains the old B2B category list
if (categories.some(c => c.slug === 'electronics') || categories.length !== 7) {
  localStorage.setItem(STORAGE_PREFIX + 'categories', JSON.stringify(defaultCategories));
  localStorage.setItem(STORAGE_PREFIX + 'products', JSON.stringify(defaultProducts));
  categories = defaultCategories;
  products = defaultProducts;
}

let orders = getStorage('orders', []);

export const mockDb = {
  // --- AUTH ---
  login: async (email, password) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password && u.isActive);
    if (!user) throw { response: { status: 400, data: { message: 'Invalid email or password' } } };
    const token = `mock-token-${user.id}-${Date.now()}`;
    return { token, user };
  },

  register: async (userData) => {
    const emailExists = users.some(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (emailExists) throw { response: { status: 400, data: { message: 'Email address already exists' } } };
    
    const newUser = {
      id: `user-${Date.now()}`,
      fullName: userData.fullName,
      email: userData.email,
      password: userData.password,
      phone: userData.phone || '',
      address: userData.address || '',
      role: 'client',
      isActive: true
    };
    users.push(newUser);
    setStorage('users', users);

    const token = `mock-token-${newUser.id}-${Date.now()}`;
    return { token, user: newUser };
  },

  getMe: async (token) => {
    if (!token) throw { response: { status: 401 } };
    const parts = token.replace('mock-token-', '').split('-');
    parts.pop();
    const userId = parts.join('-');
    const user = users.find(u => u.id === userId && u.isActive);
    if (!user) throw { response: { status: 401 } };
    return user;
  },

  updateProfile: async (token, updateData) => {
    const user = await mockDb.getMe(token);
    const updated = { ...user, ...updateData };
    users = users.map(u => u.id === user.id ? updated : u);
    setStorage('users', users);
    return updated;
  },

  // --- PRODUCTS ---
  getProducts: async (params = {}) => {
    let list = products.filter(p => p.isActive);
    
    if (params.featured === 'true' || params.featured === true) {
      list = list.filter(p => p.isFeatured);
    }
    if (params.category) {
      list = list.filter(p => p.categoryId === params.category);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }

    // Pagination
    const page = parseInt(params.page || 1);
    const limit = parseInt(params.limit || 12);
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return {
      data: paginated,
      pagination: {
        page,
        limit,
        total: list.length,
        pages: Math.ceil(list.length / limit)
      }
    };
  },

  getProductById: async (id) => {
    const product = products.find(p => p.id === id && p.isActive);
    if (!product) throw { response: { status: 404, data: { message: 'Product not found' } } };
    return product;
  },

  getAdminProducts: async (params = {}) => {
    let list = products.filter(p => p.isActive);

    if (params.category) {
      list = list.filter(p => p.categoryId === params.category);
    }

    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(p => 
        (p.name || '').toLowerCase().includes(q) || 
        (p.sku || '').toLowerCase().includes(q) || 
        (p.description || '').toLowerCase().includes(q)
      );
    }

    // Include category name
    const listWithCategories = list.map(p => {
      const cat = categories.find(c => c.id === p.categoryId);
      return {
        ...p,
        category: cat ? { id: cat.id, name: cat.name } : null
      };
    });

    // Pagination
    const page = parseInt(params.page || 1);
    const limit = parseInt(params.limit || 20);
    const startIndex = (page - 1) * limit;
    const paginated = listWithCategories.slice(startIndex, startIndex + limit);

    return {
      data: paginated,
      pagination: {
        page,
        limit,
        total: listWithCategories.length,
        pages: Math.ceil(listWithCategories.length / limit)
      }
    };
  },

  createProduct: async (formData) => {
    // Process form data fields. If formData is an instance of FormData, mock it.
    let payload = {};
    if (formData instanceof FormData) {
      for (let [key, val] of formData.entries()) {
        if (key === 'images') continue;
        payload[key] = val;
      }
    } else {
      payload = { ...formData };
    }

    // Handle standard properties
    const newProduct = {
      id: `prod-${Date.now()}`,
      name: payload.name,
      slug: (payload.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: payload.description || '',
      unitPrice: parseFloat(payload.unitPrice || 0),
      wholesalePrice: parseFloat(payload.wholesalePrice || 0),
      wholesaleMinQty: parseInt(payload.wholesaleMinQty || 100),
      stock: parseInt(payload.stock || 0),
      categoryId: payload.categoryId,
      sku: payload.sku || `SKU-${Math.floor(Math.random() * 90000) + 10000}`,
      isFeatured: payload.isFeatured === 'true' || payload.isFeatured === true,
      isActive: true,
      images: payload.images && payload.images.length > 0 ? payload.images : [
        { imageUrl: `https://picsum.photos/seed/PROD-${Date.now()}/600/600`, isPrimary: true, sortOrder: 0 }
      ]
    };

    products.push(newProduct);
    setStorage('products', products);
    return newProduct;
  },

  updateProduct: async (id, formData) => {
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) throw { response: { status: 404, data: { message: 'Product not found' } } };

    let payload = {};
    if (formData instanceof FormData) {
      for (let [key, val] of formData.entries()) {
        payload[key] = val;
      }
    } else {
      payload = { ...formData };
    }

    const current = products[idx];
    const updated = {
      ...current,
      name: payload.name !== undefined ? payload.name : current.name,
      slug: payload.name !== undefined ? payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : current.slug,
      description: payload.description !== undefined ? payload.description : current.description,
      unitPrice: payload.unitPrice !== undefined ? parseFloat(payload.unitPrice) : current.unitPrice,
      wholesalePrice: payload.wholesalePrice !== undefined ? parseFloat(payload.wholesalePrice) : current.wholesalePrice,
      wholesaleMinQty: payload.wholesaleMinQty !== undefined ? parseInt(payload.wholesaleMinQty) : current.wholesaleMinQty,
      stock: payload.stock !== undefined ? parseInt(payload.stock) : current.stock,
      categoryId: payload.categoryId !== undefined ? payload.categoryId : current.categoryId,
      sku: payload.sku !== undefined ? payload.sku : current.sku,
      isFeatured: payload.isFeatured !== undefined ? (payload.isFeatured === 'true' || payload.isFeatured === true) : current.isFeatured,
      images: payload.images !== undefined ? payload.images : current.images
    };

    products[idx] = updated;
    setStorage('products', products);
    return updated;
  },

  deleteProduct: async (id) => {
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) throw { response: { status: 404, data: { message: 'Product not found' } } };
    
    // Soft delete
    products[idx].isActive = false;
    setStorage('products', products);
    return { success: true };
  },

  // --- CATEGORIES ---
  getCategories: async () => {
    return categories.filter(c => c.isActive);
  },

  createCategory: async (catData) => {
    const newCat = {
      id: `cat-${Date.now()}`,
      name: catData.name,
      slug: (catData.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: catData.description || '',
      icon: catData.icon || '📁',
      isActive: true
    };
    categories.push(newCat);
    setStorage('categories', categories);
    return newCat;
  },

  updateCategory: async (id, catData) => {
    const idx = categories.findIndex(c => c.id === id);
    if (idx === -1) throw { response: { status: 404, data: { message: 'Category not found' } } };

    const updated = {
      ...categories[idx],
      name: catData.name || categories[idx].name,
      slug: catData.name ? catData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : categories[idx].slug,
      description: catData.description !== undefined ? catData.description : categories[idx].description,
      icon: catData.icon || categories[idx].icon
    };
    categories[idx] = updated;
    setStorage('categories', categories);
    return updated;
  },

  deleteCategory: async (id) => {
    const idx = categories.findIndex(c => c.id === id);
    if (idx === -1) throw { response: { status: 404, data: { message: 'Category not found' } } };
    
    // Soft delete
    categories[idx].isActive = false;
    setStorage('categories', categories);
    return { success: true };
  },

  // --- ORDERS ---
  createOrder: async (orderData, token) => {
    let userId = null;
    let user = null;
    if (token) {
      try {
        user = await mockDb.getMe(token);
        userId = user.id;
      } catch {}
    }

    // Decrement stock and calculate final amounts
    const items = orderData.items.map(item => {
      const prod = products.find(p => p.id === item.productId);
      if (!prod) throw { response: { status: 400, data: { message: `Product not found` } } };
      if (prod.stock < item.quantity) {
        throw { response: { status: 400, data: { message: `Not enough stock for ${prod.name}. Available: ${prod.stock}` } } };
      }
      prod.stock -= item.quantity;
      const price = item.quantity >= prod.wholesaleMinQty ? prod.wholesalePrice : prod.unitPrice;
      return {
        id: `item-${Date.now()}-${Math.random()}`,
        productId: item.productId,
        productName: prod.name,
        quantity: item.quantity,
        unitPrice: price,
        totalPrice: price * item.quantity
      };
    });

    // Save updated products stock
    setStorage('products', products);

    const subtotal = items.reduce((sum, i) => sum + i.totalPrice, 0);

    const newOrder = {
      id: `order-${Date.now()}`,
      orderNumber: `ORD-${Date.now().toString().slice(-8).toUpperCase()}`,
      userId,
      customerName: orderData.customerName || user?.fullName || 'Guest Client',
      customerEmail: orderData.customerEmail || user?.email || 'guest@wholesale.com',
      customerPhone: orderData.customerPhone || user?.phone || '',
      customerAddress: orderData.customerAddress || user?.address || '',
      notes: orderData.notes || '',
      status: 'pending',
      subtotal,
      totalAmount: subtotal,
      items,
      createdAt: new Date().toISOString()
    };

    orders.push(newOrder);
    setStorage('orders', orders);
    return newOrder;
  },

  getMyOrders: async (token, params = {}) => {
    const user = await mockDb.getMe(token);
    const userOrders = orders.filter(o => o.userId === user.id || o.customerEmail.toLowerCase() === user.email.toLowerCase());
    
    // Sort by date descending
    userOrders.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const page = parseInt(params.page || 1);
    const limit = parseInt(params.limit || 10);
    const startIndex = (page - 1) * limit;
    const paginated = userOrders.slice(startIndex, startIndex + limit);

    return {
      data: paginated,
      pagination: {
        page,
        limit,
        total: userOrders.length,
        pages: Math.ceil(userOrders.length / limit)
      }
    };
  },

  getOrderById: async (id) => {
    const order = orders.find(o => o.id === id);
    if (!order) throw { response: { status: 404, data: { message: 'Order not found' } } };
    return order;
  },

  getAdminOrders: async (params = {}) => {
    let list = [...orders];

    if (params.status) {
      list = list.filter(o => o.status === params.status);
    }

    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(o => 
        (o.customerName || '').toLowerCase().includes(q) || 
        (o.orderNumber || '').toLowerCase().includes(q) || 
        (o.customerEmail || '').toLowerCase().includes(q)
      );
    }

    list.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const page = parseInt(params.page || 1);
    const limit = parseInt(params.limit || 20);
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return {
      data: paginated,
      pagination: {
        page,
        limit,
        total: list.length,
        pages: Math.ceil(list.length / limit)
      }
    };
  },

  updateOrderStatus: async (id, status) => {
    const idx = orders.findIndex(o => o.id === id);
    if (idx === -1) throw { response: { status: 404, data: { message: 'Order not found' } } };

    const oldStatus = orders[idx].status;
    orders[idx].status = status;

    // If order becomes cancelled, restore stocks
    if (status === 'cancelled' && oldStatus !== 'cancelled') {
      orders[idx].items.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        if (prod) prod.stock += item.quantity;
      });
      setStorage('products', products);
    }
    // If order was cancelled and is now reactivated, decrement stocks
    else if (oldStatus === 'cancelled' && status !== 'cancelled') {
      orders[idx].items.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        if (prod) prod.stock = Math.max(0, prod.stock - item.quantity);
      });
      setStorage('products', products);
    }

    setStorage('orders', orders);
    return orders[idx];
  },

  // --- CUSTOMERS ---
  getAdminCustomers: async (params = {}) => {
    let clients = users.filter(u => u.role === 'client');

    if (params.search) {
      const q = params.search.toLowerCase();
      clients = clients.filter(c => 
        (c.fullName || '').toLowerCase().includes(q) || 
        (c.email || '').toLowerCase().includes(q) || 
        (c.phone || '').toLowerCase().includes(q)
      );
    }

    const clientsWithStats = clients.map(c => {
      const customerOrders = orders.filter(o => (o.userId === c.id || o.customerEmail.toLowerCase() === c.email.toLowerCase()));
      const orderCount = customerOrders.length;
      const totalSpent = customerOrders.reduce((sum, o) => o.status !== 'cancelled' ? sum + o.totalAmount : sum, 0);
      return {
        ...c,
        orderCount,
        totalSpent
      };
    });

    // Pagination
    const page = parseInt(params.page || 1);
    const limit = parseInt(params.limit || 20);
    const startIndex = (page - 1) * limit;
    const paginated = clientsWithStats.slice(startIndex, startIndex + limit);

    return {
      data: paginated,
      pagination: {
        page,
        limit,
        total: clientsWithStats.length,
        pages: Math.ceil(clientsWithStats.length / limit)
      }
    };
  },

  getAdminCustomerDetail: async (id) => {
    const customer = users.find(u => u.id === id && u.role === 'client');
    if (!customer) throw { response: { status: 404, data: { message: 'Customer not found' } } };
    
    const customerOrders = orders.filter(o => o.customerEmail.toLowerCase() === customer.email.toLowerCase());
    const totalSpent = customerOrders.reduce((sum, o) => o.status !== 'cancelled' ? sum + o.totalAmount : sum, 0);
    return {
      ...customer,
      orders: customerOrders.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)),
      totalSpent,
      orderCount: customerOrders.length
    };
  },

  // --- DASHBOARD ---
  getAdminDashboard: async () => {
    const activeProducts = products.filter(p => p.isActive).length;
    const clientCount = users.filter(u => u.role === 'client').length;
    
    // Revenue calculations (from all non-cancelled orders)
    const validOrders = orders.filter(o => o.status !== 'cancelled');
    const revenue = validOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    // Status counts
    const statusMap = { pending: 0, confirmed: 0, processing: 0, delivered: 0, cancelled: 0 };
    orders.forEach(o => {
      if (statusMap[o.status] !== undefined) statusMap[o.status]++;
    });

    const statusCounts = Object.entries(statusMap).map(([status, count]) => ({
      status,
      count
    }));

    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    return {
      totalProducts: activeProducts,
      totalOrders: orders.length,
      totalClients: clientCount,
      revenue,
      statusCounts,
      recentOrders
    };
  }
};
