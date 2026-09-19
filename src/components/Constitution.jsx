import { useEffect, useState } from 'react';

const constitutionArticles = [
  {
    roman: 'I',
    title: 'Name and Purpose',
    vibe: 'Who we are and why the boat exists.',
    emoji: '🐉',
    accent: 'from-cyan-400 to-blue-500',
    sections: [
      {
        number: 1,
        title: 'Name',
        body: [
          'The name of the team shall be determined by the founding membership and thereafter may be changed in accordance with this Constitution.',
        ],
      },
      {
        number: 2,
        title: 'Purpose',
        body: [
          '[Team Name] (“the Team”) is a recreational and social dragon boat team dedicated to:',
          ['athletic development;', 'social connection and friendship;', 'shared experiences and travel; and', 'above all, having fun.'],
          'The Team seeks to improve over time and to race to the best of its ability. Competitive results, however, shall not take priority over inclusion, development, sportsmanship, member well-being, or enjoyment of the sport.',
          'The Team is not intended to operate as an elite or high-performance racing program.',
        ],
      },
    ],
  },
  {
    roman: 'II',
    title: 'Values and Team Culture',
    vibe: 'Inclusion, development, constructive feedback, no blame.',
    emoji: '✨',
    accent: 'from-fuchsia-400 to-pink-500',
    sections: [
      {
        number: 3,
        title: 'Inclusion',
        body: [
          'The Team is committed to inclusion regardless of race, ethnicity, nationality, sex, gender identity or expression, sexual orientation, or paddling experience.',
          'Discrimination, harassment, exclusionary behaviour, or hostility based on these characteristics is inconsistent with membership in the Team.',
        ],
      },
      {
        number: 4,
        title: 'Beginners and Development',
        body: [
          'Prior dragon boat experience is not required for membership.',
          'The Team welcomes beginners and recognizes athletic development as a core purpose of the program. Members are expected to support the development of paddlers of all experience levels.',
          'Experience, speed, or athletic ability does not entitle a member to greater status within the Team.',
        ],
      },
      {
        number: 5,
        title: 'Growth Mindset',
        body: [
          'Members are expected to:',
          [
            'assume positive intent where reasonable;',
            'give and receive feedback constructively;',
            'remain receptive to coaching;',
            'support the development of teammates;',
            'reflect on their own performance;',
            'ask questions and contribute to team learning; and',
            'approach mistakes as opportunities for improvement.',
          ],
        ],
      },
      {
        number: 6,
        title: 'Feedback Without Blame',
        body: [
          'The Team encourages paddlers to learn how to understand the boat, recognize effective technique, and provide constructive peer feedback.',
          'Members are expected to give one another constructive peer feedback where appropriate, in the spirit of shared learning and team improvement.',
          'Feedback must be focused on improvement rather than blame.',
          'Members must not belittle, berate, scapegoat, or personally attack another paddler for the performance of the boat.',
          'Ultimate technical direction remains the responsibility of the Coach.',
        ],
      },
    ],
  },
  {
    roman: 'III',
    title: 'Membership',
    vibe: 'Joining, rejoining, team fit, and good standing.',
    emoji: '🤝',
    accent: 'from-emerald-300 to-teal-500',
    sections: [
      { number: 7, title: 'Eligibility', body: ['Membership may be offered by application, invitation, trial practice, or another recruitment process established by the Executive.', 'Attendance at a trial practice does not guarantee an offer of membership.'] },
      {
        number: 8,
        title: 'Team Fit Assessment',
        body: [
          "Because the Team's social culture is a core part of its purpose, prospective members may be assessed for both functional paddling readiness and compatibility with the Team's values.",
          'Factors may include:',
          [
            'respectful interaction with others;',
            'contribution to an inclusive environment;',
            'sportsmanship;',
            'receptiveness to coaching and feedback;',
            'collaborative attitude;',
            'willingness to learn and improve;',
            'participation in the social environment of the Team; and',
            'ability to meet the functional requirements of a dragon boat practice.',
          ],
          'Membership decisions shall not be based on protected identities listed in Article II.',
          'The Executive shall make final decisions regarding admission of new members.',
        ],
      },
      {
        number: 9,
        title: 'Functional Paddling Readiness',
        body: [
          'The Team does not require applicants to meet elite fitness or performance benchmarks.',
          'At a trial practice, the Coach may consider whether an applicant demonstrates the ability or reasonable potential to:',
          [
            "Understand, develop, and apply the Team's paddling technique;",
            'Engage appropriate muscle groups through the stroke;',
            'Respond to technical instruction; and',
            'Safely participate in the majority of a regular practice without requiring repeated withdrawal from activity.',
          ],
          'Potential for development may be considered alongside current ability.',
        ],
      },
      {
        number: 10,
        title: 'Continuing Membership',
        body: [
          'Members are entitled to return in subsequent seasons unless they:',
          ['resign;', 'are removed in accordance with this Constitution; or', 'fail to confirm their intention to participate.'],
          'A former member who has resigned may seek to rejoin the Team.',
          'Where practice or race capacity is limited, declared availability and ability to participate in upcoming regattas may affect roster priority.',
        ],
      },
      {
        number: 11,
        title: 'Member in Good Standing',
        body: [
          'A member is considered in good standing where they:',
          [
            'are an active member of the Team and have not resigned without subsequently rejoining;',
            'are not currently suspended; and',
            'are current on required team payments or are complying with an approved payment arrangement.',
          ],
        ],
      },
    ],
  },
  {
    roman: 'IV',
    title: 'Participation and Attendance',
    vibe: 'Show up, communicate, and make space for real life.',
    emoji: '📆',
    accent: 'from-amber-300 to-orange-500',
    sections: [
      {
        number: 12,
        title: 'Regular Participation',
        body: [
          "The expected in-season commitment is an average of at least one Team training session per week from May through September.",
          "The primary training session is the Team's dragon boat practice.",
          "Where a member cannot attend that week's dragon boat practice, participation in a Team outrigger canoe practice may count toward the weekly participation expectation.",
          'Life circumstances, illness, work, travel, injuries, mental health, family responsibilities, and other reasonable circumstances may affect attendance. Attendance concerns should be addressed with flexibility and good judgment rather than automatic discipline.',
          'Persistent inability to participate may, however, affect practice or race rostering.',
        ],
      },
      {
        number: 13,
        title: 'Communication of Absences',
        body: [
          "Members are responsible for keeping their availability reasonably current using the Team's designated attendance or signup system.",
          'Members should remove themselves from practices they know they cannot attend as soon as reasonably possible.',
          'Repeated uncommunicated absences may be addressed by the Coach or Executive where they materially affect the operation of the Team.',
        ],
      },
    ],
  },
  {
    roman: 'V',
    title: 'Regattas and Rostering',
    vibe: 'How we choose races and build crews.',
    emoji: '🚣',
    accent: 'from-sky-300 to-indigo-500',
    sections: [
      { number: 14, title: 'Core Regattas', body: ['The Team shall normally designate core regattas for the upcoming season.', 'During the founding season, these regattas shall be selected by the membership.', 'In subsequent seasons, local core regattas may be selected by the Executive.'] },
      { number: 15, title: 'Travel Regatta', body: ['The Team may designate an additional travel or international regatta.', 'Participation in a travel regatta is optional in recognition of financial limitations, work obligations, vacation availability, immigration or travel requirements, and other personal circumstances.', 'The travel regatta shall be selected by a vote of the membership at the AGM.'] },
      {
        number: 16,
        title: 'Race Commitment',
        body: [
          'Members should declare their intended participation in core regattas by January 1 or another deadline established by the Executive.',
          'The Team recognizes that circumstances may change between commitment and race day.',
          'A later withdrawal shall not constitute misconduct. However:',
          ['costs already committed on behalf of the paddler may be non-refundable; and', 'known race availability may be considered when allocating limited practice opportunities.'],
        ],
      },
      { number: 17, title: 'Rostering Authority', body: ['Race rosters, practice rosters, seat assignments, sides, lineups, and on-water crew configurations are the responsibility of the Coach.', 'These decisions are not subject to membership or Executive vote.'] },
      {
        number: 18,
        title: 'Rostering Philosophy',
        body: [
          'Rostering decisions may consider:',
          ['attendance and commitment;', 'individual improvement;', 'development opportunities;', 'paddling experience, including lack of experience;', 'equitable access to racing opportunities;', 'crew balance;', 'race availability;', 'safety;', 'the developmental needs of the Team; and', 'other relevant coaching considerations.'],
          'The Team explicitly rejects the principle that the most experienced or highest-performing paddlers must automatically receive priority.',
          'Where appropriate, less experienced paddlers may be deliberately prioritized for racing or practice opportunities to support their development.',
          'No member is guaranteed a particular seat, side, lineup, crew, or racing opportunity solely because of seniority or performance.',
        ],
      },
      { number: 19, title: 'Multiple Boats', body: ['All crews operated by the Team remain part of one Team.', 'Where membership permits the registration of multiple boats, the Coach may organize crews based on development, participation, race category, safety, logistics, and the needs of the Team.', 'Crews shall not automatically be designated or treated as permanent “A” and “B” teams.'] },
    ],
  },
  {
    roman: 'VI',
    title: 'Leadership',
    vibe: 'The Executive, Captain, and Coach lanes.',
    emoji: '🧭',
    accent: 'from-violet-300 to-purple-600',
    sections: [
      {
        number: 20,
        title: 'Executive',
        body: ['The Team shall be governed by a five-member Executive consisting of:', ['Captain', 'Lead of FUN', 'Lead of Marketing', 'Lead of Team Management', 'Lead of External Relations'], 'All Leads are expected to assist one another as required. Portfolio responsibilities establish primary accountability, not rigid boundaries between Leads.'],
      },
      { number: 21, title: 'Captain', body: ['The Captain is elected by the membership.', 'The Captain is responsible for leadership of the Team and serves concurrently as Lead of Finance.', 'Where the Captain is not also the Coach, coaching authority remains with the Coach.'] },
      { number: 22, title: 'Coach', body: ['The Coach is appointed by the Executive.', 'The Captain and Coach may be the same individual but are separate offices deriving authority separately:', ['the Captain derives authority through election by the membership; and', 'the Coach derives authority through appointment by the Executive.'], 'The Executive may therefore appoint or replace a Coach independently of the Captain election.'] },
      { number: 23, title: 'Exclusive Coaching Authority', body: ['The Coach has final authority over:', ['practice programming and technical coaching;', 'race and practice rostering;', 'seat assignments and crew configuration;', 'attendance management as it relates to training;', 'athletic and paddler development;', 'technical standards; and', 'on-water safety decisions.'], 'These coaching decisions are not subject to Executive veto.', "Matters outside the Coach's defined authority remain subject to the normal governance of the Executive."] },
    ],
  },
  {
    roman: 'VII',
    title: 'Executive Portfolios',
    vibe: 'The glorious portfolio titles and what each owns.',
    emoji: '🎛️',
    accent: 'from-rose-300 to-red-500',
    sections: [
      { number: 24, title: 'Coach Capt.', body: ['Responsibilities include:', ['Attendance', 'practice programming and technical coaching;', 'race and practice rostering;', 'seat assignments and crew configuration;', 'attendance management as it relates to training;', 'athletic and paddler development;', 'technical standards;', 'Team leadership.']] },
      { number: 25, title: 'Chief Officer of FUN', body: ['Responsibilities include:', ['training camp programming;', 'Team sports days;', 'FUNdraising;', 'social activities; and', 'restaurant and social reservations.']] },
      { number: 26, title: 'Director of Brand, Lore, and Propaganda', body: ['Responsibilities include:', ['content generation;', 'sponsorship relationships;', 'social media engagement;', 'fulfillment of marketing-related sponsorship obligations;', 'uniforms;', 'design; and', 'merchandising.']] },
      { number: 27, title: 'Chief Chaos Coordinator', body: ['Responsibilities include:', ['race-day registration;', 'marshalling management;', 'accommodation and room allocations;', 'transportation and vehicle allocations;', 'manager meetings; and', 'visas, electronic travel authorizations, and other international travel requirements.']] },
      { number: 28, title: 'Director of Fiscal Vibes', body: [['Budgeting;', 'payment tracking and reconciliation;', 'purchasing and financial administration;', 'preparation of financial reports;', 'serving as or coordinating official signing officers;']] },
      { number: 29, title: 'Shared Executive Responsibilities', body: ['The Executive collectively shares responsibility for:', ['recruitment and retention;', 'Team Fit Assessments and paddler assessments;', 'preparation and approval of proposed budget amendments;', "safeguarding the Team's culture;", 'responding to member concerns;', 'disciplinary decisions; and', 'administration not assigned exclusively to an executive member.']] },
    ],
  },
  {
    roman: 'VIII',
    title: 'Executive Decision-Making',
    vibe: 'Portfolio authority, review, quorum, conflicts.',
    emoji: '⚖️',
    accent: 'from-lime-300 to-green-500',
    sections: [
      { number: 30, title: 'Portfolio Authority', body: ['A Lead has ordinary decision-making authority within their assigned portfolio where the decision:', ['is consistent with this Constitution;', 'complies with Team policies;', 'falls within the approved budget; and', "does not materially affect another Lead's portfolio."], 'Leads should consult one another where responsibilities overlap.'] },
      { number: 31, title: 'Executive Review', body: ['A portfolio decision may be reviewed or overturned by a majority of the Executive.', 'This does not apply to matters reserved exclusively to the Coach under Article VI.'] },
      { number: 32, title: 'Executive Quorum and Voting', body: ['Three of the five Leads constitute quorum.', 'Unless otherwise provided in this Constitution, Executive decisions are made by simple majority vote.'] },
      { number: 33, title: 'Conflicts of Interest', body: ['An Executive member must disclose a material personal or financial interest in a matter being considered by the Executive.', 'A Lead shall not vote on:', ['their own paid appointment or contract;', 'a transaction from which they may personally benefit; or', 'a disciplinary complaint in which they are directly involved.'], 'The remaining eligible Leads may decide the matter.'] },
    ],
  },
  {
    roman: 'IX',
    title: 'Elections and Meetings',
    vibe: 'AGM, elections, terms, quorum, special meetings.',
    emoji: '🗳️',
    accent: 'from-yellow-300 to-amber-500',
    sections: [
      { number: 34, title: 'Annual General Meeting', body: ['The Team shall hold an Annual General Meeting (“AGM”) annually, normally in connection with the Team\'s Halloween gathering.'] },
      { number: 35, title: 'Elections', body: ['All members in good standing may vote.', 'Candidates shall declare the specific Executive portfolio for which they are seeking election.', 'Executive positions shall be elected individually.', 'Voting may be conducted digitally. Where elections are conducted in connection with the AGM:', ['voting shall close during the AGM; and', 'results shall be announced during the AGM.']] },
      { number: 36, title: 'Terms', body: ['Each elected Executive member serves from the conclusion of one AGM until the conclusion of the following AGM.', 'There are no term limits.'] },
      { number: 37, title: 'Vacancies', body: ['If an elected position becomes vacant before the next AGM, the Team shall hold a by-election to fill the position.'] },
      { number: 38, title: 'Membership Meeting Quorum', body: ['Quorum for an AGM or Special General Meeting is 50% of members in good standing.'] },
      { number: 39, title: 'Ordinary Membership Votes', body: ['Unless otherwise stated in this Constitution, a membership vote is decided by a simple majority of votes cast.'] },
      { number: 40, title: 'Special General Meetings', body: ['The Executive may call a Special General Meeting where a significant Team matter requires membership consideration before the next AGM.', 'Members may also request that the Executive convene a Special General Meeting where a significant matter reasonably requires Team-wide consideration.'] },
    ],
  },
  {
    roman: 'X',
    title: 'Finances',
    vibe: 'Budgets, fees, refunds, accessibility, reserves.',
    emoji: '💸',
    accent: 'from-teal-300 to-emerald-500',
    sections: [
      { number: 41, title: 'Annual Budget', body: ['The Executive shall prepare an annual Team budget.', "The Team's initial budget and Team fees shall be approved by the founding membership.", 'Thereafter, the annual budget and required Team fees shall be presented to the membership at the AGM.'] },
      { number: 42, title: 'Spending Authority', body: ['Routine spending contained within an approved budget may be made by the appropriate Lead without separate membership approval.', 'Material expenditures outside the approved budget require Executive approval.'] },
      { number: 43, title: 'Financial Reporting', body: ['The Lead of Finance shall maintain reasonable financial records and present an annual financial summary to the membership.', 'The summary should include, at minimum:', ['Team revenue;', 'major categories of expenditure; and', 'remaining Team reserves.']] },
      { number: 44, title: 'Team Fees', body: ['Members are responsible for required Team fees communicated by the Executive.', 'Some expenses may become non-refundable once the Team has committed funds to third parties, including registration fees, race entries, accommodations, transportation, or other bookings.', "Where the Team is able to recover an expense, including where another paddler assumes a paid spot, the recoverable portion should ordinarily be refunded to the withdrawing member.", "The Team shall not retain recoverable funds merely because a member's original payment was described as non-refundable."] },
      { number: 45, title: 'Optional Expenses', body: ['Certain activities or expenses may fall outside regular Team fees, including:', ['optional outrigger canoe practices;', 'additional uniforms or merchandise;', 'flights;', 'optional travel activities; and', 'other activities identified by the Executive.']] },
      { number: 46, title: 'Financial Accessibility', body: ['Where Team finances permit, the Executive may approve confidential payment arrangements, subsidies, or other measures intended to reduce financial barriers to participation.', 'Nothing in this section requires an Executive member, Coach, or other member to personally subsidize another member or advance funds on behalf of the Team.'] },
      { number: 47, title: 'Team Reserves', body: ['Unspent Team funds shall remain with the Team as reserves.', 'Reserves may be used for:', ['unexpected Team expenses;', 'approved financial-accessibility initiatives;', 'future Team operations; or', 'reduction of future Team costs through the next annual budget.'], 'Use of reserves outside an approved budget requires Executive approval.'] },
    ],
  },
  {
    roman: 'XI',
    title: 'Conduct and Safety',
    vibe: 'Expected conduct and what happens beyond formal activities.',
    emoji: '🛟',
    accent: 'from-red-300 to-pink-500',
    sections: [
      { number: 48, title: 'Standard of Conduct', body: ['Members are expected to behave in a manner consistent with the Team\'s values at practices, races, social events, travel activities, online spaces associated with the Team, and other circumstances materially connected to the Team.', 'Prohibited conduct includes, but is not limited to:', ['harassment;', 'discrimination;', 'sexual harassment or sexual misconduct;', 'misogynistic, racist, homophobic, transphobic, or otherwise discriminatory comments or behaviour;', 'bullying or intimidation;', 'threats or violence;', 'retaliation;', 'repeated personal attacks or scapegoating;', 'serious unsportsmanlike conduct;', 'deliberate creation of an unsafe environment; and', "other conduct fundamentally incompatible with the Team's values."]] },
      { number: 49, title: 'Conduct Outside Team Activities', body: ['The Executive may consider conduct occurring outside official Team activities where that conduct reasonably affects:', ['the safety of members or prospective members;', "another person's willingness or ability to participate;", 'trust within the Team;', "the Team's ability to provide an inclusive environment; or", "the Team's reputation in circumstances materially connected to the dragon boat community."], "This provision is not intended to give the Team general authority over members' private lives."] },
    ],
  },
  {
    roman: 'XII',
    title: 'Complaints and Discipline',
    vibe: 'How concerns are reported, protected, and resolved.',
    emoji: '📣',
    accent: 'from-blue-300 to-cyan-500',
    sections: [
      { number: 51, title: 'Reporting Concerns', body: ['A member may raise a concern with any member of the Executive.', 'The Team should also maintain an anonymous reporting mechanism where reasonably practicable.', 'Members are not required to report concerns through a Lead with whom they are uncomfortable speaking.'] },
      { number: 52, title: 'Confidentiality', body: ['Complaints and reports shall be handled as confidentially as reasonably possible.', 'Absolute confidentiality cannot be guaranteed where disclosure is necessary to investigate a concern, protect members, or respond fairly.', "Anonymous reports may be considered, although anonymity may limit the Executive's ability to investigate or take disciplinary action."] },
      { number: 53, title: 'Retaliation', body: ['Retaliation against any person for raising a good-faith concern, participating in an investigation, supporting another member, or reporting misconduct is prohibited.', 'Retaliation may itself constitute serious misconduct.'] },
      { number: 54, title: 'Range of Responses', body: ['For lower-level conduct concerns, the Team may use measures including:', ['an informal conversation;', 'coaching or redirection;', 'a warning;', 'clarification of behavioural expectations; or', 'other reasonable corrective action.'], 'The Team is not required to use each step before imposing a more serious consequence.'] },
      { number: 55, title: 'Serious Misconduct', body: ['Serious misconduct may justify suspension or permanent removal after a single incident.', 'Examples may include:', ['harassment;', 'serious discriminatory conduct;', 'sexual misconduct;', 'violence;', 'credible threats;', 'predatory behaviour;', 'serious retaliation; or', 'conduct creating a significant safety risk.']] },
      { number: 56, title: 'Immediate Safety Authority', body: ['The Coach, Captain, or an appropriate event leader may immediately remove a member from a practice, race, trip, social activity, or other Team event where reasonably necessary to protect safety or prevent serious disruption.', 'Temporary removal from an activity does not automatically constitute permanent removal from the Team.'] },
      { number: 57, title: 'Opportunity to Respond', body: ['Before permanent removal, a member should ordinarily be informed of the material concern and provided a reasonable opportunity to respond.', 'An additional response may not be required where:', ['the relevant conduct was directly witnessed by the decision-makers;', 'immediate action is necessary for safety; or', 'the circumstances make a further response impracticable or inappropriate.']] },
      { number: 58, title: 'Permanent Removal', body: ['Permanent removal of a member requires a supermajority decision of the Executive.', 'Where all five Leads are eligible to vote, at least four affirmative votes are required.', 'Where one or more Leads must recuse themselves because of a conflict of interest, at least 75% of the remaining eligible Leads must support removal, with a minimum of three eligible Leads participating in the decision.', 'A removed member immediately ceases to be a member in good standing.'] },
    ],
  },
  {
    roman: 'XIII',
    title: 'Team Policies',
    vibe: 'Operational policies sit beneath the Constitution.',
    emoji: '📌',
    accent: 'from-indigo-300 to-blue-600',
    sections: [
      { number: 59, title: 'Policies', body: ['The Executive may establish and amend operational policies without amending this Constitution.', 'Policies may address matters including:', ['registration deadlines;', 'reimbursements;', 'travel procedures;', 'race-day logistics;', 'uniforms and merchandise;', 'attendance systems;', 'communications;', 'social media;', 'safety procedures;', 'financial processes; and', 'other operational matters.'], 'Policies must be consistent with this Constitution.', 'Where a policy conflicts with this Constitution, the Constitution prevails.'] },
    ],
  },
  {
    roman: 'XIV',
    title: 'Amendments',
    vibe: 'How the document changes.',
    emoji: '📝',
    accent: 'from-purple-300 to-fuchsia-500',
    sections: [
      { number: 60, title: 'Proposing Amendments', body: ['Any member in good standing may propose an amendment to this Constitution.', 'Members shall receive reasonable notice of a proposed amendment before the vote.'] },
      { number: 61, title: 'Approval', body: ['Amendments require:', ['quorum of at least 50% of members in good standing; and', 'approval by at least two-thirds of votes cast.'], 'Amendments may be considered at an AGM or Special General Meeting.'] },
    ],
  },
  {
    roman: 'XV',
    title: 'Dissolution',
    vibe: 'If the team winds down, assets support sport and inclusion.',
    emoji: '🌱',
    accent: 'from-green-300 to-lime-500',
    sections: [
      { number: 62, title: 'Dissolution of the Team', body: ['The Team may be dissolved by a two-thirds vote of members participating at a duly constituted membership meeting.', 'After all outstanding liabilities have been paid, any remaining Team assets shall not be distributed among individual members.', 'The membership shall vote to donate remaining assets to a charity or nonprofit organization whose work supports inclusion, accessibility, or participation in sport.'] },
    ],
  },
  {
    roman: 'XVI',
    title: 'Interpretation',
    vibe: 'Use judgment. Protect culture and member well-being.',
    emoji: '💜',
    accent: 'from-pink-300 to-violet-500',
    sections: [
      { number: 63, title: 'Spirit of the Constitution', body: ['This Constitution exists to support the Team, not to replace reasonable judgment.', 'Where a situation is not expressly addressed, the Executive should interpret this Constitution consistently with the Team\'s core purposes:', ['athletic development, social connection, inclusion, and fun.'], "When competitive success conflicts with those purposes, the Team's culture and the well-being of its members shall take priority."] },
    ],
  },
];

