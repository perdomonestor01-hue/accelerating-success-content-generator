/**
 * Preferences Manager
 * Loads and saves user content preferences for any content creator project
 *
 * @module preferences-manager
 */

const fs = require('fs').promises;
const path = require('path');

class PreferencesManager {
    constructor(projectRoot = process.cwd()) {
        this.projectRoot = projectRoot;
        this.preferencesDir = path.join(projectRoot, '.user-preferences');
        this.templatesDir = path.join(this.preferencesDir, 'templates');
        this.dataDir = path.join(projectRoot, 'data');
    }

    /**
     * Initialize preferences directory structure
     */
    async initialize() {
        await fs.mkdir(this.preferencesDir, { recursive: true });
        await fs.mkdir(this.templatesDir, { recursive: true });
        await fs.mkdir(this.dataDir, { recursive: true });

        // Create default content-style.json if it doesn't exist
        const contentStylePath = path.join(this.preferencesDir, 'content-style.json');
        try {
            await fs.access(contentStylePath);
        } catch {
            await this.createDefaultContentStyle();
        }

        console.log('✅ Preferences structure initialized');
    }

    /**
     * Load content style preferences
     */
    async loadContentStyle() {
        const contentStylePath = path.join(this.preferencesDir, 'content-style.json');
        try {
            const data = await fs.readFile(contentStylePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error loading content style:', error.message);
            return null;
        }
    }

    /**
     * Save content style preferences
     */
    async saveContentStyle(contentStyle) {
        const contentStylePath = path.join(this.preferencesDir, 'content-style.json');
        await fs.writeFile(contentStylePath, JSON.stringify(contentStyle, null, 2));
        console.log('✅ Content style saved');
    }

    /**
     * Load a specific template
     */
    async loadTemplate(templateName) {
        const templatePath = path.join(this.templatesDir, `${templateName}-style.json`);
        try {
            const data = await fs.readFile(templatePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error(`Error loading template ${templateName}:`, error.message);
            return null;
        }
    }

    /**
     * Save a template
     */
    async saveTemplate(templateName, templateData) {
        const templatePath = path.join(this.templatesDir, `${templateName}-style.json`);
        await fs.writeFile(templatePath, JSON.stringify(templateData, null, 2));
        console.log(`✅ Template '${templateName}' saved`);
    }

    /**
     * List all available templates
     */
    async listTemplates() {
        try {
            const files = await fs.readdir(this.templatesDir);
            return files
                .filter(f => f.endsWith('-style.json'))
                .map(f => f.replace('-style.json', ''));
        } catch (error) {
            return [];
        }
    }

    /**
     * Load posting rules
     */
    async loadPostingRules() {
        const rulesPath = path.join(this.preferencesDir, 'posting-rules.json');
        try {
            const data = await fs.readFile(rulesPath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error loading posting rules:', error.message);
            return null;
        }
    }

    /**
     * Save posting rules
     */
    async savePostingRules(rules) {
        const rulesPath = path.join(this.preferencesDir, 'posting-rules.json');
        await fs.writeFile(rulesPath, JSON.stringify(rules, null, 2));
        console.log('✅ Posting rules saved');
    }

    /**
     * Load verified data source (e.g., verified-coaster-specs.json)
     */
    async loadVerifiedData(dataSourceName) {
        const dataPath = path.join(this.dataDir, `${dataSourceName}.json`);
        try {
            const data = await fs.readFile(dataPath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error(`Error loading verified data ${dataSourceName}:`, error.message);
            return null;
        }
    }

    /**
     * Save verified data source
     */
    async saveVerifiedData(dataSourceName, data) {
        const dataPath = path.join(this.dataDir, `${dataSourceName}.json`);
        await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
        console.log(`✅ Verified data '${dataSourceName}' saved`);
    }

    /**
     * Create default content-style.json
     */
    async createDefaultContentStyle() {
        const defaultStyle = {
            voice: {
                personality: "Enthusiastic, knowledgeable, authentic, engaging",
                style: "Like a passionate friend who REALLY knows their stuff",
                approach: "Personal reactions and genuine enthusiasm with technical depth",
                avoid: [
                    "Marketing bot language",
                    "Generic AI phrases",
                    "Corporate speak"
                ]
            },
            brand: {
                name: "YourBrandName",
                handle: "@yourbrand",
                focus: [
                    "Your primary content focus",
                    "Your secondary content focus"
                ],
                target_audience: "Your target audience description",
                website: "yourdomain.com"
            },
            writing_rules: {
                banned_phrases: [
                    "delve",
                    "journey",
                    "landscape",
                    "tapestry",
                    "robust",
                    "check out my latest video",
                    "don't forget to like and subscribe",
                    "embark on",
                    "cutting-edge",
                    "revolutionary",
                    "In conclusion, I hope this helps"
                ],
                good_examples: [],
                bad_examples: []
            },
            content_structure: {
                word_count: {
                    min: 500,
                    max: 800,
                    ideal: 650
                }
            },
            template: {
                default: "base",
                templates_directory: ".user-preferences/templates/",
                available_templates: {},
                selection_rules: {
                    method: "keyword_scoring",
                    score_threshold: 1,
                    fallback: "base"
                }
            }
        };

        await this.saveContentStyle(defaultStyle);
        return defaultStyle;
    }

    /**
     * Get paths for common files
     */
    getPaths() {
        return {
            preferencesDir: this.preferencesDir,
            templatesDir: this.templatesDir,
            dataDir: this.dataDir,
            contentStyle: path.join(this.preferencesDir, 'content-style.json'),
            postingRules: path.join(this.preferencesDir, 'posting-rules.json'),
            styling: path.join(this.preferencesDir, 'styling.json')
        };
    }
}

module.exports = PreferencesManager;
