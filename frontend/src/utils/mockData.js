// Mock data store for the LegalEase prototype
// In production, this would come from the Spring Boot backend API

export const CASE_CATEGORIES = [
  { id: 'civil', name: 'Civil', icon: '⚖️', description: 'Property disputes, contracts, torts' },
  { id: 'criminal', name: 'Criminal', icon: '🔒', description: 'Criminal offenses and charges' },
  { id: 'family', name: 'Family', icon: '👨‍👩‍👧‍👦', description: 'Divorce, custody, adoption' },
  { id: 'property', name: 'Property', icon: '🏠', description: 'Land disputes, ownership rights' },
  { id: 'labor', name: 'Labor', icon: '👷', description: 'Employment, wages, workplace' },
  { id: 'consumer', name: 'Consumer', icon: '🛒', description: 'Product complaints, service disputes' },
  { id: 'cybercrime', name: 'Cyber Crime', icon: '💻', description: 'Online fraud, hacking, data theft' },
  { id: 'corporate', name: 'Corporate', icon: '🏢', description: 'Business disputes, compliance' },
  { id: 'traffic', name: 'Traffic', icon: '🚗', description: 'Traffic violations, accidents' },
  { id: 'other', name: 'Others', icon: '📋', description: 'Other legal matters' }
]

export const CASE_STATUSES = [
  { id: 'filed', label: 'Filed', color: 'info' },
  { id: 'under_verification', label: 'Under Verification', color: 'warning' },
  { id: 'under_review', label: 'Under Review', color: 'primary' },
  { id: 'hearing_scheduled', label: 'Hearing Scheduled', color: 'info' },
  { id: 'evidence_review', label: 'Evidence Review', color: 'warning' },
  { id: 'judgment_reserved', label: 'Judgment Reserved', color: 'gold' },
  { id: 'closed', label: 'Closed', color: 'success' },
  { id: 'dismissed', label: 'Dismissed', color: 'danger' }
]

