import React from 'react';
import type { ArtworkKind } from '../types/store';

interface ProductArtworkProps {
  kind: ArtworkKind;
  accentHex?: string;
  title: string;
  subtitle?: string;
  angleIndex?: number;
  className?: string;
  showPlaceholderCaption?: boolean;
}

export function ProductArtwork({
  kind,
  accentHex = '#9CDEF7',
  title,
  subtitle,
  angleIndex = 0,
  className = '',
  showPlaceholderCaption = true,
}: ProductArtworkProps) {
  const shortCode = title.split(':')[0].slice(0, 14).toUpperCase();
  const secondaryTint = accentHex === '#D8AD6C' ? '#9CDEF7' : '#D8AD6C';
  const tilt = angleIndex === 1 ? 'scale-105 -rotate-2' : angleIndex === 2 ? 'scale-95 rotate-2' : '';

  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-[#111925] select-none flex items-center justify-center ${className}`}
    >
      {/* Subtle studio radial backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 42%, ${accentHex}1F 0%, #172333 52%, #0B111A 100%)`,
        }}
      />
      {/* Plinth horizon line */}
      <div
        className="absolute inset-x-0 bottom-0 h-[28%] pointer-events-none border-t border-white/5"
        style={{
          background:
            'linear-gradient(180deg, rgba(9,13,20,0.45) 0%, rgba(9,13,20,0.92) 100%)',
        }}
      />

      {/* Category-specific product render SVG */}
      <div className={`relative z-10 w-[72%] h-[72%] flex items-center justify-center transition-transform duration-300 ${tilt}`}>
        {(kind === 'pokemon_box' || kind === 'pokemon_etb') && (
          <svg viewBox="0 0 220 180" className="w-full h-full drop-shadow-[0_18px_24px_rgba(0,0,0,0.75)]" aria-hidden="true">
            <defs>
              <linearGradient id={`boxFace-${kind}-${angleIndex}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1E2D42" />
                <stop offset="100%" stopColor="#0E1622" />
              </linearGradient>
              <linearGradient id={`boxAccent-${kind}-${angleIndex}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={accentHex} stopOpacity="0.95" />
                <stop offset="100%" stopColor={secondaryTint} stopOpacity="0.7" />
              </linearGradient>
            </defs>
            {/* Shadow ellipse */}
            <ellipse cx="110" cy="160" rx="74" ry="11" fill="rgba(0,0,0,0.6)" />
            {/* 3D Display / ETB Box */}
            <polygon
              points="36,42 152,24 188,46 188,144 74,160 36,138"
              fill={`url(#boxFace-${kind}-${angleIndex})`}
              stroke={accentHex}
              strokeOpacity="0.45"
              strokeWidth="1.5"
            />
            {/* Top lid */}
            <polygon
              points="36,42 152,24 188,46 74,64"
              fill="#23344D"
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="1"
            />
            {/* Side spine */}
            <polygon
              points="36,42 74,64 74,160 36,138"
              fill="#101824"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
            {/* Foil band */}
            <polygon
              points="74,64 188,46 188,72 74,90"
              fill={`url(#boxAccent-${kind}-${angleIndex})`}
              opacity="0.88"
            />
            {/* Stylized Poké-emblem */}
            <circle cx="131" cy="112" r="22" fill="#0B111A" stroke={accentHex} strokeWidth="2.5" />
            <path d="M109 112 H153" stroke={accentHex} strokeWidth="2.5" />
            <path d="M111 112 A20 20 0 0 1 151 112 Z" fill={accentHex} fillOpacity="0.28" />
            <circle cx="131" cy="112" r="6" fill="#090D14" stroke="#F1F5F9" strokeWidth="2" />
            {kind === 'pokemon_box' && (
              <g opacity="0.85">
                <rect x="82" y="136" width="96" height="6" rx="2" fill={accentHex} fillOpacity="0.25" />
                <text x="130" y="65" textAnchor="middle" fill="#090D14" fontSize="10" fontWeight="800" fontFamily="sans-serif">
                  COLLECTOR BOX
                </text>
              </g>
            )}
            {kind === 'pokemon_etb' && (
              <text x="130" y="65" textAnchor="middle" fill="#090D14" fontSize="9.5" fontWeight="800" fontFamily="sans-serif">
                ELITE TRAINER BOX
              </text>
            )}
          </svg>
        )}

        {kind === 'pokemon_booster' && (
          <svg viewBox="0 0 200 180" className="w-full h-full drop-shadow-[0_18px_22px_rgba(0,0,0,0.75)]" aria-hidden="true">
            <ellipse cx="100" cy="162" rx="46" ry="8" fill="rgba(0,0,0,0.55)" />
            {/* Back booster */}
            <rect x="74" y="20" width="76" height="132" rx="4" transform="rotate(8 112 86)" fill="#162232" stroke="#D8AD6C" strokeOpacity="0.45" strokeWidth="1.5" />
            {/* Main booster pack */}
            <rect x="58" y="18" width="84" height="138" rx="4" fill="#1C2C42" stroke={accentHex} strokeWidth="1.75" />
            {/* Crimp edges */}
            <rect x="58" y="18" width="84" height="10" rx="2" fill={accentHex} fillOpacity="0.3" />
            <rect x="58" y="146" width="84" height="10" rx="2" fill={accentHex} fillOpacity="0.3" />
            {/* Artwork window */}
            <rect x="66" y="36" width="68" height="72" rx="3" fill="#0E1724" stroke="rgba(255,255,255,0.12)" />
            <circle cx="100" cy="72" r="19" fill="none" stroke={accentHex} strokeWidth="2.5" />
            <line x1="81" y1="72" x2="119" y2="72" stroke={accentHex} strokeWidth="2.5" />
            <circle cx="100" cy="72" r="5.5" fill="#F1F5F9" />
            <rect x="68" y="116" width="64" height="16" rx="2" fill={accentHex} fillOpacity="0.85" />
            <text x="100" y="127" textAnchor="middle" fill="#090D14" fontSize="8.5" fontWeight="800" fontFamily="sans-serif">
              10 KART TCG
            </text>
          </svg>
        )}

        {kind === 'pokemon_accessories' && (
          <svg viewBox="0 0 220 180" className="w-full h-full drop-shadow-[0_18px_22px_rgba(0,0,0,0.75)]" aria-hidden="true">
            <ellipse cx="110" cy="160" rx="68" ry="10" fill="rgba(0,0,0,0.55)" />
            {/* Binder / Toploader frame */}
            <rect x="50" y="24" width="120" height="132" rx="8" fill="#182436" stroke={accentHex} strokeWidth="1.75" />
            <rect x="58" y="24" width="14" height="132" fill="#0D141F" />
            {/* Pocket grid preview */}
            <rect x="82" y="38" width="24" height="32" rx="2" fill="#0E1724" stroke={accentHex} strokeOpacity="0.6" />
            <rect x="112" y="38" width="24" height="32" rx="2" fill="#0E1724" stroke={accentHex} strokeOpacity="0.6" />
            <rect x="142" y="38" width="20" height="32" rx="2" fill="#0E1724" stroke="rgba(255,255,255,0.2)" />
            <rect x="82" y="76" width="24" height="32" rx="2" fill="#0E1724" stroke="rgba(255,255,255,0.2)" />
            <rect x="112" y="76" width="24" height="32" rx="2" fill="#0E1724" stroke={accentHex} strokeOpacity="0.6" />
            <rect x="142" y="76" width="20" height="32" rx="2" fill="#0E1724" stroke="rgba(255,255,255,0.2)" />
            <rect x="82" y="114" width="80" height="24" rx="3" fill={accentHex} fillOpacity="0.18" stroke={accentHex} strokeOpacity="0.5" />
            <text x="122" y="129" textAnchor="middle" fill={accentHex} fontSize="9" fontWeight="700" fontFamily="sans-serif">
              ARCHIVAL SAFE
            </text>
          </svg>
        )}

        {kind === 'beyblade_top' && (
          <svg viewBox="0 0 200 180" className="w-full h-full drop-shadow-[0_18px_22px_rgba(0,0,0,0.75)]" aria-hidden="true">
            <ellipse cx="100" cy="158" rx="58" ry="10" fill="rgba(0,0,0,0.65)" />
            {/* Spin aura rings */}
            <circle cx="100" cy="86" r="64" fill="none" stroke={accentHex} strokeOpacity="0.18" strokeDasharray="10 6" strokeWidth="2" />
            <circle cx="100" cy="86" r="52" fill="#141F30" stroke={accentHex} strokeWidth="2.5" />
            {/* 3-blade metallic attack ring */}
            <path
              d="M100 30 L120 56 L154 62 L132 90 L142 124 L106 112 L76 134 L76 98 L46 82 L80 64 Z"
              fill="#1E2E46"
              stroke="#E2E8F0"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Gear teeth inner ring */}
            <circle cx="100" cy="86" r="24" fill="#0D1521" stroke={secondaryTint} strokeWidth="3" strokeDasharray="4 3" />
            {/* Bit chip core */}
            <circle cx="100" cy="86" r="13" fill={accentHex} />
            <path d="M94 86 L100 78 L106 86 L100 94 Z" fill="#090D14" />
          </svg>
        )}

        {kind === 'beyblade_launcher' && (
          <svg viewBox="0 0 220 180" className="w-full h-full drop-shadow-[0_18px_22px_rgba(0,0,0,0.75)]" aria-hidden="true">
            <ellipse cx="110" cy="158" rx="64" ry="9" fill="rgba(0,0,0,0.6)" />
            {/* Launcher body */}
            <path
              d="M48 64 L144 46 L174 72 L152 118 L66 122 L42 94 Z"
              fill="#192638"
              stroke={accentHex}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Grip handle */}
            <path d="M58 112 L42 152 L72 156 L84 118 Z" fill="#101824" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
            {/* Spin gear wheel */}
            <circle cx="128" cy="82" r="22" fill="#0B111A" stroke={accentHex} strokeWidth="2.5" />
            <circle cx="128" cy="82" r="9" fill={secondaryTint} />
            {/* String pull tab */}
            <line x1="158" y1="64" x2="188" y2="48" stroke={accentHex} strokeWidth="2.5" />
            <rect x="182" y="38" width="16" height="16" rx="3" fill={accentHex} />
          </svg>
        )}

        {kind === 'beyblade_stadium' && (
          <svg viewBox="0 0 240 180" className="w-full h-full drop-shadow-[0_18px_22px_rgba(0,0,0,0.75)]" aria-hidden="true">
            <ellipse cx="120" cy="154" rx="92" ry="14" fill="rgba(0,0,0,0.65)" />
            {/* Outer stadium bowl */}
            <ellipse cx="120" cy="96" rx="96" ry="52" fill="#131E2E" stroke={accentHex} strokeWidth="2.2" />
            {/* Inner dish */}
            <ellipse cx="120" cy="100" rx="76" ry="38" fill="#0B121C" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
            {/* Xtreme Rail */}
            <path
              d="M52 102 C62 72, 178 72, 188 102"
              fill="none"
              stroke={secondaryTint}
              strokeWidth="4"
              strokeDasharray="6 4"
            />
            {/* Center clash zone */}
            <ellipse cx="120" cy="104" rx="34" ry="16" fill="none" stroke={accentHex} strokeOpacity="0.55" strokeWidth="1.5" />
            {/* Two mini clash tops */}
            <circle cx="104" cy="102" r="9" fill="#1E2E46" stroke={accentHex} strokeWidth="2" />
            <circle cx="136" cy="106" r="9" fill="#1E2E46" stroke={secondaryTint} strokeWidth="2" />
          </svg>
        )}

        {kind === 'beyblade_set' && (
          <svg viewBox="0 0 220 180" className="w-full h-full drop-shadow-[0_18px_22px_rgba(0,0,0,0.75)]" aria-hidden="true">
            <ellipse cx="110" cy="158" rx="72" ry="10" fill="rgba(0,0,0,0.6)" />
            <rect x="34" y="34" width="152" height="112" rx="8" fill="#162233" stroke={accentHex} strokeWidth="1.75" />
            <rect x="44" y="44" width="132" height="92" rx="4" fill="#0C131E" />
            <circle cx="84" cy="90" r="24" fill="#1B2A40" stroke={accentHex} strokeWidth="2" />
            <circle cx="84" cy="90" r="8" fill={accentHex} />
            <rect x="122" y="64" width="44" height="52" rx="4" fill="#1A273B" stroke={secondaryTint} strokeWidth="1.75" />
            <circle cx="144" cy="84" r="10" fill={secondaryTint} fillOpacity="0.85" />
          </svg>
        )}

        {(kind === 'figure_scale' || kind === 'figure_chibi' || kind === 'figure_prize') && (
          <svg viewBox="0 0 220 180" className="w-full h-full drop-shadow-[0_18px_24px_rgba(0,0,0,0.75)]" aria-hidden="true">
            <ellipse cx="110" cy="160" rx="64" ry="10" fill="rgba(0,0,0,0.65)" />
            {/* Collector display plinth */}
            <ellipse cx="110" cy="146" rx="52" ry="12" fill="#1C293D" stroke={accentHex} strokeWidth="1.75" />
            <ellipse cx="110" cy="143" rx="42" ry="8" fill="#0B111A" />
            {/* Window box frame behind */}
            <rect x="54" y="20" width="112" height="122" rx="6" fill="#131E2E" stroke="rgba(255,255,255,0.14)" strokeWidth="1.2" />
            <rect x="64" y="30" width="92" height="92" rx="4" fill="#0B121D" stroke={accentHex} strokeOpacity="0.4" />
            {/* Sculpted figure silhouette */}
            {kind === 'figure_chibi' ? (
              <g>
                <circle cx="110" cy="68" r="22" fill="#1E2F47" stroke={accentHex} strokeWidth="2" />
                <path d="M90 120 C90 96, 130 96, 130 120 Z" fill="#253854" stroke={secondaryTint} strokeWidth="1.75" />
                <circle cx="102" cy="68" r="3" fill={accentHex} />
                <circle cx="118" cy="68" r="3" fill={secondaryTint} />
              </g>
            ) : (
              <g>
                <path
                  d="M110 38 L126 58 L138 92 L124 136 L96 136 L82 92 L94 58 Z"
                  fill="#1E2E46"
                  stroke={accentHex}
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <circle cx="110" cy="52" r="11" fill="#263B59" stroke="#E2E8F0" strokeWidth="1.5" />
                {/* Energy aura */}
                <path
                  d="M72 108 C64 78, 86 50, 110 34 C134 50, 156 78, 148 108"
                  fill="none"
                  stroke={secondaryTint}
                  strokeOpacity="0.6"
                  strokeWidth="2"
                />
              </g>
            )}
            <text x="110" y="135" textAnchor="middle" fill={accentHex} fontSize="8" fontWeight="700" fontFamily="sans-serif">
              {kind === 'figure_scale' ? 'SCALE COLLECTOR' : kind === 'figure_chibi' ? 'NENDOROID' : 'COLLECTOR EDITION'}
            </text>
          </svg>
        )}
      </div>

      {/* Clear placeholder caption to avoid misrepresenting illustration as real photo */}
      {showPlaceholderCaption && (
        <div className="absolute bottom-2 inset-x-3 flex items-center justify-between text-[10px] tracking-wider uppercase text-[#C5CFD8]/55 z-10 pointer-events-none">
          <span className="truncate">{shortCode}</span>
          <span className="shrink-0 ml-2">{subtitle ? subtitle : 'Wizualizacja'}</span>
        </div>
      )}
    </div>
  );
}
