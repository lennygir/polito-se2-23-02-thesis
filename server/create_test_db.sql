-- TO RUN THIS SCRIPT:
-- sqlite3 theses_management.db < create_db.sql

DROP TABLE IF EXISTS VIRTUAL_CLOCK;
DROP TABLE IF EXISTS START_REQUESTS;
DROP TABLE IF EXISTS NOTIFICATIONS;
DROP TABLE IF EXISTS APPLICATIONS;
DROP TABLE IF EXISTS CAREER;
DROP TABLE IF EXISTS STUDENT;
DROP TABLE IF EXISTS PROPOSALS;
DROP TABLE IF EXISTS DEGREE;
DROP TABLE IF EXISTS TEACHER;
DROP TABLE IF EXISTS GROUPS;
DROP TABLE IF EXISTS DEPARTMENTS;

CREATE TABLE IF NOT EXISTS DEGREE ( 
  cod_degree TEXT PRIMARY KEY,
  title_degree TEXT
);

CREATE TABLE IF NOT EXISTS DEPARTMENTS (
  cod_department TEXT PRIMARY KEY,
  name_department TEXT 
);

CREATE TABLE IF NOT EXISTS GROUPS ( 
  cod_group TEXT PRIMARY KEY,
  name_group TEXT,
  cod_department TEXT,
  FOREIGN KEY (cod_department) REFERENCES DEPARTMENTS (cod_department)
);

CREATE TABLE IF NOT EXISTS STUDENT (  
  id TEXT PRIMARY KEY, 
  surname TEXT,
  name TEXT,
  gender TEXT,
  nationality TEXT,
  email TEXT NOT NULL UNIQUE,
  cod_degree TEXT, 
  enrollment_year YEAR,
  FOREIGN KEY (cod_degree) REFERENCES DEGREE(cod_degree)
);

CREATE TABLE IF NOT EXISTS CAREER ( 
  id TEXT,
  cod_course TEXT,
  title_course TEXT,
  cfu INTEGER,
  grade INTEGER,
  date DATE,
  PRIMARY KEY (id, cod_course),
  FOREIGN KEY (id) REFERENCES STUDENT (id)
);

CREATE TABLE IF NOT EXISTS TEACHER (
  id TEXT PRIMARY KEY, 
  surname TEXT,
  name TEXT,
  email TEXT NOT NULL UNIQUE,
  cod_group TEXT, 
  cod_department TEXT, 
  FOREIGN KEY (cod_group) REFERENCES GROUPS (cod_group),
  FOREIGN KEY (cod_department) REFERENCES DEPARTMENTS (cod_department)
);

CREATE TABLE IF NOT EXISTS PROPOSALS (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  supervisor TEXT,
  co_supervisors TEXT,
  keywords TEXT,
  type TEXT,
  groups TEXT,
  description TEXT,
  required_knowledge TEXT,
  notes TEXT,
  expiration_date DATE,
  level TEXT,
  cds TEXT,
  manually_archived INTEGER DEFAULT 0, -- 0 false, 1 true
  FOREIGN KEY (supervisor) REFERENCES TEACHER (id),
  FOREIGN KEY (cds) REFERENCES DEGREE (cod_degree)
);

CREATE TABLE IF NOT EXISTS APPLICATIONS (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  proposal_id INTEGER,
  student_id TEXT,
  state TEXT,
  attached_file BLOB,
  FOREIGN KEY (proposal_id) REFERENCES PROPOSALS (id) ON DELETE SET NULL,
  FOREIGN KEY (student_id) REFERENCES STUDENT (id)
);

CREATE TABLE "NOTIFICATIONS" (
	"id"	INTEGER PRIMARY KEY AUTOINCREMENT,
	"date"	TEXT NOT NULL DEFAULT (DATETIME('now')),
	"object"	TEXT NOT NULL,
	"content"	TEXT NOT NULL,
	"student_id"	TEXT,
	"teacher_id"	TEXT,
	FOREIGN KEY("student_id") REFERENCES "STUDENT"("id"),
  FOREIGN KEY("teacher_id") REFERENCES "TEACHER"("id"),
  CONSTRAINT ck_student_teacher CHECK ((student_id IS NOT NULL AND teacher_id IS NULL) OR (student_id IS NULL AND teacher_id IS NOT NULL))
);

