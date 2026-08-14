/**
 * @typedef {Object} Category
 * @property {number} id
 * @property {string} name
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Role
 * @property {number} id
 * @property {string} code
 * @property {string} name
 * @property {string|null} pic
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} ColorOption
 * @property {number} id
 * @property {string} code
 * @property {string} name
 * @property {string} hex
 * @property {boolean|number} active
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} SizeSet
 * @property {number} id
 * @property {string} code
 * @property {string} name
 * @property {boolean|number} active
 * @property {string|null} sizes // JSON string
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} code
 * @property {string} name
 * @property {string|null} category
 * @property {'ready'|'preorder'} type
 * @property {number} price
 * @property {number|null} compare_at
 * @property {string|null} garment_hex
 * @property {string|null} print_type
 * @property {string|null} sizes // JSON string
 * @property {string|null} colors // JSON string
 * @property {number} stock
 * @property {number} sold
 * @property {string|null} costs // JSON string
 * @property {string|null} preorder_info // JSON string
 * @property {string|null} description
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Order
 * @property {number} id
 * @property {string} code
 * @property {string} customer
 * @property {string} items
 * @property {number} total
 * @property {string|null} date
 * @property {'ready'|'preorder'} type
 * @property {string} status
 * @property {string} created_at
 * @property {string} updated_at
 */

export default {};
