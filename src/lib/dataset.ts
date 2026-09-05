/**
 * Real source data, transcribed from the Regodit dataset in
 * github.com/Alred-79/AI-x-Finance-Wall-street-Hackathon (datasets/).
 * Nothing here is invented; every field maps to a cell or file in that repo.
 */

export type AccessRow = {
  user: string;
  email: string;
  department: string;
  role: string;
  lastLogin: string;
  justified: string;
  actionNeeded: string | null;
  revisedRole: string | null;
};

export type AssetRow = {
  serial: string;
  type: string;
  description: string;
  assignedTo: string;
  purchaseDate: string;
  supplier: string;
  status: string;
  disposalDate: string | null;
  notes: string | null;
};

export type QuestionRow = { id: number; topic: string; question: string; response: string | null };

export type SourceDoc = {
  folder: string;
  file: string;
  kind: "policy" | "assessment" | "contract" | "infrastructure" | "questionnaire";
};

export const ORG_NAME = "Regodit";
export const ACCESS_REVIEW_SYSTEM = "AWS Production Console";
export const ACCESS_REVIEW_DATE = "09-04-26";
export const ACCESS_REVIEWER = "K. O'Brien, Security Lead";
export const DATASET_SOURCE =
  "github.com/Alred-79/AI-x-Finance-Wall-street-Hackathon/tree/main/datasets";

export const ACCESS_REVIEW: AccessRow[] = [
  { user: "J. Martinez", email: "j.martinez@regodit.net", department: "Engineering", role: "Admin", lastLogin: "08-29-26", justified: "Y", actionNeeded: null, revisedRole: null },
  { user: "A. Patel", email: "a.patel@regodit.net", department: "Engineering", role: "Editor", lastLogin: "09-01-26", justified: "Y", actionNeeded: null, revisedRole: null },
  { user: "S. Wong", email: "s.wong@regodit.net", department: "IT Operations", role: "Admin", lastLogin: "07-15-26", justified: "N", actionNeeded: "Revoke access", revisedRole: "Viewer" },
  { user: "R. Osei", email: "r.osei@regodit.net", department: "Finance", role: "Viewer", lastLogin: "09-02-26", justified: "Y", actionNeeded: null, revisedRole: null },
  { user: "T. Nguyen", email: "t.nguyen@regodit.net", department: "Engineering", role: "Editor", lastLogin: "05-10-26", justified: "N", actionNeeded: "Change access", revisedRole: "Viewer" },
  { user: "M. Delgado", email: "m.delgado@regodit.net", department: "Contractor - IT Support", role: "Admin", lastLogin: "03-22-26", justified: "N", actionNeeded: "Revoke access", revisedRole: null },
  { user: "K. O'Brien", email: "k.obrien@regodit.net", department: "Security", role: "Admin", lastLogin: "09-03-26", justified: "Y", actionNeeded: null, revisedRole: null },
];

export const ASSET_INVENTORY: AssetRow[] = [
  { serial: "SN-100234", type: "Laptop", description: "Dell Latitude 5440, 16GB RAM", assignedTo: "j.martinez@regodit.net", purchaseDate: "01/15/2024", supplier: "Dell Technologies", status: "In Use", disposalDate: null, notes: "Assigned to Engineering team" },
  { serial: "SN-100235", type: "Laptop", description: "MacBook Pro 14in M3", assignedTo: "a.patel@regodit.net", purchaseDate: "03/22/2024", supplier: "Apple Inc.", status: "In Use", disposalDate: null, notes: null },
  { serial: "SN-100236", type: "Monitor", description: "Dell UltraSharp 27in", assignedTo: "s.wong@regodit.net", purchaseDate: "01/15/2024", supplier: "Dell Technologies", status: "In Use", disposalDate: null, notes: null },
  { serial: "SN-100237", type: "Mobile Phone", description: "iPhone 14, Company-issued", assignedTo: "r.osei@regodit.net", purchaseDate: "06/10/2024", supplier: "Apple Inc.", status: "In Use", disposalDate: null, notes: "Enrolled in MDM" },
  { serial: "SN-100238", type: "Laptop", description: "Lenovo ThinkPad X1 Carbon", assignedTo: "t.nguyen@regodit.net", purchaseDate: "11/02/2023", supplier: "Lenovo", status: "In Repair", disposalDate: null, notes: "Screen replacement in progress" },
  { serial: "SN-100239", type: "Server", description: "Dell PowerEdge R740 (on-prem backup)", assignedTo: "N/A - IT Infrastructure", purchaseDate: "05/18/2022", supplier: "Dell Technologies", status: "In Use", disposalDate: null, notes: "Located in HQ server room" },
  { serial: "SN-100240", type: "Laptop", description: "Dell Latitude 5420", assignedTo: "m.delgado@regodit.net (contractor)", purchaseDate: "02/01/2023", supplier: "Dell Technologies", status: "Retired", disposalDate: "08/30/2026", notes: "Wiped and decommissioned per offboarding checklist" },
  { serial: "SN-100241", type: "Tablet", description: "iPad Air (5th gen)", assignedTo: "k.obrien@regodit.net", purchaseDate: "09/12/2024", supplier: "Apple Inc.", status: "In Use", disposalDate: null, notes: "Used for on-call security monitoring" },
  { serial: "SN-100242", type: "Networking Equipment", description: "Cisco Meraki MX67 Firewall", assignedTo: "N/A - IT Infrastructure", purchaseDate: "04/05/2023", supplier: "Cisco Meraki", status: "In Use", disposalDate: null, notes: "Primary office firewall/router" },
  { serial: "SN-100243", type: "Laptop", description: "Dell Latitude 5440", assignedTo: "unassigned", purchaseDate: "07/20/2025", supplier: "Dell Technologies", status: "In Storage", disposalDate: null, notes: "Spare unit for new hires" },
];

