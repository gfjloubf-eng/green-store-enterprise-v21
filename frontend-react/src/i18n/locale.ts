/* ============================================================
   GSDS v1.1 — Locale Types & Default Translations
   Green Store i18n Architecture
   ============================================================
   Arabic is the default (RTL).
   English is fully synchronized.
   
   Namespaces organized as:
   - common
   - navigation
   - dashboard
   - sidebar
   - breadcrumb
   - home
   - placeholder
   - products
   - dialogs
   - filters
   - tables
   - status
   - messages
   - errors
   ============================================================ */

export type Locale = 'ar' | 'en';

/**
 * Translation dictionary shape.
 * All UI-facing strings should be added here.
 */
export interface Translations {
  /* ── Common ─────────────────────────────────────────────── */
  'common.loading': string;
  'common.error': string;
  'common.noData': string;
  'common.search': string;
  'common.clear': string;
  'common.close': string;
  'common.save': string;
  'common.cancel': string;
  'common.delete': string;
  'common.confirm': string;
  'common.back': string;
  'common.saveChanges': string;
  'common.filter': string;
  'common.reset': string;
  'common.actions': string;
  'common.status': string;
  'common.all': string;
  'common.yes': string;
  'common.no': string;
'common.continue': string;
'common.checkout': string;
'common.apply': string;
'common.addNew': string;
'common.change': string;
'common.select': string;
'common.retry': string;
'checkout.title': string;
'checkout.description': string;
'checkout.deliveryAddress': string;
'checkout.currentAddress': string;
'checkout.changeAddress': string;
'checkout.addAddress': string;
'checkout.deliveryTime': string;
'checkout.asSoonAsPossible': string;
'checkout.scheduleLater': string;
'checkout.paymentMethod': string;
'checkout.cash': string;
'checkout.visa': string;
'checkout.mastercard': string;
'checkout.applePay': string;
'checkout.googlePay': string;
'checkout.orderSummary': string;
'checkout.products': string;
'checkout.subtotal': string;
'checkout.discount': string;
'checkout.deliveryFee': string;
'checkout.vat': string;
'checkout.total': string;
'checkout.coupon': string;
'checkout.couponPlaceholder': string;
'checkout.orderNotes': string;
'checkout.notesPlaceholder': string;
'checkout.completeOrder': string;

/* ── Theme ──────────────────────────────────────────────── */
  'theme.light': string;
  'theme.dark': string;
  'theme.toggle': string;

  /* ── Direction ──────────────────────────────────────────── */
  'direction.ltr': string;
  'direction.rtl': string;
  'direction.toggle': string;

/* ── Navigation ─────────────────────────────────────────── */
  'nav.home': string;
  'nav.workspace': string;
  'nav.components': string;
  'nav.layouts': string;
  'nav.sidebar': string;
  'nav.grid': string;
  'nav.settings': string;
  'nav.help': string;
  'nav.products': string;
  'nav.categories': string;
  'nav.brands': string;
  'nav.units': string;
  'nav.barcode': string;
  'nav.inventory': string;
  'nav.inventoryDashboard': string;
  'nav.stockOverview': string;
  'nav.stockMovements': string;
  'nav.stockAdjustment': string;
  'nav.stockTransfer': string;
  'nav.lowStock': string;
  'nav.outOfStock': string;
  'nav.inventoryReports': string;

  /* ── Sidebar Groups ─────────────────────────────────────── */
  'sidebar.mainMenu': string;
  'sidebar.catalog': string;
  'sidebar.inventory': string;
  'sidebar.uiLibrary': string;
  'sidebar.system': string;

  /* ── Breadcrumb ─────────────────────────────────────────── */
  'breadcrumb.home': string;
  'breadcrumb.workspace': string;
  'breadcrumb.components': string;
  'breadcrumb.layouts': string;
  'breadcrumb.sidebar': string;
  'breadcrumb.grid': string;
  'breadcrumb.settings': string;
  'breadcrumb.help': string;
  'breadcrumb.products': string;
  'breadcrumb.create': string;
  'breadcrumb.edit': string;
  'breadcrumb.categories': string;
  'breadcrumb.brands': string;
  'breadcrumb.units': string;
  'breadcrumb.barcode': string;
  'breadcrumb.details': string;
  'breadcrumb.inventory': string;
  'breadcrumb.inventoryDashboard': string;
  'breadcrumb.stockOverview': string;
  'breadcrumb.stockMovements': string;
  'breadcrumb.stockAdjustment': string;
  'breadcrumb.stockTransfer': string;
  'breadcrumb.lowStock': string;
  'breadcrumb.outOfStock': string;
  'breadcrumb.inventoryReports': string;

  /* ── Home ───────────────────────────────────────────────── */
  'home.title': string;
  'home.description': string;
  'home.card.providers': string;
  'home.card.providersDesc': string;
  'home.card.routing': string;
  'home.card.routingDesc': string;
  'home.card.appShell': string;
  'home.card.appShellDesc': string;

  /* ── Footer ─────────────────────────────────────────────── */
  'footer.copyright': string;
  'footer.engineer': string;
  'footer.phone': string;
  'footer.version': string;
  'footer.close': string;

  /* ── App ────────────────────────────────────────────────── */
  'app.title': string;
  'app.description': string;
  'app.notFound': string;
  'app.notFoundDescription': string;

  /* ── Profile ────────────────────────────────────────────── */
  'profile.title': string;
  'profile.notifications': string;

  /* ── Placeholder Pages ──────────────────────────────────── */
  'placeholder.description': string;
  'placeholder.workspace.title': string;
  'placeholder.components.title': string;
  'placeholder.layouts.title': string;
  'placeholder.sidebar.title': string;
  'placeholder.grid.title': string;
  'placeholder.settings.title': string;
  'placeholder.help.title': string;

  /* ── Dashboard ──────────────────────────────────────────── */
  'dashboard.title': string;
  'dashboard.subtitle': string;

  /* ── Products ───────────────────────────────────────────── */
  'products.title': string;
  'products.add': string;
  'products.edit': string;
  'products.delete': string;
  'products.view': string;
  'products.details': string;
  'products.create': string;
  'products.categories': string;
  'products.brands': string;
  'products.units': string;
  'products.barcode': string;
  'products.management': string;
  'products.form.title': string;
  'products.form.description': string;
  'products.editForm.title': string;
  'products.editForm.description': string;
  'products.editForm.id': string;
  'products.details.title': string;
  'products.details.notFound': string;
  'products.details.description': string;
  'products.details.notFoundDesc': string;
  'products.details.field.barcode': string;
  'products.details.field.sku': string;
  'products.details.field.category': string;
  'products.details.field.brand': string;
  'products.details.field.status': string;
  'products.backToList': string;
  'products.categories.management': string;
  'products.categories.description': string;
  'products.brands.management': string;
  'products.brands.description': string;
  'products.units.management': string;
  'products.units.description': string;
  'products.barcode.management': string;
  'products.barcode.description': string;

  /* ── Product Table ──────────────────────────────────────── */
  'table.image': string;
  'table.barcode': string;
  'table.sku': string;
  'table.name': string;
  'table.category': string;
  'table.brand': string;
  'table.unit': string;
  'table.purchasePrice': string;
  'table.sellingPrice': string;
  'table.stock': string;
  'table.status': string;
  'table.createdAt': string;
  'table.updatedAt': string;
  'table.actions': string;
  'table.noProducts': string;
  'table.rowCount': string;

  /* ── Product Filters ────────────────────────────────────── */
  'filters.search': string;
  'filters.searchPlaceholder': string;
  'filters.allCategories': string;
  'filters.allBrands': string;
  'filters.allStatuses': string;
  'filters.sortBy': string;
  'filters.sortByName': string;
  'filters.sortByBarcode': string;
  'filters.sortBySku': string;
  'filters.sortByPurchasePrice': string;
  'filters.sortBySellingPrice': string;
  'filters.sortByStock': string;
  'filters.sortByCreatedAt': string;
  'filters.sortByUpdatedAt': string;
  'filters.sortAscending': string;
  'filters.sortDescending': string;
  'filters.rowsPerPage': string;
  'filters.clear': string;
  'filters.clearFilters': string;

  /* ── Product Status ─────────────────────────────────────── */
  'status.all': string;
  'status.active': string;
  'status.inactive': string;
  'status.draft': string;
  'status.discontinued': string;

  /* ── Dialogs ────────────────────────────────────────────── */
  'dialog.createTitle': string;
  'dialog.createDescription': string;
  'dialog.editTitle': string;
  'dialog.editDescription': string;
  'dialog.deleteTitle': string;
  'dialog.deleteDescription': string;
  'dialog.cancel': string;
  'dialog.save': string;
  'dialog.saveChanges': string;
  'dialog.confirmDelete': string;
  'dialog.close': string;
  'dialog.futureMilestone': string;

  /* ── Messages ───────────────────────────────────────────── */
  'messages.noProducts.title': string;
  'messages.noProducts.description': string;
  'messages.noProducts.action': string;
  'messages.noMatch.title': string;
  'messages.noMatch.description': string;
  'messages.noMatch.action': string;

  /* ── Form ────────────────────────────────────────────────── */
  'form.generalInfo': string;
  'form.productName': string;
  'form.productNamePlaceholder': string;
  'form.produceKey': string;
  'form.produceKeyPlaceholder': string;
  'form.produceKeyHint': string;
  'form.sku': string;
  'form.skuPlaceholder': string;
  'form.barcode': string;
  'form.barcodePlaceholder': string;
  'form.category': string;
  'form.selectCategory': string;
  'form.brand': string;
  'form.selectBrand': string;
  'form.unit': string;
  'form.selectUnit': string;
  'form.description': string;
  'form.descriptionPlaceholder': string;
  'form.originCountry': string;
  'form.originCountryPlaceholder': string;
  'form.harvestDate': string;
  'form.expiryDate': string;
  'form.storageInstructions': string;
  'form.storageInstructionsPlaceholder': string;
  'form.qualityGrade': string;
  'form.selectQualityGrade': string;
  'form.weightValue': string;
  'form.weightUnit': string;
  'form.packageLength': string;
  'form.packageWidth': string;
  'form.packageHeight': string;
  'form.shippingWeight': string;
  'form.shippingClass': string;
  'form.shippingClassPlaceholder': string;
  'form.category.vegetables': string;
  'form.category.fruits': string;
  'form.category.herbs': string;
  'form.category.dairy': string;
  'form.category.beverages': string;
  'form.brand.greenFarm': string;
  'form.brand.naturesBest': string;
  'form.brand.organicValley': string;
  'form.brand.freshHarvest': string;
  'form.brand.ecoGrow': string;
  'form.unit.kilogram': string;
  'form.unit.box': string;
  'form.unit.bunch': string;
  'form.unit.liter': string;
  'form.unit.pack': string;
  'form.unit.gram': string;
  'form.pricing': string;
  'form.pricingManagedSeparately': string;
  'form.purchasePrice': string;
  'form.purchasePricePlaceholder': string;
  'form.sellingPrice': string;
  'form.sellingPricePlaceholder': string;
  'form.tax': string;
  'form.taxPlaceholder': string;
  'form.discount': string;
  'form.discountPlaceholder': string;
  'form.inventory': string;
  'form.inventoryManagedSeparately': string;
  'form.initialStock': string;
  'form.initialStockPlaceholder': string;
  'form.minStock': string;
  'form.minStockPlaceholder': string;
  'form.maxStock': string;
  'form.maxStockPlaceholder': string;
  'form.trackInventory': string;
  'form.media': string;
  'form.imagePreview': string;
  'form.removeImage': string;
  'form.imageUpload': string;
  'form.imageUploadHint': string;
  'form.imageCompressionHint': string;
  'form.imageSizeLabel': string;
  'form.reset': string;
  'form.cancel': string;
  'form.save': string;
  'form.status': string;
  'form.active': string;
  'form.inactive': string;

  /* ── Form Validation ────────────────────────────────────── */
  'form.validation.required': string;
  'form.validation.minLength': string;
  'form.validation.invalidFormat': string;
  'form.validation.invalidNumber': string;
  'form.validation.integerRequired': string;
  'form.validation.positiveNumber': string;
  'form.validation.minValue': string;
  'form.validation.maxValue': string;
  'form.validation.alphanumeric': string;
  'form.validation.numbersOnly': string;
  'form.validation.minGtMax': string;
  'form.validation.invalidDate': string;
  'form.validation.expiryBeforeHarvest': string;

  /* ── Inventory Status ───────────────────────────────────── */
  'invStatus.in_stock': string;
  'invStatus.low_stock': string;
  'invStatus.out_of_stock': string;
  'invStatus.overstocked': string;

  /* ── Movement Types ─────────────────────────────────────── */
  'movementType.stock_in': string;
  'movementType.stock_out': string;
  'movementType.adjustment': string;
  'movementType.transfer': string;
  'movementType.sale': string;
  'movementType.purchase': string;

  /* ── Movement Status ────────────────────────────────────── */
  'movementStatus.pending': string;
  'movementStatus.completed': string;
  'movementStatus.cancelled': string;

  /* ── Inventory Filters ──────────────────────────────────── */
  'inventoryFilters.search': string;
  'inventoryFilters.searchPlaceholder': string;
  'inventoryFilters.allStatuses': string;
  'inventoryFilters.allLocations': string;
  'inventoryFilters.locations': string;

  /* ── Inventory Table ────────────────────────────────────── */
  'invTable.product': string;
  'invTable.sku': string;
  'invTable.barcode': string;
  'invTable.quantityOnHand': string;
  'invTable.quantityReserved': string;
  'invTable.quantityAvailable': string;
  'invTable.location': string;
  'invTable.status': string;
  'invTable.lastMovementAt': string;
  'invTable.actions': string;
  'invTable.noInventory': string;
  'invTable.rowCount': string;

  /* ── Movement Table Columns ─────────────────────────────── */
  'invMovementCol.product': string;
  'invMovementCol.type': string;
  'invMovementCol.quantity': string;
  'invMovementCol.from': string;
  'invMovementCol.to': string;
  'invMovementCol.reference': string;
  'invMovementCol.status': string;
  'invMovementCol.performedAt': string;

  /* ── Movement Table ─────────────────────────────────────── */
  'invMovementTable.noMovements': string;
  'invMovementTable.movementCount': string;

  /* ── Movement Timeline ──────────────────────────────────── */
  'invTimeline.title': string;
  'invTimeline.noMovements': string;

  /* ── Stock Card ─────────────────────────────────────────── */
  'invCard.onHand': string;
  'invCard.reserved': string;
  'invCard.available': string;

  /* ── Stock Summary ──────────────────────────────────────── */
  'invSummary.totalProducts': string;
  'invSummary.trackedProducts': string;
  'invSummary.totalUnits': string;
  'invSummary.unitsOnHand': string;
  'invSummary.lowStock': string;
  'invSummary.needsAttention': string;
  'invSummary.outOfStock': string;
  'invSummary.urgent': string;
  'invSummary.overstocked': string;
  'invSummary.excessStock': string;

