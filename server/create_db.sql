PRAGMA writable_schema = 1;
DELETE FROM sqlite_master WHERE type IN ('table', 'index', 'view');
PRAGMA writable_schema = 0;
VACUUM;
PRAGMA INTEGRITY_CHECK;


-- Create the new database
ATTACH DATABASE '/Users/lucatortore/Downloads/polito-se2-23-02-bc427ff623b6d9683c3c68b01f718e43c07ebc1a/polito-se2-23-02-thesis/server/cmsmall.db' AS new_db;

-- Create the Departments table
CREATE TABLE IF NOT EXISTS new_db.Degree (
    cod_degree INTEGER PRIMARY KEY,
    title_degree TEXT
);

CREATE TABLE IF NOT EXISTS new_db.Departments (
    department_id TEXT PRIMARY KEY,
    name TEXT
);

-- Create the Groups table with the department_id column
CREATE TABLE IF NOT EXISTS new_db.Groups (
    group_id TEXT PRIMARY KEY,
    name TEXT,
    department_id TEXT, -- Add the department_id column
    FOREIGN KEY (department_id) REFERENCES Departments(department_id)
);

CREATE TABLE IF NOT EXISTS new_db.Teachers (
    teacher_id INTEGER PRIMARY KEY,
    name TEXT,
    surname TEXT,
    email TEXT,
    department_id TEXT, -- Add the department_id column
    group_id TEXT, -- Add the department_id column
    FOREIGN KEY (department_id) REFERENCES Departments(department_id),
    FOREIGN KEY (group_id) REFERENCES GROUPS(group_id)
);

CREATE TABLE IF NOT EXISTS new_db.Students (
    student_id INTEGER PRIMARY KEY,
    name TEXT,
    surname TEXT,
    gender TEXT,
    nationality TEXT,
    email TEXT,
    cod_degree INTEGER, -- Add the department_id column
    enrollment_year YEAR, -- Add the department_id column
    FOREIGN KEY (cod_degree) REFERENCES Degree(cod_degree)
);

CREATE TABLE IF NOT EXISTS new_db.Proposals (
    proposal_id INTEGER PRIMARY KEY,
    teacher_id INTEGER,
    expiration_date DATE,
    cds INTEGER,
    supervisor TEXT,
    title TEXT,
    groups TEXT,
    description TEXT, 
    required_knoledge TEXT, 
    notes TEXT,
    level TEXT,
    cosupervisor INTEGER,
    keywords TEXT,
    type TEXT,  
    FOREIGN KEY (teacher_id) REFERENCES Teachers(teacher_id),
    FOREIGN KEY (cds) REFERENCES Degree(cod_degree),
    FOREIGN KEY (cosupervisor) REFERENCES Teachers(teacher_id)
);

CREATE TABLE IF NOT EXISTS new_db.Applications (
    proposal_id INTEGER,
    student_id INTEGER,
    state TEXT, -- Add the department_id column
    PRIMARY KEY (proposal_id, student_id),
    FOREIGN KEY (proposal_id) REFERENCES Proposals(proposal_id),
    FOREIGN KEY (student_id) REFERENCES Students(student_id)
);


CREATE TABLE IF NOT EXISTS new_db.USERS (
    email TEXT,
    password TEXT,
    FOREIGN KEY (email) REFERENCES Teachers(email),
    FOREIGN KEY (email) REFERENCES Students(email)
);

INSERT INTO Departments (department_id, name)
VALUES  ('DAUIN', 'Departments of Control and Computer Engineering'),
        ('DET', 'Departments of Electronics and Telecommunications'),
        ('DENERG', 'Departments of Energetical Engineering'),
        ('DISAT', 'Departments of Applied Science and Technology'),
        ('DISERG', 'Departments of Civil Engineering'),
        ('DIMEAS', 'Departments of Mechanical and Aerospace Engineering'),
        ('DAD', 'Departments of Architecture and Design');

INSERT INTO Degree (cod_degree, title_degree)
VALUES  (1, 'Computer Engineering'),
        (2, 'Civil Engineering'),
        (3, 'Mechanical Engineering'),
        (4, 'Automotive Engineering'),
        (5, 'Electronic and Communications Engineering'),
        (6, 'Chemical Engineering'),
        (7, 'Aerospace Engineering'),
        (8, 'Architecture');
    
