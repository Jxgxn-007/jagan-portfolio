import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
import fitz  # PyMuPDF

os.makedirs('assets', exist_ok=True)
pdf_path = 'assets/Jagan_M_Resume.pdf'

# Target 1-page Letter layout with 36pt (0.5 in) margins
doc = SimpleDocTemplate(
    pdf_path,
    pagesize=letter,
    leftMargin=36,
    rightMargin=36,
    topMargin=32,
    bottomMargin=32
)

styles = getSampleStyleSheet()

# Custom ATS-friendly styles
name_style = ParagraphStyle(
    'NameStyle',
    fontName='Helvetica-Bold',
    fontSize=20,
    leading=23,
    textColor=colors.HexColor('#0f172a'),
    alignment=1 # Center
)

title_style = ParagraphStyle(
    'TitleStyle',
    fontName='Helvetica-Bold',
    fontSize=10.5,
    leading=13,
    textColor=colors.HexColor('#0284c7'), # Deep cyan
    alignment=1
)

contact_style = ParagraphStyle(
    'ContactStyle',
    fontName='Helvetica',
    fontSize=9,
    leading=12,
    textColor=colors.HexColor('#334155'),
    alignment=1
)

section_heading_style = ParagraphStyle(
    'SectionHeading',
    fontName='Helvetica-Bold',
    fontSize=10.5,
    leading=13,
    textColor=colors.HexColor('#0f172a'),
    spaceAfter=2,
    textTransform='uppercase'
)

item_title_style = ParagraphStyle(
    'ItemTitle',
    fontName='Helvetica-Bold',
    fontSize=9.5,
    leading=12,
    textColor=colors.HexColor('#0f172a')
)

item_sub_style = ParagraphStyle(
    'ItemSub',
    fontName='Helvetica',
    fontSize=8.5,
    leading=11,
    textColor=colors.HexColor('#475569')
)

body_bullet_style = ParagraphStyle(
    'BodyBullet',
    fontName='Helvetica',
    fontSize=8.5,
    leading=11,
    textColor=colors.HexColor('#1e293b'),
    leftIndent=12,
    firstLineIndent=-8,
    spaceAfter=2
)

skill_category_style = ParagraphStyle(
    'SkillCat',
    fontName='Helvetica-Bold',
    fontSize=8.5,
    leading=11.5,
    textColor=colors.HexColor('#0f172a')
)

skill_val_style = ParagraphStyle(
    'SkillVal',
    fontName='Helvetica',
    fontSize=8.5,
    leading=11.5,
    textColor=colors.HexColor('#334155')
)

story = []

# --- HEADER ---
story.append(Paragraph("JAGAN M", name_style))
story.append(Spacer(1, 2))
story.append(Paragraph("Full-Stack Developer &amp; Cybersecurity Enthusiast", title_style))
story.append(Spacer(1, 3))

contact_line = (
    'Email: <a href="mailto:mjagan20070314@gmail.com" color="#0284c7"><u>mjagan20070314@gmail.com</u></a> &nbsp;|&nbsp; '
    'GitHub: <a href="https://github.com/Jxgxn-007" color="#0284c7"><u>github.com/Jxgxn-007</u></a> &nbsp;|&nbsp; '
    'LinkedIn: <a href="https://www.linkedin.com/in/jagan-m-a3a786410/" color="#0284c7"><u>linkedin.com/in/jagan-m-a3a786410</u></a>'
)
story.append(Paragraph(contact_line, contact_style))
story.append(Spacer(1, 6))

