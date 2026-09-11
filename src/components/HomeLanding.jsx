export default function HomeLanding({ onViewSeason }) {
  return (
    <main className='grid gap-6'>
      <section className='grid gap-6 lg:grid-cols-[1.15fr_0.85fr] items-stretch'>
        <div className='bg-white/95 rounded-2xl p-8 md:p-10 shadow-2xl overflow-hidden'>
          <div className='grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-center'>
            <div>
              <div className='text-sm font-bold uppercase tracking-[0.25em] text-primary mb-4'>
                Dragonboat Team
              </div>
              <h2 className='text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-5'>
                Welcome to Name TBD Dragonboat!
              </h2>
              <p className='text-lg md:text-xl text-gray-700 leading-relaxed mb-6'>
                We are (going to be) a recreational dragon boat team dedicated
                to athletic development, social connection and friendship,
                travel, and having fun!
              </p>
              <p className='text-gray-600 leading-relaxed mb-8'>
                The Team seeks to improve over time and to race to the best of
                its ability. Competitive results, however, shall not take
                priority over inclusion, development, sportsmanship, member
                well-being, or enjoyment of the sport.
              </p>
              <button
                type='button'
                onClick={onViewSeason}
                className='bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all'
              >
                Compare season plans
              </button>
            </div>

            <img
              src='/unknownTeam.png'
              alt='Unknown team mascot'
              className='hidden lg:block h-full max-h-[360px] w-full rounded-[1.5rem] object-cover shadow-xl ring-1 ring-gray-200'
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
            <p>
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
          <div className='bg-slate-950/35 backdrop-blur-md border border-white/30 rounded-2xl p-6 text-white shadow-xl'>
            <h3 className='text-2xl font-bold mb-3'>Practice Locations</h3>
            <p>(Plans are subject to change)</p>
            <br />
            <ul className='space-y-2 text-white/85 list-disc list-inside'>
              <li>
                Dragonboat @{' '}
                <a
                  href='https://maps.app.goo.gl/LCuz7q3Zhu38zz8G9'
                  target='_blank'
                  rel='noreferrer'
                  className='font-bold underline decoration-white/50 underline-offset-4 transition hover:text-white hover:decoration-white'
                >
                  Sunnyside Paddling Club
                </a>
              </li>
              <li>
                Outrigger @{' '}
                <a
                  href='https://maps.app.goo.gl/LCuz7q3Zhu38zz8G9'
                  target='_blank'
                  rel='noreferrer'
                  className='font-bold underline decoration-white/50 underline-offset-4 transition hover:text-white hover:decoration-white'
                >
                  Sunnyside Paddling Club
                </a>
              </li>
              <li>
                Dryland @{' '}
                <a
                  href='https://maps.app.goo.gl/BQkjumjqNcnr3qE39'
                  target='_blank'
                  rel='noreferrer'
                  className='font-bold underline decoration-white/50 underline-offset-4 transition hover:text-white hover:decoration-white'
                >
                  Afterburn Fitness?
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </section>

      <section className='grid gap-6 xl:grid-cols-2'>
        <article className='bg-white/95 rounded-2xl p-8 shadow-2xl ring-1 ring-white/60'>
          <div className='mb-4 inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-primary'>
            What is Dragonboat?
          </div>
          <div className='space-y-4 text-gray-700 leading-relaxed'>
            <p>
              Dragonboat is a tournament-based team racing water sport, where
              crews of 12, 22, or even 53 athletes race in a variety of
              distances at regattas.
            </p>
            <p>Here's what it looks like in action:</p>
            <div className='aspect-video overflow-hidden rounded-2xl bg-gray-900 shadow-xl ring-1 ring-gray-200'>
              <iframe
                src='https://www.youtube.com/embed/-zBYMr-b37I'
                title='What is Dragonboat?'
                className='h-full w-full'
                loading='lazy'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                referrerPolicy='strict-origin-when-cross-origin'
                allowFullScreen
              />
            </div>
            <p>
              The sport heavily relies on synchronization, endurance, and timing
              rather than individual strength. Dragonboat is one of the few team
              sports where there is no such thing as a “superstar” on a team,
              which is why it is hailed as one of the most accessible and
              inclusive sports in the world. The sport features scalable
              intensity, light joint impact and seated paddling positions,
              allowing people of diverse backgrounds to participate. The IDBF
              competitions feature divisions specifically for older adults 40+,
              50+ and 60+, Breast Cancer Survivors, Prostate Cancer Survivors,
              and Paradragons featuring athletes with visual or physical
              impairments.
            </p>
            <p>
              That being said, Dragonboat Is a full body workout. Quads, glutes,
              triceps, lats, biceps, delts, and abdominals area all engaged in
              this dynamic sport. It's also a cardio and endurance workout with
              a wide range of race distances, from a 100m sprint, to a 2k
              endurance piece. It’s cardio, strength, and flexibility all
              wrapped up in an awesome, fun, and challenging workout!
            </p>
          </div>
        </article>

        <article className='bg-white/95 rounded-2xl p-8 shadow-2xl ring-1 ring-white/60'>
          <div className='mb-4 inline-flex rounded-full bg-secondary/10 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-secondary'>
            History
          </div>
          <div className='text-gray-700 leading-relaxed'>
            <video
              className='mb-5 aspect-square w-full rounded-2xl object-cover shadow-xl ring-1 ring-gray-200 md:float-right md:ml-6 md:mb-4 md:w-1/2'
              autoPlay
              muted
              loop
              playsInline
              preload='metadata'
              aria-label='Dragon boat festival footage'
            >
              <source src='/hkfestbefore.mp4' type='video/mp4' />
              <source src='/hkfestbefore.mov' type='video/quicktime' />
            </video>
            <p>
              The first evidence of dragonboats dates back over 2500 years. The
              boats have their origins in the Pearl River Delta region of
              today’s southern China (Guangzhou, Shenzhen, Hong Kong SAR, Macao
              SAR). Evidence points to agricultural communities setting off in
              Dragonboats and beating on drums during the summer solstice as a
              fertility rite to awaken deities, praying for rain, and for a
              plentiful harvest.
            </p>
            <p className='mt-4'>
              The origins of the Tuen Ng festival (Dragon boat festival in June)
              follows the legend of Qu Yuan, who was a poet and minister of the
              State of Chu, during China’s warring states period. In 278BCE
              following the fall of Qu Yuan’s homeland, he drowned himself in a
              river as a form of political protest. Local villagers rushed out
              in their boats, beating drums and splashing their paddles to ward
              off bad spirits and stopping fish from eating his body. They also
              threw rice bundles (zhongzi) into the lake to feed the fish so
              they wouldn’t eat his remains. Since then, Tuen Ng festival has
              become a national holiday in China, where it is celebrated with
              dragonboat races, feasts, and celebration of the summer solstice.
              It is also widely celebrated by the Chinese diaspora globally,
              such as right here in Canada!
            </p>
            <p className='mt-4'>
              Canada played a huge role in transforming Dragonboat into a global
              competitive sport. Dragonboat first made its way to Canada in
              1986, during the World Expo in Vancouver, BC, where Hong Kong
              gifted 6 teak Dragonboats to Canada, hosting the first ever dragon
              boat festival in Canada. In 1996, the International Dragonboat
              Federation hosted the first ever Club Crew World championships in
              Vancouver. Today, the Concord Pacific International Dragonboat
              Festival and Toronto Island Dragonboat festivals are two of the
              world’s largest Dragonboat festivals outside of Asia.
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}
