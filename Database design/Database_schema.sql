CREATE DATABASE KINDRED;
USE KINDRED;

CREATE TABLE Users (
    user_id INT PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(100) UNIQUE NOT NULL,
    user_contact VARCHAR(15) NOT NULL,
    user_address TEXT,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30)
        CHECK (role IN ('VOLUNTEER','DONOR','BENEFICIARY','ADMINISTRATOR')),
    registered_date DATE NOT NULL
);

CREATE TABLE Volunteer (
    volunteer_id INT PRIMARY KEY,
    user_id INT UNIQUE,
    gender VARCHAR(10),
    availability VARCHAR(20)
        CHECK (availability IN ('AVAILABLE','NOT_AVAILABLE')),
    verification_status VARCHAR(20)
        CHECK (verification_status IN ('VERIFIED','PENDING','REJECTED')),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Donor (
    donor_id INT PRIMARY KEY,
    user_id INT UNIQUE,
    donor_type VARCHAR(20)
        CHECK (donor_type IN ('COMPANY','INDIVIDUAL')),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Beneficiary (
    beneficiary_id INT PRIMARY KEY,
    user_id INT UNIQUE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Organization (
    organization_id INT PRIMARY KEY,
    organization_name VARCHAR(150) NOT NULL,
    organization_email VARCHAR(100) UNIQUE,
    organization_contact VARCHAR(15),
    organization_address TEXT
);

CREATE TABLE Administrator (
    administrator_id INT PRIMARY KEY,
    user_id INT UNIQUE,
    role VARCHAR(40)
        CHECK (role IN ('PLATFORM_ADMINISTRATOR','ORGANIZATION_ADMINISTRATOR')),
    organization_id INT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (organization_id) REFERENCES Organization(organization_id)
);

CREATE TABLE Task_Type (
    task_type_id INT PRIMARY KEY,
    type_name VARCHAR(40)
        CHECK (type_name IN
            ('RELIEF','RESCUE','MEDICAL','SUPPLY_DISTRIBUTION','VOLUNTEER_SUPPORT'))
);

CREATE TABLE Location (
    pincode INT PRIMARY KEY,
    location_name VARCHAR(100),
    city VARCHAR(100),
    state VARCHAR(100)
);

CREATE TABLE Task (
 task_id INT PRIMARY KEY,
 task_name VARCHAR(150),
 task_type_id INT,
 task_status VARCHAR(20)
 CHECK (task_status IN ('PENDING','ONGOING','COMPLETED','CANCELLED')),
 start_date DATE,
 end_date DATE,
 pincode INT,
 organization_id INT,
CHECK (end_date IS NULL OR end_date >= start_date),
FOREIGN KEY (task_type_id) REFERENCES Task_Type(task_type_id),
FOREIGN KEY (pincode) REFERENCES Location(pincode),
FOREIGN KEY (organization_id) REFERENCES Organization(organization_id)
);

CREATE TABLE Resource_Type (
    resource_type_id INT PRIMARY KEY,
    type_name VARCHAR(100)
);

CREATE TABLE Resources (
    resource_id INT PRIMARY KEY,
    resource_name VARCHAR(100),
    resource_type_id INT,
    organization_id INT,
    quantity INT CHECK (quantity >= 0),
    availability_status VARCHAR(20)
        CHECK (availability_status IN ('AVAILABLE','NOT_AVAILABLE')),
    FOREIGN KEY (resource_type_id) REFERENCES Resource_Type(resource_type_id),
    FOREIGN KEY (organization_id) REFERENCES Organization(organization_id)
);

CREATE TABLE Disaster_Type (
    disaster_type_id INT PRIMARY KEY,
    type_name VARCHAR(100)
);

CREATE TABLE Volunteer_Application (
application_id INT PRIMARY KEY,
volunteer_id INT NOT NULL,
task_id INT NOT NULL,
application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
application_status VARCHAR(20)
CHECK (application_status IN ('PENDING','APPROVED','REJECTED','WITHDRAWN')),
organization_id INT,
UNIQUE (volunteer_id, task_id),
FOREIGN KEY (volunteer_id) REFERENCES Volunteer(volunteer_id),
FOREIGN KEY (task_id) REFERENCES Task(task_id),
FOREIGN KEY (organization_id) REFERENCES Organization(organization_id)
);

CREATE TABLE Volunteer_Assignment (
assignment_id INT PRIMARY KEY,
application_id INT UNIQUE,
volunteer_id INT NOT NULL,
task_id INT NOT NULL,
hours_logged DECIMAL(6,2) CHECK (hours_logged >= 0),
assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (application_id) REFERENCES Volunteer_Application(application_id),
FOREIGN KEY (volunteer_id) REFERENCES Volunteer(volunteer_id),
FOREIGN KEY (task_id) REFERENCES Task(task_id)
);

CREATE TABLE Beneficiary_Request (
    beneficiary_request_id INT PRIMARY KEY,
    beneficiary_id INT,
    organization_id INT,
    pincode INT,
    disaster_type_id INT,
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    request_status VARCHAR(20)
        CHECK (request_status IN ('PENDING','APPROVED','REJECTED','FULFILLED')),
    FOREIGN KEY (beneficiary_id) REFERENCES Beneficiary(beneficiary_id),
    FOREIGN KEY (organization_id) REFERENCES Organization(organization_id),
    FOREIGN KEY (pincode) REFERENCES Location(pincode),
    FOREIGN KEY (disaster_type_id) REFERENCES Disaster_Type(disaster_type_id)
);

CREATE TABLE Request_Item (
 request_item_id INT PRIMARY KEY,
 beneficiary_request_id INT,
 resource_id INT,
 quantity_requested INT CHECK (quantity_requested > 0),
UNIQUE (beneficiary_request_id, resource_id),
FOREIGN KEY (beneficiary_request_id)
REFERENCES Beneficiary_Request(beneficiary_request_id),
FOREIGN KEY (resource_id)
REFERENCES Resources(resource_id)
);

CREATE TABLE Resource_Allocation (
    allocation_id INT PRIMARY KEY,
    resource_id INT,
    task_id INT,
    allocated_quantity INT CHECK (allocated_quantity > 0),
    allocation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20)
        CHECK (status IN ('ALLOCATED','IN_USE','COMPLETED','CANCELLED')),
    FOREIGN KEY (resource_id) REFERENCES Resources(resource_id),
    FOREIGN KEY (task_id) REFERENCES Task(task_id)
);

CREATE TABLE Donations (
    donation_id INT PRIMARY KEY,
    donor_id INT,
    organization_id INT,
    donation_type VARCHAR(20)
        CHECK (donation_type IN ('MONEY','RESOURCE')),
    donation_amount DECIMAL(10,2),
    donation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(50),
status VARCHAR(20)
CHECK (status IN ('PENDING','COMPLETED','FAILED','CANCELLED')),
FOREIGN KEY (donor_id) REFERENCES Donor(donor_id),
FOREIGN KEY (organization_id) REFERENCES Organization(organization_id)
);

CREATE TABLE Donation_Item (
donation_item_id INT PRIMARY KEY,
donation_id INT,
resource_id INT,
quantity INT CHECK (quantity > 0),
UNIQUE (donation_id, resource_id),
FOREIGN KEY (donation_id) REFERENCES Donations(donation_id),
FOREIGN KEY (resource_id) REFERENCES Resources(resource_id)
);
