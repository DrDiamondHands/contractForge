/* ============================================================
   ContractForge — Smart Document Checklist
   Driven by acquisition characteristics selected by the user.
   ============================================================ */

const CL_TOGGLES = {};

// ── Document library ──────────────────────────────────────────
const CL_DOCS = {
  planning: {
    label: 'Acquisition Planning',
    color: '#378ADD',
    items: [
      { id:'ap1', name:'Acquisition Plan (AP)', far:'FAR 7.1', tags:['required'],
        thresholds:['sat_over','major','large','mega'],
        note:'Required above simplified acquisition threshold. Must be approved prior to solicitation.',
        template:'https://www.acquisition.gov/far/part-7' },
      { id:'ap2', name:'Market Research Report', far:'FAR 10', tags:['required'],
        thresholds:['sat_under','sat_over','major','large','mega'],
        note:'Documents sources researched, method used, and conclusions supporting acquisition strategy.',
        template:'https://www.dau.edu/tools/service-acquisition-market-research-report-template' },
      { id:'ap3', name:'Acquisition Strategy / Business Case', far:'FAR 7.102', tags:['required'],
        thresholds:['major','large','mega'],
        note:'Required for major acquisitions. Must address competition, contract type rationale, and risk.',
        template:'https://www.acquisition.gov/far/part-7' },
      { id:'ap4', name:'Requirements Document / Statement of Need', far:'FAR 11', tags:['required'],
        thresholds:['all'],
        note:"Foundation document defining the government's requirement.",
        template:'https://www.acquisition.gov/far/part-11' },
      { id:'ap5', name:'Independent Government Cost Estimate (IGCE)', far:'FAR 36.203', tags:['required'],
        thresholds:['sat_under','sat_over','major','large','mega'],
        note:'Must be completed before solicitation. Used to evaluate reasonableness of offers.',
        template:'https://www.dau.edu/acquipedia-article/independent-government-cost-estimate-igce' },
      { id:'ap6', name:'Source Selection Plan (SSP)', far:'FAR 15.303', tags:['required'],
        solicitations:['rfp'], thresholds:['sat_over','major','large','mega'],
        note:'Required for negotiated acquisitions using best-value tradeoff or LPTA.',
        template:'https://www.acquisition.gov/far/15.303' },
      { id:'ap7', name:'Bundling / Consolidation Determination', far:'FAR 7.107', tags:['conditional'],
        setasides:['sb','sdvosb','wosb','8a','hubzone'],
        note:'Required when consolidating requirements previously performed by small businesses.',
        template:'https://www.acquisition.gov/far/7.107' },
      { id:'ap8', name:'Section 508 Assessment', far:'FAR 39.2', tags:['conditional'],
        toggles:['section508'],
        note:'Required for IT acquisitions — documents accessibility compliance requirements.',
        template:'https://www.section508.gov/buy/determine-508-standards-exceptions/' },
    ]
  },
  competition: {
    label: 'Competition & Justification',
    color: '#E24B4A',
    items: [
      { id:'cj1', name:'Justification & Approval (J&A)', far:'FAR 6.303', tags:['required'],
        competitions:['sole','j_a'],
        note:'Legally required when restricting competition. Must cite FAR 6.302 authority and be approved at appropriate level.',
        template:'https://www.acquisition.gov/far/6.303-2' },
      { id:'cj2', name:'Limited Sources Justification', far:'FAR 13.106', tags:['conditional'],
        competitions:['limited'], thresholds:['sat_under'],
        note:'Required for simplified acquisitions not using full and open competition.',
        template:'https://www.acquisition.gov/far/13.106-1' },
      { id:'cj3', name:'Brand Name or Equal Justification', far:'FAR 11.105', tags:['conditional'],
        note:'Required when specifying a brand name item rather than functional characteristics.',
        template:'https://www.acquisition.gov/far/11.105' },
      { id:'cj4', name:'8(a) Program Offering Letter', far:'FAR 19.804', tags:['required'],
        competitions:['8a_direct'],
        note:'Required to offer requirement to SBA for 8(a) award.',
        template:'https://www.sba.gov/federal-contracting/contracting-assistance-programs/8a-business-development-program' },
      { id:'cj5', name:'Small Business Set-Aside Determination', far:'FAR 19.501', tags:['conditional'],
        setasides:['sb','sdvosb','wosb','8a','hubzone'],
        note:'Documents basis for set-aside, including rule of two analysis.',
        template:'https://www.acquisition.gov/far/19.501' },
      { id:'cj6', name:'SDVOSB Eligibility / CVE Verification', far:'VAAR 819', tags:['conditional'],
        setasides:['sdvosb'],
        note:'Must verify vendor CVE registration prior to award.',
        template:'https://veterans.certify.sba.gov/' },
      { id:'cj7', name:'WOSB / EDWOSB Eligibility Determination', far:'FAR 19.15', tags:['conditional'],
        setasides:['wosb'],
        note:'Contracting officer must review and document WOSB/EDWOSB eligibility.',
        template:'https://www.acquisition.gov/far/subpart-19.15' },
    ]
  },
  solicitation: {
    label: 'Solicitation Package',
    color: '#1D9E75',
    items: [
      { id:'sol1', name:'Solicitation Document (RFP / IFB / RFQ)', far:'FAR 15 / 14 / 13', tags:['required'],
        thresholds:['sat_under','sat_over','major','large','mega'],
        note:'Core solicitation document. Format varies by method.',
        template:'https://www.acquisition.gov/FARforms' },
      { id:'sol2', name:'Statement of Work (SOW)', far:'FAR 11.101', tags:['required'],
        categories:['services','it','research'],
        note:'Describes deliverables, schedule, place of performance, and GFI.',
        template:'https://www.dau.edu/acquipedia-article/statement-of-work-sow' },
      { id:'sol3', name:'Performance Work Statement (PWS)', far:'FAR 37.601', tags:['conditional'],
        categories:['services'],
        note:'Used for performance-based acquisitions. Defines outcomes rather than methods.',
        template:'https://www.dau.edu/acquipedia-article/performance-work-statement-pws' },
      { id:'sol4', name:'Statement of Objectives (SOO)', far:'FAR 37.601', tags:['conditional'],
        categories:['services','research'],
        note:'Alternative to PWS — offerors propose their own PWS and metrics.',
        template:'https://www.acquisition.gov/far/37.601' },
      { id:'sol5', name:'Specifications / Technical Requirements', far:'FAR 11', tags:['required'],
        categories:['supplies','it'],
        note:'Defines technical characteristics, standards, and inspection criteria.',
        template:'https://www.acquisition.gov/far/part-11' },
      { id:'sol6', name:'Contract Data Requirements List (CDRL / DD-1423)', far:'DFARS 215.470', tags:['conditional'],
        toggles:['dod'],
        note:'Required for DoD contracts when deliverable data is required.',
        template:'https://www.esd.whs.mil/DD/DoD-Forms/info/icitem/index/DD-Form-1423-1/' },
      { id:'sol7', name:'SF-1449 (Commercial Solicitation/Award)', far:'FAR 53.212', tags:['form'],
        categories:['supplies','services'], solicitations:['rfq','rfp'],
        note:'Standard form for commercial item acquisitions.',
        template:'https://www.gsa.gov/system/files/SF1449-21.pdf' },
      { id:'sol8', name:'SF-33 (Solicitation, Offer, Award)', far:'FAR 53.215', tags:['form'],
        solicitations:['rfp','ifb'], thresholds:['sat_over','major','large','mega'],
        note:'Used for negotiated procurements above SAT when SF-1449 does not apply.',
        template:'https://www.gsa.gov/forms-library/solicitationofferand-award' },
      { id:'sol9', name:'DD-1155 (Order for Supplies / Services)', far:'DFARS 253.213', tags:['form'],
        toggles:['dod'], solicitations:['rfq'],
        note:'DoD simplified acquisition ordering form.',
        template:'https://www.esd.whs.mil/DD/DoD-Forms/info/icitem/index/DD-Form-1155/' },
      { id:'sol10', name:'Wage Determination', far:'FAR 22.1007', tags:['conditional'],
        toggles:['prevailing'],
        note:'DOL wage determination must be incorporated into solicitation and contract.',
        template:'https://sam.gov/search/?index=wd&sort=modifiedDate&sortOrder=desc' },
      { id:'sol11', name:'Evaluation Criteria / LPTA or Tradeoff Plan', far:'FAR 15.304', tags:['required'],
        solicitations:['rfp'],
        note:'Must clearly state evaluation factors, relative importance, and basis for award.',
        template:'https://www.acquisition.gov/far/15.304' },
      { id:'sol12', name:'Instructions to Offerors (Section L)', far:'FAR 15.204', tags:['required'],
        solicitations:['rfp'],
        note:'Must specify volume structure, page limits, and proposal requirements.',
        template:'https://www.acquisition.gov/far/15.204-1' },
      { id:'sol13', name:'Oral Presentation Plan', far:'FAR 15.102', tags:['conditional'],
        toggles:['oral'],
        note:'Required when oral presentations substitute for or supplement written proposals.',
        template:'https://www.acquisition.gov/far/15.102' },
      { id:'sol14', name:'Section 508 Provisions', far:'FAR 52.239-2', tags:['conditional'],
        toggles:['section508'],
        note:'Required accessibility provisions for IT acquisitions.',
        template:'https://www.section508.gov/buy/solicitation-language/' },
      { id:'sol15', name:'Buy American Act Provisions', far:'FAR 25.1', tags:['conditional'],
        toggles:['buy_american'],
        note:'FAR 52.225-1 or -3 must be included based on acquisition category.',
        template:'https://www.acquisition.gov/far/subpart-25.1' },
    ]
  },
  construction: {
    label: 'Construction-Specific',
    color: '#BA7517',
    items: [
      { id:'con1', name:'SF-1442 (Construction Solicitation/Award)', far:'FAR 53.236', tags:['form','required'],
        categories:['construction'],
        note:'Standard form required for all construction solicitations.',
        template:'https://www.gsa.gov/forms-library/solicitation-offer-and-award-construction-alteration-or-repair' },
      { id:'con2', name:'Design Drawings & Specifications', far:'FAR 36.103', tags:['required'],
        categories:['construction','architect'],
        note:'Complete design package must be included or referenced in solicitation.',
        template:'https://www.acquisition.gov/far/36.103' },
      { id:'con3', name:'Site Investigation / Geotechnical Report', far:'FAR 36.503', tags:['conditional'],
        categories:['construction'],
        note:'Must advise offerors of available site data. Differing site conditions clause required.',
        template:'https://www.acquisition.gov/far/36.503' },
      { id:'con4', name:'Wage Determination (Davis-Bacon)', far:'FAR 22.404', tags:['required'],
        categories:['construction'],
        note:'Davis-Bacon Act applies to all federal construction contracts over $2,000.',
        template:'https://sam.gov/search/?index=wd&sort=modifiedDate&sortOrder=desc' },
      { id:'con5', name:'Miller Act Payment & Performance Bond Requirements', far:'FAR 28.102', tags:['required'],
        categories:['construction'], thresholds:['sat_over','major','large','mega'],
        note:'Performance and payment bonds required on construction contracts exceeding $150,000.',
        template:'https://www.acquisition.gov/far/28.102-1' },
      { id:'con6', name:'Architect-Engineer Qualification (SF-330)', far:'FAR 36.602', tags:['form'],
        categories:['architect'],
        note:'Required for A-E services selection. Used to establish the competitive range.',
        template:'https://www.gsa.gov/forms-library/architect-engineer-qualifications' },
      { id:'con7', name:'Brooks Act Compliance Documentation', far:'FAR 36.6', tags:['required'],
        categories:['architect'],
        note:'A-E services must be selected on qualifications basis, not price competition.',
        template:'https://www.acquisition.gov/far/subpart-36.6' },
      { id:'con8', name:'Environmental / NEPA Review', far:'FAR 52.236', tags:['conditional'],
        toggles:['enviro'],
        note:'NEPA documentation (EA or EIS) may be required prior to contract award.',
        template:'https://www.nepa.gov/nepa-guidance' },
      { id:'con9', name:'Historic Preservation Compliance (Section 106)', far:'', tags:['conditional'],
        toggles:['historic'],
        note:'NHPA Section 106 consultation required before construction affecting historic properties.',
        template:'https://www.achp.gov/protecting-historic-properties/section-106-process/introduction-section-106' },
    ]
  },
  source_selection: {
    label: 'Source Selection & Award',
    color: '#7F77DD',
    items: [
      { id:'ss1', name:'Pre-Solicitation / Synopsis (SAM.gov)', far:'FAR 5.201', tags:['required'],
        thresholds:['sat_over','major','large','mega'],
        note:'Must be posted ≥15 days before solicitation issuance.',
        template:'https://sam.gov/content/opportunities' },
      { id:'ss2', name:'Pre-Proposal Conference Minutes', far:'FAR 15.201', tags:['conditional'],
        solicitations:['rfp'],
        note:'Required when a pre-proposal conference is conducted.',
        template:'https://www.acquisition.gov/far/15.201' },
      { id:'ss3', name:'Amendment(s) to Solicitation', far:'FAR 15.206', tags:['conditional'],
        note:'Required for any material changes after solicitation issuance.',
        template:'https://www.gsa.gov/forms-library/amendment-of-solicitationmodification-of-contract' },
      { id:'ss4', name:'Proposal Evaluations / Technical Evaluation Report', far:'FAR 15.305', tags:['required'],
        solicitations:['rfp'],
        note:'Must document evaluation of each proposal against stated criteria.',
        template:'https://www.acquisition.gov/far/15.305' },
      { id:'ss5', name:'Price / Cost Analysis', far:'FAR 15.404', tags:['required'],
        thresholds:['sat_over','major','large','mega'],
        note:'Required to determine fair and reasonable pricing.',
        template:'https://www.acquisition.gov/far/15.404-1' },
      { id:'ss6', name:'Cost or Pricing Data / TINA Compliance', far:'FAR 15.403', tags:['conditional'],
        thresholds:['large','mega'],
        note:'Required when contract exceeds TINA threshold (~$2M).',
        template:'https://www.acquisition.gov/far/15.403-4' },
      { id:'ss7', name:'Competitive Range Determination', far:'FAR 15.306', tags:['conditional'],
        solicitations:['rfp'],
        note:'Required when conducting discussions.',
        template:'https://www.acquisition.gov/far/15.306' },
      { id:'ss8', name:'Discussion Letters / ENs / Clarification Requests', far:'FAR 15.306', tags:['conditional'],
        solicitations:['rfp'],
        note:'All government communications with offerors during discussions must be documented.',
        template:'https://www.acquisition.gov/far/15.306' },
      { id:'ss9', name:'Final Proposal Revision (FPR) Requests', far:'FAR 15.307', tags:['conditional'],
        solicitations:['rfp'],
        note:'Written request must go to all offerors in competitive range before source selection.',
        template:'https://www.acquisition.gov/far/15.307' },
      { id:'ss10', name:'Source Selection Decision Document (SSDD)', far:'FAR 15.308', tags:['required'],
        solicitations:['rfp'], thresholds:['sat_over','major','large','mega'],
        note:"Must document the SSA's rationale, tradeoffs considered, and basis for award.",
        template:'https://www.acquisition.gov/far/15.308' },
      { id:'ss11', name:'Best Value Trade-off / LPTA Determination', far:'FAR 15.101', tags:['required'],
        solicitations:['rfp'],
        note:'Must document the basis for best value determination or LPTA compliance.',
        template:'https://www.acquisition.gov/far/15.101-1' },
      { id:'ss12', name:'Debriefing Documentation', far:'FAR 15.505-506', tags:['conditional'],
        solicitations:['rfp'],
        note:'Pre-award and post-award debriefing records must be maintained in the contract file.',
        template:'https://www.acquisition.gov/far/15.505' },
    ]
  },
  responsibility: {
    label: 'Offeror Responsibility & Certifications',
    color: '#D85A30',
    items: [
      { id:'rc1', name:'SAM.gov Registration Verification', far:'FAR 4.1102', tags:['required'],
        thresholds:['all'],
        note:'All awardees must be actively registered in SAM.gov. Verify before award.',
        template:'https://sam.gov/content/entity-registration' },
      { id:'rc2', name:'Contractor Responsibility Determination', far:'FAR 9.103', tags:['required'],
        thresholds:['sat_under','sat_over','major','large','mega'],
        note:'KO must affirmatively determine offeror is responsible before award.',
        template:'https://www.acquisition.gov/far/9.103' },
      { id:'rc3', name:'SBA Certificate of Competency (COC) — if needed', far:'FAR 19.6', tags:['conditional'],
        setasides:['sb','sdvosb','wosb','8a','hubzone'],
        note:'If KO determines small business non-responsible, matter must be referred to SBA.',
        template:'https://www.sba.gov/federal-contracting/contracting-assistance-programs/certificate-competency-program' },
      { id:'rc4', name:'Subcontracting Plan', far:'FAR 19.702', tags:['conditional'],
        thresholds:['large','mega'],
        note:'Required on contracts > $750K not totally set aside for small business.',
        template:'https://www.acquisition.gov/far/19.704' },
      { id:'rc5', name:'FOCI / Foreign Ownership Disclosure', far:'DFARS 204.73', tags:['conditional'],
        toggles:['dod','classified'],
        note:'Required for classified contracts. DD-254 may also apply.',
        template:'https://www.dcsa.mil/mc/pv/mbi/foci/' },
      { id:'rc6', name:'DD-254 (Contract Security Classification Spec.)', far:'DFARS 204.402', tags:['conditional'],
        toggles:['classified'],
        note:'Required on contracts involving classified information.',
        template:'https://www.esd.whs.mil/DD/DoD-Forms/info/icitem/index/DD-Form-254/' },
      { id:'rc7', name:'CMMC Compliance Documentation', far:'DFARS 252.204-7021', tags:['conditional'],
        toggles:['dod','cyber'],
        note:'Cybersecurity Maturity Model Certification required for DoD contracts handling CUI.',
        template:'https://www.acq.osd.mil/cmmc/documentation.html' },
      { id:'rc8', name:'Buy American Certificate', far:'FAR 25.1101', tags:['conditional'],
        toggles:['buy_american'],
        note:'Offerors must certify compliance with Buy American Act provisions.',
        template:'https://www.acquisition.gov/far/52.225-2' },
    ]
  },
  award: {
    label: 'Contract Award & Administration',
    color: '#0F6E56',
    items: [
      { id:'aw1', name:'Award Document (Contract / Order)', far:'FAR 4.802', tags:['required'],
        thresholds:['all'],
        note:'Executed contract or order is the primary award document. Retain original.',
        template:'https://www.acquisition.gov/FARforms' },
      { id:'aw2', name:'Notice of Award', far:'FAR 15.503', tags:['required'],
        solicitations:['rfp'],
        note:'Must notify unsuccessful offerors within 3 days of award when discussions were conducted.',
        template:'https://www.acquisition.gov/far/15.503' },
      { id:'aw3', name:'Award Announcement (SAM.gov)', far:'FAR 5.301', tags:['required'],
        thresholds:['sat_over','major','large','mega'],
        note:'Synopsis of award must be posted within 45 days of contract action.',
        template:'https://sam.gov/content/opportunities' },
      { id:'aw4', name:'Contract Administration Plan', far:'FAR 42.302', tags:['conditional'],
        thresholds:['major','large','mega'],
        note:'Required for complex contracts. Documents COR/CO responsibilities.',
        template:'https://www.acquisition.gov/far/42.302' },
      { id:'aw5', name:'COR Appointment Letter & Delegation', far:'FAR 1.602-2', tags:['required'],
        thresholds:['sat_over','major','large','mega'],
        note:'COR must be formally appointed with specific delegated authority documented in writing.',
        template:'https://www.dau.edu/acquipedia-article/contracting-officer-representative-cor' },
      { id:'aw6', name:'Contractor Performance Assessment (CPARS)', far:'FAR 42.15', tags:['required'],
        thresholds:['sat_over','major','large','mega'],
        note:'Performance assessment required annually and at contract completion.',
        template:'https://www.cpars.gov' },
      { id:'aw7', name:'GFE Inventory / Property Records', far:'FAR 45', tags:['conditional'],
        toggles:['gfe'],
        note:'Government-furnished property must be tracked throughout contract lifecycle.',
        template:'https://www.acquisition.gov/far/part-45' },
      { id:'aw8', name:'Option Justification Memorandum', far:'FAR 17.207', tags:['conditional'],
        toggles:['options'],
        note:"Before exercising each option, KO must document exercise is in government's interest.",
        template:'https://www.acquisition.gov/far/17.207' },
    ]
  },
  dod_specific: {
    label: 'DoD / Defense-Specific',
    color: '#533AB7',
    items: [
      { id:'dod1', name:'Acquisition Decision Memorandum (ADM)', far:'DFARS 207', tags:['conditional'],
        toggles:['dod'], thresholds:['mega'],
        note:'Required for major defense acquisition programs (MDAPs).',
        template:'https://aaf.dau.edu/aaf/acat/' },
      { id:'dod2', name:'Operational Requirements Document (ORD) / CDD', far:'DoDI 5000', tags:['conditional'],
        toggles:['dod'], categories:['it','research'],
        note:'Defines operational capability requirements for defense system acquisitions.',
        template:'https://www.dau.edu/acquipedia-article/capability-development-document-cdd' },
      { id:'dod3', name:'Test & Evaluation Master Plan (TEMP)', far:'DoDI 5000.89', tags:['conditional'],
        toggles:['safety','dod'], thresholds:['large','mega'],
        note:'Required for major systems acquisitions to document T&E strategy.',
        template:'https://www.dau.edu/acquipedia-article/test-and-evaluation-master-plan-temp' },
      { id:'dod4', name:'Systems Engineering Plan (SEP)', far:'DoDI 5000.87', tags:['conditional'],
        toggles:['dod'], thresholds:['large','mega'],
        note:'Required for ACAT programs. Documents systems engineering approach and risk.',
        template:'https://www.dau.edu/acquipedia-article/systems-engineering-plan-sep' },
      { id:'dod5', name:'FMS Case Documentation', far:'SAMM', tags:['conditional'],
        toggles:['foreign'],
        note:'Foreign Military Sales requires Letter of Offer and Acceptance (LOA) and FMS case file.',
        template:'https://www.dsca.mil/resources/resources-partner-nations' },
    ]
  }
};

