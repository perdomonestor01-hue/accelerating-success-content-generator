/**
 * Template Selector
 * Smart template selection based on content keywords and context
 *
 * @module template-selector
 */

class TemplateSelector {
    constructor(contentStyle) {
        this.contentStyle = contentStyle;
        this.templates = contentStyle.template?.available_templates || {};
        this.defaultTemplate = contentStyle.template?.default || 'base';
        this.selectionMethod = contentStyle.template?.selection_rules?.method || 'keyword_scoring';
        this.scoreThreshold = contentStyle.template?.selection_rules?.score_threshold || 1;
    }

    /**
     * Select the best template for given content
     * @param {string} title - Content title
     * @param {string} description - Content description
     * @param {Object} metadata - Additional metadata (tags, category, etc.)
     * @returns {Object} { templateName, score, reason }
     */
    selectTemplate(title, description = '', metadata = {}) {
        if (Object.keys(this.templates).length === 0) {
            return {
                templateName: this.defaultTemplate,
                score: 0,
                reason: 'No templates configured, using default'
            };
        }

        const contentText = `${title} ${description}`.toLowerCase();
        const scores = {};

        // Score each template
        for (const [templateName, templateConfig] of Object.entries(this.templates)) {
            scores[templateName] = this.scoreTemplate(contentText, templateConfig, metadata);
        }

        // Find highest scoring template
        const sortedTemplates = Object.entries(scores)
            .sort((a, b) => b[1].score - a[1].score);

        const [bestTemplate, scoreData] = sortedTemplates[0];

        // Check if score meets threshold
        if (scoreData.score < this.scoreThreshold) {
            return {
                templateName: this.defaultTemplate,
                score: 0,
                reason: `No template met threshold (${this.scoreThreshold}), using fallback`,
                allScores: scores
            };
        }

        return {
            templateName: bestTemplate,
            score: scoreData.score,
            reason: scoreData.reason,
            matchedKeywords: scoreData.matchedKeywords,
            allScores: scores
        };
    }

    /**
     * Score a single template against content
     */
    scoreTemplate(contentText, templateConfig, metadata) {
        let score = 0;
        const matchedKeywords = [];
        const keywords = templateConfig.keywords || [];

        // Keyword matching
        for (const keyword of keywords) {
            if (contentText.includes(keyword.toLowerCase())) {
                score += 1;
                matchedKeywords.push(keyword);
            }
        }

        // Negative keywords (reduce score)
        const negativeKeywords = templateConfig.negative_keywords || [];
        for (const negKeyword of negativeKeywords) {
            if (contentText.includes(negKeyword.toLowerCase())) {
                score -= 2; // Penalize negative matches
            }
        }

        // Priority boost (if defined)
        if (templateConfig.priority) {
            score += templateConfig.priority;
        }

        // Metadata matching (tags, categories)
        if (templateConfig.matching_tags && metadata.tags) {
            const matchingTags = templateConfig.matching_tags.filter(tag =>
                metadata.tags.includes(tag)
            );
            score += matchingTags.length * 2; // Tags are strong signals
        }

        if (templateConfig.matching_categories && metadata.category) {
            if (templateConfig.matching_categories.includes(metadata.category)) {
                score += 3; // Category is very strong signal
            }
        }

        return {
            score,
            matchedKeywords,
            reason: matchedKeywords.length > 0
                ? `Matched keywords: ${matchedKeywords.join(', ')}`
                : 'No keyword matches'
        };
    }

    /**
     * Test template selection with sample inputs
     */
    testSelection(testCases) {
        console.log('🧪 Template Selection Testing\n');

        for (const testCase of testCases) {
            const result = this.selectTemplate(
                testCase.title,
                testCase.description,
                testCase.metadata
            );

            console.log(`📋 Test: "${testCase.title}"`);
            console.log(`   Selected: ${result.templateName} (score: ${result.score})`);
            console.log(`   Reason: ${result.reason}`);

            if (testCase.expected && testCase.expected !== result.templateName) {
                console.log(`   ❌ FAILED: Expected '${testCase.expected}'`);
            } else if (testCase.expected) {
                console.log(`   ✅ PASSED`);
            }

            console.log('');
        }
    }

    /**
     * Get template configuration
     */
    getTemplateConfig(templateName) {
        return this.templates[templateName] || null;
    }

    /**
     * List all available templates
     */
    listTemplates() {
        return Object.keys(this.templates);
    }

    /**
     * Explain why a template was selected
     */
    explainSelection(title, description = '', metadata = {}) {
        const result = this.selectTemplate(title, description, metadata);

        console.log('📊 Template Selection Explanation\n');
        console.log(`Content: "${title}"`);
        console.log(`Selected: ${result.templateName}\n`);
        console.log('Scores by template:');

        for (const [templateName, scoreData] of Object.entries(result.allScores || {})) {
            console.log(`  ${templateName}: ${scoreData.score} - ${scoreData.reason}`);
        }

        console.log(`\nFinal choice: ${result.templateName} (${result.reason})`);

        return result;
    }
}

module.exports = TemplateSelector;
