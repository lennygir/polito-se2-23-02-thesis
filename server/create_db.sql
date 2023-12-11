-- TO RUN THIS SCRIPT:
-- sqlite3 theses_management.db < create_db.sql

DROP TABLE IF EXISTS NOTIFICATIONS;
DROP TABLE IF EXISTS APPLICATIONS;
DROP TABLE IF EXISTS CAREER;
DROP TABLE IF EXISTS STUDENT;
DROP TABLE IF EXISTS PROPOSALS;
DROP TABLE IF EXISTS DEGREE;
DROP TABLE IF EXISTS TEACHER;
DROP TABLE IF EXISTS GROUPS;
DROP TABLE IF EXISTS DEPARTMENTS;
DROP TABLE IF EXISTS USERS;

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
  archived INTEGER DEFAULT 0, -- 0 false, 1 true
  FOREIGN KEY (supervisor) REFERENCES TEACHER (id),
  FOREIGN KEY (cds) REFERENCES DEGREE (cod_degree)
);

CREATE TABLE IF NOT EXISTS APPLICATIONS (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  proposal_id INTEGER,
  student_id TEXT,
  state TEXT,
  FOREIGN KEY (proposal_id) REFERENCES PROPOSALS (id) ON DELETE SET NULL,
  FOREIGN KEY (student_id) REFERENCES STUDENT (id)
);