export const QUESTIONNAIRE: QuestionRow[] = [
  { id: 1, topic: "Governance", question: "Does your organization have a formal Information Security Program established?", response: null },
  { id: 2, topic: "Governance", question: "Does your organization have a published set of Information Security policies, standards and procedures?", response: null },
  { id: 3, topic: "Governance", question: "Does your organization have a public information security policy?", response: null },
  { id: 4, topic: "Governance", question: "Does your organization document role descriptions including relevant cybersecurity & data protection responsibilities?", response: null },
  { id: 5, topic: "Governance", question: "Is there a procedure in place for overseeing cybersecurity and data protection controls, that includes how issues are escalated to leadership?", response: null },
  { id: 6, topic: "Third-Party Risk Management", question: "Will you be using any contractors or sub-contractors to complete the engagement with Client XYZ?", response: null },
  { id: 7, topic: "Third-Party Risk Management", question: "Do you have a third-party risk management program/policy in place?", response: null },
  { id: 8, topic: "Third-Party Risk Management", question: "Please attach your Third-Party Risk Management Policy.", response: null },
  { id: 9, topic: "Third-Party Risk Management", question: "Does your third-party risk management program include supply chain protections?", response: null },
  { id: 10, topic: "Third-Party Risk Management", question: "Do your vendor and subcontractor agreements include clauses requiring adherence to cybersecurity and data privacy standards, and do these requirements flow down to all applicable subcontractors and suppliers?", response: null },
  { id: 11, topic: "Security Awareness & Training", question: "Do you provide security awareness training at onboarding and at least annually thereafter for all personnel including contractors?", response: null },
  { id: 12, topic: "Security Awareness & Training", question: "How frequently are employees trained on policies in your organization?", response: null },
  { id: 13, topic: "Security Awareness & Training", question: "Does your organization provide role based security awareness training at least annually?", response: null },
  { id: 14, topic: "Privacy", question: "Does your organization have privacy controls and or Data Privacy program in place?", response: null },
  { id: 15, topic: "Privacy", question: "Will your personnel or your product require access to sensitive data (i.e PII, PI, PHI) to complete the engagement with Regodit?", response: null },
  { id: 16, topic: "Privacy", question: "Please provide a copy of your data retention schedule and secure disposal procedures", response: null },
  { id: 17, topic: "Privacy", question: "Do you have a privacy policy in place? If so, please provide the attachment or URL.", response: null },
  { id: 18, topic: "Privacy", question: "Does your organization ensure privacy requirements are extended to contractors and service providers through contractual agreements, and that roles and responsibilities concerning data privacy are clearly understood and documented?", response: null },
  { id: 19, topic: "Data Security", question: "Do you, or any third party you use to deliver services to Client XYZ, store sensitive information outside the United States? If so, where?", response: null },
  { id: 20, topic: "Data Security", question: "Do you require data-at-rest encryption for sensitive data?", response: null },
  { id: 21, topic: "Data Security", question: "Do you require data-in-transit encryption for sensitive data? If so, please describe the encryption protocols used.", response: null },
  { id: 22, topic: "Data Security", question: "Will Regodit data be stored on site, in a data center, or by a third party?", response: null },
  { id: 23, topic: "Data Security", question: "Do you have data retention policies and procedures for the secure disposal of information?", response: null },
  { id: 24, topic: "Data Security", question: "If providing a product or SaaS platform that will access, store, or process Client XYZ data, are you able to provide applicable data flow diagrams showing how Regodit's data will flow through the tool upon request?", response: null },
  { id: 25, topic: "Physical Security", question: "Is there a policy in place for physical security requirements for your business?", response: null },
  { id: 26, topic: "Physical Security", question: "Do you require physical access to any Client XYZ locations to complete your engagement?", response: null },
  { id: 27, topic: "Physical Security", question: "Are you willing to accept and acknowledge the expectations outlined in Client XYZ's Visitor Management document?", response: null },
  { id: 28, topic: "Physical Security", question: "Does your organization have procedures in place to track assets that are brought onto Client XYZ sites?", response: null },
  { id: 29, topic: "Physical Security", question: "Can you provide your organization's data protection policy, including evidence of physical safeguards for devices used onsite if requested?", response: null },
  { id: 30, topic: "Web Application Security", question: "Will Client XYZ be using a web application provided by you?", response: null },
  { id: 31, topic: "Web Application Security", question: "What is the name of your web application?", response: null },
  { id: 32, topic: "Web Application Security", question: "What is the function/purpose of your web application?", response: null },
  { id: 33, topic: "Web Application Security", question: "How do you report application security vulnerabilities?", response: null },
  { id: 34, topic: "Web Application Security", question: "Does your web application have an SSL/TLS certificate?", response: null },
  { id: 35, topic: "Web Application Security", question: "Does your application offer single sign-on (SSO) or are there plans to implement/offer SSO in the near future? If plans to implement in near future, include an implementation date in your justification.", response: null },
  { id: 36, topic: "Secure Coding", question: "Do you have policies, procedures or standards in place for secure development practices?", response: null },
  { id: 37, topic: "Secure Coding", question: "Do you utilize Secure Coding Principles - (Detailed logging, encrypted credentials, etc.)?", response: null },
  { id: 38, topic: "Vulnerability Management", question: "Are internal vulnerability scans performed?", response: null },
  { id: 39, topic: "Vulnerability Management", question: "On what cadence are vulnerability scans performed?", response: null },
  { id: 40, topic: "Vulnerability Management", question: "What are the documented remediation timelines for critical and high patches?", response: null },
  { id: 41, topic: "Business Continuity & Disaster Recovery", question: "What is the process for disaster recovery and backups?", response: null },
  { id: 42, topic: "Business Continuity & Disaster Recovery", question: "Please provide a copy of your BC/DR policy for review.", response: null },
  { id: 43, topic: "Incident Response", question: "Do you keep a record of security events?", response: null },
  { id: 44, topic: "Incident Response", question: "Do you monitor the security of your wireless networks?", response: null },
  { id: 45, topic: "Incident Response", question: "Do you have an incident response plan in place? If yes, describe briefly.", response: null },
  { id: 46, topic: "Incident Response", question: "How often is your Incident Response Plan Tested?(Drop Down)", response: null },
  { id: 47, topic: "Incident Response", question: "Do you have a policy requiring prompt notice to third parties regarding information security events affecting your organization?", response: null },
  { id: 48, topic: "Incident Response", question: "Regardless of materiality, have you had a security event in the last 5 years?", response: null },
  { id: 49, topic: "Incident Response", question: "Do you outsource security functions to third-party providers?", response: null },
  { id: 50, topic: "Network & Endpoint Security", question: "Do you use anti virus software to protect your devices? If yes, describe.", response: null },
  { id: 51, topic: "Network & Endpoint Security", question: "Will your organization be accessing Client XYZ's network?", response: null },
  { id: 53, topic: "Network & Endpoint Security", question: "Please list out all authorized personnel, including first and last names and e-mail addresses from your organization that will have access to Client XYZ's assets or network.", response: null },
  { id: 54, topic: "Network & Endpoint Security", question: "Please submit a network architecture diagram and details of your endpoint protection measures, including how your organization complies with firewall and DNS security standards when accessing XYZ's networks.", response: null },
  { id: 55, topic: "Asset Management", question: "Do you keep an inventory of information technology (IT) assets and software?", response: null },
  { id: 56, topic: "Asset Management", question: "Does your organization have identity and access controls in place?", response: null },
  { id: 57, topic: "Asset Management", question: "Does your organization leverage role-based access control?", response: null },
  { id: 58, topic: "Asset Management", question: "Do you limit and periodically review user access privileges and controls?", response: null },
  { id: 59, topic: "Asset Management", question: "What is the cadence of your access reviews?(Drop Down)", response: null },
  { id: 60, topic: "Asset Management", question: "Does your organization require replay-resistant authentication mechanisms such as OTP or MFA?", response: null },
  { id: 61, topic: "Asset Management", question: "Are the external authenticators in use, NIST compliant?", response: null },
  { id: 62, topic: "Asset Management", question: "Does your organization enforce the principle of least privilege?", response: null },
  { id: 63, topic: "Risk Assessment", question: "Do you conduct information security risk assessments at least annually?", response: null },
  { id: 64, topic: "Risk Assessment", question: "How do you prioritize critical assets for your organization?", response: null },
  { id: 65, topic: "Risk Assessment", question: "Does your organization conduct penetration testing at least annually?", response: null },
  { id: 66, topic: "Risk Assessment", question: "Have the findings from the most recent penetration test been remediated?", response: null },
];


