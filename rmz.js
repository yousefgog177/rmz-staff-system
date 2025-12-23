const config = require('./config');

class RMZ {
    constructor() {
        this.baseURL = config.RMZ_API_URL;
    }

    /**
     * Get store information from RMZ API
     * @param {string} apiToken - The RMZ API token
     * @returns {Promise<object>} Store information
     */
    async getStoreInfo(apiToken) {
        try {
            const response = await fetch(`${this.baseURL}/store`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiToken}`,
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.message || 'Failed to fetch store information',
                    status: response.status
                };
            }

            return {
                success: true,
                data: data.data,
                timestamp: data.timestamp
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to connect to RMZ API'
            };
        }
    }

    /**
     * Verify if API token is valid
     * @param {string} apiToken - The RMZ API token
     * @returns {Promise<boolean>} True if valid, false otherwise
     */
    async verifyToken(apiToken) {
        const result = await this.getStoreInfo(apiToken);
        return result.success;
    }

    /**
     * Get store statistics
     * @param {string} apiToken - The RMZ API token
     * @returns {Promise<object>} Store statistics
     */
    async getStatistics(apiToken) {
        try {
            const response = await fetch(`${this.baseURL}/store/statics`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiToken}`,
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.message || 'Failed to fetch statistics',
                    status: response.status
                };
            }

