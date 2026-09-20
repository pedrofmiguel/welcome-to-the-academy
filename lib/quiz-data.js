/* ============================================================
   THE VESSEL — aura reading data  (SINGLE SOURCE OF TRUTH)
   ------------------------------------------------------------
   Stage 1 : ten universal questions. Every answer quietly adds
             points to one or more of the thirteen classes.
             The top three become the vessels on offer.

   Stage 2 : four questions that read the FLAVOUR of the spirit
             rather than the class — storm, shadow, fey, forge.
             Each subclass carries motif tags, so the genie can
             name the best-fitting subclass inside each of the
             three classes. The result is three combos that are
             siblings: Tempest Cleric / Storm Sorcerer / Hell
             Knight are all one stormy spirit in three vessels.

   Weights: 3 = strong signal, 2 = moderate, 1 = faint.
   Stage 1 is balanced so each class can reach 21-24 points.
   {name} in any prompt is replaced with the player's name.
   ------------------------------------------------------------
   Edited here and here only. `npm run sync:artifact` regenerates
   ../aura-data.js, the plain-script copy the published Artifact
   loads. Never edit that file by hand — it is overwritten.
   ============================================================ */

export const CLASSES = {
  art: {
    name: "Artificer",
    blurb: "Artificers are powerful magic wielders who are experts at creating and forging magic items and potions to assist their allies or bring doom to their foes.",
    reading: "Your aura smells of oil and hot metal. You did not inherit your power, {name}. You built it — and you could build it again."
  },
  bar: {
    name: "Barbarian",
    blurb: "Barbarians are warriors whose strength comes from their rage — able to use their anger as a weapon. The subclass is the path they walk, which teaches them a particular way to use it.",
    reading: "There is a furnace in you, {name}, with the door left open. Everyone who has ever met you knows it. Some of them left."
  },
  brd: {
    name: "Bard",
    blurb: "A poet, a singer, a storyteller. Their magic comes from the emotion in the stories they tell and the songs they sing. Bards follow different colleges to hone that craft.",
    reading: "Your aura is loud even when you are not. You have never once entered a room without changing its temperature, {name}."
  },
  clr: {
    name: "Cleric",
    blurb: "Ideas are immortal things that topple empires and bring justice to those who threaten others. All an idea needs is a champion — clerics are those champions.",
    reading: "Something is standing behind you, {name}. It has been there a very long while, and it is not going anywhere."
  },
  drd: {
    name: "Druid",
    blurb: "Druids are protectors of nature — the embodiment of its wrath and its beauty. Their circle determines which part of the natural world answers when they call.",
    reading: "Your aura has weather in it, {name}. Roots, too. You belong to something a great deal older than this Academy."
  },
  ftr: {
    name: "Fighter",
    blurb: "Swords, spears, shields, bows. Warriors who hone combat into a deadly skill that rivals none. Some enhance it with magic; others crush magic under pure muscle or acrobatic skill.",
    reading: "No mystery in you at all, {name}, and that is the mystery. You simply decided to be good at this. Then you were."
  },
  mnk: {
    name: "Monk",
    blurb: "Whether it is fist, spirit, ki, or a weapon that is nothing but an extension of your will — monks deliver a storm of powerful melee attacks.",
    reading: "Yours is the quietest aura I have read in a century, {name}. It is also the densest. You have been compressing yourself for years."
  },
  pal: {
    name: "Paladin",
    blurb: "Paladins hold up ideas the way clerics do, but they serve tenets — of joy, of light, of conquest. The Oath is the shape of those ideas.",
    reading: "You swore something, {name}. I can see the seam where you bound yourself shut. It has not slipped once."
  },
  rgr: {
    name: "Ranger",
    blurb: "Rangers wander and live within the wild, and their skill at surviving harsh places is bested by none. Most take on a role — usually hunting a particular kind of thing.",
    reading: "Half of your aura is somewhere else, {name}. Out past the treeline, still walking. It will come back when it is finished."
  },
  rog: {
    name: "Rogue",
    blurb: "Rogues are talented individuals who hone the skills of the unethical or the criminal, becoming experts in a field nobody puts on a signboard.",
    reading: "I had to look twice, {name}. Your aura did not wish to be read, and it very nearly managed it."
  },
  sor: {
    name: "Sorcerer",
    blurb: "Born with magical energy running through their veins — what people picture when they think of a spellslinger. Their power is tied to their emotions and their blood.",
    reading: "You did not study for this and you did not ask for it, {name}. It was already in you when you arrived. It is still deciding what it wants."
  },
  wlk: {
    name: "Warlock",
    blurb: "Mortals who signed a magical contract with an immortal entity — power granted in exchange for service. Feared, and not always unfairly.",
    reading: "There are two signatures on your aura, {name}. Only one of them is yours. I would rather not look at the other for very long."
  },
  wiz: {
    name: "Wizard",
    blurb: "The apex of the arcane, built on a lifetime of education. With their knowledge of magic they know exactly how to shape it — most walking a single school toward mastery.",
    reading: "Your aura is annotated, {name}. In the margins. In your own hand. You have been taking notes on yourself since you could hold a pen."
  }
};

/* ---------- STAGE 1 : ten questions, thirteen possible vessels ---------- */