export const MOCK_CASES = [
  {
    id: 1,
    caseNumber: 'CASE-2026-CIV-000001',
    title: 'Property Boundary Dispute - Rajesh vs. Vikram',
    description: 'Dispute over property boundary lines between adjacent landowners in Bengaluru. The petitioner claims the respondent has encroached upon 200 sq ft of their registered property.',
    category: 'property',
    status: 'hearing_scheduled',
    petitionerId: 1,
    petitionerName: 'Rajesh Kumar',
    respondentId: 5,
    respondentName: 'Vikram Patel',
    petitionerLawyerId: 2,
    petitionerLawyerName: 'Adv. Priya Sharma',
    respondentLawyerId: null,
    respondentLawyerName: null,
    judgeId: 3,
    judgeName: 'Hon. Justice Ramesh Patil',
    courtId: 1,
    courtName: 'Bengaluru City Civil Court',
    filingDate: '2026-05-15',
    priority: 'medium',
    timeline: [
      { step: 'Case Filed', date: '2026-05-15', status: 'completed', description: 'Case registered online' },
      { step: 'Documents Verified', date: '2026-05-18', status: 'completed', description: 'All documents verified by admin' },
      { step: 'Respondent Notified', date: '2026-05-20', status: 'completed', description: 'Vikram Patel notified via email & SMS' },
      { step: 'Lawyer Assigned', date: '2026-05-22', status: 'completed', description: 'Adv. Priya Sharma accepted the case' },
      { step: 'Hearing Scheduled', date: '2026-06-15', status: 'current', description: 'First hearing at City Civil Court, Room 3' },
      { step: 'Judgment Pending', date: null, status: 'pending', description: '' }
    ]
  },
  {
    id: 2,
    caseNumber: 'CASE-2026-LAB-000002',
    title: 'Unpaid Salary Claim - Rajesh vs. TechCorp Solutions',
    description: 'The employer has failed to pay 3 months of salary and denied all severance benefits. Total outstanding amount: ₹4,50,000.',
    category: 'labor',
    status: 'under_review',
    petitionerId: 1,
    petitionerName: 'Rajesh Kumar',
    respondentId: null,
    respondentName: 'TechCorp Solutions Pvt. Ltd.',
    petitionerLawyerId: null,
    petitionerLawyerName: null,
    respondentLawyerId: null,
    respondentLawyerName: null,
    judgeId: null,
    judgeName: null,
    courtId: 2,
    courtName: 'Labour Court, Bengaluru',
    filingDate: '2026-06-01',
    priority: 'high',
    timeline: [
      { step: 'Case Filed', date: '2026-06-01', status: 'completed', description: 'Case registered online' },
      { step: 'Documents Verified', date: '2026-06-03', status: 'completed', description: 'Salary slips and contract verified' },
      { step: 'Under Review', date: '2026-06-05', status: 'current', description: 'Case under administrative review' },
      { step: 'Respondent Notification', date: null, status: 'pending', description: '' },
      { step: 'Hearing Date', date: null, status: 'pending', description: '' },
      { step: 'Resolution', date: null, status: 'pending', description: '' }
    ]
  },
  {
    id: 3,
    caseNumber: 'CASE-2026-FAM-000003',
    title: 'Custody Dispute - Meera vs. Suresh Reddy',
    description: 'Dispute over custody of minor child following divorce proceedings. Petitioner seeks sole custody.',
    category: 'family',
    status: 'evidence_review',
    petitionerId: 6,
    petitionerName: 'Meera Reddy',
    respondentId: 7,
    respondentName: 'Suresh Reddy',
    petitionerLawyerId: 2,
    petitionerLawyerName: 'Adv. Priya Sharma',
    respondentLawyerId: 8,
    respondentLawyerName: 'Adv. Karthik Nair',
    judgeId: 3,
    judgeName: 'Hon. Justice Ramesh Patil',
    courtId: 3,
    courtName: 'Family Court, Bengaluru',
    filingDate: '2026-04-10',
    priority: 'high',
    timeline: [
      { step: 'Case Filed', date: '2026-04-10', status: 'completed', description: 'Custody petition filed' },
      { step: 'Documents Verified', date: '2026-04-14', status: 'completed', description: 'Marriage and birth certificates verified' },
      { step: 'Both Parties Notified', date: '2026-04-16', status: 'completed', description: 'Both parties served notice' },
      { step: 'Lawyers Assigned', date: '2026-04-20', status: 'completed', description: 'Both parties have legal representation' },
      { step: 'Evidence Review', date: '2026-05-01', status: 'current', description: 'Court reviewing submitted evidence' },
      { step: 'Judgment Pending', date: null, status: 'pending', description: '' }
    ]
  },
  {
    id: 4,
    caseNumber: 'CASE-2026-CRM-000004',
    title: 'Online Fraud Case - Govt. vs. Unknown',
    description: 'Cyber crime complaint involving online banking fraud resulting in loss of ₹2,50,000.',
    category: 'cybercrime',
    status: 'under_verification',
    petitionerId: 1,
    petitionerName: 'Rajesh Kumar',
    respondentId: null,
    respondentName: 'Unknown Accused',
    petitionerLawyerId: null,
    petitionerLawyerName: null,
    respondentLawyerId: null,
    respondentLawyerName: null,
    judgeId: null,
    judgeName: null,
    courtId: null,
    courtName: null,
    filingDate: '2026-06-08',
    priority: 'urgent',
    timeline: [
      { step: 'Case Filed', date: '2026-06-08', status: 'completed', description: 'Cyber crime complaint registered' },
      { step: 'Document Verification', date: '2026-06-09', status: 'current', description: 'Bank statements under verification' },
      { step: 'Investigation', date: null, status: 'pending', description: '' },
      { step: 'Hearing', date: null, status: 'pending', description: '' }
    ]
  },
  {
    id: 5,
    caseNumber: 'CASE-2025-CON-000005',
    title: 'Defective Product Complaint - Anita vs. ElectroMart',
    description: 'Consumer complaint regarding defective washing machine sold without warranty honor.',
    category: 'consumer',
    status: 'closed',
    petitionerId: 9,
    petitionerName: 'Anita Gupta',
    respondentId: null,
    respondentName: 'ElectroMart India Ltd.',
    petitionerLawyerId: 2,
    petitionerLawyerName: 'Adv. Priya Sharma',
    respondentLawyerId: null,
    respondentLawyerName: null,
    judgeId: 3,
    judgeName: 'Hon. Justice Ramesh Patil',
    courtId: 4,
    courtName: 'Consumer Disputes Redressal Forum, Bengaluru',
    filingDate: '2025-11-20',
    priority: 'low',
    timeline: [
      { step: 'Case Filed', date: '2025-11-20', status: 'completed', description: 'Consumer complaint registered' },
      { step: 'Documents Verified', date: '2025-11-25', status: 'completed', description: 'Purchase receipts verified' },
      { step: 'Hearing', date: '2025-12-15', status: 'completed', description: 'Arguments heard from both sides' },
      { step: 'Judgment', date: '2026-01-10', status: 'completed', description: 'Ordered full refund + ₹10,000 compensation' }
    ]
  }
]

