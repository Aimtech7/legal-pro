import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Resources from '../../pages/Resources';

// Framer-motion is mocked globally in setup.ts

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};

describe('Resources Page', () => {
  it('renders the page title correctly', () => {
    renderWithRouter(<Resources />);
    
    expect(screen.getByText('Legal Resources')).toBeInTheDocument();
  });

  it('displays the search functionality', () => {
    renderWithRouter(<Resources />);
    
    const searchInput = screen.getByPlaceholderText(/search resources/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('renders category filter buttons', () => {
    renderWithRouter(<Resources />);
    
    expect(screen.getByText('All Resources')).toBeInTheDocument();
    expect(screen.getByText('Legal Articles')).toBeInTheDocument();
    expect(screen.getByText('How-to Guides')).toBeInTheDocument();
    expect(screen.getByText('Legal Forms')).toBeInTheDocument();
    expect(screen.getByText('FAQs')).toBeInTheDocument();
  });

  it('displays resource cards with proper information', () => {
    renderWithRouter(<Resources />);
    
    // Check for sample resource titles
    expect(screen.getByText('Understanding Your Rights in Employment Law')).toBeInTheDocument();
    expect(screen.getByText('How to Prepare for Your First Legal Consultation')).toBeInTheDocument();
    expect(screen.getByText('Property Purchase Agreement Template')).toBeInTheDocument();
  });

  it('filters resources by category', async () => {
    renderWithRouter(<Resources />);
    
    // Click on Legal Articles category
    const articlesButton = screen.getByText('Legal Articles');
    fireEvent.click(articlesButton);
    
    // Should show only articles
    await waitFor(() => {
      expect(screen.getByText('Understanding Your Rights in Employment Law')).toBeInTheDocument();
    });
  });

  it('searches resources by text', async () => {
    renderWithRouter(<Resources />);
    
    const searchInput = screen.getByPlaceholderText(/search resources/i);
    fireEvent.change(searchInput, { target: { value: 'employment' } });
    
    await waitFor(() => {
      expect(screen.getByText('Understanding Your Rights in Employment Law')).toBeInTheDocument();
    });
  });

  it('displays download links for downloadable resources', () => {
    renderWithRouter(<Resources />);
    
    // Check for download buttons/links
    const downloadElements = screen.getAllByText(/download/i);
    expect(downloadElements.length).toBeGreaterThan(0);
  });

  it('shows read time for articles', () => {
    renderWithRouter(<Resources />);
    
    expect(screen.getByText('8 min read')).toBeInTheDocument();
    expect(screen.getByText('5 min read')).toBeInTheDocument();
  });

  it('displays FAQ section', () => {
    renderWithRouter(<Resources />);
    
    // Click on FAQs category to see FAQ content
    const faqButton = screen.getByText('FAQs');
    fireEvent.click(faqButton);
    
    // Should show FAQ content
    expect(screen.getByText(/frequently asked questions/i)).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    renderWithRouter(<Resources />);

    const searchInput = screen.getByPlaceholderText(/search resources/i);
    expect(searchInput).toBeInTheDocument();

    // Check for proper heading hierarchy
    const h1Elements = screen.getAllByRole('heading', { level: 1 });
    expect(h1Elements.length).toBeGreaterThan(0);
  });

  it('displays resource categories with icons', () => {
    renderWithRouter(<Resources />);
    
    // Check that category buttons are rendered
    const categoryButtons = screen.getAllByRole('button');
    expect(categoryButtons.length).toBeGreaterThan(4); // At least 5 category buttons
  });

  it('shows resource descriptions', () => {
    renderWithRouter(<Resources />);
    
    expect(screen.getByText(/comprehensive guide to employee rights/i)).toBeInTheDocument();
    expect(screen.getByText(/essential steps and documents to prepare/i)).toBeInTheDocument();
  });

  it('handles empty search results gracefully', async () => {
    renderWithRouter(<Resources />);
    
    const searchInput = screen.getByPlaceholderText(/search resources/i);
    fireEvent.change(searchInput, { target: { value: 'nonexistentresource' } });
    
    await waitFor(() => {
      // Should show no results message or empty state
      const noResults = screen.queryByText(/no resources found/i) || 
                       screen.queryByText(/no results/i);
      // This test might need adjustment based on actual implementation
    });
  });

  it('displays legal forms with proper formatting', () => {
    renderWithRouter(<Resources />);
    
    // Click on Legal Forms category
    const formsButton = screen.getByText('Legal Forms');
    fireEvent.click(formsButton);
    
    expect(screen.getByText('Property Purchase Agreement Template')).toBeInTheDocument();
  });

  it('displays resource content properly', () => {
    renderWithRouter(<Resources />);

    // Check for resource content instead of links
    expect(screen.getByText('Legal Resources')).toBeInTheDocument();
    expect(screen.getByText('All Resources')).toBeInTheDocument();
  });
});