export const QUESTIONS = [
  {
    id: "wheel",
    title: "The Broken Wheel",
    prompt: "A caravan has stopped on the mountain road. One wheel is shattered, the driver is weeping, and the light is going.",
    ask: "What do you do?",
    answers: [
      { text: "Put your shoulder under the axle and lift.", score: { bar: 3, ftr: 2, mnk: 1 } },
      { text: "Kneel and read the break. Wheels don't shatter on a road this smooth.", score: { wiz: 3, rog: 2, art: 1 } },
      { text: "The driver is shaking. Steady them first — the wheel will keep.", score: { clr: 3, brd: 2, pal: 1 } },
      { text: "You can have it rebuilt better than it was by moonrise.", score: { art: 3, wiz: 1, ftr: 1 } },
      { text: "Walk ahead up the road. The light is going, and something chose this hour.", score: { rgr: 3, rog: 1, drd: 1 } }
    ]
  },
  {
    id: "different",
    title: "The First Time",
    prompt: "Think back, {name}, to the first time you understood you were not the same as the others around you.",
    ask: "What happened?",
    answers: [
      { text: "You outlasted them. Everyone else had stopped, and you were still going.", score: { mnk: 3, ftr: 2, bar: 1 } },
      { text: "Something moved in you that you had not put there, and it frightened you.", score: { sor: 3, wlk: 2, bar: 2 } },
      { text: "You understood a thing that nobody had explained to you.", score: { wiz: 3, art: 2, rog: 1 } },
      { text: "You were somewhere alone, and the world answered you.", score: { drd: 3, rgr: 2, clr: 1 } },
      { text: "A room full of people turned to look at you, and you liked it.", score: { brd: 3, pal: 1, sor: 1 } }
    ]
  },
  {
    id: "offer",
    title: "The Offer",
    prompt: "A voice offers you the thing you want most. All of it, exactly as you imagined. The price is not mentioned.",
    ask: "What do you say?",
    answers: [
      { text: "Refuse. Anything that hides its price is a trap.", score: { pal: 3, mnk: 2, clr: 1 } },
      { text: "Accept — and start working out how to break the terms later.", score: { wlk: 3, rog: 2, brd: 1 } },
      { text: "Ask it to put the terms in writing, then read every line.", score: { wiz: 3, art: 2, rog: 1 } },
      { text: "Ask who it is and what it gets. Nothing offers without wanting.", score: { clr: 2, rgr: 2, wlk: 2, drd: 1 } },
      { text: "You already said yes. You said yes before it finished speaking.", score: { sor: 3, bar: 3, wlk: 1 } }
    ]
  },
  {
    id: "outnumbered",
    title: "The Open Ground",
    prompt: "You are outnumbered, in the open, and there is no talking your way out of this one.",
    ask: "What is your first move?",
    answers: [
      { text: "Pick the largest one and go straight through them.", score: { bar: 3, ftr: 2, pal: 1 } },
      { text: "Break line of sight. They cannot fight what they cannot find.", score: { rog: 3, rgr: 2, mnk: 1 } },
      { text: "Take the high ground and start reading the shape of it.", score: { ftr: 3, wiz: 1, art: 1, rgr: 1 } },
      { text: "Let go of whatever it is you have been holding back.", score: { sor: 3, wlk: 2, bar: 1 } },
      { text: "Put yourself between them and whoever is behind you.", score: { pal: 3, clr: 2, ftr: 1 } }
    ]
  },
  {
    id: "dead",
    title: "The One Nobody Came For",
    prompt: "You stand over someone who died badly. It is clear that nobody is coming for them.",
    ask: "What do you do?",
    answers: [
      { text: "Bury them properly. The rites matter even with no one left to hear them.", score: { clr: 3, pal: 2, drd: 1 } },
      { text: "Learn what killed them. It is still out there.", score: { rgr: 3, wiz: 1, ftr: 1 } },
      { text: "Death is not a wall. It is a door, and doors open both ways.", score: { wlk: 3, wiz: 2, sor: 1 } },
      { text: "Take what they no longer need and keep moving. Sentiment is weight.", score: { rog: 3, bar: 2, wlk: 1 } },
      { text: "Return them to the ground. Something will grow.", score: { drd: 3, clr: 1, mnk: 1 } }
    ]
  },
  {
    id: "crowd",
    title: "The Square",
    prompt: "A hundred people in a town square — arguing, frightened, and about thirty seconds from becoming something worse.",
    ask: "Where are you, {name}?",
    answers: [
      { text: "Up on the fountain, already talking.", score: { brd: 3, pal: 2, sor: 1 } },
      { text: "Moving through them, listening. You will know who started it.", score: { rog: 3, wiz: 1, rgr: 1 } },
      { text: "Standing still, letting them notice you. They will quiet down.", score: { pal: 3, mnk: 2, clr: 1 } },
      { text: "Leaving. Crowds are weather, and you do not argue with weather.", score: { drd: 3, rgr: 2, mnk: 1 } },
      { text: "Giving them something to do with their hands. Work cools a mob.", score: { art: 3, clr: 2, ftr: 1 } }
    ]
  },
  {
    id: "teacher",
    title: "The Difficult Lesson",
    prompt: "Someone is trying to teach you something genuinely hard.",
    ask: "How does it go?",
    answers: [
      { text: "Badly, until suddenly it doesn't. You need to do it wrong a thousand times first.", score: { mnk: 3, ftr: 2, bar: 1 } },
      { text: "You take notes they did not ask for, and ask questions they cannot answer.", score: { wiz: 3, art: 2 } },
      { text: "You would rather watch them do it once and steal the shape of it.", score: { rog: 3, brd: 2, rgr: 1 } },
      { text: "You do not need teaching for this. It is already in you; it needs room.", score: { sor: 3, bar: 2, wlk: 1 } },
      { text: "You learn it for someone else. Not for yourself.", score: { pal: 3, clr: 2, brd: 1 } }
    ]
  },
  {
    id: "wild",
    title: "A Week Without Roads",
    prompt: "Seven days alone, far past the last road, with nobody expecting you.",
    ask: "How is it?",
    answers: [
      { text: "Restful. The quiet is the entire point.", score: { drd: 3, mnk: 2, rgr: 1 } },
      { text: "Productive. You get far more done with nobody talking at you.", score: { art: 3, wiz: 2, rog: 1 } },
      { text: "You are not alone out there. You are never quite alone.", score: { wlk: 3, sor: 2, drd: 1 } },
      { text: "Fine for a week. By the eighth day you would want a tavern and an audience.", score: { brd: 3, bar: 2, rog: 1 } },
      { text: "You would train. There is always something that could be sharper.", score: { ftr: 3, mnk: 2, bar: 1 } }
    ]
  },
  {
    id: "failure",
    title: "Your Own Rule",
    prompt: "You have done the one thing you swore to yourself you would never do.",
    ask: "What comes next?",
    answers: [
      { text: "You punish yourself harder than anyone else would have.", score: { pal: 3, mnk: 2, clr: 1 } },
      { text: "You revise the rule. It was a bad rule if it broke.", score: { rog: 2, wlk: 2, sor: 2, brd: 1 } },
      { text: "You tell someone. Carrying it alone only makes it heavier.", score: { brd: 3, clr: 2, pal: 1 } },
      { text: "You get back to work. Dwelling is a luxury.", score: { ftr: 3, art: 2, bar: 1 } },
      { text: "You go somewhere with no people in it until it settles.", score: { rgr: 3, drd: 2, mnk: 1 } }
    ]
  },
  {
    id: "legacy",
    title: "A Hundred Years On",
    prompt: "Everyone who ever met you is dead, {name}. The world has moved on without noticing.",
    ask: "What is left of you?",
    answers: [
      { text: "A thing still standing. A bridge, a blade, a machine still turning.", score: { art: 3, ftr: 2, wiz: 1 } },
      { text: "A story. Badly remembered, wildly exaggerated, still told.", score: { brd: 3, bar: 2, rog: 1 } },
      { text: "A place better than it was. A grove, a road, a quiet border.", score: { drd: 3, clr: 2, pal: 1 } },
      { text: "Students. People who know what you knew.", score: { wiz: 3, mnk: 2, clr: 1 } },
      { text: "Nothing. You intend to still be here.", score: { wlk: 3, sor: 2, bar: 1 } }
    ]
  }
];

