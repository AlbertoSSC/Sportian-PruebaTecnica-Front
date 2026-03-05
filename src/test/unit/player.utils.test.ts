import { describe, it, expect } from 'vitest';
import { getPlayerDisplayName, getStatColor } from '../../common/utils/player.utils';
import { mockPlayer } from '../mocks/player.mocks';

describe('player.utils', () => {
  describe('getPlayerDisplayName', () => {
    it('returns commonName when defined', () => {
      const player = { ...mockPlayer, commonName: 'Leo Messi' };
      expect(getPlayerDisplayName(player)).toBe('Leo Messi');
    });

    it('returns firstName + lastName when commonName is null', () => {
      const player = { ...mockPlayer, commonName: null };
      expect(getPlayerDisplayName(player)).toBe('Lionel Messi');
    });

    it('trims whitespace when firstName is empty', () => {
      const player = { ...mockPlayer, firstName: '', commonName: null };
      expect(getPlayerDisplayName(player)).toBe('Messi');
    });
  });

  describe('getStatColor', () => {
    it('returns green for value >= 85', () => {
      expect(getStatColor(85)).toBe('#2ecc71');
      expect(getStatColor(99)).toBe('#2ecc71');
    });

    it('returns amber for value 70–84', () => {
      expect(getStatColor(70)).toBe('#f39c12');
      expect(getStatColor(84)).toBe('#f39c12');
    });

    it('returns orange for value 55–69', () => {
      expect(getStatColor(55)).toBe('#e67e22');
      expect(getStatColor(69)).toBe('#e67e22');
    });

    it('returns red for value < 55', () => {
      expect(getStatColor(54)).toBe('#e74c3c');
      expect(getStatColor(0)).toBe('#e74c3c');
    });
  });
});