CREATE TABLE IF NOT EXISTS VIRTUAL_CLOCK (
	id INTEGER PRIMARY KEY,
  delta	INTEGER
);

INSERT INTO VIRTUAL_CLOCK (id, delta)
VALUES (1, 0);

CREATE TABLE START_REQUESTS (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  supervisor TEXT NOT NULL,
  co_supervisors TEXT,
  approval_date DATETIME,
  student_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'requested',
  FOREIGN KEY (supervisor) REFERENCES TEACHER (id),
  FOREIGN KEY (student_id) REFERENCES STUDENT (id)
);

INSERT INTO DEGREE (cod_degree, title_degree)
VALUES  ('L-4-A', 'Design and Communication'),
        ('L-7-A', 'Civil and Environmental Engineering'),
        ('L-7-B', 'Civil Engineering'),
        ('L-7-C', 'Environmental and Land Engineering'),
        ('L-8-A', 'Electronic and Communications Engineering'),
        ('L-8-B', 'Cinema and Media Engineering'),
        ('L-8-C', 'Electronic Engineering'),
        ('L-8-D', 'Physical Engineering'),
        ('L-8-E', 'Engineering and Management'),
        ('L-8-F', 'Computer Engineering'),
        ('L-9-A', 'Aerospace Engineering'),
        ('L-9-B', 'Biomedical Engineering'),
        ('L-9-C', 'Chemical and Food Engineering'),
        ('L-9-D', 'Materials Engineering'),
        ('L-9-E', 'Automotive Engineering'),
        ('L-9-F', 'Industrial Production Engineering'),
        ('L-9-G', 'Electrical Engineering'),
        ('L-9-H', 'Energy Engineering'),
        ('L-9-I', 'Engineering and Management'),
        ('L-9-J', 'Mechanical Engineering'),
        ('L-17-A', 'Architecture'),
        ('L-21-A', 'Territorial, Urban, Environmental and Landscape Planning'),
        ('L-23-A', 'Building Engineering'),
        ('L-35-A', 'Mathematics for Engineering'),
        ('L-P03', 'Industrial Manufacturing Technologies'),
        ('LM-3-A', 'Landscape Architecture'),
        ('LM-4-A', 'Architecture Construction City'),
        ('LM-4-B', 'Architecture for Heritage'),
        ('LM-4-C', 'Architecture for Sustainability'),
        ('LM-12-A', 'Systemic Design'),
        ('LM-20-A', 'Aerospace Engineering'),
        ('LM-21-A', 'Biomedical Engineering'),
        ('LM-22-A', 'Chemical and Sustainable Processes Engineering'),
        ('LM-23-A', 'Civil Engineering'),
        ('LM-24-A', 'Building Engineering'),
        ('LM-25-A', 'Mechatronic Engineering'),
        ('LM-26-A', 'Agritech Engineering'),
        ('LM-27-A', 'Communications Engineering'),
        ('LM-27-B', 'ICT for Smart Societies'),
        ('LM-28-A', 'Electrical Engineering'),
        ('LM-29-A', 'Electronic Engineering'),
        ('LM-29-B', 'Nanotechnologies for ICTs'),
        ('LM-29-C', 'Quantum Engineering'),
        ('LM-30-A', 'Energy and Nuclear Engineering'),
        ('LM-31-A', 'Engineering and Management'),
        ('LM-32-A', 'Cybersecurity'),
        ('LM-32-B', 'Data Science and Engineering'),
        ('LM-32-C', 'Cinema and Media Engineering'),
        ('LM-32-D', 'Computer Engineering'),
        ('LM-33-A', 'Automotive Engineering'),
        ('LM-33-B', 'Mechanical Engineering'),
        ('LM-35-A', 'Georesources and Geoenergy Engineering'),
        ('LM-35-B', 'Environmental and Land Engineering'),
        ('LM-44-A', 'Mathematical Engineering'),
        ('LM-44-B', 'Physics of Complex Systems'),
        ('LM-48-A', 'Urban and Regional Planning'),
        ('LM-53-A', 'Materials Engineering for Industry 4.0'),
        ('LM-91-A', 'Digital Skills for Sustainable Societal Transitions');