/* Asked only when the reading cannot separate the vessels cleanly. */
export const TIEBREAKER = {
  id: "vessel",
  title: "The Clouded Reading",
  prompt: "Your aura will not settle, {name}. It is arguing with itself, and I have no patience for a draw.",
  ask: "When you reach for power — truly reach — what do you reach for?",
  answers: [
    { text: "My own body. It has never once lied to me.", score: { bar: 2, ftr: 2, mnk: 2 } },
    { text: "A thing I made, or a thing I carry.", score: { art: 2, rog: 2, ftr: 2 } },
    { text: "Something far older than me that agreed to help.", score: { wlk: 2, sor: 2, clr: 2 } },
    { text: "What I know. What I took the time to learn properly.", score: { wiz: 2, art: 2, rog: 2 } },
    { text: "The living world, and my place inside it.", score: { drd: 2, rgr: 2, clr: 2 } },
    { text: "The people who are counting on me.", score: { pal: 2, brd: 2, clr: 2 } }
  ]
};

/* ---------- STAGE 2 : four questions that read the spirit's flavour ---------- */

export const MOTIFS = {
  storm: { name: "Storm-Touched", line: "Pressure, and the smell of rain on hot stone. Your spirit arrives before you do." },
  fire:  { name: "Ember-Blooded", line: "Something in you is burning and has been for a long time. You have stopped trying to put it out." },
  shadow:{ name: "Shadow-Clad",   line: "You are most yourself in the half-second before anyone notices you are there." },
  death: { name: "Death-Marked",  line: "You are not morbid. You are simply unwilling to pretend that endings are not real." },
  wild:  { name: "Green-Hearted", line: "Something grows where you stand. You did not ask it to and you cannot stop it." },
  order: { name: "Iron-Bound",    line: "You keep your word past the point where it costs you. That is rarer than magic." },
  mind:  { name: "Deep-Minded",   line: "You are three moves ahead and quietly exhausted by everyone who is not." },
  craft: { name: "Forge-Handed",  line: "You trust a thing you made over a thing you were given. You are usually right to." },
  light: { name: "Dawn-Bearing",  line: "People stand straighter near you and cannot explain why. You have noticed. You do not mention it." },
  guile: { name: "Silver-Tongued",line: "You have never once been in a room where you did not know where the exits were." },
  war:   { name: "War-Forged",    line: "You do not enjoy it. You are simply very good at it, and that is its own kind of trap." },
  ward:  { name: "Shield-Sworn",  line: "Your first instinct in a crisis is to check who is behind you. Every single time." },
  fey:   { name: "Fey-Struck",    line: "Something looked at you once, a long time ago, and you have been slightly wrong ever since." },
  void:  { name: "Void-Touched",  line: "You have been somewhere that has no name, and part of you is still standing in it." }
};

