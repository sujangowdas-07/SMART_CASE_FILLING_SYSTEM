package com.legalease.util;

import com.legalease.entity.*;
import com.legalease.enums.*;
import com.legalease.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Seeds the H2 database with demo data matching the frontend's mockData.js
 * so the app works identically when switching from mock to real API.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final LawyerRepository lawyerRepository;
    private final CourtRepository courtRepository;
    private final CaseRepository caseRepository;
    private final CaseTimelineRepository timelineRepository;
    private final HearingRepository hearingRepository;
    private final NotificationRepository notificationRepository;
    private final MessageRepository messageRepository;
    private final DocumentRepository documentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded, skipping.");
            return;
        }

        log.info("Seeding database with demo data...");

        // ═══════════════════════════════════════════════
        // USERS (matching AuthContext.jsx DEMO_USERS)
        // ═══════════════════════════════════════════════
        String encodedPass = passwordEncoder.encode("password123");

        User citizen = userRepository.save(User.builder()
                .name("Rajesh Kumar").email("citizen@legalease.com").password(encodedPass)
                .role(Role.CITIZEN).phone("+91 98765 43210").address("Bengaluru, Karnataka")
                .aadhaarNumber("1234-5678-9012").emailVerified(true).active(true).build());

        User lawyerUser = userRepository.save(User.builder()
                .name("Adv. Priya Sharma").email("lawyer@legalease.com").password(encodedPass)
                .role(Role.LAWYER).phone("+91 87654 32109").address("Bengaluru, Karnataka")
                .emailVerified(true).active(true).build());

        User judge = userRepository.save(User.builder()
                .name("Hon. Justice Ramesh Patil").email("judge@legalease.com").password(encodedPass)
                .role(Role.JUDGE).phone("+91 76543 21098").emailVerified(true).active(true).build());

        User admin = userRepository.save(User.builder()
                .name("System Admin").email("admin@legalease.com").password(encodedPass)
                .role(Role.ADMIN).phone("+91 65432 10987").emailVerified(true).active(true).build());

        User respondent = userRepository.save(User.builder()
                .name("Vikram Patel").email("respondent@legalease.com").password(encodedPass)
                .role(Role.CITIZEN).phone("+91 54321 09876").address("Mysuru, Karnataka")
                .aadhaarNumber("9876-5432-1098").emailVerified(true).active(true).build());

        // Additional users for lawyers
        User karthikUser = userRepository.save(User.builder()
                .name("Adv. Karthik Nair").email("karthik@legalease.com").password(encodedPass)
                .role(Role.LAWYER).phone("+91 98765 11111").emailVerified(true).active(true).build());

        User snehaUser = userRepository.save(User.builder()
                .name("Adv. Sneha Iyer").email("sneha@legalease.com").password(encodedPass)
                .role(Role.LAWYER).phone("+91 98765 22222").emailVerified(true).active(true).build());

        User farooqUser = userRepository.save(User.builder()
                .name("Adv. Mohammed Farooq").email("farooq@legalease.com").password(encodedPass)
                .role(Role.LAWYER).phone("+91 98765 33333").emailVerified(true).active(true).build());

        User lakshmiUser = userRepository.save(User.builder()
                .name("Adv. Lakshmi Venkat").email("lakshmi@legalease.com").password(encodedPass)
                .role(Role.LAWYER).phone("+91 98765 44444").emailVerified(true).active(true).build());

        User arjunUser = userRepository.save(User.builder()
                .name("Adv. Arjun Desai").email("arjun@legalease.com").password(encodedPass)
                .role(Role.LAWYER).phone("+91 98765 55555").emailVerified(true).active(true).build());

        // Extra citizens for case data
        User meera = userRepository.save(User.builder()
                .name("Meera Reddy").email("meera@legalease.com").password(encodedPass)
                .role(Role.CITIZEN).phone("+91 98765 66666").emailVerified(true).active(true).build());

        User suresh = userRepository.save(User.builder()
                .name("Suresh Reddy").email("suresh@legalease.com").password(encodedPass)
                .role(Role.CITIZEN).phone("+91 98765 77777").emailVerified(true).active(true).build());

        User anita = userRepository.save(User.builder()
                .name("Anita Gupta").email("anita@legalease.com").password(encodedPass)
                .role(Role.CITIZEN).phone("+91 98765 88888").emailVerified(true).active(true).build());

        // ═══════════════════════════════════════════════
        // LAWYER PROFILES (matching MOCK_LAWYERS)
        // ═══════════════════════════════════════════════
        lawyerRepository.save(Lawyer.builder()
                .user(lawyerUser).barCouncilId("KAR/2018/0456").specialization("Civil Law")
                .specializations("Civil Law, Property Law, Consumer Law").experienceYears(8)
                .rating(4.8).casesHandled(156).casesWon(128).isVerified(true)
                .bio("Senior civil litigation lawyer with 8+ years of experience in property disputes, consumer protection, and civil rights cases.")
                .location("Bengaluru, Karnataka").priceRange("₹15,000 - ₹50,000")
                .languages("English, Kannada, Hindi").available(true).build());

        lawyerRepository.save(Lawyer.builder()
                .user(karthikUser).barCouncilId("KAR/2015/0789").specialization("Criminal Law")
                .specializations("Criminal Law, Cyber Crime, Family Law").experienceYears(11)
                .rating(4.6).casesHandled(210).casesWon(168).isVerified(true)
                .bio("Experienced criminal defense attorney specializing in cyber crimes and family law disputes.")
                .location("Bengaluru, Karnataka").priceRange("₹20,000 - ₹75,000")
                .languages("English, Kannada, Malayalam").available(true).build());

        lawyerRepository.save(Lawyer.builder()
                .user(snehaUser).barCouncilId("KAR/2020/0123").specialization("Family Law")
                .specializations("Family Law, Divorce, Child Custody").experienceYears(5)
                .rating(4.9).casesHandled(89).casesWon(78).isVerified(true)
                .bio("Compassionate family law specialist with a focus on mediation and amicable settlements.")
                .location("Mysuru, Karnataka").priceRange("₹10,000 - ₹35,000")
                .languages("English, Kannada, Tamil").available(true).build());

        lawyerRepository.save(Lawyer.builder()
                .user(farooqUser).barCouncilId("KAR/2012/0345").specialization("Corporate Law")
                .specializations("Corporate Law, Labor Law, Commercial Disputes").experienceYears(14)
                .rating(4.7).casesHandled(320).casesWon(256).isVerified(true)
                .bio("Senior corporate lawyer handling complex commercial disputes and labor law matters.")
                .location("Bengaluru, Karnataka").priceRange("₹30,000 - ₹1,00,000")
                .languages("English, Kannada, Urdu, Hindi").available(false).build());

        lawyerRepository.save(Lawyer.builder()
                .user(lakshmiUser).barCouncilId("KAR/2017/0567").specialization("Property Law")
                .specializations("Property Law, Real Estate, Civil Law").experienceYears(9)
                .rating(4.5).casesHandled(178).casesWon(139).isVerified(true)
                .bio("Real estate and property law expert with deep knowledge of Karnataka land laws.")
                .location("Bengaluru, Karnataka").priceRange("₹15,000 - ₹60,000")
                .languages("English, Kannada, Telugu").available(true).build());

        lawyerRepository.save(Lawyer.builder()
                .user(arjunUser).barCouncilId("KAR/2019/0890").specialization("Criminal Law")
                .specializations("Criminal Law, Traffic Law, Bail").experienceYears(6)
                .rating(4.3).casesHandled(95).casesWon(72).isVerified(true)
                .bio("Criminal defense specialist with experience in traffic violations and bail matters.")
                .location("Hubli, Karnataka").priceRange("₹8,000 - ₹25,000")
                .languages("English, Kannada, Hindi").available(true).build());

        // ═══════════════════════════════════════════════
        // COURTS (matching MOCK_COURTS)
        // ═══════════════════════════════════════════════
        Court court1 = courtRepository.save(Court.builder()
                .name("Bengaluru City Civil Court").type("Civil")
                .address("Mayo Hall, MG Road, Bengaluru").city("Bengaluru").state("Karnataka")
                .latitude(12.9745).longitude(77.6048).jurisdiction("Bengaluru Urban")
                .phone("+91 80 2295 0000").build());

        Court court2 = courtRepository.save(Court.builder()
                .name("Labour Court, Bengaluru").type("Labour")
                .address("Sheshadri Road, Bengaluru").city("Bengaluru").state("Karnataka")
                .latitude(12.9850).longitude(77.5898).jurisdiction("Bengaluru Urban")
                .phone("+91 80 2286 0000").build());

        Court court3 = courtRepository.save(Court.builder()
                .name("Family Court, Bengaluru").type("Family")
                .address("Cubbon Park Area, Bengaluru").city("Bengaluru").state("Karnataka")
                .latitude(12.9780).longitude(77.5920).jurisdiction("Bengaluru Urban")
                .phone("+91 80 2294 0000").build());

        Court court4 = courtRepository.save(Court.builder()
                .name("Consumer Disputes Redressal Forum").type("Consumer")
                .address("Kempegowda Road, Bengaluru").city("Bengaluru").state("Karnataka")
                .latitude(12.9830).longitude(77.5740).jurisdiction("Karnataka State")
                .phone("+91 80 2287 0000").build());

        courtRepository.save(Court.builder()
                .name("High Court of Karnataka").type("High Court")
                .address("Raj Bhavan Road, Bengaluru").city("Bengaluru").state("Karnataka")
                .latitude(12.9785).longitude(77.5910).jurisdiction("Karnataka State")
                .phone("+91 80 2295 2000").build());

        // ═══════════════════════════════════════════════
        // CASES (matching MOCK_CASES)
        // ═══════════════════════════════════════════════
        LegalCase case1 = caseRepository.save(LegalCase.builder()
                .caseNumber("CASE-2026-CIV-000001").title("Property Boundary Dispute - Rajesh vs. Vikram")
                .description("Dispute over property boundary lines between adjacent landowners in Bengaluru. The petitioner claims the respondent has encroached upon 200 sq ft of their registered property.")
                .category(CaseCategory.PROPERTY).status(CaseStatus.HEARING_SCHEDULED)
                .petitioner(citizen).respondent(respondent).respondentName("Vikram Patel")
                .petitionerLawyer(lawyerUser).judge(judge).court(court1)
                .filingDate(LocalDate.of(2026, 5, 15)).priority(CasePriority.MEDIUM).build());

        LegalCase case2 = caseRepository.save(LegalCase.builder()
                .caseNumber("CASE-2026-LAB-000002").title("Unpaid Salary Claim - Rajesh vs. TechCorp Solutions")
                .description("The employer has failed to pay 3 months of salary and denied all severance benefits. Total outstanding amount: ₹4,50,000.")
                .category(CaseCategory.LABOR).status(CaseStatus.UNDER_REVIEW)
                .petitioner(citizen).respondentName("TechCorp Solutions Pvt. Ltd.")
                .court(court2).filingDate(LocalDate.of(2026, 6, 1)).priority(CasePriority.HIGH).build());

        LegalCase case3 = caseRepository.save(LegalCase.builder()
                .caseNumber("CASE-2026-FAM-000003").title("Custody Dispute - Meera vs. Suresh Reddy")
                .description("Dispute over custody of minor child following divorce proceedings. Petitioner seeks sole custody.")
                .category(CaseCategory.FAMILY).status(CaseStatus.EVIDENCE_REVIEW)
                .petitioner(meera).respondent(suresh).respondentName("Suresh Reddy")
                .petitionerLawyer(lawyerUser).respondentLawyer(karthikUser).judge(judge).court(court3)
                .filingDate(LocalDate.of(2026, 4, 10)).priority(CasePriority.HIGH).build());

        LegalCase case4 = caseRepository.save(LegalCase.builder()
                .caseNumber("CASE-2026-CRM-000004").title("Online Fraud Case - Govt. vs. Unknown")
                .description("Cyber crime complaint involving online banking fraud resulting in loss of ₹2,50,000.")
                .category(CaseCategory.CYBERCRIME).status(CaseStatus.UNDER_VERIFICATION)
                .petitioner(citizen).respondentName("Unknown Accused")
                .filingDate(LocalDate.of(2026, 6, 8)).priority(CasePriority.URGENT).build());

        LegalCase case5 = caseRepository.save(LegalCase.builder()
                .caseNumber("CASE-2025-CON-000005").title("Defective Product Complaint - Anita vs. ElectroMart")
                .description("Consumer complaint regarding defective washing machine sold without warranty honor.")
                .category(CaseCategory.CONSUMER).status(CaseStatus.CLOSED)
                .petitioner(anita).respondentName("ElectroMart India Ltd.")
                .petitionerLawyer(lawyerUser).judge(judge).court(court4)
                .filingDate(LocalDate.of(2025, 11, 20)).priority(CasePriority.LOW).build());

        // ═══════════════════════════════════════════════
        // CASE TIMELINES
        // ═══════════════════════════════════════════════
        seedTimeline(case1, List.of(
                new String[]{"Case Filed", "2026-05-15", "completed", "Case registered online"},
                new String[]{"Documents Verified", "2026-05-18", "completed", "All documents verified by admin"},
                new String[]{"Respondent Notified", "2026-05-20", "completed", "Vikram Patel notified via email & SMS"},
                new String[]{"Lawyer Assigned", "2026-05-22", "completed", "Adv. Priya Sharma accepted the case"},
                new String[]{"Hearing Scheduled", "2026-06-15", "current", "First hearing at City Civil Court, Room 3"},
                new String[]{"Judgment Pending", null, "pending", ""}
        ));

        seedTimeline(case2, List.of(
                new String[]{"Case Filed", "2026-06-01", "completed", "Case registered online"},
                new String[]{"Documents Verified", "2026-06-03", "completed", "Salary slips and contract verified"},
                new String[]{"Under Review", "2026-06-05", "current", "Case under administrative review"},
                new String[]{"Respondent Notification", null, "pending", ""},
                new String[]{"Hearing Date", null, "pending", ""},
                new String[]{"Resolution", null, "pending", ""}
        ));

        seedTimeline(case3, List.of(
                new String[]{"Case Filed", "2026-04-10", "completed", "Custody petition filed"},
                new String[]{"Documents Verified", "2026-04-14", "completed", "Marriage and birth certificates verified"},
                new String[]{"Both Parties Notified", "2026-04-16", "completed", "Both parties served notice"},
                new String[]{"Lawyers Assigned", "2026-04-20", "completed", "Both parties have legal representation"},
                new String[]{"Evidence Review", "2026-05-01", "current", "Court reviewing submitted evidence"},
                new String[]{"Judgment Pending", null, "pending", ""}
        ));

        seedTimeline(case4, List.of(
                new String[]{"Case Filed", "2026-06-08", "completed", "Cyber crime complaint registered"},
                new String[]{"Document Verification", "2026-06-09", "current", "Bank statements under verification"},
                new String[]{"Investigation", null, "pending", ""},
                new String[]{"Hearing", null, "pending", ""}
        ));

        seedTimeline(case5, List.of(
                new String[]{"Case Filed", "2025-11-20", "completed", "Consumer complaint registered"},
                new String[]{"Documents Verified", "2025-11-25", "completed", "Purchase receipts verified"},
                new String[]{"Hearing", "2025-12-15", "completed", "Arguments heard from both sides"},
                new String[]{"Judgment", "2026-01-10", "completed", "Ordered full refund + ₹10,000 compensation"}
        ));

        // ═══════════════════════════════════════════════
        // HEARINGS (matching MOCK_HEARINGS)
        // ═══════════════════════════════════════════════
        hearingRepository.save(Hearing.builder()
                .legalCase(case1).judge(judge)
                .hearingDate(LocalDateTime.of(2026, 6, 15, 10, 30))
                .location("Room 3, City Civil Court")
                .remarks("First hearing - both parties to present initial arguments")
                .status(HearingStatus.SCHEDULED).build());

        hearingRepository.save(Hearing.builder()
                .legalCase(case3).judge(judge)
                .hearingDate(LocalDateTime.of(2026, 6, 18, 14, 0))
                .location("Room 5, Family Court")
                .remarks("Evidence review hearing - both sides to present supporting documents")
                .status(HearingStatus.SCHEDULED).build());

        hearingRepository.save(Hearing.builder()
                .legalCase(case1).judge(judge)
                .hearingDate(LocalDateTime.of(2026, 5, 28, 11, 0))
                .location("Room 3, City Civil Court")
                .remarks("Preliminary hearing completed. Both parties instructed to submit property documents.")
                .nextHearingDate(LocalDate.of(2026, 6, 15))
                .orders("Both parties to submit surveyed property maps within 2 weeks.")
                .status(HearingStatus.COMPLETED).build());

        // ═══════════════════════════════════════════════
        // NOTIFICATIONS (matching MOCK_NOTIFICATIONS)
        // ═══════════════════════════════════════════════
        notificationRepository.save(Notification.builder()
                .user(citizen).title("Hearing Scheduled").type(NotificationType.HEARING)
                .message("Your hearing for CASE-2026-CIV-000001 is scheduled for June 15, 2026 at 10:30 AM.")
                .isRead(false).relatedCase(case1).build());

        notificationRepository.save(Notification.builder()
                .user(citizen).title("Document Verified").type(NotificationType.DOCUMENT)
                .message("Your property deed for CASE-2026-CIV-000001 has been verified by the admin.")
                .isRead(false).relatedCase(case1).build());

        notificationRepository.save(Notification.builder()
                .user(citizen).title("Lawyer Accepted").type(NotificationType.LAWYER)
                .message("Adv. Priya Sharma has accepted your case request for CASE-2026-CIV-000001.")
                .isRead(true).relatedCase(case1).build());

        notificationRepository.save(Notification.builder()
                .user(citizen).title("Case Filed Successfully").type(NotificationType.CASE)
                .message("Your case CASE-2026-LAB-000002 has been filed successfully and is under verification.")
                .isRead(true).relatedCase(case2).build());

        notificationRepository.save(Notification.builder()
                .user(lawyerUser).title("New Case Request").type(NotificationType.CASE)
                .message("You have received a new case request from Rajesh Kumar for a property dispute.")
                .isRead(false).relatedCase(case1).build());

        // ═══════════════════════════════════════════════
        // MESSAGES (matching MOCK_MESSAGES)
        // ═══════════════════════════════════════════════
        messageRepository.save(Message.builder()
                .sender(citizen).receiver(lawyerUser).legalCase(case1)
                .content("Hello Adv. Sharma, I have gathered the additional property documents you requested.")
                .isRead(true).build());

        messageRepository.save(Message.builder()
                .sender(lawyerUser).receiver(citizen).legalCase(case1)
                .content("Great, please upload them to the case workspace. I will review them before the hearing on June 15.")
                .isRead(true).build());

        messageRepository.save(Message.builder()
                .sender(citizen).receiver(lawyerUser).legalCase(case1)
                .content("Uploaded. Also, I found an old survey map from 2018 that clearly shows the original boundary. Should I include that as well?")
                .isRead(true).build());

        messageRepository.save(Message.builder()
                .sender(lawyerUser).receiver(citizen).legalCase(case1)
                .content("Absolutely! That would be excellent evidence. Please upload it under the \"Evidence\" category. The older the survey map, the stronger our case.")
                .isRead(false).build());

        // ═══════════════════════════════════════════════
        // DOCUMENTS (matching MOCK_DOCUMENTS)
        // ═══════════════════════════════════════════════
        documentRepository.save(Document.builder()
                .legalCase(case1).uploadedBy(citizen).fileName("Property_Deed.pdf")
                .fileType("pdf").fileSize("2.4 MB").filePath("uploads/case-1/property_deed.pdf")
                .category(DocumentCategory.EVIDENCE).verificationStatus(VerificationStatus.VERIFIED).version(1).build());

        documentRepository.save(Document.builder()
                .legalCase(case1).uploadedBy(citizen).fileName("Survey_Map_2018.pdf")
                .fileType("pdf").fileSize("5.1 MB").filePath("uploads/case-1/survey_map.pdf")
                .category(DocumentCategory.EVIDENCE).verificationStatus(VerificationStatus.VERIFIED).version(1).build());

        documentRepository.save(Document.builder()
                .legalCase(case1).uploadedBy(lawyerUser).fileName("Legal_Notice_Draft.pdf")
                .fileType("pdf").fileSize("1.2 MB").filePath("uploads/case-1/legal_notice.pdf")
                .category(DocumentCategory.LEGAL_NOTICE).verificationStatus(VerificationStatus.VERIFIED).version(2).build());

        documentRepository.save(Document.builder()
                .legalCase(case2).uploadedBy(citizen).fileName("Salary_Slips_Jan-Mar.pdf")
                .fileType("pdf").fileSize("3.8 MB").filePath("uploads/case-2/salary_slips.pdf")
                .category(DocumentCategory.EVIDENCE).verificationStatus(VerificationStatus.VERIFIED).version(1).build());

        documentRepository.save(Document.builder()
                .legalCase(case2).uploadedBy(citizen).fileName("Employment_Contract.pdf")
                .fileType("pdf").fileSize("1.6 MB").filePath("uploads/case-2/employment_contract.pdf")
                .category(DocumentCategory.EVIDENCE).verificationStatus(VerificationStatus.PENDING).version(1).build());

        documentRepository.save(Document.builder()
                .legalCase(case1).uploadedBy(citizen).fileName("Boundary_Photos.zip")
                .fileType("image").fileSize("12.5 MB").filePath("uploads/case-1/boundary_photos.zip")
                .category(DocumentCategory.EVIDENCE).verificationStatus(VerificationStatus.VERIFIED).version(1).build());

        log.info("Database seeded successfully with {} users, {} lawyers, {} courts, {} cases",
                userRepository.count(), lawyerRepository.count(), courtRepository.count(), caseRepository.count());
    }

    private void seedTimeline(LegalCase legalCase, List<String[]> entries) {
        for (int i = 0; i < entries.size(); i++) {
            String[] e = entries.get(i);
            timelineRepository.save(CaseTimeline.builder()
                    .legalCase(legalCase).step(e[0]).date(e[1]).status(e[2]).description(e[3])
                    .sortOrder(i + 1).build());
        }
    }
}
