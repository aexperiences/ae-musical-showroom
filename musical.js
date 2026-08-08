/* ============================================================================
   MUSICAL OS  ·  V3.0 Grandsuite showroom engine
   The operating system for a non-profit community playhouse.
   Accelerated Experiences LLC.

   Built from the live Lake City Playhouse build (LCPhub V1.1 LITE, "The
   Playhouse OS") — its department map, its twelve production roles, its
   rights gate, its "Revenue Kept" headline, and its Statute·Precedent·Chair
   law desk. LCP runs the LITE tier; this showroom is the Grandsuite that
   LCP is a reduced instance of.

   HONESTY RULES baked into this file:
   - The showroom seeds a FICTIONAL playhouse. No real donor, patron, cast
     member or staff member from any client appears anywhere in here.
   - Where a benchmark target band is not sourced, `bench` is null and the
     room renders the metric with NO target. Blank beats confident-wrong.
   - Nothing sends, spends, publishes or books a human. Anything that would
     is staged on the Approval Desk instead.
   ============================================================================ */
(function (global) {
  "use strict";

  var KEY = "musical_showroom_v3";
  /* Where the exit lands. The store, not the homepage. */
  var STORE_URL = "https://www.aexperiences.com/hubs/theater.html";
  var SHOP_URL  = "https://www.aexperiences.com/shop.html";
  var IDLE_MS = 20 * 60 * 1000;        /* wipe the floor 20 min after they walk away */
  var STORE = (function(){ try{ localStorage.setItem('_t','1'); localStorage.removeItem('_t'); return localStorage; }catch(e){ return sessionStorage; } })();

  function now() { return Date.now(); }
  function read() {
    try {
      var raw = STORE.getItem(KEY);
      if (!raw) return null;
      var d = JSON.parse(raw);
      if (!d || !d._t || now() - d._t > IDLE_MS) return null;
      return d;
    } catch (e) { return null; }
  }
  function write(d) { d._t = now(); try { STORE.setItem(KEY, JSON.stringify(d)); } catch (e) {} }
  function clone(a) { return JSON.parse(JSON.stringify(a)); }
  function fresh() { return clone(SEED); }
  function db() { var d = read(); if (!d) { d = fresh(); write(d); } return d; }
  function save(mut) { var d = db(); mut(d); write(d); return d; }
  function resetFloor() { var d = fresh(); write(d); return d; }

  /* ==========================================================================
     1 · THE CANON — what a community playhouse actually runs on
     ========================================================================== */

  /* A season is the spine. Everything — subscriptions, sponsorship, the gala,
     the education calendar — hangs off which show is in which slot. */
  var SHOW_TYPES = ["Musical", "Play", "Comedy", "Holiday", "Rock Musical", "Youth / Education"];

  var PROD_STAGES = [
    { k:"Planning",   name:"Planning",   note:"Slot held in the season. Rights not yet secured." },
    { k:"Licensed",   name:"Licensed",   note:"Rights secured. Budget and team can be committed." },
    { k:"Casting",    name:"Casting",    note:"Auditions posted or underway." },
    { k:"Rehearsal",  name:"Rehearsal",  note:"In the room. Calls, conflicts and the build are live." },
    { k:"Tech",       name:"Tech",       note:"Onstage. Cues, costumes and the house are being set." },
    { k:"On Sale",    name:"On Sale",    note:"Seats are selling. Requires secured rights." },
    { k:"Running",    name:"Running",    note:"Open to the public." },
    { k:"Closed",     name:"Closed",     note:"Struck. Royalties reconciled." }
  ];

  /* The licensors a community theater actually deals with. Royalty terms are
     quoted per production and are NOT published rate cards — the OS records
     what YOU were quoted, it never asserts a market rate. */
  var LICENSORS = [
    { k:"MTI",        name:"Music Theatre International" },
    { k:"Concord",    name:"Concord Theatricals / Samuel French" },
    { k:"DPS",        name:"Dramatists Play Service" },
    { k:"TRW",        name:"Theatrical Rights Worldwide" },
    { k:"Broadway",   name:"Broadway Licensing" },
    { k:"Public",     name:"Public domain — no licensor" }
  ];
  var RIGHTS_STATUS = ["Not requested", "Requested", "Quoted", "Secured", "Denied"];

  /* Giving. Levels are what the house names them; the amounts are the house's
     own ladder, not a benchmark. */
  var GIVING_LEVELS = [
    { k:"friend",     name:"Friend",          min:50 },
    { k:"supporter",  name:"Supporter",       min:150 },
    { k:"patron",     name:"Patron",          min:500 },
    { k:"benefactor", name:"Benefactor",      min:1500 },
    { k:"producer",   name:"Producer's Circle", min:5000 }
  ];
  var GIFT_KINDS = ["One-time", "Recurring", "Pledge", "In-kind", "Grant", "Gala / Auction", "Brick"];

  /* Sponsorship is INVENTORY, not a logo wall. Each level is a promise the
     house has to actually deliver — that is what `fulfil` tracks. */
  var SPONSOR_LEVELS = [
    { k:"season",    name:"Season Sponsor",     amt:10000, inv:["Season naming", "Playbill inside cover", "Site premier slot", "Curtain speech · all shows", "8 seats per show"] },
    { k:"show",      name:"Show Sponsor",       amt:3500,  inv:["Show naming", "Playbill full page", "Site slot · run of show", "Curtain speech", "6 seats"] },
    { k:"education", name:"Education Sponsor",  amt:5000,  inv:["Education program naming", "Playbill half page", "Site slot · season", "Named in class materials"] },
    { k:"playbill",  name:"Playbill Advertiser",amt:600,   inv:["Playbill quarter page"] },
    { k:"community", name:"Community Partner",  amt:250,   inv:["Sponsor wall listing", "Site listing"] }
  ];

  /* The twelve hats, verbatim in spirit from how a playhouse signs its people
     in. A community theater person holds more than one. */
  var HOUSE_ROLES = [
    { k:"admin",     name:"Administrator",    note:"Full access — money, records, everything" },
    { k:"director",  name:"Director",         note:"Your show — cast, crew & schedule" },
    { k:"md",        name:"Music Director",   note:"The pit — live band or recorded tracks" },
    { k:"sm",        name:"Stage Manager",    note:"Run the show — calls & crew" },
    { k:"ld",        name:"Lighting Designer",note:"Lights — design & cues" },
    { k:"costume",   name:"Costume Designer", note:"Costumes — design & fittings" },
    { k:"wardrobe",  name:"Wardrobe",         note:"Fittings & quick-changes" },
    { k:"props",     name:"Props",            note:"Props & set dressing" },
    { k:"teacher",   name:"Teacher",          note:"Classes & students" },
    { k:"student",   name:"Student",          note:"Your classes & schedule" },
    { k:"actor",     name:"Actor",            note:"Your show — script, calls & bio" },
    { k:"volunteer", name:"General Volunteer",note:"Shifts, hours & the calendar" }
  ];

  var VOLUNTEER_JOBS = ["Usher", "Box office", "Concessions", "Set build", "Backstage crew",
                        "Load-in / strike", "Costume shop", "Gala committee", "Board committee"];

  /* Idaho sales tax on admissions. The RATE is a real published figure; whether
     a given ticket is taxable is exactly the sort of thing the law desk grades
     rather than asserts. */
  var ID_SALES_TAX = 0.06;   /* Idaho state sales tax rate, 6% */

  /* What the house is buying today instead. Where a vendor does not publish a
     price we say so rather than inventing one. */
  var REPLACES = [
    { tool:"Per-ticket platform",        job:"Ticketing + fees skimmed off every seat", cost:"$1–$4 per ticket" },
    { tool:"Donor database",             job:"Gifts, pledges, acknowledgment letters",  cost:"quote-gated — not published" },
    { tool:"Class registration tool",    job:"Camp & class enrolment + tuition",        cost:"$50–$200/mo" },
    { tool:"Volunteer scheduler",        job:"Shifts and hours",                        cost:"$20–$90/mo" },
    { tool:"Accounting + payroll",       job:"The books, 990 prep",                     cost:"$70–$250/mo" },
    { tool:"Design subscription",        job:"Playbills, posters, sponsor ads",         cost:"$23–$60/mo per seat" },
    { tool:"Email / marketing",          job:"Season announcements, appeals",           cost:"$30–$150/mo" }
  ];

  /* ⚠ SOURCED BENCHMARKS — deliberately empty.
     Buttress OS earns its credibility from cited A/E figures. The non-profit
     equivalents (earned vs contributed split, donor retention, cost to raise a
     dollar, functional expense split, paid capacity, gala net-to-gross,
     operating reserve months, Independent Sector volunteer-hour value) have NOT
     been sourced yet. Until they are, every metric renders with no target band.
     Do not populate this from memory. */
  var BENCH = {};

  /* ==========================================================================
     2 · THE SEED — a fictional playhouse, deliberately imperfect
     ========================================================================== */
  var SEED = {
    house: {
      name: "Garden Avenue Playhouse",
      city: "Coeur d'Alene, Idaho",
      season: "63rd Season · 2026–27",
      ein: "00-0000000",          /* placeholder — never a real EIN */
      status: "501(c)(3) non-profit",
      venues: [
        { k:"main",      name:"Main Stage",      seats:212 },
        { k:"rehearsal", name:"Rehearsal Room",  seats:40  },
        { k:"black",     name:"The Black Box",   seats:64  }
      ]
    },

    /* Six slots. Two of them deliberately have rights unsecured — that is the
       gate the whole product is built around. */
    productions: [
      { id:"p1", title:"A Midsummer Night's Dream", type:"Play", stage:"Running", venue:"main",
        opens:"2026-09-24", closes:"2026-10-10", perfs:9, licensor:"Public", rights:"Secured",
        royalty:0, budget:14000, spend:12480, seatsSold:1310, seatsHeld:1908, house:212 },
      { id:"p2", title:"The Winter Songbook", type:"Holiday", stage:"Rehearsal", venue:"main",
        opens:"2026-12-04", closes:"2026-12-20", perfs:12, licensor:"Concord", rights:"Secured",
        royalty:4200, budget:22000, spend:6100, seatsSold:0, seatsHeld:2544, house:212 },
      { id:"p3", title:"Ragtime Avenue", type:"Musical", stage:"Planning", venue:"main",
        opens:"2027-01-28", closes:"2027-02-13", perfs:10, licensor:"MTI", rights:"Quoted",
        royalty:0, budget:31000, spend:900, seatsSold:0, seatsHeld:2120, house:212 },
      { id:"p4", title:"You Can't Take It With You", type:"Comedy", stage:"Planning", venue:"main",
        opens:"2027-03-25", closes:"2027-04-10", perfs:9, licensor:"DPS", rights:"Not requested",
        royalty:0, budget:16000, spend:0, seatsSold:0, seatsHeld:1908, house:212 },
      { id:"p5", title:"Bright Star", type:"Musical", stage:"Planning", venue:"main",
        opens:"2027-05-20", closes:"2027-06-05", perfs:10, licensor:"TRW", rights:"Requested",
        royalty:0, budget:28000, spend:0, seatsSold:0, seatsHeld:2120, house:212 },
      { id:"p6", title:"The Paper Crown", type:"Youth / Education", stage:"Planning", venue:"black",
        opens:"2027-07-22", closes:"2027-08-07", perfs:8, licensor:"Broadway", rights:"Not requested",
        royalty:0, budget:9000, spend:0, seatsSold:0, seatsHeld:512, house:64 }
    ],

    /* Season packages. Prices mirror the shape a community house actually sells. */
    packages: [
      { id:"sp1", name:"Full Season · 6 shows",  price:120, sold:184, note:"Same seat, all year." },
      { id:"sp2", name:"Senior / Military",      price:105, sold:96,  note:"Full season, reduced." },
      { id:"sp3", name:"Student",                price:99,  sold:41,  note:"Full season, student ID." },
      { id:"sp4", name:"Flex 3-Pack",            price:69,  sold:73,  note:"Any three shows." }
    ],

    /* Single-ticket price ladder for the house. */
    prices: [
      { k:"adult",   name:"Adult",           amt:25 },
      { k:"senior",  name:"Senior / Military",amt:20 },
      { k:"student", name:"Student",         amt:20 },
      { k:"child",   name:"Child under 12",  amt:15 }
    ],

    /* Contributed income. Fictional donors. */
    gifts: [
      { id:"g1",  donor:"Marguerite Ellery",     kind:"Recurring",     amt:150,   date:"2026-07-01", fund:"General",   ack:true  },
      { id:"g2",  donor:"The Okafor Family",     kind:"One-time",      amt:500,   date:"2026-07-08", fund:"Education", ack:true  },
      { id:"g3",  donor:"Alliance Title",        kind:"Gala / Auction",amt:2200,  date:"2026-07-16", fund:"General",   ack:false },
      { id:"g4",  donor:"D. Reyes",              kind:"Brick",         amt:250,   date:"2026-07-19", fund:"Capital",   ack:false },
      { id:"g5",  donor:"Panhandle Arts Fund",   kind:"Grant",         amt:12000, date:"2026-06-30", fund:"Education", ack:true,
                  restricted:true, restriction:"Youth education programming only. Not transferable to mainstage." },
      { id:"g6",  donor:"H. & J. Park",          kind:"Pledge",        amt:3000,  date:"2026-05-02", fund:"Capital",   ack:true,
                  pledged:3000, paid:1000 },
      { id:"g7",  donor:"Bluebird Tree Care",    kind:"In-kind",       amt:1800,  date:"2026-06-11", fund:"General",   ack:false,
                  inkindNote:"Site clearing and haul-off before load-in." },
      { id:"g8",  donor:"S. Vitale",             kind:"One-time",      amt:75,    date:"2026-07-21", fund:"General",   ack:false }
    ],

    sponsors: [
      { id:"s1", name:"Cedar & Stone Realty",   level:"season",   amt:10000, since:2021, renews:"2027-06-30",
        fulfil:{ "Season naming":true, "Playbill inside cover":true, "Site premier slot":true, "Curtain speech · all shows":false, "8 seats per show":true } },
      { id:"s2", name:"Kootenai Heating & Air", level:"show",     amt:3500,  since:2023, renews:"2026-12-31",
        fulfil:{ "Show naming":true, "Playbill full page":false, "Site slot · run of show":true, "Curtain speech":false, "6 seats":true } },
      { id:"s3", name:"Welch Ridge Engineers",  level:"education",amt:5000,  since:2019, renews:"2027-08-31",
        fulfil:{ "Education program naming":true, "Playbill half page":true, "Site slot · season":true, "Named in class materials":false } },
      { id:"s4", name:"Dawson Plumbing",        level:"playbill", amt:600,   since:2024, renews:"2026-09-01",
        fulfil:{ "Playbill quarter page":true } },
      { id:"s5", name:"AHA Creative",           level:"community",amt:250,   since:2025, renews:"2026-10-15",
        fulfil:{ "Sponsor wall listing":true, "Site listing":true } }
    ],

    /* Volunteers with HOURS — grant reporting and in-kind valuation both need
       this, and it is the number a spreadsheet always loses. */
    volunteers: [
      { id:"v1", name:"Rosalind M.",  jobs:["Usher","Box office"],        hours:64,  since:2018, active:true },
      { id:"v2", name:"Teodoro B.",   jobs:["Set build","Load-in / strike"],hours:131,since:2015, active:true },
      { id:"v3", name:"Jun-seo P.",   jobs:["Backstage crew"],            hours:48,  since:2023, active:true },
      { id:"v4", name:"Annelie K.",   jobs:["Costume shop"],              hours:96,  since:2020, active:true },
      { id:"v5", name:"Marcus D.",    jobs:["Gala committee","Usher"],    hours:27,  since:2024, active:true },
      { id:"v6", name:"Priya N.",     jobs:["Board committee"],           hours:52,  since:2019, active:true },
      { id:"v7", name:"Colm F.",      jobs:["Concessions"],               hours:12,  since:2026, active:true },
      { id:"v8", name:"Hattie R.",    jobs:["Usher"],                     hours:8,   since:2026, active:false }
    ],

    /* Education. Real shape: a camp, two teen classes, tuition, scholarships. */
    classes: [
      { id:"c1", name:"Summer Camp",        ages:"8–14",   venue:"main",      tuition:225, seats:24, enrolled:21, sched:"Mon–Fri · 9:00–12:00", schol:4 },
      { id:"c2", name:"From Text to Stage", ages:"13–17",  venue:"rehearsal", tuition:150, seats:14, enrolled:11, sched:"Mon & Wed · 4:30–6:00", schol:2 },
      { id:"c3", name:"Monologue Intensive",ages:"13–17",  venue:"main",      tuition:120, seats:12, enrolled:12, sched:"Tue & Thu · 4:30–6:00", schol:1 },
      { id:"c4", name:"Playmaking · Littles",ages:"5–7",   venue:"black",     tuition:95,  seats:16, enrolled:6,  sched:"Sat · 10:00–11:15", schol:0 }
    ],

    /* Earned income other than tickets. */
    earned: [
      { id:"e1", kind:"Concessions",     amt:4820,  note:"Bar and snack, season to date" },
      { id:"e2", kind:"Venue rental",    amt:3600,  note:"Two weekend rentals of the Black Box" },
      { id:"e3", kind:"Merchandise",     amt:910,   note:"Season shirts and posters" }
    ],

    /* The operating expense side, split the way a 990 requires. */
    /* Season to date — not a full-season budget. One show has closed, one is in
       rehearsal, and the fixed costs are nine months in. A community house runs
       thin and slightly positive; that is the honest picture, not a green board. */
    expenses: [
      { id:"x1", cat:"Production",       fn:"Program",     amt:28400 },
      { id:"x2", cat:"Education",        fn:"Program",     amt:11200 },
      { id:"x3", cat:"Facility",         fn:"Program",     amt:14700 },
      { id:"x4", cat:"Staff — artistic", fn:"Program",     amt:28500 },
      { id:"x5", cat:"Staff — admin",    fn:"Management",  amt:16800 },
      { id:"x6", cat:"Insurance & legal",fn:"Management",  amt:7300  },
      { id:"x7", cat:"Gala costs",       fn:"Fundraising", amt:9100  },
      { id:"x8", cat:"Appeals & printing",fn:"Fundraising",amt:2600  }
    ],

    /* Production tasks — the open-items count on the Command Center. */
    tasks: [
      { id:"t1", prod:"p2", what:"Secure orchestra parts from the licensor", who:"Music Director", due:"2026-08-14", done:false },
      { id:"t2", prod:"p2", what:"Costume build — 14 chorus pieces",         who:"Costume Designer", due:"2026-10-01", done:false },
      { id:"t3", prod:"p3", what:"Return signed MTI quote",                  who:"Administrator",   due:"2026-08-02", done:false },
      { id:"t4", prod:"p1", what:"Strike and return rented lekos",           who:"Lighting Designer",due:"2026-10-12", done:false },
      { id:"t5", prod:"p4", what:"Request rights from Dramatists",           who:"Administrator",   due:"2026-08-20", done:false },
      { id:"t6", prod:"p6", what:"Confirm youth rights are available",       who:"Administrator",   due:"2026-09-05", done:false }
    ],

    board: [
      { id:"b1", name:"P. Nagarajan", seat:"Chair",     termEnds:"2027-06-30", coi:true },
      { id:"b2", name:"R. Marchetti", seat:"Treasurer", termEnds:"2028-06-30", coi:true },
      { id:"b3", name:"A. Kowalczyk", seat:"Secretary", termEnds:"2027-06-30", coi:false },
      { id:"b4", name:"D. Whitfield", seat:"Member",    termEnds:"2029-06-30", coi:true },
      { id:"b5", name:"L. Osei",      seat:"Member",    termEnds:"2028-06-30", coi:false }
    ],

    approvals: [],
    _t: 0
  };

  /* ==========================================================================
     3 · THE PRICE BOOK — every department on its own line
     ⚠ DRAFT. Tier prices mirror what is live on
     aexperiences.com/hubs/theater.html today ($650 / $1,500 / $3,200).
     Anthony sets every live price. Nothing here goes live without him.
     ========================================================================== */
  var ROOMS = {
    boxoffice:  { label:"Box Office",            mo:95,  build:700,
                  why:"Seat map, holds and walk-ups — and every dollar stays in the house." },
    productions:{ label:"Productions",           mo:85,  build:600,
                  why:"The season spine. Rights, budget and the run, per slot." },
    rights:     { label:"Rights & Royalties",    mo:70,  build:500,
                  why:"The gate. No show reaches On Sale without secured rights." },
    patrons:    { label:"Patrons & Subscribers", mo:70,  build:500,
                  why:"Who sits where, who renews, and who lapsed." },
    dev:        { label:"Development · Giving",  mo:130, build:1100,
                  why:"Gifts, pledges, restricted funds and the acknowledgment letters the IRS expects." },
    sponsors:   { label:"Sponsorship",           mo:95,  build:800,
                  why:"Levels as inventory — what you promised, whether it shipped, when it renews." },
    volunteers: { label:"Volunteers",            mo:70,  build:550,
                  why:"Shifts by performance and the hours a grant report asks for." },
    education:  { label:"Classes & Camps",       mo:90,  build:750,
                  why:"Enrolment, tuition, scholarships and the roster a teacher can actually use." },
    books:      { label:"Books",                 mo:110, build:900,
                  why:"Earned against contributed, and the functional split a 990 asks for." },
    law:        { label:"Law & Counsel",         mo:120, build:1000,
                  why:"The 501(c)(3) desk — graded CLEAR, CAUTION or ATTORNEY, never guessed." },
    staffing:   { label:"Show Staffing",         mo:60,  build:450,
                  why:"Auditions, cast lists, calls and conflicts in one calendar." },
    scene:      { label:"Scene Shop",            mo:55,  build:400,
                  why:"Build tasks, load-in, strike and what got rented." },
    program:    { label:"Program Builder",       mo:65,  build:600,
                  why:"Playbills and cast pages — and the sponsor inventory that pays for them." },
    creative:   { label:"Creative Studio",       mo:80,  build:700,
                  why:"Posters, playbill pages and sponsor ads without a design subscription." },
    marketing:  { label:"Marketing",             mo:75,  build:600,
                  why:"Season announcements, appeals, and what actually sold a seat." },
    ops:        { label:"Operations",            mo:85,  build:650,
                  why:"Deals, invoices, expenses and the sales tax the state is waiting on." },
    hr:         { label:"HR & Time",             mo:70,  build:550,
                  why:"Paid staff hours next to volunteer hours — the real labour picture." },
    board:      { label:"Board & Governance",    mo:75,  build:600,
                  why:"Terms, committees, conflict-of-interest and what the 990 will need." },
    org:        { label:"Agent Org · Bus",       mo:160, build:1300,
                  why:"A department chain behind every room, gated on a confidence bar." }
  };

  var TIERS = {
    community: { key:"community", name:"Community", rank:1, mo:650, build:4000,
      desc:"The house that runs on volunteers. Box office, the season, patrons, the rights gate and the books.",
      base:"One venue · up to 10 seats",
      includes:["boxoffice","productions","rights","patrons","volunteers","books"] },
    producing: { key:"producing", name:"Producing", rank:2, mo:1500, build:8400,
      desc:"The house that fundraises. Adds giving, sponsorship, education, staffing, marketing, the playbill and operations.",
      base:"One venue · up to 25 seats",
      includes:["boxoffice","productions","rights","patrons","volunteers","books",
                "dev","sponsors","education","staffing","marketing","program","ops"] },
    grandsuite: { key:"grandsuite", name:"Regional / Multi-venue", rank:3, mo:3200, build:13800,
      desc:"Everything switched on — the scene shop, the creative studio, HR, governance, the 501(c)(3) law desk and the full agent org.",
      base:"Multi-venue · unlimited seats · dedicated environment · data migration",
      includes:["boxoffice","productions","rights","patrons","volunteers","books",
                "dev","sponsors","education","staffing","marketing","program","ops",
                "scene","creative","hr","board","law","org"] }
  };

  /* Nav. Items with no `room` are platform and always present.
     Groups mirror how a playhouse actually thinks about itself. */
  var DEPTS = [
    { group:"The Playhouse", items:[
      { label:"Command Center", href:"dashboard.html", ic:"⌘" }, { href:"calendar.html", label:"Calendar", ic:"▤" }, { href:"contacts.html", label:"Contacts", ic:"☎" }, { href:"connect.html", label:"Connect · Video", ic:"◉" }, { href:"records.html", label:"Records · Filing", ic:"▤" },
      { label:"Approval Desk",  href:"approvals.html", ic:"✓" }
    ]},
    { group:"Season & Stage", items:[
      { label:"Productions",        href:"productions.html", room:"productions", ic:"▦" },
      { label:"Rights & Royalties", href:"rights.html",      room:"rights",      ic:"§" },
      { label:"Show Staffing",      href:"staffing.html",    room:"staffing",    ic:"▤" },
      { label:"Scene Shop",         href:"scene.html",       room:"scene",       ic:"⚒" }
    ]},
    { group:"Front of House", items:[
      { label:"Box Office",         href:"boxoffice.html",   room:"boxoffice",   ic:"◉" },
      { label:"Patrons",            href:"patrons.html",     room:"patrons",     ic:"👥" }
    ]},
    { group:"Giving", items:[
      { label:"Development",        href:"development.html", room:"dev",         ic:"♥" },
      { label:"Sponsorship",        href:"sponsors.html",    room:"sponsors",    ic:"◈" }
    ]},
    { group:"People & Learning", items:[
      { label:"Volunteers",         href:"volunteers.html",  room:"volunteers",  ic:"🤝" },
      { label:"HR & Time",          href:"hr.html",          room:"hr",          ic:"◷" },
      { label:"Classes & Camps",    href:"education.html",   room:"education",   ic:"🎓" }
    ]},
    { group:"Story", items:[
      { label:"Marketing",          href:"marketing.html",   room:"marketing",   ic:"📣" },
      { label:"Program Builder",    href:"program.html",     room:"program",     ic:"📖" },
      { label:"Creative Studio",    href:"creative.html",    room:"creative",    ic:"🎨" }
    ]},
    { group:"Money & Law", items:[
      { label:"Books",              href:"books.html",       room:"books",       ic:"▥" },
      { label:"Operations",         href:"ops.html",         room:"ops",         ic:"⚙" },
      { label:"Law & Counsel",      href:"law.html",         room:"law",         ic:"§" },
      { label:"Board & Governance", href:"board.html",       room:"board",       ic:"⬡" }
    ]},
    { group:"The Org", items:[
      { label:"Agent Org · Bus",    href:"org.html",         room:"org",         ic:"✦" }
    ]}
  ];

  /* ---- tier + configurator state --------------------------------------- */
  function tier() { try { return STORE.getItem(KEY + "_tier") || "grandsuite"; } catch (e) { return "grandsuite"; } }
  function setTier(k) { try { STORE.setItem(KEY + "_tier", k); STORE.removeItem(KEY + "_rooms"); } catch (e) {} }
  function tierRank() { return (TIERS[tier()] || TIERS.grandsuite).rank; }
  function tierByRank(r) { for (var k in TIERS) if (TIERS[k].rank === r) return TIERS[k]; return TIERS.grandsuite; }

  function activeRooms() {
    var custom = null;
    try { custom = JSON.parse(STORE.getItem(KEY + "_rooms") || "null"); } catch (e) {}
    if (custom && custom.length !== undefined) return custom;
    return (TIERS[tier()] || TIERS.grandsuite).includes.slice();
  }
  function hasRoom(k) { return activeRooms().indexOf(k) >= 0; }
  function toggleRoom(k) {
    var on = activeRooms(), i = on.indexOf(k);
    if (i >= 0) on.splice(i, 1); else on.push(k);
    try { STORE.setItem(KEY + "_rooms", JSON.stringify(on)); } catch (e) {}
    return on;
  }

  /* Price = the package, plus anything added, minus anything taken off. */
  function priceNow() {
    var t = TIERS[tier()] || TIERS.grandsuite;
    var on = activeRooms();
    var adds = on.filter(function (k) { return t.includes.indexOf(k) < 0 && ROOMS[k]; });
    var offs = t.includes.filter(function (k) { return on.indexOf(k) < 0 && ROOMS[k]; });
    var addMo = adds.reduce(function (s, k) { return s + ROOMS[k].mo; }, 0);
    var addBd = adds.reduce(function (s, k) { return s + ROOMS[k].build; }, 0);
    var offMo = offs.reduce(function (s, k) { return s + ROOMS[k].mo; }, 0);
    var offBd = offs.reduce(function (s, k) { return s + ROOMS[k].build; }, 0);
    var alaMo = on.reduce(function (s, k) { return s + (ROOMS[k] ? ROOMS[k].mo : 0); }, 0);
    return {
      tier: t, rooms: on, adds: adds, offs: offs,
      addMo: addMo, offMo: offMo,
      mo: t.mo + addMo - offMo,
      build: t.build + addBd - offBd,
      alaMo: alaMo,
      platformMo: Math.max(0, t.mo - t.includes.reduce(function (s,k){ return s + (ROOMS[k]?ROOMS[k].mo:0); }, 0)),
      changed: adds.length > 0 || offs.length > 0
    };
  }
  function priceLabel() { var p = priceNow(); return money(p.mo) + "/mo · " + money(p.build) + " build"; }

  /* ==========================================================================
     4 · THE MONEY — a non-profit spine, not a commercial one
     ========================================================================== */

  /* Ticket revenue actually collected, and — the headline — what the house KEEPS.
     A per-ticket platform takes a cut of every seat. This OS does not. */
  var PLATFORM_FEE_PER_TICKET = 2.75;   /* what a typical per-ticket vendor skims */

  function ticketsSold(d) {
    return (d || db()).productions.reduce(function (s, p) { return s + (Number(p.seatsSold) || 0); }, 0);
  }
  function ticketRevenue(d) {
    d = d || db();
    var avg = 22;   /* blended across the price ladder in the seed */
    return ticketsSold(d) * avg;
  }
  function subscriptionRevenue(d) {
    d = d || db();
    return d.packages.reduce(function (s, p) { return s + p.price * p.sold; }, 0);
  }
  function tuitionRevenue(d) {
    d = d || db();
    return d.classes.reduce(function (s, c) { return s + c.tuition * Math.max(0, c.enrolled - (c.schol || 0)); }, 0);
  }
  function otherEarned(d) {
    d = d || db();
    return d.earned.reduce(function (s, e) { return s + e.amt; }, 0);
  }
  function earnedTotal(d) {
    d = d || db();
    return ticketRevenue(d) + subscriptionRevenue(d) + tuitionRevenue(d) + otherEarned(d);
  }
  function contributedTotal(d) {
    d = d || db();
    var gifts = d.gifts.reduce(function (s, g) {
      /* a pledge counts what has actually been PAID, not what was promised */
      if (g.kind === "Pledge") return s + (Number(g.paid) || 0);
      return s + (Number(g.amt) || 0);
    }, 0);
    var spon = d.sponsors.reduce(function (s, x) { return s + x.amt; }, 0);
    return gifts + spon;
  }
  function totalRevenue(d) { d = d || db(); return earnedTotal(d) + contributedTotal(d); }

  /* The share of the budget that is GIVEN rather than earned. We report the
     house's own number; we do not compare it to a sector benchmark we have
     not sourced. */
  function contributedShare(d) {
    d = d || db();
    var t = totalRevenue(d);
    return t ? (contributedTotal(d) / t) * 100 : 0;
  }

  /* REVENUE KEPT — the headline. What a per-ticket platform would have taken. */
  function feesAvoided(d) { return ticketsSold(d || db()) * PLATFORM_FEE_PER_TICKET; }
  function revenueKept(d) { d = d || db(); return ticketRevenue(d) + feesAvoided(d); }

  function expensesTotal(d) { d = d || db(); return d.expenses.reduce(function (s,x){ return s + x.amt; }, 0); }
  function surplus(d) { d = d || db(); return totalRevenue(d) - expensesTotal(d); }

  /* Functional expense split — the three buckets IRS Form 990 asks for. */
  function functionalSplit(d) {
    d = d || db();
    var out = { Program:0, Management:0, Fundraising:0 };
    d.expenses.forEach(function (x) { if (out[x.fn] !== undefined) out[x.fn] += x.amt; });
    var t = out.Program + out.Management + out.Fundraising;
    return { amounts: out, total: t,
      pct: { Program: t ? out.Program/t*100 : 0,
             Management: t ? out.Management/t*100 : 0,
             Fundraising: t ? out.Fundraising/t*100 : 0 } };
  }

  /* Cost to raise a dollar — fundraising expense over contributed income.
     We show the house's own ratio. We do NOT assert what "good" is; the
     watchdog thresholds are not sourced in this build. */
  function costToRaiseADollar(d) {
    d = d || db();
    var fr = d.expenses.filter(function (x) { return x.fn === "Fundraising"; })
                       .reduce(function (s,x){ return s + x.amt; }, 0);
    var c = contributedTotal(d);
    return c ? fr / c : 0;
  }

  /* Idaho sales tax on admissions actually collected. */
  function salesTaxOwed(d) {
    d = d || db();
    return ticketRevenue(d) * ID_SALES_TAX;
  }

  /* Volunteer hours. We report HOURS. We do not price them — the Independent
     Sector hourly value is not sourced in this build, and inventing one would
     put a fake number in a grant report. */
  function volunteerHours(d) {
    d = d || db();
    return d.volunteers.reduce(function (s, v) { return s + (Number(v.hours) || 0); }, 0);
  }
  function activeVolunteers(d) {
    d = d || db();
    return d.volunteers.filter(function (v) { return v.active; }).length;
  }

  /* Paid capacity — seats sold against seats offered, for shows that have run. */
  function paidCapacity(d) {
    d = d || db();
    var run = d.productions.filter(function (p) { return p.seatsSold > 0; });
    var sold = run.reduce(function (s,p){ return s + p.seatsSold; }, 0);
    var held = run.reduce(function (s,p){ return s + p.seatsHeld; }, 0);
    return held ? (sold / held) * 100 : 0;
  }

  /* THE GATE. A show cannot go On Sale without secured rights. */
  function rightsUnsecured(d) {
    d = d || db();
    return d.productions.filter(function (p) { return p.rights !== "Secured"; });
  }
  function canGoOnSale(p) { return p.rights === "Secured"; }

  function openTasks(d) { d = d || db(); return d.tasks.filter(function (t) { return !t.done; }); }
  function unacknowledgedGifts(d) { d = d || db(); return d.gifts.filter(function (g) { return !g.ack; }); }
  function restrictedFunds(d) { d = d || db(); return d.gifts.filter(function (g) { return g.restricted; }); }
  function sponsorGaps(d) {
    d = d || db();
    var out = [];
    d.sponsors.forEach(function (s) {
      Object.keys(s.fulfil || {}).forEach(function (item) {
        if (!s.fulfil[item]) out.push({ sponsor: s.name, item: item, level: s.level });
      });
    });
    return out;
  }

  /* The KPI board. `bench` is null everywhere on purpose — see BENCH above. */
  function kpis() {
    var d = db();
    return [
      { label:"Revenue kept",    value: revenueKept(d),      fmt:"money", bench:null,
        note:"Incl. " + money(feesAvoided(d)) + " a per-ticket platform would have taken" },
      { label:"Surplus",         value: surplus(d),          fmt:"money", bench:null,
        band: surplus(d) >= 0 ? "good" : "bad" },
      { label:"Contributed",     value: contributedShare(d), fmt:"pct",   bench:null,
        note:"of total revenue" },
      { label:"Paid capacity",   value: paidCapacity(d),     fmt:"pct",   bench:null,
        note:"seats sold vs offered" },
      { label:"Volunteer hours", value: volunteerHours(d),   fmt:"hours", bench:null,
        note: activeVolunteers(d) + " active" },
      { label:"Sales tax owed",  value: salesTaxOwed(d),     fmt:"money", bench:null,
        band:"watch", note:"to Idaho" }
    ];
  }

  global.MusicalCore = {
    KEY:KEY, STORE_URL:STORE_URL, SHOP_URL:SHOP_URL,
    db:db, save:save, fresh:fresh, resetFloor:resetFloor, SEED:SEED,
    SHOW_TYPES:SHOW_TYPES, PROD_STAGES:PROD_STAGES, LICENSORS:LICENSORS, RIGHTS_STATUS:RIGHTS_STATUS,
    GIVING_LEVELS:GIVING_LEVELS, GIFT_KINDS:GIFT_KINDS, SPONSOR_LEVELS:SPONSOR_LEVELS,
    HOUSE_ROLES:HOUSE_ROLES, VOLUNTEER_JOBS:VOLUNTEER_JOBS, REPLACES:REPLACES, BENCH:BENCH,
    ID_SALES_TAX:ID_SALES_TAX, PLATFORM_FEE_PER_TICKET:PLATFORM_FEE_PER_TICKET,
    ROOMS:ROOMS, TIERS:TIERS, DEPTS:DEPTS,
    tier:tier, setTier:setTier, tierRank:tierRank, tierByRank:tierByRank,
    activeRooms:activeRooms, hasRoom:hasRoom, toggleRoom:toggleRoom,
    priceNow:priceNow, priceLabel:priceLabel,
    ticketsSold:ticketsSold, ticketRevenue:ticketRevenue, subscriptionRevenue:subscriptionRevenue,
    tuitionRevenue:tuitionRevenue, otherEarned:otherEarned,
    earnedTotal:earnedTotal, contributedTotal:contributedTotal, totalRevenue:totalRevenue,
    contributedShare:contributedShare, feesAvoided:feesAvoided, revenueKept:revenueKept,
    expensesTotal:expensesTotal, surplus:surplus, functionalSplit:functionalSplit,
    costToRaiseADollar:costToRaiseADollar, salesTaxOwed:salesTaxOwed,
    volunteerHours:volunteerHours, activeVolunteers:activeVolunteers, paidCapacity:paidCapacity,
    rightsUnsecured:rightsUnsecured, canGoOnSale:canGoOnSale,
    openTasks:openTasks, unacknowledgedGifts:unacknowledgedGifts,
    restrictedFunds:restrictedFunds, sponsorGaps:sponsorGaps, kpis:kpis
  };

  /* money/esc are needed above before the UI half loads; define them here. */
  function money(n){ return "$" + (Math.round(Number(n)||0)).toLocaleString(); }
  global.MusicalCore.money = money;

})(window);

