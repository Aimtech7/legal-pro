// Accessibility testing utilities for LegalPro v1.0.1 - WCAG 2.1 AA Compliant
import { AxeResults } from 'axe-core';

/**
 * Color contrast checker utility
 */
export const checkColorContrast = (foreground: string, background: string): {
  ratio: number;
  wcagAA: boolean;
  wcagAAA: boolean;
} => {
  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Calculate relative luminance
  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);

  if (!fg || !bg) {
    return { ratio: 0, wcagAA: false, wcagAAA: false };
  }

  const fgLum = getLuminance(fg.r, fg.g, fg.b);
  const bgLum = getLuminance(bg.r, bg.g, bg.b);

  const ratio = (Math.max(fgLum, bgLum) + 0.05) / (Math.min(fgLum, bgLum) + 0.05);

  return {
    ratio: Math.round(ratio * 100) / 100,
    wcagAA: ratio >= 4.5,
    wcagAAA: ratio >= 7
  };
};

/**
 * Keyboard navigation tester
 */
export const testKeyboardNavigation = (): Promise<{
  focusableElements: number;
  tabOrder: string[];
  issues: string[];
}> => {
  return new Promise((resolve) => {
    const focusableSelectors = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    const focusableElements = document.querySelectorAll(focusableSelectors);
    const tabOrder: string[] = [];
    const issues: string[] = [];

    // Check for proper tab order
    focusableElements.forEach((element, index) => {
      const tabIndex = element.getAttribute('tabindex');
      const tagName = element.tagName.toLowerCase();
      const id = element.id || `${tagName}-${index}`;
      
      tabOrder.push(id);

      // Check for missing labels
      if (['input', 'textarea', 'select'].includes(tagName)) {
        const label = document.querySelector(`label[for="${element.id}"]`);
        const ariaLabel = element.getAttribute('aria-label');
        const ariaLabelledBy = element.getAttribute('aria-labelledby');
        
        if (!label && !ariaLabel && !ariaLabelledBy) {
          issues.push(`${id}: Missing accessible label`);
        }
      }

      // Check for proper ARIA attributes
      if (element.getAttribute('role') === 'button' && !element.hasAttribute('aria-label')) {
        issues.push(`${id}: Button role without aria-label`);
      }
    });

    resolve({
      focusableElements: focusableElements.length,
      tabOrder,
      issues
    });
  });
};

/**
 * Screen reader content analyzer
 */
export const analyzeScreenReaderContent = (): {
  headings: { level: number; text: string; id?: string }[];
  landmarks: { role: string; label?: string }[];
  images: { alt?: string; decorative: boolean }[];
  links: { text: string; href?: string; external: boolean }[];
  issues: string[];
} => {
  const issues: string[] = [];

  // Analyze headings
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => {
    const level = parseInt(h.tagName.charAt(1));
    const text = h.textContent?.trim() || '';
    const id = h.id;
    
    if (!text) {
      issues.push(`Empty heading: ${h.tagName}`);
    }
    
    return { level, text, id };
  });

  // Check heading hierarchy
  for (let i = 1; i < headings.length; i++) {
    const current = headings[i];
    const previous = headings[i - 1];
    
    if (current.level > previous.level + 1) {
      issues.push(`Heading hierarchy skip: h${previous.level} to h${current.level}`);
    }
  }

  // Analyze landmarks
  const landmarks = Array.from(document.querySelectorAll('[role], main, nav, aside, header, footer')).map(el => {
    const role = el.getAttribute('role') || el.tagName.toLowerCase();
    const label = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby');
    return { role, label };
  });

  // Analyze images
  const images = Array.from(document.querySelectorAll('img, svg')).map(img => {
    const alt = img.getAttribute('alt');
    const ariaHidden = img.getAttribute('aria-hidden') === 'true';
    const decorative = ariaHidden || alt === '';
    
    if (!decorative && !alt) {
      issues.push(`Image missing alt text: ${img.outerHTML.substring(0, 50)}...`);
    }
    
    return { alt: alt || undefined, decorative };
  });

  // Analyze links
  const links = Array.from(document.querySelectorAll('a')).map(link => {
    const text = link.textContent?.trim() || '';
    const href = link.getAttribute('href');
    const external = href?.startsWith('http') || false;
    
    if (!text && !link.getAttribute('aria-label')) {
      issues.push(`Link without accessible text: ${href}`);
    }
    
    if (text.toLowerCase().includes('click here') || text.toLowerCase().includes('read more')) {
      issues.push(`Non-descriptive link text: "${text}"`);
    }
    
    return { text, href: href || undefined, external };
  });

  return { headings, landmarks, images, links, issues };
};