INSERT INTO DEPARTMENTS (cod_department, name_department)
VALUES  ('DAUIN', 'Departments of Control and Computer Engineering'),
        ('DENERG', 'Departments of Energetical Engineering'),
        ('DISERG', 'Departments of Civil Engineering'),
        ('DISMA', 'Department Of Mathematical Sciences'),
        ('DISAT', 'Department Of Applied Science And Technology'),
        ('DIMEAS', 'Department Of Mechanical And Aerospace Engineering'),
        ('DIGEP', 'Department Of Management And Production Engineering'),
        ('DIATI', 'Department Of Environmental, Land And Infrastructure'),
        ('DISEG', 'Department Of Structural, Construction And Geotechnical'),
        ('DITAG', 'Department Of Land, Environment, Agriculture And Forestry'),
        ('DET', 'Department Of Electronics And Telecommunications'),
        ('DAD', 'Department Of Architecture And Design');

INSERT INTO GROUPS (cod_group, name_group, cod_department)
VALUES  ('NETGROUP', 'Computer networks group', 'DAUIN'),
        ('DBDM', 'Database and data mining group', 'DAUIN'),
        ('CAD', 'Electronic cad & reliability group', 'DAUIN'),
        ('EDA', 'Electronic design automation', 'DAUIN'),
        ('GRAINS', 'Graphics and intelligent systems', 'DAUIN'),
        ('ELITE', 'Intelligent and interactive systems', 'DAUIN'),
        ('IMG', 'Internet media group', 'DAUIN'),
        ('FM', 'Metodi formali', 'DAUIN'),
        ('SOFTENG', 'Software engineering group', 'DAUIN'),
        ('SRG', 'Speech recognition group', 'DAUIN'),
        ('SYSBIO', 'System biology group', 'DAUIN'),
        ('SIC', 'System identification & control', 'DAUIN'),
        ('NEXA', 'Nexa center for internet & society', 'DAUIN'),
        ('TORSEC', 'Security Group', 'DAUIN'),
        ('CMPCS', 'Condensed Matter Physics and Complex Systems', 'DISAT'),
        ('FUNDIT', 'Physics of Fundamental Interactions', 'DISAT'),
        ('SMAC', 'Supercritical fluid and Materials Chemistry', 'DISAT'),
        ('ASTRA', 'Additive manufacturing for Systems and Structures in Aerospace', 'DIMEAS'),
        ('ASTRADORS', 'Astrodynamics and Advanced Orbital Systems', 'DIMEAS'),
        ('AESDO', 'Aircraft and Engine Structural Design and Optimization', 'DIMEAS'),
        ('EMC', 'Microelectronics Electromagnetic Compatibility', 'DET'),
        ('LIM', 'Mechatronics Group', 'DET'),
        ('NEURONICS', 'Artificial Neural Networks', 'DET'),
        ('CADEMA', 'Computer Aided Design of ElectroMagnetic Apparatuses', 'DENERG'),
        ('MAHTEP', 'Modeling of Advanced Heat Transfer and Energy Problems', 'DENERG'),
        ('E3', ' Engines, Energy and Environment', 'DENERG');