// ── State ─────────────────────────────────────────────────────
let clCheckedItems = new Set();
let clTotalItems = 0;

// ── Boot: wire toggle pills ───────────────────────────────────
function initChecklistToggles() {
  document.querySelectorAll('#cl-toggles .cl-toggle').forEach(t => {
    t.addEventListener('click', () => {
      const k = t.dataset.key;
      CL_TOGGLES[k] = !CL_TOGGLES[k];
      t.classList.toggle('cl-toggle--active', !!CL_TOGGLES[k]);
    });
  });
}

// ── Read current selections ───────────────────────────────────
function clGetSelections() {
  return {
    type:        document.getElementById('cl-sel-type').value,
    category:    document.getElementById('cl-sel-category').value,
    threshold:   document.getElementById('cl-sel-threshold').value,
    competition: document.getElementById('cl-sel-competition').value,
    setaside:    document.getElementById('cl-sel-setaside').value,
    solicitation:document.getElementById('cl-sel-solicitation').value,
    ...CL_TOGGLES
  };
}

// ── Applicability filter ──────────────────────────────────────
function clIsApplicable(item, s) {
  if (item.thresholds && item.thresholds[0] !== 'all') {
    if (!item.thresholds.includes(s.threshold)) return false;
  }
  if (item.categories && !item.categories.includes(s.category)) return false;
  if (item.competitions && !item.competitions.includes(s.competition)) return false;
  if (item.solicitations && !item.solicitations.includes(s.solicitation)) return false;
  if (item.setasides && !item.setasides.includes(s.setaside)) return false;
  if (item.toggles) {
    if (!item.toggles.some(t => s[t])) return false;
  }
  return true;
}