  /* ── Inventory Sort ─────────────────────────────────────── */
  'invSort.quantityOnHand': string;
  'invSort.quantityReserved': string;
  'invSort.quantityAvailable': string;
  'invSort.location': string;
  'invSort.status': string;
  'invSort.lastMovementAt': string;
  'invSort.updatedAt': string;

  /* ── Inventory Pages ────────────────────────────────────── */
  'inventory.dashboard.title': string;
  'inventory.stockOverview.title': string;
  'inventory.stockMovements.title': string;
  'inventory.stockAdjustment.title': string;
  'inventory.stockTransfer.title': string;
  'inventory.lowStock.title': string;
  'inventory.outOfStock.title': string;
  'inventory.inventoryReports.title': string;
  'inventory.stockMovements.management': string;
  'inventory.stockMovements.description': string;
  'inventory.stockAdjustment.management': string;
  'inventory.stockAdjustment.description': string;
  'inventory.stockTransfer.management': string;
  'inventory.stockTransfer.description': string;
  'inventory.inventoryReports.management': string;
  'inventory.inventoryReports.description': string;
  'inventory.empty.title': string;
  'inventory.empty.description': string;
  'inventory.lowStockSection': string;
  'inventory.lowStockEmpty': string;
  'inventory.lowStockEmptyDesc': string;
  'inventory.lowStock.empty': string;
  'inventory.lowStock.emptyDesc': string;
  'inventory.outOfStock.empty': string;
  'inventory.outOfStock.emptyDesc': string;
  'inventory.stockOverview.empty': string;
  'inventory.stockOverview.emptyDesc': string;
  'inventory.noMatch.title': string;
  'inventory.noMatch.description': string;
  'inventory.noMatch.action': string;
  'inventory.filterByType': string;
  'inventory.allTypes': string;
  'inventory.filterByStatus': string;
  'inventory.allStatuses': string;
  'inventory.noMovements.title': string;
  'inventory.noMovements.description': string;
  'inventory.view': string;
  'inventory.thresholds': string;

  /* ── Errors ─────────────────────────────────────────────── */
'errors.generic': string;
  'errors.notFound': string;
  'errors.notFoundDesc': string;

  /* ── Supplier Navigation ────────────────────────────────── */
  'nav.suppliersDashboard': string;
  'nav.suppliersList': string;
  'nav.supplierCategories': string;
  'nav.supplierContacts': string;
  'nav.supplierReports': string;

  /* ── Supplier Sidebar ───────────────────────────────────── */
  'sidebar.suppliers': string;

  /* ── Supplier Breadcrumb ────────────────────────────────── */
  'breadcrumb.suppliers': string;
  'breadcrumb.suppliersList': string;
  'breadcrumb.supplierCategories': string;
  'breadcrumb.supplierContacts': string;
  'breadcrumb.supplierReports': string;
  'breadcrumb.createSupplier': string;
  'breadcrumb.editSupplier': string;
  'breadcrumb.supplierDetails': string;

  /* ── Supplier Pages ─────────────────────────────────────── */
  'suppliers.dashboard.title': string;
  'suppliers.empty.title': string;
  'suppliers.empty.description': string;
  'suppliers.topSuppliers': string;
  'suppliers.topSuppliersEmpty': string;
  'suppliers.topSuppliersEmptyDesc': string;
  'suppliers.recentOrders': string;
  'suppliers.recentOrdersPlaceholder': string;
  'suppliers.list.title': string;
  'suppliers.list.empty': string;
  'suppliers.list.emptyDesc': string;
  'suppliers.list.emptyAction': string;
  'suppliers.add': string;
  'suppliers.view': string;
  'suppliers.edit': string;
  'suppliers.delete': string;
  'suppliers.details.title': string;
  'suppliers.details.code': string;
  'suppliers.details.contactInfo': string;
  'suppliers.details.primaryContact': string;
  'suppliers.details.stats': string;
  'suppliers.details.createdAt': string;
  'suppliers.details.updatedAt': string;
  'suppliers.details.notFound': string;
  'suppliers.details.notFoundDesc': string;
  'suppliers.details.field.email': string;
  'suppliers.details.field.phone': string;
  'suppliers.details.field.city': string;
  'suppliers.details.field.address': string;
  'suppliers.details.field.contactName': string;
  'suppliers.details.field.contactRole': string;
  'suppliers.details.field.products': string;
  'suppliers.details.field.totalPurchases': string;
  'suppliers.details.field.lastOrder': string;
  'suppliers.details.field.website': string;
  'suppliers.backToList': string;
  'suppliers.create.title': string;
  'suppliers.create.management': string;
  'suppliers.create.description': string;
  'suppliers.edit.title': string;
  'suppliers.edit.management': string;
  'suppliers.edit.description': string;
  'suppliers.categories.title': string;
  'suppliers.categories.management': string;
  'suppliers.categories.description': string;
  'suppliers.contacts.title': string;
  'suppliers.contacts.management': string;
  'suppliers.contacts.description': string;
  'suppliers.reports.title': string;
  'suppliers.reports.management': string;
  'suppliers.reports.description': string;
  'suppliers.noMatch.title': string;
  'suppliers.noMatch.description': string;
  'suppliers.noMatch.action': string;

  /* ── Supplier Filters ───────────────────────────────────── */
  'supplierFilters.search': string;
  'supplierFilters.searchPlaceholder': string;
  'supplierFilters.allStatuses': string;
  'supplierFilters.allCategories': string;
  'supplierFilters.allCities': string;
  'supplierFilters.categories': string;
  'supplierFilters.cities': string;

  /* ── Supplier Status ────────────────────────────────────── */
  'supplierStatus.active': string;
  'supplierStatus.inactive': string;
  'supplierStatus.suspended': string;
  'supplierStatus.pending': string;

  /* ── Supplier Card ──────────────────────────────────────── */
  'supplierCard.products': string;
  'supplierCard.purchases': string;

  /* ── Supplier Summary ───────────────────────────────────── */
  'supplierSummary.totalSuppliers': string;
  'supplierSummary.allSuppliers': string;
  'supplierSummary.activeSuppliers': string;
  'supplierSummary.activeHint': string;
  'supplierSummary.pendingSuppliers': string;
  'supplierSummary.pendingHint': string;
  'supplierSummary.totalPurchases': string;
  'supplierSummary.purchasesHint': string;
  'supplierSummary.totalProducts': string;
  'supplierSummary.productsHint': string;
  'supplierSummary.avgRating': string;
  'supplierSummary.ratingHint': string;

  /* ── Supplier Badge ─────────────────────────────────────── */
  'supplierBadge.wholesale': string;
  'supplierBadge.retail': string;
  'supplierBadge.distributor': string;
  'supplierBadge.manufacturer': string;
  'supplierBadge.service': string;

  /* ── Supplier Table ─────────────────────────────────────── */
  'supplierTable.code': string;
  'supplierTable.name': string;
  'supplierTable.category': string;
  'supplierTable.contact': string;
  'supplierTable.email': string;
  'supplierTable.phone': string;
  'supplierTable.city': string;
  'supplierTable.status': string;
  'supplierTable.products': string;
  'supplierTable.productCount': string;
  'supplierTable.totalPurchases': string;
  'supplierTable.lastOrder': string;
  'supplierTable.lastOrderAt': string;
  'supplierTable.actions': string;
  'supplierTable.noSuppliers': string;
  'supplierTable.rowCount': string;

  /* ── Supplier Sort ──────────────────────────────────────── */
  'supplierSort.name': string;
  'supplierSort.code': string;
  'supplierSort.category': string;
  'supplierSort.city': string;
  'supplierSort.status': string;
  'supplierSort.productCount': string;
  'supplierSort.totalPurchases': string;
  'supplierSort.lastOrderAt': string;
  'supplierSort.createdAt': string;
  'supplierSort.updatedAt': string;

  /* ── Purchasing Navigation ──────────────────────────────── */
  'nav.purchasingDashboard': string;
  'nav.purchaseOrders': string;
  'nav.goodsReceiving': string;
  'nav.purchaseReturns': string;
  'nav.purchaseReports': string;
  'nav.purchaseAnalytics': string;

  /* ── Purchasing Sidebar ─────────────────────────────────── */
  'sidebar.purchasing': string;

  /* ── Purchasing Breadcrumb ──────────────────────────────── */
  'breadcrumb.purchasing': string;
  'breadcrumb.purchaseOrders': string;
  'breadcrumb.createPurchaseOrder': string;
  'breadcrumb.purchaseDetails': string;
  'breadcrumb.goodsReceiving': string;
  'breadcrumb.purchaseReturns': string;
  'breadcrumb.purchaseReports': string;
  'breadcrumb.purchaseAnalytics': string;

  /* ── Purchasing Pages ───────────────────────────────────── */
  'purchasing.dashboard.title': string;
  'purchasing.empty.title': string;
  'purchasing.empty.description': string;
  'purchasing.recentOrders': string;
  'purchasing.recentOrdersEmpty': string;
  'purchasing.recentOrdersEmptyDesc': string;
  'purchasing.statusBreakdown': string;
  'purchasing.statusBreakdownEmpty': string;
  'purchasing.orders.title': string;
  'purchasing.orders.empty': string;
  'purchasing.orders.emptyDesc': string;
  'purchasing.orders.emptyAction': string;
  'purchasing.add': string;
  'purchasing.view': string;
  'purchasing.details.title': string;
  'purchasing.details.code': string;
  'purchasing.details.orderedAt': string;
  'purchasing.details.expectedAt': string;
  'purchasing.details.items': string;
  'purchasing.details.lineItems': string;
  'purchasing.details.subtotal': string;
  'purchasing.details.taxTotal': string;
  'purchasing.details.discountTotal': string;
  'purchasing.details.total': string;
  'purchasing.details.notes': string;
  'purchasing.details.notFound': string;
  'purchasing.details.notFoundDesc': string;
  'purchasing.backToList': string;
  'purchasing.create.title': string;
  'purchasing.create.error': string;
  'purchasing.goodsReceiving.title': string;
  'purchasing.goodsReceiving.empty': string;
  'purchasing.goodsReceiving.emptyDesc': string;
  'purchasing.returns.title': string;
  'purchasing.returns.empty': string;
  'purchasing.returns.emptyDesc': string;
  'purchasing.reports.title': string;
  'purchasing.reports.empty': string;
  'purchasing.reports.emptyDesc': string;
  'purchasing.reports.spendBySupplier': string;
  'purchasing.reports.spendBySupplierHint': string;
  'purchasing.reports.orderTrend': string;
  'purchasing.reports.orderTrendHint': string;
  'purchasing.reports.statusBreakdown': string;
  'purchasing.reports.statusBreakdownHint': string;
  'purchasing.analytics.title': string;
  'purchasing.analytics.empty': string;
  'purchasing.analytics.emptyDesc': string;
  'purchasing.analytics.totalSpend': string;
  'purchasing.analytics.statusDistribution': string;
  'purchasing.analytics.activity': string;
  'purchasing.analytics.activityHint': string;
  'purchasing.noMatch.title': string;
  'purchasing.noMatch.description': string;
  'purchasing.noMatch.action': string;

  /* ── Purchase Status ────────────────────────────────────── */
  'purchaseStatus.draft': string;
  'purchaseStatus.pending': string;
  'purchaseStatus.approved': string;
  'purchaseStatus.partially_received': string;
  'purchaseStatus.received': string;
  'purchaseStatus.cancelled': string;

  /* ── Purchase Filters ───────────────────────────────────── */
  'purchaseFilters.search': string;
  'purchaseFilters.searchPlaceholder': string;
  'purchaseFilters.allStatuses': string;
  'purchaseFilters.allSuppliers': string;
  'purchaseFilters.suppliers': string;

  /* ── Purchase Sort ──────────────────────────────────────── */
  'purchaseSort.code': string;
  'purchaseSort.supplier': string;
  'purchaseSort.status': string;
  'purchaseSort.itemCount': string;
  'purchaseSort.totalQuantity': string;
  'purchaseSort.totalCost': string;
  'purchaseSort.expectedAt': string;
  'purchaseSort.orderedAt': string;
  'purchaseSort.createdAt': string;
  'purchaseSort.updatedAt': string;

  /* ── Purchase Table ─────────────────────────────────────── */
  'purchaseTable.code': string;
  'purchaseTable.supplier': string;
  'purchaseTable.status': string;
  'purchaseTable.itemCount': string;
  'purchaseTable.totalQuantity': string;
  'purchaseTable.totalCost': string;
  'purchaseTable.expectedAt': string;
  'purchaseTable.orderedAt': string;
  'purchaseTable.actions': string;
  'purchaseTable.noOrders': string;
  'purchaseTable.rowCount': string;

  /* ── Purchase Card ──────────────────────────────────────── */
  'purchaseCard.items': string;
  'purchaseCard.total': string;
  'purchaseCard.noExpectedDate': string;

  /* ── Purchase Summary ───────────────────────────────────── */
  'purchaseSummary.totalOrders': string;
  'purchaseSummary.allOrders': string;
  'purchaseSummary.pendingOrders': string;
  'purchaseSummary.pendingHint': string;
  'purchaseSummary.approvedOrders': string;
  'purchaseSummary.approvedHint': string;
  'purchaseSummary.receivedOrders': string;
  'purchaseSummary.receivedHint': string;
  'purchaseSummary.totalSpend': string;
  'purchaseSummary.spendHint': string;
  'purchaseSummary.itemsOrdered': string;
  'purchaseSummary.itemsHint': string;

  /* ── Purchase Items Table ───────────────────────────────── */
  'purchaseItemsTable.product': string;
  'purchaseItemsTable.quantity': string;
  'purchaseItemsTable.received': string;
  'purchaseItemsTable.unitCost': string;
  'purchaseItemsTable.tax': string;
  'purchaseItemsTable.lineTotal': string;
  'purchaseItemsTable.noItems': string;

  /* ── Purchase Timeline ──────────────────────────────────── */
  'purchaseTimeline.label': string;
  'purchaseTimeline.cancelled': string;

  /* ── Purchase Order Form ────────────────────────────────── */
  'purchaseOrderForm.supplier': string;
  'purchaseOrderForm.selectSupplier': string;
  'purchaseOrderForm.expectedAt': string;
  'purchaseOrderForm.items': string;
  'purchaseOrderForm.addItem': string;
  'purchaseOrderForm.noItems': string;
  'purchaseOrderForm.product': string;
  'purchaseOrderForm.quantity': string;
  'purchaseOrderForm.unitCost': string;
  'purchaseOrderForm.taxRate': string;
  'purchaseOrderForm.removeItem': string;
  'purchaseOrderForm.notes': string;
  'purchaseOrderForm.notesPlaceholder': string;
  'purchaseOrderForm.save': string;
}

/**
 * Arabic translations (default).
 */