export const MOCK_LAWYERS = [
  {
    id: 2, userId: 2, name: 'Adv. Priya Sharma', email: 'lawyer@legalease.com',
    barCouncilId: 'KAR/2018/0456', specialization: 'Civil Law',
    specializations: ['Civil Law', 'Property Law', 'Consumer Law'],
    experience: 8, rating: 4.8, casesHandled: 156, casesWon: 128,
    isVerified: true, bio: 'Senior civil litigation lawyer with 8+ years of experience in property disputes, consumer protection, and civil rights cases.',
    location: 'Bengaluru, Karnataka', priceRange: '₹15,000 - ₹50,000',
    languages: ['English', 'Kannada', 'Hindi'], available: true
  },
  {
    id: 6, userId: 6, name: 'Adv. Karthik Nair', email: 'karthik@legalease.com',
    barCouncilId: 'KAR/2015/0789', specialization: 'Criminal Law',
    specializations: ['Criminal Law', 'Cyber Crime', 'Family Law'],
    experience: 11, rating: 4.6, casesHandled: 210, casesWon: 168,
    isVerified: true, bio: 'Experienced criminal defense attorney specializing in cyber crimes and family law disputes.',
    location: 'Bengaluru, Karnataka', priceRange: '₹20,000 - ₹75,000',
    languages: ['English', 'Kannada', 'Malayalam'], available: true
  },
  {
    id: 7, userId: 7, name: 'Adv. Sneha Iyer', email: 'sneha@legalease.com',
    barCouncilId: 'KAR/2020/0123', specialization: 'Family Law',
    specializations: ['Family Law', 'Divorce', 'Child Custody'],
    experience: 5, rating: 4.9, casesHandled: 89, casesWon: 78,
    isVerified: true, bio: 'Compassionate family law specialist with a focus on mediation and amicable settlements.',
    location: 'Mysuru, Karnataka', priceRange: '₹10,000 - ₹35,000',
    languages: ['English', 'Kannada', 'Tamil'], available: true
  },
  {
    id: 8, userId: 8, name: 'Adv. Mohammed Farooq', email: 'farooq@legalease.com',
    barCouncilId: 'KAR/2012/0345', specialization: 'Corporate Law',
    specializations: ['Corporate Law', 'Labor Law', 'Commercial Disputes'],
    experience: 14, rating: 4.7, casesHandled: 320, casesWon: 256,
    isVerified: true, bio: 'Senior corporate lawyer handling complex commercial disputes and labor law matters.',
    location: 'Bengaluru, Karnataka', priceRange: '₹30,000 - ₹1,00,000',
    languages: ['English', 'Kannada', 'Urdu', 'Hindi'], available: false
  },
  {
    id: 9, userId: 9, name: 'Adv. Lakshmi Venkat', email: 'lakshmi@legalease.com',
    barCouncilId: 'KAR/2017/0567', specialization: 'Property Law',
    specializations: ['Property Law', 'Real Estate', 'Civil Law'],
    experience: 9, rating: 4.5, casesHandled: 178, casesWon: 139,
    isVerified: true, bio: 'Real estate and property law expert with deep knowledge of Karnataka land laws.',
    location: 'Bengaluru, Karnataka', priceRange: '₹15,000 - ₹60,000',
    languages: ['English', 'Kannada', 'Telugu'], available: true
  },
  {
    id: 10, userId: 10, name: 'Adv. Arjun Desai', email: 'arjun@legalease.com',
    barCouncilId: 'KAR/2019/0890', specialization: 'Criminal Law',
    specializations: ['Criminal Law', 'Traffic Law', 'Bail'],
    experience: 6, rating: 4.3, casesHandled: 95, casesWon: 72,
    isVerified: true, bio: 'Criminal defense specialist with experience in traffic violations and bail matters.',
    location: 'Hubli, Karnataka', priceRange: '₹8,000 - ₹25,000',
    languages: ['English', 'Kannada', 'Hindi'], available: true
  }
]

