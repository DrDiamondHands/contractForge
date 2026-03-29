/**
 * folder.js — Contract file folder structure generator
 * Builds a color-coded ASCII folder tree based on the active
 * contract type. Supports copy-to-clipboard and .txt export.
 */

/** Render the folder tree into the panel. */
function renderFolderTree() {
  const c = getActive();
  if (!c) return;
  document.getElementById('folder-tree-output').innerHTML = _buildFolderTree(c);
}

/** Copy the plain-text tree to the clipboard. */
function copyFolderTree() {
  const text = document.getElementById('folder-tree-output').innerText;
  navigator.clipboard.writeText(text)
    .then(() => alert('Folder structure copied to clipboard!'));
}

/** Export the tree as a .txt file. */
function exportFolderList() {
  const text = document.getElementById('folder-tree-output').innerText;
  download('folder_structure.txt', text);
}

// ── Internal builder ──────────────────────────────────────────────

function _buildFolderTree(contract) {
  const name  = contract.info?.['ci-number'] || 'CONTRACT-XXXX';
  const type  = contract.type;
  const isCon = type === 'construction';
  const isSAT = type === 'sat';

  const dir  = s => `<span class="dir">${s}</span>`;
  const file = s => `<span class="file">${s}</span>`;
  const req  = s => `<span class="req">${s}</span>`;  // highlighted / required

  let tree = dir(`📁 ${name} — Contract File`) + '\n';

  // ── 1. Pre-Award ──
  tree += `  ${dir('├── 📁 1_Pre-Award')}\n`;
  tree += `  ${file('│   ├── 1.1_Purchase_Request.pdf')}\n`;
  tree += `  ${file('│   ├── 1.2_Market_Research_Report.docx')}\n`;
  tree += `  ${file('│   ├── 1.3_IGCE.xlsx')}\n`;

  if (!isSAT) {
    tree += `  ${file('│   ├── 1.4_Acquisition_Plan.docx')}\n`;
    tree += `  ${file('│   ├── 1.5_Funds_Certification.pdf')}\n`;
    tree += `  ${dir('│   └── 📁 1.6_Solicitation')}\n`;
    tree += `  ${file('│       ├── Solicitation_' + name + '_Issued.pdf')}\n`;
    tree += `  ${file('│       ├── SOW_PWS.docx')}\n`;
    tree += `  ${req('│       └── Section_L_M_Evaluation_Criteria.docx')}\n`;
  } else {
    tree += `  ${file('│   └── 1.4_RFQ_and_Quotes.pdf')}\n`;
  }

  // ── 2. Award ──
  tree += `  ${dir('├── 📁 2_Award')}\n`;
  if (!isSAT) {
    tree += `  ${file('│   ├── 2.1_Proposals_Received/')}\n`;
    tree += `  ${file('│   ├── 2.2_Technical_Evaluation.docx')}\n`;
    tree += `  ${file('│   ├── 2.3_Price_Analysis_PNM.docx')}\n`;
    tree += `  ${file('│   ├── 2.4_Source_Selection_Decision.docx')}\n`;
    tree += `  ${req('│   ├── 2.5_Executed_SF-1449.pdf')}\n`;
    tree += `  ${file('│   └── 2.6_Award_Notice_SAM.pdf')}\n`;
  } else {
    tree += `  ${file('│   ├── 2.1_Price_Reasonableness.docx')}\n`;
    tree += `  ${req('│   ├── 2.2_Executed_PO.pdf')}\n`;
    tree += `  ${file('│   └── 2.3_Award_Notice_SAM.pdf')}\n`;
  }

  // ── 3. Contract Documents ──
  tree += `  ${dir('├── 📁 3_Contract_Documents')}\n`;
  tree += `  ${req('│   ├── Signed_Contract_' + name + '.pdf')}\n`;
  tree += `  ${file('│   ├── Contractor_Representations_Certs.pdf')}\n`;
  tree += `  ${file('│   └── Insurance_Bonds' + (isCon ? '_PerformanceBond' : '') + '.pdf')}\n`;

  // ── 4. Post-Award ──
  tree += `  ${dir('├── 📁 4_Post-Award')}\n`;
  tree += `  ${file('│   ├── 4.1_COR_Appointment_Letter.pdf')}\n`;
  tree += `  ${file('│   ├── 4.2_QASP.docx')}\n`;
  tree += `  ${file('│   ├── 4.3_Kickoff_Meeting_Minutes.docx')}\n`;

  if (isCon) {
    tree += `  ${file('│   ├── 4.4_Submittals_Log.xlsx')}\n`;
    tree += `  ${file('│   ├── 4.5_RFI_Log.xlsx')}\n`;
    tree += `  ${dir('│   └── 📁 4.6_Modifications')}\n`;
  } else {
    tree += `  ${dir('│   └── 📁 4.4_Modifications')}\n`;
  }
  tree += `  ${file('│       └── MOD_001_SF-30.pdf')}\n`;

  // ── 5. Financials ──
  tree += `  ${dir('├── 📁 5_Financials')}\n`;
  tree += `  ${file('│   ├── 5.1_Invoices/')}\n`;
  tree += `  ${file('│   ├── 5.2_Payment_Records/')}\n`;
  tree += `  ${file('│   └── 5.3_Obligation_History.xlsx')}\n`;

  // ── 6. Closeout ──
  tree += `  ${dir('└── 📁 6_Closeout')}\n`;
  tree += `  ${file('    ├── 6.1_Final_Acceptance.pdf')}\n`;
  tree += `  ${file('    ├── 6.2_CPARS_Report.pdf')}\n`;
  tree += `  ${req('    └── 6.3_Closeout_Checklist.docx')}`;

  return tree;
}