export const MOTIF_QUESTIONS = [
  {
    id: "room",
    title: "The Room",
    prompt: "Now I know the shape of you, {name}. Let us find the colour. Your power shows itself in a crowded room.",
    ask: "What does the room do?",
    answers: [
      { text: "The pressure drops. Something is coming.", score: { storm: 3, void: 1 } },
      { text: "It gets hotter. Noticeably, uncomfortably hotter.", score: { fire: 3, war: 1 } },
      { text: "The lamps gutter, and the corners get deeper.", score: { shadow: 3, death: 1 } },
      { text: "It goes quiet. Very, very quiet.", score: { death: 2, mind: 2, ward: 1 } },
      { text: "Something green happens. Growth where there was none.", score: { wild: 3, fey: 1 } },
      { text: "It gets brighter, and people stand up straighter.", score: { light: 3, ward: 1 } },
      { text: "Nothing at all. Nobody notices until it is far too late.", score: { guile: 3, mind: 1 } },
      { text: "Sparks, gears, and the smell of hot metal.", score: { craft: 3, order: 1 } }
    ]
  },
  {
    id: "last",
    title: "The Last Thing",
    prompt: "An enemy of yours is finished. It is over, and they had a moment to understand it.",
    ask: "What did they understand?",
    answers: [
      { text: "That I was faster and better. Nothing more complicated than that.", score: { war: 3, order: 1 } },
      { text: "That they had been losing for some time without knowing it.", score: { mind: 3, guile: 2 } },
      { text: "That they should not have touched the person behind me.", score: { ward: 3, war: 1 } },
      { text: "That something was standing where I had been a moment ago.", score: { void: 2, shadow: 2, fey: 1 } },
      { text: "That it was always going to end this way.", score: { death: 3, order: 1 } },
      { text: "That they were on fire.", score: { fire: 3, storm: 1 } },
      { text: "Nothing. They never saw me at all.", score: { shadow: 3, guile: 2 } },
      { text: "That the ground itself had turned against them.", score: { wild: 3, storm: 1 } }
    ]
  },
  {
    id: "tell",
    title: "The Tell",
    prompt: "There is always a detail. The one thing that gives a person away to someone who knows how to look.",
    ask: "What is yours?",
    answers: [
      { text: "Scars, and a weapon that has clearly been used.", score: { war: 3, craft: 1 } },
      { text: "Ink. On the fingers, on the sleeves, in the bag.", score: { mind: 3, craft: 1 } },
      { text: "Something living follows me, and it is not a pet.", score: { wild: 3, fey: 1 } },
      { text: "The weather disagrees with the room I am standing in.", score: { storm: 3, fire: 1 } },
      { text: "A symbol I have never once taken off.", score: { order: 3, light: 2, ward: 1 } },
      { text: "Nothing on me is quite the colour you first thought it was.", score: { guile: 3, fey: 2 } },
      { text: "I smell faintly of the sea, or a cellar, or somewhere deep.", score: { void: 3, death: 1 } },
      { text: "My shadow is not doing what your shadow is doing.", score: { shadow: 3, void: 1 } },
      { text: "Burns, callused hands, pockets full of small useful things.", score: { craft: 3, order: 1 } }
    ]
  },
  {
    id: "sleep",
    title: "The Sleeping Hours",
    prompt: "Last one. You are asleep — properly asleep, for once — and your power is unattended.",
    ask: "Where does it go?",
    answers: [
      { text: "Nowhere. It keeps watch.", score: { ward: 3, order: 2 } },
      { text: "It wanders. I wake up knowing things.", score: { mind: 3, fey: 1 } },
      { text: "Somewhere I would honestly rather not follow it.", score: { void: 3, death: 2 } },
      { text: "It burns low. But it burns.", score: { fire: 3, war: 1 } },
      { text: "Out into the weather.", score: { storm: 3, wild: 1 } },
      { text: "Down into the ground, into roots.", score: { wild: 3, death: 1 } },
      { text: "Into the blade. Or the book. Or the tool.", score: { craft: 3, war: 1 } },
      { text: "Into the dream, and the dream is a better place than this.", score: { fey: 3, light: 1 } },
      { text: "Into a hundred small lies that keep working while I rest.", score: { guile: 3, shadow: 1 } },
      { text: "It does not sleep. It shines all night.", score: { light: 3, order: 1 } }
    ]
  }
];

/* ---------- The vessels themselves ----------
   `short` is the headline form: "TEMPEST CLERIC", "HELL KNIGHT FIGHTER".
   `tags`  is the motif vector matched against the player's spirit.
------------------------------------------------------------------ */

