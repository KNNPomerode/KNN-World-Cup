// ════════════════════════════════════════════════════════════════════════════
// 🌍 TEAMS — 48 seleções da Copa do Mundo 2026 com nota (0–100).
//    Ratings são opiniões calibradas, não dados oficiais.
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
  CHI: { name: 'Chile',           short: 'CHI', flag: '🇨🇱', rating: 72, confederation: 'CONMEBOL' },

  // ── UEFA ──────────────────────────────────────────────────────────────
  FRA: { name: 'França',          short: 'FRA', flag: '🇫🇷', rating: 92, confederation: 'UEFA' },
  ESP: { name: 'Espanha',         short: 'ESP', flag: '🇪🇸', rating: 90, confederation: 'UEFA' },
  ENG: { name: 'Inglaterra',      short: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 88, confederation: 'UEFA' },
  POR: { name: 'Portugal',        short: 'POR', flag: '🇵🇹', rating: 87, confederation: 'UEFA' },
  GER: { name: 'Alemanha',        short: 'GER', flag: '🇩🇪', rating: 85, confederation: 'UEFA' },
  NED: { name: 'Holanda',         short: 'NED', flag: '🇳🇱', rating: 85, confederation: 'UEFA' },
  BEL: { name: 'Bélgica',         short: 'BEL', flag: '🇧🇪', rating: 84, confederation: 'UEFA' },
  ITA: { name: 'Itália',          short: 'ITA', flag: '🇮🇹', rating: 84, confederation: 'UEFA' },
  CRO: { name: 'Croácia',         short: 'CRO', flag: '🇭🇷', rating: 83, confederation: 'UEFA' },
  DEN: { name: 'Dinamarca',       short: 'DEN', flag: '🇩🇰', rating: 81, confederation: 'UEFA' },
  SUI: { name: 'Suíça',           short: 'SUI', flag: '🇨🇭', rating: 80, confederation: 'UEFA' },
  SRB: { name: 'Sérvia',          short: 'SRB', flag: '🇷🇸', rating: 79, confederation: 'UEFA' },
  AUT: { name: 'Áustria',         short: 'AUT', flag: '🇦🇹', rating: 79, confederation: 'UEFA' },
  POL: { name: 'Polônia',         short: 'POL', flag: '🇵🇱', rating: 78, confederation: 'UEFA' },
  NOR: { name: 'Noruega',         short: 'NOR', flag: '🇳🇴', rating: 78, confederation: 'UEFA' },
  TUR: { name: 'Turquia',         short: 'TUR', flag: '🇹🇷', rating: 77, confederation: 'UEFA' },
  SCO: { name: 'Escócia',         short: 'SCO', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', rating: 73, confederation: 'UEFA' },

  // ── CAF ───────────────────────────────────────────────────────────────
  MAR: { name: 'Marrocos',        short: 'MAR', flag: '🇲🇦', rating: 82, confederation: 'CAF' },
  SEN: { name: 'Senegal',         short: 'SEN', flag: '🇸🇳', rating: 78, confederation: 'CAF' },
  EGY: { name: 'Egito',           short: 'EGY', flag: '🇪🇬', rating: 76, confederation: 'CAF' },
  NGA: { name: 'Nigéria',         short: 'NGA', flag: '🇳🇬', rating: 76, confederation: 'CAF' },
  ALG: { name: 'Argélia',         short: 'ALG', flag: '🇩🇿', rating: 75, confederation: 'CAF' },
  CIV: { name: 'Costa do Marfim', short: 'CIV', flag: '🇨🇮', rating: 75, confederation: 'CAF' },
  CMR: { name: 'Camarões',        short: 'CMR', flag: '🇨🇲', rating: 74, confederation: 'CAF' },
  TUN: { name: 'Tunísia',         short: 'TUN', flag: '🇹🇳', rating: 73, confederation: 'CAF' },
  MLI: { name: 'Mali',            short: 'MLI', flag: '🇲🇱', rating: 70, confederation: 'CAF' },

  // ── AFC ───────────────────────────────────────────────────────────────
  JPN: { name: 'Japão',           short: 'JPN', flag: '🇯🇵', rating: 78, confederation: 'AFC' },
  KOR: { name: 'Coreia do Sul',   short: 'KOR', flag: '🇰🇷', rating: 76, confederation: 'AFC' },
  IRN: { name: 'Irã',             short: 'IRN', flag: '🇮🇷', rating: 75, confederation: 'AFC' },
  AUS: { name: 'Austrália',       short: 'AUS', flag: '🇦🇺', rating: 73, confederation: 'AFC' },
  QAT: { name: 'Catar',           short: 'QAT', flag: '🇶🇦', rating: 71, confederation: 'AFC' },
  KSA: { name: 'Arábia Saudita',  short: 'KSA', flag: '🇸🇦', rating: 70, confederation: 'AFC' },
  IRQ: { name: 'Iraque',          short: 'IRQ', flag: '🇮🇶', rating: 68, confederation: 'AFC' },
  UZB: { name: 'Uzbequistão',     short: 'UZB', flag: '🇺🇿', rating: 67, confederation: 'AFC' },

  // ── CONCACAF (anfitriões + classificados) ─────────────────────────────
  USA: { name: 'Estados Unidos',  short: 'USA', flag: '🇺🇸', rating: 77, confederation: 'CONCACAF', host: true },
  MEX: { name: 'México',          short: 'MEX', flag: '🇲🇽', rating: 76, confederation: 'CONCACAF', host: true },
  CAN: { name: 'Canadá',          short: 'CAN', flag: '🇨🇦', rating: 73, confederation: 'CONCACAF', host: true },
  CRC: { name: 'Costa Rica',      short: 'CRC', flag: '🇨🇷', rating: 70, confederation: 'CONCACAF' },
  JAM: { name: 'Jamaica',         short: 'JAM', flag: '🇯🇲', rating: 68, confederation: 'CONCACAF' },
  HAI: { name: 'Haiti',           short: 'HAI', flag: '🇭🇹', rating: 62, confederation: 'CONCACAF' },

  // ── OFC ───────────────────────────────────────────────────────────────
  NZL: { name: 'Nova Zelândia',   short: 'NZL', flag: '🇳🇿', rating: 65, confederation: 'OFC' },
};

// ════════════════════════════════════════════════════════════════════════════
// 🏆 GROUPS — 12 grupos da Copa 2026 (A → L), 4 seleções cada.
//    O Grupo C é o do Brasil; os demais são uma composição plausível.
//    ✏️ Para ajustar conforme o sorteio oficial: edite as chaves aqui.
// ════════════════════════════════════════════════════════════════════════════

export const GROUPS = {
  A: ['USA', 'ITA', 'JPN', 'TUN'],
  B: ['MEX', 'URU', 'ECU', 'NZL'],
  C: ['BRA', 'MAR', 'SCO', 'HAI'],
  D: ['CAN', 'CRO', 'TUR', 'CHI'],
  E: ['ARG', 'COL', 'NGA', 'QAT'],
  F: ['FRA', 'DEN', 'EGY', 'KSA'],
  G: ['ESP', 'SUI', 'KOR', 'MLI'],
  H: ['ENG', 'SRB', 'IRN', 'CRC'],
  I: ['POR', 'AUT', 'ALG', 'JAM'],
  J: ['NED', 'POL', 'CIV', 'IRQ'],
  K: ['GER', 'NOR', 'CMR', 'UZB'],
  L: ['BEL', 'SEN', 'AUS', 'PAR'],
};

// Helper: lista plana de todas as chaves de times.
export const ALL_TEAM_KEYS = Object.keys(TEAMS);
