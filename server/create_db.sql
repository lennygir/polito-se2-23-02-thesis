-- TO RUN THIS SCRIPT:
-- inside /server: npm install sqlite3
-- sqlite3 polito-original.db < createDB.sql

-- Destruction of the old tables if they exist
DROP TABLE IF EXISTS STUDENT;
DROP TABLE IF EXISTS TEACHER;
DROP TABLE IF EXISTS DEGREE;
DROP TABLE IF EXISTS CAREER;
DROP TABLE IF EXISTS DEPARTMENT;
DROP TABLE IF EXISTS `GROUPS`;
DROP TABLE IF EXISTS PROPOSALS;
DROP TABLE IF EXISTS APPLICATIONS;
DROP TABLE IF EXISTS USERS;

CREATE TABLE IF NOT EXISTS DEGREE ( 
  cod_degree TEXT PRIMARY KEY,
  title_degree TEXT
);

CREATE TABLE IF NOT EXISTS DEPARTMENT ( 
  cod_department TEXT PRIMARY KEY,
  name_department TEXT 
);

CREATE TABLE IF NOT EXISTS `GROUPS` ( 
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
  FOREIGN KEY(cod_degree) REFERENCES DEGREE(cod_degree)
);

CREATE TABLE IF NOT EXISTS CAREER ( 
  id TEXT ,
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
  supervisor TEXT, -- is the professor
  co_supervisors TEXT, -- in the specifications it's said to be plural, so there can be multiple co-supervisors
  keywords TEXT,
  type TEXT,
  groups TEXT,
  description TEXT,
  required_knowledge TEXT,
  notes TEXT,
  expiration_date DATE,
  level TEXT,
  cds TEXT,
  FOREIGN KEY (supervisor) REFERENCES TEACHER (id),
  FOREIGN KEY (cds) REFERENCES DEGREE (cod_degree)
  -- you cannot reference the co_supervisors because there can be many and they can be also external people
);

CREATE TABLE IF NOT EXISTS APPLICATIONS (
  proposal_id INTEGER,
  student_id INTEGER,
  state TEXT,
  PRIMARY KEY (proposal_id, student_id),
  FOREIGN KEY (proposal_id) REFERENCES PROPOSALS (id),
  FOREIGN KEY (student_id) REFERENCES STUDENT (id)
);

-- this table will probably be modified according to what we need for the next sprints
CREATE TABLE IF NOT EXISTS USERS (
  email TEXT NOT NULL, -- email of the student/prof
  password TEXT NOT NULL  -- id of the student/prof
  -- no foreign keys are needed here because email is not the primary key for STUDENT or TEACHER
);

-- TODO: Duplicate this file and delete my comments after having understood
-- TODO: Insert test data accordingly to specifications (ask if unsure)
-- TODO: Run the command to create the db (see instructions at the top of this file)

-- to add test data, just ask chatgpt after giving it the create table function and some 
-- examples of values for specific fields that chatgpt must follow to give you reasonable data

INSERT INTO DEGREE (cod_degree, title_degree)
VALUES  ('LM-32 (DM270)', 'Computer Engineering'),
        ('LM-23 (DM270)', 'Civil Engineering'),
        ('LM-33 (DM270)', 'Mechanical Engineering'),
        ('LM-25 (DM270)', 'Automotive Engineering'),
        ('LM-29 (DM270)', 'Electronic and Communications Engineering'),
        ('LM-22 (DM270)', 'Chemical Engineering'),
        ('LM-20 (DM270)', 'Aerospace Engineering'),
        ('LM-04 (DM270)', 'Architecture');

INSERT INTO DEPARTMENT (cod_department, name_department)
VALUES  ('DAUIN', 'Departments of Control and Computer Engineering'),
        ('DET', 'Departments of Electronics and Telecommunications'),
        ('DENERG', 'Departments of Energetical Engineering'),
        ('DISAT', 'Departments of Applied Science and Technology'),
        ('DISERG', 'Departments of Civil Engineering'),
        ('DIMEAS', 'Departments of Mechanical and Aerospace Engineering'),
        ('DAD', 'Departments of Architecture and Design');