INSERT INTO STUDENT (id, surname, name, gender, nationality, email, cod_degree, enrollment_year)
VALUES  ('s319823', 'Tortore', 'Luca', 'Male', 'Italy', 's319823@studenti.polito.it', 'LM-32-D', 2023),
        ('s308747', 'Valeriano', 'Carlos', 'Male', 'Italy', 's308747@studenti.polito.it', 'LM-32-D', 2022),
        ('s309618', 'Bertetto', 'Lorenzo', 'Male', 'Italy', 's309618@studenti.polito.it', 'LM-32-D', 2022),
        ('s317743', 'Baracco', 'Francesco', 'Male', 'Italy', 's317743@studenti.polito.it', 'LM-32-D', 2022),
        ('s321503', 'Girardot', 'Lenny', 'Male', 'France', 's321503@studenti.polito.it', 'LM-32-D', 2023),
        ('s308920', 'Ghorbani', 'Ghazal', 'Female', 'Iran', 's308920@studenti.polito.it', 'LM-32-D', 2023),
        ('s318765', 'Rossi', 'Giulia', 'Female', 'Italy', 's318765@studenti.polito.it', 'LM-32-D', 2023),
        ('s315432', 'Wang', 'Yong', 'Male', 'China', 's315432@studenti.polito.it', 'LM-29-A', 2023),
        ('s320987', 'Lee', 'Ji-Soo', 'Female', 'South Korea', 's320987@studenti.polito.it', 'LM-33-B', 2023),
        ('s310234', 'Dubois', 'Pierre', 'Male', 'France', 's310234@studenti.polito.it', 'LM-32-C', 2022),
        ('s319876', 'Gupta', 'Amit', 'Male', 'India', 's319876@studenti.polito.it', 'LM-29-C', 2023),
        ('s317654', 'Abebe', 'Eleni', 'Female', 'Ethiopia', 's317654@studenti.polito.it', 'LM-30-A', 2022),
        ('s308543', 'Kovacs', 'Andras', 'Male', 'Hungary', 's308543@studenti.polito.it', 'LM-33-A', 2022),
        ('s314789', 'Martinez', 'Carlos', 'Male', 'Spain', 's314789@studenti.polito.it', 'LM-21-A', 2022),
        ('s321345', 'Kim', 'Sung-Min', 'Male', 'South Korea', 's321345@studenti.polito.it', 'LM-28-A', 2023),
        ('s316789', 'Nakamura', 'Yuki', 'Female', 'Japan', 's316789@studenti.polito.it', 'LM-33-B', 2023),
        ('s309876', 'Gomez', 'Ana', 'Female', 'Spain', 's309876@studenti.polito.it', 'LM-32-D', 2022),
        ('s318234', 'Mancini', 'Giovanni', 'Male', 'Italy', 's318234@studenti.polito.it', 'LM-35-A', 2023),
        ('s320123', 'Li', 'Wei', 'Male', 'China', 's320123@studenti.polito.it', 'LM-44-A', 2023),
        ('s312345', 'Ferrari', 'Laura', 'Female', 'Italy', 's312345@studenti.polito.it', 'LM-28-A', 2022),
        ('s319012', 'Singh', 'Raj', 'Male', 'India', 's319012@studenti.polito.it', 'LM-29-A', 2023),
        ('s315678', 'Tanaka', 'Yuki', 'Male', 'Japan', 's315678@studenti.polito.it', 'LM-27-A', 2022),
        ('s310987', 'Chung', 'Hye-Jin', 'Female', 'South Korea', 's310987@studenti.polito.it', 'LM-31-A', 2022),
        ('s317890', 'Alonso', 'Maria', 'Female', 'Spain', 's317890@studenti.polito.it', 'LM-30-A', 2023),
        ('s321234', 'Mazur', 'Piotr', 'Male', 'Poland', 's321234@studenti.polito.it', 'LM-26-A', 2023),
        ('s316543', 'Chen', 'Wei', 'Male', 'China', 's316543@studenti.polito.it', 'LM-22-A', 2022);

INSERT INTO TEACHER (id, surname, name, email, cod_group, cod_department)
VALUES  ('s123456', 'Torchiano', 'Marco', 'marco.torchiano@teacher.it', 'SOFTENG', 'DAUIN'),
        ('s234567', 'Morisio', 'Maurizio', 'maurizio.morisio@teacher.it', 'SOFTENG', 'DAUIN'),
        ('s345678', 'De Russis', 'Luigi', 'luigi.derussis@teacher.it', 'ELITE', 'DAUIN'),
        ('s456789', 'Corno', 'Fulvio', 'fulvio.corno@teacher.it', 'ELITE', 'DAUIN'),
        ('s567890', 'Lioy', 'Antonio', 'antonio.lioy@teacher.it', 'TORSEC', 'DAUIN'),
        ('s678901', 'Basile', 'Cataldo', 'cataldo.basile@teacher.it', 'TORSEC', 'DAUIN'),
        ('s789012', 'Fino', 'Debora', 'debora.fino@teacher.it', 'CMPCS', 'DISAT'),
        ('s890123', 'Petruzzo', 'Angela', 'angela.petruzzo@teacher.it', 'CMPCS', 'DISAT'),
        ('s901234', 'Onida', 'Barbara', 'barbara.onida@teacher.it', 'SMAC', 'DISAT'),
        ('s012345', 'Manna', 'Luigi', 'luigi.manna@teacher.it', 'SMAC', 'DISAT'),
        ('s123345', 'Brischetto', 'Salvatore', 'salvatore.brischetto@teacher.it', 'ASTRA', 'DIMEAS'),
        ('s940590', 'Maggiore', 'Paolo', 'paolo.maggiore@teacher.it', 'ASTRA', 'DIMEAS'),
        ('s298399', 'Romano', 'Marcello', 'marcello.romano@teacher.it', 'ASTRADORS', 'DIMEAS'),
        ('s384788', 'Gherlone', 'Marco', 'marco.gherlone@teacher.it', 'AESDO', 'DIMEAS'),
        ('s112343', 'Esposito', 'Marco', 'marco.esposito@teacher.it', 'AESDO', 'DIMEAS'),
        ('s238411', 'Canavero', 'Flavio', 'flavio.canavero@teacher.it', 'EMC', 'DET'),
        ('s998899', 'Stievano', 'Igor', 'igor.stievano@teacher.it', 'EMC', 'DET'),
        ('s221800', 'Amati', 'Nicola', 'nicola.amati@teacher.it', 'LIM', 'DET'),
        ('s122349', 'Bonifitto', 'Angelo', 'angelo.bonfitto@teacher.it', 'LIM', 'DET'),
        ('s009666', 'Canova', 'Aldo', 'aldo.canova@teacher.it', 'CADEMA', 'DENERG'),
        ('s293040', 'Freschi', 'Fabio', 'fabio.freschi@teacher.it', 'CADEMA', 'DENERG'),
        ('s104858', 'Savoldi', 'Laura', 'laura.savoldi@teacher.it', 'MAHTEP', 'DENERG'),
        ('s909920', 'Lerede', 'Daniele', 'daniele.lerede@teacher.it', 'MAHTEP', 'DENERG'),
        ('s328382', 'Millo', 'Federico', 'federico.millo@teacher.it', 'E3', 'DENERG');