export const MOCK_COURTS = [
  {
    id: 1, name: 'Bengaluru City Civil Court', type: 'Civil',
    address: 'Mayo Hall, MG Road, Bengaluru', city: 'Bengaluru', state: 'Karnataka',
    latitude: 12.9745, longitude: 77.6048, jurisdiction: 'Bengaluru Urban',
    phone: '+91 80 2295 0000'
  },
  {
    id: 2, name: 'Labour Court, Bengaluru', type: 'Labour',
    address: 'Sheshadri Road, Bengaluru', city: 'Bengaluru', state: 'Karnataka',
    latitude: 12.9850, longitude: 77.5898, jurisdiction: 'Bengaluru Urban',
    phone: '+91 80 2286 0000'
  },
  {
    id: 3, name: 'Family Court, Bengaluru', type: 'Family',
    address: 'Cubbon Park Area, Bengaluru', city: 'Bengaluru', state: 'Karnataka',
    latitude: 12.9780, longitude: 77.5920, jurisdiction: 'Bengaluru Urban',
    phone: '+91 80 2294 0000'
  },
  {
    id: 4, name: 'Consumer Disputes Redressal Forum', type: 'Consumer',
    address: 'Kempegowda Road, Bengaluru', city: 'Bengaluru', state: 'Karnataka',
    latitude: 12.9830, longitude: 77.5740, jurisdiction: 'Karnataka State',
    phone: '+91 80 2287 0000'
  },
  {
    id: 5, name: 'High Court of Karnataka', type: 'High Court',
    address: 'Raj Bhavan Road, Bengaluru', city: 'Bengaluru', state: 'Karnataka',
    latitude: 12.9785, longitude: 77.5910, jurisdiction: 'Karnataka State',
    phone: '+91 80 2295 2000'
  }
]

export const MOCK_HEARINGS = [
  {
    id: 1, caseId: 1, caseNumber: 'CASE-2026-CIV-000001',
    caseTitle: 'Property Boundary Dispute',
    judgeId: 3, judgeName: 'Hon. Justice Ramesh Patil',
    hearingDate: '2026-06-15T10:30:00', location: 'Room 3, City Civil Court',
    remarks: 'First hearing - both parties to present initial arguments',
    nextHearingDate: null, orders: null, status: 'scheduled'
  },
  {
    id: 2, caseId: 3, caseNumber: 'CASE-2026-FAM-000003',
    caseTitle: 'Custody Dispute',
    judgeId: 3, judgeName: 'Hon. Justice Ramesh Patil',
    hearingDate: '2026-06-18T14:00:00', location: 'Room 5, Family Court',
    remarks: 'Evidence review hearing - both sides to present supporting documents',
    nextHearingDate: null, orders: null, status: 'scheduled'
  },
  {
    id: 3, caseId: 1, caseNumber: 'CASE-2026-CIV-000001',
    caseTitle: 'Property Boundary Dispute',
    judgeId: 3, judgeName: 'Hon. Justice Ramesh Patil',
    hearingDate: '2026-05-28T11:00:00', location: 'Room 3, City Civil Court',
    remarks: 'Preliminary hearing completed. Both parties instructed to submit property documents.',
    nextHearingDate: '2026-06-15', orders: 'Both parties to submit surveyed property maps within 2 weeks.',
    status: 'completed'
  }
]

export const MOCK_NOTIFICATIONS = [
  {
    id: 1, userId: 1, title: 'Hearing Scheduled', type: 'hearing',
    message: 'Your hearing for CASE-2026-CIV-000001 is scheduled for June 15, 2026 at 10:30 AM.',
    isRead: false, relatedCaseId: 1, createdAt: '2026-06-10T09:00:00'
  },
  {
    id: 2, userId: 1, title: 'Document Verified', type: 'document',
    message: 'Your property deed for CASE-2026-CIV-000001 has been verified by the admin.',
    isRead: false, relatedCaseId: 1, createdAt: '2026-06-09T14:30:00'
  },
  {
    id: 3, userId: 1, title: 'Lawyer Accepted', type: 'lawyer',
    message: 'Adv. Priya Sharma has accepted your case request for CASE-2026-CIV-000001.',
    isRead: true, relatedCaseId: 1, createdAt: '2026-05-22T10:15:00'
  },
  {
    id: 4, userId: 1, title: 'Case Filed Successfully', type: 'case',
    message: 'Your case CASE-2026-LAB-000002 has been filed successfully and is under verification.',
    isRead: true, relatedCaseId: 2, createdAt: '2026-06-01T16:45:00'
  },
  {
    id: 5, userId: 2, title: 'New Case Request', type: 'case',
    message: 'You have received a new case request from Rajesh Kumar for a property dispute.',
    isRead: false, relatedCaseId: 1, createdAt: '2026-06-10T08:00:00'
  }
]

