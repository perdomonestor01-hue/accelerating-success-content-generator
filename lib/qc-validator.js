/**
 * Quality Control Validator
 * Validates generated content against user preferences and rules
 *
 * @module qc-validator
 */

class QCValidator {
    constructor(contentStyle) {
        this.contentStyle = contentStyle;
        this.bannedPhrases = contentStyle.writing_rules?.banned_phrases || [];
        this.brandRules = contentStyle.brand || {};
        this.structureRules = contentStyle.content_structure || {};
    }

    /**
     * Validate generated content
     * @param {string} content - Generated content to validate
     * @param {Object} metadata - Content metadata (title, template used, etc.)
     * @returns {Object} { valid: boolean, errors: Array, warnings: Array, score: number }
     */
    validate(content, metadata = {}) {
        const errors = [];
        const warnings = [];
        let score = 100;

        // 1. Check for banned phrases
        const bannedPhraseCheck = this.checkBannedPhrases(content);
        if (bannedPhraseCheck.found.length > 0) {
            errors.push({
                type: 'banned_phrases',
                message: `Found banned phrases: ${bannedPhraseCheck.found.join(', ')}`,
                severity: 'critical',
                locations: bannedPhraseCheck.locations
            });
            score -= 30;
        }

        // 2. Check word count
        const wordCountCheck = this.checkWordCount(content);
        if (!wordCountCheck.valid) {
            warnings.push({
                type: 'word_count',
                message: wordCountCheck.message,
                severity: 'warning',
                current: wordCountCheck.current,
                expected: wordCountCheck.expected
            });
            score -= 10;
        }

        // 3. Check for generic AI phrases
        const genericPhraseCheck = this.checkGenericPhrases(content);
        if (genericPhraseCheck.found.length > 0) {
            warnings.push({
                type: 'generic_phrases',
                message: 'Found generic AI-sounding phrases',
                severity: 'warning',
                found: genericPhraseCheck.found
            });
            score -= 15;
        }

        // 4. Check structure completeness
        const structureCheck = this.checkStructure(content, metadata.template);
        if (!structureCheck.valid) {
            warnings.push({
                type: 'structure',
                message: 'Content structure may be incomplete',
                severity: 'warning',
                missing: structureCheck.missing
            });
            score -= 10;
        }

        // 5. Check for placeholder text
        const placeholderCheck = this.checkPlaceholders(content);
        if (placeholderCheck.found.length > 0) {
            errors.push({
                type: 'placeholders',
                message: 'Found unfilled placeholders',
                severity: 'critical',
                found: placeholderCheck.found
            });
            score -= 40;
        }

        // 6. Check URL validity (if URLs present)
        const urlCheck = this.checkURLs(content);
        if (urlCheck.suspicious.length > 0) {
            warnings.push({
                type: 'urls',
                message: 'Found suspicious URLs (possible AI hallucination)',
                severity: 'warning',
                urls: urlCheck.suspicious
            });
            score -= 20;
        }

        // 7. Check for duplicate headers
        const duplicateCheck = this.checkDuplicateHeaders(content);
        if (duplicateCheck.found.length > 0) {
            warnings.push({
                type: 'duplicate_headers',
                message: 'Found duplicate section headers',
                severity: 'warning',
                duplicates: duplicateCheck.found
            });
            score -= 5;
        }

        // Ensure score doesn't go below 0
        score = Math.max(0, score);

        return {
            valid: errors.length === 0,
            passed: errors.length === 0 && warnings.length === 0,
            score,
            errors,
            warnings,
            summary: this.generateSummary(errors, warnings, score)
        };
    }

    /**
     * Check for banned phrases
     */
    checkBannedPhrases(content) {
        const found = [];
        const locations = [];
        const contentLower = content.toLowerCase();

        for (const phrase of this.bannedPhrases) {
            const phraseLower = phrase.toLowerCase();
            if (contentLower.includes(phraseLower)) {
                found.push(phrase);

                // Find all locations
                let index = contentLower.indexOf(phraseLower);
                while (index !== -1) {
                    locations.push({
                        phrase,
                        position: index,
                        context: content.substring(Math.max(0, index - 30), index + 30)
                    });
                    index = contentLower.indexOf(phraseLower, index + 1);
                }
            }
        }

        return { found, locations };
    }

    /**
     * Check word count
     */
    checkWordCount(content) {
        const wordCount = content.split(/\s+/).length;
        const min = this.structureRules.word_count?.min || 500;
        const max = this.structureRules.word_count?.max || 1000;

        if (wordCount < min) {
            return {
                valid: false,
                message: `Content too short (${wordCount} words, minimum ${min})`,
                current: wordCount,
                expected: { min, max }
            };
        }

        if (wordCount > max) {
            return {
                valid: false,
                message: `Content too long (${wordCount} words, maximum ${max})`,
                current: wordCount,
                expected: { min, max }
            };
        }

        return { valid: true, current: wordCount, expected: { min, max } };
    }