INSERT INTO `Groups` (group_id, name, department_id)
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
        
INSERT INTO Teachers (teacher_id, name, surname, email, department_id, group_id)
VALUES  (1, 'Marco', 'Torchiano', 'marco.torchiano@polito.it', 'DAUIN', 'SOFTENG'),
        (2, 'Maurizio', 'Morisio', 'maurizio.morisio@polito.it', 'DAUIN', 'SOFTENG'),
        (3, 'Luigi', 'De Russis', 'luigi.derussis@polito.it', 'DAUIN', 'ELITE'),
        (4, 'Fulvio', 'Corno', 'fulvio.corno@polito.it', 'DAUIN', 'ELITE'),
        (6, 'Antonio', 'Lioy', 'antonio.lioy@polito.it', 'DAUIN', 'TORSEC'),
        (7, 'Cataldo', 'Basile', 'cataldo.basile@polito.it', 'DAUIN', 'TORSEC'),
        (8, 'Debora', 'Fino', 'debora.fino@polito.it', 'DISAT', 'CMPCS'),
        (9, 'Angela', 'Petruzzo', 'angela.petruzzo@polito.it', 'DISAT', 'CMPCS'),
        (10, 'Barbara', 'Onida', 'barbara.onida@polito.it', 'DISAT', 'SMAC'),
        (11, 'Luigi', 'Manna', 'luigi.manna@polito.it', 'DISAT', 'SMAC'),
        (12, 'Salvatore', 'Brischetto', 'salvatore.brischetto@polito.it', 'DIMEAS', 'ASTRA'),
        (13, 'Paolo', 'Maggiore', 'paolo.maggiore@polito.it', 'DIMEAS', 'ASTRA'),
        (14, 'Marcello', 'Romano', 'marcello.romano@polito.it', 'DIMEAS', 'ASTRADORS'),
        (15, 'Marco', 'Gherlone', 'marco.gherlone@polito.it', 'DIMEAS', 'AESDO'),
        (16, 'Marco', 'Esposito', 'marco.esposito@polito.it', 'DIMEAS', 'AESDO'),
        (17, 'Flavio', 'Canavero', 'flavio.canavero@polito.it', 'DET', 'EMC'),
        (18, 'Igor', 'Stievano', 'igor.stievano@polito.it', 'DET', 'EMC'),
        (19, 'Nicola', 'Amati', 'nicola.amati@polito.it', 'DET', 'LIM'),
        (20, 'Angelo', 'Bonifitto', 'angelo.bonfitto@polito.it', 'DET', 'LIM'),
        (21, 'Aldo', 'Canova', 'aldo.canova@polito.it', 'DENERG', 'CADEMA'),
        (22, 'Fabio', 'Freschi', 'fabio.freschi@polito.it', 'DENERG', 'CADEMA'),
        (23, 'Laura', 'Savoldi', 'laura.savoldi@polito.it', 'DENERG', 'MAHTEP'),
        (24, 'Daniele', 'Lerede', 'daniele.lerede@polito.it', 'DENERG', 'MAHTEP'),
        (25, 'Federico', 'millo', 'federico.millo@polito.it', 'DENERG', 'E3');

INSERT INTO Students (student_id, name, surname, gender, nationality, email, cod_degree, enrollment_year)
VALUES  (1, 'Luca', 'Tortore', 'Male', 'Italy', 's319823@studenti.polito.it', 1, 2023),
        (2, 'Carlos', 'Valeriano', 'Male', 'Italy', 's308747@studenti.polito.it', 1, 2022),
        (3, 'Lorenzo', 'Bertetto', 'Male', 'Italy', 's309618@studenti.polito.it', 1, 2022),
        (4, 'Franscesco', 'Baracco', 'Male', 'Italy', 's317743@studenti.polito.it', 1, 2022),
        (5, 'Lenny', 'Girardot', 'Male', 'France', 's321503@studenti.polito.it', 1, 2023),
        (6, 'Ghazal', 'Ghorbani', 'Female', 'Iran', 's308920@studenti.polito.it', 1, 2023),
        (7, 'Mario', 'Rossi', 'Male', 'Italy', 'test1@studenti.polito.it', 2, 2023),
        (8, 'John', 'Smith', 'Male', 'England', 'test2@studenti.polito.it', 3, 2023),
        (9, 'Sophia', 'Lagrange', 'Female', 'USA', 'test3@studenti.polito.it', 4, 2023),
        (10, 'Karl', 'Ulfstain', 'Male', 'Germany', 'test4@studenti.polito.it', 5, 2022),
        (11, 'Wei', 'Wang', 'Male', 'China', 'test5@studenti.polito.it', 6, 2022),
        (12, 'Ariel', 'Phuaviach', 'Male', 'Poland', 'test7@studenti.polito.it', 7, 2022),
        (13, 'Elizabeth', 'McScrooge', 'Female', 'Englad', 'test8@studenti.polito.it', 8, 2023);

