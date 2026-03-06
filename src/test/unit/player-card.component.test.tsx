import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/core/theme";
import { PlayerCardComponent } from "../../pods/player-list/components/player-card.component";
import { mockPlayer } from "../mocks/player.mocks";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe("PlayerCardComponent", () => {
  it("renders player overall rating", () => {
    renderWithTheme(
      <PlayerCardComponent player={mockPlayer} onSelect={() => {}} />,
    );
    expect(screen.getByText("86")).toBeInTheDocument();
  });

  it("uses commonName when available", () => {
    const player = { ...mockPlayer, commonName: "Leo Messi" };
    renderWithTheme(
      <PlayerCardComponent player={player} onSelect={() => {}} />,
    );
    expect(screen.getByText("Leo Messi")).toBeInTheDocument();
    expect(screen.queryByText("Lionel Messi")).not.toBeInTheDocument();
  });

  it("renders player name from firstName + lastName when commonName is null", () => {
    renderWithTheme(
      <PlayerCardComponent player={mockPlayer} onSelect={() => {}} />,
    );
    expect(screen.getByText("Lionel Messi")).toBeInTheDocument();
  });

  it("calls onSelect with player when card is clicked", async () => {
    const user = userEvent.setup();
    let selected: unknown = null;
    renderWithTheme(
      <PlayerCardComponent
        player={mockPlayer}
        onSelect={(p) => {
          selected = p;
        }}
      />,
    );
    await user.click(screen.getByText("Lionel Messi"));
    expect(selected).toBe(mockPlayer);
  });
});
