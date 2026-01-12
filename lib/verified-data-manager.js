/**
 * Verified Data Manager
 * Manages verified data sources to prevent AI hallucination
 *
 * @module verified-data-manager
 */

const fs = require('fs').promises;
const path = require('path');

class VerifiedDataManager {
    constructor(dataDir) {
        this.dataDir = dataDir || path.join(process.cwd(), 'data');
        this.cache = new Map();
    }

    /**
     * Load a verified data source
     * @param {string} sourceName - Name of the data source (without .json)
     * @returns {Object|null} Parsed data or null if not found
     */
    async loadSource(sourceName) {
        // Check cache first
        if (this.cache.has(sourceName)) {
            return this.cache.get(sourceName);
        }

        const dataPath = path.join(this.dataDir, `${sourceName}.json`);

        try {
            const data = await fs.readFile(dataPath, 'utf-8');
            const parsed = JSON.parse(data);
            this.cache.set(sourceName, parsed);
            return parsed;
        } catch (error) {
            console.error(`Error loading verified data source '${sourceName}':`, error.message);
            return null;
        }
    }

    /**
     * Save verified data source
     */
    async saveSource(sourceName, data) {
        const dataPath = path.join(this.dataDir, `${sourceName}.json`);
        await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
        this.cache.set(sourceName, data);
        console.log(`✅ Verified data source '${sourceName}' saved`);
    }

    /**
     * Query verified data (generic query by key path)
     * @param {string} sourceName - Data source name
     * @param {string} keyPath - Dot-notation path (e.g., "coasters.titan")
     * @returns {*} Data at key path or null
     */
    async query(sourceName, keyPath) {
        const data = await this.loadSource(sourceName);
        if (!data) return null;

        const keys = keyPath.split('.');
        let result = data;

        for (const key of keys) {
            if (result && typeof result === 'object' && key in result) {
                result = result[key];
            } else {
                return null;
            }
        }

        return result;
    }

    /**
     * Search verified data by field value
     * @param {string} sourceName - Data source name
     * @param {string} searchField - Field to search (e.g., "name")
     * @param {string} searchValue - Value to find
     * @param {string} containerKey - Key containing array/object of items
     * @returns {*} Matching item or null
     */
    async search(sourceName, searchField, searchValue, containerKey = null) {
        const data = await this.loadSource(sourceName);
        if (!data) return null;

        const searchIn = containerKey ? data[containerKey] : data;

        if (Array.isArray(searchIn)) {
            // Search in array
            return searchIn.find(item =>
                item[searchField] &&
                item[searchField].toLowerCase() === searchValue.toLowerCase()
            ) || null;
        } else if (typeof searchIn === 'object') {
            // Search in object values
            for (const [key, value] of Object.entries(searchIn)) {
                if (value[searchField] &&
                    value[searchField].toLowerCase() === searchValue.toLowerCase()) {
                    return value;
                }
            }
        }

        return null;
    }

    /**
     * Get all items from a container
     * @param {string} sourceName - Data source name
     * @param {string} containerKey - Key containing items (optional)
     * @returns {Array|Object} All items
     */
    async getAll(sourceName, containerKey = null) {
        const data = await this.loadSource(sourceName);
        if (!data) return null;

        return containerKey ? data[containerKey] : data;
    }

    /**
     * Validate that required data exists
     * @param {string} sourceName - Data source name
     * @param {Array<string>} requiredKeys - Required keys
     * @returns {Object} { valid: boolean, missing: Array<string> }
     */
    async validate(sourceName, requiredKeys) {
        const data = await this.loadSource(sourceName);
        if (!data) {
            return {
                valid: false,
                missing: requiredKeys,
                error: 'Data source not found'
            };
        }

        const missing = [];

        for (const keyPath of requiredKeys) {
            const value = await this.query(sourceName, keyPath);
            if (value === null || value === undefined) {
                missing.push(keyPath);
            }
        }

        return {
            valid: missing.length === 0,
            missing
        };
    }

    /**
     * Format verified data for AI prompt inclusion
     * @param {string} sourceName - Data source name
     * @param {string} itemKey - Specific item to include (optional)
     * @returns {string} Formatted data for prompt
     */
    async formatForPrompt(sourceName, itemKey = null) {
        const data = itemKey
            ? await this.query(sourceName, itemKey)
            : await this.loadSource(sourceName);

        if (!data) {
            return `[Verified data source '${sourceName}' not available]`;
        }

        return `VERIFIED DATA (DO NOT MODIFY):\n${JSON.stringify(data, null, 2)}\n\nIMPORTANT: Use ONLY the data provided above. DO NOT invent or modify specifications.`;
    }

    /**
     * Create a new verified data source schema
     */
    async createSource(sourceName, schema, initialData = {}) {
        const sourceData = {
            _schema: schema,
            _created: new Date().toISOString(),
            _updated: new Date().toISOString(),
            ...initialData
        };

        await this.saveSource(sourceName, sourceData);
        return sourceData;
    }

    /**
     * Update verified data (with timestamp)
     */
    async updateSource(sourceName, updates) {
        const data = await this.loadSource(sourceName);
        if (!data) {
            throw new Error(`Data source '${sourceName}' not found`);
        }

        const updated = {
            ...data,
            ...updates,
            _updated: new Date().toISOString()
        };

        await this.saveSource(sourceName, updated);
        return updated;
    }

    /**
     * List all available data sources
     */
    async listSources() {
        try {
            const files = await fs.readdir(this.dataDir);
            return files
                .filter(f => f.endsWith('.json'))
                .map(f => f.replace('.json', ''));
        } catch (error) {
            console.error('Error listing data sources:', error.message);
            return [];
        }
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
    }
}

module.exports = VerifiedDataManager;
