import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import type {
  UmkmBusiness,
  UmkmExplorerProps,
  UmkmFilterKey,
} from '../../types/site';

const FILTERS: ReadonlyArray<{ key: UmkmFilterKey; label: string }> = [
  { key: 'nglarangan', label: 'Nglarangan' },
  { key: 'kenteng-krajan', label: 'Kenteng Krajan' },
  { key: 'kenteng-wetan', label: 'Kenteng Wetan' },
  { key: 'belum-terverifikasi', label: 'Belum terverifikasi' },
];

const FILTER_KEYS = new Set<UmkmFilterKey>(FILTERS.map(({ key }) => key));

function makeInitialFilters(initialFilters?: readonly UmkmFilterKey[]) {
  if (!initialFilters) return new Set(FILTERS.map(({ key }) => key));
  return new Set(initialFilters.filter((key) => FILTER_KEYS.has(key)));
}

interface UmkmCardProps {
  business: UmkmBusiness;
  enhanced: boolean;
  flipped: boolean;
  onFlipChange: (flipped: boolean) => void;
}

function UmkmCard({ business, enhanced, flipped, onFlipChange }: UmkmCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const pointerFocusRef = useRef(false);
  const touchBlurRef = useRef(false);
  const activationPointerRef = useRef<string | null>(null);
  const rotation = useMotionValue(flipped ? 180 : 0);
  const edgeDistance = useTransform(rotation, (value) => Math.abs(90 - value) / 90);
  const cardScale = useTransform(edgeDistance, [0, 1], [0.955, 1]);
  const cardDepth = useTransform(edgeDistance, [0, 0.45, 1], [34, 12, 0]);
  const cardTilt = useTransform(rotation, [0, 45, 90, 135, 180], [0, -1.5, 0, 1.5, 0]);
  const lightOpacity = useTransform(edgeDistance, [0, 0.55, 1], [0.48, 0.12, 0]);
  const cardShadow = useTransform(edgeDistance, [0, 0.55, 1], [
    '0 26px 48px rgba(13, 47, 27, 0.30)',
    '0 18px 38px rgba(13, 47, 27, 0.21)',
    '0 8px 24px rgba(13, 47, 27, 0.12)',
  ]);

  const detailId = `umkm-detail-${business.id}`;
  const instructionId = `umkm-instruction-${business.id}`;

  useEffect(() => {
    const playback = animate(rotation, flipped ? 180 : 0, {
      duration: shouldReduceMotion ? 0.001 : 1,
      ease: [0.65, 0, 0.35, 1],
    });

    return () => playback.stop();
  }, [flipped, rotation, shouldReduceMotion]);

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    activationPointerRef.current = event.pointerType;
    touchBlurRef.current = event.pointerType === 'touch' || event.pointerType === 'pen';
    pointerFocusRef.current = true;
    window.setTimeout(() => {
      pointerFocusRef.current = false;
    }, 0);
  };

  const handleClick = () => {
    const pointerType = activationPointerRef.current;
    activationPointerRef.current = null;
    onFlipChange(pointerType === 'mouse' ? true : !flipped);
    if (touchBlurRef.current) {
      window.setTimeout(() => {
        touchBlurRef.current = false;
      }, 300);
    }
  };

  const handlePointerEnter = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse') onFlipChange(true);
  };

  const handlePointerLeave = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse') onFlipChange(false);
  };

  const handleFocus = () => {
    if (!pointerFocusRef.current) onFlipChange(true);
  };

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    if (touchBlurRef.current) return;
    if (!event.currentTarget.contains(event.relatedTarget)) onFlipChange(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onFlipChange(false);
    }
  };

  const faceBase = enhanced
    ? 'absolute inset-0 flex min-h-[26rem] flex-col overflow-hidden rounded-card border bg-white [backface-visibility:hidden] [-webkit-backface-visibility:hidden]'
    : 'relative flex flex-col overflow-hidden rounded-card border bg-white';
  const uncertainBorder = business.uncertain ? 'border-amber-300' : 'border-line';

  return (
    <div
      data-umkm-card-shell
      className="relative h-full [perspective:1100px] [perspective-origin:50%_48%]"
      onPointerEnter={enhanced ? handlePointerEnter : undefined}
      onPointerLeave={enhanced ? handlePointerLeave : undefined}
    >
      <motion.article
        data-umkm-card
        data-umkm-id={business.id}
        data-umkm-flip-surface
        data-flipped={enhanced ? String(flipped) : undefined}
        className={`group relative h-full min-w-0 rounded-card ${
          enhanced ? 'min-h-[26rem] cursor-pointer touch-manipulation' : ''
        }`}
        style={
          enhanced
            ? {
                rotateY: rotation,
                rotateX: shouldReduceMotion ? 0 : cardTilt,
                z: shouldReduceMotion ? 0 : cardDepth,
                scale: shouldReduceMotion ? 1 : cardScale,
                boxShadow: shouldReduceMotion
                  ? '0 8px 24px rgba(13, 47, 27, 0.12)'
                  : cardShadow,
                transformStyle: 'preserve-3d',
                transformOrigin: '50% 50%',
                willChange: 'transform',
              }
            : undefined
        }
      >
        <section
          data-umkm-face="front"
          aria-hidden={enhanced ? flipped : undefined}
          className={`${faceBase} ${uncertainBorder}`}
          style={enhanced ? { transform: 'rotateY(0deg) translateZ(2px)', backfaceVisibility: 'hidden' } : undefined}
        >
          <div className="relative overflow-hidden bg-kenteng-50">
            <img
              src={business.image}
              alt={business.imageAlt}
              width="640"
              height="480"
              loading="lazy"
              decoding="async"
              className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <span
              className={`absolute left-3 top-3 max-w-[calc(100%-1.5rem)] rounded-full px-3 py-1 text-[0.68rem] font-extrabold uppercase leading-snug tracking-[0.05em] shadow-card ${
                business.uncertain
                  ? 'bg-amber-50/95 text-amber-900'
                  : 'bg-white/95 text-kenteng-800'
              }`}
            >
              {business.category}
            </span>
          </div>
          <div className="px-5 pb-3 pt-5">
            <h3 className="text-lg font-extrabold leading-snug text-kenteng-950">
              {business.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              <span className="font-bold text-ink">Produk utama: </span>
              {business.product}
            </p>
          </div>
          {enhanced && (
            <span className="mt-auto flex items-center gap-2 px-5 pb-5 text-xs font-bold text-muted" aria-hidden="true">
              <svg className="text-kenteng-700" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 7v5h-5" />
                <path d="M19 12a7 7 0 1 1-2.05-4.95L20 10" />
              </svg>
              Putar kartu untuk detail
            </span>
          )}
        </section>

        <section
          data-umkm-face="back"
          id={detailId}
          aria-hidden={enhanced ? !flipped : undefined}
          className={`${faceBase} ${uncertainBorder} ${
            enhanced ? 'bg-surface-soft' : 'mt-3 bg-surface-soft'
          }`}
          style={enhanced ? { transform: 'rotateY(180deg) translateZ(2px)', backfaceVisibility: 'hidden' } : undefined}
        >
          <div className="flex min-h-full flex-1 flex-col p-6">
            <span
              className={`self-start rounded-full px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.05em] ${
                business.uncertain
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-kenteng-100 text-kenteng-800'
              }`}
            >
              Detail usaha
            </span>
            <h4 className="mt-4 text-lg font-extrabold leading-snug text-kenteng-950">
              {business.name}
            </h4>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-muted">
              {business.product}
            </p>
            <dl className="mt-auto grid gap-3 border-t border-line pt-5 text-sm">
              <div className="grid grid-cols-[minmax(5rem,0.7fr)_minmax(0,1.3fr)] gap-3">
                <dt className="text-muted">{business.established.label}</dt>
                <dd className="min-w-0 [overflow-wrap:anywhere] font-bold text-ink">
                  {business.established.value}
                </dd>
              </div>
              <div className="grid grid-cols-[minmax(5rem,0.7fr)_minmax(0,1.3fr)] gap-3">
                <dt className="text-muted">Legalitas</dt>
                <dd className="min-w-0 [overflow-wrap:anywhere] font-bold text-ink">
                  {business.legalStatus}
                </dd>
              </div>
              <div className="grid grid-cols-[minmax(5rem,0.7fr)_minmax(0,1.3fr)] gap-3">
                <dt className="text-muted">{business.location.label}</dt>
                <dd className="min-w-0 [overflow-wrap:anywhere] font-bold text-ink">
                  {business.location.value}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {enhanced && !shouldReduceMotion && (
          <>
            <motion.span
              data-umkm-lighting
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10 rounded-card bg-gradient-to-r from-transparent via-white to-kenteng-950 mix-blend-soft-light [backface-visibility:hidden]"
              style={{ opacity: lightOpacity, transform: 'translateZ(2px)' }}
            />
            <motion.span
              data-umkm-lighting
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10 rounded-card bg-gradient-to-l from-transparent via-white to-kenteng-950 mix-blend-soft-light [backface-visibility:hidden]"
              style={{ opacity: lightOpacity, transform: 'rotateY(180deg) translateZ(2px)' }}
            />
          </>
        )}
      </motion.article>
      {enhanced && (
        <>
          <button
            data-umkm-flip-control
            type="button"
            aria-label={`${flipped ? 'Tutup' : 'Buka'} detail UMKM ${business.name}, produk ${business.product}`}
            aria-expanded={flipped}
            aria-controls={detailId}
            aria-describedby={instructionId}
            onClick={handleClick}
            onPointerDown={handlePointerDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="absolute inset-0 z-20 cursor-pointer rounded-card border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
          />
          <span id={instructionId} className="sr-only">
            Gunakan Enter atau Spasi untuk membalik kartu dan Escape untuk menutup detail.
          </span>
        </>
      )}
    </div>
  );
}

export default function UmkmExplorer({ businesses, initialFilters }: UmkmExplorerProps) {
  const shouldReduceMotion = useReducedMotion();
  const [enhanced, setEnhanced] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Set<UmkmFilterKey>>(() =>
    makeInitialFilters(initialFilters),
  );
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);

  useEffect(() => setEnhanced(true), []);

  useEffect(() => {
    const closeOnOutsideInteraction = (event: globalThis.PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || !target.closest('[data-umkm-card-shell]')) {
        setFlippedCardId(null);
      }
    };

    document.addEventListener('pointerdown', closeOnOutsideInteraction);
    return () => document.removeEventListener('pointerdown', closeOnOutsideInteraction);
  }, []);

  const counts = useMemo(() => {
    const result = new Map<UmkmFilterKey, number>(FILTERS.map(({ key }) => [key, 0]));
    businesses.forEach(({ location }) => {
      result.set(location.filterKey, (result.get(location.filterKey) ?? 0) + 1);
    });
    return result;
  }, [businesses]);

  const visibleBusinesses = useMemo(
    () => businesses.filter(({ location }) => selectedFilters.has(location.filterKey)),
    [businesses, selectedFilters],
  );

  const allPressed: boolean | 'mixed' =
    selectedFilters.size === FILTERS.length
      ? true
      : selectedFilters.size === 0
        ? false
        : 'mixed';

  const selectAll = () => {
    setFlippedCardId(null);
    setSelectedFilters((current) =>
      current.size === FILTERS.length
        ? new Set<UmkmFilterKey>()
        : new Set(FILTERS.map(({ key }) => key)),
    );
  };

  const toggleFilter = (key: UmkmFilterKey) => {
    setFlippedCardId(null);
    setSelectedFilters((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const layoutTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 360, damping: 34, mass: 0.75 };

  return (
    <section
      aria-label="Direktori UMKM Desa Kentengsari"
      className="min-w-0"
      data-umkm-explorer
      data-motion-ready={enhanced ? 'true' : 'false'}
    >
      <fieldset className="rounded-card border border-line bg-white p-4 shadow-card sm:p-5">
        <legend className="px-2 text-sm font-extrabold text-kenteng-950">
          Saring UMKM berdasarkan dusun
        </legend>
        <div className="grid gap-2 sm:flex sm:flex-wrap">
          <button
            type="button"
            disabled={!enhanced}
            aria-controls="umkm-grid"
            aria-pressed={allPressed}
            onClick={selectAll}
            className={`flex min-h-11 items-center justify-between gap-3 rounded-xl border px-4 py-2 text-sm font-bold transition-colors disabled:cursor-wait disabled:opacity-70 sm:justify-start ${
              allPressed === true
                ? 'border-kenteng-700 bg-kenteng-700 text-white shadow-card'
                : allPressed === 'mixed'
                  ? 'border-amber-400 bg-amber-50 text-amber-950'
                  : 'border-line bg-white text-kenteng-950 hover:border-kenteng-500'
            }`}
          >
            <span>Semua</span>
            <strong className="min-w-7 rounded-full bg-white/90 px-2 py-0.5 text-center text-xs text-kenteng-800">
              {businesses.length}
            </strong>
          </button>
          {FILTERS.map(({ key, label }) => {
            const pressed = selectedFilters.has(key);
            return (
              <button
                key={key}
                type="button"
                disabled={!enhanced}
                aria-controls="umkm-grid"
                aria-pressed={pressed}
                onClick={() => toggleFilter(key)}
                className={`flex min-h-11 items-center justify-between gap-3 rounded-xl border px-4 py-2 text-sm font-bold transition-colors disabled:cursor-wait disabled:opacity-70 sm:justify-start ${
                  pressed
                    ? 'border-kenteng-700 bg-kenteng-700 text-white shadow-card'
                    : 'border-line bg-white text-kenteng-950 hover:border-kenteng-500'
                }`}
              >
                <span>{label}</span>
                <strong className="min-w-7 rounded-full bg-white/90 px-2 py-0.5 text-center text-xs text-kenteng-800">
                  {counts.get(key) ?? 0}
                </strong>
              </button>
            );
          })}
        </div>
      </fieldset>

      <p className="my-4 text-sm font-extrabold text-kenteng-950" role="status" aria-live="polite">
        {visibleBusinesses.length} usaha ditampilkan
      </p>

      <AnimatePresence initial={false}>
        {visibleBusinesses.length === 0 && (
          <motion.div
            key="empty"
            role="status"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.18 }}
            className="rounded-card border border-kenteng-100 bg-kenteng-50 p-6 text-center"
          >
            <h3 className="font-extrabold text-kenteng-950">Tidak ada usaha yang ditampilkan</h3>
            <p className="mt-1 text-sm text-muted">Pilih setidaknya satu dusun untuk melihat daftar UMKM.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.ul
        id="umkm-grid"
        aria-label={`${visibleBusinesses.length} UMKM ditampilkan`}
        className="grid min-w-0 list-none grid-cols-1 gap-5 p-0 md:grid-cols-2 xl:grid-cols-3"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {visibleBusinesses.map((business) => (
            <motion.li
              layout="position"
              key={business.id}
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.94, y: -10, transition: { duration: 0.18 } }
              }
              transition={layoutTransition}
              className="min-w-0"
            >
              <UmkmCard
                business={business}
                enhanced={enhanced}
                flipped={flippedCardId === business.id}
                onFlipChange={(next) => setFlippedCardId(next ? business.id : null)}
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </section>
  );
}
