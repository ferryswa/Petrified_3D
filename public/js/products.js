/**
 * CATEGORY & PRODUCT DATA
 * -----------------------
 * This is sample/demo data. Every product below is a PLACEHOLDER (a generated
 * "cross-section ring" graphic) so the site runs and looks right before real
 * assets exist.
 *
 * To use real content, for each product set:
 *   - photo:  "/assets/photos/xxx.jpg"        (recommended for every product)
 *   - spin:   ["/assets/photos/xxx-01.jpg", ... "-24.jpg"]  (optional, 12-36 frames
 *              shot in a circle around the object = 360° spin viewer)
 *   - model:  "/assets/models/xxx.glb"        (optional, real 3D scan = full 3D + AR viewer)
 *
 * Leave "model" and "spin" as null for simple accent/decor pieces that only
 * need a photo — the viewer automatically shows just the "Photo Zoom" mode
 * for those, with no 3D/AR tab. That's intentional: not every catalogue item
 * needs the full immersive treatment, some are just there to dress out a room.
 */

const CATEGORIES = [
  { id: 'furniture', label: 'Tables & Furniture' },
  { id: 'panel',     label: 'Wall Panels' },
  { id: 'sanitary',  label: 'Sinks & Bathtubs' },
  { id: 'ornament',  label: 'Ornaments & Decor' },
  { id: 'raw',       label: 'Raw Blocks' },
  { id: 'accessory', label: 'Accessories & Collectibles' },
];

