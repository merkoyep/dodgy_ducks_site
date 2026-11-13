import logoUrl from '../assets/brand/dodgy-ducks-logo.webp';

export default function HomeLanding({ onViewSeason, seasonButtonLabel = 'View season schedule' }) {
  return (
    <main className='grid gap-6'>
      <section className='grid gap-6 lg:grid-cols-[1.15fr_0.85fr] items-stretch'>
        <div className='bg-white rounded-2xl p-8 md:p-10 shadow-2xl overflow-hidden'>
          <div className='grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-center'>
            <div>
              <div className='text-sm font-bold uppercase tracking-[0.25em] text-primary mb-4'>
                Toronto Dragon Boat
              </div>
              <h2 className='font-display font-normal tracking-wide text-4xl md:text-5xl text-gray-900 leading-tight mb-5'>
                Welcome to the Dodgy Ducks!
              </h2>
              <p className='text-lg md:text-xl text-gray-700 leading-relaxed mb-8'>
                The Dodgy Ducks are a recreational dragon boat team based in
                Toronto, dedicated to athletic development, social connection
                and friendship, travel, and having fun!
              </p>
              <button
                type='button'
                onClick={onViewSeason}
                className='bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all'
              >
                {seasonButtonLabel}
              </button>
            </div>

            <img
              src={logoUrl}
              alt='Dodgy Ducks Toronto logo: a duck in a cap and sunglasses paddling past the Toronto skyline'
              className='h-full max-h-[220px] lg:max-h-[360px] w-full object-contain'
            />
          </div>
        </div>

        <aside className='grid gap-5'>
          <div className='bg-slate-950/35 backdrop-blur-md border border-white/30 rounded-2xl p-6 text-white shadow-xl'>
            <h3 className='text-2xl font-bold mb-3'>Commitment</h3>
            <p className='text-white/85 leading-relaxed'>
              We get it, life is kind of crazy, so things come up! Just always
              give us a heads up because we have to balance boats, meet
              rostering requirements, and we'd like to make sure you're not dead
              in a ditch somewhere 😁.
            </p>
            <p className='text-white/85 leading-relaxed mt-4'>
              The current proposed season plan is to have team dragonboat
              practices 1x per week, and an optional outrigger canoe practice on
              a drop-in basis. This way, we can keep mandatory costs low for
              everyone, and provide small group coaching for those interested.
            </p>
            <p className='text-white/85 leading-relaxed mt-4'>
              We’re asking our athletes to attend at least 1 practice per week,
              the training camp if applicable, and commit to attending the
              regattas. We aim to always announce all regattas by December 31 of
              each prior year so that everyone has plenty of time to plan ahead.
              It is our expectation that all athletes book off these weekends
              ahead of time. And if things come up, find a sub!
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
