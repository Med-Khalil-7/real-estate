export const BASE = "/api";
/* Auth */
export const TOKEN_BASE = `${BASE}/authentication`;
export const TOKEN_OBTAIN = `${TOKEN_BASE}/obtain/`;
export const TOKEN_REFRESH = `${TOKEN_BASE}/refresh/`;
export const TOKEN_BLACKLIST = `${TOKEN_BASE}/blacklist/`;
export const APPLICATION_ACCEPT = `${BASE}/users/account/confirmation/`;
export const EMAIL_CONFIRMATION = `${BASE}/users/account/verification/`;
export const CONTRACT_SIGN_VALIDATION = `${BASE}/contracts/sign_validation/validation/`;
export const CONTRACT_SIGN_REQUEST = `${BASE}/contracts/{contract_id}/sign_request/`
export const SIGNUP = `${BASE}/users/signup/`;
export const TOWER = `${BASE}/properties/tower/`
/* Users and profiles */
export const USERS = `${BASE}/users/`;
export const CURRENT_USER = `${BASE}/users/current`;
export const PERMISSIONS = `${BASE}/users/permissions/`;
export const GROUPS = `${BASE}/users/groups/`;
export const TENANTS = `${BASE}/users/tenants`;
export const LANDLORDS = `${BASE}/users/landlords`;
export const EMPLOYEES = `${BASE}/users/employees`;
/*Reset password */
export const REST_PASSWORD = `${BASE}/users/request-reset-email/`;
export const NEW_PASSWORD_UPDATE = `${BASE}/users/password-reset-complete/`;
/* Property  */
export const PROPERTIES = `${BASE}/properties/`;
export const PROPERTY = `${BASE}/properties/property/`;
export const PROPERTY_BULK = `${BASE}/properties/property/bulk_create`;
export const PROPERTY_WIZARD = `${BASE}/properties/property/wizard`;

export const APARTMENTS = `${BASE}/apartments/`;
export const DEPARTMENTS = `${BASE}/users/departments/`;
/* Dashboards */
export const DASHBAORD = `${BASE}/dashboard/`;
/* Search */
export const LANDLORD_PROFILES = `${BASE}/profiles/landlord/`;
export const TENANT_PROFILES = `${BASE}/profiles/tenant/`;
export const EMPLOYEE_SEARCH = `${BASE}/employees/search/`;
/* Contracts */
export const PROPERTY_CONTRACTS = `${BASE}/contracts/property/`;
export const EMPLOYEE_CONTRACTS = `${BASE}/contracts/employee/`;
/*  Payments */
export const PAYMENTS = `${BASE}/contracts/payments/`; // All payments
/* Contract Payments */
export const CREATE_CONTRACT_PAYMENT = `${BASE}/contracts/{contract_id}/payment/`;
export const CONTRACT_PAYMENTS = `${BASE}/contracts/{contract_id}/payment`;
/* Contract Terminate */
export const TERMINATE_CONTRACT = `${BASE}/contracts/{contract_id}/terminate/`;
/* contract sign */
export const SIGN_CONTRACT = `${BASE}/contracts/{contract_id}/sign/`;
/* Contract fees */
export const CREATE_CONTRACT_FEE = `${BASE}/contracts/{contract_id}/fee/`;
export const CONTRACT_FEES = `${BASE}/contracts/{contract_id}/fee`;
/* Contract refunds */
export const CREATE_CONTRACT_REFUND = `${BASE}/contracts/{contract_id}/refund/`;
export const CONTRACT_REFUNDS = `${BASE}/contracts/{contract_id}/refund`;
/* Contract discounts */
export const CREATE_CONTRACT_DISCOUNT = `${BASE}/contracts/{contract_id}/discount/`;
export const CONTRACT_DISCOUNTS = `${BASE}/contracts/{contract_id}/discount`;
/* Contract revisions */
export const CONTRACT_REVISIONS = `${BASE}/contracts/{contract_id}/revision`;
export const CREATE_CONTRACT_REVISION = `${BASE}/contracts/{contract_id}/revision/`;
export const CONTRACT_PDF_TEMPLATE = `${BASE}/contracts/{contract_id}/contract_pdf`;
/* Emails */
export const BULK_REMINDER_EMAIL = `${BASE}/contracts/bulk_reminder_email`;
/* Email history */
export const EMAIL_HISTORY = `${BASE}/users/mail_history`;
/* Contract cashflows */
export const CONTRACT_CASHFLOWS = `${BASE}/contracts/{contract_id}/cashflows`;
/* Templates */
export const HTML_TEMPLATES = `${BASE}/settings/templates`;
export const HTML_TEMPLATE = `${BASE}/settings/templates/{template_id}`;
/* Discounts */
export const FEES = `${BASE}/contracts/fees/`;
export const DISCOUNTS = `${BASE}/contracts/discounts/`;
export const REFUNDS = `${BASE}/contracts/refunds/`;
export const REVISIONS = `${BASE}/contracts/revisions/`;
/* Kanban */
export const API_BOARDS = `${BASE}/kanban/boards/`;
export const API_COLUMNS = `${BASE}/kanban/columns/`;
export const API_TASKS = `${BASE}/kanban/tasks/`;
export const API_COMMENTS = `${BASE}/kanban/comments/`;
export const API_SORT_COLUMNS = `${BASE}/kanban/sort/column/`;
export const API_SORT_TASKS = `${BASE}/kanban/sort/task/`;
export const API_SEARCH_USERS = `${BASE}/users/search/`;
/* tax rate */
export const TAX_RATE = `${BASE}/books/taxrate/`
/* bill */
export const BILL = `${BASE}/books/bill/`
/* invoice */
export const INVOICE = `${BASE}/books/invoice/`
/* expense claim */
export const EXPENSE_CLAIM = `${BASE}/books/expense-claim/`
/* payments */
export const PAY_BILL = `${BASE}/books/bill/{bill_id}/pay`
export const PAY_INVOICE = `${BASE}/books/invoice/{invoice_id}/pay`
export const PAY_CLAIM = `${BASE}/books/expense_claim/{expense_claim_id}/pay`

/* contract profit and loss */
export const CONTRACT_PROFIT = `${BASE}/books/contract/{contractId}/profit_report`
