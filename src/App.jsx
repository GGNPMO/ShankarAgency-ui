import { useEffect, useMemo, useState } from 'react'
import './App.css'

const initialProducts = [
  {
    id: 1,
    name: 'Premium Brass Door Handle',
    category: 'Home Hardware',
    price: 899,
    unit: 'piece',
    stock: 'In stock',
    badge: 'Top Pick',
    accent: 'amber',
  },
  {
    id: 2,
    name: 'Heavy Duty Wall Hinge',
    category: 'Fittings',
    price: 450,
    unit: 'set',
    stock: 'In stock',
    badge: 'Popular',
    accent: 'brown',
  },
  {
    id: 3,
    name: 'Digital Lock Set',
    category: 'Security',
    price: 2499,
    unit: 'unit',
    stock: 'Fast moving',
    badge: 'New',
    accent: 'slate',
  },
  {
    id: 4,
    name: 'Waterproof LED Batten',
    category: 'Electrical',
    price: 1199,
    unit: 'pack',
    stock: 'Low stock',
    badge: 'Energy Saver',
    accent: 'gold',
  },
  {
    id: 5,
    name: 'Granite Finish Sink Mixer',
    category: 'Plumbing',
    price: 1790,
    unit: 'unit',
    stock: 'In stock',
    badge: 'Trusted',
    accent: 'teal',
  },
  {
    id: 6,
    name: 'Solid Wood Wardrobe Kit',
    category: 'Wood Work',
    price: 6999,
    unit: 'set',
    stock: 'Custom order',
    badge: 'Bestseller',
    accent: 'oak',
  },
  {
    id: 'sample-door-knob',
    name: 'Sample Satin Brass Door Knob',
    category: 'Door Knobs',
    price: 649,
    unit: 'piece',
    stock: 'In stock',
    badge: 'Sample',
    accent: 'gold',
  },
]

const demoProductCategories = ['Locks', 'Knobs', 'Door Handles']
const demoFinishes = ['Satin Nickel', 'Matte Black', 'Antique Brass', 'Polished Chrome', 'Brushed Gold']
const demoAccents = ['amber', 'brown', 'slate', 'gold', 'teal', 'oak']
const demoCatalogProducts = Array.from({ length: 500 }, (_, index) => {
  const category = demoProductCategories[index % demoProductCategories.length]
  const productType = category === 'Door Handles' ? 'Door Handle' : category.slice(0, -1)
  const basePrice = category === 'Locks' ? 1299 : category === 'Knobs' ? 349 : 599

  return {
    id: `demo-${String(index + 1).padStart(3, '0')}`,
    name: `Sample ${demoFinishes[index % demoFinishes.length]} ${productType} ${String(index + 1).padStart(3, '0')}`,
    category,
    price: basePrice + (index % 17) * 85,
    unit: 'piece',
    stock: 'In stock',
    badge: 'Sample',
    accent: demoAccents[index % demoAccents.length],
  }
})

const loadInitialProducts = () => {
  const savedProducts = localStorage.getItem('shankar-agency-products')
  let products = savedProducts ? JSON.parse(savedProducts) : initialProducts

  const sampleWasSeeded = localStorage.getItem('shankar-agency-sample-product-seeded') === 'true'
  if (!sampleWasSeeded && !products.some((product) => product.id === 'sample-door-knob')) {
    products = [...products, initialProducts.find((product) => product.id === 'sample-door-knob')]
  }

  const demoCatalogWasSeeded = localStorage.getItem('shankar-agency-demo-catalog-seeded') === 'true'
  if (!demoCatalogWasSeeded) {
    const existingIds = new Set(products.map((product) => product.id))
    products = [...products, ...demoCatalogProducts.filter((product) => !existingIds.has(product.id))]
  }

  return products
}