const PRODUCTS = [
  // ---- TABLES & FURNITURE ----
  { id:'furn-01', category:'furniture', name:'Amber Ring Slab Table', desc:'A single-slab table cut from petrified wood with its natural growth rings still intact, glossy polished finish. 3D model generated with Meshy AI from a reference photo — under testing before a full licence purchase.',
    meta:{ Size:'150 x 80 x 5 cm', Weight:'~180 kg', Finish:'Glossy polish' },
    photo:'/assets/photos/furn-01.jpg', spin:null, model:'/assets/models/furn-01-petrified-forest-table-meshy.glb', ringSeed:1 },
  { id:'furn-02', category:'furniture', name:'Rustic Iron-Leg Table', desc:'Petrified wood slab paired with black iron legs for an industrial-rustic look. 3D model generated with Meshy AI from a reference photo — under testing before a full licence purchase.',
    meta:{ Size:'120 x 65 x 4 cm', Weight:'~110 kg', Finish:'Matte' },
    photo:'/assets/photos/furn-02.jpg', spin:null, model:'/assets/models/furn-02-rustic-iron-leg-table-meshy.glb', ringSeed:2 },
  { id:'furn-03', category:'furniture', name:'Round Coffee Table', desc:'A round coffee table that follows the natural shape of the original fossilised trunk. 3D model generated with Meshy AI from a reference photo — under testing before a full licence purchase.',
    meta:{ Size:'Ø70 x 45 cm', Weight:'~65 kg', Finish:'Glossy polish' },
    photo:'/assets/photos/furn-03.jpg', spin:null, model:'/assets/models/furn-03-round-coffee-table-meshy.glb', ringSeed:3 },
  { id:'furn-04', category:'furniture', name:'Live-Edge Coffee Table', desc:'Live-edge petrified wood tabletop on a slim brass-toned base — a statement centrepiece for a living room seating area. Shown here as a photo-only accent piece in the catalogue.',
    meta:{ Size:'110 x 70 x 40 cm', Weight:'~140 kg', Finish:'Glossy polish' },
    photo:'/assets/photos/furn-04.jpg', spin:null, model:null, ringSeed:16, accent:true },

  // ---- WALL PANELS ----
  { id:'panel-01', category:'panel', name:'Mosaic Wall Panel', desc:'Thin petrified wood cuts arranged into a mosaic pattern for a feature wall accent. (The 3D model below is a generic sample shape — not a scan of the real piece.)',
    meta:{ Size:'60 x 60 cm / module', Thickness:'1.5 cm', Finish:'Natural' },
    photo:'/assets/photos/panel-01.jpg', spin:null, model:'/assets/models/panel-01-mosaic-wall-panel.glb', ringSeed:4 },
  { id:'panel-02', category:'panel', name:'TV Backdrop Panel', desc:'A single large panel for a TV backdrop or feature wall. (The 3D model below is a generic sample shape — not a scan of the real piece.)',
    meta:{ Size:'200 x 100 cm', Thickness:'3 cm', Finish:'Semi-gloss' },
    photo:'/assets/photos/panel-02.jpg', spin:null, model:'/assets/models/panel-02-tv-backdrop-panel.glb', ringSeed:5, soldOut:true },

  // ---- SINKS & BATHTUBS ----
  { id:'sink-01', category:'sanitary', name:'Fossil Vessel Sink', desc:'A countertop vessel sink turned and hollowed from a solid block, showing the stone grain on every side. Sealed with a water-resistant coating for daily bathroom use. (The 3D model below is a generic sample shape — not a scan of the real piece.)',
    meta:{ Size:'Ø45 x 18 cm', Weight:'~25 kg', Finish:'Glossy polish + sealant' },
    photo:'/assets/photos/sink-01.jpg', spin:null, model:'/assets/models/sink-01-fossil-vessel-sink.glb', ringSeed:13 },
  { id:'bath-01', category:'sanitary', name:'Fossil Stone Bathtub', desc:'A carved bathtub from a large petrified wood block, built to be the centrepiece of a luxury bathroom. Made to order depending on block availability. (The 3D model below is a generic sample shape — not a scan of the real piece.)',
    meta:{ Size:'170 x 80 x 55 cm', Weight:'~450 kg', Finish:'Glossy polish + sealant' },
    photo:'/assets/photos/bath-01.jpg', spin:null, model:'/assets/models/bath-01-fossil-stone-bathtub.glb', ringSeed:14 },

  // ---- ORNAMENTS & DECOR ----
  { id:'orn-01', category:'ornament', name:'Decorative Bowl', desc:'A turned decorative bowl from a solid block, showing the natural colour banding. 3D model generated with Meshy AI from a reference photo — under testing before a full licence purchase.',
    meta:{ Size:'Ø25 x 12 cm', Weight:'~4 kg', Finish:'Glossy polish' },
    photo:'/assets/photos/orn-01.jpg', spin:null, model:'/assets/models/orn-01-decorative-bowl-meshy.glb', ringSeed:6 },
  { id:'orn-02', category:'ornament', name:'Fossil Stone Sphere', desc:'A plain decorative sphere, perfect for a desk or display shelf. (The 3D model below is a generic sample shape — not a scan of the real piece.)',
    meta:{ Diameter:'15 cm', Weight:'~5.5 kg', Finish:'Glossy polish' },
    photo:'/assets/photos/orn-02.jpg', spin:null, model:'/assets/models/orn-02-bola-fosil.glb', ringSeed:7 },
  { id:'orn-03', category:'ornament', name:'Fossil Table Lamp Base', desc:'A table lamp base cut from petrified wood, with a hidden channel for the cable. (The 3D model below is a generic sample shape — not a scan of the real piece.)',
    meta:{ Size:'20 x 20 x 30 cm', Weight:'~7 kg', Finish:'Semi-gloss' },
    photo:'/assets/photos/orn-03.jpg', spin:null, model:'/assets/models/orn-03-fossil-table-lamp-base.glb', ringSeed:8 },
  { id:'orn-04', category:'ornament', name:'Fossil Horse Figure', desc:'A hand-carved horse figure from a solid petrified wood block, showing natural colour gradation along its form. Makes a striking shelf or console centrepiece. (The 3D model below is a generic sample shape — not a scan of the real piece.)',
    meta:{ Size:'35 x 12 x 30 cm', Weight:'~9 kg', Finish:'Glossy polish' },
    photo:'/assets/photos/orn-04.jpg', spin:null, model:'/assets/models/orn-04-fossil-horse-figure.glb', ringSeed:15 },
  { id:'orn-05', category:'ornament', name:'Fossil Vase (accent piece)', desc:'A small decorative vase used purely as a styling accent — shown as a photo only in this catalogue, no 3D/AR mode.',
    meta:{ Size:'12 x 12 x 22 cm', Weight:'~3 kg', Finish:'Semi-gloss' },
    photo:'/assets/photos/orn-05.jpg', spin:null, model:null, ringSeed:17, accent:true },

  // ---- RAW BLOCKS ----
  { id:'raw-01', category:'raw', name:'XL Raw Block', desc:'A large unfinished block, showing the fossilised bark texture as-is. (The 3D model below is a generic sample shape — not a scan of the real piece.)',
    meta:{ Size:'80 x 50 x 40 cm', Weight:'~220 kg', Finish:'Raw / natural' },
    photo:'/assets/photos/raw-01.jpg', spin:null, model:'/assets/models/bong-01-raw-boulder.glb', ringSeed:9 },
  { id:'raw-02', category:'raw', name:'Whole Trunk Section', desc:'A section of fossilised trunk that still shows its original form in full. (The 3D model below is a generic sample shape — not a scan of the real piece.)',
    meta:{ Length:'110 cm', Weight:'~300 kg', Finish:'Raw / natural' },
    photo:'/assets/photos/raw-02.jpg', spin:null, model:'/assets/models/raw-02-whole-trunk-section.glb', ringSeed:10, soldOut:true },
  { id:'raw-03', category:'raw', name:'Root Stump Table Base', desc:'A raw root-stump base, ideal as a side table or standalone sculptural piece — shown as a photo-only accent piece in this catalogue.',
    meta:{ Size:'55 x 50 x 48 cm', Weight:'~95 kg', Finish:'Raw / natural' },
    photo:'/assets/photos/raw-03.jpg', spin:null, model:null, ringSeed:18, accent:true },

  // ---- ACCESSORIES & COLLECTIBLES ----
  { id:'acc-01', category:'accessory', name:'Mini Fossil Pendant', desc:'A small collector-grade cut for a pendant necklace, with sharp amber tones. (The 3D model below is a generic sample shape — not a scan of the real piece.)',
    meta:{ Size:'3 x 2 cm', Weight:'~15 g', Finish:'Glossy polish' },
    photo:'/assets/photos/acc-01.jpg', spin:null, model:'/assets/models/acc-01-mini-fossil-pendant.glb', ringSeed:11, soldOut:true },
  { id:'acc-02', category:'accessory', name:'Collector\u2019s Paperweight', desc:'A collector-grade cut for a desk display, comes with a certificate of authenticity. (The 3D model below is a generic sample shape — not a scan of the real piece.)',
    meta:{ Size:'6 x 5 x 3 cm', Weight:'~180 g', Finish:'Glossy polish' },
    photo:'/assets/photos/acc-02.jpg', spin:null, model:'/assets/models/acc-02-collectors-paperweight.glb', ringSeed:12 },
];