/* ============================================================================
   MUSICAL OS · V3.0 — part two: the org, the law desk, and the chrome.
   ============================================================================ */
(function (global) {
  "use strict";
  var C = global.MusicalCore;
  var ROOMS = C.ROOMS, TIERS = C.TIERS, DEPTS = C.DEPTS;
  var db = C.db, save = C.save, money = C.money;

  function el(html){ var t=document.createElement("template"); t.innerHTML=String(html).trim(); return t.content.firstChild; }
  function esc(s){ return String(s==null?"":s).replace(/[&<>"']/g,function(c){
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  function pct(n,dp){ return (Number(n)||0).toFixed(dp===undefined?0:dp)+"%"; }
  function hours(n){ return (Number(n)||0).toLocaleString()+" h"; }

  /* ---------------------------------------------------------------- the org
     Same architecture as Buttress: a chain per department, two opposing lenses
     that never confer, and a pacemaker that gates on a confidence bar. Money
     and Law sit at 85; everything else at 80. */
  var SEATS = {
    boxoffice:  { name:"Front of House", gate:80, dh:{name:"Odile Ferran", t:"House Manager"},
      ae:{name:"Sam Ipsen", t:"Box Office Lead"}, pace:{name:"Callboard", t:"Pacemaker"},
      lensA:{name:"Fill the House", t:"sell the seat"}, lensB:{name:"Protect the Patron", t:"hold the promise"} },
    productions:{ name:"Productions", gate:80, dh:{name:"Marisol Vane", t:"Producing Director"},
      ae:{name:"Theo Brandt", t:"Production AE"}, pace:{name:"Half Hour", t:"Pacemaker"},
      lensA:{name:"Make the Season", t:"ambition"}, lensB:{name:"Make the Budget", t:"restraint"} },
    rights:     { name:"Rights & Royalties", gate:85, dh:{name:"Imogen Sale", t:"Licensing"},
      ae:{name:"Ruben Ostry", t:"Rights AE"}, pace:{name:"Clearance", t:"Pacemaker"},
      lensA:{name:"Secure It", t:"get the show"}, lensB:{name:"Read the Grant", t:"comply first"} },
    patrons:    { name:"Patrons", gate:80, dh:{name:"Nadia Rooke", t:"Patron Services"},
      ae:{name:"Elias Mott", t:"Subscriptions AE"}, pace:{name:"Renewal", t:"Pacemaker"},
      lensA:{name:"Grow the List", t:"acquire"}, lensB:{name:"Keep the Seat", t:"retain"} },
    dev:        { name:"Development", gate:85, dh:{name:"Harriet Loew", t:"Development Director"},
      ae:{name:"Iris Calder", t:"Giving AE"}, pace:{name:"Steward", t:"Pacemaker"},
      lensA:{name:"Raise It", t:"the ask"}, lensB:{name:"Honour the Restriction", t:"the donor's intent"} },
    sponsors:   { name:"Sponsorship", gate:80, dh:{name:"Deshawn Pryor", t:"Partnerships"},
      ae:{name:"Wren Aoki", t:"Sponsor AE"}, pace:{name:"Fulfilment", t:"Pacemaker"},
      lensA:{name:"Sell the Season", t:"new money"}, lensB:{name:"Deliver the Promise", t:"what we owe"} },
    volunteers: { name:"Volunteers", gate:80, dh:{name:"Bea Tillman", t:"Volunteer Coordinator"},
      ae:{name:"Ola Nkemdi", t:"Scheduling AE"}, pace:{name:"Call List", t:"Pacemaker"},
      lensA:{name:"Cover the Shift", t:"staff the house"}, lensB:{name:"Don't Burn Them Out", t:"the same six people"} },
    education:  { name:"Education", gate:80, dh:{name:"Ana Ruiz-Hale", t:"Education Director"},
      ae:{name:"Jonah Beck", t:"Programs AE"}, pace:{name:"Roster", t:"Pacemaker"},
      lensA:{name:"Fill the Class", t:"enrolment"}, lensB:{name:"Keep It Reachable", t:"scholarships"} },
    books:      { name:"Books", gate:85, dh:{name:"Roland Mbeki", t:"Finance"},
      ae:{name:"Pilar Sund", t:"Bookkeeping AE"}, pace:{name:"Reconcile", t:"Pacemaker"},
      lensA:{name:"Show the Surplus", t:"the board wants good news"}, lensB:{name:"Show the Truth", t:"the 990 is public"} },
    law:        { name:"Law & Counsel", gate:85, dh:{name:"Counsel", t:"Knowledge Desk"},
      ae:{name:"Docket", t:"Compliance AE"}, pace:{name:"Standard of Care", t:"Pacemaker"},
      lensA:{name:"Statute", t:"what the code says"}, lensB:{name:"Precedent", t:"how it has gone"} }
  };

  /* Where a question goes. Keyword routing, deliberately legible. */
  var ROUTES = [
    { d:"rights",     k:["rights","royalt","licen","mti","dramatists","concord","perform the","score","script"] },
    { d:"dev",        k:["donor","donat","gift","pledge","grant","restricted","acknowledg","gala","brick","giving","fundrais"] },
    { d:"sponsors",   k:["sponsor","playbill ad","partner","renew","fulfil","fulfill"] },
    { d:"volunteers", k:["volunteer","usher","shift","hours","crew","strike","load-in"] },
    { d:"education",  k:["class","camp","student","tuition","scholarship","teacher","enrol","enroll"] },
    { d:"books",      k:["book","surplus","deficit","expense","990","functional","cash","financ","in the black","in the red","how are we doing","revenue","income"] },
    { d:"law",        k:["legal","law","liab","board","fiduciar","bylaw","insur","stipend","deduct","compl","conflict"] },
    { d:"patrons",    k:["patron","subscri","season ticket","season package","package","renewal","lapsed","flex"] },
    { d:"boxoffice",  k:["seat","ticket","house","comp","hold","walk-up","box office","sold"] },
    { d:"productions",k:["show","product","season","rehears","cast","budget","venue","open"] }
  ];
  function routeDept(q) {
    /* Counsel gets first refusal. "Can we move grant money to another show" is a
       restricted-funds question, not a fundraising one, and "are tickets tax
       deductible" is a substantiation question, not a bookkeeping one. Both
       routed wrong on keyword weight alone. If the law desk holds a graded
       answer, the law desk takes it. */
    if (typeof lawAsk === "function" && lawAsk(q)) return "law";
    var s = String(q||"").toLowerCase(), best = null, hits = 0;
    ROUTES.forEach(function (r) {
      var n = r.k.reduce(function (a,w){ return a + (s.indexOf(w)>=0?1:0); }, 0);
      if (n > hits) { hits = n; best = r.d; }
    });
    return SEATS[best] ? best : "productions";
  }

  /* The brain. Every handler reads the REAL seeded record and returns a
     stance, a confidence, and reasons tagged [data] or [assumption]. Nothing
     here invents a figure. */
  var BRAIN = {
    rights: function (d) {
      var un = C.rightsUnsecured(d), onsale = un.filter(function(p){ return p.stage==="On Sale"; });
      return { stance: un.length
          ? un.length + " of " + d.productions.length + " productions do not hold secured rights. "
            + (onsale.length ? onsale.length + " of those are already selling — stop that today."
                             : "None are selling yet, which is the only reason this is not an emergency.")
          : "Every production in the season holds secured rights.",
        conf: un.length ? 96 : 92,
        reasons: [
          { t:"data", s: un.length + " unsecured: " + (un.map(function(p){return p.title+" ("+p.rights+")";}).join("; ") || "none") },
          { t:"data", s:"The gate blocks On Sale until the licensor confirms. Seats cannot be sold against an unsigned quote." },
          { t:"assumption", s:"Quoted is not secured. A quote is a price, not a licence." }
        ] };
    },
    dev: function (d) {
      var un = C.unacknowledgedGifts(d), rest = C.restrictedFunds(d);
      var pledges = d.gifts.filter(function(g){ return g.kind==="Pledge"; });
      var outstanding = pledges.reduce(function(s,g){ return s + ((g.pledged||0)-(g.paid||0)); },0);
      return { stance: un.length + " gifts are unacknowledged and " + money(outstanding) + " of pledged money is still outstanding.",
        conf: 88,
        reasons: [
          { t:"data", s: un.length + " gifts have no acknowledgment on file, totalling " + money(un.reduce(function(s,g){return s+g.amt;},0)) + "." },
          { t:"data", s: rest.length + " restricted fund(s) on the books: " + (rest.map(function(g){return g.donor;}).join(", ")||"none") + "." },
          { t:"assumption", s:"Written acknowledgment matters for donor substantiation. Counsel grades the threshold — this desk does not." }
        ] };
    },
    sponsors: function (d) {
      var gaps = C.sponsorGaps(d);
      return { stance: gaps.length
          ? gaps.length + " promised sponsor benefits have not shipped. That is the renewal conversation, whether or not anyone raises it."
          : "Every sponsor benefit on the books has been delivered.",
        conf: 87,
        reasons: [
          { t:"data", s: gaps.slice(0,3).map(function(g){return g.sponsor+" — "+g.item;}).join("; ") || "no outstanding items" },
          { t:"data", s: d.sponsors.length + " sponsors carrying " + money(d.sponsors.reduce(function(s,x){return s+x.amt;},0)) + "." },
          { t:"assumption", s:"Unshipped benefits are the most common reason a local sponsor quietly does not renew." }
        ] };
    },
    volunteers: function (d) {
      var top = d.volunteers.slice().sort(function(a,b){ return b.hours-a.hours; })[0];
      var h = C.volunteerHours(d), n = C.activeVolunteers(d);
      var share = top ? (top.hours/h*100) : 0;
      return { stance: h + " volunteer hours logged across " + n + " active people; the top volunteer carries " + pct(share,0) + " of them.",
        conf: 84,
        reasons: [
          { t:"data", s:"Top: " + (top ? top.name + " at " + top.hours + " h" : "none") + "." },
          { t:"data", s:"Hours are logged per person — a grant report can be produced from the record rather than reconstructed." },
          { t:"assumption", s:"No dollar value is attached. The Independent Sector hourly rate is not sourced in this build, and a made-up figure in a grant report is worse than none." }
        ] };
    },
    education: function (d) {
      var full = d.classes.filter(function(c){ return c.enrolled >= c.seats; });
      var soft = d.classes.filter(function(c){ return c.enrolled / c.seats < 0.5; });
      var schol = d.classes.reduce(function(s,c){ return s + (c.schol||0); },0);
      return { stance: full.length + " class(es) are full, " + soft.length + " are under half, and " + schol + " seats are on scholarship.",
        conf: 86,
        reasons: [
          { t:"data", s: d.classes.map(function(c){ return c.name+" "+c.enrolled+"/"+c.seats; }).join(" · ") },
          { t:"data", s:"Tuition net of scholarship is " + money(C.tuitionRevenue(d)) + " season to date." },
          { t:"assumption", s:"A class under half by the second week rarely fills; the decision to run or fold is a money decision, not a hope." }
        ] };
    },
    books: function (d) {
      var f = C.functionalSplit(d), s = C.surplus(d);
      return { stance: (s>=0 ? "Season to date is " + money(s) + " in the black" : "Season to date is " + money(Math.abs(s)) + " in the red")
          + ", on " + pct(C.contributedShare(d),0) + " contributed income.",
        conf: 90,
        reasons: [
          { t:"data", s:"Earned " + money(C.earnedTotal(d)) + " · contributed " + money(C.contributedTotal(d)) + " · expenses " + money(C.expensesTotal(d)) + "." },
          { t:"data", s:"Functional split — program " + pct(f.pct.Program,1) + ", management " + pct(f.pct.Management,1) + ", fundraising " + pct(f.pct.Fundraising,1) + "." },
          { t:"assumption", s:"No sector benchmark is shown. TCG and AFP figures are not sourced in this build, so the room reports the house's own numbers and nothing else." }
        ] };
    },
    law: function (d, q) {
      var hit = lawAsk(q);
      if (!hit) {
        return { stance:"Counsel is a knowledge desk, not a lawyer. Ask it something specific and it will grade the answer.",
          conf: 80, grade:null,
          reasons: [
            { t:"data", s:"Every answer is graded CLEAR, CAUTION or ATTORNEY and carries its reasoning." },
            { t:"assumption", s:"Anything binding goes to a licensed Idaho attorney. The desk says so rather than guessing." }
          ] };
      }
      /* Confidence is the desk's certainty in the GRADE, not in being right for
         you. An ATTORNEY grade is a confident referral, not a weak answer. */
      var conf = hit.grade === "CLEAR" ? 94 : (hit.grade === "CAUTION" ? 86 : 88);
      return { stance: hit.chair, conf: conf, grade: hit.grade,
        reasons: [
          { t:"data",       s:"Statute — " + hit.statute },
          { t:"data",       s:"Precedent — " + hit.precedent },
          { t:"assumption", s:"Why this grade — " + hit.why },
          { t:"assumption", s:"Not legal advice. For anything binding, hire a licensed Idaho attorney." }
        ] };
    },
    patrons: function (d) {
      var subs = d.packages.reduce(function(s,p){ return s+p.sold; },0);
      return { stance: subs + " season packages sold, worth " + money(C.subscriptionRevenue(d)) + " before a single show opens.",
        conf: 88,
        reasons: [
          { t:"data", s: d.packages.map(function(p){ return p.name+" ×"+p.sold; }).join(" · ") },
          { t:"data", s:"Subscription money arrives before the season's costs do — it is the house's working capital." },
          { t:"assumption", s:"Renewal rate is not computed here; last season's list is not in the seed." }
        ] };
    },
    boxoffice: function (d) {
      return { stance: C.ticketsSold(d) + " seats sold at " + pct(C.paidCapacity(d),1) + " paid capacity, and "
          + money(C.feesAvoided(d)) + " stayed in the house that a per-ticket platform would have taken.",
        conf: 89,
        reasons: [
          { t:"data", s:"Revenue kept " + money(C.revenueKept(d)) + ", of which " + money(C.feesAvoided(d)) + " is fees not paid." },
          { t:"data", s:"Paid capacity counts only shows that have actually run." },
          { t:"assumption", s:"The avoided fee is modelled at " + money(C.PLATFORM_FEE_PER_TICKET) + " per ticket — change it in the seed to match a real quote." }
        ] };
    },
    productions: function (d) {
      var un = C.rightsUnsecured(d), open = C.openTasks(d);
      return { stance: d.productions.length + " productions in the season; " + un.length + " without secured rights and " + open.length + " open tasks.",
        conf: 87,
        reasons: [
          { t:"data", s: d.productions.map(function(p){ return p.title+" ("+p.stage+")"; }).join(" · ") },
          { t:"data", s:"Committed spend " + money(d.productions.reduce(function(s,p){return s+p.spend;},0)) + " against budget " + money(d.productions.reduce(function(s,p){return s+p.budget;},0)) + "." },
          { t:"assumption", s:"A slot with no rights is a hole in the season, not a show." }
        ] };
    }
  };

  function consult(q) {
    var key = routeDept(q), dept = SEATS[key];
    var verdict = (BRAIN[key] || BRAIN.productions)(db(), q);
    var passed = verdict.conf >= dept.gate;
    var trace = [
      { topic:"ask.received",   body:q },
      { topic:"dh.assigned",    body:dept.dh.name + " (" + dept.dh.t + ") takes it for " + dept.name + "." },
      { topic:"ae.packaged",    body:dept.ae.name + " pulls the record and packages the question." },
      { topic:"lens." + dept.lensA.name.toLowerCase().replace(/\s+/g,"_"), body:dept.lensA.name + " argues " + dept.lensA.t + "." },
      { topic:"lens." + dept.lensB.name.toLowerCase().replace(/\s+/g,"_"), body:dept.lensB.name + " argues " + dept.lensB.t + "." },
      { topic:"pace.gate",      body:dept.pace.name + " holds the bar at " + dept.gate + "%. Reading " + verdict.conf + "%." +
                                       (verdict.grade ? " Graded " + verdict.grade + "." : "") },
      { topic: passed ? "released" : "escalated",
        body: passed ? "Cleared the bar — released without the board." : "Below the bar — escalated to the Managing Director." }
    ];
    return { dept:dept, key:key, result:{ verdict:verdict, passed:passed }, trace:trace,
             packaged: verdict.stance };
  }
  function askCOO(q) { return consult(q); }

  /* ------------------------------------------------------- the law desk
     Statute · Precedent · Chair, taken from the live Lake City Playhouse
     Counsel desk. Three grades, never a bare answer. Nothing here is legal
     advice and the desk says so every single time. */
  var LAW_GRADES = {
    CLEAR:    { k:"CLEAR",    dot:"🟢", label:"CLEAR — settled + cited" },
    CAUTION:  { k:"CAUTION",  dot:"🟡", label:"CAUTION — gray, document it" },
    ATTORNEY: { k:"ATTORNEY", dot:"🔴", label:"ATTORNEY — get a lawyer" }
  };
  var LAW_DESK = [
    { q:"Do we charge sales tax on tickets?", grade:"CAUTION",
      trigger:["sales tax","charge tax","remit","tax on tickets","tax on admission"],
      statute:"Idaho levies a state sales tax of 6% and admissions are generally within the sales-tax base.",
      precedent:"Houses in this state commonly collect it on paid admissions and remit on the state's schedule. The OS already tracks what is owed.",
      chair:"Collect it, show it as a separate line, and remit on time. Whether a specific benefit event or a member ticket is treated the same way is exactly where houses get it wrong.",
      why:"The rate is settled. The treatment of a particular ticket type is not, and it turns on facts this desk does not have." },
    { q:"Are our tickets tax-deductible?", grade:"CAUTION",
      trigger:["deduct","write off","write-off","quid pro quo","fair market value","gala seat","receipt"],
      statute:"A payment is only deductible to the extent it exceeds the value of what the donor received in return.",
      precedent:"A $25 seat bought for $25 is not a gift. A $250 gala seat against a $60 dinner is a gift of the difference — and the house is expected to say so in writing.",
      chair:"Never tell a patron a ticket is deductible. For benefit events, state the fair market value of what they received on the receipt.",
      why:"This is the single most common 501(c)(3) mistake a community house makes, and it lands on the donor, not the house." },
    { q:"Do we need a licence to perform a play?", grade:"CLEAR",
      trigger:["licence","license","perform a play","performance right","rights to perform","royalt"],
      statute:"Public performance of a copyrighted work requires permission from the rights holder. Buying scripts is not permission.",
      precedent:"Licensors quote per production and per performance; terms and restrictions travel with the licence.",
      chair:"No show goes on sale without a secured licence. The OS gates it — that is not a preference, it is the gate.",
      why:"Settled law, and the OS can prove compliance from the record." },
    { q:"Can we use grant money for a different show?", grade:"ATTORNEY",
      trigger:["restricted","grant money","reallocate","different show","move the money","donor intent"],
      statute:"Restricted funds must be used for the purpose the donor or funder designated.",
      precedent:"Moving restricted money to general operating is a breach of the restriction, not a budgeting decision, even when the house intends to pay it back.",
      chair:"Do not move it. If the programme genuinely cannot happen, go back to the funder in writing and ask to release or redirect the restriction.",
      why:"There is restricted money on these books right now. Getting this wrong is the kind of thing that ends a relationship with a funder — and can be worse." },
    { q:"Is a volunteer stipend okay?", grade:"ATTORNEY",
      trigger:["stipend","pay a volunteer","paying volunteers","volunteer pay","reimburse"],
      statute:"Paying a volunteer can convert them into an employee for wage-and-hour purposes.",
      precedent:"Small, genuine expense reimbursements are treated differently from a regular per-show payment.",
      chair:"Reimburse documented expenses. Do not pay a recurring stipend without counsel — and never for someone doing what a paid role would do.",
      why:"The line here is fact-specific and the downside is back wages and penalties." },
    { q:"What are our board's legal duties?", grade:"CLEAR",
      trigger:["fiduciar","board duty","board duties","duty of care","conflict of interest","bylaw","director owes"],
      statute:"A director owes duties of care, loyalty and obedience to the organisation's purpose.",
      precedent:"In practice: show up informed, disclose conflicts, and do not spend the money on something other than the mission.",
      chair:"Keep a signed conflict-of-interest form for every director and minute the decisions. The Governance room tracks who has one.",
      why:"The duties are settled; the evidence you complied with them is what you actually need." }
  ];
  function lawAsk(q) {
    /* A distinctive trigger phrase wins outright. Otherwise the question has to
       overlap the desk entry on at least TWO significant words — one word is not
       a match, which is how "how many volunteer hours" was being answered with
       the volunteer-stipend ruling, and how "tax deductible" was being answered
       with the sales-tax ruling. Counsel should decline rather than misfire. */
    var s = " " + String(q||"").toLowerCase().replace(/[^a-z0-9 ]/g," ") + " ";
    var raw = String(q||"").toLowerCase();
    var best = null, score = 0;
    LAW_DESK.forEach(function (item) {
      (item.trigger || []).forEach(function (t) {
        if (raw.indexOf(t) >= 0 && score < 99) { best = item; score = 99; }
      });
    });
    if (best) return best;
    LAW_DESK.forEach(function (item) {
      var words = item.q.toLowerCase().replace(/[^a-z ]/g," ").split(/\s+/)
        .filter(function (w) { return w.length > 3 && ["what","need","okay","from","with","that","this","their","have","does"].indexOf(w) < 0; });
      var n = words.reduce(function (a,w){ return a + (s.indexOf(" "+w) >= 0 ? 1 : 0); }, 0);
      if (n > score) { score = n; best = item; }
    });
    return score >= 2 ? best : null;
  }

  /* ------------------------------------------------------------- approvals
     Ghost Mode. Anything that would send, spend, publish or book a human is
     staged here instead of happening. */
  function approvals() { return db().approvals || []; }
  function stage(kind, title, summary, by) {
    save(function (d) {
      d.approvals = d.approvals || [];
      d.approvals.push({ id:"a"+(d.approvals.length+1), kind:kind, title:title,
        summary:summary, by:by||"the org", state:"Pending" });
    });
    return approvals();
  }
  function decideApproval(id, state) {
    save(function (d) { (d.approvals||[]).forEach(function (a) { if (a.id===id) a.state=state; }); });
    return approvals();
  }

  /* ------------------------------------------------------------------- ui */
  function toast(msg, kind) {
    var w = document.getElementById("toast-wrap"); if (!w) return;
    var t = el('<div class="toast '+(kind||"")+'">'+esc(msg)+'</div>');
    w.appendChild(t); setTimeout(function(){ t.classList.add("out"); setTimeout(function(){ t.remove(); }, 300); }, 2600);
  }
  function page(title, sub, actionsHTML) {
    return el('<div class="pagehead"><div><h1>'+esc(title)+'</h1>'+
      (sub?'<p class="sub">'+sub+'</p>':"")+'</div>'+
      '<div class="pagehead-actions">'+(actionsHTML||"")+'</div></div>');
  }
  function card(inner, cls){ return el('<section class="card '+(cls||"")+'">'+inner+'</section>'); }
  function stat(label, value, note, band){
    return '<div class="stat '+(band||"")+'"><div class="s-l">'+esc(label)+'</div>'+
      '<div class="s-v">'+value+'</div>'+(note?'<div class="s-n">'+note+'</div>':"")+'</div>';
  }
  function tag(text, kind){ return '<span class="tag '+(kind||"")+'">'+esc(text)+'</span>'; }
  function srcNote(text){ return '<div class="srcnote">'+esc(text)+'</div>'; }

  function renderShell(active) {
    var side = document.createElement("aside"); side.className = "sidebar";
    side.appendChild(el(
      '<a href="dashboard.html" class="brand">'+
        /* The real product icon from the AE icon set, not a drawn stand-in.
           Served from the .com so one file updates every property. */
        '<div class="bmark art" aria-hidden="true">'+
          '<img src="https://www.aexperiences.com/Musical_OS.png" alt="" width="38" height="38">'+
        '</div>'+
        '<div><div class="bt">Musical OS</div><div class="bs">Community Playhouse OS</div></div>'+
      '</a>'
    ));
    var nav = document.createElement("nav"); nav.className = "nav";
    var on = C.activeRooms();
    DEPTS.forEach(function (grp) {
      nav.appendChild(el('<div class="nav-group">'+esc(grp.group)+'</div>'));
      grp.items.forEach(function (it) {
        var off = it.room && on.indexOf(it.room) < 0;
        var a = el('<a href="'+(off?"javascript:void(0)":it.href)+'" class="navlink '+
          (it.href===active?"active":"")+(off?" locked":"")+'">'+
          '<span class="ic">'+esc(it.ic||"·")+'</span><span class="lb">'+esc(it.label)+'</span>'+
          (off?'<span class="lock">+</span>':"")+'</a>');
        if (off) {
          a.title = "Not in this build — add "+ROOMS[it.room].label+" for "+
                    money(ROOMS[it.room].mo)+"/mo + "+money(ROOMS[it.room].build)+" build";
          a.addEventListener("click", function () {
            C.toggleRoom(it.room);
            toast(ROOMS[it.room].label+" added — "+C.priceLabel(), "ok");
            setTimeout(function(){ location.reload(); }, 500);
          });
        }
        nav.appendChild(a);
      });
    });
    side.appendChild(nav);

    /* the way out — lands in the STORE, never the marketing homepage */
    side.appendChild(el(
      '<div class="sideout">'+
        '<a class="so-main" href="'+C.STORE_URL+'">'+
          '<span><span class="so-k">Musical OS</span>'+
          '<span class="so-t">See pricing &amp; packages</span></span>'+
          '<span class="so-a">&rarr;</span>'+
        '</a>'+
        '<a class="so-sub" href="'+C.SHOP_URL+'">All Accelerated Experiences products &rarr;</a>'+
      '</div>'
    ));
    return side;
  }

  function renderTopbar(crumb) {
    var p = C.priceNow();
    var bar = document.createElement("div"); bar.className = "topbar";
    bar.innerHTML =
      '<div class="crumbs">Musical OS <span class="mono" style="opacity:.62;font-size:11px">V3.0</span> · <b>'+esc(crumb)+'</b></div>'+
      '<div class="spacer"></div>'+
      '<div class="tierpill" id="tierPillStatic">'+
        '<span class="dot"></span><div><b>'+esc(p.tier.name)+(p.changed?' <i class="cfg">configured</i>':'')+'</b> '+
        '<span class="price">'+money(p.mo)+'/mo · '+money(p.build)+' build</span></div>'+
        '<span class="chev">▾</span></div>'+
      '<div class="who"><div class="av">MV</div><div>Marisol Vane<br>'+
        '<span class="muted small">Managing Director</span></div></div>';

    var menu = document.createElement("div"); menu.className="tiermenu"; menu.id="tierMenu";
    menu.appendChild(el('<div class="tm-head">Start from a package, then <b>add or take off any department</b>. '+
      'Every one is priced on its own, so the build fits the house instead of the house fitting the build.</div>'));
    Object.keys(TIERS).sort(function(a,b){ return TIERS[b].rank-TIERS[a].rank; }).forEach(function (k) {
      var tt = TIERS[k];
      var opt = el('<div class="tieropt '+(k===C.tier()?"on":"")+'">'+
        '<div class="to-top"><span class="to-name">'+esc(tt.name)+'</span>'+
        '<span class="to-price">'+money(tt.mo)+'/mo · '+money(tt.build)+' build</span></div>'+
        '<div class="to-desc">'+esc(tt.desc)+'</div>'+
        '<div class="to-base">'+esc(tt.base)+' · '+tt.includes.length+' departments</div></div>');
      opt.addEventListener("click", function (e) { e.stopPropagation(); C.setTier(k); location.reload(); });
      menu.appendChild(opt);
    });
    menu.appendChild(el('<div class="tm-sub">Departments — toggle any one on or off</div>'));
    var on = C.activeRooms();
    var list = document.createElement("div"); list.className="roomlist";
    Object.keys(ROOMS).forEach(function (k) {
      var r = ROOMS[k], isOn = on.indexOf(k)>=0, inPack = p.tier.includes.indexOf(k)>=0;
      var row = el('<div class="roomrow '+(isOn?"on":"")+'">'+
        '<span class="rr-box">'+(isOn?"✓":"+")+'</span>'+
        '<span class="rr-name">'+esc(r.label)+
          (isOn&&!inPack?' <i class="rr-flag add">added</i>':'')+
          (!isOn&&inPack?' <i class="rr-flag off">removed</i>':'')+'</span>'+
        '<span class="rr-price">'+money(r.mo)+'/mo<i>'+money(r.build)+' build</i></span>'+
        '<span class="rr-why">'+esc(r.why)+'</span></div>');
      row.addEventListener("click", function (e) {
        e.stopPropagation(); C.toggleRoom(k);
        toast(r.label+(C.activeRooms().indexOf(k)>=0?" added — ":" removed — ")+C.priceLabel(), "ok");
        setTimeout(function(){ location.reload(); }, 500);
      });
      list.appendChild(row);
    });
    menu.appendChild(list);
    menu.appendChild(el('<div class="tm-total">'+
      '<div class="tt-line"><span>'+esc(p.tier.name)+' package</span><b>'+money(p.tier.mo)+'/mo</b></div>'+
      (p.adds.length?'<div class="tt-line add"><span>+ '+p.adds.length+' department'+(p.adds.length>1?"s":"")+' added</span><b>+'+money(p.addMo)+'/mo</b></div>':'')+
      (p.offs.length?'<div class="tt-line off"><span>− '+p.offs.length+' department'+(p.offs.length>1?"s":"")+' removed</span><b>−'+money(p.offMo)+'/mo</b></div>':'')+
      '<div class="tt-line grand"><span>Configured</span><b>'+money(p.mo)+'/mo · '+money(p.build)+' build</b></div>'+
      '<div class="tt-draft">Draft pricing — Accelerated Experiences LLC sets every live price.</div>'+
      '</div>'));
    menu.addEventListener("click", function(e){ e.stopPropagation(); });
    setTimeout(function () {
      var pill = document.getElementById("tierPill");
      if (pill) pill.addEventListener("click", function(e){ e.stopPropagation(); menu.classList.toggle("open"); });
      document.addEventListener("click", function(){ menu.classList.remove("open"); });
    }, 0);
    var frag = document.createDocumentFragment(); frag.appendChild(bar); frag.appendChild(menu);
    return frag;
  }

  function ribbon() {
    return el('<div class="ribbon"><span class="live">LIVE SHOWROOM</span>'+
      ' — this is the real OS, not a slideshow. Everything you type stays in your browser and resets when you leave. '+
      '<a href="javascript:void(0)" id="resetFloor">Reset the floor</a></div>');
  }
  function footer() {
    return el('<div class="ae-credit">Powered by <b>Accelerated Experiences LLC</b> · Musical OS is a white-label build. '+
      'The playhouse on this floor is fictional. Where a sector benchmark is not sourced, the metric ships with no target rather than a guess.</div>');
  }
  /* The fleet-wide Command Center polish layer. One file on the store, loaded by
     every product, so a change lands everywhere at once instead of fourteen times. */
  function loadFlava(){
    if(document.getElementById("aeFlavaCss")) return;
    var l=document.createElement("link"); l.id="aeFlavaCss"; l.rel="stylesheet";
    l.href="https://www.aexperiences.com/ae-flava.css"; document.head.appendChild(l);
    var j=document.createElement("script"); j.src="https://www.aexperiences.com/ae-flava.js";
    j.defer=true; document.head.appendChild(j);
  }

  function mount(opts) {
    try{ loadFlava(); }catch(e){}
    opts = opts || {}; db();
    var app = document.createElement("div"); app.className="app";
    var side = renderShell(opts.active);
    var main = document.createElement("div"); main.className="main";
    main.appendChild(ribbon());
    main.appendChild(renderTopbar(opts.crumb || "Command Center"));
    var content = document.createElement("div"); content.className="content"; content.id="content";
    main.appendChild(content);
    main.appendChild(footer());
    app.appendChild(side); app.appendChild(main);
    document.body.innerHTML=""; document.body.appendChild(app);
    document.body.appendChild(el('<div id="toast-wrap"></div>'));
    setTimeout(function () {
      var r = document.getElementById("resetFloor");
      if (r) r.addEventListener("click", function () {
        C.resetFloor(); toast("Showroom reset to a fresh floor.", "ok");
        setTimeout(function(){ location.reload(); }, 450);
      });
    }, 0);
    return content;
  }

  /* one namespace for the room pages */
  var API = { SEATS:SEATS, BRAIN:BRAIN, LAW_DESK:LAW_DESK, LAW_GRADES:LAW_GRADES,
    routeDept:routeDept, consult:consult, askCOO:askCOO, lawAsk:lawAsk,
    approvals:approvals, stage:stage, decideApproval:decideApproval,
    mount:mount, toast:toast, el:el, esc:esc, pct:pct, hours:hours,
    page:page, card:card, stat:stat, tag:tag, srcNote:srcNote };
  Object.keys(C).forEach(function (k) { if (!(k in API)) API[k] = C[k]; });
  global.Musical = API;
})(window);

/* ============================================================================
   AE mobile drawer enhancer (Jul 27 2026) — progressive enhancement.
   Injects a hamburger + scrim + toggle so any shell with .app/.sidebar/.topbar
   gets a proper off-canvas drawer on phones instead of a stacked-on-top nav.
   Self-contained; safe to append to any engine. ============================ */
(function(){
  function init(){
    var app=document.querySelector('.app'),
        side=document.querySelector('.sidebar'),
        bar=document.querySelector('.topbar');
    if(!app||!side||!bar) return;
    if(document.getElementById('aeNavToggle')) return;
    var scrim=document.querySelector('.navscrim');
    if(!scrim){ scrim=document.createElement('div'); scrim.className='navscrim'; app.appendChild(scrim); }
    var btn=document.createElement('button');
    btn.id='aeNavToggle'; btn.className='ae-navtoggle'; btn.setAttribute('aria-label','Menu');
    btn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';
    bar.insertBefore(btn, bar.firstChild);
    btn.addEventListener('click', function(e){ e.stopPropagation(); app.classList.toggle('nav-open'); });
    scrim.addEventListener('click', function(){ app.classList.remove('nav-open'); });
    side.addEventListener('click', function(e){ if(e.target.closest('a')) app.classList.remove('nav-open'); });
  }
  function boot(){ init(); setTimeout(init,150); setTimeout(init,500); setTimeout(init,1200); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();

/* ============================================================================
   AE in-flow COO assistant (Jul 28 2026) — "Ask the COO" on every page.
   Self-contained. Auto-detects the OS engine and drops a floating assistant
   into every room. Two jobs:
     1) CONCIERGE — explains the agent organization, how the system works,
        customization/white-label, and live pricing (pulled from the OS's own
        TIERS/ROOMS/SEATS).
     2) OPERATOR — business/operational questions route through the real agent
        org (routeDept -> consult -> gated verdict), same as the Org page.
   Ghost Mode: it answers, it never acts.
   ============================================================================ */
(function(){
  function findENG(){
    var names=['FB','Amph','EightMM','Truss','Abode','LilNinja','Buttress','Musical','Showroom'];
    for(var i=0;i<names.length;i++){ var g=window[names[i]]; if(g&&g.routeDept&&g.consult&&g.SEATS&&g.SEATS.coo&&g.SEATS.depts) return g; }
    return null;
  }
  function init(){
    if(document.getElementById('aeCooFab')) return;
    if(!document.querySelector('.app')) return;           // inside the OS only, not the gate
    var ENG=findENG(); if(!ENG) return;
    var isTg=(window.Showroom&&ENG===window.Showroom);
    var esc=ENG.esc||function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
    var money=ENG.money||function(n){return '$'+(Math.round(n||0)).toLocaleString();};
    var coo=ENG.SEATS.coo, nd=ENG.SEATS.depts.length;
    var v=isTg
      ?{surface:'var(--panel,#181E2A)',surf2:'var(--panel-2,#1F2634)',text:'var(--text,#EAEDF4)',mut:'var(--muted,#8B95A9)',line:'var(--line,#2C3547)',prim:'var(--brand,#FF6A2C)',onprim:'#160a04',good:'var(--ok,#4ADE80)',warn:'var(--warn,#FBBF24)'}
      :{surface:'var(--card,#fff)',surf2:'var(--sunk,#efe9df)',text:'var(--ink,#1a1a1a)',mut:'var(--mut,#888)',line:'var(--line,#ddd)',prim:'var(--mag,#c8501e)',onprim:'#fff',good:'var(--good,#4a8a5a)',warn:'var(--watch,#d19a2b)'};
    var st=document.createElement('style'); st.id='aeCooStyle';
    st.textContent=
      '#aeCooFab{position:fixed;right:18px;bottom:18px;z-index:95;width:54px;height:54px;border-radius:50%;border:none;cursor:pointer;background:'+v.prim+';color:'+v.onprim+';box-shadow:0 12px 30px -8px rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:18px;transition:transform .15s}'+
      '#aeCooFab:hover{transform:translateY(-2px)}'+
      '#aeCooFab .lbl{position:absolute;right:62px;white-space:nowrap;background:'+v.surface+';color:'+v.text+';border:1px solid '+v.line+';border-radius:999px;padding:5px 11px;font-size:11.5px;font-weight:700;box-shadow:0 8px 22px -12px rgba(0,0,0,.5);opacity:0;pointer-events:none;transition:opacity .15s}'+
      '#aeCooFab:hover .lbl{opacity:1}'+
      '#aeCooPanel{position:fixed;right:18px;bottom:82px;z-index:130;width:346px;max-width:calc(100vw - 30px);height:486px;max-height:calc(100dvh - 120px);border-radius:16px;background:'+v.surface+';border:1px solid '+v.line+';box-shadow:0 26px 64px -20px rgba(0,0,0,.6);display:none;flex-direction:column;overflow:hidden}'+
      '#aeCooPanel.open{display:flex}'+
      '.aecoo-head{padding:12px 14px;display:flex;align-items:center;gap:10px;border-bottom:1px solid '+v.line+'}'+
      '.aecoo-head .av{width:30px;height:30px;border-radius:8px;display:grid;place-items:center;font-weight:800;font-size:13px;background:'+v.prim+';color:'+v.onprim+'}'+
      '.aecoo-head b{font-size:13.5px;color:'+v.text+'} .aecoo-head .r{font-size:10.5px;color:'+v.mut+'}'+
      '.aecoo-x{margin-left:auto;background:transparent;border:none;color:'+v.mut+';cursor:pointer;font-size:19px;line-height:1}'+
      '.aecoo-msgs{flex:1;overflow-y:auto;padding:13px;display:flex;flex-direction:column;gap:11px}'+
      '.aecoo-b{max-width:88%;padding:9px 12px;border-radius:13px;font-size:12.6px;line-height:1.5;white-space:pre-wrap}'+
      '.aecoo-b.you{align-self:flex-end;background:'+v.prim+';color:'+v.onprim+';border-bottom-right-radius:4px}'+
      '.aecoo-b.coo{align-self:flex-start;background:'+v.surf2+';color:'+v.text+';border-bottom-left-radius:4px}'+
      '.aecoo-b.coo.held{border:1px solid '+v.warn+'}'+
      '.aecoo-meta{font-size:10px;font-family:monospace;margin-top:7px;color:'+v.mut+'}'+
      '.aecoo-reasons{margin:8px 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:5px}'+
      '.aecoo-reasons li{font-size:11px;line-height:1.45;display:flex;gap:6px;color:'+v.text+'}'+
      '.aecoo-rtag{font-family:monospace;font-size:8px;letter-spacing:.04em;padding:1px 4px;border-radius:3px;height:fit-content;margin-top:2px;font-weight:700;flex:none}'+
      '.aecoo-rtag.data{background:'+v.good+';color:#fff} .aecoo-rtag.assumption{background:'+v.warn+';color:#2a2000}'+
      '.aecoo-foot{padding:10px 12px;border-top:1px solid '+v.line+'}'+
      '.aecoo-samples{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px}'+
      '.aecoo-chip{font-size:10.5px;padding:4px 9px;border-radius:999px;cursor:pointer;border:1px solid '+v.line+';background:'+v.surf2+';color:'+v.text+'}'+
      '.aecoo-inrow{display:flex;gap:7px}'+
      '.aecoo-in{flex:1;border-radius:9px;padding:9px 10px;font-size:12.5px;border:1px solid '+v.line+';background:'+v.surface+';color:'+v.text+'}'+
      '.aecoo-in:focus{outline:none;border-color:'+v.prim+'}'+
      '.aecoo-send{border:none;border-radius:9px;padding:0 14px;font-weight:800;cursor:pointer;background:'+v.prim+';color:'+v.onprim+'}';
    document.head.appendChild(st);

    /* ---------- concierge knowledge (about the system itself) ---------- */
    function kb(q){
      q=(q||'').toLowerCase();
      function m(){for(var i=0;i<arguments.length;i++){if(q.indexOf(arguments[i])>=0)return true;}return false;}
      if(m('agent org','organization','who runs','who is','the seats','how the org','the org','deliberat','confidence bar','ghost mode','deepseek','ai org','how does the ai','the departments do'))
        return 'This OS runs on a '+nd+'-department AI agent organization, and I’m '+coo.name+', the COO. You ask; I route it to exactly one department, let its five-seat chain — a head, an admin exec, a pacemaker, and two opposing lenses that never confer — work it under its own confidence bar, then bring you one clean answer with its reasons. Money and compliance calls hold a higher 85% bar and come to you if they aren’t certain. Nothing here acts on its own — that’s Ghost Mode; anything that would send, spend or sign is staged on the Approval Desk. The real engine runs server-side on DeepSeek; this showroom is a faithful local stand-in.';
      if(m('price','pricing','cost','how much','what do you charge','tier','plan','package','per month','/mo','subscription','quote','expensive')){
        var ts=Object.keys(ENG.TIERS).map(function(k){return ENG.TIERS[k];}).sort(function(a,b){return (a.mo||0)-(b.mo||0);});
        var lines=ts.map(function(t){return '• '+t.name+' — '+money(t.mo)+'/mo + '+money(t.build)+' one-time build'+(t.desc?': '+t.desc:'');}).join('\n');
        return 'Here are the packages:\n\n'+lines+'\n\nEvery department is also priced on its own, so you can add or drop any one and the price moves with it — tap the tier chip at the top to configure it live. Draft pricing; Accelerated Experiences LLC sets the final number.';
      }
      if(m('custom','white label','white-label','brand','skin','tailor','our own','add a department','add department','remove a','turn off','turn on','configure','make it fit','our data')){
        var rs=Object.keys(ENG.ROOMS).slice(0,4).map(function(k){return ENG.ROOMS[k].label;}).join(', ');
        return 'It’s fully white-label: your brand, your colors, your departments, and your own data seeded in. Start from a package, then add or take off any department — like '+rs+' — so the build fits your business instead of the other way around. Tap the tier chip at the top to switch departments on and off and watch the price move in real time.';
      }
      if(m('what is this','what does it do','what can you do','what can it do','how does it work','is this real','is it real','showroom','slideshow','a demo','real app'))
        return 'This is the real OS, running right here in your browser — not a slideshow. Everything you type stays in this tab and resets when you leave. It’s your whole operation as one system, with a '+nd+'-department AI org underneath it. In the live product it runs on a server with your real data; nothing in this showroom sends, spends or signs — anything that would is staged on the Approval Desk for you. Ask me about the org, pricing, or how to customize it — or ask an operational question and I’ll route it to the right department.';
      if(m('who are you','your name','what are you'))
        return 'I’m '+coo.name+' — the Chief Operating Officer of this OS. I’m the one seat between you and a '+nd+'-department AI org: I take your question, route it, and bring back a clean answer. Ask me how the system works, what it costs, how to customize it, or anything operational.';
      return null;
    }

    var fab=document.createElement('button'); fab.id='aeCooFab'; fab.setAttribute('aria-label','Ask '+coo.name);
    fab.innerHTML='<span class="lbl">Ask '+esc(coo.name)+'</span>◎';
    document.body.appendChild(fab);

    var samples=['What’s the agent org?','How much does it cost?','Can I customize it?','What needs my attention?'];
    var panel=document.createElement('div'); panel.id='aeCooPanel';
    panel.innerHTML=
      '<div class="aecoo-head"><div class="av">'+esc(coo.name.charAt(0))+'</div><div><b>'+esc(coo.name)+'</b><div class="r">'+esc(coo.role)+' · agent org + concierge</div></div><button class="aecoo-x" aria-label="Close">×</button></div>'+
      '<div class="aecoo-msgs" id="aeCooMsgs"></div>'+
      '<div class="aecoo-foot"><div class="aecoo-samples">'+samples.map(function(s){return '<span class="aecoo-chip">'+esc(s)+'</span>';}).join('')+'</div>'+
      '<div class="aecoo-inrow"><input class="aecoo-in" id="aeCooIn" placeholder="Ask '+esc(coo.name)+' anything…"><button class="aecoo-send" id="aeCooSend">Ask</button></div></div>';
    document.body.appendChild(panel);

    var msgs=panel.querySelector('#aeCooMsgs'), input=panel.querySelector('#aeCooIn');
    function bubble(cls,html){ var b=document.createElement('div'); b.className='aecoo-b '+cls; b.innerHTML=html; msgs.appendChild(b); msgs.scrollTop=msgs.scrollHeight; return b; }
    bubble('coo','Hi — I’m '+esc(coo.name)+', your COO. I can explain the agent org, what the system does, how to customize it and what it costs — or take an operational question and route it to the right department. What do you need?');
    function ask(q){
      q=(q||'').trim(); if(!q){ input.focus(); return; }
      bubble('you',esc(q)); input.value='';
      var k=kb(q);
      if(k){ bubble('coo', esc(k).replace(/\n/g,'<br>')); return; }        // concierge answer
      var dk=ENG.routeDept(q), r=ENG.consult(dk,q);                         // else route to the org
      if(!r){ bubble('coo','I couldn’t route that one — try rephrasing, or ask me about the org, pricing or customization.'); return; }
      var dept=ENG.SEATS.depts.filter(function(x){return x.key===dk;})[0]||{name:dk,gate:80};
      var vd=r.verdict, passed=r.passed;
      var reasons=(vd.reasons||[]).map(function(x){return '<li><span class="aecoo-rtag '+esc(x.t)+'">'+esc((x.t||'').toUpperCase())+'</span><span>'+esc(x.s)+'</span></li>';}).join('');
      var head=passed?esc(vd.stance):(esc(coo.name)+': Holding this for you — '+esc(dept.name)+' came in at '+vd.conf+'%, under its '+dept.gate+'% bar, so it needs a human. '+esc(vd.stance));
      bubble('coo'+(passed?'':' held'), head+
        '<ul class="aecoo-reasons">'+reasons+'</ul>'+
        '<div class="aecoo-meta">'+esc(dept.name)+' · '+vd.conf+'% vs '+dept.gate+'% bar · '+(passed?'released':'held — needs you')+'</div>');
    }
    fab.onclick=function(){ panel.classList.toggle('open'); if(panel.classList.contains('open')) setTimeout(function(){input.focus();},50); };
    panel.querySelector('.aecoo-x').onclick=function(){ panel.classList.remove('open'); };
    panel.querySelector('#aeCooSend').onclick=function(){ ask(input.value); };
    input.addEventListener('keydown',function(e){ if(e.key==='Enter') ask(input.value); });
    Array.prototype.forEach.call(panel.querySelectorAll('.aecoo-chip'),function(c){ c.onclick=function(){ ask(c.textContent); }; });
  }
  function boot(){ init(); setTimeout(init,200); setTimeout(init,600); setTimeout(init,1400); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();


/* ── AE Connect — hub-wide incoming-call watcher (ae-connect-watcher) ── */
(function(){
  if (typeof document==='undefined') return;
  var API=(window.MUSICAL_API||'https://ae-connect-api.vercel.app')+'/api/connect', NS='musical';
  function me(){ try{ return JSON.parse(sessionStorage.getItem('musical_connect_me')); }catch(e){ return null; } }
  function post(p){ return fetch(API,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(Object.assign({ns:NS},p))}).then(function(r){return r.json();}).catch(function(){return {ok:false};}); }
  var showing=false;
  function card(r){
    if(showing)return; showing=true;
    var d=document.createElement('div');
    d.style.cssText='position:fixed;right:18px;top:74px;z-index:9600;background:#161d24;color:#eaf1f6;border-radius:14px;padding:16px 18px;box-shadow:0 20px 60px rgba(0,0,0,.45);max-width:300px;font-family:system-ui,sans-serif;border-left:4px solid #e8a33d';
    d.innerHTML='<div style="font-weight:700;font-size:15px">\ud83d\udcf9 '+(r.name||'Someone')+' is calling</div>'+
      '<div style="font-size:12px;opacity:.7;margin:3px 0 12px">'+(r.subject||'Incoming video call')+'</div>'+
      '<button id="aeJoin" style="font:inherit;font-weight:700;background:#e8a33d;color:#241a08;border:none;border-radius:9px;padding:10px 16px;cursor:pointer">Join</button> '+
      '<button id="aeDis" style="font:inherit;background:none;border:1px solid #3f5468;color:#9fb2c2;border-radius:9px;padding:10px 14px;cursor:pointer">Dismiss</button>';
    document.body.appendChild(d);
    function done(){ try{document.body.removeChild(d);}catch(e){} showing=false; }
    d.querySelector('#aeDis').onclick=done;
    d.querySelector('#aeJoin').onclick=function(){ done(); var m=me();
      function go(){ window.MusicalMeet.open({room:r.room,displayName:m?m.name:'Guest',subject:r.subject||''}); }
      if(window.MusicalMeet) go(); else { var sc=document.createElement('script'); sc.src='musical-rtc.js'; sc.onload=go; document.head.appendChild(sc); } };
  }
  function tick(){ var m=me(); if(!m) return;
    post({do:'poll',me:m.slug}).then(function(r){
      if(r&&r.ok&&r.ring&&r.ring.room) card(r.ring);
      if(r&&r.ok&&typeof r.unread==='number'){
        var a=document.querySelector('a[href="connect.html"]');
        if(a){ var b=a.querySelector('.ae-ub');
          if(r.unread>0){ if(!b){ b=document.createElement('span'); b.className='ae-ub';
            b.style.cssText='display:inline-block;min-width:17px;text-align:center;background:#e8a33d;color:#241a08;border-radius:999px;font-size:10.5px;font-weight:700;padding:1px 5px;margin-left:7px'; a.appendChild(b); }
            b.textContent=r.unread; } else if(b){ b.remove(); } } }
    }); }
  setInterval(tick,6000); setTimeout(tick,1500);
})();

/* ── AE Command Center charts (ae-charts) ─────────────────────────────────
   Adaptive: reads whatever this OS actually stores, finds the money series,
   and draws it. Appended to the engine so no dashboard edits are needed.
   Fails silent — if there's nothing numeric to draw, nothing renders.      */
(function(){
  if (typeof document==='undefined') return;
  if (!/dashboard/.test(location.pathname)) return;
  var NAMES=['FB','Fourbarrel','Amph','EightMM','Truss','Abode','LilNinja','Buttress','Musical','MusicalCore','Showroom'];
  function eng(){ for(var i=0;i<NAMES.length;i++){ var g=window[NAMES[i]]; if(g&&typeof g.db==='function') return g; } return null; }
  function cvar(list,fb){ try{ var cs=getComputedStyle(document.documentElement);
    for(var i=0;i<list.length;i++){ var v=(cs.getPropertyValue(list[i])||'').trim(); if(v) return v; } }catch(e){} return fb; }
  var MONEYRE=/fee|price|amount|total|revenue|cost|value|gross|net|tuition|billed|budget|earned|paid|guarantee|sale|msrp|acq/i;
  var LABELRE=/^(name|title|project|show|production|unit|family|account|client|customer|patron|vehicle|item|label|company|program|artist|address|make)$/i;
  var CATRE=/^(phase|status|stage|type|category|kind|dept|department|state|tier|track|discipline|genre)$/i;
  var BAD=/^(id|key|uid|number|vin|stock)$/i;
  function pick(r,f){ return f.indexOf('.')>0 ? ((r[f.split('.')[0]]||{})[f.split('.')[1]]) : r[f]; }

  function discover(d){
    var best=null;
    Object.keys(d||{}).forEach(function(k){
      var a=d[k];
      if(!Array.isArray(a)||a.length<2||typeof a[0]!=='object'||!a[0]) return;
      var fields=[];
      Object.keys(a[0]).forEach(function(f){ var v=a[0][f];
        if(v&&typeof v==='object'&&!Array.isArray(v)){ Object.keys(v).forEach(function(s){ if(typeof v[s]==='number') fields.push(f+'.'+s); }); }
        else fields.push(f); });
      fields.forEach(function(f){
        var vals=a.map(function(r){ return Number(pick(r,f)); }).filter(function(n){ return isFinite(n); });
        if(vals.length<Math.max(2,Math.floor(a.length*0.6))) return;
        var sum=vals.reduce(function(x,y){return x+y;},0); if(!(sum>0)) return;
        var money=MONEYRE.test(f.split('.').pop())||MONEYRE.test(f);
        var score=sum*(money?1000:1);
        if(!best||score>best.score) best={coll:k,rows:a,field:f,sum:sum,money:money,score:score};
      });
    });
    if(!best) return null;
    var k0=Object.keys(best.rows[0]||{});
    best.label=k0.filter(function(f){ return LABELRE.test(f)&&typeof best.rows[0][f]==='string'; })[0]
            || k0.filter(function(f){ return !BAD.test(f)&&typeof best.rows[0][f]==='string'&&String(best.rows[0][f]).length>2; })[0]
            || k0.filter(function(f){ return typeof best.rows[0][f]==='string'; })[0] || null;
    best.cat=k0.filter(function(f){ if(!CATRE.test(f)) return false;
      var set={}; best.rows.forEach(function(r){ if(typeof r[f]==='string') set[r[f]]=1; });
      var n=Object.keys(set).length; return n>=2&&n<=6; })[0]||null;
    return best;
  }

  function build(){
    var E=eng(); if(!E) return;
    var content=document.getElementById('content'); if(!content) return;
    if(document.getElementById('aeChartCard')) return;
    var d; try{ d=E.db(); }catch(e){ return; }
    var S=discover(d); if(!S) return;

    var ACC =cvar(['--blue','--accent','--primary','--brand','--a-money','--a-projects','--teal'],'#4a7fa5');
    var ACC2=cvar(['--blue-2','--brand-2','--a-books','--a-field'],ACC);
    var HI  =cvar(['--amber','--gold','--amber-3','--brand-glow'],'#c9871f');
    var TRK =cvar(['--sunk','--line-2','--line'],'rgba(128,128,128,.18)');
    var INK =cvar(['--ink'],'#1b1f22'), MUT=cvar(['--mut','--ink-2'],'#7b8288');

    function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
    function fmt(n){ n=Number(n)||0;
      if(!S.money) return String(Math.round(n));
      if(n>=1000000) return '$'+(n/1000000).toFixed(2).replace(/\.?0+$/,'')+'M';
      if(n>=1000) return '$'+Math.round(n/1000)+'k';
      return '$'+Math.round(n); }
    function words(s){ s=String(s==null?'':s); return s.length>26?s.slice(0,25)+'…':s; }
    function title(s){ return String(s).replace(/[._-]/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase();}); }

    /* --- bars: top rows by value --- */
    var rows=S.rows.slice().map(function(r){ return {l:S.label?r[S.label]:'—', v:Number(pick(r,S.field))||0}; })
                   .filter(function(r){ return r.v>0; })
                   .sort(function(a,b){ return b.v-a.v; }).slice(0,6);
    var max=Math.max.apply(null,rows.map(function(r){return r.v;}).concat([1]));
    var W=760,labW=190,valW=76,barW=W-labW-valW,rowH=32,H=rows.length*rowH+6,g1='';
    rows.forEach(function(r,i){
      var y=i*rowH+4, w=Math.max(2,(r.v/max)*barW);
      g1+='<text x="0" y="'+(y+15)+'" font-size="11.5" fill="'+MUT+'" font-family="system-ui,sans-serif">'+esc(words(r.l))+'</text>'
        +'<rect x="'+labW+'" y="'+(y+4)+'" width="'+barW+'" height="14" rx="4" fill="'+TRK+'"/>'
        +'<rect x="'+labW+'" y="'+(y+4)+'" width="'+w+'" height="14" rx="4" fill="'+(i===0?HI:ACC)+'"/>'
        +'<text x="'+W+'" y="'+(y+15)+'" text-anchor="end" font-size="11" font-weight="600" fill="'+INK+'" font-family="ui-monospace,Menlo,monospace">'+fmt(r.v)+'</text>';
    });

    /* --- donut by category --- */
    var g2='',leg='';
    if(S.cat){
      var by={},tot=0;
      S.rows.forEach(function(r){ var c=r[S.cat]; if(typeof c!=='string')return;
        var v=Number(pick(r,S.field))||0; if(!(v>0))return; by[c]=(by[c]||0)+v; tot+=v; });
      var keys=Object.keys(by).sort(function(a,b){return by[b]-by[a];});
      var PAL=[ACC,HI,ACC2,'#6a8f7a','#8a7fa8','#a8865f'];
      var R=52,CX=68,CY=68,C=2*Math.PI*R,off=0;
      keys.forEach(function(k,i){ var fr=tot?by[k]/tot:0; if(fr<=0)return;
        g2+='<circle cx="'+CX+'" cy="'+CY+'" r="'+R+'" fill="none" stroke="'+PAL[i%PAL.length]+'" stroke-width="19" stroke-dasharray="'+(fr*C)+' '+C+'" stroke-dashoffset="'+(-off*C)+'" transform="rotate(-90 '+CX+' '+CY+')"/>';
        leg+='<span style="display:inline-flex;align-items:center;gap:6px;margin:0 12px 7px 0;font-size:12px;color:'+MUT+'"><i style="width:10px;height:10px;border-radius:3px;background:'+PAL[i%PAL.length]+';display:inline-block"></i>'+esc(k)+' · '+fmt(by[k])+'</span>';
        off+=fr; });
      g2+='<text x="'+CX+'" y="'+(CY-1)+'" text-anchor="middle" font-size="14" font-weight="700" fill="'+INK+'" font-family="system-ui,sans-serif">'+fmt(tot)+'</text>'
        +'<text x="'+CX+'" y="'+(CY+13)+'" text-anchor="middle" font-size="8.5" fill="'+MUT+'" font-family="ui-monospace,Menlo,monospace">TOTAL</text>';
    }

    /* --- KPI bullets vs target bands (only if this engine publishes them) --- */
    var g3='';
    try{
      if(typeof E.kpis==='function'){
        var ks=E.kpis().filter(function(k){ return k.bench&&k.bench.target&&typeof k.value==='number'; }).slice(0,3);
        ks.forEach(function(k,i){
          var lo=k.bench.target[0],hi=k.bench.target[1],mx=Math.max(hi*1.35,k.value*1.1),bw=400,x0=132,y0=i*34+12;
          var vx=Math.min(bw,(k.value/mx)*bw),lx=(lo/mx)*bw,hx=(hi/mx)*bw,inb=k.value>=lo&&k.value<=hi;
          var val=(k.fmt==='pct')?Math.round(k.value)+'%':(k.fmt==='x')?k.value.toFixed(2)+'x':Math.round(k.value);
          g3+='<text x="0" y="'+(y0+11)+'" font-size="11.5" fill="'+MUT+'" font-family="system-ui,sans-serif">'+esc(k.label||k.k)+'</text>'
            +'<rect x="'+x0+'" y="'+y0+'" width="'+bw+'" height="13" rx="4" fill="'+TRK+'"/>'
            +'<rect x="'+(x0+lx)+'" y="'+y0+'" width="'+Math.max(2,hx-lx)+'" height="13" fill="none" stroke="'+ACC+'" stroke-dasharray="3 3"/>'
            +'<rect x="'+x0+'" y="'+(y0+3)+'" width="'+vx+'" height="7" rx="3" fill="'+(inb?ACC:HI)+'"/>'
            +'<text x="'+(x0+bw+8)+'" y="'+(y0+11)+'" font-size="11" font-weight="700" fill="'+(inb?ACC:HI)+'" font-family="ui-monospace,Menlo,monospace">'+val+'</text>';
        });
      }
    }catch(e){}

    var card=document.createElement('div');
    card.className='card'; card.id='aeChartCard';
    var heading=(S.money?'The money, drawn':'The numbers, drawn');
    card.innerHTML='<h2 style="margin:0 0 4px">'+heading+'</h2>'+
      '<div class="card-sub" style="margin-bottom:14px">Same figures as the tables below, as pictures — computed live from this system\'s own data, nothing hand-entered.</div>'+
      '<div style="border:1px solid '+TRK+';border-radius:12px;padding:14px 16px 10px;margin-bottom:14px">'+
        '<div style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:'+MUT+';margin-bottom:8px">Top '+esc(title(S.coll))+' by '+esc(title(S.field.split('.').pop()))+'</div>'+
        '<svg viewBox="0 0 '+W+' '+H+'" style="width:100%;height:auto;display:block">'+g1+'</svg></div>'+
      (g2?'<div style="display:grid;grid-template-columns:1fr 1.15fr;gap:14px">'+
        '<div style="border:1px solid '+TRK+';border-radius:12px;padding:14px 16px">'+
          '<div style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:'+MUT+';margin-bottom:8px">By '+esc(title(S.cat))+'</div>'+
          '<div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap"><svg viewBox="0 0 136 136" style="max-width:136px;width:100%;height:auto">'+g2+'</svg>'+
          '<div style="flex:1;min-width:120px">'+leg+'</div></div></div>'+
        (g3?'<div style="border:1px solid '+TRK+';border-radius:12px;padding:14px 16px"><div style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:'+MUT+';margin-bottom:8px">Health vs. target band</div><svg viewBox="0 0 560 '+(Math.max(1,Math.min(3,3))*34+14)+'" style="width:100%;height:auto">'+g3+'</svg></div>':'<div></div>')+
      '</div>':(g3?'<div style="border:1px solid '+TRK+';border-radius:12px;padding:14px 16px"><div style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:'+MUT+';margin-bottom:8px">Health vs. target band</div><svg viewBox="0 0 560 116" style="width:100%;height:auto">'+g3+'</svg></div>':''));

    var first=content.querySelector('.card');
    if(first&&first.nextSibling) content.insertBefore(card,first.nextSibling);
    else content.appendChild(card);
  }
  function boot(){ build(); setTimeout(build,300); setTimeout(build,1200); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();


/* ------------------------------------------------------------------ pricebook
   This showroom no longer trusts its own copy of the price book.

   Every demo used to hard-code its tier names and prices independent of the
   store, and they drifted: on Aug 8 2026 nine of twelve showrooms were quoting
   money that contradicted the store on the same afternoon. Re-syncing twelve
   files by hand every time a price moves isn't a fix, it's a chore that will
   eventually get skipped.

   So the demo now READS the store at runtime. catalog.js on aexperiences.com is
   the one price book; this pulls it, finds this product, and corrects the tier
   name, monthly, and build fee in place — on the same objects the UI renders
   from, so a correction that lands before first paint is simply what shows.

   Three rules, in order:
     1. Never break the demo. Offline, CORS, a catalog rewrite that breaks the
        parse — any failure and it does nothing at all. The baked numbers stay,
        and they are correct as of the Aug 8 2026 sync.
     2. Never invent a number. It only ever copies what the store publishes.
     3. Say something when it corrects. A silent correction hides the drift that
        caused it; the console note is how the next person finds the stale file.

   Read the result any time via: await window.AE_PRICEBOOK                    */

(function (global) {
  "use strict";

  var ID      = "musical";                        /* this product, in the store catalog */
  var STORE   = "https://www.aexperiences.com";
  var CATALOG = STORE + "/catalog.js";
  var API     = STORE + "/api/pricing";   /* preferred the day the store ships it */

  /* Pull ['Name', mo, build] rows out of the catalog's tiers:[ ... ] block for
     one product. Bracket-balanced and string-aware rather than regex-greedy, so
     a description containing a bracket can't run the match past the block end. */
  function parseCatalog(src, id) {
    var at = src.indexOf("id:'" + id + "'");
    if (at < 0) at = src.indexOf('id:"' + id + '"');
    if (at < 0) return null;

    var key = src.indexOf("tiers:", at); if (key < 0) return null;
    var open = src.indexOf("[", key);    if (open < 0) return null;

    var depth = 0, end = -1, inStr = null, i, c;
    for (i = open; i < src.length; i++) {
      c = src[i];
      if (inStr) { if (c === "\\") i++; else if (c === inStr) inStr = null; continue; }
      if (c === "'" || c === '"') { inStr = c; continue; }
      if (c === "[") depth++;
      else if (c === "]") { depth--; if (!depth) { end = i; break; } }
    }
    if (end < 0) return null;

    var block = src.slice(open + 1, end), rows = [], m;
    var re = /\[\s*(['"])((?:\\.|(?!\1).)*)\1\s*,\s*(\d+)\s*,\s*(\d+)/g;
    while ((m = re.exec(block))) {
      rows.push({ name: m[2].replace(/\\(.)/g, "$1"), mo: +m[3], build: +m[4] });
    }
    return rows.length ? rows : null;
  }

  /* Find the app's live TIERS object. Each showroom exports under its own name,
     so match on shape — an object whose entries carry mo + build — rather than on
     a name that could be renamed out from under this. */
  function findTiers() {
    var seen = Object.keys(global), i, o, k, first;
    for (i = 0; i < seen.length; i++) {
      try { o = global[seen[i]]; } catch (e) { continue; }
      if (!o || typeof o !== "object" || !o.TIERS) continue;
      first = null;
      for (k in o.TIERS) { first = o.TIERS[k]; break; }
      if (first && typeof first.mo === "number" && typeof first.build === "number") return o.TIERS;
    }
    return null;
  }

  /* Put the app's tiers in store order. Most showrooms carry an explicit rank and
     that is authoritative. A few (Moments) don't, and there we fall back to the
     declaration order of the object — but only when the counts match exactly, so
     a tier added on one side can never silently shift prices onto the wrong one. */
  function ordered(tiers, expected) {
    var k, list = [], ranked = true;
    for (k in tiers) {
      if (!tiers[k] || typeof tiers[k].mo !== "number") continue;
      if (typeof tiers[k].rank !== "number") ranked = false;
      list.push(tiers[k]);
    }
    if (ranked) return list.sort(function (a, b) { return a.rank - b.rank; });
    return list.length === expected ? list : null;
  }

  /* Never match on the object key. The internal keys (lite/standard/…) are ours
     and can be renamed; the tier's position in the store's list is what a price
     actually belongs to. */
  function reconcile(list, book) {
    var fixes = [];
    book.forEach(function (row, i) {
      var t = list[i];
      if (!t) return;
      if (t.name === row.name && t.mo === row.mo && t.build === row.build) return;
      fixes.push("tier " + (i + 1) + ": " + t.name + " $" + t.mo + "/" + t.build +
                 "  ->  " + row.name + " $" + row.mo + "/" + row.build);
      t.name = row.name; t.mo = row.mo; t.build = row.build;
    });
    return fixes;
  }

  global.AE_PRICEBOOK = (async function () {
    var book = null, r, j, rows, res, tiers = null, tries;

    try {
      r = await fetch(API + "?product=" + encodeURIComponent(ID), { cache: "no-store" });
      if (r.ok) {
        j = await r.json();
        rows = j.tiers || j.data || j;
        if (Array.isArray(rows) && rows.length) {
          book = rows.map(function (t) {
            return Array.isArray(t) ? { name: t[0], mo: +t[1], build: +t[2] }
                                    : { name: t.name, mo: +t.mo, build: +t.build };
          });
        }
      }
    } catch (e) { /* endpoint absent — expected today, not an error */ }

    if (!book) {
      try {
        res = await fetch(CATALOG, { cache: "no-store" });
        if (res.ok) book = parseCatalog(await res.text(), ID);
      } catch (e) { return { ok: false, why: "store unreachable", id: ID }; }
    }
    if (!book) return { ok: false, why: "product not found in catalog", id: ID };

    /* The app may still be booting. Wait briefly, then give up quietly — a demo
       rendering its own correct baked numbers is a fine outcome. */
    for (tries = 0; tries < 60 && !(tiers = findTiers()); tries++) {
      await new Promise(function (done) { setTimeout(done, 50); });
    }
    if (!tiers) return { ok: false, why: "app tiers not exposed", id: ID };

    var list = ordered(tiers, book.length);
    if (!list) return { ok: false, why: "tier count disagrees with the catalog", id: ID };

    var fixes = reconcile(list, book);
    if (fixes.length) {
      console.info("[pricebook] " + ID + " — corrected " + fixes.length +
        " tier(s) against the store catalog. The copy baked into this repo has " +
        "drifted and should be re-synced:\n  " + fixes.join("\n  "));
    }
    return { ok: true, id: ID, tiers: book.length, corrected: fixes.length, fixes: fixes };
  })();

})(window);