/**
 * ARIA attributes validator
 */
export const validateAriaAttributes = (): {
  validAttributes: number;
  invalidAttributes: string[];
  missingAttributes: string[];
} => {
  const invalidAttributes: string[] = [];
  const missingAttributes: string[] = [];
  let validAttributes = 0;

  // Check all elements with ARIA attributes
  const elementsWithAria = document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby], [aria-expanded], [aria-hidden], [role]');
  
  elementsWithAria.forEach(element => {
    const tagName = element.tagName.toLowerCase();
    
    // Check aria-expanded on interactive elements
    if (element.hasAttribute('aria-expanded')) {
      const expanded = element.getAttribute('aria-expanded');
      if (expanded !== 'true' && expanded !== 'false') {
        invalidAttributes.push(`${tagName}: aria-expanded must be "true" or "false"`);
      } else {
        validAttributes++;
      }
    }

    // Check aria-hidden usage
    if (element.hasAttribute('aria-hidden')) {
      const hidden = element.getAttribute('aria-hidden');
      if (hidden !== 'true' && hidden !== 'false') {
        invalidAttributes.push(`${tagName}: aria-hidden must be "true" or "false"`);
      } else {
        validAttributes++;
      }
    }

    // Check for required ARIA attributes
    const role = element.getAttribute('role');
    if (role === 'button' && !element.hasAttribute('aria-label') && !element.textContent?.trim()) {
      missingAttributes.push(`${tagName}: Button role requires aria-label or text content`);
    }

    if (role === 'dialog' && !element.hasAttribute('aria-labelledby') && !element.hasAttribute('aria-label')) {
      missingAttributes.push(`${tagName}: Dialog role requires aria-labelledby or aria-label`);
    }
  });

  return { validAttributes, invalidAttributes, missingAttributes };
};

/**
 * Comprehensive accessibility audit
 */
export const runAccessibilityAudit = async (): Promise<{
  colorContrast: ReturnType<typeof checkColorContrast>[];
  keyboardNavigation: Awaited<ReturnType<typeof testKeyboardNavigation>>;
  screenReader: ReturnType<typeof analyzeScreenReaderContent>;
  ariaValidation: ReturnType<typeof validateAriaAttributes>;
  summary: {
    totalIssues: number;
    criticalIssues: number;
    score: number;
  };
}> => {
  // Test common color combinations
  const colorTests = [
    { fg: '#1f2937', bg: '#ffffff' }, // text-gray-800 on white
    { fg: '#1e40af', bg: '#ffffff' }, // primary-600 on white
    { fg: '#ffffff', bg: '#1e40af' }, // white on primary-600
    { fg: '#d97706', bg: '#ffffff' }, // gold-600 on white
  ];

  const colorContrast = colorTests.map(test => checkColorContrast(test.fg, test.bg));
  const keyboardNavigation = await testKeyboardNavigation();
  const screenReader = analyzeScreenReaderContent();
  const ariaValidation = validateAriaAttributes();

  // Calculate summary
  const totalIssues = 
    keyboardNavigation.issues.length +
    screenReader.issues.length +
    ariaValidation.invalidAttributes.length +
    ariaValidation.missingAttributes.length;

  const criticalIssues = 
    colorContrast.filter(c => !c.wcagAA).length +
    keyboardNavigation.issues.filter(i => i.includes('Missing accessible label')).length +
    screenReader.issues.filter(i => i.includes('Empty heading') || i.includes('missing alt')).length;

  const score = Math.max(0, 100 - (totalIssues * 5) - (criticalIssues * 10));

  return {
    colorContrast,
    keyboardNavigation,
    screenReader,
    ariaValidation,
    summary: {
      totalIssues,
      criticalIssues,
      score: Math.round(score)
    }
  };
};