INSERT INTO Proposals (proposal_id, teacher_id, expiration_date, cds, supervisor, title ,`groups`, description, required_knoledge, notes, level, cosupervisor, keywords, type)
VALUES (1, 1, '2023-12-18', 1, 'Marco Torchiano', 'Gamification di attività di modellazione UML' ,'SOFTENG', '	La gamification è definita come l applicazione di elementi tipici dei videogiochi
        (punteggi, competizione con altri utenti, regole di gioco, ecc.) a qualsiasi altra attività, in modo da incrementare il coinvolgimento e le prestazioni degli utenti coinvolti. Lobiettivo della tesi è lapplicazione di caratteristiche tipiche della gamification alla pratica della modellazione UML, e la valutazione dei benefici derivanti.
        La tesi consisterà nello sviluppo di una piattaforma con funzionalità di gaming competitivo della costruzione di diagrammi delle classi UML.
        I meccanismi di gamification dovranno premiare diversi aspetti di qualità del modello costruito, quali completezza, correttezza, coerenza, minimalità e leggibilità.
        Il sistema dovrà prevedere funzionalità di mantenimento dello storico dei punteggi, e di visualizzazione della classifica corrente dei giocatori.', 'UML Modeling, Java', 'Luca Ardito', 'MSC', 1, 'GAMIFICATION, SOFTWARE ENGINEERING, SOFTWARE QUALITY, UML', 'RESEARCH'),
        (2, 1, '2023-12-28', 1, 'Marco Torchiano', 'Analisi empirica dei difetti in R Markdown' ,'SOFTENG', 'I file R Markdown sono adottati ampiamente per lo sviluppo iterativo di workflow di analisi e visualizzazione dei dati.
        Laffidabilità dei risultati e la possibilità di riutilizzare le analisi dipendono pesantemente dalla correttezza dei file Rmd.
        Obiettivo della tesi è quello di analizzare file Rmd disponibili in repository pubblici e identificare e classificare i difetti.', 'Linguaggio R, Ambiente R Studio', NULL, 'MSC', 1, NULL, 'RESEARCH'),
        (3, 1, '2023-11-30', 1, 'Marco Torchiano', 'Data-centric AI: Dataset augmentation techniques for bias and data quality improvement' ,'SOFTENG', '	Clearbox AI Control Room has a feature to generate synthetic datasets for dataset augmentation. The thesis work is focused in the experimentation of techniques that can help detect bias in the original datasets and mitigate them by augmenting the original dataset using synthetic points. The project will require identifying the types of bias within a dataset and identifying intervention mechanisms to remove the bias using synthetic data generation methods.
        Clearbox AI is an innovative SME, incubated in I3P, winner of the National Innovation Award (PNI 2019) in the ICT category and the EU Seal of Excellence awarded by the European Commission. Clearbox AI is developing a unique and innovative technology ("AI Control Room"), which allows to put into production artificial intelligence models that are robust, explainable and monitorable over time.', 'Good programming skills and basic knowledge of common data analytics tools and techniques. Grade point average equal to or higher than 26 will play a relevant role in the selection.', NULL, 'MSC', 1, 'Data-centric AI: Dataset augmentation techniques for bias and data quality improvement', 'COMPANY, EXPERIMENTAL, RESEARCH'),
        (4, 1, '2023-11-30', 1, 'Marco Torchiano', 'Detecting the risk discrimination in classifiers with imbalance measures','SOFTENG', '	Having imbalanced classes in a training set can impact the outcome of the classification model in several ways.
        First, an imbalanced dataset can bias the classification model towards the majority class. Since the model is trained on a dataset with a majority of negative examples, it will be more likely to predict the negative class, even when presented with examples of the positive class. This can lead to poor performance on the minority class, such as a low recall or precision rate.
        Second, imbalanced data can also make it more difficult for the model to learn the underlying relationships between the features and the classes. With a large number of negative examples and a small number of positive examples, the model may have difficulty finding the signal in the data that distinguishes the positive class from the negative class. This can lead to suboptimal model performance on both classes.
        In both cases, when the objects of automated decision are individuals, such disparate performance of the algorithm means in practice to systematically and unfairly discriminate against certain individuals or groups of individuals in favor of others [by denying] an opportunity for a good or [assigning] an undesirable out- come to an individual or groups of individuals on grounds that are unreasonable or inappropriate.
        The goal of the thesis is to test the capability of imbalance measures to predict unfair classifications
        Previous work on the topic and material (a few initial metrics, code, datasets) will be made available.', 'Good programming skills and basic knowledge of common data analytics tools and techniques. Grade point average equal to or higher than 26 can be a criterion for selection of candidate.', '	When sending your application, we kindly ask you to attach the following information:
        - list of exams taken in you master degree, with grades and grade point average
        - a résumé or equivalent (e.g., linkedin profile), if you already have one
        - by when you aim to graduate and an estimate of the time you can devote to the thesis in a typical week', 'MSC', 1, 'DATA QUALITY, DATA SCIENCE, OPEN DATA, OPEN GOVERNMENT DATA, SOFTWARE ENGINEERING', 'EXPERIMENTAL, RESEARCH'),
        (5, 1, '2023-12-18', 1, 'Marco Torchiano', 'Valutazione di esercizi di programmazione tramite debito tecnico' ,'SOFTENG', '		Il concetto di Debito Tecnico si sta diffondendo negli ultimi anni per descrivere le problematiche introdotto, più o meno coscientemente, per ridurre i costi ed i tempi di sviluppo del software.
        Obiettivo di questa tesi è indagare se il Debito Tecnico, solitamente è un concetto applicato al software industriale di grandi dimensioni, può essere applicato al software sviluppato dagli studenti come esercizio di programmazione.', NULL, NULL, 'MSC', 1, 'SOFTWARE QUALITY', 'RESEARCH'),
        (6, 2, '2024-10-14', 1, 'Maurizo Morisio', 'Well being app','SOFTENG', '	Obbiettivo della tesi è sviluppare una app e relativo back end per supportare le persone a perseguire uno stile di vita salutare.
        La app raccoglie (direttamente, o tramite device esterni tipo smartwatch o fitbit) dati sulla vita della persona (attività fisica, qualità e durata del sonno, pressione, pulsazioni) (nutrizione, tipo e quantità del cibo mangiato e delle bevande). Confrontando i dati raccolti con pattern predefiniti e possibilmente con analisi mediche supplettive la app suggerisce modifiche allo stile di vita (recommendation). Via via che la persona viene monitorata altre modifiche sono suggerite e il loro effetto verificato.
        La parte back end della app raccoglie in modo anonimo i dati di molti utenti e utilizzando tecniche statistiche e di machine learning costruisce e raffina modelli e pattern predittivi da usare per le recommendation.
        Le recommendation iniziali sono derivate dalla letteratura scientifica su aging e well being (vedere ad esempio Fontana L., The path to longevity). Scopo di lungo termine della app è di raccogliere dati per validare e migliorare le recommendation.', 'Java, PhP', NULL, 'MSC', 2, 'MOBILE APP DEVELOPEMENT, WEB DEVELOPMENT', 'EXPERIMENTAL'),
        (7, 2, '2024-10-13', 1, 'Maurizo Morisio', 'Automatic classification of images of food','SOFTENG', '	In many contexts it is important to track what a person eats (illnesses, fitness, allergies etc). A practical way to do this is to take a picture of the food eaten using a smartphone and having an automatic classifier capable of recognizing the food with high accuracy. Having recognized the food it is then possible to know the basic ingredients eaten (proteins, fats etc). Beyond food classification another open problem is characterizing the quantity eaten.
        This thesis consists in selecting a suitable open data set of tagged food pictures (ex Recipe1M+), trying various machine learning / deep learning techniques to build a classifier, using image processing techniques to infer the quantity of food eaten, with the goal of achieving the highest accuracy both in food classification and quantity computation.', 'Python, Java, machine learning approaches and libraries, focusing on image processing, image classification', NULL, 'MSC', 2, 'DEEP NEURAL NETWORKS, IMAGE PROCESSING, MACHINE LEARNING', 'EXPERIMENTAL'),
        (8, 2, '2024-06-19', 1, 'Maurizo Morisio', 'Analisi della qualità del codice e della sicurezza delle librerie software nell ambito dell IoT: un approccio basato sull analisi static' ,'SOFTENG', '	LInternet of Things (IoT) è una realtà sempre più presente nel nostro quotidiano e, di conseguenza, le esigenze di sicurezza e conformità sono sempre più pressanti. In questo contesto, la progettazione dellarchitettura software riveste un ruolo fondamentale nell orchestrazione di complessi processi di verifica.
        La tesi si inserisce nel contesto del progetto di ricerca "AsCoT-SCE", un progetto PRIN (Progetti di Rilevante Interesse Nazionale) recentemente approvato dal Ministero dell Università e della Ricerca, che mira a fornire strumenti e metodi per esprimere in forma processabile le funzionalità delle API standardizzate negli ambienti IoT e verificare la loro conformità.
        In questa tesi, gli studenti avranno lopportunità di progettare e realizzare un architettura software che funga da principale orchestratore per il processo di verifica della conformità nel contesto dell IoT. Gli studenti avranno modo inoltre di integrare i modelli e le policy provenienti da diverse unità di ricerca, mettendo in pratica le competenze acquisite nei corsi di Ingegneria del Software e Ingegneria del Software II.
        In particolare, gli studenti si troveranno a fronteggiare la sfida della progettazione orientata alla sicurezza (Security by Design), un concetto fondamentale nell attuale panorama della progettazione software, che prevede che la sicurezza sia integrata in ogni fase dello sviluppo di un sistema, piuttosto che essere aggiunta in un secondo momento.
        Questo lavoro di tesi rappresenterà un occasione unica per applicare le conoscenze teoriche in un progetto concreto, contribuendo attivamente alla ricerca nel campo della sicurezza IoT.', NULL, NULL, 'MSC', 2, 'ANALISI STATICA, IOT, SOFTWARE ENGINEERING', 'EXPERIMENTAL'),
        (9, 3, '2024-05-24', 1, 'Luigi De Russis', 'Dear Diary: experimenting with enhanced web development documentation artifacts' ,'ELITE', 'Novice programmers generally do not rely on documentation to keep track of the successes and errors they encounter during the development process: how they get working versions of their projects; how to overcome specific mistakes; what resources they consult; and the lessons learned. Consequently, critical aspects of the process development are constantly omitted from the documentation, which becomes useless to themselves or other developers who want to overcome the same problems or develop similar new projects.
        Based on these considerations, this thesis will focus on:
        * Getting familiar with Dear Diary, a tool we developed that supports non-expert programmers in creating context-dependent documentation artifacts during their development process. It has been implemented as a Visual Code Extension. It can automatically gather technical information from the development environment; and allows developers to enrich that knowledge with comments and notes.
        * Based on a preliminary assessment of the tool that has shed light on various usability issues, extend the tool while simplifying the interaction and enhancing usability.
        * Design and conduct a several-months user study to assess in the wild, on the one hand, the effectiveness of the usability improvements; and, on the other hand, the usefulness of the tool itself to guide the novices development process relying on their documentation. Analyze the data of the evaluation to gather new insights.
        If satisfactory, the result of the thesis will be released as an open-source project.', NULL, NULL, 'MSC', 3, 'DOCUMENTAZIONE, PROGRAMMAZIONE, SOFTWARE, TECNOLOGIE WEB, WEB', 'RESEARCH, EXPERIMENTAL'),
        (10, 3, '2024-05-17', 1, 'Luigi De Russis', 'Generative Methods to Enhance Creativity in User Interface Design' ,'ELITE', 'This thesis focuses on the use of generative methods to enhance creativity in User Interface (UI) design. The emergence of generative methods, particularly deep learning techniques, has provided new opportunities for computer-aided design. Recent developments in generative adversarial networks (GANs) and autoencoders have shown promising results in generating creative content in various domains such as graphics, music, and text. However, the application of these methods in the field of UI design remains largely unexplored.
        UI design is a critical aspect of software development that greatly impacts user experience. However, the design process can be challenging due to the necessity of considering multiple factors, such as aesthetic appeal, usability, and accessibility. Generative methods have the potential to provide designers with novel and innovative design options, enhancing their creativity and supporting them in overcoming design challenges.
        The main goals of this thesis are:
        * Review the current state of the art in generative methods and their applications in creative design.
        * Develop a generative model for UI design that can provide creative and usable design options.
        * Evaluate the effectiveness and usability of the generated designs through user studies.
        If appropriate, the outcome of the work will be released as an open-source project.', 'Good programming skills and Python knowledge are required.', NULL, 'MSC', 3, 'GENERATIVE ADVERSARIAL NETWORKS, HUMAN-COMPUTER INTERACTION, MACHINE LEARNING, USER EXPERIENCE, USER INTERFACE', 'EXPERIMENTAL, RESEARCH'),
        (11, 4, '2023-12-14', 1, ' Fulvio Corno', 'ELITE', 'Incrementare la sicurezza di una smart home tramite smart home gateway e MUD' ,'Recentemente, la Internet Engineering Task Force (IETF) ha proposto un nuovo standard (RFC 8520) relativo alla sicurezza IoT chiamato Manufacturer Usage Description (MUD).
        Questo standard sfrutta un approccio a white-list. Ogni produttore di un dispositivo IoT (il manufacturer) deve fornire un MUD file in cui vengono specificati gli endpoint con cui il dispositivo può comunicare (in trasmissione o in ricezione), tutti gli altri domini vengono invece bloccati. In questo modo vengono tutelati i dispositivi IoT da connesioni indesiderate e si riduce l eventualità che essi possano prendere parte ad attacchi DDoS (Distributed Denial of Service).
        Per gestire le smart home, vengono spesso impiegati degli smart home gateway (anche chiamati hub). Questi ultimi coordinano e comunicano con tutti i dispositivi connessi alla rete locale e sono spesso estendibili tramite plug-in.
        Perciò, questi hub possono essere un ottimo punto in cui inserire lo standard MUD (soprattutto se i dispositivi integrati non supportano MUD nativamente).
        Questo lavoro di tesi va ad integrarsi nelle attività di ricerca recentemente condotte dal gruppo su questa tecnologia e consisterà nel migliorare ed ottimizzare la generazione di un MUD file a livello di gateway.
        Nella soluzione da noi proposta, ogni sviluppatore di plug-in è chiamato a specificare gli endpoint che il suo plug-in necessita raggiungere (a prescindere se il plug-in integri un dispositivo o solamente una nuova funzionalità software). Specificando le comunicazioni desiderate, lo sviluppatore aumenta la sicurezza del suo plug-in e dell intero gateway in cui esso è installato.
        La piattaforma che verrà inizialmente presa in considerazione per lo sviluppo è Home Assistant.
        In particolare, i problemi che dovranno essere affrontati sono la sovrapposizione delle regole MUD specificate da ogni sviluppatore, la validità di tali regole e l affidabilità delle regole fornite dagli sviluppatori di plug-in.
        ', '- Linguaggio di programmazione della piattaforma: Python;
        - Programmazione orientata agli oggetti;
        - Information System Security, nello specifico:
        - Concetti di crittografia asimmetrica, Public Key Infrastructure (PKI) e algoritmi di hash;', NULL, 'MSC', 4, 'CYBERSECURITY, INTERNET OF THINGS, MUD, SECURITY, SMART HOME', 'EXPERIMENTAL');
                
INSERT INTO Applications (proposal_id, student_id, state)
VALUES  (3, 1, 'pending'),
        (1, 6, 'accepted'),
        (2, 2, 'pending'),
        (3, 6, 'pending'),
        (7, 4, 'pending'),
        (3, 8, 'pending'),
        (1, 1, 'rejected'),
        (1, 4, 'rejected'),
        (5, 3, 'pending'),
        (5, 13, 'pending'),
        (5, 7, 'pending'),
        (10, 4, 'accepted'),
        (10, 10, 'rejected'),
        (10, 9, 'rejected');
INSERT INTO USERS (email, password)
VALUES  ('marco.torchiano@polito.it', 'password'),
        ('s309618@studenti.polito.it', 'password'),
        ('test1@studenti.polito.it', 'password');
