/**
 * data.js — Static reference data
 * Contains checklist templates and FAR/DFARS clause definitions.
 * Edit this file to add new clauses or checklist items.
 */

// ═══════════════════════════════════════════
// CHECKLIST TEMPLATES (keyed by contract type)
// ═══════════════════════════════════════════
const CHECKLIST_TEMPLATES = {
  commercial: {
    'Pre-Award': [
      { id: 'req-pkg',      label: 'Requirement Package (SOW/PWS/SOO)',          ref: 'FAR 10.001' },
      { id: 'mkt-research', label: 'Market Research Report',                     ref: 'FAR 10.001' },
      { id: 'acq-plan',     label: 'Acquisition Plan / SAP (if required)',        ref: 'FAR 7.103'  },
      { id: 'igce',         label: 'Independent Government Cost Estimate (IGCE)', ref: 'FAR 36.203' },
      { id: 'funds-cert',   label: 'Funds Availability Certification',            ref: 'FAR 32.702' },
      { id: 'pr-signed',    label: 'Purchase Request (PR) — Signed',              ref: ''           },
      { id: 'synopsis',     label: 'SAM.gov Synopsis / FedBizOpps Posting',       ref: 'FAR 5.101'  },
      { id: 'solicitation', label: 'Solicitation (SF-1449 / RFP / RFQ)',          ref: 'FAR 12.203' },
    ],
    'Award': [
      { id: 'proposals',    label: 'Offers / Proposals Received',                 ref: ''           },
      { id: 'evaluation',   label: 'Technical Evaluation Documentation',          ref: 'FAR 15.305' },
      { id: 'price-analysis', label: 'Price/Cost Analysis',                       ref: 'FAR 13.106-3' },
      { id: 'source-sel',   label: 'Source Selection Decision',                   ref: 'FAR 15.308' },
      { id: 'pnm',          label: 'Price Negotiation Memorandum (PNM)',           ref: 'FAR 15.406-3' },
      { id: 'award-doc',    label: 'Award Document (SF-1449 / Contract)',          ref: ''           },
      { id: 'award-notice', label: 'Award Notice Posted to SAM.gov',              ref: 'FAR 5.301'  },
    ],
    'Post-Award': [
      { id: 'kickoff',      label: 'Post-Award Kickoff Meeting',                  ref: ''           },
      { id: 'qasp',         label: 'Quality Assurance Surveillance Plan (QASP)',  ref: 'FAR 46.401' },
      { id: 'cor-appt',     label: 'COR Appointment Letter',                      ref: 'DFARS 201.602-2' },
      { id: 'mods',         label: 'Contract Modifications (SF-30)',               ref: 'FAR 43'     },
      { id: 'invoices',     label: 'Invoices / Payment Records',                  ref: ''           },
      { id: 'past-perf',    label: 'Past Performance Assessment (CPARS)',          ref: 'FAR 42.1502' },
      { id: 'closeout',     label: 'Contract Closeout Documentation',             ref: 'FAR 4.804'  },
    ],
  },

  sat: {
    'Pre-Award': [
      { id: 'req-pkg',         label: 'Requirement Description / SOW',             ref: 'FAR 10'     },
      { id: 'mkt-research',    label: 'Market Research',                           ref: 'FAR 10'     },
      { id: 'pr-signed',       label: 'Purchase Request — Signed & Funded',        ref: ''           },
      { id: 'igce',            label: 'IGCE / Price Estimate',                     ref: ''           },
      { id: 'synopsis-waiver', label: 'SAM.gov Posting or Waiver Justification',   ref: 'FAR 5.202'  },
      { id: 'quotes',          label: 'Request for Quotations (RFQ)',               ref: 'FAR 13.106' },
    ],
    'Award': [
      { id: 'quotes-recv',   label: 'Quotes / Responses Received',                 ref: ''           },
      { id: 'price-analysis', label: 'Price Reasonableness Determination',         ref: 'FAR 13.106-3' },
      { id: 'award-doc',     label: 'Award Document (PO / BPA Call / SF-1449)',    ref: ''           },
    ],
    'Post-Award': [
      { id: 'receipt',   label: 'Receiving Report / Acceptance', ref: ''          },
      { id: 'invoices',  label: 'Invoice / Payment',             ref: ''          },
      { id: 'closeout',  label: 'File Closeout',                 ref: 'FAR 4.804' },
    ],
  },

  competitive: {
    'Pre-Award': [
      { id: 'req-pkg',      label: 'Requirement Package (PWS/SOW/SOO)',            ref: 'FAR 10'     },
      { id: 'acq-plan',     label: 'Written Acquisition Plan',                     ref: 'FAR 7.103'  },
      { id: 'mkt-research', label: 'Market Research Report',                       ref: 'FAR 10.001' },
      { id: 'igce',         label: 'Independent Government Cost Estimate',         ref: ''           },
      { id: 'funds-cert',   label: 'Funds Availability Certification',             ref: ''           },
      { id: 'synopsis',     label: 'SAM.gov 15-day Synopsis',                      ref: 'FAR 5.203'  },
      { id: 'solicitation', label: 'Solicitation Issued (RFP / IFB)',              ref: 'FAR 15.203' },
      { id: 'qa-plan',      label: 'Source Selection Plan',                        ref: 'FAR 15.303' },
    ],
    'Evaluation': [
      { id: 'proposals',      label: 'Proposals Received',                         ref: ''           },
      { id: 'tech-eval',      label: 'Technical Evaluation (by SSEB)',             ref: 'FAR 15.305' },
      { id: 'cost-eval',      label: 'Cost/Price Evaluation',                      ref: 'FAR 15.305(a)(1)' },
      { id: 'past-perf-eval', label: 'Past Performance Evaluation',               ref: 'FAR 15.305(a)(2)' },
      { id: 'discussions',    label: 'Discussion Letters / ENs (if applicable)',   ref: 'FAR 15.306' },
      { id: 'final-offers',   label: 'Final Proposal Revisions (FPRs)',            ref: 'FAR 15.307' },
    ],
    'Award': [
      { id: 'ssd',          label: 'Source Selection Decision Document',            ref: 'FAR 15.308' },
      { id: 'pnm',          label: 'Price Negotiation Memorandum',                 ref: 'FAR 15.406-3' },
      { id: 'award-doc',    label: 'Executed Contract (SF-1449)',                  ref: ''           },
      { id: 'debriefs',     label: 'Unsuccessful Offeror Debriefs (if requested)', ref: 'FAR 15.505' },
      { id: 'award-notice', label: 'Award Notice — SAM.gov',                      ref: 'FAR 5.301'  },
    ],
    'Post-Award': [
      { id: 'kickoff',       label: 'Post-Award Conference',             ref: 'FAR 42.503'  },
      { id: 'cor-appt',      label: 'COR Appointment Letter',            ref: ''            },
      { id: 'qasp',          label: 'QASP / QAS Plan',                   ref: 'FAR 46.401'  },
      { id: 'invoices',      label: 'Invoice & Payment Records',         ref: ''            },
      { id: 'mods',          label: 'Modifications (SF-30)',              ref: ''            },
      { id: 'past-perf-rprt', label: 'CPARS Past Performance Report',   ref: 'FAR 42.1502' },
      { id: 'closeout',      label: 'Contract Closeout',                 ref: 'FAR 4.804'   },
    ],
  },

  construction: {
    'Pre-Award': [
      { id: 'pws',          label: 'Statement of Work / Specs',          ref: ''          },
      { id: 'drawings',     label: 'Construction Drawings',              ref: ''          },
      { id: 'igce',         label: 'Government Estimate (IGE)',          ref: 'FAR 36.203' },
      { id: 'mkt-research', label: 'Market Research',                   ref: ''          },
      { id: 'synopsis',     label: 'SAM.gov Presolicitation Notice',    ref: 'FAR 5.203' },
      { id: 'solicitation', label: 'Solicitation (IFB / RFP)',          ref: ''          },
    ],
    'Award': [
      { id: 'bids',         label: 'Bids / Proposals Received',         ref: ''          },
      { id: 'bid-analysis', label: 'Bid Evaluation / Price Analysis',   ref: ''          },
      { id: 'award-doc',    label: 'Award Document',                    ref: ''          },
      { id: 'bonds',        label: 'Performance & Payment Bonds (≥$150K)', ref: 'FAR 28.102' },
    ],
    'Post-Award': [
      { id: 'pre-con',      label: 'Pre-Construction Conference',       ref: ''          },
      { id: 'submittals',   label: 'Submittals Tracking Log',           ref: ''          },
      { id: 'rfi-log',      label: 'RFI Log',                           ref: ''          },
      { id: 'progress-pay', label: 'Progress Payment Vouchers',         ref: ''          },
      { id: 'mods',         label: 'Modifications / Change Orders',     ref: ''          },
      { id: 'final-accept', label: 'Final Inspection & Acceptance',     ref: ''          },
      { id: 'closeout',     label: 'Closeout / Project Completion',     ref: ''          },
    ],
  },
};