-- careers of Carlos, Luca, Lorenzo
INSERT INTO CAREER (id, cod_course, title_course, cfu, grade, date)
VALUES  ('s308747', '01SQMOV', 'Data Science and Database Technologies', 8, 30, '2023-01-23'),
        ('s308747', '02KPNOV', 'Network Services and Technologies', 6, 28, '2023-01-30'),
        ('s308747', '02GOLOV', 'Computer Architectures', 10, 30, '2023-02-06'),
        ('s308747', '01PDWOV', 'Information Systems', 6, 28, '2023-02-14'),
        ('s308747', '01UDFOV', 'Web Applications I', 6, 30, '2023-06-26'),
        ('s308747', '05BIDOV', 'Software Engineering', 8, 29, '2023-07-13'),
        ('s308747', '02JEUOV', 'Formal Languages and Compilers', 6, 27, '2023-07-17'),

        ('s319823', '01SQMOV', 'Data Science and Database Technologies', 8, 29, '2023-01-23'),
        ('s319823', '02KPNOV', 'Network Services and Technologies', 6, 27, '2023-01-30'),
        ('s319823', '02GOLOV', 'Computer Architectures', 10, 28, '2023-02-06'),
        ('s319823', '01PDWOV', 'Information Systems', 6, 30, '2023-02-14'),
        ('s319823', '01UDFOV', 'Web Applications I', 6, 26, '2023-06-26'),
        ('s319823', '05BIDOV', 'Software Engineering', 8, 29, '2023-07-13'),
        ('s319823', '02JEUOV', 'Formal Languages and Compilers', 6, 28, '2023-07-17'),
        ('s319823', '03AIROV', 'Artificial Intelligence', 8, 30, '2023-08-02'),
        ('s319823', '04CGROV', 'Computer Graphics', 6, 27, '2023-08-14'),

        ('s309618', '01SQMOV', 'Data Science and Database Technologies', 8, 28, '2023-01-23'),
        ('s309618', '02KPNOV', 'Network Services and Technologies', 6, 25, '2023-01-30'),
        ('s309618', '02GOLOV', 'Computer Architectures', 10, 26, '2023-02-06'),
        ('s309618', '01PDWOV', 'Information Systems', 6, 29, '2023-02-14'),
        ('s309618', '01UDFOV', 'Web Applications I', 6, 27, '2023-06-26'),
        ('s309618', '05BIDOV', 'Software Engineering', 8, 28, '2023-07-13'),
        ('s309618', '02JEUOV', 'Formal Languages and Compilers', 6, 26, '2023-07-17'),
        ('s309618', '02GRSOV', 'Systems and Device Programming', 10, 29, '2023-08-02'),
        ('s309618', '01SQNOV', 'Software Engineering II', 6, 30, '2023-08-14');

-- ACTIVATE FOREIGN KEYS
PRAGMA foreign_keys = ON;