CREATE TABLE IF NOT EXISTS USERS (
  email TEXT NOT NULL,
  password TEXT NOT NULL
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

INSERT INTO PROPOSALS (id, title, supervisor, co_supervisors, keywords, type , groups , description, required_knowledge, notes, expiration_date ,level, cds)
VALUES  (1, 'Gamification di attività di modellazione UML', 's123456', 'luigi.derussis@teacher.it, maurizio.morisio@teacher.it', 'GAMIFICATION, SOFTWARE ENGINEERING, SOFTWARE QUALITY, UML', 'RESEARCH', 'SOFTENG', 'La gamification è definita come l applicazione di elementi tipici dei videogiochi (punteggi, competizione con altri utenti, regole di gioco, ecc.) a qualsiasi altra attività, in modo da incrementare il coinvolgimento e le prestazioni degli utenti coinvolti. Lobiettivo della tesi è lapplicazione di caratteristiche tipiche della gamification alla pratica della modellazione UML, e la valutazione dei benefici derivanti. La tesi consisterà nello sviluppo di una piattaforma con funzionalità di gaming competitivo della costruzione di diagrammi delle classi UML. I meccanismi di gamification dovranno premiare diversi aspetti di qualità del modello costruito, quali completezza, correttezza, coerenza, minimalità e leggibilità. Il sistema dovrà prevedere funzionalità di mantenimento dello storico dei punteggi, e di visualizzazione della classifica corrente dei giocatori.', 'UML Modeling, Java', NULL, '2023-12-18', 'MSC', 'LM-32-D'),
        (2, 'Analisi empirica dei difetti in R Markdown', 's123456', 'angelo.bonfitto@teacher.it, marcello.romano@teacher.it', 'MARKDOWN, DEVELOP' ,'RESEARCH', 'SOFTENG', 'I file R Markdown sono adottati ampiamente per lo sviluppo iterativo di workflow di analisi e visualizzazione dei dati. Laffidabilità dei risultati e la possibilità di riutilizzare le analisi dipendono pesantemente dalla correttezza dei file Rmd. Obiettivo della tesi è quello di analizzare file Rmd disponibili in repository pubblici e identificare e classificare i difetti.', 'Linguaggio R, Ambiente R Studio', NULL, '2023-12-28', 'MSC', 'LM-32-D'),
        (3, 'Data-centric AI: Dataset augmentation techniques for bias and data quality improvement', 's123456', 'paolo.maggiore@teacher.it', 'AI' ,'COMPANY, EXPERIMENTAL, RESEARCH', 'SOFTENG, ASTRA', 'Clearbox AI Control Room has a feature to generate synthetic datasets for dataset augmentation. The thesis work is focused on the experimentation of techniques that can help detect bias in the original datasets and mitigate them by augmenting the original dataset using synthetic points. The project will require identifying the types of bias within a dataset and identifying intervention mechanisms to remove the bias using synthetic data generation methods. Clearbox AI is an innovative SME, incubated in I3P, winner of the National Innovation Award (PNI 2019) in the ICT category and the EU Seal of Excellence awarded by the European Commission. Clearbox AI is developing a unique and innovative technology ("AI Control Room"), which allows putting into production artificial intelligence models that are robust, explainable and monitorable over time.', 'Good programming skills and basic knowledge of common data analytics tools and techniques. Grade point average equal to or higher than 26 will play a relevant role in the selection.', NULL, '2023-11-30', 'MSC', 'LM-32-D'),
        (4, 'Detecting the risk discrimination in classifiers with imbalance measures', 's123456', 'luigi.derussis@teacher.it, angelo.bonfitto@teacher.it', 'DEVELOPMENT' ,'EXPERIMENTAL, RESEARCH', 'SOFTENG', 'Having imbalanced classes in a training set can impact the outcome of the classification model in several ways. First, an imbalanced dataset can bias the classification model towards the majority class. Since the model is trained on a dataset with a majority of negative examples, it will be more likely to predict the negative class, even when presented with examples of the positive class. This can lead to poor performance on the minority class, such as a low recall or precision rate. Second, imbalanced data can also make it more difficult for the model to learn the underlying relationships between the features and the classes. With a large number of negative examples and a small number of positive examples, the model may have difficulty finding the signal in the data that distinguishes the positive class from the negative class. This can lead to suboptimal model performance on both classes. In both cases, when the objects of automated decision are individuals, such disparate performance of the algorithm means in practice to systematically and unfairly discriminate against certain individuals or groups of individuals in favor of others [by denying] an opportunity for a good or [assigning] an undesirable outcome to an individual or groups of individuals on grounds that are unreasonable or inappropriate. The goal of the thesis is to test the capability of imbalance measures to predict unfair classifications Previous work on the topic and material (a few initial metrics, code, datasets) will be made available.', 'Good programming skills and basic knowledge of common data analytics tools and techniques. Grade point average equal to or higher than 26 can be a criterion for selection of candidate.', 'When sending your application, we kindly ask you to attach the following information: - list of exams taken in your master degree, with grades and grade point average - a résumé or equivalent (e.g., LinkedIn profile), if you already have one - by when you aim to graduate and an estimate of the time you can devote to the thesis in a typical week', '2023-11-30', 'MSC', 'LM-32-D'), 
        (5, 'Valutazione di esercizi di programmazione tramite debito tecnico', 's123456', 'federico.millo@teacher.it, aldo.canova@teacher.it', 'SOFTWARE QUALITY', 'RESEARCH', 'SOFTENG', 'Il concetto di Debito Tecnico si sta diffondendo negli ultimi anni per descrivere le problematiche introdotte, più o meno coscientemente, per ridurre i costi ed i tempi di sviluppo del software. Obiettivo di questa tesi è indagare se il Debito Tecnico, solitamente è un concetto applicato al software industriale di grandi dimensioni, può essere applicato al software sviluppato dagli studenti come esercizio di programmazione.','La tesi richiede competenze avanzate in programmazione, comprensione del debito tecnico, e familiarità con metodologie agili e strumenti di analisi del codice. Essenziali sono anche le abilità comunicative e di gestione del tempo nello sviluppo software.' ,NULL,'2023-12-18', 'MSC' ,'LM-32-D'),
        (6, 'Well being app', 's234567', 'paolo.maggiore@teacher.it, salvatore.brischetto@teacher.it', 'MOBILE APP DEVELOPEMENT, WEB DEVELOPMENT, EXPERIMENTAL','EXPERIMENTAL', 'SOFTENG', 'Obiettivo della tesi è sviluppare una app e relativo back end per supportare le persone a perseguire uno stile di vita salutare. La app raccoglie (direttamente, o tramite device esterni tipo smartwatch o fitbit) dati sulla vita della persona (attività fisica, qualità e durata del sonno, pressione, pulsazioni) (nutrizione, tipo e quantità del cibo mangiato e delle bevande). Confrontando i dati raccolti con pattern predefiniti e possibilmente con analisi mediche supplettive la app suggerisce modifiche allo stile di vita (recommendation). Via via che la persona viene monitorata altre modifiche sono suggerite e il loro effetto verificato. La parte back end della app raccoglie in modo anonimo i dati di molti utenti e utilizzando tecniche statistiche e di machine learning costruisce e raffina modelli e pattern predittivi da usare per le recommendation. Le recommendation iniziali sono derivate dalla letteratura scientifica su aging e well being (vedere ad esempio Fontana L., The path to longevity). Scopo di lungo termine della app è di raccogliere dati per validare e migliorare le recommendation.', 'Java, PhP', NULL, '2024-10-14', 'MSC','LM-32-D'),
        (7, 'Automatic classification of images of food', 's234567', 'angelo.bonfitto@teacher.it, antonio.lioy@teacher.it', 'DEEP NEURAL NETWORKS, IMAGE PROCESSING, MACHINE LEARNING', 'EXPERIMENTAL' ,'SOFTENG', 'In many contexts it is important to track what a person eats (illnesses, fitness, allergies etc). A practical way to do this is to take a picture of the food eaten using a smartphone and having an automatic classifier capable of recognizing the food with high accuracy. Having recognized the food it is then possible to know the basic ingredients eaten (proteins, fats etc). Beyond food classification another open problem is characterizing the quantity eaten. This thesis consists in selecting a suitable open data set of tagged food pictures (ex Recipe1M+), trying various machine learning / deep learning techniques to build a classifier, using image processing techniques to infer the quantity of food eaten, with the goal of achieving the highest accuracy both in food classification and quantity computation.', 'Python, Java, machine learning approaches and libraries, focusing on image processing, image classification', NULL,'2024-10-13', 'MSC', 'LM-32-D'),
        (8, 'Analisi della qualità del codice e della sicurezza delle librerie software nell ambito dell IoT: un approccio basato sull analisi statica', 's234567', 'cataldo.basile@teacher.it', 'ANALISI STATICA, IOT, SOFTWARE ENGINEERING', 'EXPERIMENTAL', 'SOFTENG, TORSEC', ' L Internet of Things (IoT) è una realtà sempre più presente nel nostro quotidiano e, di conseguenza, le esigenze di sicurezza e conformità sono sempre più pressanti. La tesi si inserisce nel contesto del progetto di ricerca "AsCoT-SCE", un progetto PRIN (Progetti di Rilevante Interesse Nazionale) recentemente approvato dal Ministero dell Università e della Ricerca, che mira a fornire strumenti e metodi per esprimere in forma processabile le funzionalità delle API standardizzate negli ambienti IoT e verificare la loro conformità. In questa tesi, gli studenti avranno l opportunità di progettare e realizzare un architettura software che funga da principale orchestratore per il processo di verifica della conformità nel contesto dell IoT. Gli studenti avranno modo inoltre di integrare i modelli e le policy provenienti da diverse unità di ricerca, mettendo in pratica le competenze acquisite nei corsi di Ingegneria del Software e Ingegneria del Software II. In particolare, gli studenti si troveranno a fronteggiare la sfida della progettazione orientata alla sicurezza (Security by Design), un concetto fondamentale nell attuale panorama della progettazione software, che prevede che la sicurezza sia integrata in ogni fase dello sviluppo di un sistema, piuttosto che essere aggiunta in un secondo momento. Questo lavoro di tesi rappresenterà un occasione unica per applicare le conoscenze teoriche in un progetto concreto, contribuendo attivamente alla ricerca nel campo della sicurezza IoT.', 'Strong Python and Rust foundations' ,NULL, '2024-06-19','MSC', 'LM-32-D'),
        (9, 'Dear Diary: experimenting with enhanced web development documentation artifacts', 's345678', 'federico.millo@teacher.it, aldo.canova@teacher.it', 'DOCUMENTAZIONE, PROGRAMMAZIONE, SOFTWARE, TECNOLOGIE WEB, WEB', 'RESEARCH, EXPERIMENTAL' ,'ELITE, SOFTENG', 'Novice programmers generally do not rely on documentation to keep track of the successes and errors they encounter during the development process: how they get working versions of their projects; how to overcome specific mistakes; what resources they consult; and the lessons learned. Consequently, critical aspects of the process development are constantly omitted from the documentation, which becomes useless to themselves or other developers who want to overcome the same problems or develop similar new projects. Based on these considerations, this thesis will focus on: * Getting familiar with Dear Diary, a tool we developed that supports non-expert programmers in creating context-dependent documentation artifacts during their development process. It has been implemented as a Visual Code Extension. It can automatically gather technical information from the development environment; and allows developers to enrich that knowledge with comments and notes. * Based on a preliminary assessment of the tool that has shed light on various usability issues, extend the tool while simplifying the interaction and enhancing usability. * Design and conduct a several-months user study to assess in the wild, on the one hand, the effectiveness of the usability improvements; and, on the other hand, the usefulness of the tool itself to guide the novices development process relying on their documentation. Analyze the data of the evaluation to gather new insights. If satisfactory, the result of the thesis will be released as an open-source project.', 'Javascript and React to program single page applications', NULL, '2024-05-24','MSC', 'LM-32-D'),
        (10, 'Generative Methods to Enhance Creativity in User Interface Design', 's345678', 'marcello.romano@teacher.it', 'GENERATIVE ADVERSARIAL NETWORKS, HUMAN-COMPUTER INTERACTION, MACHINE LEARNING, USER EXPERIENCE, USER INTERFACE','EXPERIMENTAL, RESEARCH' ,'ELITE', 'This thesis focuses on the use of generative methods to enhance creativity in User Interface (UI) design. The emergence of generative methods, particularly deep learning techniques, has provided new opportunities for computer-aided design. Recent developments in generative adversarial networks (GANs) and autoencoders have shown promising results in generating creative content in various domains such as graphics, music, and text. However, the application of these methods in the field of UI design remains largely unexplored. UI design is a critical aspect of software development that greatly impacts user experience. However, the design process can be challenging due to the necessity of considering multiple factors, such as aesthetic appeal, usability, and accessibility. Generative methods have the potential to provide designers with novel and innovative design options, enhancing their creativity and supporting them in overcoming design challenges. The main goals of this thesis are: * Review the current state of the art in generative methods and their applications in creative design. * Develop a generative model for UI design that can provide creative and usable design options. * Evaluate the effectiveness and usability of the generated designs through user studies. If appropriate, the outcome of the work will be released as an open-source project.', 'Good programming skills and Python knowledge are required.', NULL, '2024-05-17', 'MSC' ,'LM-32-D'),
        (11, 'Incrementare la sicurezza di una smart home tramite smart home gateway e MUD', 's456789', 'federico.millo@teacher.it', 'CYBERSECURITY, INTERNET OF THINGS, MUD, SECURITY, SMART HOME', 'EXPERIMENTAL' ,'ELITE', 'Recentemente, la Internet Engineering Task Force (IETF) ha proposto un nuovo standard (RFC 8520) relativo alla sicurezza IoT chiamato Manufacturer Usage Description (MUD). Questo standard sfrutta un approccio a white-list. Ogni produttore di un dispositivo IoT (il manufacturer) deve fornire un MUD file in cui vengono specificati gli endpoint con cui il dispositivo può comunicare (in trasmissione o in ricezione), tutti gli altri domini vengono invece bloccati. In questo modo vengono tutelati i dispositivi IoT da connessioni indesiderate e si riduce l eventualità che essi possano prendere parte ad attacchi DDoS (Distributed Denial of Service). Per gestire le smart home, vengono spesso impiegati degli smart home gateways (anche chiamati hub). Questi ultimi coordinano e comunicano con tutti i dispositivi connessi alla rete locale e sono spesso estendibili tramite plug-in. Perciò, questi hub possono essere un ottimo punto in cui inserire lo standard MUD (soprattutto se i dispositivi integrati non supportano MUD nativamente). Questo lavoro di tesi va ad integrarsi nelle attività di ricerca recentemente condotte dal gruppo su questa tecnologia e consisterà nel migliorare ed ottimizzare la generazione di un MUD file a livello di gateway. Nella soluzione da noi proposta, ogni sviluppatore di plug-in è chiamato a specificare gli endpoint che il suo plug-in necessita raggiungere (a prescindere se il plug-in integri un dispositivo o solamente una nuova funzionalità software). Specificando le comunicazioni desiderate, lo sviluppatore aumenta la sicurezza del suo plug-in e dell intero gateway in cui esso è installato. La piattaforma che verrà inizialmente presa in considerazione per lo sviluppo è Home Assistant. In particolare, i problemi che dovranno essere affrontati sono la sovrapposizione delle regole MUD specificate da ogni sviluppatore, la validità di tali regole e l affidabilità delle regole fornite dagli sviluppatori di plug-in.', '- Linguaggio di programmazione della piattaforma: Python; - Programmazione orientata agli oggetti; - Information System Security, nello specifico: - Concetti di crittografia asimmetrica, Public Key Infrastructure (PKI) e algoritmi di hash;', NULL, '2023-12-14', 'MSC', 'LM-32-D'),
        (12, 'Improving Communication in Decentralized Online Social Networks', 's567890', 'debora.fino@teacher.it, flavio.canavero@teacher.it', 'DECENTRALIZED SYSTEMS, DISTRIBUTED SYSTEMS, ONLINE SOCIAL NETWORKS, SECURITY, PRIVACY', 'EXPERIMENTAL', 'TORSEC, EMC', 'Decentralized Online Social Networks (DOSNs) have emerged as an alternative to traditional centralized social networks, addressing concerns related to privacy and censorship. In DOSNs, users have more control over their data and can communicate directly without relying on a central authority. However, challenges remain in terms of efficiency, security, and user experience. This thesis aims to improve communication in DOSNs by addressing specific issues such as message routing, content dissemination, and privacy preservation. Students will explore and implement solutions to enhance the overall performance and security of DOSNs, considering real-world scenarios and challenges. The proposed research involves a combination of experimental work, simulation, and analysis of decentralized communication protocols. The goal is to contribute to the advancement of decentralized systems and provide valuable insights into the design and optimization of DOSNs.', 'Strong programming skills (preferably in Python or Java), understanding of networking concepts, and interest in decentralized systems.', NULL, '2024-06-30', 'MSC', 'LM-32-D'),
        (13, 'Blockchain-based Solutions for Secure and Trustworthy Supply Chain Management', 's678901', 'angela.petruzzo@teacher.it, igor.stievano@teacher.it', 'BLOCKCHAIN, SUPPLY CHAIN MANAGEMENT, DISTRIBUTED LEDGER TECHNOLOGY, SECURITY, TRUST', 'COMPANY, ABROAD, RESEARCH', 'TORSEC, EMC', 'Supply chain management faces challenges related to transparency, traceability, and trust. Blockchain technology has the potential to address these challenges by providing a secure and decentralized ledger for recording transactions. This thesis aims to explore and develop blockchain-based solutions for secure and trustworthy supply chain management. Students will investigate the application of blockchain in tracking and verifying the flow of goods, ensuring the integrity of information, and enhancing overall transparency in the supply chain. The research may involve the development of smart contracts, decentralized applications (DApps), and the integration of blockchain with other emerging technologies. The goal is to contribute to the design and implementation of secure and efficient blockchain solutions for real-world supply chain scenarios.', 'Background in blockchain technology, distributed systems, and programming skills (preferably in languages like Solidity, Java, or Python). Familiarity with supply chain management concepts is a plus.', NULL, '2024-06-15', 'MSC', 'LM-32-D'),
        (14, 'Enhancing Mobile App Security through Behavior-based Analysis', 's789012', 'antonio.lioy@teacher.it, igor.stievano@teacher.it', 'MOBILE APP SECURITY, BEHAVIOR ANALYSIS, MACHINE LEARNING, ANDROID, IOS', 'COMPANY', 'TORSEC, EMC', 'Mobile apps often handle sensitive data and may be susceptible to various security threats. Traditional security measures may not be sufficient to protect against evolving threats. This thesis focuses on enhancing mobile app security through behavior-based analysis. Students will explore techniques such as machine learning to analyze the behavior of mobile apps and detect anomalies indicative of security risks. The research may involve the development of tools or frameworks for behavior analysis, experimentation with real-world apps, and the evaluation of the effectiveness of the proposed security measures. The goal is to contribute to the advancement of mobile app security and provide practical solutions for identifying and mitigating security risks in the mobile ecosystem.', 'Strong programming skills (preferably in Java or Kotlin for Android, Swift for iOS), understanding of mobile app development, and interest in security and machine learning.', NULL, '2024-06-20', 'MSC', 'LM-32-D'),
        (15, 'Secure and Privacy-Preserving Data Sharing in Healthcare Systems', 's890123', 'antonio.lioy@teacher.it, igor.stievano@teacher.it', 'SECURE DATA SHARING, PRIVACY PRESERVATION, HEALTHCARE SYSTEMS, ENCRYPTION, ACCESS CONTROL', 'RESEARCH', 'EMC, TORSEC', 'Healthcare systems often involve the sharing of sensitive patient data among different entities for collaborative research or treatment purposes. Ensuring the security and privacy of this data is crucial. This thesis aims to explore secure and privacy-preserving techniques for data sharing in healthcare systems. Students will investigate encryption mechanisms, access control models, and other cryptographic techniques to protect sensitive healthcare data during transmission and storage. The research may involve the development of prototypes or simulations to evaluate the proposed solutions. The goal is to contribute to the development of robust and privacy-aware data sharing mechanisms in healthcare settings.', 'Strong background in cryptography, programming skills (preferably in Python or Java), and an understanding of healthcare IT systems.', NULL, '2024-06-25', 'MSC', 'LM-32-D'),
        (16, 'Human-Centric AI for Assistive Healthcare Technologies', 's901234', 'flavio.canavero@teacher.it, antonio.lioy@teacher.it', 'ARTIFICIAL INTELLIGENCE, ASSISTIVE TECHNOLOGIES, HEALTHCARE, HUMAN-CENTRIC AI, MACHINE LEARNING', 'EXPERIMENTAL, ABROAD, RESEARCH', 'SMAC, EMC', 'Assistive healthcare technologies powered by artificial intelligence (AI) have the potential to significantly improve the quality of life for individuals with diverse healthcare needs. This thesis focuses on the development of human-centric AI for assistive healthcare technologies. Students will explore machine learning techniques to design and implement AI models that can adapt to the specific needs and preferences of users. The research may involve the development of AI-powered prototypes, user studies, and the evaluation of the usability and effectiveness of the proposed solutions. The goal is to contribute to the field of assistive technologies and AI-driven solutions that prioritize the well-being and autonomy of individuals with healthcare challenges.', 'Strong programming skills (preferably in Python), understanding of machine learning concepts, and interest in healthcare technologies.', NULL, '2024-06-28', 'MSC', 'LM-32-D'),
        (17, 'Augmented Reality for Enhanced Maintenance and Training in Industrial Settings', 's012345', 'debora.fino@teacher.it, igor.stievano@teacher.it', 'AUGMENTED REALITY, INDUSTRIAL MAINTENANCE, TRAINING, HUMAN-COMPUTER INTERACTION, IMMERSIVE TECHNOLOGIES', 'EXPERIMENTAL, RESEARCH', 'SMAC, EMC', 'Augmented Reality (AR) has the potential to revolutionize maintenance and training activities in industrial settings by providing immersive and interactive experiences. This thesis aims to explore the application of augmented reality for enhanced maintenance and training in industrial contexts. Students will investigate the design and development of AR solutions that can improve the efficiency and effectiveness of maintenance tasks and training programs. The research may involve the creation of AR prototypes, user studies, and the evaluation of the impact of AR on training outcomes. The goal is to contribute to the integration of AR technologies into industrial environments to optimize maintenance processes and enhance the skills of personnel.', 'Programming skills (preferably in Unity, C#, or related AR development frameworks), understanding of human-computer interaction, and interest in industrial applications of AR.', NULL, '2024-07-01', 'MSC', 'LM-32-D'),
        (18, 'IoT-enabled Smart Building Management for Energy Efficiency', 's123345', 'cataldo.basile@teacher.it, igor.stievano@teacher.it', 'INTERNET OF THINGS, SMART BUILDINGS, ENERGY EFFICIENCY, BUILDING MANAGEMENT SYSTEMS, SENSOR NETWORKS', 'COMPANY, RESEARCH', 'SMAC, EMC', 'Smart building management systems, powered by the Internet of Things (IoT), play a crucial role in optimizing energy consumption and enhancing overall efficiency. This thesis focuses on IoT-enabled smart building management for energy efficiency. Students will explore the design and implementation of IoT solutions that can monitor and control various aspects of building operations to minimize energy usage. The research may involve the deployment of sensor networks, development of control algorithms, and the evaluation of the proposed solutions in real-world settings. The goal is to contribute to the development of sustainable and energy-efficient smart building technologies.', 'Strong programming skills (preferably in Python or C++), understanding of IoT concepts, and interest in sustainable technologies.', NULL, '2024-07-05', 'MSC', 'LM-32-D'),
        (19, 'Enhancing Security in Cyber-Physical Systems for Critical Infrastructures', 's940590', 'antonio.lioy@teacher.it, flavio.canavero@teacher.it', 'CYBER-PHYSICAL SYSTEMS, CRITICAL INFRASTRUCTURES, SECURITY, INTRUSION DETECTION, RESILIENCE', 'EXPERIMENTAL, RESEARCH', 'TORSEC, EMC', 'Cyber-Physical Systems (CPS) form the backbone of critical infrastructures such as power grids, transportation systems, and healthcare facilities. Ensuring the security and resilience of CPS is of utmost importance. This thesis aims to enhance security in Cyber-Physical Systems for critical infrastructures. Students will investigate intrusion detection techniques, security mechanisms, and resilience strategies to protect CPS from cyber threats. The research may involve the development of prototypes, simulations, and analysis of real-world CPS scenarios. The goal is to contribute to the development of robust and secure CPS solutions that can withstand cyber attacks and ensure the continuous operation of critical infrastructures.', 'Strong background in cybersecurity, programming skills (preferably in Python or C++), and understanding of Cyber-Physical Systems.', NULL, '2024-07-10', 'MSC', 'LM-32-D'),
        (20, 'Machine Learning for Predictive Maintenance in Industrial IoT', 's298399', 'debora.fino@teacher.it, igor.stievano@teacher.it', 'MACHINE LEARNING, PREDICTIVE MAINTENANCE, INDUSTRIAL INTERNET OF THINGS, SENSOR DATA ANALYSIS', 'RESEARCH, ABROAD', 'SMAC, EMC', 'Predictive maintenance is critical for ensuring the reliability and performance of industrial equipment. This thesis focuses on the application of machine learning techniques for predictive maintenance in Industrial Internet of Things (IoT) environments. Students will explore sensor data analysis, machine learning model development, and implementation of predictive maintenance strategies. The research may involve the use of real-world sensor data to train and evaluate machine learning models. The goal is to contribute to the development of efficient and accurate predictive maintenance solutions that can optimize equipment reliability and reduce downtime in industrial settings.', 'Strong programming skills (preferably in Python), understanding of machine learning concepts, and interest in industrial IoT applications.', NULL, '2024-07-15', 'MSC', 'LM-32-D'),
        (21, 'Privacy-Preserving Machine Learning for Healthcare Analytics', 's384788', 'antonio.lioy@teacher.it, igor.stievano@teacher.it', 'PRIVACY-PRESERVING MACHINE LEARNING, HEALTHCARE ANALYTICS, DATA PRIVACY, FEDERATED LEARNING', 'EXPERIMENTAL, RESEARCH', 'EMC, TORSEC', 'Machine learning in healthcare analytics holds great potential for improving patient outcomes and optimizing healthcare processes. However, privacy concerns pose significant challenges. This thesis aims to explore privacy-preserving machine learning techniques for healthcare analytics. Students will investigate federated learning, homomorphic encryption, and other privacy-preserving approaches to enable collaborative analysis of healthcare data without compromising individual privacy. The research may involve the development of privacy-preserving machine learning models and their application to healthcare datasets. The goal is to contribute to the advancement of machine learning in healthcare while respecting privacy and ethical considerations.', 'Strong background in machine learning, programming skills (preferably in Python), and interest in healthcare analytics.', NULL, '2024-07-20', 'MSC', 'LM-32-D'),
        (22, 'Enhancing Security and Privacy in Vehicular Ad-Hoc Networks (VANETs)', 's112343', 'cataldo.basile@teacher.it, flavio.canavero@teacher.it', 'VEHICULAR AD-HOC NETWORKS, SECURITY, PRIVACY, INTRUSION DETECTION, COMMUNICATION PROTOCOLS', 'RESEARCH', 'TORSEC, EMC', 'Vehicular Ad-Hoc Networks (VANETs) play a crucial role in enabling communication among vehicles and infrastructure for applications such as traffic management and road safety. However, ensuring the security and privacy of communications in VANETs is a challenging task. This thesis aims to enhance security and privacy in VANETs through the development of robust communication protocols and intrusion detection mechanisms. Students will explore cryptographic techniques, secure communication protocols, and methods for detecting and mitigating intrusions in VANETs. The research may involve simulation studies and experimentation with real-world VANET scenarios. The goal is to contribute to the development of secure and privacy-aware communication solutions for vehicular networks.', 'Strong background in network security, programming skills (preferably in Python or C++), and understanding of vehicular communication systems.', NULL, '2024-07-25', 'MSC', 'LM-32-D'),
        (23, 'Security and Privacy in Edge Computing Environments', 's238411', 'antonio.lioy@teacher.it, debora.fino@teacher.it', 'EDGE COMPUTING, SECURITY, PRIVACY, DISTRIBUTED SYSTEMS, IOT', 'EXPERIMENTAL, ABROAD', 'EMC, TORSEC', 'Edge computing brings computation closer to the data source, enabling real-time processing and reducing latency. However, security and privacy challenges arise in distributed edge environments. This thesis aims to address security and privacy issues in edge computing. Students will explore authentication mechanisms, data encryption, and secure communication protocols for edge devices. The research may involve the development of security frameworks or prototypes for edge computing applications. The goal is to contribute to the establishment of secure and privacy-aware edge computing systems.', 'Strong background in distributed systems, programming skills (preferably in Python or Java), and understanding of IoT and edge computing concepts.', NULL, '2024-07-30', 'MSC', 'LM-32-D'),
        (24, 'Intelligent Systems for Traffic Management in Smart Cities', 's998899', 'debora.fino@teacher.it, antonio.lioy@teacher.it', 'INTELLIGENT TRANSPORTATION SYSTEMS, SMART CITIES, TRAFFIC MANAGEMENT, MACHINE LEARNING, IOT', 'EXPERIMENTAL, RESEARCH', 'SMAC, EMC', 'Traffic management in smart cities requires intelligent solutions to optimize traffic flow and reduce congestion. This thesis focuses on the development of intelligent systems for traffic management. Students will explore machine learning techniques, IoT integration, and real-time data analysis to design traffic management algorithms. The research may involve simulation studies and experimentation with real-world traffic scenarios. The goal is to contribute to the development of efficient and adaptive traffic management systems for smart cities.', 'Strong programming skills (preferably in Python or Java), understanding of machine learning concepts, and interest in smart city technologies.', NULL, '2024-08-05', 'MSC', 'LM-32-D'),
        (25, 'Privacy-Aware Recommender Systems for E-Commerce Platforms', 's567890', 'debora.fino@teacher.it, flavio.canavero@teacher.it', 'RECOMMENDER SYSTEMS, PRIVACY, E-COMMERCE, MACHINE LEARNING, USER PROFILING', 'COMPANY, RESEARCH', 'EMC, TORSEC', 'Recommender systems play a crucial role in enhancing user experience on e-commerce platforms. However, privacy concerns related to user profiling and recommendation algorithms have become prominent. This thesis aims to develop privacy-aware recommender systems for e-commerce platforms. Students will explore machine learning techniques that balance personalized recommendations with user privacy. The research may involve the development of privacy-preserving recommendation algorithms and their evaluation on real-world e-commerce datasets. The goal is to contribute to the design of recommender systems that respect user privacy while providing effective and personalized recommendations.', 'Strong background in machine learning, programming skills (preferably in Python), and interest in e-commerce and user privacy.', NULL, '2024-08-10', 'MSC', 'LM-32-D'),
        (26, 'Enhancing Security in Cloud-Native Applications', 's789012', 'antonio.lioy@teacher.it, flavio.canavero@teacher.it', 'CLOUD-NATIVE APPLICATIONS, SECURITY, MICROSERVICES, CONTAINERIZATION, DEVOPS', 'EXPERIMENTAL, RESEARCH', 'TORSEC, EMC', 'Cloud-native applications, built on microservices and containerization, offer scalability and flexibility. However, ensuring security in dynamic cloud environments is a challenge. This thesis focuses on enhancing security in cloud-native applications. Students will explore security best practices, container orchestration, and DevOps principles to develop security solutions for cloud-native architectures. The research may involve the implementation of security mechanisms and their evaluation in cloud environments. The goal is to contribute to the development of secure and resilient cloud-native applications.', 'Strong background in cloud computing, programming skills (preferably in Python or Java), and understanding of microservices and containerization.', NULL, '2024-08-15', 'MSC', 'LM-32-D'),
        (27, 'Integrating Renewable Energy Sources into Smart Grids', 's678901', 'igor.stievano@teacher.it, debora.fino@teacher.it', 'SMART GRIDS, RENEWABLE ENERGY, ENERGY MANAGEMENT, IOT, DISTRIBUTED ENERGY RESOURCES', 'RESEARCH, ABROAD', 'SMAC, EMC', 'The integration of renewable energy sources poses challenges in managing energy distribution efficiently. This thesis aims to explore the integration of renewable energy sources into smart grids. Students will investigate energy management strategies, IoT-based monitoring, and control mechanisms for smart grids with a significant share of renewable energy. The research may involve simulation studies and experimentation with real-world energy systems. The goal is to contribute to the development of smart grid solutions that facilitate the seamless integration of renewable energy sources.', 'Strong programming skills (preferably in Python or Java), understanding of smart grid concepts, and interest in renewable energy technologies.', NULL, '2024-08-20', 'MSC', 'LM-32-D'),
        (28, 'Explainable AI for Trustworthy Decision Support Systems', 's998899', 'debora.fino@teacher.it, antonio.lioy@teacher.it', 'EXPLAINABLE AI, DECISION SUPPORT SYSTEMS, MACHINE LEARNING, INTERPRETABLE MODELS', 'EXPERIMENTAL', 'TORSEC, EMC', 'Explainability is crucial in decision support systems, especially when powered by machine learning models. This thesis focuses on developing explainable AI for trustworthy decision support systems. Students will explore interpretable machine learning models, explainability techniques, and their application to decision support scenarios. The research may involve the development of prototypes and the evaluation of the explainability and trustworthiness of the proposed systems. The goal is to contribute to the advancement of decision support systems that provide transparent and understandable insights.', 'Strong background in machine learning, programming skills (preferably in Python), and interest in decision support systems.', NULL, '2024-08-25', 'MSC', 'LM-32-D'),
        (29, 'Resilient Communication Networks for Disaster-Prone Areas', 's567890', 'debora.fino@teacher.it, flavio.canavero@teacher.it', 'COMMUNICATION NETWORKS, RESILIENCE, DISASTER MANAGEMENT, WIRELESS TECHNOLOGIES', 'EXPERIMENTAL, RESEARCH', 'EMC, TORSEC', 'Communication networks are crucial for disaster management, but they are often vulnerable to disruptions. This thesis aims to develop resilient communication networks for disaster-prone areas. Students will explore wireless technologies, network resilience strategies, and disaster response scenarios to design and implement resilient communication solutions. The research may involve simulation studies and experimentation to evaluate the effectiveness of the proposed solutions. The goal is to contribute to the development of communication networks that can withstand challenges in disaster-affected regions.', 'Strong background in communication networks, programming skills (preferably in Python or Java), and interest in disaster management and resilience.', NULL, '2024-08-30', 'MSC', 'LM-32-D'),
        (30, 'Human-Centric Design of Augmented Reality Interfaces', 's238411', 'antonio.lioy@teacher.it, debora.fino@teacher.it', 'AUGMENTED REALITY, HUMAN-CENTRIC DESIGN, USER INTERFACE, USER EXPERIENCE', 'RESEARCH, COMPANY', 'TORSEC, EMC', 'The design of augmented reality (AR) interfaces plays a crucial role in user experience and acceptance. This thesis focuses on human-centric design principles for AR interfaces. Students will explore user interface design, interaction techniques, and usability studies in the context of augmented reality. The research may involve the creation of AR prototypes, user studies, and the evaluation of the impact of AR on user experience. The goal is to contribute to the development of AR interfaces that prioritize user needs and preferences.', 'Programming skills (preferably in Unity, C#, or related AR development frameworks), understanding of human-computer interaction, and interest in AR applications.', NULL, '2024-09-01', 'MSC', 'LM-32-D');

INSERT INTO USERS (email, password)
VALUES ('marco.torchiano@teacher.it', 's123456'),
       ('maurizio.morisio@teacher.it', 's234567'),
       ('s319823@studenti.polito.it', 's319823'),
       ('s321503@studenti.polito.it', 's321503'),
       ('s308747@studenti.polito.it', 's308747'),
       ('s309618@studenti.polito.it', 's309618');

INSERT INTO APPLICATIONS (proposal_id,student_id,state)
VALUES (1,'s309618','rejected'),
       (2,'s309618','pending'),
       (1,'s308747','pending'),
       (4,'s308747','rejected'),
       (1,'s319823','rejected'),
       (2,'s319823','pending');

-- Add notifications to students
INSERT INTO NOTIFICATIONS (object, content, student_id)
VALUES ('New decision on your thesis application', 'Dear Tortore Luca,' || char(10) || 'your application for the thesis Gamification di attività di modellazione UML has been rejected.' || char(10) || 'Best regards,' || char(10) || 'the Thesis Managment system', 's319823'),
		('New decision on your thesis application', 'Dear Bertetto Lorenzo,' || char(10) || 'your application for the thesis Gamification di attività di modellazione UML has been rejected.' || char(10) || 'Best regards,' || char(10) || 'the Thesis Managment system', 's309618'),
		('New decision on your thesis application', 'Dear Valeriano Carlos,' || char(10) || 'your application for the thesis Detecting the risk discrimination in classifiers with imbalance measures has been rejected.' || char(10) || 'Best regards,' || char(10) || 'the Thesis Managment system', 's308747');

-- Add notifications to teachers
INSERT INTO NOTIFICATIONS (object, content, teacher_id)
VALUES ('New application on your thesis proposal', 'Dear Torchiano Marco,' || char(10) || 'your thesis proposal "Gamification di attività di modellazione UML" received a new application.' || char(10) || 'Best regards,' || char(10) || 'the Thesis Managment system', 's123456');

-- ACTIVATE FOREIGN KEYS
PRAGMA foreign_keys = ON;
