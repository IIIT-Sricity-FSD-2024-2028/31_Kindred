-- ============================================================
--  DISASTER RELIEF MULTI-ORGANIZATIONAL SYSTEM
--  Database Schema — All Entities
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. LOCATION
-- ─────────────────────────────────────────────────────────────
CREATE TABLE Location (
    pincode          VARCHAR(10)  PRIMARY KEY,
    location_name    VARCHAR(100) NOT NULL,
    city             VARCHAR(100) NOT NULL,
    state            VARCHAR(100) NOT NULL
);

-- ─────────────────────────────────────────────────────────────
-- 2. DISASTER TYPE
-- ─────────────────────────────────────────────────────────────
CREATE TABLE Disaster_Type (
    disaster_type_id INT          PRIMARY KEY AUTO_INCREMENT,
    type_name        VARCHAR(100) NOT NULL UNIQUE
);

-- ─────────────────────────────────────────────────────────────
-- 3. RESOURCE TYPE
-- ─────────────────────────────────────────────────────────────
CREATE TABLE Resource_Type (
    resource_type_id   INT          PRIMARY KEY AUTO_INCREMENT,
    resource_type_name VARCHAR(100) NOT NULL UNIQUE
);

-- ─────────────────────────────────────────────────────────────
-- 4. TASK TYPE
-- ─────────────────────────────────────────────────────────────
CREATE TABLE Task_Type (
    task_type_id INT          PRIMARY KEY AUTO_INCREMENT,
    type_name    VARCHAR(100) NOT NULL UNIQUE
);

-- ─────────────────────────────────────────────────────────────
-- 5. USER  (supertype — ISA parent)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE User (
    user_id         INT          PRIMARY KEY AUTO_INCREMENT,
    user_name       VARCHAR(100) NOT NULL,
    user_email      VARCHAR(150) NOT NULL UNIQUE,
    user_contact    VARCHAR(20),
    user_address    TEXT,
    password        VARCHAR(255) NOT NULL,
    role            ENUM('volunteer','administrator','donor','beneficiary') NOT NULL,
    registered_date DATE         NOT NULL DEFAULT (CURRENT_DATE)
);

-- ─────────────────────────────────────────────────────────────
-- 6. ORGANIZATION
-- ─────────────────────────────────────────────────────────────
CREATE TABLE Organization (
    organization_id      INT          PRIMARY KEY AUTO_INCREMENT,
    organization_name    VARCHAR(150) NOT NULL,
    organization_email   VARCHAR(150) UNIQUE,
    organization_contact VARCHAR(20),
    organization_address TEXT
);

