import logoUrl from '../assets/brand/dodgy-ducks-logo.webp';

export default function TeamName() {
  return (
    <main className='grid gap-6'>
      <section className='bg-white rounded-2xl p-8 md:p-10 shadow-2xl ring-1 ring-white/60'>
        <div className='text-sm font-bold uppercase tracking-[0.25em] text-primary mb-4'>
          Team Identity
        </div>
        <h2 className='font-display font-normal tracking-wide text-4xl md:text-5xl text-gray-900 leading-tight mb-5'>
          We are the Dodgy Ducks 🦆
        </h2>
        <p className='text-lg text-gray-700 leading-relaxed mb-8'>
          A Toronto dragon boat team: slightly dodgy, seriously fun.
        </p>
        <img
          src={logoUrl}
          alt='Dodgy Ducks Toronto logo: a duck in a cap and sunglasses paddling past the Toronto skyline'
          className='mx-auto w-full max-w-3xl object-contain'
        />
      </section>
    </main>
  );
}
