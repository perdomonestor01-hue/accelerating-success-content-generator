/**
 * Central Data Bridge
 *
 * Universal data access layer that connects ALL content creator projects
 * to the single-source-of-truth central data repository.
 *
 * Location: /Users/fabienp/agents/content-creator-lib/lib/data-bridge.js
 * Central Data: /Users/fabienp/.claude/knowledge/data/
 * Central Templates: /Users/fabienp/.claude/knowledge/templates/
 */

import fs from 'fs';
import path from 'path';

const CENTRAL_DATA_PATH = '/Users/fabienp/.claude/knowledge/data';
const CENTRAL_TEMPLATES_PATH = '/Users/fabienp/.claude/knowledge/templates';

/**
 * Load central coaster database
 * @returns {Object} Coaster database with metadata
 */
export function loadCentralCoasterDatabase() {
    const filePath = path.join(CENTRAL_DATA_PATH, 'verified-coaster-specs.json');

    try {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(rawData);
        console.log('✅ Loaded central coaster database:', data.metadata?.version || 'unknown version');
        return data;
    } catch (error) {
        console.error('❌ Failed to load central coaster database:', error.message);
        console.error('   Expected path:', filePath);
        return { coasters: {}, metadata: { error: error.message } };
    }
}

/**
 * Load central tech specs database (DJI, AirPods, cameras, etc.)
 * @returns {Object} Tech specs database
 */
export function loadCentralTechSpecs() {
    const filePath = path.join(CENTRAL_DATA_PATH, 'verified-tech-specs.json');

    try {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(rawData);
        console.log('✅ Loaded central tech specs:', data.metadata?.version || 'unknown version');
        return data;
    } catch (error) {
        console.warn('⚠️ Central tech specs not found (not yet created):', error.message);
        return { products: {}, metadata: {} };
    }
}

/**
 * Load central locations database (theme parks, cities, venues)
 * @returns {Object} Locations database
 */
export function loadCentralLocations() {
    const filePath = path.join(CENTRAL_DATA_PATH, 'verified-locations.json');

    try {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(rawData);
        console.log('✅ Loaded central locations:', data.metadata?.version || 'unknown version');
        return data;
    } catch (error) {
        console.warn('⚠️ Central locations not found (not yet created):', error.message);
        return { locations: {}, metadata: {} };
    }
}

/**
 * Load a central template
 * @param {string} templateName - Template name (e.g., 'titan-style', 'review-style')
 * @returns {Object} Template configuration
 */
export function loadCentralTemplate(templateName) {
    // Add .json extension if not present
    const fileName = templateName.endsWith('.json') ? templateName : `${templateName}.json`;
    const filePath = path.join(CENTRAL_TEMPLATES_PATH, fileName);

    try {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const template = JSON.parse(rawData);
        console.log(`✅ Loaded central template: ${template.name || templateName}`);
        return template;
    } catch (error) {
        console.error(`❌ Failed to load central template "${templateName}":`, error.message);
        console.error('   Expected path:', filePath);
        return null;
    }
}

/**
 * List all available central templates
 * @returns {Array<string>} Array of template names (without .json extension)
 */
export function listCentralTemplates() {
    try {
        const files = fs.readdirSync(CENTRAL_TEMPLATES_PATH);
        const templates = files
            .filter(f => f.endsWith('.json'))
            .map(f => f.replace('.json', ''));

        console.log(`✅ Found ${templates.length} central templates:`, templates.join(', '));
        return templates;
    } catch (error) {
        console.error('❌ Failed to list central templates:', error.message);
        return [];
    }
}

/**
 * Get metadata about all central data sources
 * @returns {Object} Status of each data source
 */
export function getCentralDataStatus() {
    const status = {
        coasters: checkDataFile('verified-coaster-specs.json'),
        techSpecs: checkDataFile('verified-tech-specs.json'),
        locations: checkDataFile('verified-locations.json'),
        templates: {
            path: CENTRAL_TEMPLATES_PATH,
            exists: fs.existsSync(CENTRAL_TEMPLATES_PATH),
            count: fs.existsSync(CENTRAL_TEMPLATES_PATH)
                ? fs.readdirSync(CENTRAL_TEMPLATES_PATH).filter(f => f.endsWith('.json')).length
                : 0
        }
    };

    return status;
}

/**
 * Helper: Check if a data file exists
 * @private
 */
function checkDataFile(fileName) {
    const filePath = path.join(CENTRAL_DATA_PATH, fileName);
    const exists = fs.existsSync(filePath);

    let metadata = {};
    if (exists) {
        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            metadata = data.metadata || {};
        } catch (error) {
            metadata.error = error.message;
        }
    }

    return {
        path: filePath,
        exists,
        metadata
    };
}

/**
 * Search for a specific item in a data source
 * @param {string} dataSource - 'coasters', 'techSpecs', 'locations'
 * @param {string} searchTerm - Term to search for (case-insensitive)
 * @returns {Array<Object>} Array of matching items
 */
export function searchCentralData(dataSource, searchTerm) {
    let data;

    switch (dataSource) {
        case 'coasters':
            data = loadCentralCoasterDatabase().coasters || {};
            break;
        case 'techSpecs':
            data = loadCentralTechSpecs().products || {};
            break;
        case 'locations':
            data = loadCentralLocations().locations || {};
            break;
        default:
            console.error(`❌ Unknown data source: ${dataSource}`);
            return [];
    }

    const searchLower = searchTerm.toLowerCase();
    const results = [];

    for (const [key, item] of Object.entries(data)) {
        const itemString = JSON.stringify(item).toLowerCase();
        if (itemString.includes(searchLower)) {
            results.push({ id: key, ...item });
        }
    }

    console.log(`🔍 Found ${results.length} matches for "${searchTerm}" in ${dataSource}`);
    return results;
}

/**
 * Validate that central data is accessible
 * Useful for deployment checks and health monitoring
 * @returns {Object} Validation result
 */
export function validateCentralDataAccess() {
    const result = {
        valid: true,
        errors: [],
        warnings: []
    };

    // Check data directory exists
    if (!fs.existsSync(CENTRAL_DATA_PATH)) {
        result.valid = false;
        result.errors.push(`Central data directory not found: ${CENTRAL_DATA_PATH}`);
    }

    // Check templates directory exists
    if (!fs.existsSync(CENTRAL_TEMPLATES_PATH)) {
        result.valid = false;
        result.errors.push(`Central templates directory not found: ${CENTRAL_TEMPLATES_PATH}`);
    }

    // Check critical data files
    const coasterFile = path.join(CENTRAL_DATA_PATH, 'verified-coaster-specs.json');
    if (!fs.existsSync(coasterFile)) {
        result.warnings.push('Coaster database not found (may not be needed for this project)');
    }

    // Check for at least one template
    if (fs.existsSync(CENTRAL_TEMPLATES_PATH)) {
        const templates = fs.readdirSync(CENTRAL_TEMPLATES_PATH).filter(f => f.endsWith('.json'));
        if (templates.length === 0) {
            result.warnings.push('No templates found in central repository');
        }
    }

    return result;
}

export default {
    loadCentralCoasterDatabase,
    loadCentralTechSpecs,
    loadCentralLocations,
    loadCentralTemplate,
    listCentralTemplates,
    getCentralDataStatus,
    searchCentralData,
    validateCentralDataAccess
};