export const MOCK_MESSAGES = [
  {
    id: 1, senderId: 1, senderName: 'Rajesh Kumar', receiverId: 2,
    caseId: 1, content: 'Hello Adv. Sharma, I have gathered the additional property documents you requested.',
    sentAt: '2026-06-09T10:00:00', isRead: true
  },
  {
    id: 2, senderId: 2, senderName: 'Adv. Priya Sharma', receiverId: 1,
    caseId: 1, content: 'Great, please upload them to the case workspace. I will review them before the hearing on June 15.',
    sentAt: '2026-06-09T10:15:00', isRead: true
  },
  {
    id: 3, senderId: 1, senderName: 'Rajesh Kumar', receiverId: 2,
    caseId: 1, content: 'Uploaded. Also, I found an old survey map from 2018 that clearly shows the original boundary. Should I include that as well?',
    sentAt: '2026-06-09T10:30:00', isRead: true
  },
  {
    id: 4, senderId: 2, senderName: 'Adv. Priya Sharma', receiverId: 1,
    caseId: 1, content: 'Absolutely! That would be excellent evidence. Please upload it under the "Evidence" category. The older the survey map, the stronger our case.',
    sentAt: '2026-06-09T11:00:00', isRead: false
  }
]

export const MOCK_DOCUMENTS = [
  {
    id: 1, caseId: 1, uploadedBy: 1, uploaderName: 'Rajesh Kumar',
    fileName: 'Property_Deed.pdf', fileType: 'pdf', fileSize: '2.4 MB',
    category: 'Evidence', verificationStatus: 'verified', version: 1,
    uploadedAt: '2026-05-15T10:00:00'
  },
  {
    id: 2, caseId: 1, uploadedBy: 1, uploaderName: 'Rajesh Kumar',
    fileName: 'Survey_Map_2018.pdf', fileType: 'pdf', fileSize: '5.1 MB',
    category: 'Evidence', verificationStatus: 'verified', version: 1,
    uploadedAt: '2026-05-15T10:05:00'
  },
  {
    id: 3, caseId: 1, uploadedBy: 2, uploaderName: 'Adv. Priya Sharma',
    fileName: 'Legal_Notice_Draft.pdf', fileType: 'pdf', fileSize: '1.2 MB',
    category: 'Legal Notice', verificationStatus: 'verified', version: 2,
    uploadedAt: '2026-05-23T14:00:00'
  },
  {
    id: 4, caseId: 2, uploadedBy: 1, uploaderName: 'Rajesh Kumar',
    fileName: 'Salary_Slips_Jan-Mar.pdf', fileType: 'pdf', fileSize: '3.8 MB',
    category: 'Evidence', verificationStatus: 'verified', version: 1,
    uploadedAt: '2026-06-01T16:30:00'
  },
  {
    id: 5, caseId: 2, uploadedBy: 1, uploaderName: 'Rajesh Kumar',
    fileName: 'Employment_Contract.pdf', fileType: 'pdf', fileSize: '1.6 MB',
    category: 'Evidence', verificationStatus: 'pending', version: 1,
    uploadedAt: '2026-06-01T16:35:00'
  },
  {
    id: 6, caseId: 1, uploadedBy: 1, uploaderName: 'Rajesh Kumar',
    fileName: 'Boundary_Photos.zip', fileType: 'image', fileSize: '12.5 MB',
    category: 'Evidence', verificationStatus: 'verified', version: 1,
    uploadedAt: '2026-06-09T10:30:00'
  }
]

// Helper to generate case number
let caseCounter = 6
export function generateCaseNumber(category) {
  const categoryCode = {
    civil: 'CIV', criminal: 'CRM', family: 'FAM', property: 'PRO',
    labor: 'LAB', consumer: 'CON', cybercrime: 'CYB', corporate: 'CRP',
    traffic: 'TRF', other: 'OTH'
  }
  const code = categoryCode[category] || 'OTH'
  const num = String(caseCounter++).padStart(6, '0')
  return `CASE-2026-${code}-${num}`
}
