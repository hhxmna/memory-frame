import React from 'react';
import html2canvas from 'html2canvas';
import { FriendFrameBoard } from './FriendFrameBoard';
import { PartnerFrameBoard } from './PartnerFrameBoard';
import { FamilyFrameBoard } from './FamilyFrameBoard';

type FrameStyleId = 'black' | 'white';
type TextureId = 'white' | 'polka' | 'stripes' | 'olive';
type TemplateId = 'partner' | 'family' | 'friend';
type ViewId = 'home' | 'builder' | 'about' | 'builder-loading';

const FRAME_ASSETS: Record<FrameStyleId, string> = {
  black: '/assets/frames/Black-frame.svg',
  white: '/assets/frames/White-frame.svg',
};

const MEMORY_FRAME_WIDTH = 318;
const MEMORY_FRAME_HEIGHT = 415;
const BLACK_FRAME_OVERLAY_WIDTH = 370;
const BLACK_FRAME_OVERLAY_HEIGHT = 467;
/** White frame export: width between black (370) and previous wide (560) so frame isn't too narrow or too wide */
const WHITE_FRAME_OVERLAY_WIDTH = 463;
const WHITE_FRAME_OVERLAY_HEIGHT = 467;

export function App() {
  const [selectedFrame, setSelectedFrame] = React.useState<FrameStyleId>('black');
  const [texture, setTexture] = React.useState<TextureId>('white');
  const [view, setView] = React.useState<ViewId>('home');
  const [template, setTemplate] = React.useState<TemplateId | null>(null);
  const [aboutReady, setAboutReady] = React.useState(false);
  const exportContainerRef = React.useRef<HTMLDivElement | null>(null);
  const cursorStyleRef = React.useRef<HTMLStyleElement | null>(null);

  // Set custom cursor (PNG from canvas); color by view/template: about = pine green, else partner/family/friend.
  // Use one persistent <style> and only update its content so we never remove it (avoids flashing back to red from stylesheet).
  React.useEffect(() => {
    const size = 32;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    type CursorPalette = [string, string, string];
    const palettes: Record<TemplateId | 'default' | 'about', CursorPalette> = {
      default: ['#722f37', '#8b3a42', '#6b2830'],
      partner: ['#722f37', '#8b3a42', '#6b2830'],
      family: ['#d6c2ff', '#c3a4ff', '#b08aff'],
      friend: ['#a8d0e6', '#b8d4e3', '#8ecae6'],
      about: ['#2d5a27', '#3d7049', '#4a7c59'],
    };
    const palette =
      view === 'about'
        ? palettes.about
        : template
          ? palettes[template]
          : palettes.default;

    const cx = size / 2;
    const cy = size / 2;
    const outer = 14;
    const inner = 6;
    const points: { x: number; y: number }[] = [];
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = (i * Math.PI) / 5 - Math.PI / 2;
      points.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
    }
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, palette[0]);
    gradient.addColorStop(0.5, palette[1]);
    gradient.addColorStop(1, palette[2]);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
    ctx.closePath();
    ctx.fill();
    const dataUrl = canvas.toDataURL('image/png');
    const cursorAuto = `url("${dataUrl}") 16 8, auto`;
    const cursorPointer = `url("${dataUrl}") 16 8, pointer`;

    let styleEl = cursorStyleRef.current;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.setAttribute('data-custom-cursor', '');
      document.head.appendChild(styleEl);
      cursorStyleRef.current = styleEl;
    }
    styleEl.textContent = `body, html, #root { cursor: ${cursorAuto} !important; }
#root a, #root button, #root [role="button"], #root input, #root .app-title-button, #root .about-btn, #root .template-card, #root .frame-thumb, #root .texture-btn, #root .about-frame-link, #root .about-say-hi-link, #root .about-loading, #root .about-loading-spinner { cursor: ${cursorPointer} !important; }`;
  }, [template, view]);

  const goHome = () => setView('home');

  // Preload about page images and set ready when both loaded
  React.useEffect(() => {
    if (view !== 'about') {
      setAboutReady(false);
      return;
    }
    let cancelled = false;
    const urls = ['/assets/about-us-note.svg', '/assets/frame-10.svg'];
    const images = urls.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });
    let loaded = 0;
    const check = () => {
      loaded += 1;
      if (loaded === images.length && !cancelled) setAboutReady(true);
    };
    images.forEach((img) => {
      if (img.complete) check();
      else img.onload = check;
    });
    return () => { cancelled = true; };
  }, [view]);

  const enterBuilder = (tmpl: TemplateId) => {
    setTemplate(tmpl);
    setSelectedFrame('black');
    setTexture('white');
    setView('builder-loading');
  };

  // After 2.5s on builder-loading, show the builder
  React.useEffect(() => {
    if (view !== 'builder-loading') return;
    const id = window.setTimeout(() => setView('builder'), 2500);
    return () => clearTimeout(id);
  }, [view]);

  const handleDownloadFrame = React.useCallback(async () => {
    const el = exportContainerRef.current;
    if (!el) return;
    try {
      const isWhite = selectedFrame === 'white';
      const exportW = isWhite ? WHITE_FRAME_OVERLAY_WIDTH : BLACK_FRAME_OVERLAY_WIDTH;
      const exportH = isWhite ? WHITE_FRAME_OVERLAY_HEIGHT : BLACK_FRAME_OVERLAY_HEIGHT;
      const padW = (exportW - 318) / 2;
      const padH = (exportH - 415) / 2;
      const offsetX = padW;
      const offsetY = padH;

      const canvas = await html2canvas(el, {
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        scale: 3,
        logging: false,
        width: exportW,
        height: exportH,
        onclone(doc, clonedEl) {
          clonedEl.style.transform = 'none';
          clonedEl.style.overflow = 'hidden';
          clonedEl.style.width = `${exportW}px`;
          clonedEl.style.height = `${exportH}px`;
          clonedEl.style.minWidth = `${exportW}px`;
          clonedEl.style.maxWidth = `${exportW}px`;
          clonedEl.style.minHeight = `${exportH}px`;
          clonedEl.style.maxHeight = `${exportH}px`;
          clonedEl.style.boxSizing = 'border-box';

          // For the exported image only, force a safe system monospace font
          // (similar to Roboto Mono) so Safari doesn't involve external fonts.
          const exportRoot = clonedEl as HTMLElement;
          exportRoot.setAttribute('data-export-root', 'true');
          const styleNode = doc.createElement('style');
          styleNode.textContent = `
            [data-export-root="true"],
            [data-export-root="true"] * {
              font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
            }
          `;
          doc.head.appendChild(styleNode);

          const texture = clonedEl.querySelector('.memory-frame-texture') as HTMLElement | null;
          const board = clonedEl.querySelector('[class*="-frame-board"]') as HTMLElement | null;
          const overlay = clonedEl.querySelector('.memory-frame-overlay') as HTMLElement | null;
          if (texture) {
            texture.style.left = `${offsetX}px`;
            texture.style.top = `${offsetY}px`;
            texture.style.width = '318px';
            texture.style.height = '415px';
            texture.style.overflow = 'hidden';
          }
          if (board) {
            board.style.left = `${offsetX}px`;
            board.style.top = `${offsetY}px`;
            board.style.width = '318px';
            board.style.height = '415px';
            board.style.overflow = 'hidden';
          }
          if (overlay) {
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.left = '0';
            overlay.style.top = '0';
            overlay.style.right = '0';
            overlay.style.bottom = '0';
            overlay.style.transform = 'none';
            overlay.style.objectFit = 'fill';
            (overlay as HTMLImageElement).style.maxWidth = 'none';
            (overlay as HTMLImageElement).style.maxHeight = 'none';
          }
        },
      });
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
      }

      // Convert canvas to a PNG blob
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), 'image/png');
      });
      if (!blob) {
        throw new Error('Failed to create image blob');
      }

      const triggerDownload = (downloadBlob: Blob) => {
        const url = URL.createObjectURL(downloadBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'memory-frame.png';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      };

      try {
        const response = await fetch('/api/download-frame', {
          method: 'POST',
          headers: { 'Content-Type': 'image/png' },
          body: blob,
        });
        if (response.ok) {
          const downloadBlob = await response.blob();
          triggerDownload(downloadBlob);
          return;
        }
      } catch (_) {
        // API unavailable or failed: fall back to client-side download
      }
      triggerDownload(blob);
    } catch (err) {
      console.error('Export failed:', err);
      alert(
        err instanceof Error ? err.message : 'Export failed. Try again or use Chrome or Edge.'
      );
    }
  }, [selectedFrame]);

  return (
    <div className="app-root">
      <header className="app-header">
        <button
          type="button"
          className="app-title app-title-button"
          onClick={goHome}
        >
          Memory Frame
        </button>
        {view !== 'about' && (
          <button
            type="button"
            className="about-btn"
            onClick={() => {
              if (view === 'about') setView('home');
              else { setAboutReady(false); setView('about'); }
            }}
          >
            About
          </button>
        )}
      </header>

      {view === 'home' ? (
        <main className="home-main">
          <section className="home-intro">
            <p className="home-intro-title">Choose the story you&apos;re framing.</p>
            <p className="home-intro-subtitle">
              For the one you love, the family you grew with, or the friends who feel like home.
            </p>
          </section>

          <section className="template-grid">
            <button
              type="button"
              className="template-card template-card--partner"
              onClick={() => enterBuilder('partner')}
            >
              <div className="template-card-body template-card-body--friend">
                <img src="/assets/menu-partner.svg" alt="Partner frame preview" className="template-card-image" />
              </div>
              <span className="template-card-label">Partner</span>
            </button>

            <button
              type="button"
              className="template-card template-card--family"
              onClick={() => enterBuilder('family')}
            >
              <div className="template-card-body template-card-body--friend">
                <img src="/assets/menu-family.svg" alt="Family frame preview" className="template-card-image" />
              </div>
              <span className="template-card-label">Family</span>
            </button>

            <button
              type="button"
              className="template-card template-card--friend"
              onClick={() => enterBuilder('friend')}
            >
              <div className="template-card-body template-card-body--friend">
                <img src="/assets/menu-friends.svg" alt="Friend frame preview" className="template-card-image" />
              </div>
              <span className="template-card-label">Friend</span>
            </button>
          </section>
        </main>
      ) : view === 'about' ? (
        <main className="about-main">
          {!aboutReady ? (
            <div className="about-loading" aria-live="polite" aria-busy="true">
              <div className="about-loading-spinner" aria-hidden>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 4l4.5 9.3 10 1.5-7.2 7 1.7 10-9-4.7-9 4.7 1.7-10-7.2-7 10-1.5L24 4z" fill="url(#loading-gradient)" />
                  <defs>
                    <linearGradient id="loading-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#722f37" />
                      <stop offset="50%" stopColor="#8b3a42" />
                      <stop offset="100%" stopColor="#6b2830" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className="about-loading-text">Loading...</span>
            </div>
          ) : (
          <div className="about-layout">
            <div className="about-left">
              <div className="about-note-wrap">
                <img
                  src="/assets/about-us-note.svg"
                  alt="About us"
                  className="about-note-img"
                />
              </div>
              <div className="about-say-hi-wrap">
                <div className="about-say-hi-stars" aria-hidden>
                  <svg className="about-say-hi-star about-say-hi-star--1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="about-star-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#722f37" />
                        <stop offset="50%" stopColor="#8b3a42" />
                        <stop offset="100%" stopColor="#6b2830" />
                      </linearGradient>
                    </defs>
                    <path d="M12 2l2.5 5.1 5.5.8-4 3.9.9 5.4L12 14.2l-5 2.9.9-5.4-4-3.9 5.5-.8L12 2z" fill="url(#about-star-gradient)" />
                  </svg>
                  <svg className="about-say-hi-star about-say-hi-star--2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2l2.5 5.1 5.5.8-4 3.9.9 5.4L12 14.2l-5 2.9.9-5.4-4-3.9 5.5-.8L12 2z" fill="url(#about-star-gradient)" />
                  </svg>
                  <svg className="about-say-hi-star about-say-hi-star--3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2l2.5 5.1 5.5.8-4 3.9.9 5.4L12 14.2l-5 2.9.9-5.4-4-3.9 5.5-.8L12 2z" fill="url(#about-star-gradient)" />
                  </svg>
                </div>
                <section className="about-say-hi">
                  <h2 className="about-say-hi-title">Find us around the internet</h2>
                  <div className="about-say-hi-content">
                    <div className="about-say-hi-links">
                      <a
                        href="https://www.linkedin.com/in/haiqaahmed05/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="about-say-hi-link"
                      >
                        @Haiqa
                        <span className="about-say-hi-arrow" aria-hidden>↗</span>
                      </a>
                      <a
                        href="https://www.linkedin.com/in/hahmed08/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="about-say-hi-link"
                      >
                        @Hamna
                        <span className="about-say-hi-arrow" aria-hidden>↗</span>
                      </a>
                    </div>
                    <div className="about-say-hi-bear" aria-hidden>
                      <img
                        src="/assets/friend/bear.svg"
                        alt=""
                        className="about-say-hi-bear-img"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div className="about-say-hi-built">
                    <span className="about-say-hi-built-text">
                      Designed in Figma, brought to life with React.
                    </span>
                    <span className="about-say-hi-built-heart" aria-hidden>
                      ♡
                    </span>
                  </div>
                </section>
              </div>
            </div>
            <div className="about-frame-wrap">
              <button
                type="button"
                className="about-frame-link"
                onClick={goHome}
                aria-label="Back to home"
                title="Memory Frame"
              >
                <img
                  src="/assets/frame-10.svg"
                  alt="Memory Frame"
                  className="about-frame-img"
                />
              </button>
            </div>
          </div>
          )}
        </main>
      ) : view === 'builder-loading' ? (
        <main className="about-main">
          <div className="about-loading" aria-live="polite" aria-busy="true">
            <div className="about-loading-spinner" aria-hidden>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 4l4.5 9.3 10 1.5-7.2 7 1.7 10-9-4.7-9 4.7 1.7-10-7.2-7 10-1.5L24 4z" fill="url(#loading-gradient-builder)" />
                <defs>
                  <linearGradient id="loading-gradient-builder" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#722f37" />
                    <stop offset="50%" stopColor="#8b3a42" />
                    <stop offset="100%" stopColor="#6b2830" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="about-loading-text">Loading...</span>
          </div>
        </main>
      ) : (
        <>
          <main className="app-main">
            <section className="panel-overview">
              <div className="panel-overview__right">
                <div className="builder-sidebar">
                  <img
                    src="/assets/instruction-note.svg"
                    alt="How to use this frame"
                    className="instruction-note"
                  />
                  <aside className="frames-panel">
                    <p className="frames-panel-label">Frames</p>
                    <div className="frame-thumbnails">
                      {(['black', 'white'] as const).map((id) => (
                        <button
                          key={id}
                          type="button"
                          className={`frame-thumb ${selectedFrame === id ? 'frame-thumb--selected' : ''}`}
                          onClick={() => setSelectedFrame(id)}
                          aria-label={id === 'black' ? 'Black frame' : 'White frame'}
                        >
                          <img src={FRAME_ASSETS[id]} alt="" className="frame-thumb-img" />
                        </button>
                      ))}
                    </div>
                  </aside>
                </div>
                <div className="panel-content">
                  <div className="panel-content__center">
                    <div
                      ref={exportContainerRef}
                      className="memory-frame-wrap"
                      style={{
                        position: 'relative',
                        width: MEMORY_FRAME_WIDTH,
                        height: MEMORY_FRAME_HEIGHT,
                        flexShrink: 0,
                      }}
                    >
                      <div className={`memory-frame-texture texture--${texture}`} aria-hidden />
                      {template === 'partner' && <PartnerFrameBoard debug={false} />}
                      {template === 'friend' && <FriendFrameBoard debug={false} />}
                      {template === 'family' && <FamilyFrameBoard debug={false} />}
                      <img
                        src={FRAME_ASSETS[selectedFrame]}
                        alt=""
                        className={`memory-frame-overlay memory-frame-overlay--${selectedFrame}`}
                        aria-hidden
                      />
                    </div>
                  </div>
                  <div className="texture-strip">
                    {(['white', 'polka', 'stripes', 'olive'] as const).map((id) => (
                      <button
                        key={id}
                        type="button"
                        className={`texture-btn texture-btn--${id} ${texture === id ? 'texture-btn--selected' : ''}`}
                        onClick={() => setTexture(id)}
                        aria-label={`Texture ${id}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </main>

          <button
            type="button"
            className="download-icon"
            aria-label="Download frame as PNG"
            title="Download"
            onClick={handleDownloadFrame}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