// ═══════════════════════════════════════════
// FAR / DFARS CLAUSE DATA (keyed by tab)
// ═══════════════════════════════════════════
const CLAUSES = {
  mandatory: [
    { num: 'FAR 52.202-1',  title: 'Definitions',                                        desc: 'Defines terms used throughout the contract.',                                              tags: ['all']              },
    { num: 'FAR 52.203-3',  title: 'Gratuities',                                          desc: 'Prohibits offering gratuities to government officials.',                                   tags: ['all']              },
    { num: 'FAR 52.203-5',  title: 'Covenant Against Contingent Fees',                    desc: 'Warranty against contingent fee arrangements.',                                            tags: ['all']              },
    { num: 'FAR 52.204-9',  title: 'Personal Identity Verification of Contractor Personnel', desc: 'Required when contractor personnel need access to federally controlled facilities.',    tags: ['services']         },
    { num: 'FAR 52.204-21', title: 'Basic Safeguarding of Covered Contractor Information Systems', desc: 'Basic cybersecurity requirements for contractor information systems.',            tags: ['IT', 'services']   },
    { num: 'FAR 52.209-6',  title: "Protecting the Government's Interest When Subcontracting", desc: 'Requires flow-down to first-tier subcontractors.',                                   tags: ['all']              },
    { num: 'FAR 52.212-4',  title: 'Contract Terms and Conditions — Commercial',          desc: 'Standard commercial item terms and conditions.',                                          tags: ['commercial']       },
    { num: 'FAR 52.222-26', title: 'Equal Opportunity',                                   desc: 'EEO compliance requirements.',                                                             tags: ['all']              },
    { num: 'FAR 52.222-35', title: 'Equal Opportunity for Veterans',                      desc: 'VEVRAA — affirmative action for veterans.',                                               tags: ['all']              },
    { num: 'FAR 52.222-36', title: 'Equal Opportunity for Workers with Disabilities',     desc: 'Section 503 Rehabilitation Act compliance.',                                              tags: ['all']              },
    { num: 'FAR 52.222-50', title: 'Combating Trafficking in Persons',                    desc: 'Anti-human trafficking requirements.',                                                     tags: ['all']              },
    { num: 'FAR 52.225-13', title: 'Restrictions on Certain Foreign Purchases',           desc: 'Prohibits purchases from sanctioned countries.',                                           tags: ['all']              },
    { num: 'FAR 52.232-33', title: 'Payment by Electronic Funds Transfer — SAM',          desc: 'Requires EFT payment via SAM.gov.',                                                       tags: ['all']              },
    { num: 'FAR 52.233-1',  title: 'Disputes',                                            desc: 'Contract Disputes Act procedures.',                                                        tags: ['all']              },
    { num: 'FAR 52.244-6',  title: 'Subcontracts for Commercial Products',                desc: 'Commercial subcontracting flow-down clause.',                                             tags: ['commercial']       },
    { num: 'FAR 52.246-4',  title: 'Inspection of Services — Fixed-Price',                desc: 'Right to inspect and accept services.',                                                   tags: ['services', 'ffp']  },
  ],

  commercial: [
    { num: 'FAR 52.212-1', title: 'Instructions to Offerors — Commercial Products',      desc: 'Standard offeror instructions for commercial acquisitions.',       tags: ['solicitation'] },
    { num: 'FAR 52.212-2', title: 'Evaluation — Commercial Products',                    desc: 'Evaluation criteria for commercial item solicitations.',           tags: ['solicitation'] },
    { num: 'FAR 52.212-3', title: 'Offeror Representations & Certifications',            desc: 'Reps & certs for commercial acquisitions.',                       tags: ['solicitation'] },
    { num: 'FAR 52.212-4', title: 'Contract Terms and Conditions — Commercial',          desc: 'Standard commercial contract T&Cs.',                              tags: ['award']        },
    { num: 'FAR 52.212-5', title: 'Contract Terms Required to Implement Statutes',       desc: 'Statutory clauses required in commercial contracts (checkbox).',  tags: ['award']        },
    { num: 'FAR 52.217-8', title: 'Option to Extend Services',                           desc: 'Allows Government to extend services up to 6 months.',            tags: ['option']       },
    { num: 'FAR 52.217-9', title: 'Option to Extend the Term of the Contract',           desc: 'Option years clause.',                                            tags: ['option']       },
  ],

  construction: [
    { num: 'FAR 52.222-6',  title: 'Construction Wage Rate Requirements (Davis-Bacon)',  desc: 'Prevailing wage requirements for construction contracts ≥$2,000.',  tags: ['construction'] },
    { num: 'FAR 52.222-7',  title: 'Withholding of Funds',                               desc: 'Allows withholding for wage law violations.',                      tags: ['construction'] },
    { num: 'FAR 52.228-15', title: 'Performance and Payment Bonds — Construction',       desc: 'Bond requirements for construction contracts ≥$150K.',             tags: ['construction'] },
    { num: 'FAR 52.236-1',  title: 'Performance of Work by the Contractor',              desc: 'Limits subcontracting on construction.',                           tags: ['construction'] },
    { num: 'FAR 52.236-2',  title: 'Differing Site Conditions',                          desc: 'Provides equitable adjustment for unforeseen site conditions.',    tags: ['construction'] },
    { num: 'FAR 52.236-3',  title: 'Site Investigation and Conditions Affecting the Work', desc: 'Contractor site investigation responsibility.',                  tags: ['construction'] },
    { num: 'FAR 52.236-7',  title: 'Permits and Responsibilities',                       desc: 'Contractor responsible for permits and codes.',                    tags: ['construction'] },
    { num: 'FAR 52.236-12', title: 'Cleaning Up',                                        desc: 'Requires site cleanup during and after construction.',             tags: ['construction'] },
    { num: 'FAR 52.236-21', title: 'Specifications and Drawings for Construction',       desc: 'Resolution of spec/drawing conflicts.',                            tags: ['construction'] },
  ],

  dfars: [
    { num: 'DFARS 252.203-7000', title: 'Requirements Relating to Compensation of Former DoD Officials', desc: 'Restrictions on employing former DoD officials.',                   tags: ['DoD']              },
    { num: 'DFARS 252.204-7012', title: 'Safeguarding Covered Defense Information (CDI)',                 desc: 'CMMC/cybersecurity requirements for DoD contractors.',              tags: ['DoD', 'cyber', 'CDI'] },
    { num: 'DFARS 252.204-7015', title: 'Notice of Authorized Disclosure for Litigation Support',         desc: 'Governs disclosure of info in litigation.',                         tags: ['DoD']              },
    { num: 'DFARS 252.211-7003', title: 'Item Unique Identification (IUID)',                              desc: 'Marks DoD property items with unique identifiers.',                tags: ['DoD', 'supply']    },
    { num: 'DFARS 252.225-7001', title: 'Buy American — Balance of Payments Program',                     desc: 'Domestic source restrictions for DoD.',                             tags: ['DoD', 'supply']    },
    { num: 'DFARS 252.225-7009', title: 'Restriction on Acquisition of Certain Articles (Berry)',         desc: 'Berry Amendment specialty metals / textiles restriction.',          tags: ['DoD', 'supply']    },
    { num: 'DFARS 252.227-7013', title: 'Rights in Technical Data — Noncommercial Products',              desc: 'Government rights in technical data.',                              tags: ['DoD', 'IP']        },
    { num: 'DFARS 252.232-7003', title: 'Electronic Submission of Payment Requests',                      desc: 'Wide Area Work Flow (WAWF) submission requirement.',               tags: ['DoD', 'payment']   },
    { num: 'DFARS 252.232-7006', title: 'Wide Area Work Flow Payment Instructions',                       desc: 'WAWF specific payment routing instructions.',                      tags: ['DoD', 'payment']   },
    { num: 'DFARS 252.246-7003', title: 'Notification of Potential Safety Issues',                        desc: 'Contractor must notify of potential safety defects.',              tags: ['DoD', 'safety']    },
  ],
};

// Human-readable contract type labels
const CONTRACT_TYPE_LABELS = {
  commercial:   'FAR Part 12 Commercial',
  sat:          'Simplified Acquisition',
  competitive:  'Full & Open Competitive',
  construction: 'Construction',
};

// Fields to sync from the Dashboard contract info card into form panels
const CONTRACT_INFO_FIELDS = [
  'ci-number', 'ci-sol', 'ci-award-date',
  'ci-co', 'ci-contractor', 'ci-cage',
  'ci-value', 'ci-pop', 'ci-desc',
];
