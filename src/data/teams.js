// ════════════════════════════════════════════════════════════════════════════
// 🌍 TEAMS — 48 seleções classificadas para a Copa do Mundo 2026.
//    Fonte dos grupos: sorteio oficial FIFA (5/dez/2025).
//    Ratings são opiniões calibradas (0–100), não dados oficiais.
//    ✏️ Para ajustar uma nota: edite o `rating` da chave.
// ════════════════════════════════════════════════════════════════════════════

export const TEAMS = {
  // ── CONMEBOL ──────────────────────────────────────────────────────────
  BRA: { name: 'Brasil',          short: 'BRA', flag: '🇧🇷', rating: 88, confederation: 'CONMEBOL' },
  ARG: { name: 'Argentina',       short: 'ARG', flag: '🇦🇷', rating: 91, confederation: 'CONMEBOL' },
  COL: { name: 'Colômbia',        short: 'COL', flag: '🇨🇴', rating: 82, confederation: 'CONMEBOL' },
  URU: { name: 'Uruguai',         short: 'URU', flag: '🇺🇾', rating: 83, confederation: 'CONMEBOL' },
  ECU: { name: 'Equador',         short: 'ECU', flag: '🇪🇨', rating: 78, confederation: 'CONMEBOL' },
  PAR: { name: 'Paraguai',        short: 'PAR', flag: '🇵🇾', rating: 72, confederation: 'CONMEBOL' },

  // ── UEFA ──────────────────────────────────────────────────────────────
  FRA: { name: 'França',          short: 'FRA', flag: '🇫🇷', rating: 92, confederation: 'UEFA' },
  ESP: { name: 'Espanha',         short: 'ESP', flag: '🇪🇸', rating: 90, confederation: 'UEFA' },
  ENG: { name: 'Inglaterra',      short: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 88, confederation: 'UEFA' },
  POR: { name: 'Portugal',        short: 'POR', flag: '🇵🇹', rating: 87, confederation: 'UEFA' },
  GER: { name: 'Alemanha',        short: 'GER', flag: '🇩🇪', rating: 85, confederation: 'UEFA' },
  NED: { name: 'Holanda',         short: 'NED', flag: '🇳🇱', rating: 85, confederation: 'UEFA' },
  BEL: { name: 'Bélgica',         short: 'BEL', flag: '🇧🇪', rating: 84, confederation: 'UEFA' },
  CRO: { name: 'Croácia',         short: 'CRO', flag: '🇭🇷', rating: 83, confederation: 'UEFA' },
  SUI: { name: 'Suíça',           short: 'SUI', flag: '🇨🇭', rating: 80, confederation: 'UEFA' },
  AUT: { name: 'Áustria',         short: 'AUT', flag: '🇦🇹', rating: 79, confederation: 'UEFA' },
  NOR: { name: 'Noruega',         short: 'NOR', flag: '🇳🇴', rating: 78, confederation: 'UEFA' },
  SWE: { name: 'Suécia',          short: 'SWE', flag: '🇸🇪', rating: 76, confederation: 'UEFA' },
  TUR: { name: 'Turquia',         short: 'TUR', flag: '🇹🇷', rating: 77, confederation: 'UEFA' },
  BIH: { name: 'Bósnia',          short: 'BIH', flag: '🇧🇦', rating: 73, confederation: 'UEFA' },
  CZE: { name: 'Rep. Tcheca',     short: 'CZE', flag: '🇨🇿', rating: 73, confederation: 'UEFA' },
  SCO: { name: 'Escócia',         short: 'SCO', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', rating: 73, confederation: 'UEFA' },

  // ── CAF ───────────────────────────────────────────────────────────────
  MAR: { name: 'Marrocos',        short: 'MAR', flag: '🇲🇦', rating: 82, confederation: 'CAF' },
  SEN: { name: 'Senegal',         short: 'SEN', flag: '🇸🇳', rating: 78, confederation: 'CAF' },
  EGY: { name: 'Egito',           short: 'EGY', flag: '🇪🇬', rating: 76, confederation: 'CAF' },
  ALG: { name: 'Argélia',         short: 'ALG', flag: '🇩🇿', rating: 75, confederation: 'CAF' },
  CIV: { name: 'Costa do Marfim', short: 'CIV', flag: '🇨🇮', rating: 75, confederation: 'CAF' },
  GHA: { name: 'Gana',            short: 'GHA', flag: '🇬🇭', rating: 74, confederation: 'CAF' },
  RSA: { name: 'África do Sul',   short: 'RSA', flag: '🇿🇦', rating: 74, confederation: 'CAF' },
  TUN: { name: 'Tunísia',         short: 'TUN', flag: '🇹🇳', rating: 73, confederation: 'CAF' },
  COD: { name: 'RD Congo',        short: 'COD', flag: '🇨🇩', rating: 72, confederation: 'CAF' },
  CPV: { name: 'Cabo Verde',      short: 'CPV', flag: '🇨🇻', rating: 70, confederation: 'CAF' },

  // ── AFC ───────────────────────────────────────────────────────────────
  JPN: { name: 'Japão',           short: 'JPN', flag: '🇯🇵', rating: 78, confederation: 'AFC' },
  KOR: { name: 'Coreia do Sul',   short: 'KOR', flag: '🇰🇷', rating: 76, confederation: 'AFC' },
  IRN: { name: 'Irã',             short: 'IRN', flag: '🇮🇷', rating: 75, confederation: 'AFC' },
  AUS: { name: 'Austrália',       short: 'AUS', flag: '🇦🇺', rating: 73, confederation: 'AFC' },
  QAT: { name: 'Catar',           short: 'QAT', flag: '🇶🇦', rating: 71, confederation: 'AFC' },
  KSA: { name: 'Arábia Saudita',  short: 'KSA', flag: '🇸🇦', rating: 70, confederation: 'AFC' },
  JOR: { name: 'Jordânia',        short: 'JOR', flag: '🇯🇴', rating: 70, confederation: 'AFC' },
  IRQ: { name: 'Iraque',          short: 'IRQ', flag: '🇮🇶', rating: 68, confederation: 'AFC' },
  UZB: { name: 'Uzbequistão',     short: 'UZB', flag: '🇺🇿', rating: 67, confederation: 'AFC' },

  // ── CONCACAF (anfitriões + classificados) ─────────────────────────────
  USA: { name: 'Estados Unidos',  short: 'USA', flag: '🇺🇸', rating: 77, confederation: 'CONCACAF', host: true },
  MEX: { name: 'México',          short: 'MEX', flag: '🇲🇽', rating: 76, confederation: 'CONCACAF', host: true },
  CAN: { name: 'Canadá',          short: 'CAN', flag: '🇨🇦', rating: 73, confederation: 'CONCACAF', host: true },
  PAN: { name: 'Panamá',          short: 'PAN', flag: '🇵🇦', rating: 68, confederation: 'CONCACAF' },
  HAI: { name: 'Haiti',           short: 'HAI', flag: '🇭🇹', rating: 62, confederation: 'CONCACAF' },
  CUW: { name: 'Curaçao',         short: 'CUW', flag: '🇨🇼', rating: 60, confederation: 'CONCACAF' },

  // ── OFC ───────────────────────────────────────────────────────────────
  NZL: { name: 'Nova Zelândia',   short: 'NZL', flag: '🇳🇿', rating: 65, confederation: 'OFC' },
};

// ════════════════════════════════════════════════════════════════════════════
// 🏆 GROUPS — sorteio OFICIAL da Copa do Mundo 2026 (FIFA, 5/dez/2025).
//    Fonte: tabela divulgada pela FIFA, conferida em imagem do Nexo.
// ════════════════════════════════════════════════════════════════════════════

export const GROUPS = {
  A: ['MEX', 'RSA', 'KOR', 'CZE'],
  B: ['CAN', 'BIH', 'QAT', 'SUI'],
  C: ['BRA', 'MAR', 'HAI', 'SCO'],
  D: ['USA', 'PAR', 'AUS', 'TUR'],
  E: ['GER', 'CUW', 'CIV', 'ECU'],
  F: ['NED', 'JPN', 'SWE', 'TUN'],
  G: ['BEL', 'EGY', 'IRN', 'NZL'],
  H: ['ESP', 'CPV', 'KSA', 'URU'],
  I: ['FRA', 'SEN', 'IRQ', 'NOR'],
  J: ['ARG', 'ALG', 'AUT', 'JOR'],
  K: ['POR', 'COD', 'UZB', 'COL'],
  L: ['ENG', 'CRO', 'GHA', 'PAN'],
};

// Helper: lista plana de todas as chaves de times.
export const ALL_TEAM_KEYS = Object.keys(TEAMS);