def add_section_header(title):
    story.append(Paragraph(title, section_heading_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#cbd5e1'), spaceBefore=1, spaceAfter=4))

# --- EDUCATION ---
add_section_header("Education")
edu_data = [
    [
        Paragraph("<b>B.Tech in Information Technology</b>", item_title_style),
        Paragraph("<font color='#475569'>Expected <b>2028</b></font>", ParagraphStyle('RAlign', parent=item_sub_style, alignment=2))
    ],
    [
        Paragraph("Mepco Schlenk Engineering College", item_sub_style),
        Paragraph("<font color='#64748b'>Tamil Nadu, India</font>", ParagraphStyle('RAlign2', parent=item_sub_style, alignment=2))
    ]
]
edu_table = Table(edu_data, colWidths=[380, 160])
edu_table.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('BOTTOMPADDING', (0,0), (-1,-1), 0),
    ('TOPPADDING', (0,0), (-1,-1), 0),
    ('LEFTPADDING', (0,0), (-1,-1), 0),
    ('RIGHTPADDING', (0,0), (-1,-1), 0),
]))
story.append(edu_table)
story.append(Spacer(1, 5))

# --- TECHNICAL SKILLS ---
add_section_header("Technical Skills")
skills_data = [
    [Paragraph("Programming Languages:", skill_category_style), Paragraph("C, C++, Python, Java", skill_val_style)],
    [Paragraph("Web Development:", skill_category_style), Paragraph("HTML5, CSS3, React, JavaScript", skill_val_style)],
    [Paragraph("Areas of Interest:", skill_category_style), Paragraph("Full-Stack Development, Cybersecurity &amp; Network Forensics", skill_val_style)],
    [Paragraph("Developer Tools:", skill_category_style), Paragraph("Git, GitHub, VS Code, Wireshark, Pcap4J", skill_val_style)],
]
skills_table = Table(skills_data, colWidths=[130, 410])
skills_table.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('BOTTOMPADDING', (0,0), (-1,-1), 1),
    ('TOPPADDING', (0,0), (-1,-1), 1),
    ('LEFTPADDING', (0,0), (-1,-1), 0),
    ('RIGHTPADDING', (0,0), (-1,-1), 0),
]))
story.append(skills_table)
story.append(Spacer(1, 5))

# --- FEATURED PROJECTS ---
add_section_header("Featured Technical Projects")

# Project 1: Enhanced SPIN-IDS
proj1_header = [
    [
        Paragraph("<b>Enhanced SPIN-IDS</b> - Wireshark-Integrated Real-Time Network Intrusion Detection System", item_title_style),
        Paragraph('<a href="https://github.com/Jxgxn-007/Enhanced-SPIN-IDS-Wireshark-Integrated-Real-Time-Network-Intrusion-Detection-System" color="#0284c7"><u>GitHub Repo</u></a>', ParagraphStyle('PR1', parent=item_sub_style, alignment=2))
    ]
]
t1 = Table(proj1_header, colWidths=[450, 90])
t1.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('PADDING', (0,0), (-1,-1), 0)]))
story.append(t1)
story.append(Paragraph("<font color='#64748b'><b>Technologies:</b> Java, Pcap4J, Wireshark, Flow-Based Traffic Analysis, 2D-CNN, Packet Image Representation</font>", item_sub_style))
story.append(Paragraph("- Engineered a Java-based network intrusion detection system utilizing Pcap4J for live network packet capture and flow extraction.", body_bullet_style))
story.append(Paragraph("- Implemented flow-based network traffic inspection by mapping packet payloads into 2D RGB matrix representations for deep feature extraction.", body_bullet_style))
story.append(Paragraph("- Applied CNN-based classification pipelines to identify malicious traffic windows and output explainable network security alerts.", body_bullet_style))
story.append(Spacer(1, 4))