const services = [
  {
    title: 'Home Interior Design',
    description:
      'Complete living space planning with modern layouts, lighting guidance, and material suggestions for every room.',
    features: ['1D planning', 'Lighting layout', 'Budget guidance'],
  },
  {
    title: 'Custom Wooden Work',
    description:
      'Premium wardrobes, cabinets, paneling, and handcrafted finishes designed to match your home and lifestyle.',
    features: ['Wardrobes', 'Cabinetry', 'Decor panels'],
  },
  {
    title: 'Renovation & Finishing',
    description:
      'From wall finishes to final detailing, we help upgrade spaces with durable, elegant material choices.',
    features: ['Material sourcing', 'Finish selection', 'Execution support'],
  },
]

const defaultProductForm = {
  name: '',
  category: 'Home Hardware',
  price: '',
  unit: 'piece',
  stock: 'In stock',
  badge: 'New',
  accent: 'amber',
  isVisible: true,
}

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)

function App() {
  const [products, setProducts] = useState(loadInitialProducts)
  const [categories, setCategories] = useState(() => {
    const savedCategories = localStorage.getItem('shankar-agency-categories')
    const savedCategoryList = savedCategories ? JSON.parse(savedCategories) : []
    const productCategories = loadInitialProducts().map((product) => product.category).filter(Boolean)
    return [...new Set([...savedCategoryList, ...productCategories])]
  })
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [productSearch, setProductSearch] = useState('')
  const [categoryPages, setCategoryPages] = useState({})
  const [expandedCategories, setExpandedCategories] = useState({ 'Door Knobs': true })
  const [showAdmin, setShowAdmin] = useState(false)
  const [editingProductId, setEditingProductId] = useState(null)
  const [productForm, setProductForm] = useState(defaultProductForm)
  const [categoryName, setCategoryName] = useState('')
  const [categorySearch, setCategorySearch] = useState('')
  const [editingCategory, setEditingCategory] = useState(null)
  const [cart, setCart] = useState([])
  const [orderForm, setOrderForm] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
  })
  const [orderPlaced, setOrderPlaced] = useState(false)

  useEffect(() => {
    localStorage.setItem('shankar-agency-products', JSON.stringify(products))
    localStorage.setItem('shankar-agency-sample-product-seeded', 'true')
    localStorage.setItem('shankar-agency-demo-catalog-seeded', 'true')
  }, [products])

  useEffect(() => {
    localStorage.setItem('shankar-agency-categories', JSON.stringify(categories))
  }, [categories])

  const visibleProducts = useMemo(
    () => products.filter((product) => product.isVisible !== false),
    [products],
  )

  const availableCategories = useMemo(
    () => categories.filter((category) => visibleProducts.some((product) => product.category === category)),
    [categories, visibleProducts],
  )

  const activeCategory = selectedCategory === 'All' || availableCategories.includes(selectedCategory)
    ? selectedCategory
    : 'All'

  const filteredProducts = useMemo(
    () => visibleProducts.filter((product) => {
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory
      const searchText = productSearch.trim().toLowerCase()
      const matchesSearch = !searchText || `${product.name} ${product.category}`.toLowerCase().includes(searchText)
      return matchesCategory && matchesSearch
    }),
    [activeCategory, productSearch, visibleProducts],
  )

  const categoryCounts = useMemo(
    () => products.reduce((counts, product) => {
      counts.set(product.category, (counts.get(product.category) ?? 0) + 1)
      return counts
    }, new Map()),
    [products],
  )

  const filteredCategories = useMemo(
    () => categories.filter((category) => category.toLowerCase().includes(categorySearch.trim().toLowerCase())),
    [categories, categorySearch],
  )

  const productsPerPage = 24
  const catalogGroups = useMemo(() => {
    const groupedProducts = new Map()
    filteredProducts.forEach((product) => {
      if (!groupedProducts.has(product.category)) groupedProducts.set(product.category, [])
      groupedProducts.get(product.category).push(product)
    })
    return availableCategories
      .map((category) => ({ category, products: groupedProducts.get(category) ?? [] }))
      .filter((group) => group.products.length > 0)
  }, [availableCategories, filteredProducts])

  const hiddenProducts = useMemo(
    () => products.filter((product) => product.isVisible === false),
    [products],
  )

  const addToCart = (product) => {
    setOrderPlaced(false)
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id)
      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [...currentCart, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (productId, change) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId ? { ...item, quantity: Math.max(0, item.quantity + change) } : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = subtotal === 0 ? 0 : subtotal > 2000 ? 0 : 199
  const total = subtotal + shipping

  const handleOrderChange = (event) => {
    const { name, value } = event.target
    setOrderForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmitOrder = (event) => {
    event.preventDefault()
    if (!orderForm.name || !orderForm.phone || !orderForm.address || cart.length === 0) {
      return
    }

    setOrderPlaced(true)
    setCart([])
    setOrderForm({ name: '', phone: '', address: '', notes: '' })
  }

  const handleProductFormChange = (event) => {
    const { name, type, value, checked } = event.target
    setProductForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleCategorySubmit = (event) => {
    event.preventDefault()
    const nextName = categoryName.trim()
    if (!nextName || categories.some((category) => category.toLowerCase() === nextName.toLowerCase() && category !== editingCategory)) {
      return
    }

    if (editingCategory) {
      setCategories((currentCategories) => currentCategories.map((category) => category === editingCategory ? nextName : category))
      setProducts((currentProducts) => currentProducts.map((product) =>
        product.category === editingCategory ? { ...product, category: nextName } : product,
      ))
      setProductForm((current) => current.category === editingCategory ? { ...current, category: nextName } : current)
    } else {
      setCategories((currentCategories) => [...currentCategories, nextName])
      setProductForm((current) => ({ ...current, category: nextName }))
    }

    setCategoryName('')
    setEditingCategory(null)
  }

  const handleDeleteCategory = (category) => {
    if ((categoryCounts.get(category) ?? 0) > 0 || categories.length <= 1) return
    setCategories((currentCategories) => currentCategories.filter((item) => item !== category))
    setProductForm((current) => current.category === category ? { ...current, category: categories.find((item) => item !== category) } : current)
    if (selectedCategory === category) setSelectedCategory('All')
  }

  const handleProductSubmit = (event) => {
    event.preventDefault()

    const name = productForm.name.trim()
    const category = productForm.category.trim()
    const price = Number(productForm.price)
    const unit = productForm.unit.trim() || 'piece'

    if (!name || !category || Number.isNaN(price) || price <= 0) {
      return
    }

    const payload = {
      id: editingProductId ?? Date.now(),
      name,
      category,
      price,
      unit,
      stock: productForm.stock.trim() || 'In stock',
      badge: productForm.badge.trim() || 'New',
      accent: productForm.accent || 'amber',
      isVisible: productForm.isVisible !== false,
    }

    setProducts((currentProducts) => {
      if (editingProductId) {
        return currentProducts.map((product) =>
          product.id === editingProductId ? { ...product, ...payload } : product,
        )
      }
      return [payload, ...currentProducts]
    })

    setProductForm(defaultProductForm)
    setEditingProductId(null)
  }

  const handleEditProduct = (product) => {
    setEditingProductId(product.id)
    setProductForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      unit: product.unit,
      stock: product.stock,
      badge: product.badge,
      accent: product.accent,
      isVisible: product.isVisible !== false,
    })
    setShowAdmin(true)
  }

  const handleDeleteProduct = (productId) => {
    setProducts((currentProducts) => currentProducts.filter((product) => product.id !== productId))
  }

  const handleToggleVisibility = (productId) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === productId ? { ...product, isVisible: product.isVisible === false } : product,
      ),
    )
  }

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="container nav-wrap">
          <div className="brand-block">
            <div className="brand-mark">S</div>
            <div>
              <p className="brand-name">Shankar Agency</p>
              <span>Hardware + Interiors</span>
            </div>
          </div>

          <nav className="main-nav" aria-label="Main navigation">
            <a href="#home">Home</a>
            <a href="#products">Products</a>
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>

          <div className="header-actions">
            <button type="button" className="secondary-btn small-btn" onClick={() => setShowAdmin((open) => !open)}>
              {showAdmin ? 'Hide Admin' : 'Admin Panel'}
            </button>
            <button type="button" className="nav-cta">
              Call Now
            </button>
          </div>
        </div>
      </header>

      <main id="home">
        {showAdmin && (
          <section className="section-block admin-section">
            <div className="container admin-panel">
              <div className="section-header admin-header">
                <div>
                  <p className="eyebrow">Admin tools</p>
                  <h2>{editingProductId ? 'Update product information' : 'Add new product'}</h2>
                </div>
                {editingProductId && (
                  <button type="button" className="secondary-btn small-btn" onClick={() => { setEditingProductId(null); setProductForm(defaultProductForm) }}>
                    Cancel edit
                  </button>
                )}
              </div>

              <form className="admin-form" onSubmit={handleProductSubmit}>
                <label>
                  Product name
                  <input name="name" value={productForm.name} onChange={handleProductFormChange} placeholder="Enter product name" />
                </label>

                <label>
                  Category
                  <select name="category" value={productForm.category} onChange={handleProductFormChange} required>
                    {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                  </select>
                </label>

                <label>
                  Price
                  <input name="price" type="number" value={productForm.price} onChange={handleProductFormChange} placeholder="Enter price" />
                </label>

                <label>
                  Unit
                  <input name="unit" value={productForm.unit} onChange={handleProductFormChange} placeholder="piece / set / pack" />
                </label>

                <label>
                  Stock status
                  <input name="stock" value={productForm.stock} onChange={handleProductFormChange} placeholder="In stock" />
                </label>

                <label>
                  Badge
                  <input name="badge" value={productForm.badge} onChange={handleProductFormChange} placeholder="Top Pick" />
                </label>

                <label>
                  Accent theme
                  <select name="accent" value={productForm.accent} onChange={handleProductFormChange}>
                    <option value="amber">Amber</option>
                    <option value="brown">Brown</option>
                    <option value="slate">Slate</option>
                    <option value="gold">Gold</option>
                    <option value="teal">Teal</option>
                    <option value="oak">Oak</option>
                  </select>
                </label>

                <label className="checkbox-field">
                  <input
                    type="checkbox"
                    name="isVisible"
                    checked={productForm.isVisible !== false}
                    onChange={handleProductFormChange}
                  />
                  Display this product in the storefront UI
                </label>

                <button type="submit" className="primary-btn admin-submit">
                  {editingProductId ? 'Update product' : 'Save product'}
                </button>
              </form>

              <section className="category-manager" aria-labelledby="category-manager-title">
                <div className="category-manager-heading">
                  <div>
                    <p className="eyebrow">Organize your catalog</p>
                    <h3 id="category-manager-title">Product categories</h3>
                  </div>
                  <span>{categories.length} categories</span>
                </div>

                <form className="category-form" onSubmit={handleCategorySubmit}>
                  <label>
                    {editingCategory ? 'Rename category' : 'New category'}
                    <input
                      value={categoryName}
                      onChange={(event) => setCategoryName(event.target.value)}
                      placeholder="For example: Door Handles"
                      required
                    />
                  </label>
                  <button type="submit" className="primary-btn">
                    {editingCategory ? 'Save category' : 'Add category'}
                  </button>
                  {editingCategory && (
                    <button type="button" className="secondary-btn" onClick={() => { setEditingCategory(null); setCategoryName('') }}>
                      Cancel
                    </button>
                  )}
                </form>

                <label className="category-search">
                  Find a category
                  <input
                    type="search"
                    value={categorySearch}
                    onChange={(event) => setCategorySearch(event.target.value)}
                    placeholder="Search categories"
                  />
                </label>

                <div className="category-admin-list">
                  {filteredCategories.map((category) => {
                    const productCount = categoryCounts.get(category) ?? 0
                    return (
                      <div key={category} className="category-admin-row">
                        <div>
                          <strong>{category}</strong>
                          <span>{productCount} {productCount === 1 ? 'product' : 'products'}</span>
                        </div>
                        <div className="category-admin-actions">
                          <button type="button" className="edit-btn" onClick={() => { setEditingCategory(category); setCategoryName(category) }}>
                            Rename
                          </button>
                          <button
                            type="button"
                            className="delete-btn"
                            disabled={productCount > 0 || categories.length <= 1}
                            title={productCount > 0 ? 'Move products out of this category before deleting it' : 'Keep at least one category'}
                            onClick={() => handleDeleteCategory(category)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )
                  })}
                  {filteredCategories.length === 0 && <p className="category-empty">No categories match that search.</p>}
                </div>
              </section>

              {hiddenProducts.length > 0 && (
                <div className="hidden-products-panel">
                  <h3>Hidden products</h3>
                  <div className="hidden-products-list">
                    {hiddenProducts.map((product) => (
                      <div key={product.id} className="hidden-product-row">
                        <div>
                          <strong>{product.name}</strong>
                          <span>{product.category}</span>
                        </div>
                        <button type="button" className="primary-btn hidden-show-btn" onClick={() => handleToggleVisibility(product.id)}>
                          Add to UI
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        <section className="hero-section">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Trusted by homes and businesses</p>
              <h1>Quality hardware and beautiful interior solutions.</h1>
              <p className="hero-text">
                Shankar Agency helps customers find the right fittings, accessories, and custom wooden work
                for stronger spaces and smarter homes.
              </p>

              <div className="hero-actions">
                <a href="#products" className="primary-btn">
                  Shop Products
                </a>
                <a href="#services" className="secondary-btn">
                  Explore Services
                </a>
              </div>

              <div className="stats-row">
                <div>
                  <strong>1,200+</strong>
                  <span>Products sold</span>
                </div>
                <div>
                  <strong>250+</strong>
                  <span>Interior projects</span>
                </div>
                <div>
                  <strong>15 yrs</strong>
                  <span>Industry trust</span>
                </div>
              </div>
            </div>

            <div className="hero-panel" aria-label="Featured category panel">
              <div className="panel-card highlight-card">
                <span className="tag">Featured</span>
                <h3>Smart Security & Home Hardware</h3>
                <p>Premium door fittings, lock systems, and finishing essentials for modern homes.</p>
                <div className="mini-price-row">
                  <span>Starting at</span>
                  <strong>{formatCurrency(899)}</strong>
                </div>
              </div>

              <div className="panel-card list-card">
                <ul>
                  <li>Door hardware</li>
                  <li>Electrical essentials</li>
                  <li>Custom wooden work</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section-block categories-section">
          <div className="container">
            <div className="section-header">
              <p className="eyebrow">Browse categories</p>
              <h2>Everything you need under one roof</h2>
            </div>

            <div className="category-grid">
              {availableCategories.slice(0, 6).map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`chip ${activeCategory === category ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(category)
                    setCategoryPages({})
                    setExpandedCategories((current) => ({ ...current, [category]: true }))
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="products" className="section-block product-section">
          <div className="container">
            <div className="section-header split-header">
              <div>
                <p className="eyebrow">Shop products</p>
                <h2>Hardware essentials with transparent pricing</h2>
              </div>
              <div className="product-header-actions">
                <button
                  type="button"
                  className="primary-btn add-product-btn"
                  onClick={() => {
                    setEditingProductId(null)
                    setProductForm(defaultProductForm)
                    setShowAdmin(true)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                >
                  Add Product
                </button>
                <div className="cart-summary">
                  <span>{cart.length} items</span>
                  <strong>{formatCurrency(subtotal)}</strong>
                </div>
              </div>
            </div>

            <div className="catalog-toolbar">
              <label>
                Search products
                <input
                  type="search"
                  value={productSearch}
                  onChange={(event) => { setProductSearch(event.target.value); setCategoryPages({}) }}
                  placeholder="Search by product or category"
                />
              </label>
              <label>
                Category
                <select
                  value={activeCategory}
                  onChange={(event) => {
                    const category = event.target.value
                    setSelectedCategory(category)
                    setCategoryPages({})
                    if (category !== 'All') setExpandedCategories((current) => ({ ...current, [category]: true }))
                  }}
                >
                  <option value="All">All categories</option>
                  {availableCategories.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
              </label>
              <p className="catalog-result-count">
                {filteredProducts.length === 0
                  ? 'No products found'
                  : `${filteredProducts.length.toLocaleString('en-IN')} products in ${catalogGroups.length} categories`}
              </p>
            </div>

            <div className="catalog-groups">
              {catalogGroups.map(({ category, products: categoryProducts }) => {
                const isExpanded = expandedCategories[category] ?? false
                const pageCount = Math.ceil(categoryProducts.length / productsPerPage)
                const currentPage = Math.min(categoryPages[category] ?? 1, pageCount)
                const pageProducts = categoryProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)

                return (
                  <section className="catalog-category" key={category}>
                    <button
                      type="button"
                      className="category-accordion-trigger"
                      aria-expanded={isExpanded}
                      aria-controls={`catalog-products-${category.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`}
                      onClick={() => setExpandedCategories((current) => ({ ...current, [category]: !isExpanded }))}
                    >
                      <span className="category-accordion-title">
                        <strong>{category}</strong>
                        <small>{categoryProducts.length.toLocaleString('en-IN')} products</small>
                      </span>
                      <span className="category-accordion-icon" aria-hidden="true">{isExpanded ? '−' : '+'}</span>
                    </button>

                    {isExpanded && (
                      <div
                        className="catalog-category-products"
                        id={`catalog-products-${category.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`}
                      >
                        <div className="product-grid">
                          {pageProducts.map((product) => (
                            <article key={product.id} className="product-card">
                              <div className={`product-visual visual-${product.accent}`}>
                                <span>{product.category}</span>
                              </div>
                              <div className="product-data">
                                <div className="product-meta">
                                  <span className="badge">{product.badge}</span>
                                  <span className="stock">{product.stock}</span>
                                </div>
                                <h3>{product.name}</h3>
                                <div className="product-price-row">
                                  <strong>{formatCurrency(product.price)}</strong>
                                  <span>/{product.unit}</span>
                                </div>
                                <div className="product-actions">
                                  <button type="button" className="product-btn" onClick={() => addToCart(product)}>
                                    Add to cart
                                  </button>
                                  <button type="button" className="edit-btn" onClick={() => handleEditProduct(product)}>
                                    Edit
                                  </button>
                                  <button type="button" className="hide-btn" onClick={() => handleToggleVisibility(product.id)}>
                                    {product.isVisible === false ? 'Show UI' : 'Hide UI'}
                                  </button>
                                  <button type="button" className="delete-btn" onClick={() => handleDeleteProduct(product.id)}>
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </article>
                          ))}
                        </div>

                        {categoryProducts.length > productsPerPage && (
                          <nav className="catalog-pagination" aria-label={`${category} product pages`}>
                            <button
                              type="button"
                              className="secondary-btn"
                              disabled={currentPage === 1}
                              onClick={() => setCategoryPages((current) => ({ ...current, [category]: currentPage - 1 }))}
                            >
                              Previous
                            </button>
                            <span>Page {currentPage} of {pageCount}</span>
                            <button
                              type="button"
                              className="secondary-btn"
                              disabled={currentPage === pageCount}
                              onClick={() => setCategoryPages((current) => ({ ...current, [category]: currentPage + 1 }))}
                            >
                              Next
                            </button>
                          </nav>
                        )}
                      </div>
                    )}
                  </section>
                )
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="catalog-empty-state">
                <h3>No products match your search</h3>
                <p>Try another product name or category.</p>
                <button type="button" className="secondary-btn" onClick={() => { setProductSearch(''); setSelectedCategory('All'); setCategoryPages({}) }}>
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>

        <section id="services" className="section-block service-section">
          <div className="container">
            <div className="section-header">
              <p className="eyebrow">Our services</p>
              <h2>Expert interior and woodwork solutions</h2>
            </div>

            <div className="service-grid">
              {services.map((service) => (
                <article key={service.title} className="service-card">
                  <div className="service-icon">✦</div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <ul>
                    {service.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="section-block about-section">
          <div className="container about-grid">
            <div>
              <p className="eyebrow">Why Shankar Agency</p>
              <h2>Built for dependable service and long-lasting quality.</h2>
              <p>
                We support households, builders, and commercial spaces with trusted hardware supply, custom wood
                craftsmanship, and thoughtful interior planning.
              </p>
            </div>

            <div className="promise-box">
              <div>
                <strong>Timely delivery</strong>
                <span>On schedule supply for projects and retail orders.</span>
              </div>
              <div>
                <strong>Affordable pricing</strong>
                <span>Smart choices for everyday needs and premium solutions.</span>
              </div>
              <div>
                <strong>Custom finishes</strong>
                <span>Wood and interior work tailored to your style and space.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section-block checkout-section">
          <div className="container checkout-grid">
            <div className="order-summary-card">
              <div className="summary-header">
                <h3>Cart Summary</h3>
                <span>{cart.length} items</span>
              </div>

              {cart.length === 0 ? (
                <p className="empty-cart">Your cart is empty. Add products to place an order.</p>
              ) : (
                <div className="cart-list">
                  {cart.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div>
                        <h4>{item.name}</h4>
                        <p>{formatCurrency(item.price)} each</p>
                      </div>
                      <div className="qty-box">
                        <button type="button" onClick={() => updateQuantity(item.id, -1)} aria-label={`Decrease ${item.name}`}>
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, 1)} aria-label={`Increase ${item.name}`}>
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="totals">
                <div>
                  <span>Subtotal</span>
                  <strong>{formatCurrency(subtotal)}</strong>
                </div>
                <div>
                  <span>Shipping</span>
                  <strong>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</strong>
                </div>
                <div className="grand-total">
                  <span>Total</span>
                  <strong>{formatCurrency(total)}</strong>
                </div>
              </div>
            </div>

            <form className="checkout-form" onSubmit={handleSubmitOrder}>
              <div className="section-header compact-header">
                <p className="eyebrow">Checkout</p>
                <h2>Place your order</h2>
              </div>

              <label>
                Full name
                <input
                  type="text"
                  name="name"
                  value={orderForm.name}
                  onChange={handleOrderChange}
                  placeholder="Your name"
                />
              </label>

              <label>
                Phone number
                <input
                  type="tel"
                  name="phone"
                  value={orderForm.phone}
                  onChange={handleOrderChange}
                  placeholder="Enter contact number"
                />
              </label>

              <label>
                Delivery address
                <textarea
                  name="address"
                  value={orderForm.address}
                  onChange={handleOrderChange}
                  placeholder="Street, area, city"
                  rows="4"
                />
              </label>

              <label>
                Order notes
                <textarea
                  name="notes"
                  value={orderForm.notes}
                  onChange={handleOrderChange}
                  placeholder="Any special requirement or product note"
                  rows="3"
                />
              </label>

              <button type="submit" className="primary-btn submit-btn" disabled={cart.length === 0}>
                Place Order
              </button>

              {orderPlaced && (
                <div className="success-box">
                  Your order has been placed successfully. Our team will contact you shortly.
                </div>
              )}
            </form>
          </div>
        </section>
      </main>

      <footer id="contact" className="site-footer">
        <div className="container footer-grid">
          <div>
            <p className="brand-name">Shankar Agency</p>
            <p>Hardware supply, interior consultation, and custom wooden work for homes and commercial spaces.</p>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li>+91 98765 43210</li>
              <li>sales@shankaragency.in</li>
              <li>Near City Market, Your Town</li>
            </ul>
          </div>
          <div>
            <h4>Business Hours</h4>
            <ul>
              <li>Mon - Sat: 9:00 AM - 8:00 PM</li>
              <li>Sunday: By appointment</li>
              <li>Interior consults available</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