// ── Tag HTML ──────────────────────────────────────────────────
function clBuildTags(item) {
  let h = '';
  if (item.far) h += `<span class="cl-tag cl-tag--far">${item.far}</span>`;
  item.tags.forEach(t => {
    if (t === 'required')    h += `<span class="cl-tag cl-tag--required">Required</span>`;
    if (t === 'conditional') h += `<span class="cl-tag cl-tag--conditional">Conditional</span>`;
    if (t === 'form')        h += `<span class="cl-tag cl-tag--form">Standard Form</span>`;
  });
  return h;
}

function clBuildActions(item) {
  if (!item.template) return '';
  const icon = `<svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M1 9L9 1M9 1H4M9 1V6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
  return `<div class="cl-item-actions">
    <a class="cl-template-btn" href="${item.template}" target="_blank" rel="noopener">${icon} Template / Form</a>
  </div>`;
}

// ── Generate checklist ────────────────────────────────────────
function generateSmartChecklist() {
  const s = clGetSelections();
  clCheckedItems.clear();

  const applicable = {};
  let total = 0;

  for (const [key, cat] of Object.entries(CL_DOCS)) {
    const items = cat.items.filter(item => clIsApplicable(item, s));
    if (items.length) { applicable[key] = { ...cat, items }; total += items.length; }
  }

  clTotalItems = total;
  const container = document.getElementById('checklist-groups');

  if (!total) {
    container.innerHTML = '<div class="notice">No documents matched your selections. Choose at least one characteristic above.</div>';
    document.getElementById('cl-doc-count').textContent = '';
    clUpdateProgress();
    return;
  }

  document.getElementById('cl-doc-count').textContent = `${total} documents identified`;

  let html = '';
  for (const [key, cat] of Object.entries(applicable)) {
    html += `
      <div class="checklist-group" id="clg-${key}">
        <div class="group-header" onclick="clToggleCat('${key}')">
          <span class="group-dot" style="background:${cat.color}"></span>
          <span class="group-label">${cat.label}</span>
          <span class="group-count">${cat.items.length} doc${cat.items.length > 1 ? 's' : ''}</span>
          <span class="group-chevron" id="clchev-${key}">▾</span>
        </div>
        <div class="checklist-items" id="clitems-${key}">`;

    for (const item of cat.items) {
      html += `
          <div class="checklist-item" id="clitem-${item.id}" onclick="clToggleItem('${item.id}')">
            <div class="cl-checkbox" id="clchk-${item.id}"></div>
            <div class="cl-item-body">
              <div class="cl-item-name">${item.name}</div>
              <div class="cl-item-tags">${clBuildTags(item)}</div>
              ${item.note ? `<div class="cl-item-note">${item.note}</div>` : ''}
              ${clBuildActions(item)}
            </div>
          </div>`;
    }
    html += `</div></div>`;
  }

  container.innerHTML = html;
  clUpdateProgress();

  // persist selections into current contract
  clSaveSelections(s);
}

// ── Toggle individual item ────────────────────────────────────
function clToggleItem(id) {
  const el  = document.getElementById(`clitem-${id}`);
  const chk = document.getElementById(`clchk-${id}`);
  if (clCheckedItems.has(id)) {
    clCheckedItems.delete(id);
    el.classList.remove('checked');
    chk.classList.remove('checked');
    chk.innerHTML = '';
  } else {
    clCheckedItems.add(id);
    el.classList.add('checked');
    chk.classList.add('checked');
    chk.innerHTML = `<svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M2 5l2.5 2.5L8 3" stroke="var(--accent2)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }
  clUpdateProgress();
  clSaveChecked();
}

