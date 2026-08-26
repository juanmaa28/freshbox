// Diccionario local: no depende de Internet ni de un servicio de traducción externo.
const translations = {
  es: {
    nav: { home: 'Inicio', categories: 'Categorías', search: 'Buscar', alerts: 'Alertas', settings: 'Ajustes' },
    home: {
      greeting: 'Hola, {name}',
      expiring: '{count} {item} por vencer esta semana',
      product: 'producto', products: 'productos', allPantry: 'Toda la despensa', upcoming: 'Próximos a vencer',
      seeUpcoming: 'Ver próximos', seeAll: 'Ver todos ({count})', empty: 'Tu despensa está vacía. Agrega tu primer producto con el botón +',
      fresh: 'Nada por vencer esta semana. ¡Todo fresco!', order: 'Ordenar productos', expiry: 'Por vencimiento', name: 'Por nombre',
      expired: 'Vencidos', urgent: 'Próximos a vencer', week: 'Esta semana', later: 'Más adelante', add: 'Agregar producto',
    },
    search: {
      placeholder: 'Buscar producto...', cancel: 'Cancelar', all: 'Todos', result: 'resultado', results: 'resultados',
      type: 'Escribe el nombre de un producto para buscar.', none: 'No se encontraron productos.', recent: 'Búsquedas recientes',
      clear: 'Limpiar', remove: 'Eliminar búsqueda {term}', clearInput: 'Limpiar',
    },
    categories: { title: 'Categorías', product: 'producto', products: 'productos', empty: 'No hay productos en esta categoría.', back: 'Volver' },
    detail: {
      title: 'Detalle', missing: 'Este producto ya no existe.', purchase: 'Fecha de compra', expiryDate: 'Fecha de vencimiento',
      remaining: 'Días restantes', quantity: 'Cantidad', location: 'Ubicación', notes: 'Notas', fresh: 'Este producto está fresco',
      edit: 'Editar', delete: 'Eliminar', consumed: 'Marcar como consumido', added: 'Producto agregado correctamente',
      consumeTitle: '¿Marcar como consumido?', consumeMessage: '"{name}" se retirará de tu despensa.', deleteTitle: '¿Eliminar producto?',
      deleteMessage: '"{name}" se eliminará de tu despensa. Esta acción no se puede deshacer.',
    },
    add: {
      addTitle: 'Agregar producto', editTitle: 'Editar producto', photo: 'Agregar foto del producto', removePhoto: 'Quitar foto',
      name: 'Nombre del producto', namePlaceholder: 'Ej: Leche entera 1L', category: 'Categoría', chooseCategory: 'Seleccionar categoría...',
      purchase: 'Fecha de compra', expiry: 'Fecha de vencimiento', quantity: 'Cantidad', quantityPlaceholder: 'Ej: 1 litro / 500 g',
      location: 'Ubicación (opcional)', locationPlaceholder: 'Ej: Nevera · Estante 2', notes: 'Notas opcionales', notesPlaceholder: 'Ej: abrir antes del fin de semana',
      save: 'Guardar producto', saveChanges: 'Guardar cambios', cancel: 'Cancelar', requiredName: 'Ingresa el nombre del producto',
      requiredCategory: 'Selecciona una categoría', requiredPurchase: 'Ingresa la fecha de compra', requiredExpiry: 'Ingresa la fecha de vencimiento',
      dateOrder: 'Debe ser posterior a la compra',
    },
    alerts: { title: 'Notificaciones', today: 'Urgentes hoy', week: 'Esta semana', total: 'Total activas', critical: 'Crítico', urgent: 'Urgente', medium: 'Medio', low: 'Bajo', none: 'Sin alertas activas. Tu despensa está bajo control.' },
    settings: {
      title: 'Ajustes', preferences: 'Preferencias', push: 'Notificaciones push', email: 'Alertas por email', dark: 'Tema oscuro', language: 'Idioma',
      account: 'Cuenta', profile: 'Mi perfil', privacy: 'Privacidad', information: 'Información', about: 'Acerca de FreshBox', terms: 'Términos de uso',
      clearPantry: 'Limpiar despensa', logout: 'Cerrar sesión', close: 'Cerrar', aboutText: 'FreshBox v1.0.0 — Frescura que no se te olvida.',
      privacyText: 'FreshBox no envía tu información a ningún servidor: productos, fotos y ajustes se almacenan localmente en tu navegador.',
      termsText: 'Proyecto académico sin fines comerciales. Los datos se guardan únicamente en tu dispositivo.', clearTitle: '¿Limpiar la despensa?',
      clearMessage: 'Se eliminarán {count} productos. Esta acción no se puede deshacer.',
    },
    profile: { title: 'Mi perfil', changePhoto: 'Cambiar foto', products: 'Productos', alerts: 'Alertas', fresh: 'Frescos', personal: 'Información personal', edit: 'Editar', fullName: 'Nombre completo', email: 'Correo electrónico', phone: 'Teléfono', member: 'Miembro desde', plan: 'Plan', save: 'Guardar', cancel: 'Cancelar', logout: 'Cerrar sesión' },
    login: { subtitle: 'Inicia sesión para gestionar tu despensa', registerSubtitle: 'Crea tu cuenta y empieza a ahorrar', name: 'Nombre', namePlaceholder: 'Tu nombre', email: 'Correo electrónico', password: 'Contraseña', forgot: '¿Olvidaste tu contraseña?', submit: 'Iniciar sesión', register: 'Crear cuenta', newAccount: 'Crear cuenta nueva', haveAccount: 'Ya tengo cuenta', accept: 'Al continuar aceptas los', emailError: 'Ingresa un correo válido', passwordError: 'Mínimo 4 caracteres', nameError: 'Ingresa tu nombre' },
    common: { back: 'Volver', day: 'día', days: 'días', expired: 'Vencido', yesterday: 'Venció ayer', today: 'Vence hoy', tomorrow: 'Vence mañana', inDays: 'Vence en {count} días', agoDays: 'Venció hace {count} días', dash: '—' },
    splash: { loading: 'Cargando...' },
  },
  en: {
    nav: { home: 'Home', categories: 'Categories', search: 'Search', alerts: 'Alerts', settings: 'Settings' },
    home: { greeting: 'Hello, {name}', expiring: '{count} {item} expiring this week', product: 'product', products: 'products', allPantry: 'All pantry', upcoming: 'Expiring soon', seeUpcoming: 'See upcoming', seeAll: 'See all ({count})', empty: 'Your pantry is empty. Add your first product with the + button', fresh: 'Nothing expiring this week. Everything is fresh!', order: 'Sort products', expiry: 'By expiry', name: 'By name', expired: 'Expired', urgent: 'Expiring soon', week: 'This week', later: 'Later', add: 'Add product' },
    search: { placeholder: 'Search product...', cancel: 'Cancel', all: 'All', result: 'result', results: 'results', type: 'Type a product name to search.', none: 'No products found.', recent: 'Recent searches', clear: 'Clear', remove: 'Remove search {term}', clearInput: 'Clear' },
    categories: { title: 'Categories', product: 'product', products: 'products', empty: 'No products in this category.', back: 'Back' },
    detail: { title: 'Details', missing: 'This product no longer exists.', purchase: 'Purchase date', expiryDate: 'Expiry date', remaining: 'Days remaining', quantity: 'Quantity', location: 'Location', notes: 'Notes', fresh: 'This product is fresh', edit: 'Edit', delete: 'Delete', consumed: 'Mark as consumed', added: 'Product added successfully', consumeTitle: 'Mark as consumed?', consumeMessage: '"{name}" will be removed from your pantry.', deleteTitle: 'Delete product?', deleteMessage: '"{name}" will be removed from your pantry. This action cannot be undone.' },
    add: { addTitle: 'Add product', editTitle: 'Edit product', photo: 'Add product photo', removePhoto: 'Remove photo', name: 'Product name', namePlaceholder: 'E.g. Whole milk 1L', category: 'Category', chooseCategory: 'Select a category...', purchase: 'Purchase date', expiry: 'Expiry date', quantity: 'Quantity', quantityPlaceholder: 'E.g. 1 liter / 500 g', location: 'Location (optional)', locationPlaceholder: 'E.g. Fridge · Shelf 2', notes: 'Optional notes', notesPlaceholder: 'E.g. open before the weekend', save: 'Save product', saveChanges: 'Save changes', cancel: 'Cancel', requiredName: 'Enter the product name', requiredCategory: 'Select a category', requiredPurchase: 'Enter the purchase date', requiredExpiry: 'Enter the expiry date', dateOrder: 'Must be after the purchase date' },
    alerts: { title: 'Notifications', today: 'Urgent today', week: 'This week', total: 'Total active', critical: 'Critical', urgent: 'Urgent', medium: 'Medium', low: 'Low', none: 'No active alerts. Your pantry is under control.' },
    settings: { title: 'Settings', preferences: 'Preferences', push: 'Push notifications', email: 'Email alerts', dark: 'Dark theme', language: 'Language', account: 'Account', profile: 'My profile', privacy: 'Privacy', information: 'Information', about: 'About FreshBox', terms: 'Terms of use', clearPantry: 'Clear pantry', logout: 'Log out', close: 'Close', aboutText: 'FreshBox v1.0.0 — Freshness you will not forget.', privacyText: 'FreshBox does not send your information to any server: products, photos and settings are stored locally in your browser.', termsText: 'Academic project for non-commercial use. Data is stored only on your device.', clearTitle: 'Clear pantry?', clearMessage: '{count} products will be deleted. This action cannot be undone.' },
    profile: { title: 'My profile', changePhoto: 'Change photo', products: 'Products', alerts: 'Alerts', fresh: 'Fresh', personal: 'Personal information', edit: 'Edit', fullName: 'Full name', email: 'Email', phone: 'Phone', member: 'Member since', plan: 'Plan', save: 'Save', cancel: 'Cancel', logout: 'Log out' },
    login: { subtitle: 'Sign in to manage your pantry', registerSubtitle: 'Create your account and start saving', name: 'Name', namePlaceholder: 'Your name', email: 'Email', password: 'Password', forgot: 'Forgot your password?', submit: 'Sign in', register: 'Create account', newAccount: 'Create new account', haveAccount: 'I already have an account', accept: 'By continuing you accept the', emailError: 'Enter a valid email', passwordError: 'At least 4 characters', nameError: 'Enter your name' },
    common: { back: 'Back', day: 'day', days: 'days', expired: 'Expired', yesterday: 'Expired yesterday', today: 'Expires today', tomorrow: 'Expires tomorrow', inDays: 'Expires in {count} days', agoDays: 'Expired {count} days ago', dash: '—' },
    splash: { loading: 'Loading...' },
  },
}

export function createTranslator(language) {
  // Convierte la preferencia visible del usuario en la clave interna del diccionario.
  const locale = language === 'English' ? 'en' : 'es'
  return (path, values = {}) => {
    const value = path.split('.').reduce((current, key) => current?.[key], translations[locale]) ?? path
    return Object.entries(values).reduce((text, [key, replacement]) => text.replaceAll(`{${key}}`, String(replacement)), value)
  }
}

export function translateCategory(id, language) {
  // Las categorías son datos del dominio, por eso se traducen mediante su ID estable.
  const names = {
    lacteos: ['Lácteos', 'Dairy'], verdudas: ['Verduras', 'Vegetables'], verduras: ['Verduras', 'Vegetables'], frutas: ['Frutas', 'Fruits'],
    carnes: ['Carnes', 'Meat'], enlatados: ['Enlatados', 'Canned'], bebidas: ['Bebidas', 'Drinks'], cereales: ['Cereales', 'Cereals'], congelados: ['Congelados', 'Frozen'],
  }
  return names[id]?.[language === 'English' ? 1 : 0] ?? id
}