export const SUBCLASSES = {
  art: [
    { id: "armorer", name: "Armorer", short: "Armorer", src: "TC", blurb: "Fuse powerful magic with your armour to create exoskeleton suits.", tags: { craft: 3, ward: 3, order: 1 } },
    { id: "alchemist", name: "Alchemist", short: "Alchemist", src: "TC", blurb: "A master of potion-making — to heal, to assist, and to destroy.", tags: { craft: 3, mind: 2, death: 1 } },
    { id: "artillerist", name: "Artillerist", short: "Artillerist", src: "TC", blurb: "Control the battlefield by summoning powerful magic cannons.", tags: { craft: 3, fire: 2, war: 2 } },
    { id: "battlesmith", name: "Battle Smith", short: "Battle Smith", src: "TC", blurb: "Create magical machines that fight for and protect others.", tags: { craft: 3, ward: 2, order: 1 } }
  ],
  bar: [
    { id: "berserker", name: "Path of the Berserker", short: "Berserker", src: "PH", blurb: "Fall into your rage entirely to deliver a tide of powerful blows.", tags: { war: 3, fire: 1 } },
    { id: "totem", name: "Path of the Totem Warrior", short: "Totem Warrior", src: "PH", blurb: "Your rage comes from the animal spirits of the world, who aid you.", tags: { wild: 3, war: 1 } },
    { id: "ancestral", name: "Path of the Ancestral Guardian", short: "Ancestral Guardian", src: "XG", blurb: "Your rage is the combination of all your ancestors.", note: "Revised in 2025 UA as Path of the Spiritual Guardian.", tags: { ward: 3, death: 2, order: 1 } },
    { id: "stormherald", name: "Path of the Storm Herald", short: "Storm Herald", src: "XG", blurb: "Your rage is second only to that of Mother Nature, who joins you.", note: "Revised in the 2025 Subclasses Update UA.", tags: { storm: 3, fire: 1, wild: 1 } },
    { id: "zealot", name: "Path of the Zealot", short: "Zealot", src: "XG", blurb: "The rage acts as a gift from the gods. You are their champion.", tags: { war: 3, light: 2, order: 1, death: 1 } },
    { id: "beast", name: "Path of the Beast", short: "Beast", src: "TC", blurb: "Gifts from the beasts of this world, as you manifest their power.", tags: { wild: 3, war: 2 } },
    { id: "wildsoul", name: "Path of the Wild Soul", short: "Wild Soul", src: "TC", blurb: "Your rage is strong enough to shatter the walls of magic.", tags: { void: 3, wild: 1, storm: 1 } },
    { id: "battlerager", name: "Path of the Battlerager", short: "Battlerager", src: "SC", blurb: "Giving yourself over to your rage, you make your body a weapon.", tags: { war: 3, craft: 2, ward: 1 } },
    { id: "unlight", name: "Path of Unlight", short: "Unlight", src: "UA", blurb: "Unleash your inner light as blazing fury.", tags: { light: 3, fire: 2, shadow: 1 } }
  ],
  brd: [
    { id: "lore", name: "College of Lore", short: "Lore", src: "PH", blurb: "A way to keep the stories of history and civilisations alive.", tags: { mind: 3, guile: 1 } },
    { id: "valor", name: "College of Valour", short: "Valour", src: "PH", blurb: "Those who tell vibrant and powerful war stories.", tags: { war: 3, light: 1, ward: 1 } },
    { id: "creation", name: "College of Creation", short: "Creation", src: "TC", blurb: "Your music and stories shape the very fabric of reality.", tags: { craft: 3, fey: 2, light: 1 } },
    { id: "glamour", name: "College of Glamour", short: "Glamour", src: "XG", blurb: "Blessed by the Feywild — your looks are rivalled by none.", tags: { fey: 3, guile: 2, light: 1 } },
    { id: "swords", name: "College of Swords", short: "Swords", src: "XG", blurb: "Become the most elegant sword fighter in the world.", tags: { war: 3, guile: 2 } },
    { id: "whispers", name: "College of Whispers", short: "Whispers", src: "XG", blurb: "The hypnotic power of bards, turned toward stealth and fear.", tags: { guile: 3, shadow: 2, mind: 1 } },
    { id: "eloquence", name: "College of Eloquence", short: "Eloquence", src: "TC", blurb: "Words have power. Use them to shape any situation.", tags: { mind: 3, guile: 2, order: 1 } },
    { id: "spirits", name: "College of Spirits", short: "Spirits", src: "RL", blurb: "The dead have stories and experiences you can draw upon.", tags: { death: 3, void: 1, mind: 1 } },
    { id: "moon", name: "College of the Moon", short: "Moon", src: "UA", blurb: "Songs sung under moonlight — and what the moonlight does to the singer.", tags: { fey: 3, shadow: 2, wild: 1 } }
  ],
  clr: [
    { id: "knowledge", name: "Knowledge Domain", short: "Knowledge", src: "PH", blurb: "Serve the idea that knowledge is power, and that it must endure.", tags: { mind: 3, order: 1 } },
    { id: "life", name: "Life Domain", short: "Life", src: "PH", blurb: "Serve the idea of life — every living thing is a wonder.", tags: { light: 3, ward: 2 } },
    { id: "light", name: "Light Domain", short: "Light", src: "PH", blurb: "Serve the idea of light; it will burn back the forces of shadow.", tags: { light: 3, fire: 2 } },
    { id: "nature", name: "Nature Domain", short: "Nature", src: "PH", blurb: "Serve the idea of nature; the natural world can never fall.", tags: { wild: 3, ward: 1 } },
    { id: "tempest", name: "Tempest Domain", short: "Tempest", src: "PH", blurb: "Serve the idea of change — storms are powerful and resistant.", tags: { storm: 3, war: 1 } },
    { id: "trickery", name: "Trickery Domain", short: "Trickery", src: "PH", blurb: "Serve the idea of deception; pranks and lies keep the world moving.", tags: { guile: 3, shadow: 1 } },
    { id: "war", name: "War Domain", short: "War", src: "PH", blurb: "Serve the idea of war, whether for honour or for power.", tags: { war: 3, order: 1 } },
    { id: "death", name: "Death Domain", short: "Death", src: "DM", blurb: "Serve the idea of death; everything must eventually end.", tags: { death: 3, shadow: 1 } },
    { id: "twilight", name: "Twilight Domain", short: "Twilight", src: "TC", blurb: "Serve the idea of balance; those who disrupt it must be stopped.", tags: { ward: 3, shadow: 2, order: 1, death: 1 } },
    { id: "order", name: "Order Domain", short: "Order", src: "TC", blurb: "Serve the idea of order and law. You are the voice of justice.", tags: { order: 3, ward: 1, mind: 1 } },
    { id: "forge", name: "Forge Domain", short: "Forge", src: "XG", blurb: "Serve the idea of creation; the forges you touch will never fail.", tags: { craft: 3, fire: 2, order: 1 } },
    { id: "grave", name: "Grave Domain", short: "Grave", src: "XG", blurb: "Serve the idea of life and death; the balance must be maintained.", tags: { death: 3, ward: 2, light: 1 } },
    { id: "peace", name: "Peace Domain", short: "Peace", src: "TC", blurb: "Serve the idea of peace; violence is almost never the answer.", tags: { ward: 3, light: 2, order: 1 } },
    { id: "arcane", name: "Arcane Domain", short: "Arcane", src: "SC", blurb: "Serve the idea of magic; magic is both a power and a wonder.", tags: { mind: 3, void: 1, craft: 1 } },
    { id: "pestilence", name: "Pestilence Domain", short: "Pestilence", src: "UA", blurb: "Serve through disease, poison and decay — the quiet, patient ending.", tags: { death: 3, wild: 1, void: 1 } }
  ],
  drd: [
    { id: "land", name: "Circle of the Land", short: "Land", src: "PH", blurb: "Grown within a certain biome, your power comes from there.", tags: { wild: 3, order: 1, mind: 1 } },
    { id: "moon", name: "Circle of the Moon", short: "Moon", src: "PH", blurb: "Like a werewolf, your power is based on changing forms.", tags: { wild: 3, war: 2 } },
    { id: "dreams", name: "Circle of Dreams", short: "Dreams", src: "XG", blurb: "The Feywild's nature has blessed you with the power to heal.", tags: { fey: 3, light: 2, ward: 1 } },
    { id: "shepherd", name: "Circle of the Shepherd", short: "Shepherd", src: "XG", blurb: "Like a shepherd, you protect the animals of the world.", tags: { wild: 3, ward: 3 } },
    { id: "spores", name: "Circle of Spores", short: "Spores", src: "TC", blurb: "Mycelium has many uses and abilities, including raising the dead.", tags: { death: 3, wild: 2, void: 1 } },
    { id: "stars", name: "Circle of Stars", short: "Stars", src: "TC", blurb: "The answer and the guidance can always be found in the stars.", tags: { mind: 3, light: 2, void: 1 } },
    { id: "wildfire", name: "Circle of Wildfire", short: "Wildfire", src: "TC", blurb: "Wildfires bring about change; ecosystems always revive.", tags: { fire: 3, wild: 2 } },
    { id: "titan", name: "Circle of the Titan", short: "Titan", src: "UA", blurb: "Grow to massive proportions for straightforward physical destruction.", tags: { war: 3, wild: 2, storm: 1 } }
  ],
  ftr: [
    { id: "champion", name: "Champion", short: "Champion", src: "PH", blurb: "Hone your martial ability into an incredibly deadly skill, with constant crits.", tags: { war: 3, order: 1 } },
    { id: "battlemaster", name: "Battle Master", short: "Battle Master", src: "PH", blurb: "Use the art of war and tactics to gain advantage and command the field.", tags: { mind: 3, war: 2, order: 1 } },
    { id: "eldritch", name: "Eldritch Knight", short: "Eldritch Knight", src: "PH", blurb: "Learn wizard-like spells to gain the upper hand in any fight.", tags: { war: 3, mind: 2, ward: 1 } },
    { id: "arcanearcher", name: "Arcane Archer", short: "Arcane Archer", src: "XG", blurb: "Mix magic with your arrows to rain literal fire down upon your foes.", tags: { fey: 2, war: 2, fire: 1, mind: 1 } },
    { id: "cavalier", name: "Cavalier", short: "Cavalier", src: "XG", blurb: "You will never break; your skill, mounted or not, cannot be beaten.", note: "Revised in the 2025 Subclasses Update UA.", tags: { ward: 3, order: 2, war: 2 } },
    { id: "samurai", name: "Samurai", short: "Samurai", src: "XG", blurb: "Your fighting spirit lets you rain down a hurricane of deadly blows.", tags: { war: 3, order: 2 } },
    { id: "psi", name: "Psi Warrior", short: "Psi Warrior", src: "TC", blurb: "Blessed with psychic energy, your mind is sharpened like your weapon.", tags: { mind: 3, void: 1, ward: 1 } },
    { id: "runeknight", name: "Rune Knight", short: "Rune Knight", src: "TC", blurb: "Learn the ancient power of giants and their powerful magic runes.", tags: { craft: 3, order: 2, war: 2 } },
    { id: "echoknight", name: "Echo Knight", short: "Echo Knight", src: "WM", blurb: "Using magical energy, create an echo of yourself to fight alongside you.", tags: { void: 3, shadow: 2, war: 1 } },
    { id: "purpledragon", name: "Purple Dragon Knight", short: "Purple Dragon Knight", src: "SC", blurb: "A warrior who braves any battle through inspiration.", tags: { ward: 3, light: 2, order: 2 } },
    { id: "hellknight", name: "Hell Knight", short: "Hell Knight", src: "UA", blurb: "Wield hellfire weapons and inflict wounds that refuse to close.", tags: { fire: 3, war: 2, death: 1 } }
  ],
  mnk: [
    { id: "openhand", name: "Way of the Open Hand", short: "Open Hand", src: "PH", blurb: "Use your fists and palms to annihilate your foe.", tags: { order: 3, war: 2 } },
    { id: "shadow", name: "Way of Shadow", short: "Shadow", src: "PH", blurb: "Usually called ninjas. Their fists strike from the shadow.", tags: { shadow: 3, guile: 2 } },
    { id: "fourelements", name: "Way of the Four Elements", short: "Four Elements", src: "PH", blurb: "Control earth, water, fire and wind in your own way.", tags: { storm: 2, fire: 2, wild: 2, order: 1 } },
    { id: "mercy", name: "Way of Mercy", short: "Mercy", src: "TC", blurb: "Your ki and spirit are meant to heal wounds, not create them.", tags: { light: 3, ward: 2, death: 1 } },
    { id: "astralself", name: "Way of the Astral Self", short: "Astral Self", src: "TC", blurb: "Your spirit becomes an entity around you, to help you.", tags: { void: 3, mind: 2, order: 1 } },
    { id: "intoxication", name: "Way of the Drunken Master", short: "Drunken Master", src: "XG", blurb: "Confuse your foes with unpredictable attacks.", note: "Revised in 2025 UA as Warrior of Intoxication.", tags: { guile: 3, wild: 1, war: 1 } },
    { id: "kensei", name: "Way of the Kensei", short: "Kensei", src: "XG", blurb: "Your weapons become an extension of yourself — a form of art.", tags: { order: 3, war: 2, craft: 1 } },
    { id: "sunsoul", name: "Way of the Sun Soul", short: "Sun Soul", src: "XG", blurb: "Your soul and will are so powerful that they can ignite.", tags: { light: 3, fire: 3 } },
    { id: "longdeath", name: "Way of the Long Death", short: "Long Death", src: "SC", blurb: "Your soul and fists become the tools of death.", tags: { death: 3, shadow: 2 } },
    { id: "ascendant", name: "Way of the Ascendant Dragon", short: "Ascendant Dragon", src: "FD", blurb: "Following the way of dragons, your spirit manifests their power.", tags: { fire: 2, storm: 2, war: 2, void: 1 } }
  ],
  pal: [
    { id: "devotion", name: "Oath of Devotion", short: "Devotion", src: "PH", blurb: "Light, law, honesty — the pure holy warrior.", tags: { light: 3, order: 3, ward: 2 } },
    { id: "ancients", name: "Oath of the Ancients", short: "Ancients", src: "PH", blurb: "Joy and love; the ancients blessed this warrior with nature.", tags: { fey: 3, wild: 2, light: 2 } },
    { id: "vengeance", name: "Oath of Vengeance", short: "Vengeance", src: "PH", blurb: "Anger and vengeance. Something bad pushed this warrior to seek it.", tags: { war: 3, fire: 1, shadow: 1 } },
    { id: "oathbreaker", name: "Oathbreaker", short: "Oathbreaker", src: "DM", blurb: "They broke an oath long ago, and are cursed for it.", tags: { death: 3, shadow: 2, war: 2 } },
    { id: "conquest", name: "Oath of Conquest", short: "Conquest", src: "XG", blurb: "Destruction and victory. Nothing will stop this warrior.", tags: { war: 3, fire: 1, order: 1 } },
    { id: "redemption", name: "Oath of Redemption", short: "Redemption", src: "XG", blurb: "A warrior who uses words instead of the sword.", tags: { ward: 3, light: 2, mind: 1 } },
    { id: "glory", name: "Oath of Glory", short: "Glory", src: "TC", blurb: "A warrior destined for glory — fight for your destiny.", tags: { light: 3, war: 2 } },
    { id: "watchers", name: "Oath of the Watchers", short: "Watchers", src: "TC", blurb: "A warrior sworn to fight anything supernatural.", tags: { void: 3, ward: 2, order: 2 } },
    { id: "crown", name: "Oath of the Crown", short: "Crown", src: "SC", blurb: "A warrior who serves a crown or a kingdom.", tags: { order: 3, ward: 3 } },
    { id: "genies", name: "Oath of the Noble Genies", short: "Noble Genies", src: "UA", blurb: "A bargain struck with something vast, proud and very old.", tags: { fey: 2, order: 2, storm: 1, fire: 1 } }
  ],
  rgr: [
    { id: "hunter", name: "Hunter", short: "Hunter", src: "PH", blurb: "A warrior who hones different parts of their fighting style to hunt.", tags: { war: 3, wild: 2 } },
    { id: "beastmaster", name: "Beast Master", short: "Beast Master", src: "PH", blurb: "A warrior who has gained the assistance of a spiritual beast.", tags: { wild: 3, ward: 2 } },
    { id: "feywanderer", name: "Fey Wanderer", short: "Fey Wanderer", src: "TC", blurb: "With the power of the fey on their side, these rangers charm their foes.", tags: { fey: 3, guile: 2, wild: 1 } },
    { id: "swarmkeeper", name: "Swarmkeeper", short: "Swarmkeeper", src: "TC", blurb: "Insects, pixies, or a similar swarm — these rangers take care of them.", tags: { wild: 3, fey: 2, void: 1 } },
    { id: "gloomstalker", name: "Gloom Stalker", short: "Gloom Stalker", src: "XG", blurb: "These hunters wander in shadow to defeat creatures of the night.", tags: { shadow: 3, war: 1, guile: 1 } },
    { id: "horizonwalker", name: "Horizon Walker", short: "Horizon Walker", src: "XG", blurb: "These hunters seek out creatures from other worlds to end them.", tags: { void: 3, mind: 2 } },
    { id: "monsterslayer", name: "Monster Slayer", short: "Monster Slayer", src: "XG", blurb: "These warriors hunt down and slay powerful monsters.", tags: { war: 3, mind: 2, ward: 1 } },
    { id: "drakewarden", name: "Drakewarden", short: "Drakewarden", src: "FD", blurb: "A warrior aided by a powerful drake that follows them.", tags: { fire: 2, wild: 2, war: 1, ward: 1 } },
    { id: "winterwalker", name: "Winter Walker", short: "Winter Walker", src: "UA", blurb: "A hunter of the deep cold, and of whatever survives out in it.", tags: { storm: 3, shadow: 1, death: 1, wild: 1 } }
  ],
  rog: [
    { id: "thief", name: "Thief", short: "Thief", src: "PH", blurb: "Experts at breaking into things and taking what is inside.", tags: { guile: 3, craft: 1 } },
    { id: "assassin", name: "Assassin", short: "Assassin", src: "PH", blurb: "Masters at killing while unseen.", tags: { death: 3, shadow: 2, guile: 1 } },
    { id: "arcanetrickster", name: "Arcane Trickster", short: "Arcane Trickster", src: "PH", blurb: "Tricksters who mix magic into their skills, enhancing them.", tags: { guile: 3, mind: 2 } },
    { id: "inquisitive", name: "Inquisitive", short: "Inquisitive", src: "XG", blurb: "Like a detective — they watch their targets and use their patterns.", tags: { mind: 3, guile: 1, order: 1 } },
    { id: "mastermind", name: "Mastermind", short: "Mastermind", src: "XG", blurb: "Deadly smart rogues who use their intelligence to fight.", tags: { mind: 3, guile: 2, order: 1 } },
    { id: "scout", name: "Scout", short: "Scout", src: "XG", blurb: "Ambushing and stealthing with speed; always one step ahead.", tags: { wild: 2, guile: 2, shadow: 1, war: 1 } },
    { id: "swashbuckler", name: "Swashbuckler", short: "Swashbuckler", src: "XG", blurb: "Fast and light on their feet, and impossible to pin down.", tags: { guile: 3, war: 2, light: 1 } },
    { id: "phantom", name: "Phantom", short: "Phantom", src: "TC", blurb: "Shadow magic sits in these rogues' hearts, stealing souls.", tags: { death: 3, shadow: 3 } },
    { id: "soulknife", name: "Soulknife", short: "Soulknife", src: "TC", blurb: "Blessed with a psychic mind, their roguish skills are enhanced.", tags: { mind: 3, void: 2, war: 1 } },
    { id: "scion", name: "Scion of the Three", short: "Scion of the Three", src: "UA", blurb: "Marked by a dark trinity that wants results, and rewards them.", tags: { death: 2, shadow: 2, guile: 2, war: 1 } }
  ],
  sor: [
    { id: "draconic", name: "Draconic Bloodline", short: "Draconic", src: "PH", blurb: "With dragons among your ancestors, you show draconic natures.", tags: { fire: 3, war: 1, order: 1 } },
    { id: "wild", name: "Wild Magic", short: "Wild Magic", src: "PH", blurb: "The chaos of the universe flows through your veins.", tags: { void: 3, storm: 1, guile: 1 } },
    { id: "aberrant", name: "Aberrant Mind", short: "Aberrant Mind", src: "TC", blurb: "Cursed or blessed with a powerful psychic mind; your magic comes from your head.", tags: { void: 3, mind: 3 } },
    { id: "clockwork", name: "Clockwork Soul", short: "Clockwork Soul", src: "TC", blurb: "The balance of the universe flows through your veins.", tags: { order: 3, mind: 2, ward: 1 } },
    { id: "divine", name: "Divine Soul", short: "Divine Soul", src: "XG", blurb: "With blood from something divine, gods watch you with interest.", tags: { light: 3, order: 1, ward: 1 } },
    { id: "shadow", name: "Shadow Magic", short: "Shadow", src: "XG", blurb: "Cursed with shadow magic, your power manipulates the dark.", tags: { shadow: 3, death: 2 } },
    { id: "storm", name: "Storm Sorcery", short: "Storm", src: "XG", blurb: "With the blood of a hurricane, storms are a comfort to you.", tags: { storm: 3, fire: 1 } },
    { id: "demonic", name: "Demonic Sorcery", short: "Demonic", src: "UA", blurb: "Channel corruptive demon magic that was never meant to be channelled.", tags: { fire: 2, death: 2, void: 2, war: 1 } },
    { id: "spellfire", name: "Spellfire Sorcery", short: "Spellfire", src: "UA", blurb: "Raw silver fire that devours magic and cannot be taught.", tags: { fire: 3, light: 2, void: 1 } }
  ],
  wlk: [
    { id: "archfey", name: "The Archfey", short: "Archfey", src: "PH", blurb: "A magical pact with an archfey of the Feywild.", tags: { fey: 3, guile: 2 } },
    { id: "fiend", name: "The Fiend", short: "Fiend", src: "PH", blurb: "A magical pact with a demonic or devilish entity.", tags: { fire: 3, war: 1, death: 1 } },
    { id: "greatoldone", name: "The Great Old One", short: "Great Old One", src: "PH", blurb: "An ancient and unknowable entity from worlds beyond.", tags: { void: 3, mind: 3 } },
    { id: "celestial", name: "The Celestial", short: "Celestial", src: "XG", blurb: "A magical pact with an entity of good, law and order.", tags: { light: 3, ward: 2 } },
    { id: "undying", name: "The Undying", short: "Undying", src: "SC", blurb: "A magical pact with an entity that represents the dead.", tags: { death: 3, order: 1 } },
    { id: "hexblade", name: "The Hexblade", short: "Hexblade", src: "XG", blurb: "A pact with an entity that is — or gifted — a powerful weapon.", tags: { war: 3, shadow: 2, craft: 1 } },
    { id: "fathomless", name: "The Fathomless", short: "Fathomless", src: "TC", blurb: "A magical pact with a creature of the world's deep oceans.", tags: { void: 3, storm: 2, wild: 1 } },
    { id: "genie", name: "The Genie", short: "Genie", src: "TC", blurb: "A magical pact with a powerful elemental. You understand now why I smiled.", tags: { fey: 2, order: 2, fire: 1, storm: 1, craft: 1 } },
    { id: "undead", name: "The Undead", short: "Undead", src: "RL", blurb: "A pact with a deathless being that defies the cycle entirely.", tags: { death: 3, shadow: 2, void: 1 } }
  ],
  wiz: [
    { id: "abjuration", name: "School of Abjuration", short: "Abjuration", src: "PH", blurb: "Study the defensive powers of magic.", tags: { ward: 3, order: 2 } },
    { id: "conjuration", name: "School of Conjuration", short: "Conjuration", src: "PH", blurb: "Study the ways to control the creatures you summon.", tags: { void: 2, fey: 2, mind: 2 } },
    { id: "divination", name: "School of Divination", short: "Divination", src: "PH", blurb: "Study the ways magic can show you the future and the past.", tags: { mind: 3, light: 1, order: 1 } },
    { id: "enchantment", name: "School of Enchantment", short: "Enchantment", src: "PH", blurb: "Study the ways magic can bend the minds of others.", tags: { guile: 3, mind: 2, fey: 1 } },
    { id: "evocation", name: "School of Evocation", short: "Evocation", src: "PH", blurb: "Study the ways magic destroys, and how to aim it.", tags: { fire: 3, storm: 2, war: 1 } },
    { id: "illusion", name: "School of Illusion", short: "Illusion", src: "PH", blurb: "Study the ways magic can make the eyes of others lie.", tags: { guile: 3, shadow: 2, fey: 1 } },
    { id: "necromancy", name: "School of Necromancy", short: "Necromancy", src: "PH", blurb: "Study the forces of life and death.", tags: { death: 3, void: 1 } },
    { id: "transmutation", name: "School of Transmutation", short: "Transmutation", src: "PH", blurb: "Study the ways magic can shift reality.", tags: { craft: 2, mind: 2, wild: 1, order: 1 } },
    { id: "graviturgy", name: "School of Graviturgy", short: "Graviturgy", src: "WM", blurb: "Study the ways magic can shift and manipulate gravity.", tags: { void: 3, order: 2, mind: 1 } },
    { id: "chronurgy", name: "School of Chronurgy", short: "Chronurgy", src: "WM", blurb: "Study the ways magic can shift and bend time itself.", tags: { mind: 3, order: 3, void: 1 } },
    { id: "warmagic", name: "War Magic", short: "War Magic", src: "XG", blurb: "Study how magic is used in combat, and how it can be stored.", tags: { war: 3, ward: 2, order: 1 } },
    { id: "bladesinging", name: "Bladesinging", short: "Bladesinger", src: "TC", blurb: "A tradition of wizardry that incorporates swordplay and dance.", tags: { war: 2, order: 2, fey: 1, light: 1 } },
    { id: "scribes", name: "Order of Scribes", short: "Scribes", src: "TC", blurb: "Study the ways magic can be enhanced through books of power.", tags: { mind: 3, craft: 2, order: 2 } }
  ]
};

export const SOURCES = {
  PH: "Player's Handbook",
  XG: "Xanathar's Guide to Everything",
  TC: "Tasha's Cauldron of Everything",
  SC: "Sword Coast Adventurer's Guide",
  DM: "Dungeon Master's Guide",
  WM: "Explorer's Guide to Wildemount",
  RL: "Van Richten's Guide to Ravenloft",
  FD: "Fizban's Treasury of Dragons",
  UA: "Unearthed Arcana (2025-26 playtest)"
};
