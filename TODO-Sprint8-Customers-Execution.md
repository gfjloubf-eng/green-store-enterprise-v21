# TODO - Sprint 8 (Customers Module Foundation)

## Step 1: Migration (additive)
- [x] Create `db/migrations/2026_07_12_add_customers_tables.sql`

- [x] Add `customers` table

- [x] Add `customer_addresses` table
- [ ] Add uniqueness constraints + indexes
- [ ] Add FK relationship

## Step 2: Repository Layer
- [x] Implement `app/Repositories/CustomerRepository.php`

  - [ ] CRUD for customers
  - [ ] uniqueness helpers: phone/email/customer_code
- [ ] Implement `app/Repositories/CustomerAddressRepository.php`
  - [ ] CRUD for addresses
  - [ ] default-address SQL helpers

## Step 3: Service Layer
- [x] Implement `app/Services/CustomerService.php`

  - [ ] CRUD methods
  - [ ] generate unique, immutable `customer_code`
  - [ ] enforce uniqueness via repository checks
- [ ] Implement `app/Services/CustomerAddressService.php`
  - [ ] CRUD methods
  - [ ] default-address behavior (single default per customer)

## Step 4: API Layer
- [ ] Update `api.php` with switch cases:
  - [ ] create_customer
  - [ ] update_customer
  - [ ] delete_customer
  - [ ] customer
  - [ ] list_customers
  - [ ] create_customer_address
  - [ ] update_customer_address
  - [ ] delete_customer_address
  - [ ] customer_addresses
- [ ] Add conflict handling mapping for customer uniqueness messages (HTTP 409)

## Step 5: Verification
- [x] Verify Customers CRUD (create/update/delete/get/list)

- [x] Verify Customer Addresses CRUD
- [x] Verify default-address behavior
- [x] Verify backward compatibility: Products + Categories remain unaffected