const ar: Translations = {
  /* ── Common ─────────────────────────────────────────────── */
  'common.loading': 'جارٍ التحميل...',
  'common.error': 'حدث خطأ',
  'common.noData': 'لا توجد بيانات',
  'common.search': 'بحث...',
  'common.clear': 'مسح',
  'common.close': 'إغلاق',
  'common.save': 'حفظ',
  'common.cancel': 'إلغاء',
  'common.delete': 'حذف',
  'common.confirm': 'تأكيد',
  'common.back': 'رجوع',
  'common.saveChanges': 'حفظ التغييرات',
  'common.filter': 'تصفية',
  'common.reset': 'إعادة تعيين',
  'common.actions': 'الإجراءات',
  'common.status': 'الحالة',
  'common.all': 'الكل',
  'common.yes': 'نعم',
  'common.no': 'لا',
 'common.continue': 'متابعة',
 'common.checkout': 'الدفع',
 'common.apply': 'تطبيق',
 'common.addNew': 'إضافة جديد',
 'common.change': 'تغيير',
 'common.select': 'اختر',
 'common.retry': 'إعادة المحاولة',
 'checkout.title': 'إتمام الطلب',
 'checkout.description': 'تفاصيل الشحن والدفع الخاصة بطلبك. تحقق من العنوان، وقت التوصيل، وطريقة الدفع قبل الإنشاء.',
 'checkout.deliveryAddress': 'عنوان التوصيل',
 'checkout.currentAddress': 'العنوان الحالي',
 'checkout.changeAddress': 'تغيير العنوان',
 'checkout.addAddress': 'إضافة عنوان جديد',
 'checkout.deliveryTime': 'وقت التوصيل',
 'checkout.asSoonAsPossible': 'في أقرب وقت',
 'checkout.scheduleLater': 'تحديد موعد لاحق',
 'checkout.paymentMethod': 'طريقة الدفع',
 'checkout.cash': 'نقدًا عند التوصيل',
 'checkout.visa': 'فيزا',
 'checkout.mastercard': 'ماستر كارد',
 'checkout.applePay': 'Apple Pay',
 'checkout.googlePay': 'Google Pay',
 'checkout.orderSummary': 'ملخص الطلب',
 'checkout.products': 'المنتجات',
 'checkout.subtotal': 'المجموع الفرعي',
 'checkout.discount': 'الخصم',
 'checkout.deliveryFee': 'رسوم التوصيل',
 'checkout.vat': 'ضريبة القيمة المضافة',
 'checkout.total': 'الإجمالي',
 'checkout.coupon': 'قسيمة الخصم',
 'checkout.couponPlaceholder': 'أدخل رمز القسيمة',
 'checkout.orderNotes': 'ملاحظات الطلب',
 'checkout.notesPlaceholder': 'أضف ملاحظات إضافية (اختياري)',
 'checkout.completeOrder': 'إتمام الطلب',

  /* ── Theme ──────────────────────────────────────────────── */
  'theme.light': 'فاتح',
  'theme.dark': 'داكن',
  'theme.toggle': 'تبديل السمة',

  /* ── Direction ──────────────────────────────────────────── */
  'direction.ltr': 'يسار إلى يمين',
  'direction.rtl': 'يمين إلى يسار',
  'direction.toggle': 'تبديل الاتجاه',

  /* ── Navigation ─────────────────────────────────────────── */
  'nav.home': 'الرئيسية',
  'nav.workspace': 'مساحة العمل',
  'nav.components': 'المكونات',
  'nav.layouts': 'التخطيطات',
  'nav.sidebar': 'الشريط الجانبي',
  'nav.grid': 'الشبكة',
  'nav.settings': 'الإعدادات',
  'nav.help': 'المساعدة والدعم',
'nav.products': 'المنتجات',
  'nav.categories': 'التصنيفات',
  'nav.brands': 'العلامات التجارية',
  'nav.units': 'الوحدات',
  'nav.barcode': 'الباركود',
  'nav.inventory': 'المخزون',
  'nav.inventoryDashboard': 'لوحة المخزون',
  'nav.stockOverview': 'نظرة عامة',
  'nav.stockMovements': 'حركات المخزون',
  'nav.stockAdjustment': 'تسوية المخزون',
  'nav.stockTransfer': 'تحويل المخزون',
  'nav.lowStock': 'مخزون منخفض',
  'nav.outOfStock': 'نفد المخزون',
  'nav.inventoryReports': 'تقارير المخزون',

  /* ── Sidebar Groups ─────────────────────────────────────── */
  'sidebar.mainMenu': 'القائمة الرئيسية',
  'sidebar.catalog': 'الكتالوج',
  'sidebar.inventory': 'المخزون',
  'sidebar.uiLibrary': 'مكتبة الواجهات',
  'sidebar.system': 'النظام',

  /* ── Breadcrumb ─────────────────────────────────────────── */
  'breadcrumb.home': 'الرئيسية',
  'breadcrumb.workspace': 'مساحة العمل',
  'breadcrumb.components': 'المكونات',
  'breadcrumb.layouts': 'التخطيطات',
  'breadcrumb.sidebar': 'الشريط الجانبي',
  'breadcrumb.grid': 'الشبكة',
  'breadcrumb.settings': 'الإعدادات',
  'breadcrumb.help': 'المساعدة والدعم',
  'breadcrumb.products': 'المنتجات',
  'breadcrumb.create': 'إضافة منتج',
  'breadcrumb.edit': 'تعديل المنتج',
  'breadcrumb.categories': 'التصنيفات',
  'breadcrumb.brands': 'العلامات التجارية',
  'breadcrumb.units': 'الوحدات',
  'breadcrumb.barcode': 'الباركود',
'breadcrumb.details': 'تفاصيل المنتج',
  'breadcrumb.inventory': 'المخزون',
  'breadcrumb.inventoryDashboard': 'لوحة المخزون',
  'breadcrumb.stockOverview': 'نظرة عامة على المخزون',
  'breadcrumb.stockMovements': 'حركات المخزون',
  'breadcrumb.stockAdjustment': 'تسوية المخزون',
  'breadcrumb.stockTransfer': 'تحويل المخزون',
  'breadcrumb.lowStock': 'المخزون المنخفض',
  'breadcrumb.outOfStock': 'نفد المخزون',
  'breadcrumb.inventoryReports': 'تقارير المخزون',

  /* ── Home ───────────────────────────────────────────────── */
  'home.title': 'قطوف الطبيعة',
  'home.description': 'الطبيعة أقرب إليك',
  'home.card.providers': 'مزودي الخدمة',
  'home.card.providersDesc': 'مزودي السياق للسمات والاتجاه والمصادقة',
  'home.card.routing': 'التوجيه',
  'home.card.routingDesc': 'React Router v7 مع تخطيطات متداخلة',
  'home.card.appShell': 'شل التطبيق',
  'home.card.appShellDesc': 'الشريط الجانبي، الشريط العلوي، التذييل ومنفذ المحتوى',

  /* ── Footer ─────────────────────────────────────────────── */
  'footer.copyright': '© {year} قطوف الطبيعة. جميع الحقوق محفوظة.',
  'footer.engineer': 'مهندس: عمار المصوعي',
  'footer.phone': 'هاتف: 712275038',
  'footer.version': 'قطوف الطبيعة v1.0.0',
  'footer.close': 'إغلاق',

  /* ── App ────────────────────────────────────────────────── */
  'app.title': 'قطوف الطبيعة',
  'app.description': 'الطبيعة أقرب إليك',
  'app.notFound': '404 — الصفحة غير موجودة',
  'app.notFoundDescription': 'هذه الصفحة غير متوفرة حاليًا.',

  /* ── Profile ────────────────────────────────────────────── */
  'profile.title': 'الملف الشخصي',
  'profile.notifications': 'الإشعارات',

  /* ── Placeholder Pages ──────────────────────────────────── */
  'placeholder.description': 'هذه الصفحة هي عنصر نائب لأساس واجهة المستخدم.',
  'placeholder.workspace.title': 'مساحة العمل',
  'placeholder.components.title': 'المكونات',
  'placeholder.layouts.title': 'التخطيطات',
  'placeholder.sidebar.title': 'تخطيط الشريط الجانبي',
  'placeholder.grid.title': 'تخطيط الشبكة',
  'placeholder.settings.title': 'الإعدادات',
  'placeholder.help.title': 'المساعدة والدعم',

  /* ── Dashboard ──────────────────────────────────────────── */
  'dashboard.title': 'لوحة التحكم',
  'dashboard.subtitle': 'نظرة عامة على النظام',

  /* ── Products ───────────────────────────────────────────── */
  'products.title': 'المنتجات',
  'products.add': 'إضافة منتج',
  'products.edit': 'تعديل',
  'products.delete': 'حذف',
  'products.view': 'عرض',
  'products.details': 'تفاصيل المنتج',
  'products.create': 'إنشاء منتج',
  'products.categories': 'التصنيفات',
  'products.brands': 'العلامات التجارية',
  'products.units': 'الوحدات',
  'products.barcode': 'الباركود',
  'products.management': 'إدارة المنتجات',
  'products.form.title': 'نموذج إنشاء منتج',
  'products.form.description': 'سيتم تنفيذ نموذج إنشاء المنتج في مرحلة لاحقة. هذه الصفحة عنصر نائب لأساس وحدة المنتجات.',
  'products.editForm.title': 'تعديل المنتج — {id}',
  'products.editForm.description': 'سيتم تنفيذ نموذج تعديل المنتج للمعرف {id} في مرحلة لاحقة.',
  'products.editForm.id': 'معرف المنتج',
  'products.details.title': 'تفاصيل المنتج',
  'products.details.notFound': 'المنتج غير موجود',
  'products.details.description': 'عرض تفصيلي للمنتج {id} سيتم تنفيذه في مرحلة لاحقة.',
  'products.details.notFoundDesc': 'المنتج بالمعرف "{id}" غير موجود.',
  'products.details.field.barcode': 'الباركود:',
  'products.details.field.sku': 'رمز التخزين:',
  'products.details.field.category': 'التصنيف:',
  'products.details.field.brand': 'العلامة التجارية:',
  'products.details.field.status': 'الحالة:',
  'products.backToList': 'العودة إلى المنتجات',
  'products.categories.management': 'إدارة التصنيفات',
  'products.categories.description': 'سيتم تنفيذ واجهة إدارة التصنيفات في مرحلة لاحقة. هذه الصفحة عنصر نائب لأساس وحدة المنتجات.',
  'products.brands.management': 'إدارة العلامات التجارية',
  'products.brands.description': 'سيتم تنفيذ واجهة إدارة العلامات التجارية في مرحلة لاحقة. هذه الصفحة عنصر نائب لأساس وحدة المنتجات.',
  'products.units.management': 'إدارة الوحدات',
  'products.units.description': 'سيتم تنفيذ واجهة إدارة وحدات القياس في مرحلة لاحقة. هذه الصفحة عنصر نائب لأساس وحدة المنتجات.',
  'products.barcode.management': 'إدارة الباركود',
  'products.barcode.description': 'سيتم تنفيذ واجهة إنشاء الباركود وطباعة الملصقات في مرحلة لاحقة. هذه الصفحة عنصر نائب لأساس وحدة المنتجات.',

  /* ── Product Table ──────────────────────────────────────── */
  'table.image': 'الصورة',
  'table.barcode': 'الباركود',
  'table.sku': 'رمز التخزين',
  'table.name': 'اسم المنتج',
  'table.category': 'التصنيف',
  'table.brand': 'العلامة التجارية',
  'table.unit': 'الوحدة',
  'table.purchasePrice': 'سعر الشراء',
  'table.sellingPrice': 'سعر البيع',
  'table.stock': 'المخزون',
  'table.status': 'الحالة',
  'table.createdAt': 'تاريخ الإنشاء',
  'table.updatedAt': 'تاريخ التحديث',
  'table.actions': 'الإجراءات',
  'table.noProducts': 'لا توجد منتجات',
  'table.rowCount': '{count} منتج|{count} منتجات',

  /* ── Product Filters ────────────────────────────────────── */
  'filters.search': 'بحث عن منتجات...',
  'filters.searchPlaceholder': 'بحث عن منتجات...',
  'filters.allCategories': 'جميع التصنيفات',
  'filters.allBrands': 'جميع العلامات التجارية',
  'filters.allStatuses': 'جميع الحالات',
  'filters.sortBy': 'ترتيب حسب',
  'filters.sortByName': 'الاسم',
  'filters.sortByBarcode': 'الباركود',
  'filters.sortBySku': 'رمز التخزين',
  'filters.sortByPurchasePrice': 'سعر الشراء',
  'filters.sortBySellingPrice': 'سعر البيع',
  'filters.sortByStock': 'المخزون',
  'filters.sortByCreatedAt': 'تاريخ الإنشاء',
  'filters.sortByUpdatedAt': 'تاريخ التحديث',
  'filters.sortAscending': 'تصاعدي',
  'filters.sortDescending': 'تنازلي',
  'filters.rowsPerPage': '/ الصفحة',
  'filters.clear': 'مسح',
  'filters.clearFilters': 'مسح التصفية',

  /* ── Product Status ─────────────────────────────────────── */
  'status.all': 'الكل',
  'status.active': 'نشط',
  'status.inactive': 'غير نشط',
  'status.draft': 'مسودة',
  'status.discontinued': 'متوقف',

  /* ── Dialogs ────────────────────────────────────────────── */
  'dialog.createTitle': 'إنشاء منتج',
  'dialog.createDescription': 'إضافة منتج جديد إلى الكتالوج',
  'dialog.editTitle': 'تعديل المنتج',
  'dialog.editDescription': 'تعديل تفاصيل المنتج',
  'dialog.deleteTitle': 'حذف المنتج',
  'dialog.deleteDescription': 'هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.',
  'dialog.cancel': 'إلغاء',
  'dialog.save': 'حفظ',
  'dialog.saveChanges': 'حفظ التغييرات',
  'dialog.confirmDelete': 'حذف',
  'dialog.close': 'إغلاق',
  'dialog.futureMilestone': 'سيتم تنفيذ نموذج المنتج في مرحلة لاحقة.',

  /* ── Messages ───────────────────────────────────────────── */
  'messages.noProducts.title': 'لا توجد منتجات بعد',
  'messages.noProducts.description': 'ابدأ بإضافة منتجك الأول إلى الكتالوج.',
  'messages.noProducts.action': 'إضافة منتج',
  'messages.noMatch.title': 'لا توجد منتجات مطابقة',
  'messages.noMatch.description': 'حاول تعديل عوامل التصفية أو استعلام البحث.',
  'messages.noMatch.action': 'مسح التصفية',

/* ── Errors ─────────────────────────────────────────────── */
  'errors.generic': 'حدث خطأ غير متوقع',
  'errors.notFound': '404 — الصفحة غير موجودة',
  'errors.notFoundDesc': 'هذه الصفحة غير متوفرة حاليًا.',

  /* ── Form ────────────────────────────────────────────────── */
  'form.generalInfo': 'معلومات عامة',
  'form.productName': 'اسم المنتج',
  'form.productNamePlaceholder': 'أدخل اسم المنتج',
  'form.produceKey': 'هوية الصنف الثابتة',
  'form.produceKeyPlaceholder': 'مثال: carrot أو apple',
  'form.produceKeyHint': 'استخدم مفتاحاً إنجليزياً ثابتاً حتى لا تختلط الصورة والوصف بين الأصناف.',
  'form.sku': 'رمز التخزين (SKU)',
  'form.skuPlaceholder': 'أدخل رمز التخزين',
  'form.barcode': 'الباركود',
  'form.barcodePlaceholder': 'أدخل الباركود',
  'form.category': 'التصنيف',
  'form.selectCategory': 'اختر تصنيفًا',
  'form.brand': 'العلامة التجارية',
  'form.selectBrand': 'اختر علامة تجارية',
  'form.unit': 'الوحدة',
  'form.selectUnit': 'اختر وحدة',
  'form.description': 'الوصف',
  'form.descriptionPlaceholder': 'أدخل وصف المنتج',
  'form.originCountry': 'بلد المنشأ',
  'form.originCountryPlaceholder': 'مثال: اليمن — صنعاء',
  'form.harvestDate': 'تاريخ الحصاد أو الإنتاج',
  'form.expiryDate': 'تاريخ الانتهاء',
  'form.storageInstructions': 'تعليمات التخزين',
  'form.storageInstructionsPlaceholder': 'مثال: يحفظ مبردًا بين 2 و8 درجات',
  'form.qualityGrade': 'درجة الجودة',
  'form.selectQualityGrade': 'اختر درجة الجودة',
  'form.weightValue': 'وزن المنتج',
  'form.weightUnit': 'وحدة الوزن',
  'form.packageLength': 'طول العبوة (سم)',
  'form.packageWidth': 'عرض العبوة (سم)',
  'form.packageHeight': 'ارتفاع العبوة (سم)',
  'form.shippingWeight': 'وزن الشحن',
  'form.shippingClass': 'فئة الشحن',
  'form.shippingClassPlaceholder': 'مثال: مبرد أو عادي',
  'form.category.vegetables': 'خضروات',
  'form.category.fruits': 'فواكه',
  'form.category.herbs': 'أعشاب',
  'form.category.dairy': 'ألبان',
  'form.category.beverages': 'مشروبات',
  'form.brand.greenFarm': 'المزرعة الخضراء',
  'form.brand.naturesBest': 'أفضل الطبيعة',
  'form.brand.organicValley': 'الوادي العضوي',
  'form.brand.freshHarvest': 'الحصاد الطازج',
  'form.brand.ecoGrow': 'إيكو جرو',
  'form.unit.kilogram': 'كيلوغرام',
  'form.unit.box': 'صندوق',
  'form.unit.bunch': 'حزمة',
  'form.unit.liter': 'لتر',
  'form.unit.pack': 'علبة',
  'form.unit.gram': 'غرام',
  'form.pricing': 'التسعير',
  'form.pricingManagedSeparately': 'تنبيه: هذه الحقول للعرض والتحضير فقط حالياً. يُحفظ سعر البيع الفعلي من متغير المنتج/مسار التسعير بعد إنشاء الصنف.',
  'form.purchasePrice': 'سعر الشراء',
  'form.purchasePricePlaceholder': 'أدخل سعر الشراء',
  'form.sellingPrice': 'سعر البيع',
  'form.sellingPricePlaceholder': 'أدخل سعر البيع',
  'form.tax': 'الضريبة (%)',
  'form.taxPlaceholder': 'أدخل نسبة الضريبة',
  'form.discount': 'الخصم',
  'form.discountPlaceholder': 'أدخل قيمة الخصم',
  'form.inventory': 'المخزون',
  'form.inventoryManagedSeparately': 'تنبيه: الكمية والحدود التشغيلية تُدار من لوحة المخزون بعد إنشاء المنتج، لضمان تسجيل حركة المخزون وتدقيقها.',
  'form.initialStock': 'المخزون الأولي',
  'form.initialStockPlaceholder': 'أدخل المخزون الأولي',
  'form.minStock': 'الحد الأدنى للمخزون',
  'form.minStockPlaceholder': 'أدخل الحد الأدنى',
  'form.maxStock': 'الحد الأقصى للمخزون',
  'form.maxStockPlaceholder': 'أدخل الحد الأقصى',
  'form.trackInventory': 'تتبع المخزون',
  'form.media': 'الوسائط',
  'form.imagePreview': 'معاينة الصورة',
  'form.removeImage': 'إزالة الصورة',
  'form.imageUpload': 'انقر لرفع صورة أو اسحب وأفلت',
  'form.imageUploadHint': 'JPEG أو PNG أو WebP — ستُضغط الصورة تلقائياً قبل الحفظ.',
  'form.imageCompressionHint': 'الصورة ستُصغّر إلى 1200 بكسل كحد أقصى وتُحفظ بجودة مناسبة للأداء.',
  'form.imageSizeLabel': 'الحجم بعد الضغط',
  'form.reset': 'إعادة تعيين',
  'form.cancel': 'إلغاء',
  'form.save': 'حفظ',
  'form.status': 'الحالة',
  'form.active': 'نشط',
  'form.inactive': 'غير نشط',

/* ── Form Validation ────────────────────────────────────── */
  'form.validation.required': 'هذا الحقل مطلوب',
  'form.validation.minLength': 'القيمة قصيرة جدًا',
  'form.validation.invalidFormat': 'تنسيق غير صالح',
  'form.validation.invalidNumber': 'يرجى إدخال رقم صحيح',
  'form.validation.integerRequired': 'يرجى إدخال عدد صحيح',
  'form.validation.positiveNumber': 'يرجى إدخال رقم موجب',
  'form.validation.minValue': 'القيمة أقل من الحد الأدنى',
  'form.validation.maxValue': 'القيمة أكبر من الحد الأقصى',
  'form.validation.alphanumeric': 'يرجى إدخال أحرف وأرقام فقط',
  'form.validation.numbersOnly': 'يرجى إدخال أرقام فقط',
  'form.validation.minGtMax': 'يجب أن يكون الحد الأدنى أقل من الحد الأقصى',
  'form.validation.invalidDate': 'يرجى إدخال تاريخ صحيح',
  'form.validation.expiryBeforeHarvest': 'تاريخ الانتهاء لا يمكن أن يسبق تاريخ الحصاد',

  /* ── Inventory Status ───────────────────────────────────── */
  'invStatus.in_stock': 'متوفر',
  'invStatus.low_stock': 'مخزون منخفض',
  'invStatus.out_of_stock': 'نفد المخزون',
  'invStatus.overstocked': 'مخزون زائد',

  /* ── Movement Types ─────────────────────────────────────── */
  'movementType.stock_in': 'إضافة مخزون',
  'movementType.stock_out': 'سحب مخزون',
  'movementType.adjustment': 'تسوية',
  'movementType.transfer': 'تحويل',
  'movementType.sale': 'بيع',
  'movementType.purchase': 'شراء',

  /* ── Movement Status ────────────────────────────────────── */
  'movementStatus.pending': 'قيد الانتظار',
  'movementStatus.completed': 'مكتمل',
  'movementStatus.cancelled': 'ملغي',

  /* ── Inventory Filters ──────────────────────────────────── */
  'inventoryFilters.search': 'بحث في المخزون...',
  'inventoryFilters.searchPlaceholder': 'بحث في المخزون...',
  'inventoryFilters.allStatuses': 'جميع الحالات',
  'inventoryFilters.allLocations': 'جميع المواقع',
  'inventoryFilters.locations': 'موقع',

  /* ── Inventory Table ────────────────────────────────────── */
  'invTable.product': 'المنتج',
  'invTable.sku': 'رمز التخزين',
  'invTable.barcode': 'الباركود',
  'invTable.quantityOnHand': 'المخزون الفعلي',
  'invTable.quantityReserved': 'محجوز',
  'invTable.quantityAvailable': 'متاح',
  'invTable.location': 'الموقع',
  'invTable.status': 'الحالة',
  'invTable.lastMovementAt': 'آخر حركة',
  'invTable.actions': 'الإجراءات',
  'invTable.noInventory': 'لا توجد سجلات مخزون',
  'invTable.rowCount': '{count} سجل|{count} سجلات',

  /* ── Movement Table Columns ─────────────────────────────── */
  'invMovementCol.product': 'المنتج',
  'invMovementCol.type': 'النوع',
  'invMovementCol.quantity': 'الكمية',
  'invMovementCol.from': 'من',
  'invMovementCol.to': 'إلى',
  'invMovementCol.reference': 'المرجع',
  'invMovementCol.status': 'الحالة',
  'invMovementCol.performedAt': 'تاريخ التنفيذ',

  /* ── Movement Table ─────────────────────────────────────── */
  'invMovementTable.noMovements': 'لا توجد حركات مخزون',
  'invMovementTable.movementCount': '{count} حركة|{count} حركات',

  /* ── Movement Timeline ──────────────────────────────────── */
  'invTimeline.title': 'آخر الحركات',
  'invTimeline.noMovements': 'لا توجد حركات حديثة',

  /* ── Stock Card ─────────────────────────────────────────── */
  'invCard.onHand': 'المخزون الفعلي',
  'invCard.reserved': 'محجوز',
  'invCard.available': 'متاح',

  /* ── Stock Summary ──────────────────────────────────────── */
  'invSummary.totalProducts': 'إجمالي المنتجات',
  'invSummary.trackedProducts': 'منتج تحت التتبع',
  'invSummary.totalUnits': 'إجمالي الوحدات',
  'invSummary.unitsOnHand': 'وحدة في المخزون',
  'invSummary.lowStock': 'مخزون منخفض',
  'invSummary.needsAttention': 'يحتاج إلى متابعة',
  'invSummary.outOfStock': 'نفد المخزون',
  'invSummary.urgent': 'عاجل',
  'invSummary.overstocked': 'مخزون زائد',
  'invSummary.excessStock': 'يتجاوز الحد الأقصى',

  /* ── Inventory Sort ─────────────────────────────────────── */
  'invSort.quantityOnHand': 'المخزون الفعلي',
  'invSort.quantityReserved': 'محجوز',
  'invSort.quantityAvailable': 'متاح',
  'invSort.location': 'الموقع',
  'invSort.status': 'الحالة',
  'invSort.lastMovementAt': 'آخر حركة',
  'invSort.updatedAt': 'تاريخ التحديث',

  /* ── Inventory Pages ────────────────────────────────────── */
  'inventory.dashboard.title': 'لوحة المخزون',
  'inventory.stockOverview.title': 'نظرة عامة على المخزون',
  'inventory.stockMovements.title': 'حركات المخزون',
  'inventory.stockAdjustment.title': 'تسوية المخزون',
  'inventory.stockTransfer.title': 'تحويل المخزون',
  'inventory.lowStock.title': 'المخزون المنخفض',
  'inventory.outOfStock.title': 'نفد المخزون',
  'inventory.inventoryReports.title': 'تقارير المخزون',
  'inventory.stockMovements.management': 'إدارة حركات المخزون',
  'inventory.stockMovements.description': 'عرض وإدارة جميع حركات المخزون. سيتم تنفيذ التفاصيل في مرحلة لاحقة.',
  'inventory.stockAdjustment.management': 'إدارة تسوية المخزون',
  'inventory.stockAdjustment.description': 'تسوية فروقات المخزون. سيتم تنفيذ النموذج في مرحلة لاحقة.',
  'inventory.stockTransfer.management': 'إدارة تحويل المخزون',
  'inventory.stockTransfer.description': 'تحويل المخزون بين المواقع. سيتم تنفيذ النموذج في مرحلة لاحقة.',
  'inventory.inventoryReports.management': 'تقارير المخزون',
  'inventory.inventoryReports.description': 'عرض تقارير وتحليلات المخزون. سيتم تنفيذها في مرحلة لاحقة.',
  'inventory.empty.title': 'لا توجد بيانات مخزون',
  'inventory.empty.description': 'ابدأ بإضافة منتجات لتتبع المخزون.',
  'inventory.lowStockSection': 'مخزون منخفض يحتاج إلى متابعة',
  'inventory.lowStockEmpty': 'لا توجد عناصر منخفضة المخزون',
  'inventory.lowStockEmptyDesc': 'جميع المنتجات في مستويات مخزون صحية.',
  'inventory.lowStock.empty': 'لا توجد عناصر منخفضة المخزون',
  'inventory.lowStock.emptyDesc': 'جميع المنتجات ضمن الحدود الطبيعية.',
  'inventory.outOfStock.empty': 'لا توجد عناصر نفد مخزونها',
  'inventory.outOfStock.emptyDesc': 'جميع المنتجات متوفرة في المخزون.',
  'inventory.stockOverview.empty': 'لا توجد سجلات مخزون',
  'inventory.stockOverview.emptyDesc': 'لم يتم العثور على سجلات مخزون مطابقة.',
  'inventory.noMatch.title': 'لا توجد نتائج مطابقة',
  'inventory.noMatch.description': 'حاول تعديل عوامل التصفية أو استعلام البحث.',
  'inventory.noMatch.action': 'مسح التصفية',
  'inventory.filterByType': 'تصفية حسب النوع',
  'inventory.allTypes': 'جميع الأنواع',
  'inventory.filterByStatus': 'تصفية حسب الحالة',
  'inventory.allStatuses': 'جميع الحالات',
  'inventory.noMovements.title': 'لا توجد حركات',
  'inventory.noMovements.description': 'لم يتم العثور على حركات مخزون مطابقة.',
'inventory.view': 'عرض',
  'inventory.thresholds': 'الحدود',

  /* ── Supplier Navigation ────────────────────────────────── */
  'nav.suppliersDashboard': 'لوحة الموردين',
  'nav.suppliersList': 'قائمة الموردين',
  'nav.supplierCategories': 'تصنيفات الموردين',
  'nav.supplierContacts': 'جهات اتصال الموردين',
  'nav.supplierReports': 'تقارير الموردين',

  /* ── Supplier Sidebar ───────────────────────────────────── */
  'sidebar.suppliers': 'الموردين',

  /* ── Supplier Breadcrumb ────────────────────────────────── */
  'breadcrumb.suppliers': 'الموردين',
  'breadcrumb.suppliersList': 'قائمة الموردين',
  'breadcrumb.supplierCategories': 'تصنيفات الموردين',
  'breadcrumb.supplierContacts': 'جهات الاتصال',
  'breadcrumb.supplierReports': 'تقارير الموردين',
  'breadcrumb.createSupplier': 'إضافة مورد',
  'breadcrumb.editSupplier': 'تعديل المورد',
  'breadcrumb.supplierDetails': 'تفاصيل المورد',

  /* ── Supplier Pages ─────────────────────────────────────── */
  'suppliers.dashboard.title': 'لوحة الموردين',
  'suppliers.empty.title': 'لا يوجد موردين بعد',
  'suppliers.empty.description': 'ابدأ بإضافة موردك الأول.',
  'suppliers.topSuppliers': 'أفضل الموردين',
  'suppliers.topSuppliersEmpty': 'لا يوجد موردين',
  'suppliers.topSuppliersEmptyDesc': 'لم يتم العثور على موردين.',
  'suppliers.recentOrders': 'آخر الطلبات',
  'suppliers.recentOrdersPlaceholder': 'سيتم تنفيذ آخر الطلبات في مرحلة لاحقة.',
  'suppliers.list.title': 'قائمة الموردين',
  'suppliers.list.empty': 'لا توجد موردين بعد',
  'suppliers.list.emptyDesc': 'ابدأ بإضافة موردك الأول.',
  'suppliers.list.emptyAction': 'إضافة مورد',
  'suppliers.add': 'إضافة مورد',
  'suppliers.view': 'عرض',
  'suppliers.edit': 'تعديل',
  'suppliers.delete': 'حذف',
  'suppliers.details.title': 'تفاصيل المورد',
  'suppliers.details.code': 'الكود',
  'suppliers.details.contactInfo': 'معلومات الاتصال',
  'suppliers.details.primaryContact': 'جهة الاتصال الأساسية',
  'suppliers.details.stats': 'الإحصائيات',
  'suppliers.details.createdAt': 'تاريخ الإنشاء',
  'suppliers.details.updatedAt': 'آخر تحديث',
  'suppliers.details.notFound': 'المورد غير موجود',
  'suppliers.details.notFoundDesc': 'المورد بالمعرف "{id}" غير موجود.',
  'suppliers.details.field.email': 'البريد الإلكتروني',
  'suppliers.details.field.phone': 'الهاتف',
  'suppliers.details.field.city': 'المدينة',
  'suppliers.details.field.address': 'العنوان',
  'suppliers.details.field.website': 'الموقع الإلكتروني',
  'suppliers.details.field.contactName': 'الاسم',
  'suppliers.details.field.contactRole': 'الدور',
  'suppliers.details.field.products': 'المنتجات',
  'suppliers.details.field.totalPurchases': 'إجمالي المشتريات',
  'suppliers.details.field.lastOrder': 'آخر طلب',
  'suppliers.backToList': 'العودة إلى الموردين',
  'suppliers.create.title': 'إضافة مورد جديد',
  'suppliers.create.management': 'إدارة إضافة المورد',
  'suppliers.create.description': 'سيتم تنفيذ نموذج إضافة المورد في مرحلة لاحقة.',
  'suppliers.edit.title': 'تعديل المورد',
  'suppliers.edit.management': 'إدارة تعديل المورد',
  'suppliers.edit.description': 'سيتم تنفيذ نموذج تعديل المورد في مرحلة لاحقة.',
  'suppliers.categories.title': 'تصنيفات الموردين',
  'suppliers.categories.management': 'إدارة تصنيفات الموردين',
  'suppliers.categories.description': 'سيتم تنفيذ واجهة إدارة تصنيفات الموردين في مرحلة لاحقة.',
  'suppliers.contacts.title': 'جهات اتصال الموردين',
  'suppliers.contacts.management': 'إدارة جهات اتصال الموردين',
  'suppliers.contacts.description': 'سيتم تنفيذ واجهة إدارة جهات الاتصال في مرحلة لاحقة.',
  'suppliers.reports.title': 'تقارير الموردين',
  'suppliers.reports.management': 'تقارير الموردين',
  'suppliers.reports.description': 'سيتم تنفيذ تقارير الموردين في مرحلة لاحقة.',
  'suppliers.noMatch.title': 'لا توجد نتائج مطابقة',
  'suppliers.noMatch.description': 'حاول تعديل عوامل التصفية أو استعلام البحث.',
  'suppliers.noMatch.action': 'مسح التصفية',

  /* ── Supplier Filters ───────────────────────────────────── */
  'supplierFilters.search': 'بحث عن موردين...',
  'supplierFilters.searchPlaceholder': 'بحث عن موردين...',
  'supplierFilters.allStatuses': 'جميع الحالات',
  'supplierFilters.allCategories': 'جميع التصنيفات',
  'supplierFilters.allCities': 'جميع المدن',
  'supplierFilters.categories': 'تصنيف',
  'supplierFilters.cities': 'مدينة',

  /* ── Supplier Status ────────────────────────────────────── */
  'supplierStatus.active': 'نشط',
  'supplierStatus.inactive': 'غير نشط',
  'supplierStatus.suspended': 'موقوف',
  'supplierStatus.pending': 'قيد الانتظار',

  /* ── Supplier Card ──────────────────────────────────────── */
  'supplierCard.products': 'المنتجات',
  'supplierCard.purchases': 'المشتريات',

  /* ── Supplier Summary ───────────────────────────────────── */
  'supplierSummary.totalSuppliers': 'إجمالي الموردين',
  'supplierSummary.allSuppliers': 'جميع الموردين',
  'supplierSummary.activeSuppliers': 'الموردون النشطون',
  'supplierSummary.activeHint': 'موردون نشطون',
  'supplierSummary.pendingSuppliers': 'موردون قيد الانتظار',
  'supplierSummary.pendingHint': 'في انتظار الموافقة',
  'supplierSummary.totalPurchases': 'إجمالي المشتريات',
  'supplierSummary.purchasesHint': 'قيمة إجمالية',
  'supplierSummary.totalProducts': 'إجمالي المنتجات',
  'supplierSummary.productsHint': 'منتج مورد',
  'supplierSummary.avgRating': 'متوسط التقييم',
  'supplierSummary.ratingHint': 'من 1 إلى 5',

  /* ── Supplier Badge ─────────────────────────────────────── */
  'supplierBadge.wholesale': 'جملة',
  'supplierBadge.retail': 'تجزئة',
  'supplierBadge.distributor': 'موزع',
  'supplierBadge.manufacturer': 'مصنع',
  'supplierBadge.service': 'خدمة',

  /* ── Supplier Table ─────────────────────────────────────── */
  'supplierTable.code': 'الكود',
  'supplierTable.name': 'الاسم',
  'supplierTable.category': 'التصنيف',
  'supplierTable.contact': 'جهة الاتصال',
  'supplierTable.email': 'البريد الإلكتروني',
  'supplierTable.phone': 'الهاتف',
  'supplierTable.city': 'المدينة',
  'supplierTable.status': 'الحالة',
  'supplierTable.products': 'المنتجات',
  'supplierTable.productCount': 'عدد المنتجات',
  'supplierTable.totalPurchases': 'إجمالي المشتريات',
  'supplierTable.lastOrder': 'آخر طلب',
  'supplierTable.lastOrderAt': 'آخر طلب',
  'supplierTable.actions': 'الإجراءات',
  'supplierTable.noSuppliers': 'لا توجد موردين',
  'supplierTable.rowCount': '{count} مورد|{count} موردين',

  /* ── Supplier Sort ──────────────────────────────────────── */
  'supplierSort.name': 'الاسم',
  'supplierSort.code': 'الكود',
  'supplierSort.category': 'التصنيف',
  'supplierSort.city': 'المدينة',
  'supplierSort.status': 'الحالة',
  'supplierSort.productCount': 'عدد المنتجات',
  'supplierSort.totalPurchases': 'إجمالي المشتريات',
  'supplierSort.lastOrderAt': 'آخر طلب',
  'supplierSort.createdAt': 'تاريخ الإنشاء',
  'supplierSort.updatedAt': 'تاريخ التحديث',

  /* ── Purchasing Navigation ──────────────────────────────── */
  'nav.purchasingDashboard': 'لوحة المشتريات',
  'nav.purchaseOrders': 'أوامر الشراء',
  'nav.goodsReceiving': 'استلام البضائع',
  'nav.purchaseReturns': 'مرتجعات المشتريات',
  'nav.purchaseReports': 'تقارير المشتريات',
  'nav.purchaseAnalytics': 'تحليلات المشتريات',

  /* ── Purchasing Sidebar ─────────────────────────────────── */
  'sidebar.purchasing': 'المشتريات',

  /* ── Purchasing Breadcrumb ──────────────────────────────── */
  'breadcrumb.purchasing': 'المشتريات',
  'breadcrumb.purchaseOrders': 'أوامر الشراء',
  'breadcrumb.createPurchaseOrder': 'إنشاء أمر شراء',
  'breadcrumb.purchaseDetails': 'تفاصيل أمر الشراء',
  'breadcrumb.goodsReceiving': 'استلام البضائع',
  'breadcrumb.purchaseReturns': 'مرتجعات المشتريات',
  'breadcrumb.purchaseReports': 'تقارير المشتريات',
  'breadcrumb.purchaseAnalytics': 'تحليلات المشتريات',

  /* ── Purchasing Pages ───────────────────────────────────── */
  'purchasing.dashboard.title': 'لوحة المشتريات',
  'purchasing.empty.title': 'لا توجد أوامر شراء بعد',
  'purchasing.empty.description': 'ابدأ بإنشاء أول أمر شراء.',
  'purchasing.recentOrders': 'أحدث أوامر الشراء',
  'purchasing.recentOrdersEmpty': 'لا توجد أوامر',
  'purchasing.recentOrdersEmptyDesc': 'لم يتم العثور على أوامر شراء.',
  'purchasing.statusBreakdown': 'توزيع الحالات',
  'purchasing.statusBreakdownEmpty': 'لا توجد حالات',
  'purchasing.orders.title': 'أوامر الشراء',
  'purchasing.orders.empty': 'لا توجد أوامر شراء بعد',
  'purchasing.orders.emptyDesc': 'ابدأ بإنشاء أول أمر شراء.',
  'purchasing.orders.emptyAction': 'إنشاء أمر شراء',
  'purchasing.add': 'إنشاء أمر شراء',
  'purchasing.view': 'عرض',
  'purchasing.details.title': 'تفاصيل أمر الشراء',
  'purchasing.details.code': 'الكود',
  'purchasing.details.orderedAt': 'تاريخ الطلب',
  'purchasing.details.expectedAt': 'تاريخ التسليم المتوقع',
  'purchasing.details.items': 'الأصناف',
  'purchasing.details.lineItems': 'الأصناف',
  'purchasing.details.subtotal': 'المجموع الفرعي',
  'purchasing.details.taxTotal': 'إجمالي الضريبة',
  'purchasing.details.discountTotal': 'إجمالي الخصم',
  'purchasing.details.total': 'الإجمالي',
  'purchasing.details.notes': 'ملاحظات',
  'purchasing.details.notFound': 'أمر الشراء غير موجود',
  'purchasing.details.notFoundDesc': 'أمر الشراء بالمعرف "{id}" غير موجود.',
  'purchasing.backToList': 'العودة إلى أوامر الشراء',
  'purchasing.create.title': 'إنشاء أمر شراء',
  'purchasing.create.error': 'فشل إنشاء أمر الشراء. حاول مرة أخرى.',
  'purchasing.goodsReceiving.title': 'استلام البضائع',
  'purchasing.goodsReceiving.empty': 'لا توجد أوامر قيد الاستلام',
  'purchasing.goodsReceiving.emptyDesc': 'جميع أوامر الشراء قد تم استلامها.',
  'purchasing.returns.title': 'مرتجعات المشتريات',
  'purchasing.returns.empty': 'لا توجد مرتجعات',
  'purchasing.returns.emptyDesc': 'لم يتم العثور على مرتجعات مشتريات.',
  'purchasing.reports.title': 'تقارير المشتريات',
  'purchasing.reports.empty': 'لا توجد بيانات تقارير',
  'purchasing.reports.emptyDesc': 'لا توجد بيانات كافية لإنشاء التقارير.',
  'purchasing.reports.spendBySupplier': 'الإنفاق حسب المورد',
  'purchasing.reports.spendBySupplierHint': 'إجمالي الإنفاق لكل مورد',
  'purchasing.reports.orderTrend': 'اتجاه الطلبات',
  'purchasing.reports.orderTrendHint': 'عدد الطلبات بمرور الوقت',
  'purchasing.reports.statusBreakdown': 'توزيع حالات الطلبات',
  'purchasing.reports.statusBreakdownHint': 'الطلبات حسب الحالة',
  'purchasing.analytics.title': 'تحليلات المشتريات',
  'purchasing.analytics.empty': 'لا توجد بيانات تحليلية',
  'purchasing.analytics.emptyDesc': 'لا توجد بيانات كافية للتحليلات.',
  'purchasing.analytics.totalSpend': 'إجمالي الإنفاق',
  'purchasing.analytics.statusDistribution': 'توزيع الحالات',
  'purchasing.analytics.activity': 'نشاط الشراء',
  'purchasing.analytics.activityHint': 'الطلبات شهريًا',
  'purchasing.noMatch.title': 'لا توجد نتائج مطابقة',
  'purchasing.noMatch.description': 'حاول تعديل عوامل التصفية أو استعلام البحث.',
  'purchasing.noMatch.action': 'مسح التصفية',

  /* ── Purchase Status ────────────────────────────────────── */
  'purchaseStatus.draft': 'مسودة',
  'purchaseStatus.pending': 'قيد الانتظار',
  'purchaseStatus.approved': 'معتمد',
  'purchaseStatus.partially_received': 'استلام جزئي',
  'purchaseStatus.received': 'مستلم',
  'purchaseStatus.cancelled': 'ملغي',

  /* ── Purchase Filters ───────────────────────────────────── */
  'purchaseFilters.search': 'بحث في أوامر الشراء...',
  'purchaseFilters.searchPlaceholder': 'بحث في أوامر الشراء...',
  'purchaseFilters.allStatuses': 'جميع الحالات',
  'purchaseFilters.allSuppliers': 'جميع الموردين',
  'purchaseFilters.suppliers': 'مورد',

  /* ── Purchase Sort ──────────────────────────────────────── */
  'purchaseSort.code': 'الكود',
  'purchaseSort.supplier': 'المورد',
  'purchaseSort.status': 'الحالة',
  'purchaseSort.itemCount': 'عدد الأصناف',
  'purchaseSort.totalQuantity': 'إجمالي الكمية',
  'purchaseSort.totalCost': 'إجمالي التكلفة',
  'purchaseSort.expectedAt': 'تاريخ التسليم',
  'purchaseSort.orderedAt': 'تاريخ الطلب',
  'purchaseSort.createdAt': 'تاريخ الإنشاء',
  'purchaseSort.updatedAt': 'تاريخ التحديث',

  /* ── Purchase Table ─────────────────────────────────────── */
  'purchaseTable.code': 'الكود',
  'purchaseTable.supplier': 'المورد',
  'purchaseTable.status': 'الحالة',
  'purchaseTable.itemCount': 'الأصناف',
  'purchaseTable.totalQuantity': 'الكمية',
  'purchaseTable.totalCost': 'التكلفة الإجمالية',
  'purchaseTable.expectedAt': 'التسليم المتوقع',
  'purchaseTable.orderedAt': 'تاريخ الطلب',
  'purchaseTable.actions': 'الإجراءات',
  'purchaseTable.noOrders': 'لا توجد أوامر شراء',
  'purchaseTable.rowCount': '{count} أمر|{count} أوامر',

  /* ── Purchase Card ──────────────────────────────────────── */
  'purchaseCard.items': 'الأصناف',
  'purchaseCard.total': 'الإجمالي',
  'purchaseCard.noExpectedDate': 'بدون تاريخ تسليم',

  /* ── Purchase Summary ───────────────────────────────────── */
  'purchaseSummary.totalOrders': 'إجمالي الأوامر',
  'purchaseSummary.allOrders': 'جميع الأوامر',
  'purchaseSummary.pendingOrders': 'أوامر قيد الانتظار',
  'purchaseSummary.pendingHint': 'بانتظار الموافقة',
  'purchaseSummary.approvedOrders': 'أوامر معتمدة',
  'purchaseSummary.approvedHint': 'تمت الموافقة',
  'purchaseSummary.receivedOrders': 'أوامر مستلمة',
  'purchaseSummary.receivedHint': 'تم الاستلام',
  'purchaseSummary.totalSpend': 'إجمالي الإنفاق',
  'purchaseSummary.spendHint': 'قيمة إجمالية',
  'purchaseSummary.itemsOrdered': 'الأصناف المطلوبة',
  'purchaseSummary.itemsHint': 'إجمالي الكمية',

  /* ── Purchase Items Table ───────────────────────────────── */
  'purchaseItemsTable.product': 'المنتج',
  'purchaseItemsTable.quantity': 'الكمية',
  'purchaseItemsTable.received': 'المستلم',
  'purchaseItemsTable.unitCost': 'تكلفة الوحدة',
  'purchaseItemsTable.tax': 'الضريبة',
  'purchaseItemsTable.lineTotal': 'إجمالي السطر',
  'purchaseItemsTable.noItems': 'لا توجد أصناف',

  /* ── Purchase Timeline ──────────────────────────────────── */
  'purchaseTimeline.label': 'المرحلة',
  'purchaseTimeline.cancelled': 'ملغي',

  /* ── Purchase Order Form ────────────────────────────────── */
  'purchaseOrderForm.supplier': 'المورد',
  'purchaseOrderForm.selectSupplier': 'اختر موردًا',
  'purchaseOrderForm.expectedAt': 'تاريخ التسليم المتوقع',
  'purchaseOrderForm.items': 'الأصناف',
  'purchaseOrderForm.addItem': 'إضافة صنف',
  'purchaseOrderForm.noItems': 'لا توجد أصناف',
  'purchaseOrderForm.product': 'المنتج',
  'purchaseOrderForm.quantity': 'الكمية',
  'purchaseOrderForm.unitCost': 'تكلفة الوحدة',
  'purchaseOrderForm.taxRate': 'نسبة الضريبة',
  'purchaseOrderForm.removeItem': 'إزالة الصنف',
  'purchaseOrderForm.notes': 'ملاحظات',
  'purchaseOrderForm.notesPlaceholder': 'أدخل ملاحظات حول الأمر',
  'purchaseOrderForm.save': 'حفظ أمر الشراء',
};