INSERT INTO `GROUPS` (cod_group, name_group, cod_department)
VALUES  ('ELITE', 'Intelligent and Interactive Systems', 'DAUIN'),
        ('SOFTENG', 'Software Engineering Group', 'DAUIN'),
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
VALUES  
        ('s319823', 'Tortore', 'Luca', 'Male', 'Italy', 's319823@studenti.polito.it', 'LM-32 (DM270)', 2023),
        ('s308747', 'Valeriano', 'Carlos', 'Male', 'Italy', 's308747@studenti.polito.it', 'LM-32 (DM270)', 2022),
        ('s309618', 'Bertetto', 'Lorenzo', 'Male', 'Italy', 's309618@studenti.polito.it', 'LM-32 (DM270)', 2022),
        ('s317743', 'Baracco', 'Francesco', 'Male', 'Italy', 's317743@studenti.polito.it', 'LM-32 (DM270)', 2022),
        ('s321503', 'Girardot', 'Lenny', 'Male', 'France', 's321503@studenti.polito.it', 'LM-32 (DM270)', 2023),
        ('s308920', 'Ghorbani', 'Ghazal', 'Female', 'Iran', 's308920@studenti.polito.it', 'LM-32 (DM270)', 2023),
        ('s123456', 'Rossi', 'Mario', 'Male', 'Italy', 's123456@studenti.polito.it', 'LM-32 (DM270)', 2023),
        ('s223456', 'Smith', 'John', 'Male', 'England', 's223456@studenti.polito.it', 'LM-23 (DM270)', 2023),
        ('s323456', 'Lagrange', 'Sophia', 'Female', 'USA', 's323456@studenti.polito.it', 'LM-33 (DM270)', 2023),
        ('s423456', 'Ulfstain', 'Karl', 'Male', 'Germany', 's423456@studenti.polito.it', 'LM-25 (DM270)', 2022),
        ('s523456', 'Wang', 'Wei', 'Male', 'China', 's523456@studenti.polito.it', 'LM-29 (DM270)', 2022),
        ('s623456', 'Phuaviach', 'Ariel', 'Male', 'Poland', 's623456@studenti.polito.it', 'LM-22 (DM270)', 2022),
        ('s723456', 'McScrooge', 'Lisa', 'Female', 'England', 's723456@studenti.polito.it', 'LM-20 (DM270)', 2023);

INSERT INTO TEACHER (id, surname, name, email, cod_group, cod_department)
VALUES  ('s123456', 'Torchiano', 'Marco', 'marco.torchiano@polito.it', 'SOFTENG', 'DAUIN'),
        ('s234567', 'Morisio', 'Maurizio', 'maurizio.morisio@polito.it', 'SOFTENG', 'DAUIN'),
        ('s345678', 'De Russis', 'Luigi', 'luigi.derussis@polito.it', 'ELITE', 'DAUIN'),
        ('s456789', 'Corno', 'Fulvio', 'fulvio.corno@polito.it', 'ELITE', 'DAUIN'),
        ('s567890', 'Lioy', 'Antonio', 'antonio.lioy@polito.it', 'TORSEC', 'DAUIN'),
        ('s678901', 'Basile', 'Cataldo', 'cataldo.basile@polito.it', 'TORSEC', 'DAUIN'),
        ('s789012', 'Fino', 'Debora', 'debora.fino@polito.it', 'CMPCS', 'DISAT'),
        ('s890123', 'Petruzzo', 'Angela', 'angela.petruzzo@polito.it', 'CMPCS', 'DISAT'),
        ('s901234', 'Onida', 'Barbara', 'barbara.onida@polito.it', 'SMAC', 'DISAT'),
        ('s012345', 'Manna', 'Luigi', 'luigi.manna@polito.it', 'SMAC', 'DISAT'),
        ('s123345', 'Brischetto', 'Salvatore', 'salvatore.brischetto@polito.it', 'ASTRA', 'DIMEAS'),
        ('s940590', 'Maggiore', 'Paolo', 'paolo.maggiore@polito.it', 'ASTRA', 'DIMEAS'),
        ('s298399', 'Romano', 'Marcello', 'marcello.romano@polito.it', 'ASTRADORS', 'DIMEAS'),
        ('s384788', 'Gherlone', 'Marco', 'marco.gherlone@polito.it', 'AESDO', 'DIMEAS'),
        ('s112343', 'Esposito', 'Marco', 'marco.esposito@polito.it', 'AESDO', 'DIMEAS'),
        ('s238411', 'Canavero', 'Flavio', 'flavio.canavero@polito.it', 'EMC', 'DET'),
        ('s998899', 'Stievano', 'Igor', 'igor.stievano@polito.it', 'EMC', 'DET'),
        ('s221800', 'Amati', 'Nicola', 'nicola.amati@polito.it', 'LIM', 'DET'),
        ('s122349', 'Bonifitto', 'Angelo', 'angelo.bonfitto@polito.it', 'LIM', 'DET'),
        ('s009666', 'Canova', 'Aldo', 'aldo.canova@polito.it', 'CADEMA', 'DENERG'),
        ('s293040', 'Freschi', 'Fabio', 'fabio.freschi@polito.it', 'CADEMA', 'DENERG'),
        ('s104858', 'Savoldi', 'Laura', 'laura.savoldi@polito.it', 'MAHTEP', 'DENERG'),
        ('s909920', 'Lerede', 'Daniele', 'daniele.lerede@polito.it', 'MAHTEP', 'DENERG'),
        ('s328382', 'Millo', 'Federico', 'federico.millo@polito.it', 'E3', 'DENERG');

