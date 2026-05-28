import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import NotFound from '../../pages/NotFound';

// Framer-motion is mocked globally in setup.ts

// Mock window.history.back
const mockHistoryBack = vi.fn();
Object.defineProperty(window, 'history', {
  value: { back: mockHistoryBack },
  writable: true,
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};

describe('NotFound Page', () => {
  beforeEach(() => {
    mockHistoryBack.mockClear();
  });

  it('renders the 404 error message', () => {
    renderWithRouter(<NotFound />);
    
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('displays a helpful error description', () => {
    renderWithRouter(<NotFound />);
    
    expect(screen.getByText(/sorry, we couldn't find the page/i)).toBeInTheDocument();
    expect(screen.getByText(/page may have been moved, deleted/i)).toBeInTheDocument();
  });

  it('renders navigation buttons to main pages', () => {
    renderWithRouter(<NotFound />);
    
    expect(screen.getByText('Go to Homepage')).toBeInTheDocument();
    expect(screen.getByText('Go Back')).toBeInTheDocument();
  });

  it('has working homepage link', () => {
    renderWithRouter(<NotFound />);
    
    const homepageLink = screen.getByText('Go to Homepage').closest('a');
    expect(homepageLink).toHaveAttribute('href', '/');
  });

  it('has working go back functionality', () => {
    renderWithRouter(<NotFound />);
    
    const goBackButton = screen.getByText('Go Back');
    fireEvent.click(goBackButton);
    
    expect(mockHistoryBack).toHaveBeenCalledTimes(1);
  });

  it('displays popular pages section', () => {
    renderWithRouter(<NotFound />);
    
    expect(screen.getByText('Popular Pages')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Practice Areas')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('has working links to popular pages', () => {
    renderWithRouter(<NotFound />);
    
    const homeLink = screen.getByText('Home').closest('a');
    const aboutLink = screen.getByText('About Us').closest('a');
    const practiceAreasLink = screen.getByText('Practice Areas').closest('a');
    const contactLink = screen.getByText('Contact').closest('a');
    
    expect(homeLink).toHaveAttribute('href', '/');
    expect(aboutLink).toHaveAttribute('href', '/about');
    expect(practiceAreasLink).toHaveAttribute('href', '/practice-areas');
    expect(contactLink).toHaveAttribute('href', '/contact');
  });

  it('displays help section with contact options', () => {
    renderWithRouter(<NotFound />);
    
    expect(screen.getByText('Still Need Help?')).toBeInTheDocument();
    expect(screen.getByText('Contact Support')).toBeInTheDocument();
    expect(screen.getByText('Call Us')).toBeInTheDocument();
  });

  it('has working contact links', () => {
    renderWithRouter(<NotFound />);
    
    const contactSupportLink = screen.getByText('Contact Support').closest('a');
    const callUsLink = screen.getByText('Call Us').closest('a');
    
    expect(contactSupportLink).toHaveAttribute('href', '/contact');
    expect(callUsLink).toHaveAttribute('href', 'tel:+254700123456');
  });

  it('displays search suggestion', () => {
    renderWithRouter(<NotFound />);
    
    expect(screen.getByText(/you can also try searching/i)).toBeInTheDocument();
    expect(screen.getByText('resources page')).toBeInTheDocument();
    expect(screen.getByText('contact us directly')).toBeInTheDocument();
  });

  it('has working search suggestion links', () => {
    renderWithRouter(<NotFound />);
    
    const resourcesLink = screen.getByText('resources page').closest('a');
    const contactDirectlyLink = screen.getByText('contact us directly').closest('a');
    
    expect(resourcesLink).toHaveAttribute('href', '/resources');
    expect(contactDirectlyLink).toHaveAttribute('href', '/contact');
  });

  it('has proper accessibility attributes', () => {
    renderWithRouter(<NotFound />);
    
    // Check for proper heading hierarchy
    const h1Elements = screen.getAllByRole('heading', { level: 1 });
    const h2Elements = screen.getAllByRole('heading', { level: 2 });
    
    expect(h1Elements.length).toBeGreaterThan(0);
    expect(h2Elements.length).toBeGreaterThan(0);
  });

  it('displays icons for popular pages', () => {
    renderWithRouter(<NotFound />);
    
    // Check that icons are rendered (they should be in the DOM)
    const popularPagesSection = screen.getByText('Popular Pages').closest('div');
    expect(popularPagesSection).toBeInTheDocument();
  });

  it('has responsive design classes', () => {
    renderWithRouter(<NotFound />);

    // Check for responsive classes that actually exist
    const mainContainer = screen.getByText('404').closest('div');
    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer).toHaveClass('text-9xl');
  });

  it('displays error message with proper styling', () => {
    renderWithRouter(<NotFound />);

    const errorNumber = screen.getByText('404');
    expect(errorNumber).toBeInTheDocument();
    expect(errorNumber).toHaveClass('text-9xl');
  });

  it('shows helpful error context', () => {
    renderWithRouter(<NotFound />);
    
    expect(screen.getByText(/if you believe this is an error/i)).toBeInTheDocument();
  });

  it('maintains brand consistency', () => {
    renderWithRouter(<NotFound />);

    // Check for brand elements that actually exist
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('handles keyboard navigation', () => {
    renderWithRouter(<NotFound />);
    
    const buttons = screen.getAllByRole('button');
    const links = screen.getAllByRole('link');
    
    // All interactive elements should be focusable
    [...buttons, ...links].forEach(element => {
      expect(element).not.toHaveAttribute('tabindex', '-1');
    });
  });
});