    /**
     * Check for generic AI phrases
     */
    checkGenericPhrases(content) {
        const genericPhrases = [
            'as an ai',
            'i am an ai',
            'i cannot',
            'i apologize',
            'it is important to note',
            'it should be noted',
            'additionally',
            'furthermore',
            'moreover',
            'in summary',
            'in other words'
        ];

        const found = [];
        const contentLower = content.toLowerCase();

        for (const phrase of genericPhrases) {
            if (contentLower.includes(phrase)) {
                found.push(phrase);
            }
        }

        return { found };
    }

    /**
     * Check structure completeness
     */
    checkStructure(content, templateName) {
        // Basic structure checks
        const hasHeaders = /<h[1-3]|##|###/.test(content);
        const hasParagraphs = content.split('\n\n').length > 2;
        const hasContent = content.length > 200;

        const missing = [];
        if (!hasHeaders) missing.push('headers');
        if (!hasParagraphs) missing.push('paragraphs');
        if (!hasContent) missing.push('sufficient content');

        return {
            valid: missing.length === 0,
            missing
        };
    }

    /**
     * Check for unfilled placeholders
     */
    checkPlaceholders(content) {
        const placeholderPatterns = [
            /\[YOUR_[A-Z_]+\]/g,
            /\[INSERT_[A-Z_]+\]/g,
            /\[FILL_[A-Z_]+\]/g,
            /\[TODO[^\]]*\]/g,
            /\{\{[^}]+\}\}/g,
            /<PLACEHOLDER>/gi
        ];

        const found = [];

        for (const pattern of placeholderPatterns) {
            const matches = content.match(pattern);
            if (matches) {
                found.push(...matches);
            }
        }

        return { found: [...new Set(found)] }; // Remove duplicates
    }

    /**
     * Check URLs for common AI hallucination patterns
     */
    checkURLs(content) {
        const urlPattern = /https?:\/\/[^\s<>"]+/g;
        const urls = content.match(urlPattern) || [];
        const suspicious = [];

        for (const url of urls) {
            // Check for common hallucination patterns
            if (
                url.includes('example.com') ||
                url.includes('yourdomain.com') ||
                url.includes('yoursite.com') ||
                url.match(/\/en\/(?:en|us|gb)\//) || // Duplicate language codes
                url.includes('undefined') ||
                url.includes('null')
            ) {
                suspicious.push(url);
            }
        }

        return { all: urls, suspicious };
    }

    /**
     * Check for duplicate headers
     */
    checkDuplicateHeaders(content) {
        const headerPattern = /(?:^|\n)(#{1,3})\s+(.+?)(?:\n|$)|<h[1-3][^>]*>(.+?)<\/h[1-3]>/gi;
        const headers = [];
        const found = [];

        let match;
        while ((match = headerPattern.exec(content)) !== null) {
            const headerText = (match[2] || match[3] || '').trim().toLowerCase();
            if (headers.includes(headerText)) {
                found.push(headerText);
            } else {
                headers.push(headerText);
            }
        }

        return { found: [...new Set(found)] };
    }

    /**
     * Generate validation summary
     */
    generateSummary(errors, warnings, score) {
        if (errors.length === 0 && warnings.length === 0) {
            return `✅ PASSED - Content quality score: ${score}/100`;
        }

        if (errors.length > 0) {
            return `❌ FAILED - ${errors.length} critical error(s), ${warnings.length} warning(s) - Score: ${score}/100`;
        }

        return `⚠️  PASSED WITH WARNINGS - ${warnings.length} warning(s) - Score: ${score}/100`;
    }

    /**
     * Get detailed validation report
     */
    getReport(validationResult) {
        console.log('\n📋 Content Quality Validation Report\n');
        console.log('═'.repeat(60));
        console.log(`Score: ${validationResult.score}/100`);
        console.log(`Status: ${validationResult.summary}`);
        console.log('═'.repeat(60));

        if (validationResult.errors.length > 0) {
            console.log('\n❌ ERRORS (Critical):');
            for (const error of validationResult.errors) {
                console.log(`\n  ${error.type.toUpperCase()}`);
                console.log(`  ${error.message}`);
                if (error.found) {
                    console.log(`  Found: ${error.found.join(', ')}`);
                }
            }
        }

        if (validationResult.warnings.length > 0) {
            console.log('\n⚠️  WARNINGS:');
            for (const warning of validationResult.warnings) {
                console.log(`\n  ${warning.type.toUpperCase()}`);
                console.log(`  ${warning.message}`);
                if (warning.found) {
                    console.log(`  Found: ${JSON.stringify(warning.found)}`);
                }
            }
        }

        if (validationResult.passed) {
            console.log('\n✅ All checks passed!');
        }

        console.log('\n' + '═'.repeat(60) + '\n');

        return validationResult;
    }
}

module.exports = QCValidator;