export const SOURCE_DOCS: SourceDoc[] = [
  { folder: "1. Sample_Vendor questionnaire", file: "Regodit_Comprehensive_Vendor_Security_Questionnaire_Clean.xlsx", kind: "questionnaire" },
  { folder: "2. Company policies", file: "Regodit._risk_management_policy_v1.0.docx", kind: "policy" },
  { folder: "2. Company policies", file: "Regodit_Incident_Management_Policy_v1.0.docx", kind: "policy" },
  { folder: "2. Company policies", file: "Regodit_Vendor_Risk_Management_Policy.docx", kind: "policy" },
  { folder: "2. Company policies", file: "Regodit_access_control_policy_v1.0.docx", kind: "policy" },
  { folder: "2. Company policies", file: "Regodit_asset_management_policy_v1.0.docx", kind: "policy" },
  { folder: "2. Company policies", file: "Regodit_business_continuity_and_disaster_recovery_policy_v1.0.docx", kind: "policy" },
  { folder: "2. Company policies", file: "Regodit_code_of_conduct_policy_v1.0.docx", kind: "policy" },
  { folder: "2. Company policies", file: "Regodit_cryptography_policy_v1.0.docx", kind: "policy" },
  { folder: "2. Company policies", file: "Regodit_data_classification_policy_v1.0.docx", kind: "policy" },
  { folder: "2. Company policies", file: "Regodit_hr_policy_v1.0.docx", kind: "policy" },
  { folder: "2. Company policies", file: "Regodit_information_security_policy_v1.0.docx", kind: "policy" },
  { folder: "2. Company policies", file: "Regodit_password_and_secrets_policy_v1.0.docx", kind: "policy" },
  { folder: "2. Company policies", file: "Regodit_vulnerability_and_patch_management_policy_v1.0.docx", kind: "policy" },
  { folder: "3. Security Assessment Reports", file: "Regodit AI_SOC2_Type_II_Report_Test.docx", kind: "assessment" },
  { folder: "3. Security Assessment Reports", file: "VAPT Report 01.docx", kind: "assessment" },
  { folder: "4. Contracts_agreements", file: "Employment Contract 01.docx", kind: "contract" },
  { folder: "4. Contracts_agreements", file: "Master Services Agreement.docx", kind: "contract" },
  { folder: "5. Infrastructure_internal info", file: "Access_Review_Records.xlsx", kind: "infrastructure" },
  { folder: "5. Infrastructure_internal info", file: "Asset_Inventory_Regodit.xlsx", kind: "infrastructure" },
  { folder: "5. Infrastructure_internal info", file: "BCP_DR_Plan_Solsphere.docx", kind: "infrastructure" },
  { folder: "5. Infrastructure_internal info", file: "Secure Development Lifecycle Document 01.docx", kind: "infrastructure" },
  { folder: "5. Infrastructure_internal info", file: "Solsphere W-9.pdf", kind: "infrastructure" },
  { folder: "5. Infrastructure_internal info", file: "admin-access-logging-diagram.png", kind: "infrastructure" },
  { folder: "5. Infrastructure_internal info", file: "network-segmentation-diagram.png", kind: "infrastructure" },
  { folder: "5. Infrastructure_internal info", file: "network_architecture_diagrams.pdf", kind: "infrastructure" },
];