INSERT INTO CAREER (id, cod_course, title_course, cfu, grade, date)
VALUES  ('s319823', 'AB12345', 'Introduction to Computer Science', 6, 28, '2022-05-15'),
        ('s223456', 'CD67890', 'Electrical Circuits and Systems', 9, 24, '2021-12-10'),
        ('s308747', 'EF98765', 'Mechanics of Materials', 8, 27, '2022-08-20'),
        ('s319823', 'GH54321', 'Thermodynamics', 7, 22, '2022-02-28'),
        ('s308747', 'IJ67890', 'Digital Signal Processing', 12, 30, '2021-10-05'),
        ('s223456', 'KL12345', 'Fluid Mechanics', 10, 26, '2022-06-08'),
        ('s308920', 'MN67890', 'Engineering Ethics', 6, 20, '2021-09-15'),
        ('s309618', 'OP12345', 'Control Systems', 11, 29, '2022-04-02');

INSERT INTO Proposals (id, title, supervisor, co_supervisors, keywords, type ,`groups`, description, required_knowledge, notes, expiration_date ,level, cds)
VALUES  (1, 'Gamification di attività di modellazione UML', 's123456', 's345678', 'GAMIFICATION, SOFTWARE ENGINEERING, SOFTWARE QUALITY, UML', 'RESEARCH', 'SOFTENG', 'La gamification è definita come l applicazione di elementi tipici dei videogiochi (punteggi, competizione con altri utenti, regole di gioco, ecc.) a qualsiasi altra attività, in modo da incrementare il coinvolgimento e le prestazioni degli utenti coinvolti. Lobiettivo della tesi è lapplicazione di caratteristiche tipiche della gamification alla pratica della modellazione UML, e la valutazione dei benefici derivanti. La tesi consisterà nello sviluppo di una piattaforma con funzionalità di gaming competitivo della costruzione di diagrammi delle classi UML. I meccanismi di gamification dovranno premiare diversi aspetti di qualità del modello costruito, quali completezza, correttezza, coerenza, minimalità e leggibilità. Il sistema dovrà prevedere funzionalità di mantenimento dello storico dei punteggi, e di visualizzazione della classifica corrente dei giocatori.', 'UML Modeling, Java', NULL, '2023-12-18', 'MSC', 'LM-32 (DM270)'),
        (2, 'Analisi empirica dei difetti in R Markdown', 's123456', 's122349, s298399', 'MARKDOWN, DEVELOP' ,'RESEARCH', 'SOFTENG', 'I file R Markdown sono adottati ampiamente per lo sviluppo iterativo di workflow di analisi e visualizzazione dei dati. Laffidabilità dei risultati e la possibilità di riutilizzare le analisi dipendono pesantemente dalla correttezza dei file Rmd. Obiettivo della tesi è quello di analizzare file Rmd disponibili in repository pubblici e identificare e classificare i difetti.', 'Linguaggio R, Ambiente R Studio', NULL, '2023-12-28', 'MSC', 'LM-32 (DM270)'),
        (3, 'Data-centric AI: Dataset augmentation techniques for bias and data quality improvement', 's123456', 's940590', 'AI' ,'COMPANY, EXPERIMENTAL, RESEARCH', 'SOFTENG, ELITE', 'Clearbox AI Control Room has a feature to generate synthetic datasets for dataset augmentation. The thesis work is focused on the experimentation of techniques that can help detect bias in the original datasets and mitigate them by augmenting the original dataset using synthetic points. The project will require identifying the types of bias within a dataset and identifying intervention mechanisms to remove the bias using synthetic data generation methods. Clearbox AI is an innovative SME, incubated in I3P, winner of the National Innovation Award (PNI 2019) in the ICT category and the EU Seal of Excellence awarded by the European Commission. Clearbox AI is developing a unique and innovative technology ("AI Control Room"), which allows putting into production artificial intelligence models that are robust, explainable and monitorable over time.', 'Good programming skills and basic knowledge of common data analytics tools and techniques. Grade point average equal to or higher than 26 will play a relevant role in the selection.', NULL, '2023-11-30', 'MSC', 'LM-32 (DM270)'),
        (4, 'Detecting the risk discrimination in classifiers with imbalance measures', 's123456', 's345678, s122349', 'DEVELOPMENT' ,'EXPERIMENTAL, RESEARCH', 'SOFTENG', 'Having imbalanced classes in a training set can impact the outcome of the classification model in several ways. First, an imbalanced dataset can bias the classification model towards the majority class. Since the model is trained on a dataset with a majority of negative examples, it will be more likely to predict the negative class, even when presented with examples of the positive class. This can lead to poor performance on the minority class, such as a low recall or precision rate. Second, imbalanced data can also make it more difficult for the model to learn the underlying relationships between the features and the classes. With a large number of negative examples and a small number of positive examples, the model may have difficulty finding the signal in the data that distinguishes the positive class from the negative class. This can lead to suboptimal model performance on both classes. In both cases, when the objects of automated decision are individuals, such disparate performance of the algorithm means in practice to systematically and unfairly discriminate against certain individuals or groups of individuals in favor of others [by denying] an opportunity for a good or [assigning] an undesirable outcome to an individual or groups of individuals on grounds that are unreasonable or inappropriate. The goal of the thesis is to test the capability of imbalance measures to predict unfair classifications Previous work on the topic and material (a few initial metrics, code, datasets) will be made available.', 'Good programming skills and basic knowledge of common data analytics tools and techniques. Grade point average equal to or higher than 26 can be a criterion for selection of candidate.', 'When sending your application, we kindly ask you to attach the following information: - list of exams taken in your master degree, with grades and grade point average - a résumé or equivalent (e.g., LinkedIn profile), if you already have one - by when you aim to graduate and an estimate of the time you can devote to the thesis in a typical week', '2023-11-30', 'MSC', 'LM-32 (DM270)'), 
        (5, 'Valutazione di esercizi di programmazione tramite debito tecnico', 's123456', 's328382, s009666', 'SOFTWARE QUALITY', 'RESEARCH', 'SOFTENG', 'Il concetto di Debito Tecnico si sta diffondendo negli ultimi anni per descrivere le problematiche introdotte, più o meno coscientemente, per ridurre i costi ed i tempi di sviluppo del software. Obiettivo di questa tesi è indagare se il Debito Tecnico, solitamente è un concetto applicato al software industriale di grandi dimensioni, può essere applicato al software sviluppato dagli studenti come esercizio di programmazione.',NULL ,NULL,'2023-12-18', 'MSC' ,'LM-32 (DM270)'),
        (6, 'Well being app', 's234567', 's940590', 'MOBILE APP DEVELOPEMENT, WEB DEVELOPMENT, EXPERIMENTAL','EXPERIMENTAL', 'SOFTENG', 'Obiettivo della tesi è sviluppare una app e relativo back end per supportare le persone a perseguire uno stile di vita salutare. La app raccoglie (direttamente, o tramite device esterni tipo smartwatch o fitbit) dati sulla vita della persona (attività fisica, qualità e durata del sonno, pressione, pulsazioni) (nutrizione, tipo e quantità del cibo mangiato e delle bevande). Confrontando i dati raccolti con pattern predefiniti e possibilmente con analisi mediche supplettive la app suggerisce modifiche allo stile di vita (recommendation). Via via che la persona viene monitorata altre modifiche sono suggerite e il loro effetto verificato. La parte back end della app raccoglie in modo anonimo i dati di molti utenti e utilizzando tecniche statistiche e di machine learning costruisce e raffina modelli e pattern predittivi da usare per le recommendation. Le recommendation iniziali sono derivate dalla letteratura scientifica su aging e well being (vedere ad esempio Fontana L., The path to longevity). Scopo di lungo termine della app è di raccogliere dati per validare e migliorare le recommendation.', 'Java, PhP', NULL, '2024-10-14', 'MSC','LM-32 (DM270)'),
        (7, 'Automatic classification of images of food', 's234567', 's122349', 'DEEP NEURAL NETWORKS, IMAGE PROCESSING, MACHINE LEARNING', 'EXPERIMENTAL' ,'SOFTENG', 'In many contexts it is important to track what a person eats (illnesses, fitness, allergies etc). A practical way to do this is to take a picture of the food eaten using a smartphone and having an automatic classifier capable of recognizing the food with high accuracy. Having recognized the food it is then possible to know the basic ingredients eaten (proteins, fats etc). Beyond food classification another open problem is characterizing the quantity eaten. This thesis consists in selecting a suitable open data set of tagged food pictures (ex Recipe1M+), trying various machine learning / deep learning techniques to build a classifier, using image processing techniques to infer the quantity of food eaten, with the goal of achieving the highest accuracy both in food classification and quantity computation.', 'Python, Java, machine learning approaches and libraries, focusing on image processing, image classification', NULL,'2024-10-13', 'MSC', 'LM-32 (DM270)'),
        (8, 'Analisi della qualità del codice e della sicurezza delle librerie software nell ambito dell IoT: un approccio basato sull analisi statica', 's234567', 's678901', 'ANALISI STATICA, IOT, SOFTWARE ENGINEERING', 'EXPERIMENTAL', 'SOFTENG, TORSEC', ' L Internet of Things (IoT) è una realtà sempre più presente nel nostro quotidiano e, di conseguenza, le esigenze di sicurezza e conformità sono sempre più pressanti. In questo contesto, la progettazione dell architettura software riveste un ruolo fondamentale nell orchestrazione di complessi processi di verifica. La tesi si inserisce nel contesto del progetto di ricerca "AsCoT-SCE", un progetto PRIN (Progetti di Rilevante Interesse Nazionale) recentemente approvato dal Ministero dell Università e della Ricerca, che mira a fornire strumenti e metodi per esprimere in forma processabile le funzionalità delle API standardizzate negli ambienti IoT e verificare la loro conformità. In questa tesi, gli studenti avranno l opportunità di progettare e realizzare un architettura software che funga da principale orchestratore per il processo di verifica della conformità nel contesto dell IoT. Gli studenti avranno modo inoltre di integrare i modelli e le policy provenienti da diverse unità di ricerca, mettendo in pratica le competenze acquisite nei corsi di Ingegneria del Software e Ingegneria del Software II. In particolare, gli studenti si troveranno a fronteggiare la sfida della progettazione orientata alla sicurezza (Security by Design), un concetto fondamentale nell attuale panorama della progettazione software, che prevede che la sicurezza sia integrata in ogni fase dello sviluppo di un sistema, piuttosto che essere aggiunta in un secondo momento. Questo lavoro di tesi rappresenterà un occasione unica per applicare le conoscenze teoriche in un progetto concreto, contribuendo attivamente alla ricerca nel campo della sicurezza IoT.', NULL ,NULL, '2024-06-19','MSC', 'LM-32 (DM270)'),
        (9, 'Dear Diary: experimenting with enhanced web development documentation artifacts', 's345678', 's328382, s009666', 'DOCUMENTAZIONE, PROGRAMMAZIONE, SOFTWARE, TECNOLOGIE WEB, WEB', 'RESEARCH, EXPERIMENTAL' ,'ELITE, SOFTENG', 'Novice programmers generally do not rely on documentation to keep track of the successes and errors they encounter during the development process: how they get working versions of their projects; how to overcome specific mistakes; what resources they consult; and the lessons learned. Consequently, critical aspects of the process development are constantly omitted from the documentation, which becomes useless to themselves or other developers who want to overcome the same problems or develop similar new projects. Based on these considerations, this thesis will focus on: * Getting familiar with Dear Diary, a tool we developed that supports non-expert programmers in creating context-dependent documentation artifacts during their development process. It has been implemented as a Visual Code Extension. It can automatically gather technical information from the development environment; and allows developers to enrich that knowledge with comments and notes. * Based on a preliminary assessment of the tool that has shed light on various usability issues, extend the tool while simplifying the interaction and enhancing usability. * Design and conduct a several-months user study to assess in the wild, on the one hand, the effectiveness of the usability improvements; and, on the other hand, the usefulness of the tool itself to guide the novices development process relying on their documentation. Analyze the data of the evaluation to gather new insights. If satisfactory, the result of the thesis will be released as an open-source project.', NULL, NULL, '2024-05-24','MSC', 'LM-32 (DM270)'),
        (10, 'Generative Methods to Enhance Creativity in User Interface Design', 's345678', 's298399', 'GENERATIVE ADVERSARIAL NETWORKS, HUMAN-COMPUTER INTERACTION, MACHINE LEARNING, USER EXPERIENCE, USER INTERFACE','EXPERIMENTAL, RESEARCH' ,'ELITE', 'This thesis focuses on the use of generative methods to enhance creativity in User Interface (UI) design. The emergence of generative methods, particularly deep learning techniques, has provided new opportunities for computer-aided design. Recent developments in generative adversarial networks (GANs) and autoencoders have shown promising results in generating creative content in various domains such as graphics, music, and text. However, the application of these methods in the field of UI design remains largely unexplored. UI design is a critical aspect of software development that greatly impacts user experience. However, the design process can be challenging due to the necessity of considering multiple factors, such as aesthetic appeal, usability, and accessibility. Generative methods have the potential to provide designers with novel and innovative design options, enhancing their creativity and supporting them in overcoming design challenges. The main goals of this thesis are: * Review the current state of the art in generative methods and their applications in creative design. * Develop a generative model for UI design that can provide creative and usable design options. * Evaluate the effectiveness and usability of the generated designs through user studies. If appropriate, the outcome of the work will be released as an open-source project.', 'Good programming skills and Python knowledge are required.', NULL, '2024-05-17', 'MSC' ,'LM-32 (DM270)'),
        (11, 'Incrementare la sicurezza di una smart home tramite smart home gateway e MUD', 's456789', 's328382', 'CYBERSECURITY, INTERNET OF THINGS, MUD, SECURITY, SMART HOME', 'EXPERIMENTAL' ,'ELITE', 'Recentemente, la Internet Engineering Task Force (IETF) ha proposto un nuovo standard (RFC 8520) relativo alla sicurezza IoT chiamato Manufacturer Usage Description (MUD). Questo standard sfrutta un approccio a white-list. Ogni produttore di un dispositivo IoT (il manufacturer) deve fornire un MUD file in cui vengono specificati gli endpoint con cui il dispositivo può comunicare (in trasmissione o in ricezione), tutti gli altri domini vengono invece bloccati. In questo modo vengono tutelati i dispositivi IoT da connessioni indesiderate e si riduce l eventualità che essi possano prendere parte ad attacchi DDoS (Distributed Denial of Service). Per gestire le smart home, vengono spesso impiegati degli smart home gateways (anche chiamati hub). Questi ultimi coordinano e comunicano con tutti i dispositivi connessi alla rete locale e sono spesso estendibili tramite plug-in. Perciò, questi hub possono essere un ottimo punto in cui inserire lo standard MUD (soprattutto se i dispositivi integrati non supportano MUD nativamente). Questo lavoro di tesi va ad integrarsi nelle attività di ricerca recentemente condotte dal gruppo su questa tecnologia e consisterà nel migliorare ed ottimizzare la generazione di un MUD file a livello di gateway. Nella soluzione da noi proposta, ogni sviluppatore di plug-in è chiamato a specificare gli endpoint che il suo plug-in necessita raggiungere (a prescindere se il plug-in integri un dispositivo o solamente una nuova funzionalità software). Specificando le comunicazioni desiderate, lo sviluppatore aumenta la sicurezza del suo plug-in e dell intero gateway in cui esso è installato. La piattaforma che verrà inizialmente presa in considerazione per lo sviluppo è Home Assistant. In particolare, i problemi che dovranno essere affrontati sono la sovrapposizione delle regole MUD specificate da ogni sviluppatore, la validità di tali regole e l affidabilità delle regole fornite dagli sviluppatori di plug-in.', '- Linguaggio di programmazione della piattaforma: Python; - Programmazione orientata agli oggetti; - Information System Security, nello specifico: - Concetti di crittografia asimmetrica, Public Key Infrastructure (PKI) e algoritmi di hash;', NULL, '2023-12-14', 'MSC', 'LM-32 (DM270)');