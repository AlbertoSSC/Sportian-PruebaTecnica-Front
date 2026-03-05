import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/core/theme';
import { PlayerDetailComponent } from '../../pods/player-detail/player-detail.component';
import { mockPlayer } from '../mocks/player.mocks';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe('PlayerDetailComponent', () => {
  it('renders nothing when open is false', () => {
    renderWithTheme(
      <PlayerDetailComponent player={mockPlayer} open={false} onClose={() => {}} />
    );
    // Drawer is closed, player name should not be visible
    expect(screen.queryAllByText('86')).toHaveLength(0);
  });

  it('renders player overall rating when open', () => {
    renderWithTheme(
      <PlayerDetailComponent player={mockPlayer} open={true} onClose={() => {}} />
    );
    expect(screen.getAllByText('86').length).toBeGreaterThan(0);
  });

  it('renders player name when open', () => {
    renderWithTheme(
      <PlayerDetailComponent player={mockPlayer} open={true} onClose={() => {}} />
    );
    expect(screen.getByText('Lionel Messi')).toBeInTheDocument();
  });

  it('renders position', () => {
    renderWithTheme(
      <PlayerDetailComponent player={mockPlayer} open={true} onClose={() => {}} />
    );
    expect(screen.getByText('Right Winger')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    let closed = false;
    renderWithTheme(
      <PlayerDetailComponent player={mockPlayer} open={true} onClose={() => { closed = true; }} />
    );
    await user.click(screen.getByTestId('CloseIcon').closest('button')!);
    expect(closed).toBe(true);
  });

  it('renders stats section', () => {
    renderWithTheme(
      <PlayerDetailComponent player={mockPlayer} open={true} onClose={() => {}} />
    );
    expect(screen.getByText('Key Stats')).toBeInTheDocument();
  });
});