const values = [
  { label: 'Athletic development', icon: '💪' },
  { label: 'Social connection', icon: '🫶' },
  { label: 'Shared adventures', icon: '🌎' },
  { label: 'Fun first', icon: '🎉' },
];

function renderBody(body) {
  return body.map((block, index) => {
    if (Array.isArray(block)) {
      return (
        <ul key={index} className='mt-3 grid gap-2 text-slate-700 sm:grid-cols-2'>
          {block.map((item) => (
            <li key={item} className='flex gap-2 rounded-2xl bg-white/75 px-4 py-3 shadow-sm ring-1 ring-slate-100'>
              <span className='mt-1 h-2 w-2 shrink-0 rounded-full bg-primary' />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    }

    return <p key={index} className='mt-3 leading-7 text-slate-700'>{block}</p>;
  });
}

export default function Constitution({ activeArticleRoman = 'I', onArticleChange = () => {} }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeArticle = constitutionArticles[activeIndex];
  const progress = ((activeIndex + 1) / constitutionArticles.length) * 100;

  useEffect(() => {
    const nextIndex = constitutionArticles.findIndex((article) => (
      article.roman.toLowerCase() === String(activeArticleRoman).toLowerCase()
    ));
    if (nextIndex !== -1) setActiveIndex(nextIndex);
  }, [activeArticleRoman]);

  const handleSelectArticle = (index) => {
    setActiveIndex(index);
    onArticleChange(constitutionArticles[index].roman);
  };

  return (
    <main className='relative overflow-hidden rounded-[2rem] bg-white/95 p-5 shadow-2xl ring-1 ring-white/60 md:p-8'>
      <div className='pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl constitution-float' />
      <div className='pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-secondary/20 blur-3xl constitution-float constitution-delay-2' />

      <section className='relative rounded-[1.75rem] bg-gradient-to-br from-slate-950 via-primary to-secondary p-6 text-white shadow-2xl md:p-8'>
        <div className='flex flex-wrap items-center gap-3 text-sm font-bold uppercase tracking-[0.25em] text-white/75'>
          <span>Constitution</span>
          <span className='h-1 w-1 rounded-full bg-white/60' />
          <span>Adopted: [Date]</span>
          <span className='h-1 w-1 rounded-full bg-white/60' />
          <span>Last Amended: [Date]</span>
        </div>

        <div className='mt-10 max-w-3xl'>
          <div className='mb-5 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold shadow-lg ring-1 ring-white/20 backdrop-blur'>
            Constitution of [Team Name]
          </div>
          <h2 className='text-4xl font-black leading-tight drop-shadow md:text-6xl'>
            Built for paddling hard, welcoming loudly, and having fun.
          </h2>
          <p className='mt-5 max-w-2xl text-lg leading-8 text-white/85'>
            Choose an article to open a polished slide through the rules, culture, leadership, finances, safety standards, and spirit of the team.
          </p>
        </div>

        <div className='mt-8 grid gap-3 sm:grid-cols-4'>
          {values.map((value, index) => (
            <div
              key={value.label}
              className='constitution-rise rounded-2xl bg-white/12 p-4 ring-1 ring-white/20 backdrop-blur'
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <div className='text-2xl'>{value.icon}</div>
              <div className='mt-2 text-sm font-bold'>{value.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className='sticky top-0 z-20 mt-6 rounded-full bg-white/80 p-2 shadow-lg ring-1 ring-slate-200 backdrop-blur'>
        <div className='h-3 overflow-hidden rounded-full bg-slate-200'>
          <div className='h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500' style={{ width: `${progress}%` }} />
        </div>
      </div>

      <section className='relative mt-6 grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]'>
        <aside className='lg:sticky lg:top-9 lg:self-start'>
          <div className='rounded-[1.75rem] bg-slate-50 p-5 shadow-inner ring-1 ring-slate-200'>
            <div className='flex items-center justify-between gap-3'>
              <div>
                <div className='text-sm font-black uppercase tracking-[0.18em] text-slate-500'>Articles</div>
                <div className='mt-1 text-sm text-slate-500'>Click a card to open that article.</div>
              </div>
              <div className='rounded-2xl bg-white px-3 py-2 text-sm font-black text-primary shadow-sm'>
                {activeIndex + 1}/{constitutionArticles.length}
              </div>
            </div>

            <div className='mt-5 grid max-h-[calc(100vh-210px)] gap-2 overflow-y-auto pr-1 scrollbar-hide'>
              {constitutionArticles.map((article, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={article.roman}
                    type='button'
                    onClick={() => handleSelectArticle(index)}
                    className={`group rounded-2xl p-3 text-left transition-all duration-300 ${
                      isActive
                        ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-[1.02]'
                        : 'bg-white text-slate-700 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-md'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <div className='flex items-center gap-3'>
                      <span className='text-xl'>{article.emoji}</span>
                      <div>
                        <div className='text-xs font-black uppercase tracking-[0.2em] opacity-70'>Article {article.roman}</div>
                        <div className='font-black'>{article.title}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <article
          key={activeArticle.roman}
          className='animate-slide-in rounded-[1.75rem] bg-slate-50 p-5 shadow-2xl ring-1 ring-primary/20 md:p-7'
        >
          <div className='flex flex-col gap-5 md:flex-row md:items-end md:justify-between'>
            <div>
              <div className={`inline-flex items-center gap-3 rounded-full bg-gradient-to-r ${activeArticle.accent} px-5 py-2 text-sm font-black uppercase tracking-[0.2em] text-white shadow-lg`}>
                <span>{activeArticle.emoji}</span>
                <span>Article {activeArticle.roman}</span>
              </div>
              <h3 className='mt-4 text-3xl font-black text-slate-900 md:text-5xl'>{activeArticle.title}</h3>
              <p className='mt-3 max-w-3xl text-lg text-slate-600'>{activeArticle.vibe}</p>
            </div>

            <div className='rounded-2xl bg-white px-4 py-3 text-sm font-black uppercase tracking-[0.16em] text-slate-500 shadow-sm'>
              Slide {activeIndex + 1}
            </div>
          </div>

          <div className='mt-7 grid gap-5'>
            {activeArticle.sections.map((section, sectionIndex) => (
              <section
                key={section.number}
                className='constitution-rise rounded-[1.5rem] bg-white p-5 shadow-lg ring-1 ring-slate-100 md:p-6'
                style={{ animationDelay: `${sectionIndex * 80}ms` }}
              >
                <div className='flex flex-wrap items-center gap-3'>
                  <span className='flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-lg font-black text-white shadow-md'>
                    {section.number}
                  </span>
                  <h4 className='text-2xl font-black text-slate-900'>{section.title}</h4>
                </div>
                <div className='mt-2'>{renderBody(section.body)}</div>
              </section>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
