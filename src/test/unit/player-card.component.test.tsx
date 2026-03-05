import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/core/theme';
import { PlayerCardComponent } from '../../pods/player-list/components/player-card.component';
import { mockPlayer } from '../mocks/player.mocks';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe('PlayerCardComponent', () => {
  it('renders player overall rating', () => {
    const onClick = () => {};
    renderWithTheme(<PlayerCardComponent player={mockPlayer} onClick={onClick} />);
    expect(screen.getByText('86')).toBeInTheDocument();
  });

  it('renders player name from firstName + lastName when commonName is null', () => {
    renderWithTheme(<PlayerCardComponent player={mockPlayer} onClick={() => {}} />);
    expect(screen.getByText('Lionel Messi')).toBeInTheDocument();
  });

  it('renders player position short label', () => {
    renderWithTheme(<PlayerCardComponent player={mockPlayer} onClick={() => {}} />);
    expect(screen.getByText('ED')).toBeInTheDocument();
  });

  it('renders team name', () => {
    renderWithTheme(<PlayerCardComponent player={mockPlayer} onClick={() => {}} />);
    expect(screen.getByText('Inter Miami CF')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', async () => {
    const user = userEvent.setup();
    let clicked = false;
    renderWithTheme(
      <PlayerCardComponent player={mockPlayer} onClick={() => { clicked = true; }} />
    );
    await user.click(screen.getByText('Lionel Messi'));
    expect(clicked).toBe(true);
  });

  it('uses commonName when available', () => {
    const player = { ...mockPlayer, commonName: 'Leo Messi' };
    renderWithTheme(<PlayerCardComponent player={player} onClick={() => {}} />);
    expect(screen.getByText('Leo Messi')).toBeInTheDocument();
    expect(screen.queryByText('Lionel Messi')).not.toBeInTheDocument();
  });
});