# Project 2: SecureMailScope
proj2_header = [
    [
        Paragraph("<b>SecureMailScope</b> - Passive Email Network Traffic Analysis &amp; Forensic Inspection Platform", item_title_style),
        Paragraph('<a href="https://github.com/Jxgxn-007/SecureMailScope" color="#0284c7"><u>GitHub Repo</u></a>', ParagraphStyle('PR2', parent=item_sub_style, alignment=2))
    ]
]
t2 = Table(proj2_header, colWidths=[450, 90])
t2.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('PADDING', (0,0), (-1,-1), 0)]))
story.append(t2)
story.append(Paragraph("<font color='#64748b'><b>Technologies:</b> Python, PCAP / PCAPNG Analysis, TCP Reassembly, SMTP / IMAP / POP3, TLS/SSL Verification</font>", item_sub_style))
story.append(Paragraph("- Developed a passive network traffic forensic tool that reassembles TCP sessions from PCAP captures to inspect mail protocol states.", body_bullet_style))
story.append(Paragraph("- Parsed STARTTLS handshakes, TLS record layers, and X.509 certificate chains to detect expired, self-signed, or weak cryptographic suites.", body_bullet_style))
story.append(Paragraph("- Integrated layered evaluation combining deterministic rules and anomaly indicators to evaluate communication security posture.", body_bullet_style))
story.append(Spacer(1, 4))

# Project 3: Axis Cyber Labs
proj3_header = [
    [
        Paragraph("<b>Axis Cyber Labs</b> - Cybersecurity &amp; DevOps Educational Platform", item_title_style),
        Paragraph('<a href="https://axiscyberlab-nine.vercel.app" color="#0284c7"><u>Live Platform</u></a> &nbsp;|&nbsp; <a href="https://github.com/Jxgxn-007/axiscyberlab" color="#0284c7"><u>GitHub</u></a>', ParagraphStyle('PR3', parent=item_sub_style, alignment=2))
    ]
]
t3 = Table(proj3_header, colWidths=[430, 110])
t3.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('PADDING', (0,0), (-1,-1), 0)]))
story.append(t3)
story.append(Paragraph("<font color='#64748b'><b>Technologies:</b> React, Vite, JavaScript, Modern CSS, Responsive Web Design</font>", item_sub_style))
story.append(Paragraph("- Built a responsive web application frontend for cybersecurity and DevOps learning modules using React and Vite tooling.", body_bullet_style))
story.append(Paragraph("- Structured modular, high-performance UI components with fast navigation; platform functionality currently in active development.", body_bullet_style))
story.append(Spacer(1, 4))

# Project 4: Intellicrowd
proj4_header = [
    [
        Paragraph("<b>Intellicrowd</b> - AI-Based Crowd Management System", item_title_style),
        Paragraph("<font color='#64748b'>Academic Project</font>", ParagraphStyle('PR4', parent=item_sub_style, alignment=2))
    ]
]
t4 = Table(proj4_header, colWidths=[450, 90])
t4.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('PADDING', (0,0), (-1,-1), 0)]))
story.append(t4)
story.append(Paragraph("<font color='#64748b'><b>Technologies:</b> YOLO, Java, HTML5, CSS3, JavaScript</font>", item_sub_style))
story.append(Paragraph("- Designed a computer-vision crowd management architecture to detect pedestrian volume and monitor spatial crowd density.", body_bullet_style))
story.append(Paragraph("- Formulated density tracking principles to assist in identifying high-density conditions and supporting crowd safety operations.", body_bullet_style))
story.append(Spacer(1, 5))

# --- EXPERIENCE ---
add_section_header("Experience")
exp_header = [
    [
        Paragraph("<b>Cybersecurity Internship</b>", item_title_style),
        Paragraph("<font color='#475569'>Practical Training</font>", ParagraphStyle('ER', parent=item_sub_style, alignment=2))
    ]
]
te = Table(exp_header, colWidths=[450, 90])
te.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('PADDING', (0,0), (-1,-1), 0)]))
story.append(te)
story.append(Paragraph("- Participated in structured cybersecurity domain training, focusing on practical network analysis concepts and defensive workflows.", body_bullet_style))

doc.build(story)

# Verify page count
doc_check = fitz.open(pdf_path)
print(f"Generated PDF at {pdf_path}")
print(f"Page Count: {len(doc_check)}")
for i, page in enumerate(doc_check):
    text = page.get_text()
    print(f"Page {i+1} text length: {len(text)} chars")