            return {
                success: true,
                data: data.data,
                timestamp: data.timestamp
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to connect to RMZ API'
            };
        }
    }

    /**
     * Get orders list
     * @param {string} apiToken - The RMZ API token
     * @param {object} params - Query parameters (page, created_from, created_to, orderBy, orderDirection)
     * @returns {Promise<object>} Orders list
     */
    async getOrders(apiToken, params = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.page) queryParams.append('page', params.page);
            if (params.created_from) queryParams.append('created_from', params.created_from);
            if (params.created_to) queryParams.append('created_to', params.created_to);
            if (params.orderBy) queryParams.append('orderBy', params.orderBy);
            if (params.orderDirection) queryParams.append('orderDirection', params.orderDirection);

            const url = `${this.baseURL}/orders${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiToken}`,
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.message || 'Failed to fetch orders',
                    status: response.status
                };
            }

            return {
                success: true,
                data: data.data,
                current_page: data.current_page,
                per_page: data.per_page,
                from: data.from,
                to: data.to,
                next_page_url: data.next_page_url,
                prev_page_url: data.prev_page_url,
                first_page_url: data.first_page_url,
                path: data.path,
                timestamp: data.timestamp
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to connect to RMZ API'
            };
        }
    }

    /**
     * Get order details by ID
     * @param {string} apiToken - The RMZ API token
     * @param {number} orderId - Order ID
     * @returns {Promise<object>} Order details
     */
    async getOrder(apiToken, orderId) {
        try {
            const response = await fetch(`${this.baseURL}/orders/${orderId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiToken}`,
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.message || 'Failed to fetch order details',
                    status: response.status
                };
            }

            return {
                success: true,
                data: data.data,
                timestamp: data.timestamp
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to connect to RMZ API'
            };
        }
    }

    /**
     * Create a new order
     * @param {string} apiToken - The RMZ API token
     * @param {object} orderData - Order data (customer, products, coupon_code, created_from)
     * @returns {Promise<object>} Created order or checkout
     */
    async createOrder(apiToken, orderData) {
        try {
            const response = await fetch(`${this.baseURL}/orders`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiToken}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.message || 'Failed to create order',
                    status: response.status
                };
            }

            return {
                success: true,
                data: data.data,
                message: data.message,
                timestamp: data.timestamp
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to connect to RMZ API'
            };
        }
    }

    /**
     * Update order status
     * @param {string} apiToken - The RMZ API token
     * @param {number} orderId - Order ID
     * @param {number} status - New status (2=shipped, 3=delivered, etc.)
     * @returns {Promise<object>} Update result
     */
    async updateOrder(apiToken, orderId, status) {
        try {
            const response = await fetch(`${this.baseURL}/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${apiToken}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.message || 'Failed to update order',
                    status: response.status
                };
            }

            return {
                success: true,
                data: data.data,
                message: data.message,
                timestamp: data.timestamp
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to connect to RMZ API'
            };
        }
    }

    /**
     * Get products list
     * @param {string} apiToken - The RMZ API token
     * @param {number} page - Page number for pagination
     * @returns {Promise<object>} Products list
     */
    async getProducts(apiToken, page = 1) {
        try {
            const url = `${this.baseURL}/products${page > 1 ? '?page=' + page : ''}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiToken}`,
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.message || 'Failed to fetch products',
                    status: response.status
                };
            }

            // Extract products data and pagination info
            // API returns: { data: { data: [...], current_page, next_page_url, prev_page_url, etc. } }
            const productsData = data.data.data || [];
            
            return {
                success: true,
                data: productsData,
                current_page: data.data.current_page,
                per_page: data.data.per_page,
                from: data.data.from,
                to: data.data.to,
                next_page_url: data.data.next_page_url,
                prev_page_url: data.data.prev_page_url,
                first_page_url: data.data.first_page_url,
                path: data.data.path,
                timestamp: data.timestamp
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to connect to RMZ API'
            };
        }
    }

    /**
     * Get all products across all pages
     * @param {string} apiToken - The RMZ API token
     * @returns {Promise<object>} All products
     */
    async getAllProducts(apiToken) {
        try {
            let allProducts = [];
            let currentPage = 1;
            let hasMorePages = true;

            while (hasMorePages) {
                const result = await this.getProducts(apiToken, currentPage);
                
                if (!result.success) {
                    return result;
                }

                allProducts = allProducts.concat(result.data);
                
                // Check if there's a next page
                hasMorePages = result.next_page_url ? true : false;
                currentPage++;
                
                // Safety limit to prevent infinite loops
                if (currentPage > 100) {
                    break;
                }
            }

            return {
                success: true,
                data: allProducts,
                total: allProducts.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to fetch all products'
            };
        }
    }

    /**
     * Get product details by ID
     * @param {string} apiToken - The RMZ API token
     * @param {number} productId - Product ID
     * @returns {Promise<object>} Product details
     */
    async getProduct(apiToken, productId) {
        try {
            const response = await fetch(`${this.baseURL}/products/${productId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiToken}`,
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.message || 'Failed to fetch product details',
                    status: response.status
                };
            }

            return {
                success: true,
                data: data.data,
                timestamp: data.timestamp
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to connect to RMZ API'
            };
        }
    }

    /**
     * Get categories list
     * @param {string} apiToken - The RMZ API token
     * @param {number} page - Page number for pagination
     * @returns {Promise<object>} Categories list
     */
    async getCategories(apiToken, page = 1) {
        try {
            const url = `${this.baseURL}/categories${page > 1 ? '?page=' + page : ''}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiToken}`,
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.message || 'Failed to fetch categories',
                    status: response.status
                };
            }

            // Extract categories data and pagination info (same structure as products)
            const categoriesData = data.data.data || [];
            
            return {
                success: true,
                data: categoriesData,
                current_page: data.data.current_page,
                per_page: data.data.per_page,
                from: data.data.from,
                to: data.data.to,
                next_page_url: data.data.next_page_url,
                prev_page_url: data.data.prev_page_url,
                first_page_url: data.data.first_page_url,
                path: data.data.path,
                timestamp: data.timestamp
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to connect to RMZ API'
            };
        }
    }

    /**
     * Get subscriptions list
     * @param {string} apiToken - The RMZ API token
     * @param {object} params - Query parameters (page, customerEmail, customerCountryCode, customerPhone)
     * @returns {Promise<object>} Subscriptions list
     */
    async getSubscriptions(apiToken, params = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.page) queryParams.append('page', params.page);
            if (params.customerEmail) queryParams.append('customerEmail', params.customerEmail);
            if (params.customerCountryCode) queryParams.append('customerCountryCode', params.customerCountryCode);
            if (params.customerPhone) queryParams.append('customerPhone', params.customerPhone);

            const url = `${this.baseURL}/subscriptions${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiToken}`,
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.message || 'Failed to fetch subscriptions',
                    status: response.status
                };
            }

            const subscriptionsData = data.data.data || [];
            
            return {
                success: true,
                data: subscriptionsData,
                current_page: data.data.current_page,
                per_page: data.data.per_page,
                from: data.data.from,
                to: data.data.to,
                next_page_url: data.data.next_page_url,
                prev_page_url: data.data.prev_page_url,
                first_page_url: data.data.first_page_url,
                path: data.data.path,
                timestamp: data.timestamp
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to connect to RMZ API'
            };
        }
    }

    /**
     * Get subscription details by ID
     * @param {string} apiToken - The RMZ API token
     * @param {number} subscriptionId - Subscription ID
     * @returns {Promise<object>} Subscription details
     */
    async getSubscription(apiToken, subscriptionId) {
        try {
            const response = await fetch(`${this.baseURL}/subscriptions/${subscriptionId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiToken}`,
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.message || 'Failed to fetch subscription details',
                    status: response.status
                };
            }

            return {
                success: true,
                data: data.data,
                timestamp: data.timestamp
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to connect to RMZ API'
            };
        }
    }
}

module.exports = RMZ;