// ── Collapse/expand category ──────────────────────────────────
function clToggleCat(key) {
  const items = document.getElementById(`clitems-${key}`);
  const chev  = document.getElementById(`clchev-${key}`);
  const open  = items.style.display !== 'none';
  items.style.display = open ? 'none' : 'flex';
  chev.textContent = open ? '▸' : '▾';
}

// ── Progress bar ──────────────────────────────────────────────
function clUpdateProgress() {
  const pct = clTotalItems > 0 ? Math.round((clCheckedItems.size / clTotalItems) * 100) : 0;
  const bar  = document.getElementById('cl-progress-bar');
  const lbl  = document.getElementById('cl-progress-label');
  if (bar) bar.style.width = pct + '%';
  if (lbl) lbl.textContent = clTotalItems > 0
    ? `${clCheckedItems.size} of ${clTotalItems} documents complete (${pct}%)`
    : 'Generate a checklist above to begin';

  // sync dashboard stat
  const statEl = document.getElementById('stat-progress');
  const subEl  = document.getElementById('stat-progress-sub');
  if (statEl) statEl.textContent = pct + '%';
  if (subEl)  subEl.textContent  = `${clCheckedItems.size} of ${clTotalItems} items complete`;
}

// ── Reset ─────────────────────────────────────────────────────
function resetSmartChecklist() {
  ['cl-sel-type','cl-sel-category','cl-sel-threshold',
   'cl-sel-competition','cl-sel-setaside','cl-sel-solicitation'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.querySelectorAll('#cl-toggles .cl-toggle').forEach(t => {
    CL_TOGGLES[t.dataset.key] = false;
    t.classList.remove('cl-toggle--active');
  });
  clCheckedItems.clear();
  clTotalItems = 0;
  document.getElementById('checklist-groups').innerHTML = '';
  document.getElementById('cl-doc-count').textContent = '';
  clUpdateProgress();
}

// ── Persistence (hooks into existing storage.js pattern) ──────
function clSaveSelections(s) {
  if (typeof currentContractId === 'undefined' || !currentContractId) return;
  const contracts = JSON.parse(localStorage.getItem('cf_contracts') || '{}');
  if (!contracts[currentContractId]) return;
  contracts[currentContractId].clSelections = s;
  contracts[currentContractId].clChecked = [...clCheckedItems];
  localStorage.setItem('cf_contracts', JSON.stringify(contracts));
}

function clSaveChecked() {
  if (typeof currentContractId === 'undefined' || !currentContractId) return;
  const contracts = JSON.parse(localStorage.getItem('cf_contracts') || '{}');
  if (!contracts[currentContractId]) return;
  contracts[currentContractId].clChecked = [...clCheckedItems];
  localStorage.setItem('cf_contracts', JSON.stringify(contracts));
}

function clLoadForContract(contractId) {
  const contracts = JSON.parse(localStorage.getItem('cf_contracts') || '{}');
  const data = contracts[contractId];
  if (!data || !data.clSelections) return;

  const s = data.clSelections;
  const setIfExists = (id, val) => { const el = document.getElementById(id); if (el && val) el.value = val; };
  setIfExists('cl-sel-type',        s.type);
  setIfExists('cl-sel-category',    s.category);
  setIfExists('cl-sel-threshold',   s.threshold);
  setIfExists('cl-sel-competition', s.competition);
  setIfExists('cl-sel-setaside',    s.setaside);
  setIfExists('cl-sel-solicitation',s.solicitation);

  // restore toggles
  document.querySelectorAll('#cl-toggles .cl-toggle').forEach(t => {
    const active = !!s[t.dataset.key];
    CL_TOGGLES[t.dataset.key] = active;
    t.classList.toggle('cl-toggle--active', active);
  });

  // regenerate and restore checked state
  generateSmartChecklist();
  if (data.clChecked) {
    data.clChecked.forEach(id => {
      clCheckedItems.add(id);
      const el  = document.getElementById(`clitem-${id}`);
      const chk = document.getElementById(`clchk-${id}`);
      if (el)  el.classList.add('checked');
      if (chk) { chk.classList.add('checked'); chk.innerHTML = `<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="var(--accent2)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`; }
    });
    clUpdateProgress();
  }
}

// ── Init on page load ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', initChecklistToggles);