/**
 * English translations (fully synchronized with Arabic).
 */
const en: Translations = {
  /* ── Common ─────────────────────────────────────────────── */
  'common.loading': 'Loading...',
  'common.error': 'An error occurred',
  'common.noData': 'No data available',
  'common.search': 'Search...',
  'common.clear': 'Clear',
  'common.close': 'Close',
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.delete': 'Delete',
  'common.confirm': 'Confirm',
  'common.back': 'Back',
  'common.saveChanges': 'Save Changes',
  'common.filter': 'Filter',
  'common.reset': 'Reset',
  'common.actions': 'Actions',
  'common.status': 'Status',
  'common.all': 'All',
  'common.yes': 'Yes',
  'common.no': 'No',
 'common.continue': 'Continue',
 'common.checkout': 'Checkout',
 'common.apply': 'Apply',
 'common.addNew': 'Add new',
 'common.change': 'Change',
 'common.select': 'Select',
 'common.retry': 'Retry',

 'checkout.title': 'Checkout',
 'checkout.description': 'Review your delivery and payment details before placing your order. This is a visual checkout experience only.',
 'checkout.deliveryAddress': 'Delivery Address',
 'checkout.currentAddress': 'Current Address',
 'checkout.changeAddress': 'Change Address',
 'checkout.addAddress': 'Add New Address',
 'checkout.deliveryTime': 'Delivery Time',
 'checkout.asSoonAsPossible': 'As soon as possible',
 'checkout.scheduleLater': 'Schedule later',
 'checkout.paymentMethod': 'Payment Method',
 'checkout.cash': 'Cash on delivery',
 'checkout.visa': 'Visa',
 'checkout.mastercard': 'MasterCard',
 'checkout.applePay': 'Apple Pay',
 'checkout.googlePay': 'Google Pay',
 'checkout.orderSummary': 'Order Summary',
 'checkout.products': 'Products',
 'checkout.subtotal': 'Subtotal',
 'checkout.discount': 'Discount',
 'checkout.deliveryFee': 'Delivery Fee',
 'checkout.vat': 'VAT',
 'checkout.total': 'Total',
 'checkout.coupon': 'Coupon',
 'checkout.couponPlaceholder': 'Enter coupon code',
 'checkout.orderNotes': 'Order notes',
 'checkout.notesPlaceholder': 'Add optional notes',
 'checkout.completeOrder': 'Complete order',

 /* ── Theme ──────────────────────────────────────────────── */
  'theme.light': 'Light',
  'theme.dark': 'Dark',
  'theme.toggle': 'Toggle theme',

  /* ── Direction ──────────────────────────────────────────── */
  'direction.ltr': 'LTR',
  'direction.rtl': 'RTL',
  'direction.toggle': 'Toggle direction',

  /* ── Navigation ─────────────────────────────────────────── */
  'nav.home': 'Home',
  'nav.workspace': 'Workspace',
  'nav.components': 'Components',
  'nav.layouts': 'Layouts',
  'nav.sidebar': 'Sidebar',
  'nav.grid': 'Grid',
  'nav.settings': 'Settings',
  'nav.help': 'Help & Support',
  'nav.products': 'Products',
  'nav.categories': 'Categories',
  'nav.brands': 'Brands',
  'nav.units': 'Units',
  'nav.barcode': 'Barcode',
  'nav.inventory': 'Inventory',
  'nav.inventoryDashboard': 'Inventory Dashboard',
  'nav.stockOverview': 'Stock Overview',
  'nav.stockMovements': 'Stock Movements',
  'nav.stockAdjustment': 'Stock Adjustment',
  'nav.stockTransfer': 'Stock Transfer',
  'nav.lowStock': 'Low Stock',
  'nav.outOfStock': 'Out of Stock',
  'nav.inventoryReports': 'Inventory Reports',

  /* ── Sidebar Groups ─────────────────────────────────────── */
  'sidebar.mainMenu': 'Main Menu',
  'sidebar.catalog': 'Catalog',
  'sidebar.inventory': 'Inventory',
  'sidebar.uiLibrary': 'UI Library',
  'sidebar.system': 'System',

  /* ── Breadcrumb ─────────────────────────────────────────── */
  'breadcrumb.home': 'Home',
  'breadcrumb.workspace': 'Workspace',
  'breadcrumb.components': 'Components',
  'breadcrumb.layouts': 'Layouts',
  'breadcrumb.sidebar': 'Sidebar',
  'breadcrumb.grid': 'Grid',
  'breadcrumb.settings': 'Settings',
  'breadcrumb.help': 'Help & Support',
  'breadcrumb.products': 'Products',
  'breadcrumb.create': 'Create Product',
  'breadcrumb.edit': 'Edit Product',
  'breadcrumb.categories': 'Categories',
  'breadcrumb.brands': 'Brands',
  'breadcrumb.units': 'Units',
  'breadcrumb.barcode': 'Barcode',
'breadcrumb.details': 'Product Details',
  'breadcrumb.inventory': 'Inventory',
  'breadcrumb.inventoryDashboard': 'Inventory Dashboard',
  'breadcrumb.stockOverview': 'Stock Overview',
  'breadcrumb.stockMovements': 'Stock Movements',
  'breadcrumb.stockAdjustment': 'Stock Adjustment',
  'breadcrumb.stockTransfer': 'Stock Transfer',
  'breadcrumb.lowStock': 'Low Stock',
  'breadcrumb.outOfStock': 'Out of Stock',
  'breadcrumb.inventoryReports': 'Inventory Reports',

  /* ── Home ───────────────────────────────────────────────── */
  'home.title': 'Qutoof Nature',
  'home.description': 'الطبيعة أقرب إليك',
  'home.card.providers': 'Providers',
  'home.card.providersDesc': 'Theme, RTL, and Auth context providers',
  'home.card.routing': 'Routing',
  'home.card.routingDesc': 'React Router v7 with nested layouts',
  'home.card.appShell': 'App Shell',
  'home.card.appShellDesc': 'Sidebar, Topbar, Footer, and Outlet',

  /* ── Footer ─────────────────────────────────────────────── */
  'footer.copyright': '© {year} Qutoof Nature. All rights reserved.',
  'footer.engineer': 'Engineer: Ammar Al-Masawi',
  'footer.phone': 'Phone: 712275038',
  'footer.version': 'Qutoof Nature v1.0.0',
  'footer.close': 'Close',

  /* ── App ────────────────────────────────────────────────── */
  'app.title': 'Qutoof Nature',
  'app.description': 'الطبيعة أقرب إليك',
  'app.notFound': '404 — Page Not Found',
  'app.notFoundDescription': 'This page is a placeholder for the UI foundation milestone.',

  /* ── Profile ────────────────────────────────────────────── */
  'profile.title': 'Profile',
  'profile.notifications': 'Notifications',

  /* ── Placeholder Pages ──────────────────────────────────── */
  'placeholder.description': 'This page is a placeholder for the UI foundation milestone.',
  'placeholder.workspace.title': 'Workspace',
  'placeholder.components.title': 'Components',
  'placeholder.layouts.title': 'Layouts',
  'placeholder.sidebar.title': 'Sidebar Layout',
  'placeholder.grid.title': 'Grid Layout',
  'placeholder.settings.title': 'Settings',
  'placeholder.help.title': 'Help & Support',

  /* ── Dashboard ──────────────────────────────────────────── */
  'dashboard.title': 'Dashboard',
  'dashboard.subtitle': 'System Overview',

  /* ── Products ───────────────────────────────────────────── */
  'products.title': 'Products',
  'products.add': 'Add Product',
  'products.edit': 'Edit',
  'products.delete': 'Delete',
  'products.view': 'View',
  'products.details': 'Product Details',
  'products.create': 'Create Product',
  'products.categories': 'Categories',
  'products.brands': 'Brands',
  'products.units': 'Units',
  'products.barcode': 'Barcode',
  'products.management': 'Product Management',
  'products.form.title': 'Create Product Form',
  'products.form.description': 'The product creation form will be implemented in a future milestone. This page is a placeholder for the product module foundation.',
  'products.editForm.title': 'Edit Product — {id}',
  'products.editForm.description': 'The product editing form for ID {id} will be implemented in a future milestone.',
  'products.editForm.id': 'Product ID',
  'products.details.title': 'Product Details',
  'products.details.notFound': 'Product Not Found',
  'products.details.description': 'Detailed view for product ID {id} will be implemented in a future milestone.',
  'products.details.notFoundDesc': 'Product with ID "{id}" was not found.',
  'products.details.field.barcode': 'Barcode:',
  'products.details.field.sku': 'SKU:',
  'products.details.field.category': 'Category:',
  'products.details.field.brand': 'Brand:',
  'products.details.field.status': 'Status:',
  'products.backToList': 'Back to Products',
  'products.categories.management': 'Category Management',
  'products.categories.description': 'Category management interface will be implemented in a future milestone. This page is a placeholder for the product module foundation.',
  'products.brands.management': 'Brand Management',
  'products.brands.description': 'Brand management interface will be implemented in a future milestone. This page is a placeholder for the product module foundation.',
  'products.units.management': 'Units Management',
  'products.units.description': 'Units of measure management interface will be implemented in a future milestone. This page is a placeholder for the product module foundation.',
  'products.barcode.management': 'Barcode & Label Printing',
  'products.barcode.description': 'Barcode generation and label printing interface will be implemented in a future milestone. This page is a placeholder for the product module foundation.',

  /* ── Product Table ──────────────────────────────────────── */
  'table.image': 'Image',
  'table.barcode': 'Barcode',
  'table.sku': 'SKU',
  'table.name': 'Product Name',
  'table.category': 'Category',
  'table.brand': 'Brand',
  'table.unit': 'Unit',
  'table.purchasePrice': 'Purchase Price',
  'table.sellingPrice': 'Selling Price',
  'table.stock': 'Stock',
  'table.status': 'Status',
  'table.createdAt': 'Created Date',
  'table.updatedAt': 'Updated Date',
  'table.actions': 'Actions',
  'table.noProducts': 'No products found',
  'table.rowCount': '{count} product|{count} products',

  /* ── Product Filters ────────────────────────────────────── */
  'filters.search': 'Search products...',
  'filters.searchPlaceholder': 'Search products...',
  'filters.allCategories': 'All Categories',
  'filters.allBrands': 'All Brands',
  'filters.allStatuses': 'All Statuses',
  'filters.sortBy': 'Sort by',
  'filters.sortByName': 'Name',
  'filters.sortByBarcode': 'Barcode',
  'filters.sortBySku': 'SKU',
  'filters.sortByPurchasePrice': 'Purchase Price',
  'filters.sortBySellingPrice': 'Selling Price',
  'filters.sortByStock': 'Stock',
  'filters.sortByCreatedAt': 'Created Date',
  'filters.sortByUpdatedAt': 'Updated Date',
  'filters.sortAscending': 'Ascending',
  'filters.sortDescending': 'Descending',
  'filters.rowsPerPage': '/ page',
  'filters.clear': 'Clear',
  'filters.clearFilters': 'Clear Filters',

  /* ── Product Status ─────────────────────────────────────── */
  'status.all': 'All',
  'status.active': 'Active',
  'status.inactive': 'Inactive',
  'status.draft': 'Draft',
  'status.discontinued': 'Discontinued',

  /* ── Dialogs ────────────────────────────────────────────── */
  'dialog.createTitle': 'Create Product',
  'dialog.createDescription': 'Add a new product to the catalog',
  'dialog.editTitle': 'Edit Product',
  'dialog.editDescription': 'Modify product details',
  'dialog.deleteTitle': 'Delete Product',
  'dialog.deleteDescription': 'Are you sure you want to delete this product? This action cannot be undone.',
  'dialog.cancel': 'Cancel',
  'dialog.save': 'Save',
  'dialog.saveChanges': 'Save Changes',
  'dialog.confirmDelete': 'Delete',
  'dialog.close': 'Close dialog',
  'dialog.futureMilestone': 'Product form will be implemented in a future milestone.',

  /* ── Messages ───────────────────────────────────────────── */
  'messages.noProducts.title': 'No products yet',
  'messages.noProducts.description': 'Get started by adding your first product to the catalog.',
  'messages.noProducts.action': 'Add Product',
  'messages.noMatch.title': 'No matching products',
  'messages.noMatch.description': 'Try adjusting your filters or search query.',
  'messages.noMatch.action': 'Clear Filters',

  /* ── Errors ─────────────────────────────────────────────── */
  'errors.generic': 'An unexpected error occurred',
  'errors.notFound': '404 — Page Not Found',
  'errors.notFoundDesc': 'This page is not available.',

  /* ── Form ────────────────────────────────────────────────── */
  'form.generalInfo': 'General Information',
  'form.productName': 'Product Name',
  'form.productNamePlaceholder': 'Enter product name',
  'form.produceKey': 'Stable produce key',
  'form.produceKeyPlaceholder': 'Example: carrot or apple',
  'form.produceKeyHint': 'Use one stable English key so the image and educational content never cross between products.',
  'form.sku': 'SKU',
  'form.skuPlaceholder': 'Enter SKU',
  'form.barcode': 'Barcode',
  'form.barcodePlaceholder': 'Enter barcode',
  'form.category': 'Category',
  'form.selectCategory': 'Select a category',
  'form.brand': 'Brand',
  'form.selectBrand': 'Select a brand',
  'form.unit': 'Unit',
  'form.selectUnit': 'Select a unit',
  'form.description': 'Description',
  'form.descriptionPlaceholder': 'Enter product description',
  'form.originCountry': 'Country of origin',
  'form.originCountryPlaceholder': 'Example: Yemen — Sana’a',
  'form.harvestDate': 'Harvest or production date',
  'form.expiryDate': 'Expiry date',
  'form.storageInstructions': 'Storage instructions',
  'form.storageInstructionsPlaceholder': 'Example: Keep refrigerated between 2 and 8°C',
  'form.qualityGrade': 'Quality grade',
  'form.selectQualityGrade': 'Select quality grade',
  'form.weightValue': 'Product weight',
  'form.weightUnit': 'Weight unit',
  'form.packageLength': 'Package length (cm)',
  'form.packageWidth': 'Package width (cm)',
  'form.packageHeight': 'Package height (cm)',
  'form.shippingWeight': 'Shipping weight',
  'form.shippingClass': 'Shipping class',
  'form.shippingClassPlaceholder': 'Example: refrigerated or standard',
  'form.category.vegetables': 'Vegetables',
  'form.category.fruits': 'Fruits',
  'form.category.herbs': 'Herbs',
  'form.category.dairy': 'Dairy',
  'form.category.beverages': 'Beverages',
  'form.brand.greenFarm': 'Green Farm',
  'form.brand.naturesBest': "Nature's Best",
  'form.brand.organicValley': 'Organic Valley',
  'form.brand.freshHarvest': 'Fresh Harvest',
  'form.brand.ecoGrow': 'EcoGrow',
  'form.unit.kilogram': 'Kilogram',
  'form.unit.box': 'Box',
  'form.unit.bunch': 'Bunch',
  'form.unit.liter': 'Liter',
  'form.unit.pack': 'Pack',
  'form.unit.gram': 'Gram',
  'form.pricing': 'Pricing',
  'form.pricingManagedSeparately': 'Notice: these fields are currently for preparation/display. The live selling price is managed through the product variant/pricing flow after creation.',
  'form.purchasePrice': 'Purchase Price',
  'form.purchasePricePlaceholder': 'Enter purchase price',
  'form.sellingPrice': 'Selling Price',
  'form.sellingPricePlaceholder': 'Enter selling price',
  'form.tax': 'Tax (%)',
  'form.taxPlaceholder': 'Enter tax percentage',
  'form.discount': 'Discount',
  'form.discountPlaceholder': 'Enter discount value',
  'form.inventory': 'Inventory',
  'form.inventoryManagedSeparately': 'Notice: quantities and operational thresholds are managed from the inventory dashboard after product creation so stock movements remain auditable.',
  'form.initialStock': 'Initial Stock',
  'form.initialStockPlaceholder': 'Enter initial stock',
  'form.minStock': 'Min Stock',
  'form.minStockPlaceholder': 'Enter minimum stock',
  'form.maxStock': 'Max Stock',
  'form.maxStockPlaceholder': 'Enter maximum stock',
  'form.trackInventory': 'Track Inventory',
  'form.media': 'Media',
  'form.imagePreview': 'Image Preview',
  'form.removeImage': 'Remove Image',
  'form.imageUpload': 'Click to upload or drag and drop',
  'form.imageUploadHint': 'JPEG, PNG or WebP — the image is compressed automatically before saving.',
  'form.imageCompressionHint': 'The image is resized to a maximum of 1200px and optimized for performance.',
  'form.imageSizeLabel': 'Compressed size',
  'form.reset': 'Reset',
  'form.cancel': 'Cancel',
  'form.save': 'Save',
  'form.status': 'Status',
  'form.active': 'Active',
  'form.inactive': 'Inactive',

  /* ── Form Validation ────────────────────────────────────── */
  'form.validation.required': 'This field is required',
  'form.validation.minLength': 'Value is too short',
  'form.validation.invalidFormat': 'Invalid format',
  'form.validation.invalidNumber': 'Please enter a valid number',
  'form.validation.integerRequired': 'Please enter a whole number',
  'form.validation.positiveNumber': 'Please enter a positive number',
  'form.validation.minValue': 'Value is below the minimum',
  'form.validation.maxValue': 'Value exceeds the maximum',
  'form.validation.alphanumeric': 'Please enter letters and numbers only',
  'form.validation.numbersOnly': 'Please enter numbers only',
  'form.validation.minGtMax': 'Min stock must be less than max stock',
  'form.validation.invalidDate': 'Please enter a valid date',
  'form.validation.expiryBeforeHarvest': 'Expiry date cannot be before harvest date',

  /* ── Inventory Status ───────────────────────────────────── */
  'invStatus.in_stock': 'In Stock',
  'invStatus.low_stock': 'Low Stock',
  'invStatus.out_of_stock': 'Out of Stock',
  'invStatus.overstocked': 'Overstocked',

  /* ── Movement Types ─────────────────────────────────────── */
  'movementType.stock_in': 'Stock In',
  'movementType.stock_out': 'Stock Out',
  'movementType.adjustment': 'Adjustment',
  'movementType.transfer': 'Transfer',
  'movementType.sale': 'Sale',
  'movementType.purchase': 'Purchase',

  /* ── Movement Status ────────────────────────────────────── */
  'movementStatus.pending': 'Pending',
  'movementStatus.completed': 'Completed',
  'movementStatus.cancelled': 'Cancelled',

  /* ── Inventory Filters ──────────────────────────────────── */
  'inventoryFilters.search': 'Search inventory...',
  'inventoryFilters.searchPlaceholder': 'Search inventory...',
  'inventoryFilters.allStatuses': 'All Statuses',
  'inventoryFilters.allLocations': 'All Locations',
  'inventoryFilters.locations': 'locations',

  /* ── Inventory Table ────────────────────────────────────── */
  'invTable.product': 'Product',
  'invTable.sku': 'SKU',
  'invTable.barcode': 'Barcode',
  'invTable.quantityOnHand': 'On Hand',
  'invTable.quantityReserved': 'Reserved',
  'invTable.quantityAvailable': 'Available',
  'invTable.location': 'Location',
  'invTable.status': 'Status',
  'invTable.lastMovementAt': 'Last Movement',
  'invTable.actions': 'Actions',
  'invTable.noInventory': 'No inventory records',
  'invTable.rowCount': '{count} record|{count} records',

  /* ── Movement Table Columns ─────────────────────────────── */
  'invMovementCol.product': 'Product',
  'invMovementCol.type': 'Type',
  'invMovementCol.quantity': 'Quantity',
  'invMovementCol.from': 'From',
  'invMovementCol.to': 'To',
  'invMovementCol.reference': 'Reference',
  'invMovementCol.status': 'Status',
  'invMovementCol.performedAt': 'Performed At',

  /* ── Movement Table ─────────────────────────────────────── */
  'invMovementTable.noMovements': 'No stock movements',
  'invMovementTable.movementCount': '{count} movement|{count} movements',

  /* ── Movement Timeline ──────────────────────────────────── */
  'invTimeline.title': 'Recent Movements',
  'invTimeline.noMovements': 'No recent movements',

  /* ── Stock Card ─────────────────────────────────────────── */
  'invCard.onHand': 'On Hand',
  'invCard.reserved': 'Reserved',
  'invCard.available': 'Available',

  /* ── Stock Summary ──────────────────────────────────────── */
  'invSummary.totalProducts': 'Total Products',
  'invSummary.trackedProducts': 'products tracked',
  'invSummary.totalUnits': 'Total Units',
  'invSummary.unitsOnHand': 'units in stock',
  'invSummary.lowStock': 'Low Stock',
  'invSummary.needsAttention': 'needs attention',
  'invSummary.outOfStock': 'Out of Stock',
  'invSummary.urgent': 'urgent',
  'invSummary.overstocked': 'Overstocked',
  'invSummary.excessStock': 'exceeds max stock',

  /* ── Inventory Sort ─────────────────────────────────────── */
  'invSort.quantityOnHand': 'On Hand',
  'invSort.quantityReserved': 'Reserved',
  'invSort.quantityAvailable': 'Available',
  'invSort.location': 'Location',
  'invSort.status': 'Status',
  'invSort.lastMovementAt': 'Last Movement',
  'invSort.updatedAt': 'Updated Date',

  /* ── Inventory Pages ────────────────────────────────────── */
  'inventory.dashboard.title': 'Inventory Dashboard',
  'inventory.stockOverview.title': 'Stock Overview',
  'inventory.stockMovements.title': 'Stock Movements',
  'inventory.stockAdjustment.title': 'Stock Adjustment',
  'inventory.stockTransfer.title': 'Stock Transfer',
  'inventory.lowStock.title': 'Low Stock',
  'inventory.outOfStock.title': 'Out of Stock',
  'inventory.inventoryReports.title': 'Inventory Reports',
  'inventory.stockMovements.management': 'Stock Movements Management',
  'inventory.stockMovements.description': 'View and manage all stock movements. Details will be implemented in a future milestone.',
  'inventory.stockAdjustment.management': 'Stock Adjustment Management',
  'inventory.stockAdjustment.description': 'Adjust stock discrepancies. The form will be implemented in a future milestone.',
  'inventory.stockTransfer.management': 'Stock Transfer Management',
  'inventory.stockTransfer.description': 'Transfer stock between locations. The form will be implemented in a future milestone.',
  'inventory.inventoryReports.management': 'Inventory Reports',
  'inventory.inventoryReports.description': 'View inventory reports and analytics. Will be implemented in a future milestone.',
  'inventory.empty.title': 'No inventory data',
  'inventory.empty.description': 'Start adding products to track inventory.',
  'inventory.lowStockSection': 'Low Stock Items Needing Attention',
  'inventory.lowStockEmpty': 'No low stock items',
  'inventory.lowStockEmptyDesc': 'All products are at healthy stock levels.',
  'inventory.lowStock.empty': 'No low stock items',
  'inventory.lowStock.emptyDesc': 'All products are within normal thresholds.',
  'inventory.outOfStock.empty': 'No out of stock items',
  'inventory.outOfStock.emptyDesc': 'All products are in stock.',
  'inventory.stockOverview.empty': 'No inventory records',
  'inventory.stockOverview.emptyDesc': 'No matching inventory records found.',
  'inventory.noMatch.title': 'No matching results',
  'inventory.noMatch.description': 'Try adjusting your filters or search query.',
  'inventory.noMatch.action': 'Clear Filters',
  'inventory.filterByType': 'Filter by type',
  'inventory.allTypes': 'All Types',
  'inventory.filterByStatus': 'Filter by status',
  'inventory.allStatuses': 'All Statuses',
  'inventory.noMovements.title': 'No movements',
  'inventory.noMovements.description': 'No matching stock movements found.',
'inventory.view': 'View',
  'inventory.thresholds': 'Thresholds',

  /* ── Supplier Navigation ────────────────────────────────── */
  'nav.suppliersDashboard': 'Supplier Dashboard',
  'nav.suppliersList': 'Supplier List',
  'nav.supplierCategories': 'Supplier Categories',
  'nav.supplierContacts': 'Supplier Contacts',
  'nav.supplierReports': 'Supplier Reports',

  /* ── Supplier Sidebar ───────────────────────────────────── */
  'sidebar.suppliers': 'Suppliers',

  /* ── Supplier Breadcrumb ────────────────────────────────── */
  'breadcrumb.suppliers': 'Suppliers',
  'breadcrumb.suppliersList': 'Supplier List',
  'breadcrumb.supplierCategories': 'Supplier Categories',
  'breadcrumb.supplierContacts': 'Contacts',
  'breadcrumb.supplierReports': 'Supplier Reports',
  'breadcrumb.createSupplier': 'Add Supplier',
  'breadcrumb.editSupplier': 'Edit Supplier',
  'breadcrumb.supplierDetails': 'Supplier Details',

  /* ── Supplier Pages ─────────────────────────────────────── */
  'suppliers.dashboard.title': 'Supplier Dashboard',
  'suppliers.empty.title': 'No suppliers yet',
  'suppliers.empty.description': 'Start by adding your first supplier.',
  'suppliers.topSuppliers': 'Top Suppliers',
  'suppliers.topSuppliersEmpty': 'No suppliers',
  'suppliers.topSuppliersEmptyDesc': 'No suppliers found.',
  'suppliers.recentOrders': 'Recent Orders',
  'suppliers.recentOrdersPlaceholder': 'Recent orders will be implemented in a future milestone.',
  'suppliers.list.title': 'Supplier List',
  'suppliers.list.empty': 'No suppliers yet',
  'suppliers.list.emptyDesc': 'Start by adding your first supplier.',
  'suppliers.list.emptyAction': 'Add Supplier',
  'suppliers.add': 'Add Supplier',
  'suppliers.view': 'View',
  'suppliers.edit': 'Edit',
  'suppliers.delete': 'Delete',
  'suppliers.details.title': 'Supplier Details',
  'suppliers.details.code': 'Code',
  'suppliers.details.contactInfo': 'Contact Information',
  'suppliers.details.primaryContact': 'Primary Contact',
  'suppliers.details.stats': 'Statistics',
  'suppliers.details.createdAt': 'Created At',
  'suppliers.details.updatedAt': 'Updated At',
  'suppliers.details.notFound': 'Supplier Not Found',
  'suppliers.details.notFoundDesc': 'Supplier with ID "{id}" was not found.',
  'suppliers.details.field.email': 'Email',
  'suppliers.details.field.phone': 'Phone',
  'suppliers.details.field.city': 'City',
  'suppliers.details.field.address': 'Address',
  'suppliers.details.field.website': 'Website',
  'suppliers.details.field.contactName': 'Name',
  'suppliers.details.field.contactRole': 'Role',
  'suppliers.details.field.products': 'Products',
  'suppliers.details.field.totalPurchases': 'Total Purchases',
  'suppliers.details.field.lastOrder': 'Last Order',
  'suppliers.backToList': 'Back to Suppliers',
  'suppliers.create.title': 'Add New Supplier',
  'suppliers.create.management': 'Add Supplier Management',
  'suppliers.create.description': 'The supplier creation form will be implemented in a future milestone.',
  'suppliers.edit.title': 'Edit Supplier',
  'suppliers.edit.management': 'Edit Supplier Management',
  'suppliers.edit.description': 'The supplier edit form will be implemented in a future milestone.',
  'suppliers.categories.title': 'Supplier Categories',
  'suppliers.categories.management': 'Supplier Categories Management',
  'suppliers.categories.description': 'Supplier category management interface will be implemented in a future milestone.',
  'suppliers.contacts.title': 'Supplier Contacts',
  'suppliers.contacts.management': 'Supplier Contacts Management',
  'suppliers.contacts.description': 'Supplier contact management interface will be implemented in a future milestone.',
  'suppliers.reports.title': 'Supplier Reports',
  'suppliers.reports.management': 'Supplier Reports',
  'suppliers.reports.description': 'Supplier reports will be implemented in a future milestone.',
  'suppliers.noMatch.title': 'No matching results',
  'suppliers.noMatch.description': 'Try adjusting your filters or search query.',
  'suppliers.noMatch.action': 'Clear Filters',

  /* ── Supplier Filters ───────────────────────────────────── */
  'supplierFilters.search': 'Search suppliers...',
  'supplierFilters.searchPlaceholder': 'Search suppliers...',
  'supplierFilters.allStatuses': 'All Statuses',
  'supplierFilters.allCategories': 'All Categories',
  'supplierFilters.allCities': 'All Cities',
  'supplierFilters.categories': 'categories',
  'supplierFilters.cities': 'cities',

  /* ── Supplier Status ────────────────────────────────────── */
  'supplierStatus.active': 'Active',
  'supplierStatus.inactive': 'Inactive',
  'supplierStatus.suspended': 'Suspended',
  'supplierStatus.pending': 'Pending',

  /* ── Supplier Card ──────────────────────────────────────── */
  'supplierCard.products': 'Products',
  'supplierCard.purchases': 'Purchases',

  /* ── Supplier Summary ───────────────────────────────────── */
  'supplierSummary.totalSuppliers': 'Total Suppliers',
  'supplierSummary.allSuppliers': 'All suppliers',
  'supplierSummary.activeSuppliers': 'Active Suppliers',
  'supplierSummary.activeHint': 'active suppliers',
  'supplierSummary.pendingSuppliers': 'Pending Suppliers',
  'supplierSummary.pendingHint': 'pending approval',
  'supplierSummary.totalPurchases': 'Total Purchases',
  'supplierSummary.purchasesHint': 'total purchase value',
  'supplierSummary.totalProducts': 'Total Products',
  'supplierSummary.productsHint': 'products supplied',
  'supplierSummary.avgRating': 'Average Rating',
  'supplierSummary.ratingHint': 'out of 5',

  /* ── Supplier Badge ─────────────────────────────────────── */
  'supplierBadge.wholesale': 'Wholesale',
  'supplierBadge.retail': 'Retail',
  'supplierBadge.distributor': 'Distributor',
  'supplierBadge.manufacturer': 'Manufacturer',
  'supplierBadge.service': 'Service',

  /* ── Supplier Table ─────────────────────────────────────── */
  'supplierTable.code': 'Code',
  'supplierTable.name': 'Name',
  'supplierTable.category': 'Category',
  'supplierTable.contact': 'Contact',
  'supplierTable.email': 'Email',
  'supplierTable.phone': 'Phone',
  'supplierTable.city': 'City',
  'supplierTable.status': 'Status',
  'supplierTable.products': 'Products',
  'supplierTable.productCount': 'Product Count',
  'supplierTable.totalPurchases': 'Total Purchases',
  'supplierTable.lastOrder': 'Last Order',
  'supplierTable.lastOrderAt': 'Last Order',
  'supplierTable.actions': 'Actions',
  'supplierTable.noSuppliers': 'No suppliers found',
  'supplierTable.rowCount': '{count} supplier|{count} suppliers',

  /* ── Supplier Sort ──────────────────────────────────────── */
  'supplierSort.name': 'Name',
  'supplierSort.code': 'Code',
  'supplierSort.category': 'Category',
  'supplierSort.city': 'City',
  'supplierSort.status': 'Status',
  'supplierSort.productCount': 'Product Count',
  'supplierSort.totalPurchases': 'Total Purchases',
  'supplierSort.lastOrderAt': 'Last Order',
  'supplierSort.createdAt': 'Created Date',
  'supplierSort.updatedAt': 'Updated Date',

  /* ── Purchasing Navigation ──────────────────────────────── */
  'nav.purchasingDashboard': 'Purchasing Dashboard',
  'nav.purchaseOrders': 'Purchase Orders',
  'nav.goodsReceiving': 'Goods Receiving',
  'nav.purchaseReturns': 'Purchase Returns',
  'nav.purchaseReports': 'Purchase Reports',
  'nav.purchaseAnalytics': 'Purchase Analytics',

  /* ── Purchasing Sidebar ─────────────────────────────────── */
  'sidebar.purchasing': 'Purchasing',

  /* ── Purchasing Breadcrumb ──────────────────────────────── */
  'breadcrumb.purchasing': 'Purchasing',
  'breadcrumb.purchaseOrders': 'Purchase Orders',
  'breadcrumb.createPurchaseOrder': 'Create Purchase Order',
  'breadcrumb.purchaseDetails': 'Purchase Order Details',
  'breadcrumb.goodsReceiving': 'Goods Receiving',
  'breadcrumb.purchaseReturns': 'Purchase Returns',
  'breadcrumb.purchaseReports': 'Purchase Reports',
  'breadcrumb.purchaseAnalytics': 'Purchase Analytics',

  /* ── Purchasing Pages ───────────────────────────────────── */
  'purchasing.dashboard.title': 'Purchasing Dashboard',
  'purchasing.empty.title': 'No purchase orders yet',
  'purchasing.empty.description': 'Get started by creating your first purchase order.',
  'purchasing.recentOrders': 'Recent Purchase Orders',
  'purchasing.recentOrdersEmpty': 'No orders',
  'purchasing.recentOrdersEmptyDesc': 'No purchase orders found.',
  'purchasing.statusBreakdown': 'Status Breakdown',
  'purchasing.statusBreakdownEmpty': 'No statuses',
  'purchasing.orders.title': 'Purchase Orders',
  'purchasing.orders.empty': 'No purchase orders yet',
  'purchasing.orders.emptyDesc': 'Get started by creating your first purchase order.',
  'purchasing.orders.emptyAction': 'Create Purchase Order',
  'purchasing.add': 'Create Purchase Order',
  'purchasing.view': 'View',
  'purchasing.details.title': 'Purchase Order Details',
  'purchasing.details.code': 'Code',
  'purchasing.details.orderedAt': 'Ordered At',
  'purchasing.details.expectedAt': 'Expected Delivery',
  'purchasing.details.items': 'Items',
  'purchasing.details.lineItems': 'Line Items',
  'purchasing.details.subtotal': 'Subtotal',
  'purchasing.details.taxTotal': 'Tax Total',
  'purchasing.details.discountTotal': 'Discount Total',
  'purchasing.details.total': 'Total',
  'purchasing.details.notes': 'Notes',
  'purchasing.details.notFound': 'Purchase Order Not Found',
  'purchasing.details.notFoundDesc': 'Purchase order with ID "{id}" was not found.',
  'purchasing.backToList': 'Back to Purchase Orders',
  'purchasing.create.title': 'Create Purchase Order',
  'purchasing.create.error': 'Failed to create the purchase order. Please try again.',
  'purchasing.goodsReceiving.title': 'Goods Receiving',
  'purchasing.goodsReceiving.empty': 'No orders awaiting receipt',
  'purchasing.goodsReceiving.emptyDesc': 'All purchase orders have been received.',
  'purchasing.returns.title': 'Purchase Returns',
  'purchasing.returns.empty': 'No returns',
  'purchasing.returns.emptyDesc': 'No purchase returns found.',
  'purchasing.reports.title': 'Purchase Reports',
  'purchasing.reports.empty': 'No report data',
  'purchasing.reports.emptyDesc': 'Not enough data to generate reports.',
  'purchasing.reports.spendBySupplier': 'Spend by Supplier',
  'purchasing.reports.spendBySupplierHint': 'Total spend per supplier',
  'purchasing.reports.orderTrend': 'Order Trend',
  'purchasing.reports.orderTrendHint': 'Number of orders over time',
  'purchasing.reports.statusBreakdown': 'Order Status Breakdown',
  'purchasing.reports.statusBreakdownHint': 'Orders by status',
  'purchasing.analytics.title': 'Purchase Analytics',
  'purchasing.analytics.empty': 'No analytics data',
  'purchasing.analytics.emptyDesc': 'Not enough data for analytics.',
  'purchasing.analytics.totalSpend': 'Total Spend',
  'purchasing.analytics.statusDistribution': 'Status Distribution',
  'purchasing.analytics.activity': 'Purchase Activity',
  'purchasing.analytics.activityHint': 'orders per month',
  'purchasing.noMatch.title': 'No matching results',
  'purchasing.noMatch.description': 'Try adjusting your filters or search query.',
  'purchasing.noMatch.action': 'Clear Filters',

  /* ── Purchase Status ────────────────────────────────────── */
  'purchaseStatus.draft': 'Draft',
  'purchaseStatus.pending': 'Pending',
  'purchaseStatus.approved': 'Approved',
  'purchaseStatus.partially_received': 'Partially Received',
  'purchaseStatus.received': 'Received',
  'purchaseStatus.cancelled': 'Cancelled',

  /* ── Purchase Filters ───────────────────────────────────── */
  'purchaseFilters.search': 'Search purchase orders...',
  'purchaseFilters.searchPlaceholder': 'Search purchase orders...',
  'purchaseFilters.allStatuses': 'All Statuses',
  'purchaseFilters.allSuppliers': 'All Suppliers',
  'purchaseFilters.suppliers': 'suppliers',

  /* ── Purchase Sort ──────────────────────────────────────── */
  'purchaseSort.code': 'Code',
  'purchaseSort.supplier': 'Supplier',
  'purchaseSort.status': 'Status',
  'purchaseSort.itemCount': 'Item Count',
  'purchaseSort.totalQuantity': 'Total Quantity',
  'purchaseSort.totalCost': 'Total Cost',
  'purchaseSort.expectedAt': 'Expected Delivery',
  'purchaseSort.orderedAt': 'Order Date',
  'purchaseSort.createdAt': 'Created Date',
  'purchaseSort.updatedAt': 'Updated Date',

  /* ── Purchase Table ─────────────────────────────────────── */
  'purchaseTable.code': 'Code',
  'purchaseTable.supplier': 'Supplier',
  'purchaseTable.status': 'Status',
  'purchaseTable.itemCount': 'Items',
  'purchaseTable.totalQuantity': 'Quantity',
  'purchaseTable.totalCost': 'Total Cost',
  'purchaseTable.expectedAt': 'Expected Delivery',
  'purchaseTable.orderedAt': 'Order Date',
  'purchaseTable.actions': 'Actions',
  'purchaseTable.noOrders': 'No purchase orders found',
  'purchaseTable.rowCount': '{count} order|{count} orders',

  /* ── Purchase Card ──────────────────────────────────────── */
  'purchaseCard.items': 'Items',
  'purchaseCard.total': 'Total',
  'purchaseCard.noExpectedDate': 'No expected date',

  /* ── Purchase Summary ───────────────────────────────────── */
  'purchaseSummary.totalOrders': 'Total Orders',
  'purchaseSummary.allOrders': 'All orders',
  'purchaseSummary.pendingOrders': 'Pending Orders',
  'purchaseSummary.pendingHint': 'awaiting approval',
  'purchaseSummary.approvedOrders': 'Approved Orders',
  'purchaseSummary.approvedHint': 'approved orders',
  'purchaseSummary.receivedOrders': 'Received Orders',
  'purchaseSummary.receivedHint': 'orders received',
  'purchaseSummary.totalSpend': 'Total Spend',
  'purchaseSummary.spendHint': 'total purchase value',
  'purchaseSummary.itemsOrdered': 'Items Ordered',
  'purchaseSummary.itemsHint': 'total quantity',

  /* ── Purchase Items Table ───────────────────────────────── */
  'purchaseItemsTable.product': 'Product',
  'purchaseItemsTable.quantity': 'Quantity',
  'purchaseItemsTable.received': 'Received',
  'purchaseItemsTable.unitCost': 'Unit Cost',
  'purchaseItemsTable.tax': 'Tax',
  'purchaseItemsTable.lineTotal': 'Line Total',
  'purchaseItemsTable.noItems': 'No items found',

  /* ── Purchase Timeline ──────────────────────────────────── */
  'purchaseTimeline.label': 'Stage',
  'purchaseTimeline.cancelled': 'Cancelled',

  /* ── Purchase Order Form ────────────────────────────────── */
  'purchaseOrderForm.supplier': 'Supplier',
  'purchaseOrderForm.selectSupplier': 'Select a supplier',
  'purchaseOrderForm.expectedAt': 'Expected Delivery Date',
  'purchaseOrderForm.items': 'Items',
  'purchaseOrderForm.addItem': 'Add Item',
  'purchaseOrderForm.noItems': 'No items',
  'purchaseOrderForm.product': 'Product',
  'purchaseOrderForm.quantity': 'Quantity',
  'purchaseOrderForm.unitCost': 'Unit Cost',
  'purchaseOrderForm.taxRate': 'Tax Rate',
  'purchaseOrderForm.removeItem': 'Remove Item',
  'purchaseOrderForm.notes': 'Notes',
  'purchaseOrderForm.notesPlaceholder': 'Enter notes about this order',
  'purchaseOrderForm.save': 'Save Purchase Order',
};

/**
 * Translation dictionary map.
 */
export const translations: Record<Locale, Translations> = {
  ar,
  en,
};

/**
 * Default locale.
 */
export const DEFAULT_LOCALE: Locale = 'ar';


