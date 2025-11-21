'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { texasCurriculum, CurriculumTopic } from '@/lib/curriculum';

export default function Home() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    topic: 'Science' as CurriculumTopic,
    concept: 'Force, Motion & Energy',
    gradeLevel: '4th',
    contentAngle: 'time-saver',
  });

  const [availableConcepts, setAvailableConcepts] = useState<string[]>(
    texasCurriculum['Science']
  );

  const [customConcept, setCustomConcept] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Update available concepts when topic changes
  useEffect(() => {
    const concepts = texasCurriculum[formData.topic as CurriculumTopic];
    setAvailableConcepts(concepts);
    // Set the first concept as default when topic changes
    setFormData(prev => ({ ...prev, concept: concepts[0] }));
    setShowCustomInput(false);
    setCustomConcept('');
  }, [formData.topic]);

  // Get the actual concept to use (custom or selected)
  const getActiveConcept = () => {
    return showCustomInput && customConcept ? customConcept : formData.concept;
  };

  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [editingPlatform, setEditingPlatform] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<Record<string, string>>({});
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  const getPostContent = (platform: 'linkedin' | 'reddit' | 'facebook' | 'twitter') => {
    if (!generatedContent) return '';

    // Check if there's edited content for this platform and language
    const editKey = `${platform}_${language}`;
    if (editedContent[editKey]) {
      return editedContent[editKey];
    }

    if (language === 'es') {
      const spanishKey = `${platform}PostEs` as keyof typeof generatedContent;
      return generatedContent[spanishKey] || generatedContent[`${platform}Post`];
    }

    return generatedContent[`${platform}Post`];
  };

  const handleEdit = (platform: string) => {
    setEditingPlatform(platform);
  };

  const handleSaveEdit = (platform: string, content: string) => {
    const editKey = `${platform}_${language}`;
    setEditedContent(prev => ({ ...prev, [editKey]: content }));
    setEditingPlatform(null);
    setSavedStatus(platform);
    setTimeout(() => setSavedStatus(null), 2000);
  };

  const handleCancelEdit = () => {
    setEditingPlatform(null);
  };

  const handleCopy = (platform: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPlatform(platform);
    setTimeout(() => setCopiedPlatform(null), 2000);
  };

  const handleShare = (platform: string, text: string) => {
    // First, always copy content to clipboard for manual pasting
    navigator.clipboard.writeText(text).then(() => {
      setCopiedPlatform(platform);
      setTimeout(() => setCopiedPlatform(null), 2000);
    });

    const encodedText = encodeURIComponent(text);
    const baseUrl = encodeURIComponent('https://accelerating-success.com');
    let shareUrl = '';

    switch (platform) {
      case 'linkedin':
        // LinkedIn - Direct to post creation (opens share modal)
        // Note: LinkedIn doesn't support pre-filled text via URL, content is in clipboard
        shareUrl = 'https://www.linkedin.com/feed/?shareActive=true';
        break;
      case 'twitter':
        // Twitter - Direct to compose with pre-filled text
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
        break;
      case 'facebook':
        // Facebook - Opens composer for personal profile
        // Note: Modern Facebook doesn't support pre-filled text, content is in clipboard
        shareUrl = 'https://www.facebook.com/?sk=h_chr';
        break;
      case 'reddit':
        // Reddit - Direct to submit page with title and text filled
        const redditTitle = text.split('\n')[0]; // First line as title
        const redditBody = text.split('\n').slice(1).join('\n'); // Rest as body
        shareUrl = `https://reddit.com/submit?title=${encodeURIComponent(redditTitle)}&selftext=${encodeURIComponent(redditBody)}`;
        break;
      case 'pinterest':
        // Pinterest - Direct to pin creation builder
        shareUrl = 'https://www.pinterest.com/pin-builder/';
        break;
      case 'tumblr':
        // Tumblr - Direct to new text post page
        // Content is in clipboard for user to paste
        shareUrl = 'https://www.tumblr.com/new/text';
        break;
      case 'blogger':
        // Blogger - Direct to Blogger dashboard (user selects blog then creates post)
        // Content is in clipboard for user to paste
        setTimeout(() => {
          window.open('https://www.blogger.com/', '_blank');
        }, 100);
        return;
    }

    if (shareUrl) {
      // Small delay to ensure clipboard operation completes
      setTimeout(() => {
        window.open(shareUrl, '_blank', 'width=800,height=600');
      }, 100);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setGeneratedContent(null);

    try {
      const response = await fetch('/api/test-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          concept: getActiveConcept(), // Use custom concept if provided
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }

      setGeneratedContent(data.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-acs-gray">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header with User Info */}
        <header className="text-center mb-12">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1"></div>
            <div className="flex-1"></div>
            <div className="flex-1 flex justify-end">
              {session?.user && (
                <div className="bg-white rounded-lg shadow-md px-4 py-2 flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-acs-navy">
                      {session.user.name || session.user.email}
                    </p>
                    <p className="text-xs text-acs-gray-medium">
                      {session.user.role}
                    </p>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="px-3 py-1 bg-acs-red hover:bg-acs-red/90 text-white text-sm rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
          <h1 className="text-5xl font-bold text-acs-navy mb-4">
            Accelerating Success
          </h1>
          <h2 className="text-3xl text-acs-blue mb-2">
            AI Content Generator
          </h2>
          <p className="text-acs-gray-medium text-lg">
            Generate engaging content for 7 platforms: LinkedIn, Twitter, Facebook, Reddit, Pinterest, Tumblr & Blogger
          </p>
        </header>

        {/* Generator Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-acs-gray-light">
          <h3 className="text-2xl font-bold text-acs-navy mb-6">Generate Content</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Topic */}
            <div>
              <label className="block text-sm font-medium text-acs-gray-dark mb-2">
                Topic
              </label>
              <select
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value as CurriculumTopic })}
                className="w-full px-4 py-2 border border-acs-gray-light rounded-lg focus:ring-2 focus:ring-acs-navy focus:border-transparent"
              >
              <option value="Science">Science</option>
              <option value="Biology">Biology</option>
            </select>
          </div>

            {/* Concept */}
            <div>
              <label className="block text-sm font-medium text-acs-gray-dark mb-2">
                Specific Concept (Texas TEKS 2025)
              </label>
              <select
                value={showCustomInput ? 'Other' : formData.concept}
                onChange={(e) => {
                  if (e.target.value === 'Other') {
                    setShowCustomInput(true);
                  } else {
                    setShowCustomInput(false);
                    setFormData({ ...formData, concept: e.target.value });
                  }
                }}
                className="w-full px-4 py-2 border border-acs-gray-light rounded-lg focus:ring-2 focus:ring-acs-navy focus:border-transparent"
              >
                {availableConcepts.map((concept) => (
                  <option key={concept} value={concept}>
                    {concept}
                  </option>
                ))}
                <option value="Other">✏️ Other (Type Custom Concept)</option>
              </select>

              {/* Custom Concept Input */}
              {showCustomInput && (
                <div className="mt-2">
                  <input
                    type="text"
                    value={customConcept}
                    onChange={(e) => setCustomConcept(e.target.value)}
                    placeholder="Type your custom concept here..."
                    className="w-full px-4 py-2 border border-acs-blue rounded-lg focus:ring-2 focus:ring-acs-navy focus:border-transparent"
                    autoFocus
                  />
                </div>
              )}
            </div>

            {/* Grade Level */}
            <div>
              <label className="block text-sm font-medium text-acs-gray-dark mb-2">
                Grade Level
              </label>
              <select
                value={formData.gradeLevel}
                onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                className="w-full px-4 py-2 border border-acs-gray-light rounded-lg focus:ring-2 focus:ring-acs-navy focus:border-transparent"
              >
                <option value="3rd">3rd Grade</option>
                <option value="4th">4th Grade</option>
                <option value="5th">5th Grade</option>
                <option value="6th">6th Grade</option>
                <option value="7th">7th Grade</option>
                <option value="8th">8th Grade</option>
              </select>
            </div>

            {/* Content Angle */}
            <div>
              <label className="block text-sm font-medium text-acs-gray-dark mb-2">
                Content Angle
              </label>
              <select
                value={formData.contentAngle}
                onChange={(e) => setFormData({ ...formData, contentAngle: e.target.value })}
                className="w-full px-4 py-2 border border-acs-gray-light rounded-lg focus:ring-2 focus:ring-acs-navy focus:border-transparent"
              >
              <option value="time-saver">Time Saver</option>
              <option value="bilingual support">Bilingual Support</option>
              <option value="student engagement">Student Engagement</option>
              <option value="STAAR prep">STAAR Prep</option>
            </select>
          </div>
        </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-6 w-full bg-acs-red hover:bg-acs-red/90 disabled:bg-acs-gray-medium text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center shadow-md"
          >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Content with AI...
            </>
          ) : (
            '🤖 Generate Content'
          )}
        </button>

          {/* Error Display */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="font-medium">Error:</p>
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Generated Content Preview */}
        {generatedContent && (
          <div className="space-y-6">
            {/* Idea Title & Language Toggle */}
            <div className="bg-gradient-to-r from-acs-navy to-acs-blue text-white rounded-xl shadow-lg p-6 border border-acs-blue-light/20">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">💡 Content Idea</h3>
                  <p className="text-3xl font-extrabold">{generatedContent.ideaTitle}</p>
                </div>

                {/* Language Toggle */}
                <div className="flex items-center bg-white/20 backdrop-blur rounded-lg p-1">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                      language === 'en'
                        ? 'bg-white text-acs-navy shadow-md'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    🇺🇸 English
                  </button>
                  <button
                    onClick={() => setLanguage('es')}
                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                      language === 'es'
                        ? 'bg-white text-acs-navy shadow-md'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    🇪🇸 Español
                  </button>
                </div>
              </div>

              <div className="mt-2 text-sm bg-white/10 backdrop-blur rounded-lg px-3 py-2 inline-block">
                Viewing: <strong>{language === 'en' ? 'English Version' : 'Versión en Español'}</strong>
              </div>
            </div>

            {/* Share Instructions Banner */}
            <div className="bg-gradient-to-r from-acs-blue/10 to-acs-navy/10 border-l-4 border-acs-blue rounded-lg p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="text-2xl">💡</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-acs-navy mb-1">How to Share Your Content</h4>
                  <p className="text-sm text-acs-gray-dark leading-relaxed">
                    <strong>✅ Auto-filled:</strong> Twitter and Reddit open with your content pre-filled - just review and post! <br/>
                    <strong>📋 Copy & Paste:</strong> LinkedIn, Facebook, Pinterest, Tumblr, and Blogger automatically copy content to your clipboard - paste when the page opens. <br/>
                    <span className="text-acs-blue font-medium">💡 Tip: All platforms copy to clipboard for backup. Use the "Copy" button anytime.</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Platform Posts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* LinkedIn */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-acs-navy">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-acs-navy text-white rounded-lg p-2 mr-3">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-acs-gray-dark">LinkedIn</h4>
                  </div>
                  <div className="flex gap-2">
                    {editingPlatform === 'linkedin' ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit('linkedin', (document.getElementById('linkedin-edit') as HTMLTextAreaElement)?.value)}
                          className="px-3 py-1 bg-acs-green hover:bg-acs-green/90 rounded-lg text-sm font-medium text-white transition-colors shadow-sm"
                        >
                          ✓ Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1 bg-acs-gray hover:bg-acs-gray-light rounded-lg text-sm font-medium text-acs-gray-dark transition-colors"
                        >
                          ✕ Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit('linkedin')}
                          className="px-3 py-1 bg-acs-blue hover:bg-acs-blue/90 rounded-lg text-sm font-medium text-white transition-colors shadow-sm"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleCopy('linkedin', getPostContent('linkedin'))}
                          className="px-3 py-1 bg-acs-gray hover:bg-acs-gray-light rounded-lg text-sm font-medium text-acs-gray-dark transition-colors"
                        >
                          {copiedPlatform === 'linkedin' ? '✓ Copied!' : '📋 Copy'}
                        </button>
                        <button
                          onClick={() => handleShare('linkedin', getPostContent('linkedin'))}
                          className="px-3 py-1 bg-acs-red hover:bg-acs-red/90 rounded-lg text-sm font-medium text-white transition-colors shadow-sm"
                        >
                          {copiedPlatform === 'linkedin' ? '✓ Copied & Opening...' : '🔗 Share'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {savedStatus === 'linkedin' && (
                  <div className="mb-2 text-sm text-acs-green font-medium">✓ Saved successfully!</div>
                )}
                <div className="prose prose-sm max-w-none">
                  {editingPlatform === 'linkedin' ? (
                    <textarea
                      id="linkedin-edit"
                      defaultValue={getPostContent('linkedin')}
                      className="w-full min-h-[200px] px-4 py-3 border border-acs-gray-light rounded-lg focus:ring-2 focus:ring-acs-navy focus:border-transparent font-sans text-acs-gray-dark resize-y"
                    />
                  ) : (
                    <pre className="whitespace-pre-wrap font-sans text-acs-gray-dark bg-acs-gray p-4 rounded-lg">
                      {getPostContent('linkedin')}
                    </pre>
                  )}
                </div>
              </div>

              {/* Reddit */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-acs-orange">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-acs-orange text-white rounded-lg p-2 mr-3">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-acs-gray-dark">Reddit</h4>
                  </div>
                  <div className="flex gap-2">
                    {editingPlatform === 'reddit' ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit('reddit', (document.getElementById('reddit-edit') as HTMLTextAreaElement)?.value)}
                          className="px-3 py-1 bg-acs-green hover:bg-acs-green/90 rounded-lg text-sm font-medium text-white transition-colors shadow-sm"
                        >
                          ✓ Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1 bg-acs-gray hover:bg-acs-gray-light rounded-lg text-sm font-medium text-acs-gray-dark transition-colors"
                        >
                          ✕ Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit('reddit')}
                          className="px-3 py-1 bg-acs-blue hover:bg-acs-blue/90 rounded-lg text-sm font-medium text-white transition-colors shadow-sm"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleCopy('reddit', getPostContent('reddit'))}
                          className="px-3 py-1 bg-acs-gray hover:bg-acs-gray-light rounded-lg text-sm font-medium text-acs-gray-dark transition-colors"
                        >
                          {copiedPlatform === 'reddit' ? '✓ Copied!' : '📋 Copy'}
                        </button>
                        <button
                          onClick={() => handleShare('reddit', getPostContent('reddit'))}
                          className="px-3 py-1 bg-acs-red hover:bg-acs-red/90 rounded-lg text-sm font-medium text-white transition-colors shadow-sm"
                        >
                          {copiedPlatform === 'reddit' ? '✓ Copied & Opening...' : '🔗 Share'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {savedStatus === 'reddit' && (
                  <div className="mb-2 text-sm text-acs-green font-medium">✓ Saved successfully!</div>
                )}
                <div className="prose prose-sm max-w-none">
                  {editingPlatform === 'reddit' ? (
                    <textarea
                      id="reddit-edit"
                      defaultValue={getPostContent('reddit')}
                      className="w-full min-h-[200px] px-4 py-3 border border-acs-gray-light rounded-lg focus:ring-2 focus:ring-acs-navy focus:border-transparent font-sans text-acs-gray-dark resize-y"
                    />
                  ) : (
                    <pre className="whitespace-pre-wrap font-sans text-acs-gray-dark bg-acs-gray p-4 rounded-lg">
                      {getPostContent('reddit')}
                    </pre>
                  )}
                </div>
              </div>

              {/* Facebook */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-acs-blue">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-acs-blue text-white rounded-lg p-2 mr-3">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-acs-gray-dark">Facebook</h4>
                  </div>
                  <div className="flex gap-2">
                    {editingPlatform === 'facebook' ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit('facebook', (document.getElementById('facebook-edit') as HTMLTextAreaElement)?.value)}
                          className="px-3 py-1 bg-acs-green hover:bg-acs-green/90 rounded-lg text-sm font-medium text-white transition-colors shadow-sm"
                        >
                          ✓ Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1 bg-acs-gray hover:bg-acs-gray-light rounded-lg text-sm font-medium text-acs-gray-dark transition-colors"
                        >
                          ✕ Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit('facebook')}
                          className="px-3 py-1 bg-acs-blue hover:bg-acs-blue/90 rounded-lg text-sm font-medium text-white transition-colors shadow-sm"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleCopy('facebook', getPostContent('facebook'))}
                          className="px-3 py-1 bg-acs-gray hover:bg-acs-gray-light rounded-lg text-sm font-medium text-acs-gray-dark transition-colors"
                        >
                          {copiedPlatform === 'facebook' ? '✓ Copied!' : '📋 Copy'}
                        </button>
                        <button
                          onClick={() => handleShare('facebook', getPostContent('facebook'))}
                          className="px-3 py-1 bg-acs-red hover:bg-acs-red/90 rounded-lg text-sm font-medium text-white transition-colors shadow-sm"
                        >
                          {copiedPlatform === 'facebook' ? '✓ Copied & Opening...' : '🔗 Share'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {savedStatus === 'facebook' && (
                  <div className="mb-2 text-sm text-acs-green font-medium">✓ Saved successfully!</div>
                )}
                <div className="prose prose-sm max-w-none">
                  {editingPlatform === 'facebook' ? (
                    <textarea
                      id="facebook-edit"
                      defaultValue={getPostContent('facebook')}
                      className="w-full min-h-[200px] px-4 py-3 border border-acs-gray-light rounded-lg focus:ring-2 focus:ring-acs-navy focus:border-transparent font-sans text-acs-gray-dark resize-y"
                    />
                  ) : (
                    <pre className="whitespace-pre-wrap font-sans text-acs-gray-dark bg-acs-gray p-4 rounded-lg">
                      {getPostContent('facebook')}
                    </pre>
                  )}
                </div>
              </div>

              {/* Twitter */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-acs-gray-dark">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-acs-gray-dark text-white rounded-lg p-2 mr-3">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-acs-gray-dark">Twitter/X</h4>
                  </div>
                  <div className="flex gap-2">
                    {editingPlatform === 'twitter' ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit('twitter', (document.getElementById('twitter-edit') as HTMLTextAreaElement)?.value)}
                          className="px-3 py-1 bg-acs-green hover:bg-acs-green/90 rounded-lg text-sm font-medium text-white transition-colors shadow-sm"
                        >
                          ✓ Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1 bg-acs-gray hover:bg-acs-gray-light rounded-lg text-sm font-medium text-acs-gray-dark transition-colors"
                        >
                          ✕ Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit('twitter')}
                          className="px-3 py-1 bg-acs-blue hover:bg-acs-blue/90 rounded-lg text-sm font-medium text-white transition-colors shadow-sm"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleCopy('twitter', getPostContent('twitter'))}
                          className="px-3 py-1 bg-acs-gray hover:bg-acs-gray-light rounded-lg text-sm font-medium text-acs-gray-dark transition-colors"
                        >
                          {copiedPlatform === 'twitter' ? '✓ Copied!' : '📋 Copy'}
                        </button>
                        <button
                          onClick={() => handleShare('twitter', getPostContent('twitter'))}
                          className="px-3 py-1 bg-acs-red hover:bg-acs-red/90 rounded-lg text-sm font-medium text-white transition-colors shadow-sm"
                        >
                          {copiedPlatform === 'twitter' ? '✓ Copied & Opening...' : '🔗 Share'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {savedStatus === 'twitter' && (
                  <div className="mb-2 text-sm text-acs-green font-medium">✓ Saved successfully!</div>
                )}
                <div className="prose prose-sm max-w-none">
                  {editingPlatform === 'twitter' ? (
                    <textarea
                      id="twitter-edit"
                      defaultValue={getPostContent('twitter')}
                      className="w-full min-h-[200px] px-4 py-3 border border-acs-gray-light rounded-lg focus:ring-2 focus:ring-acs-navy focus:border-transparent font-sans text-acs-gray-dark resize-y"
                    />
                  ) : (
                    <pre className="whitespace-pre-wrap font-sans text-acs-gray-dark bg-acs-gray p-4 rounded-lg">
                      {getPostContent('twitter')}
                    </pre>
                  )}
                </div>
              </div>

              {/* Pinterest */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-600">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-red-600 text-white rounded-lg p-2 mr-3">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-acs-gray-dark">Pinterest</h4>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy('pinterest', getPostContent('twitter'))}
                      className="px-3 py-1 bg-acs-gray hover:bg-acs-gray-light rounded-lg text-sm font-medium text-acs-gray-dark transition-colors"
                    >
                      {copiedPlatform === 'pinterest' ? '✓ Copied!' : '📋 Copy'}
                    </button>
                    <button
                      onClick={() => handleShare('pinterest', getPostContent('twitter'))}
                      className="px-3 py-1 bg-acs-red hover:bg-acs-red/90 rounded-lg text-sm font-medium text-white transition-colors shadow-sm"
                    >
                      {copiedPlatform === 'pinterest' ? '✓ Copied & Opening...' : '📌 Pin'}
                    </button>
                  </div>
                </div>
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-acs-gray-dark bg-acs-gray p-4 rounded-lg">
                    {getPostContent('twitter')}
                  </pre>
                </div>
              </div>

              {/* Tumblr */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-indigo-700 text-white rounded-lg p-2 mr-3">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.563 24c-5.093 0-7.031-3.756-7.031-6.411V9.747H5.116V6.648c3.63-1.313 4.512-4.596 4.71-6.469C9.84.051 9.941 0 9.999 0h3.517v6.114h4.801v3.633h-4.82v7.47c.016 1.001.375 2.371 2.207 2.371h.09c.631-.02 1.486-.205 1.936-.419l1.156 3.425c-.436.636-2.4 1.374-4.156 1.404h-.178l.011.002z"/>
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-acs-gray-dark">Tumblr</h4>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy('tumblr', getPostContent('linkedin'))}
                      className="px-3 py-1 bg-acs-gray hover:bg-acs-gray-light rounded-lg text-sm font-medium text-acs-gray-dark transition-colors"
                    >
                      {copiedPlatform === 'tumblr' ? '✓ Copied!' : '📋 Copy'}
                    </button>
                    <button
                      onClick={() => handleShare('tumblr', getPostContent('linkedin'))}
                      className="px-3 py-1 bg-indigo-700 hover:bg-indigo-800 rounded-lg text-sm font-medium text-white transition-colors shadow-sm"
                    >
                      {copiedPlatform === 'tumblr' ? '✓ Copied & Opening...' : '🔗 Share'}
                    </button>
                  </div>
                </div>
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-acs-gray-dark bg-acs-gray p-4 rounded-lg">
                    {getPostContent('linkedin')}
                  </pre>
                </div>
              </div>

              {/* Blogger */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-orange-500 text-white rounded-lg p-2 mr-3">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21.976 24H2.026C.9 24 0 23.1 0 21.976V2.026C0 .9.9 0 2.025 0H22.05C23.1 0 24 .9 24 2.025v19.95C24 23.1 23.1 24 21.976 24zM12 3.975H9c-2.775 0-5.025 2.25-5.025 5.025v6c0 2.774 2.25 5.024 5.025 5.024h6c2.774 0 5.024-2.25 5.024-5.024v-3.975c0-.6-.45-1.05-1.05-1.05H18c-.524 0-.976-.45-.976-.975 0-2.776-2.25-5.025-5.024-5.025zm3 10.05H9c-.525 0-.975-.45-.975-.975s.45-.975.975-.975h6c.525 0 .975.45.975.975s-.45.975-.975.975zM10.5 9c0-.525.45-.975.975-.975h1.05c.525 0 .975.45.975.975s-.45.975-.975.975h-1.05c-.525 0-.975-.45-.975-.975z"/>
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-acs-gray-dark">Blogger</h4>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy('blogger', getPostContent('linkedin'))}
                      className="px-3 py-1 bg-acs-gray hover:bg-acs-gray-light rounded-lg text-sm font-medium text-acs-gray-dark transition-colors"
                    >
                      {copiedPlatform === 'blogger' ? '✓ Copied!' : '📋 Copy'}
                    </button>
                    <button
                      onClick={() => handleShare('blogger', getPostContent('linkedin'))}
                      className="px-3 py-1 bg-orange-500 hover:bg-orange-600 rounded-lg text-sm font-medium text-white transition-colors shadow-sm"
                    >
                      {copiedPlatform === 'blogger' ? '✓ Copied & Opening...' : '✍️ Post'}
                    </button>
                  </div>
                </div>
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-acs-gray-dark bg-acs-gray p-4 rounded-lg">
                    {getPostContent('linkedin')}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Footer */}
        {!generatedContent && !loading && (
          <div className="text-center text-acs-gray-medium mt-12">
            <p className="text-lg">
              ✨ Fill out the form above and click <strong className="text-acs-navy">"Generate Content"</strong> to see AI-powered posts!
            </p>
          </div>
        )}

        {/* Powered by Jufipai */}
        <div className="mt-16 mb-8 flex items-center justify-center gap-3 text-acs-gray-medium">
          <span className="text-sm font-medium">Powered by</span>
          <a
            href="https://jufipai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-900 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-800 hover:to-blue-600 transition-all shadow-md font-bold text-sm hover:scale-105 transform duration-200"
          >
            <img
              src="/jufipai-logo.svg"
              alt="Jufipai"
              className="w-6 h-6"
            />
            Jufipai.com
          </a>
        </div>
      </div>
    </main>
  );
}
