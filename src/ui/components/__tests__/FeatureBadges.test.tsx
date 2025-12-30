import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FeatureBadges } from '../FeatureBadges';

describe('FeatureBadges', () => {
  it('should render all feature badges', () => {
    render(<FeatureBadges />);

    expect(screen.getByText('Analyse automatique')).toBeInTheDocument();
    expect(screen.getByText('Sans inscription')).toBeInTheDocument();
    expect(screen.getByText('Gratuit')).toBeInTheDocument();
  });

  it('should have accessible list structure', () => {
    render(<FeatureBadges />);

    const list = screen.getByRole('list', { name: 'Avantages du service' });
    expect(list).toBeInTheDocument();

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
  });
});