-- ─────────────────────────────────────────────────────────────
-- 7. VOLUNTEER  (ISA subtype of User)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE Volunteer (
    volunteer_id        INT PRIMARY KEY AUTO_INCREMENT,
    user_id             INT NOT NULL UNIQUE,
    gender              ENUM('male','female','other'),
    availability        BOOLEAN DEFAULT TRUE,
    verification_status ENUM('pending','verified','rejected') DEFAULT 'pending',
    CONSTRAINT fk_vol_user FOREIGN KEY (user_id) REFERENCES User(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- ─────────────────────────────────────────────────────────────
-- 8. ADMINISTRATOR  (ISA subtype of User)
--    Many-to-1: many admins → one organization
-- ─────────────────────────────────────────────────────────────
CREATE TABLE Administrator (
    administrator_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id          INT NOT NULL UNIQUE,
    organization_id  INT NOT NULL,
    role             VARCHAR(100),
    CONSTRAINT fk_admin_user FOREIGN KEY (user_id)
        REFERENCES User(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_admin_org  FOREIGN KEY (organization_id)
        REFERENCES Organization(organization_id) ON UPDATE CASCADE
);

-- ─────────────────────────────────────────────────────────────
-- 9. DONOR  (ISA subtype of User)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE Donor (
    donor_id   INT PRIMARY KEY AUTO_INCREMENT,
    user_id    INT NOT NULL UNIQUE,
    donor_type ENUM('individual','corporate','ngo','government') DEFAULT 'individual',
    CONSTRAINT fk_donor_user FOREIGN KEY (user_id)
        REFERENCES User(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ─────────────────────────────────────────────────────────────
-- 10. BENEFICIARY  (ISA subtype of User)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE Beneficiary (
    beneficiary_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id        INT NOT NULL UNIQUE,
    CONSTRAINT fk_ben_user FOREIGN KEY (user_id)
        REFERENCES User(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ─────────────────────────────────────────────────────────────
-- 11. TASK  (strong entity)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE Task (
    task_id         INT          PRIMARY KEY AUTO_INCREMENT,
    task_name       VARCHAR(150) NOT NULL,
    task_type_id    INT          NOT NULL,
    task_status     ENUM('open','in_progress','completed','cancelled') DEFAULT 'open',
    start_date      DATE,
    end_date        DATE,
    pincode         VARCHAR(10),              -- performed at location
    organization_id INT          NOT NULL,
    CONSTRAINT fk_task_type FOREIGN KEY (task_type_id)
        REFERENCES Task_Type(task_type_id) ON UPDATE CASCADE,
    CONSTRAINT fk_task_loc  FOREIGN KEY (pincode)
        REFERENCES Location(pincode) ON UPDATE CASCADE,
    CONSTRAINT fk_task_org  FOREIGN KEY (organization_id)
        REFERENCES Organization(organization_id) ON UPDATE CASCADE
);

-- ─────────────────────────────────────────────────────────────
-- 12. RESOURCES  (strong entity)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE Resources (
    resource_id         INT          PRIMARY KEY AUTO_INCREMENT,
    resource_name       VARCHAR(150) NOT NULL,
    resource_type_id    INT          NOT NULL,
    organization_id     INT          NOT NULL,
    quantity            INT          NOT NULL DEFAULT 0,
    availability_status ENUM('available','depleted','reserved') DEFAULT 'available',
    CONSTRAINT fk_res_type FOREIGN KEY (resource_type_id)
        REFERENCES Resource_Type(resource_type_id) ON UPDATE CASCADE,
    CONSTRAINT fk_res_org  FOREIGN KEY (organization_id)
        REFERENCES Organization(organization_id) ON UPDATE CASCADE
);

-- ─────────────────────────────────────────────────────────────
-- 13. DONATIONS  (strong entity)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE Donations (
    donation_id     INT            PRIMARY KEY AUTO_INCREMENT,
    organization_id INT            NOT NULL,
    donor_id        INT            NOT NULL,
    donation_type   ENUM('cash','goods','service') NOT NULL,
    donation_amount DECIMAL(12, 2) DEFAULT 0.00,
    donation_date   DATE           NOT NULL DEFAULT (CURRENT_DATE),
    payment_method  VARCHAR(50),
    status          ENUM('pending','confirmed','rejected') DEFAULT 'pending',
    CONSTRAINT fk_don_org   FOREIGN KEY (organization_id)
        REFERENCES Organization(organization_id) ON UPDATE CASCADE,
    CONSTRAINT fk_don_donor FOREIGN KEY (donor_id)
        REFERENCES Donor(donor_id) ON UPDATE CASCADE
);

-- ─────────────────────────────────────────────────────────────
-- 14. VOLUNTEER APPLICATION  ← WEAK entity
--     Partial key: application_date
--     Owner entities: Volunteer + Task
-- ─────────────────────────────────────────────────────────────
CREATE TABLE Volunteer_Application (
    volunteer_id       INT  NOT NULL,
    task_id            INT  NOT NULL,
    application_date   DATE NOT NULL DEFAULT (CURRENT_DATE),
    application_status ENUM('pending','accepted','rejected') DEFAULT 'pending',
    PRIMARY KEY (volunteer_id, task_id),
    CONSTRAINT fk_va_vol  FOREIGN KEY (volunteer_id)
        REFERENCES Volunteer(volunteer_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_va_task FOREIGN KEY (task_id)
        REFERENCES Task(task_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ─────────────────────────────────────────────────────────────
-- 15. VOLUNTEER ASSIGNMENT  ← WEAK entity
--     Partial key: assigned_date
--     Owner entities: Volunteer + Task
-- ─────────────────────────────────────────────────────────────
CREATE TABLE Volunteer_Assignment (
    volunteer_id  INT  NOT NULL,
    task_id       INT  NOT NULL,
    hours_logged  DECIMAL(6, 2) DEFAULT 0.00,
    assigned_date DATE NOT NULL DEFAULT (CURRENT_DATE),
    PRIMARY KEY (volunteer_id, task_id),
    CONSTRAINT fk_vasgn_vol  FOREIGN KEY (volunteer_id)
        REFERENCES Volunteer(volunteer_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_vasgn_task FOREIGN KEY (task_id)
        REFERENCES Task(task_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ─────────────────────────────────────────────────────────────
-- 16. BENEFICIARY REQUEST  ← WEAK entity
--     Partial key: request_date
--     Owner entities: Beneficiary + Organization
-- ─────────────────────────────────────────────────────────────
CREATE TABLE Beneficiary_Request (
    beneficiary_id   INT  NOT NULL,
    organization_id  INT  NOT NULL,
    request_date     DATE NOT NULL DEFAULT (CURRENT_DATE),
    pincode          VARCHAR(10),
    request_status   ENUM('pending','approved','rejected','fulfilled') DEFAULT 'pending',
    disaster_type_id INT,
    PRIMARY KEY (beneficiary_id, organization_id, request_date),
    CONSTRAINT fk_br_ben   FOREIGN KEY (beneficiary_id)
        REFERENCES Beneficiary(beneficiary_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_br_org   FOREIGN KEY (organization_id)
        REFERENCES Organization(organization_id) ON UPDATE CASCADE,
    CONSTRAINT fk_br_loc   FOREIGN KEY (pincode)
        REFERENCES Location(pincode) ON UPDATE CASCADE,
    CONSTRAINT fk_br_dtype FOREIGN KEY (disaster_type_id)
        REFERENCES Disaster_Type(disaster_type_id) ON UPDATE CASCADE
);

-- ─────────────────────────────────────────────────────────────
-- 17. DONATION ITEMS  ← WEAK entity
--     Partial key: resource_id
--     Owner entity: Donations
-- ─────────────────────────────────────────────────────────────
CREATE TABLE Donation_Items (
    donation_id INT NOT NULL,
    resource_id INT NOT NULL,
    quantity    INT NOT NULL DEFAULT 1,
    PRIMARY KEY (donation_id, resource_id),
    CONSTRAINT fk_di_don FOREIGN KEY (donation_id)
        REFERENCES Donations(donation_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_di_res FOREIGN KEY (resource_id)
        REFERENCES Resources(resource_id) ON UPDATE CASCADE
);

-- ─────────────────────────────────────────────────────────────
-- 18. RESOURCE ALLOCATION  ← WEAK entity
--     Partial key: allocation_date
--     Owner entities: Resources + Task
-- ─────────────────────────────────────────────────────────────
CREATE TABLE Resource_Allocation (
    resource_id        INT  NOT NULL,
    task_id            INT  NOT NULL,
    allocated_quantity INT  NOT NULL DEFAULT 0,
    allocation_date    DATE NOT NULL DEFAULT (CURRENT_DATE),
    allocation_status  ENUM('allocated','returned','lost') DEFAULT 'allocated',
    PRIMARY KEY (resource_id, task_id),
    CONSTRAINT fk_ra_res  FOREIGN KEY (resource_id)
        REFERENCES Resources(resource_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ra_task FOREIGN KEY (task_id)
        REFERENCES Task(task_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ─────────────────────────────────────────────────────────────
-- 19. REQUEST ITEM  ← WEAK entity
--     Partial key: resource_id
--     Owner entity: Beneficiary_Request
-- ─────────────────────────────────────────────────────────────
CREATE TABLE Request_Item (
    beneficiary_id     INT NOT NULL,
    organization_id    INT NOT NULL,
    request_date       DATE NOT NULL,
    resource_id        INT NOT NULL,
    quantity_requested INT NOT NULL DEFAULT 1,
    PRIMARY KEY (beneficiary_id, organization_id, request_date, resource_id),
    CONSTRAINT fk_ri_br  FOREIGN KEY (beneficiary_id, organization_id, request_date)
        REFERENCES Beneficiary_Request(beneficiary_id, organization_id, request_date)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ri_res FOREIGN KEY (resource_id)
        REFERENCES Resources(resource_id) ON UPDATE CASCADE
);

-- ============================================================
--  END OF SCHEMA
-- ============================================================
