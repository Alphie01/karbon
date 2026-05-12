--
-- PostgreSQL database dump
--

\restrict zJJUpV9qO7BvQQycFZHB5GSCM7k18cU8nOLKNmxNtBvBpggjOZF5awaxIVKvQyq

-- Dumped from database version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE ONLY "public\"."WaterSource" DROP CONSTRAINT "WaterSource_reportId_fkey";
ALTER TABLE ONLY "public\"."WaterReport" DROP CONSTRAINT "WaterReport_companyId_fkey";
ALTER TABLE ONLY "public\"."WaterProcess" DROP CONSTRAINT "WaterProcess_reportId_fkey";
ALTER TABLE ONLY "public\"."WaterProcess" DROP CONSTRAINT "WaterProcess_businessProcessId_fkey";
ALTER TABLE ONLY "public\"."WaterGreyEntry" DROP CONSTRAINT "WaterGreyEntry_reportId_fkey";
ALTER TABLE ONLY "public\"."Video" DROP CONSTRAINT "Video_courseId_fkey";
ALTER TABLE ONLY "public\"."User" DROP CONSTRAINT "User_companyId_fkey";
ALTER TABLE ONLY "public\"."SupportTicket" DROP CONSTRAINT "SupportTicket_userId_fkey";
ALTER TABLE ONLY "public\"."SupportTicket" DROP CONSTRAINT "SupportTicket_companyId_fkey";
ALTER TABLE ONLY "public\"."QuizQuestion" DROP CONSTRAINT "QuizQuestion_videoId_fkey";
ALTER TABLE ONLY "public\"."Proposal" DROP CONSTRAINT "Proposal_leadId_fkey";
ALTER TABLE ONLY "public\"."ProposalItem" DROP CONSTRAINT "ProposalItem_proposalId_fkey";
ALTER TABLE ONLY "public\"."EmissionFactor" DROP CONSTRAINT "EmissionFactor_companyId_fkey";
ALTER TABLE ONLY "public\"."CarbonEntry" DROP CONSTRAINT "CarbonEntry_companyId_fkey";
ALTER TABLE ONLY "public\"."CarbonEntry" DROP CONSTRAINT "CarbonEntry_businessProcessId_fkey";
ALTER TABLE ONLY "public\"."BusinessProcess" DROP CONSTRAINT "BusinessProcess_companyId_fkey";
ALTER TABLE ONLY "public\"."Activity" DROP CONSTRAINT "Activity_leadId_fkey";
DROP INDEX "public\"."User_email_key";
DROP INDEX "public\"."LegislationCategory_name_key";
ALTER TABLE ONLY "public\"."WaterSource" DROP CONSTRAINT "WaterSource_pkey";
ALTER TABLE ONLY "public\"."WaterReport" DROP CONSTRAINT "WaterReport_pkey";
ALTER TABLE ONLY "public\"."WaterProcess" DROP CONSTRAINT "WaterProcess_pkey";
ALTER TABLE ONLY "public\"."WaterGreyEntry" DROP CONSTRAINT "WaterGreyEntry_pkey";
ALTER TABLE ONLY "public\"."Video" DROP CONSTRAINT "Video_pkey";
ALTER TABLE ONLY "public\"."User" DROP CONSTRAINT "User_pkey";
ALTER TABLE ONLY "public\"."SupportTicket" DROP CONSTRAINT "SupportTicket_pkey";
ALTER TABLE ONLY "public\"."QuizQuestion" DROP CONSTRAINT "QuizQuestion_pkey";
ALTER TABLE ONLY "public\"."Proposal" DROP CONSTRAINT "Proposal_pkey";
ALTER TABLE ONLY "public\"."ProposalItem" DROP CONSTRAINT "ProposalItem_pkey";
ALTER TABLE ONLY "public\"."MembershipRequest" DROP CONSTRAINT "MembershipRequest_pkey";
ALTER TABLE ONLY "public\"."Legislation" DROP CONSTRAINT "Legislation_pkey";
ALTER TABLE ONLY "public\"."LegislationCategory" DROP CONSTRAINT "LegislationCategory_pkey";
ALTER TABLE ONLY "public\"."Lead" DROP CONSTRAINT "Lead_pkey";
ALTER TABLE ONLY "public\"."FinancialRecord" DROP CONSTRAINT "FinancialRecord_pkey";
ALTER TABLE ONLY "public\"."EmissionFactor" DROP CONSTRAINT "EmissionFactor_pkey";
ALTER TABLE ONLY "public\"."Course" DROP CONSTRAINT "Course_pkey";
ALTER TABLE ONLY "public\"."Company" DROP CONSTRAINT "Company_pkey";
ALTER TABLE ONLY "public\"."CarbonEntry" DROP CONSTRAINT "CarbonEntry_pkey";
ALTER TABLE ONLY "public\"."BusinessProcess" DROP CONSTRAINT "BusinessProcess_pkey";
ALTER TABLE ONLY "public\"."Activity" DROP CONSTRAINT "Activity_pkey";
DROP TABLE "public\"."WaterSource";
DROP TABLE "public\"."WaterReport";
DROP TABLE "public\"."WaterProcess";
DROP TABLE "public\"."WaterGreyEntry";
DROP TABLE "public\"."Video";
DROP TABLE "public\"."User";
DROP TABLE "public\"."SupportTicket";
DROP TABLE "public\"."QuizQuestion";
DROP TABLE "public\"."ProposalItem";
DROP TABLE "public\"."Proposal";
DROP TABLE "public\"."MembershipRequest";
DROP TABLE "public\"."LegislationCategory";
DROP TABLE "public\"."Legislation";
DROP TABLE "public\"."Lead";
DROP TABLE "public\"."FinancialRecord";
DROP TABLE "public\"."EmissionFactor";
DROP TABLE "public\"."Course";
DROP TABLE "public\"."Company";
DROP TABLE "public\"."CarbonEntry";
DROP TABLE "public\"."BusinessProcess";
DROP TABLE "public\"."Activity";
DROP SCHEMA "public\";
-- *not* dropping schema, since initdb creates it
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: blt_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO blt_user;

--
-- Name: public\; Type: SCHEMA; Schema: -; Owner: blt_user
--

CREATE SCHEMA "public\";


ALTER SCHEMA "public\" OWNER TO blt_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Activity; Type: TABLE; Schema: public\; Owner: blt_user
--

CREATE TABLE "public\"."Activity" (
    id text NOT NULL,
    "leadId" text NOT NULL,
    type text NOT NULL,
    subject text NOT NULL,
    notes text,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    duration integer DEFAULT 30 NOT NULL,
    location text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "public\"."Activity" OWNER TO blt_user;

--
-- Name: BusinessProcess; Type: TABLE; Schema: public\; Owner: blt_user
--

CREATE TABLE "public\"."BusinessProcess" (
    id text NOT NULL,
    "companyId" text NOT NULL,
    title text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public\"."BusinessProcess" OWNER TO blt_user;

--
-- Name: CarbonEntry; Type: TABLE; Schema: public\; Owner: blt_user
--

CREATE TABLE "public\"."CarbonEntry" (
    id text NOT NULL,
    "companyId" text NOT NULL,
    scope text NOT NULL,
    category text NOT NULL,
    activity text NOT NULL,
    amount double precision NOT NULL,
    unit text NOT NULL,
    "emissionFactor" double precision NOT NULL,
    "calculatedEmission" double precision NOT NULL,
    date text NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    description text,
    "businessProcessId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public\"."CarbonEntry" OWNER TO blt_user;

--
-- Name: Company; Type: TABLE; Schema: public\; Owner: blt_user
--

CREATE TABLE "public\"."Company" (
    id text NOT NULL,
    name text NOT NULL,
    "purchasedModules" text DEFAULT 'ALL'::text NOT NULL,
    "subscriptionStatus" text DEFAULT 'ACTIVE'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public\"."Company" OWNER TO blt_user;

--
-- Name: Course; Type: TABLE; Schema: public\; Owner: blt_user
--

CREATE TABLE "public\"."Course" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    thumbnail text,
    category text DEFAULT 'Genel'::text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public\"."Course" OWNER TO blt_user;

--
-- Name: EmissionFactor; Type: TABLE; Schema: public\; Owner: blt_user
--

CREATE TABLE "public\"."EmissionFactor" (
    id text NOT NULL,
    name text NOT NULL,
    scope text NOT NULL,
    unit text NOT NULL,
    value double precision NOT NULL,
    year integer NOT NULL,
    source text,
    note text,
    "isCustom" boolean DEFAULT false NOT NULL,
    "companyId" text
);


ALTER TABLE "public\"."EmissionFactor" OWNER TO blt_user;

--
-- Name: FinancialRecord; Type: TABLE; Schema: public\; Owner: blt_user
--

CREATE TABLE "public\"."FinancialRecord" (
    id text NOT NULL,
    type text NOT NULL,
    category text NOT NULL,
    amount double precision NOT NULL,
    currency text DEFAULT 'TRY'::text NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    description text,
    "leadId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public\"."FinancialRecord" OWNER TO blt_user;

--
-- Name: Lead; Type: TABLE; Schema: public\; Owner: blt_user
--

CREATE TABLE "public\"."Lead" (
    id text NOT NULL,
    name text NOT NULL,
    "contactPerson" text,
    email text,
    phone text,
    status text DEFAULT 'NEW'::text NOT NULL,
    source text,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public\"."Lead" OWNER TO blt_user;

--
-- Name: Legislation; Type: TABLE; Schema: public\; Owner: blt_user
--

CREATE TABLE "public\"."Legislation" (
    id text NOT NULL,
    title text NOT NULL,
    category text NOT NULL,
    summary text,
    content text,
    date text,
    url text,
    "pdfUrl" text,
    "sourceUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public\"."Legislation" OWNER TO blt_user;

--
-- Name: LegislationCategory; Type: TABLE; Schema: public\; Owner: blt_user
--

CREATE TABLE "public\"."LegislationCategory" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public\"."LegislationCategory" OWNER TO blt_user;

--
-- Name: MembershipRequest; Type: TABLE; Schema: public\; Owner: blt_user
--

CREATE TABLE "public\"."MembershipRequest" (
    id text NOT NULL,
    "companyName" text NOT NULL,
    "contactName" text NOT NULL,
    email text NOT NULL,
    phone text,
    message text,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public\"."MembershipRequest" OWNER TO blt_user;

--
-- Name: Proposal; Type: TABLE; Schema: public\; Owner: blt_user
--

CREATE TABLE "public\"."Proposal" (
    id text NOT NULL,
    "leadId" text NOT NULL,
    title text NOT NULL,
    amount double precision DEFAULT 0 NOT NULL,
    currency text DEFAULT 'TRY'::text NOT NULL,
    "taxRate" double precision DEFAULT 20 NOT NULL,
    status text DEFAULT 'DRAFT'::text NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "validUntil" timestamp(3) without time zone,
    terms text,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public\"."Proposal" OWNER TO blt_user;

--
-- Name: ProposalItem; Type: TABLE; Schema: public\; Owner: blt_user
--

CREATE TABLE "public\"."ProposalItem" (
    id text NOT NULL,
    "proposalId" text NOT NULL,
    description text NOT NULL,
    quantity double precision DEFAULT 1 NOT NULL,
    "unitPrice" double precision NOT NULL,
    total double precision NOT NULL
);


ALTER TABLE "public\"."ProposalItem" OWNER TO blt_user;

--
-- Name: QuizQuestion; Type: TABLE; Schema: public\; Owner: blt_user
--

CREATE TABLE "public\"."QuizQuestion" (
    id text NOT NULL,
    "videoId" text NOT NULL,
    "timestamp" integer NOT NULL,
    "questionText" text NOT NULL,
    options text NOT NULL,
    "correctOptionIdx" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public\"."QuizQuestion" OWNER TO blt_user;

--
-- Name: SupportTicket; Type: TABLE; Schema: public\; Owner: blt_user
--

CREATE TABLE "public\"."SupportTicket" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "companyId" text,
    subject text NOT NULL,
    message text NOT NULL,
    status text DEFAULT 'OPEN'::text NOT NULL,
    priority text DEFAULT 'MEDIUM'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public\"."SupportTicket" OWNER TO blt_user;

--
-- Name: User; Type: TABLE; Schema: public\; Owner: blt_user
--

CREATE TABLE "public\"."User" (
    id text NOT NULL,
    name text,
    email text NOT NULL,
    password text,
    "companyName" text,
    "companyId" text,
    roles text DEFAULT 'STUDENT'::text NOT NULL,
    "allowedModules" text DEFAULT 'ALL'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "lastSeen" timestamp(3) without time zone,
    "attentionLevel" text,
    "attentionTestDate" timestamp(3) without time zone
);


ALTER TABLE "public\"."User" OWNER TO blt_user;

--
-- Name: Video; Type: TABLE; Schema: public\; Owner: blt_user
--

CREATE TABLE "public\"."Video" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    url text NOT NULL,
    thumbnail text,
    category text,
    "attentionLevel" text,
    "courseId" text,
    "order" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public\"."Video" OWNER TO blt_user;

--
-- Name: WaterGreyEntry; Type: TABLE; Schema: public\; Owner: blt_user
--

CREATE TABLE "public\"."WaterGreyEntry" (
    id text NOT NULL,
    "reportId" text NOT NULL,
    date text NOT NULL,
    param text NOT NULL,
    "Q" double precision NOT NULL,
    "Ceff" double precision NOT NULL,
    "Cnat" double precision NOT NULL,
    "Cmax" double precision NOT NULL,
    wfgrey double precision NOT NULL,
    evidence text,
    note text
);


ALTER TABLE "public\"."WaterGreyEntry" OWNER TO blt_user;

--
-- Name: WaterProcess; Type: TABLE; Schema: public\; Owner: blt_user
--

CREATE TABLE "public\"."WaterProcess" (
    id text NOT NULL,
    "reportId" text NOT NULL,
    date text NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    input double precision DEFAULT 0 NOT NULL,
    output double precision DEFAULT 0 NOT NULL,
    product double precision,
    "productUnit" text,
    note text,
    "businessProcessId" text
);


ALTER TABLE "public\"."WaterProcess" OWNER TO blt_user;

--
-- Name: WaterReport; Type: TABLE; Schema: public\; Owner: blt_user
--

CREATE TABLE "public\"."WaterReport" (
    id text NOT NULL,
    "companyId" text NOT NULL,
    year integer NOT NULL,
    period text NOT NULL,
    "orgName" text,
    basin text,
    methodology text,
    boundary text,
    "blueDirect" double precision DEFAULT 0 NOT NULL,
    "greenDirect" double precision DEFAULT 0 NOT NULL,
    "blueMethod" text DEFAULT 'NetConsumption'::text,
    "greenMethod" text DEFAULT 'Manual'::text,
    "totalWater" double precision DEFAULT 0 NOT NULL,
    "blueWater" double precision DEFAULT 0 NOT NULL,
    "greenWater" double precision DEFAULT 0 NOT NULL,
    "greyWater" double precision DEFAULT 0 NOT NULL,
    status text DEFAULT 'DRAFT'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public\"."WaterReport" OWNER TO blt_user;

--
-- Name: WaterSource; Type: TABLE; Schema: public\; Owner: blt_user
--

CREATE TABLE "public\"."WaterSource" (
    id text NOT NULL,
    "reportId" text NOT NULL,
    type text NOT NULL,
    name text NOT NULL,
    withdraw double precision DEFAULT 0 NOT NULL,
    return double precision DEFAULT 0 NOT NULL,
    note text
);


ALTER TABLE "public\"."WaterSource" OWNER TO blt_user;

--
-- Data for Name: Activity; Type: TABLE DATA; Schema: public\; Owner: blt_user
--

COPY "public\"."Activity" (id, "leadId", type, subject, notes, date, duration, location, "createdAt") FROM stdin;
\.


--
-- Data for Name: BusinessProcess; Type: TABLE DATA; Schema: public\; Owner: blt_user
--

COPY "public\"."BusinessProcess" (id, "companyId", title, description, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: CarbonEntry; Type: TABLE DATA; Schema: public\; Owner: blt_user
--

COPY "public\"."CarbonEntry" (id, "companyId", scope, category, activity, amount, unit, "emissionFactor", "calculatedEmission", date, status, description, "businessProcessId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Company; Type: TABLE DATA; Schema: public\; Owner: blt_user
--

COPY "public\"."Company" (id, name, "purchasedModules", "subscriptionStatus", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Course; Type: TABLE DATA; Schema: public\; Owner: blt_user
--

COPY "public\"."Course" (id, title, description, thumbnail, category, "order", "createdAt", "updatedAt") FROM stdin;
cmmaka2to0000kxbkqi4s788u	Karbon Ayak İzi Farkındalığı Eğitimi	Karbon ayak izi artık sadece çevresel bir konu değil, ekonomik bir zorunluluktur. Ölçmeyen ve yönetmeyen kurumlar geleceğin rekabetinde geride kalacaktır.	\N	Karbon	0	2026-03-03 12:05:45.803	2026-03-03 12:05:45.803
\.


--
-- Data for Name: EmissionFactor; Type: TABLE DATA; Schema: public\; Owner: blt_user
--

COPY "public\"."EmissionFactor" (id, name, scope, unit, value, year, source, note, "isCustom", "companyId") FROM stdin;
\.


--
-- Data for Name: FinancialRecord; Type: TABLE DATA; Schema: public\; Owner: blt_user
--

COPY "public\"."FinancialRecord" (id, type, category, amount, currency, date, description, "leadId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Lead; Type: TABLE DATA; Schema: public\; Owner: blt_user
--

COPY "public\"."Lead" (id, name, "contactPerson", email, phone, status, source, notes, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Legislation; Type: TABLE DATA; Schema: public\; Owner: blt_user
--

COPY "public\"."Legislation" (id, title, category, summary, content, date, url, "pdfUrl", "sourceUrl", "createdAt", "updatedAt") FROM stdin;
cmmai6xgi0006j088z7b8lily	2872 sayılı Çevre Kanunu	KANUNLAR	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/MevzuatMetin/1.5.2872.pdf	\N	http://www.mevzuat.gov.tr/MevzuatMetin/1.5.2872.pdf	2026-03-03 11:07:19.65	2026-03-03 11:07:19.65
cmmai6xgk0007j088rthmqx8z	7552 sayılı İklim Kanunu	KANUNLAR	\N	\N	03.03.2026	https://www.resmigazete.gov.tr/eskiler/2025/07/20250709-1.htm	\N	https://www.resmigazete.gov.tr/eskiler/2025/07/20250709-1.htm	2026-03-03 11:07:19.652	2026-03-03 11:07:19.652
cmmai6xgl0008j088w1990b13	5326 Sayılı Kabahatler Kanunu	KANUNLAR	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin1.Aspx?MevzuatKod=1.5.5326&MevzuatIliski=0&sourceXmlSearch=Kabahatler%20Kanunu&Tur=1&Tertip=5&No=5326	\N	http://www.mevzuat.gov.tr/Metin1.Aspx?MevzuatKod=1.5.5326&MevzuatIliski=0&sourceXmlSearch=Kabahatler%20Kanunu&Tur=1&Tertip=5&No=5326	2026-03-03 11:07:19.653	2026-03-03 11:07:19.653
cmmai6xgm0009j088dwklika2	5216 Sayılı Büyükşehir Belediyesi Kanunu	KANUNLAR	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin1.Aspx?MevzuatKod=1.5.5216&MevzuatIliski=0&sourceXmlSearch=belediyesi&Tur=1&Tertip=5&No=5216	\N	http://www.mevzuat.gov.tr/Metin1.Aspx?MevzuatKod=1.5.5216&MevzuatIliski=0&sourceXmlSearch=belediyesi&Tur=1&Tertip=5&No=5216	2026-03-03 11:07:19.655	2026-03-03 11:07:19.655
cmmai6xgn000aj088drp1myqq	5215 Sayılı Belediye Kanunu	KANUNLAR	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin1.Aspx?MevzuatKod=1.5.5393&MevzuatIliski=0&sourceXmlSearch=belediye&Tur=1&Tertip=5&No=5393	\N	http://www.mevzuat.gov.tr/Metin1.Aspx?MevzuatKod=1.5.5393&MevzuatIliski=0&sourceXmlSearch=belediye&Tur=1&Tertip=5&No=5393	2026-03-03 11:07:19.656	2026-03-03 11:07:19.656
cmmai6xgp000bj088ur1zqz85	Türk Ceza Kanunu	KANUNLAR	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin1.Aspx?MevzuatKod=1.5.5237&MevzuatIliski=0&sourceXmlSearch=t%C3%BCrk%20ceza%20kanunu&Tur=1&Tertip=5&No=5237	\N	http://www.mevzuat.gov.tr/Metin1.Aspx?MevzuatKod=1.5.5237&MevzuatIliski=0&sourceXmlSearch=t%C3%BCrk%20ceza%20kanunu&Tur=1&Tertip=5&No=5237	2026-03-03 11:07:19.657	2026-03-03 11:07:19.657
cmmai6xgq000cj088keum53u5	Orman Kanunu	KANUNLAR	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin1.Aspx?MevzuatKod=1.3.6831&MevzuatIliski=0&sourceXmlSearch=orman&Tur=1&Tertip=3&No=6831	\N	http://www.mevzuat.gov.tr/Metin1.Aspx?MevzuatKod=1.3.6831&MevzuatIliski=0&sourceXmlSearch=orman&Tur=1&Tertip=3&No=6831	2026-03-03 11:07:19.659	2026-03-03 11:07:19.659
cmmai6xgr000dj0881euxnmxl	Kara Avcılığı Kanunu	KANUNLAR	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin1.Aspx?MevzuatKod=1.5.4915&MevzuatIliski=0&sourceXmlSearch=kara%20avc%C4%B1l%C4%B1&Tur=1&Tertip=5&No=4915	\N	http://www.mevzuat.gov.tr/Metin1.Aspx?MevzuatKod=1.5.4915&MevzuatIliski=0&sourceXmlSearch=kara%20avc%C4%B1l%C4%B1&Tur=1&Tertip=5&No=4915	2026-03-03 11:07:19.66	2026-03-03 11:07:19.66
cmmai6xgt000ej088gcouqsne	Hayvanları Koruma Kanunu	KANUNLAR	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin1.Aspx?MevzuatKod=1.5.5199&MevzuatIliski=0&sourceXmlSearch=hayvanlar%C4%B1&Tur=1&Tertip=5&No=5199	\N	http://www.mevzuat.gov.tr/Metin1.Aspx?MevzuatKod=1.5.5199&MevzuatIliski=0&sourceXmlSearch=hayvanlar%C4%B1&Tur=1&Tertip=5&No=5199	2026-03-03 11:07:19.661	2026-03-03 11:07:19.661
cmmai6xgu000fj088b18cie3a	Boğaziçi Kanunu	KANUNLAR	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin1.Aspx?MevzuatKod=1.5.2960&MevzuatIliski=0&sourceXmlSearch=bo%C4%9Fazi%C3%A7i%20kanunu&Tur=1&Tertip=5&No=2960	\N	http://www.mevzuat.gov.tr/Metin1.Aspx?MevzuatKod=1.5.2960&MevzuatIliski=0&sourceXmlSearch=bo%C4%9Fazi%C3%A7i%20kanunu&Tur=1&Tertip=5&No=2960	2026-03-03 11:07:19.662	2026-03-03 11:07:19.662
cmmai6xgv000gj0883e5zd6c5	Imar Kanunu	KANUNLAR	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin1.Aspx?MevzuatKod=1.5.3194&MevzuatIliski=0&sourceXmlSearch=imar%20kanunu&Tur=1&Tertip=5&No=3194	\N	http://www.mevzuat.gov.tr/Metin1.Aspx?MevzuatKod=1.5.3194&MevzuatIliski=0&sourceXmlSearch=imar%20kanunu&Tur=1&Tertip=5&No=3194	2026-03-03 11:07:19.664	2026-03-03 11:07:19.664
cmmai6xgw000hj088fqow6cea	Kıyı Kanunu	KANUNLAR	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin1.Aspx?MevzuatKod=1.5.3621&MevzuatIliski=0&sourceXmlSearch=k%C4%B1y%C4%B1%20kanunu&Tur=1&Tertip=5&No=3621	\N	http://www.mevzuat.gov.tr/Metin1.Aspx?MevzuatKod=1.5.3621&MevzuatIliski=0&sourceXmlSearch=k%C4%B1y%C4%B1%20kanunu&Tur=1&Tertip=5&No=3621	2026-03-03 11:07:19.665	2026-03-03 11:07:19.665
cmmai6xgy000ij088zarff3q1	Maden Kanunu	KANUNLAR	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin1.Aspx?MevzuatKod=1.5.3213&MevzuatIliski=0&sourceXmlSearch=maden%20kanunu&Tur=1&Tertip=5&No=3213	\N	http://www.mevzuat.gov.tr/Metin1.Aspx?MevzuatKod=1.5.3213&MevzuatIliski=0&sourceXmlSearch=maden%20kanunu&Tur=1&Tertip=5&No=3213	2026-03-03 11:07:19.666	2026-03-03 11:07:19.666
cmmai6xgz000jj088v83nuiw2	Toprak Koruma ve Arazi Kullanımı Kanunu	KANUNLAR	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin1.Aspx?MevzuatKod=1.5.5403&MevzuatIliski=0&sourceXmlSearch=Toprak%20Koruma%20ve%20Arazi%20Kullan%C4%B1m%C4%B1%20Kanunu&Tur=1&Tertip=5&No=5403	\N	http://www.mevzuat.gov.tr/Metin1.Aspx?MevzuatKod=1.5.5403&MevzuatIliski=0&sourceXmlSearch=Toprak%20Koruma%20ve%20Arazi%20Kullan%C4%B1m%C4%B1%20Kanunu&Tur=1&Tertip=5&No=5403	2026-03-03 11:07:19.667	2026-03-03 11:07:19.667
cmmai6xh0000kj0886zsv16yn	Sular Hakkında Kanun	KANUNLAR	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin1.Aspx?MevzuatKod=1.3.831&MevzuatIliski=0&sourceXmlSearch=sular%20hakk%C4%B1nda&Tur=1&Tertip=3&No=831	\N	http://www.mevzuat.gov.tr/Metin1.Aspx?MevzuatKod=1.3.831&MevzuatIliski=0&sourceXmlSearch=sular%20hakk%C4%B1nda&Tur=1&Tertip=3&No=831	2026-03-03 11:07:19.669	2026-03-03 11:07:19.669
cmmai6xh2000lj088m198sshb	Milli Parklar Kanunu	KANUNLAR	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin1.Aspx?MevzuatKod=1.5.2873&MevzuatIliski=0&sourceXmlSearch=milli%20parklar&Tur=1&Tertip=5&No=2873	\N	http://www.mevzuat.gov.tr/Metin1.Aspx?MevzuatKod=1.5.2873&MevzuatIliski=0&sourceXmlSearch=milli%20parklar&Tur=1&Tertip=5&No=2873	2026-03-03 11:07:19.671	2026-03-03 11:07:19.671
cmmai6xh3000mj08868gul6mo	Kültür ve Tabiat Varlıklarını Koruma Kanunu	KANUNLAR	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin1.Aspx?MevzuatKod=1.5.2863&MevzuatIliski=0&sourceXmlSearch=k%C3%BClt%C3%BCr%20ve&Tur=1&Tertip=5&No=2863	\N	http://www.mevzuat.gov.tr/Metin1.Aspx?MevzuatKod=1.5.2863&MevzuatIliski=0&sourceXmlSearch=k%C3%BClt%C3%BCr%20ve&Tur=1&Tertip=5&No=2863	2026-03-03 11:07:19.672	2026-03-03 11:07:19.672
cmmai6xh5000nj088quc8ynrk	Organik Tarım Kanunu	KANUNLAR	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin1.Aspx?MevzuatKod=1.5.5262&MevzuatIliski=0&sourceXmlSearch=organik%20tar%C4%B1m&Tur=1&Tertip=5&No=5262	\N	http://www.mevzuat.gov.tr/Metin1.Aspx?MevzuatKod=1.5.5262&MevzuatIliski=0&sourceXmlSearch=organik%20tar%C4%B1m&Tur=1&Tertip=5&No=5262	2026-03-03 11:07:19.673	2026-03-03 11:07:19.673
cmmai6xh6000oj088g58wk82n	Tüketicinin Korunması Hakkında Kanun	KANUNLAR	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin1.Aspx?MevzuatKod=1.5.6502&MevzuatIliski=0&sourceXmlSearch=t%C3%BCketicinin&Tur=1&Tertip=5&No=6502	\N	http://www.mevzuat.gov.tr/Metin1.Aspx?MevzuatKod=1.5.6502&MevzuatIliski=0&sourceXmlSearch=t%C3%BCketicinin&Tur=1&Tertip=5&No=6502	2026-03-03 11:07:19.674	2026-03-03 11:07:19.674
cmmai6xh7000pj088agrjt0zi	Çevre Ajansının Kurulmasına Dair Kanun	KANUNLAR	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=7261&MevzuatTur=1&MevzuatTertip=5	\N	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=7261&MevzuatTur=1&MevzuatTertip=5	2026-03-03 11:07:19.675	2026-03-03 11:07:19.675
cmmai6xh8000qj0885gai8ezg	Çevre Yönetimi Hizmetleri Hakkında Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=39799&MevzuatTur=7&MevzuatTertip=5	\N	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=39799&MevzuatTur=7&MevzuatTertip=5	2026-03-03 11:07:19.677	2026-03-03 11:07:19.677
cmmai6xh9000rj0887b8325t2	Sıfır Atık Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	https://mevzuat.gov.tr/mevzuat?MevzuatNo=32659&MevzuatTur=7&MevzuatTertip=5	\N	https://mevzuat.gov.tr/mevzuat?MevzuatNo=32659&MevzuatTur=7&MevzuatTertip=5	2026-03-03 11:07:19.678	2026-03-03 11:07:19.678
cmmai6xhb000sj08839owovsh	Ambalaj Atıklarının Kontrolü Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	https://www.resmigazete.gov.tr/eskiler/2021/06/20210626-18.htm	\N	https://www.resmigazete.gov.tr/eskiler/2021/06/20210626-18.htm	2026-03-03 11:07:19.679	2026-03-03 11:07:19.679
cmmai6xhc000tj088j82pljhp	Büyük Endüstriyel Kazaların Önlenmesi ve Etkilerinin Azaltılması Hakkında Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	http://www.resmigazete.gov.tr/eskiler/2019/03/20190302-1.htm	\N	http://www.resmigazete.gov.tr/eskiler/2019/03/20190302-1.htm	2026-03-03 11:07:19.681	2026-03-03 11:07:19.681
cmmai6xhd000uj0880pmvfmmh	Atık Yağların Yönetimi Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=34051&MevzuatTur=7&MevzuatTertip=5	\N	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=34051&MevzuatTur=7&MevzuatTertip=5	2026-03-03 11:07:19.682	2026-03-03 11:07:19.682
cmmai6xhe000vj088ubx3vw3j	Bitkisel Atık Yağların Kontrolü Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.20817&MevzuatIliski=0&sourceXmlSearch=bitkisel%20at%C4%B1k	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.20817&MevzuatIliski=0&sourceXmlSearch=bitkisel%20at%C4%B1k	2026-03-03 11:07:19.683	2026-03-03 11:07:19.683
cmmai6xhg000wj0886whxi9gx	Tıbbi Atıkların Kontrolü Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=23273&MevzuatTur=7&MevzuatTertip=5	\N	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=23273&MevzuatTur=7&MevzuatTertip=5	2026-03-03 11:07:19.684	2026-03-03 11:07:19.684
cmmai6xhh000xj08827arji2d	Atık Yönetimi Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.20644&MevzuatIliski=0&sourceXmlSearch=at%C4%B1k%20y%C3%B6net	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.20644&MevzuatIliski=0&sourceXmlSearch=at%C4%B1k%20y%C3%B6net	2026-03-03 11:07:19.685	2026-03-03 11:07:19.685
cmmai6xhi000yj088fvfj54j2	Hafriyat Toprağı, İnşaat Ve Yıkıntı Atıklarının Kontrolü Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	https://mevzuat.gov.tr/mevzuat?MevzuatNo=5401&MevzuatTur=7&MevzuatTertip=5	\N	https://mevzuat.gov.tr/mevzuat?MevzuatNo=5401&MevzuatTur=7&MevzuatTertip=5	2026-03-03 11:07:19.686	2026-03-03 11:07:19.686
cmmai6xhj000zj0886czddpbn	Atık Pil Ve Akümülatörlerin Kontrolü Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.7118&MevzuatIliski=0&sourceXmlSearch=At%C4%B1k%20Pil%20Ve%20Ak%C3%BCm%C3%BClat%C3%B6rlerin%20Kontrol%C3%BC%20Y%C3%B6netmeli%C4%9Fi	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.7118&MevzuatIliski=0&sourceXmlSearch=At%C4%B1k%20Pil%20Ve%20Ak%C3%BCm%C3%BClat%C3%B6rlerin%20Kontrol%C3%BC%20Y%C3%B6netmeli%C4%9Fi	2026-03-03 11:07:19.688	2026-03-03 11:07:19.688
cmmai6xhk0010j088c499qd03	Atıkların Düzenli Depolanmasına Dair Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=13887&MevzuatTur=7&MevzuatTertip=5	\N	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=13887&MevzuatTur=7&MevzuatTertip=5	2026-03-03 11:07:19.689	2026-03-03 11:07:19.689
cmmai6xhl0011j088ld7gc757	Gemilerden Atık Alınması ve Atıkların Kontrolü Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.5672&MevzuatIliski=0&sourceXmlSearch=Gemilerden%20At%C4%B1k%20Al%C4%B1nmas%C4%B1%20ve%20At%C4%B1klar%C4%B1n%20Kontrol%C3%BC%20Y%C3%B6netmeli%C4%9Fi	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.5672&MevzuatIliski=0&sourceXmlSearch=Gemilerden%20At%C4%B1k%20Al%C4%B1nmas%C4%B1%20ve%20At%C4%B1klar%C4%B1n%20Kontrol%C3%BC%20Y%C3%B6netmeli%C4%9Fi	2026-03-03 11:07:19.69	2026-03-03 11:07:19.69
cmmai6xhn0012j088m1o68mh3	Poliklorlu Bifenil ve Poliklorlu Terfenillerin Kontrolü Hakkında Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.11802&MevzuatIliski=0&sourceXmlSearch=POL%C4%B0KLORLU%20B%C4%B0FEN%C4%B0L	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.11802&MevzuatIliski=0&sourceXmlSearch=POL%C4%B0KLORLU%20B%C4%B0FEN%C4%B0L	2026-03-03 11:07:19.691	2026-03-03 11:07:19.691
cmmai6xho0013j0887bb4r98p	Kimyasalların Kaydı, Değerlendirilmesi, İzni ve Kısıtlanması Hakkında Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=7.5.23694&MevzuatIliski=0&sourceXmlSearch=Kimyasallar%C4%B1n%20Kayd%C4%B1	\N	https://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=7.5.23694&MevzuatIliski=0&sourceXmlSearch=Kimyasallar%C4%B1n%20Kayd%C4%B1	2026-03-03 11:07:19.692	2026-03-03 11:07:19.692
cmmai6xhp0014j0884ekx7yvi	Atıksu Altyapı ve Evsel Katı Atık Bertaraf Tesisleri Tarifelerinin Belirlenmesinde Uyulacak Usul ve Esaslara İlişkin Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=14390&MevzuatTur=7&MevzuatTertip=5	\N	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=14390&MevzuatTur=7&MevzuatTertip=5	2026-03-03 11:07:19.694	2026-03-03 11:07:19.694
cmmai6xhr0015j0885m4wo42j	Ömrünü Tamamlamış Araçların Kontrolü Hakkında Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.13659&MevzuatIliski=0&sourceXmlSearch=%C3%B6mr%C3%BCn%C3%BC	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.13659&MevzuatIliski=0&sourceXmlSearch=%C3%B6mr%C3%BCn%C3%BC	2026-03-03 11:07:19.695	2026-03-03 11:07:19.695
cmmai6xhs0016j088whi77afa	Ömrünü Tamamlamış Lastiklerin Kontrolü Hakkında Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.10799&MevzuatIliski=0&sourceXmlSearch=%C3%B6mr%C3%BCn%C3%BC	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.10799&MevzuatIliski=0&sourceXmlSearch=%C3%B6mr%C3%BCn%C3%BC	2026-03-03 11:07:19.696	2026-03-03 11:07:19.696
cmmai6xht0017j088o4zisvoi	Yüzme Suyu Kalitesi Yönetmeliğ	YÖNETMELİKLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.9845&MevzuatIliski=0&sourceXmlSearch=y%C3%BCzme	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.9845&MevzuatIliski=0&sourceXmlSearch=y%C3%BCzme	2026-03-03 11:07:19.697	2026-03-03 11:07:19.697
cmmai6xhu0018j088ce8uduu5	Su Kirliliği Kontrolü Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=7.5.7221&MevzuatIliski=0&sourceXmlSearch=su%20kirlili%C4%9Fi	\N	https://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=7.5.7221&MevzuatIliski=0&sourceXmlSearch=su%20kirlili%C4%9Fi	2026-03-03 11:07:19.699	2026-03-03 11:07:19.699
cmmai6xhw0019j0886y9g7wfl	Kentsel Atıksu Arıtımı Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=7.5.9844&MevzuatIliski=0&sourceXmlSearch=Kentsel%20At%C4%B1ksu%20Ar%C4%B1t%C4%B1m%C4%B1%20Y%C3%B6netmeli%C4%9Fi	\N	https://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=7.5.9844&MevzuatIliski=0&sourceXmlSearch=Kentsel%20At%C4%B1ksu%20Ar%C4%B1t%C4%B1m%C4%B1%20Y%C3%B6netmeli%C4%9Fi	2026-03-03 11:07:19.7	2026-03-03 11:07:19.7
cmmai6xhx001aj088outekjgf	Evsel ve Kentsel Arıtma Çamurlarının Toprakta Kullanılmasına Dair Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.14167&MevzuatIliski=0&sourceXmlSearch=kentsel	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.14167&MevzuatIliski=0&sourceXmlSearch=kentsel	2026-03-03 11:07:19.701	2026-03-03 11:07:19.701
cmmai6xjx002yj088spacj0vg	Endüstriyel Emisyonların Yönetimi Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	https://www.resmigazete.gov.tr/eskiler/2025/01/20250114-1.htm	\N	https://www.resmigazete.gov.tr/eskiler/2025/01/20250114-1.htm	2026-03-03 11:07:19.774	2026-03-03 11:07:19.774
cmmai6xhy001bj088glhqkpyf	Tarımsal Kaynaklı Nitrat Kirliliğine Karşı Suların Korunması Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.22681&MevzuatIliski=0&sourceXmlSearch=tar%C4%B1msal%20kaynakl%C4%B1	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.22681&MevzuatIliski=0&sourceXmlSearch=tar%C4%B1msal%20kaynakl%C4%B1	2026-03-03 11:07:19.702	2026-03-03 11:07:19.702
cmmai6xhz001cj088143dtilx	Toprak Kirliliğinin Kontrolü ve Noktasal Kaynaklı Kirlenmiş Sahalara Dair Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.14026&MevzuatIliski=0&sourceXmlSearch=toprak%20kirli	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.14026&MevzuatIliski=0&sourceXmlSearch=toprak%20kirli	2026-03-03 11:07:19.704	2026-03-03 11:07:19.704
cmmai6xi0001dj0884zgnsteh	Sulak Alanların Korunması Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.19546&MevzuatIliski=0&sourceXmlSearch=sulak%20alanlar%C4%B1n	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.19546&MevzuatIliski=0&sourceXmlSearch=sulak%20alanlar%C4%B1n	2026-03-03 11:07:19.705	2026-03-03 11:07:19.705
cmmai6xi2001ej088gy7k5c25	Tehlikeli Maddelerin Su ve Çevresinde Neden Olduğu Kirliliğin Kontrolü Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.9638&MevzuatIliski=0&sourceXmlSearch=tehlikeli%	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.9638&MevzuatIliski=0&sourceXmlSearch=tehlikeli%	2026-03-03 11:07:19.706	2026-03-03 11:07:19.706
cmmai6xi3001fj0883z91puqs	Çevre Kanunun 29. Maddesi Uyarınca Atıksu Arıtma Tesislerinin Teşvik Tedbirlerinden Faydalanmasında Uyulacak Usul ve Esaslara Dair Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.14329&MevzuatIliski=0&sourceXmlSearch=%C3%A7evre%20kanunu	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.14329&MevzuatIliski=0&sourceXmlSearch=%C3%A7evre%20kanunu	2026-03-03 11:07:19.707	2026-03-03 11:07:19.707
cmmai6xi4001gj0881dp5c4i6	Çevresel Etki Değerlendirmesi Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=39647&MevzuatTur=7&MevzuatTertip=5	\N	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=39647&MevzuatTur=7&MevzuatTertip=5	2026-03-03 11:07:19.708	2026-03-03 11:07:19.708
cmmai6xi5001hj088ew1c8pkz	Çevre Ölçüm ve Analiz Laboratuvaları Yeterlik Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=7.5.19161&MevzuatIliski=0&sourceXmlSearch=%C3%A7evre%20%C3%B6l%C3%A7%C3%BCm%20ve%20analiz	\N	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=7.5.19161&MevzuatIliski=0&sourceXmlSearch=%C3%A7evre%20%C3%B6l%C3%A7%C3%BCm%20ve%20analiz	2026-03-03 11:07:19.71	2026-03-03 11:07:19.71
cmmai6xi6001ij0887qlh5szo	Kum Çakıl Ve Benzeri Maddelerin Alınması, İşletilmesi  ve Kontrolü Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.11765&MevzuatIliski=0&sourceXmlSearch=kum%20%C3%A7ak%C4%B1l	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.11765&MevzuatIliski=0&sourceXmlSearch=kum%20%C3%A7ak%C4%B1l	2026-03-03 11:07:19.711	2026-03-03 11:07:19.711
cmmai6xi8001jj088jrdrviwg	Çevre İzin ve Lisans Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.20033&MevzuatIliski=0&sourceXmlSearch=%C3%A7evre%20izin	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.20033&MevzuatIliski=0&sourceXmlSearch=%C3%A7evre%20izin	2026-03-03 11:07:19.712	2026-03-03 11:07:19.712
cmmai6xi9001kj088t9fmbwjo	Sanayi Kaynaklı Hava Kirliliğinin Kontrolü Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.13184&MevzuatIliski=0&sourceXmlSearch=sanayi%20kayna	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.13184&MevzuatIliski=0&sourceXmlSearch=sanayi%20kayna	2026-03-03 11:07:19.713	2026-03-03 11:07:19.713
cmmai6xia001lj088i57czxu9	Isınmadan Kaynaklanan Hava Kirliliğinin Kontrolü Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.7265&MevzuatIliski=0&sourceXmlSearch=%C4%B1s%C4%B1nmadan	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.7265&MevzuatIliski=0&sourceXmlSearch=%C4%B1s%C4%B1nmadan	2026-03-03 11:07:19.714	2026-03-03 11:07:19.714
cmmai6xib001mj088k4jaop24	Hava Kalitesi Değerlendirme ve Yönetimi Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.12188&MevzuatIliski=0&sourceXmlSearch=hava%20kalitesi	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.12188&MevzuatIliski=0&sourceXmlSearch=hava%20kalitesi	2026-03-03 11:07:19.716	2026-03-03 11:07:19.716
cmmai6xic001nj088auqc73a5	Egzoz Gazı Emisyonu Kontrolü ile Benzin ve Motorin Kalitesi Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.19071&MevzuatIliski=0&sourceXmlSearch=egzoz%20gaz%C4%B1	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.19071&MevzuatIliski=0&sourceXmlSearch=egzoz%20gaz%C4%B1	2026-03-03 11:07:19.717	2026-03-03 11:07:19.717
cmmai6xie001oj088t9dg6oia	Koku Oluşturan Emisyonların Kontrolü Hakkında Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.18607&MevzuatIliski=0&sourceXmlSearch=emisyon	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.18607&MevzuatIliski=0&sourceXmlSearch=emisyon	2026-03-03 11:07:19.718	2026-03-03 11:07:19.718
cmmai6xif001pj088a9lej3co	Çevre Denetimi Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	https://www.resmigazete.gov.tr/eskiler/2021/06/20210612-5.htm	\N	https://www.resmigazete.gov.tr/eskiler/2021/06/20210612-5.htm	2026-03-03 11:07:19.719	2026-03-03 11:07:19.719
cmmai6xig001qj088fl9tx8lp	Atık Elektrikli ve Elektronik Eşyaların Kontrolü Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.16159&MevzuatIliski=0&sourceXmlSearch=elektrikli	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.16159&MevzuatIliski=0&sourceXmlSearch=elektrikli	2026-03-03 11:07:19.72	2026-03-03 11:07:19.72
cmmai6xih001rj088gqkf3klh	Madencilik Faaliyetleri ile Bozulan Arazilerin Doğaya Yeniden Kazandırılması Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.13744&MevzuatIliski=0&sourceXmlSearch=madencilik	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.13744&MevzuatIliski=0&sourceXmlSearch=madencilik	2026-03-03 11:07:19.721	2026-03-03 11:07:19.721
cmmai6xii001sj088zhe6sibz	Turizm Tesislerinin Belgelendirilmesine ve Niteliklerine İlişkin Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=3.5.20058948&MevzuatIliski=0&sourceXmlSearch=turizm%20tesisleri	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=3.5.20058948&MevzuatIliski=0&sourceXmlSearch=turizm%20tesisleri	2026-03-03 11:07:19.723	2026-03-03 11:07:19.723
cmmai6xij001tj088lpf8u1bz	Türk Silahlı Kuvvetleri Çevre Denetimi Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.13243&MevzuatIliski=0&sourceXmlSearch=%C3%87evre%20Denetimi%20Y%C3%B6netmeli%C4%9Fi	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.13243&MevzuatIliski=0&sourceXmlSearch=%C3%87evre%20Denetimi%20Y%C3%B6netmeli%C4%9Fi	2026-03-03 11:07:19.724	2026-03-03 11:07:19.724
cmmai6xik001uj0885gh13esm	Tehlikeli Maddelerin Karayoluyla Taşınması Hakkında Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.18966&MevzuatIliski=0&sourceXmlSearch=Tehlikeli%20Maddeler	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.18966&MevzuatIliski=0&sourceXmlSearch=Tehlikeli%20Maddeler	2026-03-03 11:07:19.725	2026-03-03 11:07:19.725
cmmai6xim001vj088igj7uonu	Tehlikeli Maddelerin Deniz Yoluyla Taşınması Hakkında Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.20571&MevzuatIliski=0&sourceXmlSearch=Tehlikeli%20Maddeler	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.20571&MevzuatIliski=0&sourceXmlSearch=Tehlikeli%20Maddeler	2026-03-03 11:07:19.726	2026-03-03 11:07:19.726
cmmai6xin001wj08824y1xcw1	Tehlikeli Maddelerin Demiryoluyla Taşınması Hakkında Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.20934&MevzuatIliski=0&sourceXmlSearch=Tehlikeli%20Maddeler	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.20934&MevzuatIliski=0&sourceXmlSearch=Tehlikeli%20Maddeler	2026-03-03 11:07:19.727	2026-03-03 11:07:19.727
cmmai6xio001xj0882ym5oxu0	Çevre Ölçüm ve Analiz Laboratuvarları Yeterlik Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.19161&MevzuatIliski=0&sourceXmlSearch=%C3%A7evre%20%C3%B6l%C3%A7%C3%BCm	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.19161&MevzuatIliski=0&sourceXmlSearch=%C3%A7evre%20%C3%B6l%C3%A7%C3%BCm	2026-03-03 11:07:19.729	2026-03-03 11:07:19.729
cmmai6xip001yj0882lx190ww	Çevresel Gürültü Kontrol Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	https://www.resmigazete.gov.tr/eskiler/2022/11/20221130-1.htm	\N	https://www.resmigazete.gov.tr/eskiler/2022/11/20221130-1.htm	2026-03-03 11:07:19.73	2026-03-03 11:07:19.73
cmmai6xiq001zj08890bhu5qf	Sera Gazı Emisyonlarının Takibi Hakkında Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.19678&MevzuatIliski=0&sourceXmlSearch=sera%20gaz%C4%B1	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.19678&MevzuatIliski=0&sourceXmlSearch=sera%20gaz%C4%B1	2026-03-03 11:07:19.731	2026-03-03 11:07:19.731
cmmai6xis0020j088spo8ivnr	İçme Suyu Elde Edilen veya Elde Edilmesi Planlanan Yüzeysel Suların Kalitesine Dair Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.16303&MevzuatIliski=0&sourceXmlSearch=%C4%B0%C3%87ME	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.16303&MevzuatIliski=0&sourceXmlSearch=%C4%B0%C3%87ME	2026-03-03 11:07:19.732	2026-03-03 11:07:19.732
cmmai6xit0021j088e2laoked	Kıyı Kanunun Uygulanmasına Dair Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=7.5.4897&MevzuatIliski=0&sourceXmlSearch=kıyı%20kanunu	\N	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=7.5.4897&MevzuatIliski=0&sourceXmlSearch=kıyı%20kanunu	2026-03-03 11:07:19.733	2026-03-03 11:07:19.733
cmmai6xiu0022j0889bjsw4hz	Benzin ve Motorin Türlerinin Çevresel Etkilerine Dair Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=7.5.23470&MevzuatIliski=0&sourceXmlSearch=BENZ%C4%B0N%20VE%20MOTOR%C4%B0N%20T%C3%9CRLER%C4%B0N%C4%B0N%20%C3%87EVRESEL%20ETK%C4%B0LER%C4%B0NE	\N	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=7.5.23470&MevzuatIliski=0&sourceXmlSearch=BENZ%C4%B0N%20VE%20MOTOR%C4%B0N%20T%C3%9CRLER%C4%B0N%C4%B0N%20%C3%87EVRESEL%20ETK%C4%B0LER%C4%B0NE	2026-03-03 11:07:19.734	2026-03-03 11:07:19.734
cmmai6xiv0023j0880gxg0f0g	Ozon Tabakasını İncelten Maddelere İlişkin Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=7.5.23490&MevzuatIliski=0&sourceXmlSearch=OZON%20TABAKASINI%20%C4%B0NCELTEN%20MADDELERE%20%C4%B0L%C4%B0%C5%9EK%C4%B0N%20Y%C3%96NETMEL%C4%B0K	\N	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=7.5.23490&MevzuatIliski=0&sourceXmlSearch=OZON%20TABAKASINI%20%C4%B0NCELTEN%20MADDELERE%20%C4%B0L%C4%B0%C5%9EK%C4%B0N%20Y%C3%96NETMEL%C4%B0K	2026-03-03 11:07:19.736	2026-03-03 11:07:19.736
cmmai6xiw0024j088m1zscyv0	Stratejik Çevresel Değerlendirme Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=7.5.23492&MevzuatIliski=0&sourceXmlSearch=STRATEJ%C4%B0K%20%C3%87EVRESEL%20DE%C4%9EERLEND%C4%B0RME%20Y%C3%96NETMEL%C4%B0%C4%9E%C4%B0	\N	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=7.5.23492&MevzuatIliski=0&sourceXmlSearch=STRATEJ%C4%B0K%20%C3%87EVRESEL%20DE%C4%9EERLEND%C4%B0RME%20Y%C3%96NETMEL%C4%B0%C4%9E%C4%B0	2026-03-03 11:07:19.737	2026-03-03 11:07:19.737
cmmai6xix0025j088h5p8d0po	Binaların Gürültüye Karşı Korunması Hakkında Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.23616&MevzuatIliski=0&sourceXmlSearch=Binalar%C4%B1n%20G%C3%BCr%C3%BClt%C3%BCye%20Kar%C5%9F%C4%B1%20Korunmas%C4%B1%20Hakk%C4%B1nda%20Y%C3%B6netmelik	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.23616&MevzuatIliski=0&sourceXmlSearch=Binalar%C4%B1n%20G%C3%BCr%C3%BClt%C3%BCye%20Kar%C5%9F%C4%B1%20Korunmas%C4%B1%20Hakk%C4%B1nda%20Y%C3%B6netmelik	2026-03-03 11:07:19.738	2026-03-03 11:07:19.738
cmmai6xiz0026j088395ru7lc	Maden Atıkları Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=7.5.20913&MevzuatIliski=0&sourceXmlSearch=maden%20at%C4%B1klar%C4%B1	\N	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=7.5.20913&MevzuatIliski=0&sourceXmlSearch=maden%20at%C4%B1klar%C4%B1	2026-03-03 11:07:19.739	2026-03-03 11:07:19.739
cmmai6xj00027j088j986ij2m	İçme ve Kullanma Suyu Temini ve Dağıtım Sistemleri Hakkında Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=7.5.23970&MevzuatIliski=0&sourceXmlSearch=%C4%B0%C3%87ME%20VE%20KULLANMA%20SUYU%20TEM%C4%B0N%C4%B0%20VE%20DA%C4%9EITIM%20S%C4%B0STEMLER%C4%B0%20HAKKINDA%20Y%C3%96NETMEL%C4%B0K	\N	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=7.5.23970&MevzuatIliski=0&sourceXmlSearch=%C4%B0%C3%87ME%20VE%20KULLANMA%20SUYU%20TEM%C4%B0N%C4%B0%20VE%20DA%C4%9EITIM%20S%C4%B0STEMLER%C4%B0%20HAKKINDA%20Y%C3%96NETMEL%C4%B0K	2026-03-03 11:07:19.74	2026-03-03 11:07:19.74
cmmai6xj10028j0887d239xfx	Deniz Çevresinin Petrol ve Diğer Zararlı Maddelerle Kirlenmesinde Acil Durumlarda Müdahale ve Zararların Tazmini Esaslarına Dair Kanunun Uygulama Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.10715&MevzuatIliski=0&sourceXmlSearch=DEN%C4%B0Z%20%C3%87EVRES%C4%B0N%C4%B0N%20PETROL%20VE%20D%C4%B0%C4%9EER%20ZARARLI%20MADDELERLE	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.10715&MevzuatIliski=0&sourceXmlSearch=DEN%C4%B0Z%20%C3%87EVRES%C4%B0N%C4%B0N%20PETROL%20VE%20D%C4%B0%C4%9EER%20ZARARLI%20MADDELERLE	2026-03-03 11:07:19.742	2026-03-03 11:07:19.742
cmmai6xj20029j0885m2l666s	Gemilerden Atık Alınması ve Atıkların Kontrolü Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.5672&MevzuatIliski=0&sourceXmlSearch=GEM%C4%B0LERDEN%20ATIK%20ALINMASI%20VE%20ATIKLARIN%20KONTROL%C3%9C%20Y%C3%96NETMEL%C4%B0%C4%9E	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=7.5.5672&MevzuatIliski=0&sourceXmlSearch=GEM%C4%B0LERDEN%20ATIK%20ALINMASI%20VE%20ATIKLARIN%20KONTROL%C3%9C%20Y%C3%96NETMEL%C4%B0%C4%9E	2026-03-03 11:07:19.743	2026-03-03 11:07:19.743
cmmai6xj3002aj0885akmx9cf	İçme-Kullanma Suyu Havzalarının Korunmasına Dair Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=7.5.24036&MevzuatIliski=0&sourceXmlSearch=%C4%B0%C3%87ME-KULLANMA%20SUYU%20HAVZALARININ%20KORUNMASINA%20DA%C4%B0R%20Y%C3%96NETMEL%C4%B0K	\N	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=7.5.24036&MevzuatIliski=0&sourceXmlSearch=%C4%B0%C3%87ME-KULLANMA%20SUYU%20HAVZALARININ%20KORUNMASINA%20DA%C4%B0R%20Y%C3%96NETMEL%C4%B0K	2026-03-03 11:07:19.744	2026-03-03 11:07:19.744
cmmai6xjv002wj088bqtkjq7p	Yeraltı Sularının Kirlenmeye ve Bozulmaya Karşı Korunması Hakkında Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=16038&MevzuatTur=7&MevzuatTertip=5	\N	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=16038&MevzuatTur=7&MevzuatTertip=5	2026-03-03 11:07:19.771	2026-03-03 11:07:19.771
cmmai6xj5002bj088y4k5cx1y	Havza Yönetim Planlarının Hazırlanması, Uygulanması ve Takibi Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=7.5.16695&MevzuatIliski=0&sourceXmlSearch=HAVZA%20Y%C3%96NET%C4%B0M%20PLANLARININ	\N	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=7.5.16695&MevzuatIliski=0&sourceXmlSearch=HAVZA%20Y%C3%96NET%C4%B0M%20PLANLARININ	2026-03-03 11:07:19.745	2026-03-03 11:07:19.745
cmmai6xj6002cj088pjq5b8w8	Korunan Alanların Tespit, Tescil ve Onayına İlişkin Usul ve Esaslara Dair Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=7.5.23605&MevzuatIliski=0&sourceXmlSearch=KORUNAN%20ALANLARIN%20TESP%C4%B0T,%20TESC%C4%B0L%20VE%20ONAYINA	\N	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=7.5.23605&MevzuatIliski=0&sourceXmlSearch=KORUNAN%20ALANLARIN%20TESP%C4%B0T,%20TESC%C4%B0L%20VE%20ONAYINA	2026-03-03 11:07:19.746	2026-03-03 11:07:19.746
cmmai6xj7002dj088b0hw3agj	Binalar ile Yerleşmeler için Yeşil Sertifika Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	https://www.resmigazete.gov.tr/eskiler/2022/06/20220612-1.htm	\N	https://www.resmigazete.gov.tr/eskiler/2022/06/20220612-1.htm	2026-03-03 11:07:19.747	2026-03-03 11:07:19.747
cmmai6xj8002ej088fevgpm3x	Kalıcı Organik Kirleticiler Hakkında Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=7.5.28965&MevzuatIliski=0&sourceXmlSearch=Kal%C4%B1c%C4%B1%20Organik%20Kirleticiler%20Hakk%C4%B1nda%20Y%C3%B6netmelik	\N	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=7.5.28965&MevzuatIliski=0&sourceXmlSearch=Kal%C4%B1c%C4%B1%20Organik%20Kirleticiler%20Hakk%C4%B1nda%20Y%C3%B6netmelik	2026-03-03 11:07:19.749	2026-03-03 11:07:19.749
cmmai6xj9002fj088vdblzxmj	Florlu Sera Gazlarına İlişkin Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=41038&MevzuatTur=7&MevzuatTertip=5	\N	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=41038&MevzuatTur=7&MevzuatTertip=5	2026-03-03 11:07:19.75	2026-03-03 11:07:19.75
cmmai6xja002gj0883r1cqsym	Çevre Etiketi Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=7.5.25883&MevzuatIliski=0&sourceXmlSearch=%C3%A7evre%20etiketi	\N	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=7.5.25883&MevzuatIliski=0&sourceXmlSearch=%C3%A7evre%20etiketi	2026-03-03 11:07:19.751	2026-03-03 11:07:19.751
cmmai6xjc002hj0883fmbc2o0	Benzin ve Naftanın Depolanması ve Dağıtılmasından Kaynaklanan Uçucu Organik Bileşik Emisyonlarının Kontrolü Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=7.5.29032&MevzuatIliski=0&sourceXmlSearch=BENZ%C4%B0N%20VE%20NA	\N	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=7.5.29032&MevzuatIliski=0&sourceXmlSearch=BENZ%C4%B0N%20VE%20NA	2026-03-03 11:07:19.752	2026-03-03 11:07:19.752
cmmai6xjd002ij088rpxrnyru	İçme Suyu Temin Edilen Suların Kalitesi ve Arıtılması Hakkında Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=32653&MevzuatTur=7&MevzuatTertip=5	\N	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=32653&MevzuatTur=7&MevzuatTertip=5	2026-03-03 11:07:19.754	2026-03-03 11:07:19.754
cmmai6xjf002jj088rjqwu13u	İçme Suyu Temin ve Dağıtım Sistemlerindeki Su Kayıplarının Kontrolü Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=7.5.19651&MevzuatIliski=0&sourceXmlSearch=%C4%B0%C3%87ME%20SUYU%20TEM%C4%B0N	\N	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=7.5.19651&MevzuatIliski=0&sourceXmlSearch=%C4%B0%C3%87ME%20SUYU%20TEM%C4%B0N	2026-03-03 11:07:19.755	2026-03-03 11:07:19.755
cmmai6xjg002kj088se5xaxhn	Geri Kazanım Katılım Payına İlişkin Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=34147&MevzuatTur=7&MevzuatTertip=5	\N	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=34147&MevzuatTur=7&MevzuatTertip=5	2026-03-03 11:07:19.756	2026-03-03 11:07:19.756
cmmai6xjh002lj088i2d7cd1u	Dip Tarama Malzemesinin Çevresel Yönetimi Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=7.5.34185&MevzuatIliski=0&sourceXmlSearch=dip	\N	https://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=7.5.34185&MevzuatIliski=0&sourceXmlSearch=dip	2026-03-03 11:07:19.757	2026-03-03 11:07:19.757
cmmai6xji002mj088hoew4zrx	Denizlerde Faaliyet Gösteren Balık Çiftliklerinin Çevresel Yönetimi Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=34959&MevzuatTur=7&MevzuatTertip=5	\N	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=34959&MevzuatTur=7&MevzuatTertip=5	2026-03-03 11:07:19.759	2026-03-03 11:07:19.759
cmmai6xjk002nj088gkxmqcmk	Maddelerin ve Karışımların Sınıflandırılması, Etiketlenmesi ve Ambalajlanması Hakkında Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=19108&MevzuatTur=7&MevzuatTertip=5	\N	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=19108&MevzuatTur=7&MevzuatTertip=5	2026-03-03 11:07:19.76	2026-03-03 11:07:19.76
cmmai6xjl002oj08860d2njj9	Çevre Gelirlerinin Takip ve Tahsili ile Tahsilat Karşılığı Öngörülen Ödeneğin Kullanımı Hakkında Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=11217&MevzuatTur=7&MevzuatTertip=5	\N	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=11217&MevzuatTur=7&MevzuatTertip=5	2026-03-03 11:07:19.761	2026-03-03 11:07:19.761
cmmai6xjm002pj088lg1kz2l7	Atıkların Düzenli Depolanmasına Dair Yönetmelikte Değişiklik Yapılmasına Dair Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	https://www.resmigazete.gov.tr/eskiler/2021/03/20210319-2.htm	\N	https://www.resmigazete.gov.tr/eskiler/2021/03/20210319-2.htm	2026-03-03 11:07:19.763	2026-03-03 11:07:19.763
cmmai6xjn002qj0881tqgrwo5	Sulak Alanların Korunması Yönetmeliğinde Değişiklik Yapılmasına Dair Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	https://www.resmigazete.gov.tr/eskiler/2021/03/20210319-3.htm	\N	https://www.resmigazete.gov.tr/eskiler/2021/03/20210319-3.htm	2026-03-03 11:07:19.764	2026-03-03 11:07:19.764
cmmai6xjp002rj088ieoc8c7x	Atık Ön İşlem ve Geri Kazanım Tesislerinin Genel Esaslarına İlişkin Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=38990&MevzuatTur=7&MevzuatTertip=5	\N	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=38990&MevzuatTur=7&MevzuatTertip=5	2026-03-03 11:07:19.765	2026-03-03 11:07:19.765
cmmai6xjq002sj088plhyd0l4	Çevre İzin ve Lisans Yönetmeliğinde Değişiklik Yapılmasına Dair Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	https://www.resmigazete.gov.tr/eskiler/2021/10/20211016-2.htm	\N	https://www.resmigazete.gov.tr/eskiler/2021/10/20211016-2.htm	2026-03-03 11:07:19.767	2026-03-03 11:07:19.767
cmmai6xjr002tj088rplejeh1	Kirletici Salım ve Taşıma Kaydı Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	https://www.resmigazete.gov.tr/eskiler/2021/12/20211204-1.htm	\N	https://www.resmigazete.gov.tr/eskiler/2021/12/20211204-1.htm	2026-03-03 11:07:19.768	2026-03-03 11:07:19.768
cmmai6xjt002uj08873qb4wvw	İklim Değişikliği Başkanlığı Hizmet Birimleri ile Çalışma Usul ve Esasları Hakkında Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	https://www.resmigazete.gov.tr/eskiler/2022/06/20220621-1.htm	\N	https://www.resmigazete.gov.tr/eskiler/2022/06/20220621-1.htm	2026-03-03 11:07:19.769	2026-03-03 11:07:19.769
cmmai6xju002vj088p523hx54	Tersane, Tekne İmal ve Çekek Yerlerinin Çevresel Yönetimi Hakkında Yönetmelik	YÖNETMELİKLER	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=39870&MevzuatTur=7&MevzuatTertip=5	\N	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=39870&MevzuatTur=7&MevzuatTertip=5	2026-03-03 11:07:19.77	2026-03-03 11:07:19.77
cmmai6xjw002xj0888okliytu	Su Verimliliği Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=41146&MevzuatTur=7&MevzuatTertip=5	\N	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=41146&MevzuatTur=7&MevzuatTertip=5	2026-03-03 11:07:19.773	2026-03-03 11:07:19.773
cmmai6xjz002zj088j5088j9w	Sürdürülebilirlik Denetimi Yönetmeliği	YÖNETMELİKLER	\N	\N	03.03.2026	https://www.resmigazete.gov.tr/eskiler/2025/01/20250117-19.htm	\N	https://www.resmigazete.gov.tr/eskiler/2025/01/20250117-19.htm	2026-03-03 11:07:19.775	2026-03-03 11:07:19.775
cmmai6xk00030j088juz9sds8	Çevresel Etki Değerlendirmesi Yeterlik Belgesi Tebliği	TEBLİĞLER	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=39943&MevzuatTur=9&MevzuatTertip=5	\N	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=39943&MevzuatTur=9&MevzuatTertip=5	2026-03-03 11:07:19.776	2026-03-03 11:07:19.776
cmmai6xk10031j088f14ysv9b	Sürekli Atıksu İzleme Sistemleri Tebliği	TEBLİĞLER	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=9.5.20621&MevzuatIliski=0&sourceXmlSearch=S%C3%BCrekli%20At%C4%B1ksu%20%C4%B0zleme%20Sistemleri	\N	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=9.5.20621&MevzuatIliski=0&sourceXmlSearch=S%C3%BCrekli%20At%C4%B1ksu%20%C4%B0zleme%20Sistemleri	2026-03-03 11:07:19.777	2026-03-03 11:07:19.777
cmmai6xk30032j088bzfdebrv	Deniz Çevresinin Petrol ve Diğer Zararlı Maddelerle Kirlenmesine İlişkin Risk Değerlendirmesi ve Acil Müdahale Planlarını Hazırlayacak Kurum ve Kuruluşların Asgari Özelliklerine Dair Tebliğ	TEBLİĞLER	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=9.5.20292&MevzuatIliski=0&sourceXmlSearch=DEN%C4%B0Z%20%C3%87EVRES%C4%B0N%C4%B0N%20PETROL%20VE%20D%C4%B0%C4%9EER%20ZARARLI	\N	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=9.5.20292&MevzuatIliski=0&sourceXmlSearch=DEN%C4%B0Z%20%C3%87EVRES%C4%B0N%C4%B0N%20PETROL%20VE%20D%C4%B0%C4%9EER%20ZARARLI	2026-03-03 11:07:19.779	2026-03-03 11:07:19.779
cmmai6xk40033j088dvwc1nnm	Enerji Kimlik Belgesi Uzmanlarına ve Eğitici Kuruluşlara Verilecek Eğitimlere Dair Tebliğ (Tebliğ No: YİG-16/2010-01)	TEBLİĞLER	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=9.5.14034&MevzuatIliski=0&sourceXmlSearch=enerji%20kimlik	\N	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=9.5.14034&MevzuatIliski=0&sourceXmlSearch=enerji%20kimlik	2026-03-03 11:07:19.78	2026-03-03 11:07:19.78
cmmai6xk50034j088riyebqri	Atıksu Arıtma Tesislerinde Çalışan Teknik Personele İlişkin Tebliği	TEBLİĞLER	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=9.5.31541&MevzuatIliski=0&sourceXmlSearch=ar%C4%B1tma	\N	https://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=9.5.31541&MevzuatIliski=0&sourceXmlSearch=ar%C4%B1tma	2026-03-03 11:07:19.782	2026-03-03 11:07:19.782
cmmai6xk60035j088rfsvap1p	Sera Gazı Emisyon Raporlarının Doğrulanması ve Doğrulayıcı Kuruluşların Akreditasyonu Tebliği	TEBLİĞLER	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=9.5.24128&MevzuatIliski=0&sourceXmlSearch=Sera%20Gaz%C4%B1%20Emisyon	\N	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=9.5.24128&MevzuatIliski=0&sourceXmlSearch=Sera%20Gaz%C4%B1%20Emisyon	2026-03-03 11:07:19.783	2026-03-03 11:07:19.783
cmmai6xk80036j088y084l03d	Sera Gazı Emisyonlarının İzlenmesi ve Raporlanması Hakkında Tebliğ	TEBLİĞLER	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=19920&MevzuatTur=9&MevzuatTertip=5	\N	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=19920&MevzuatTur=9&MevzuatTertip=5	2026-03-03 11:07:19.784	2026-03-03 11:07:19.784
cmmai6xk90037j088ykhcjmcs	Florlu Sera Gazı İçeren veya Çalışması Bu Gazlara Dayanan Ekipmana Müdahale Eden Gerçek ve Tüzel Kişilerin Belgelendirilmesine İlişkin Tebliğ	TEBLİĞLER	\N	\N	03.03.2026	https://www.resmigazete.gov.tr/eskiler/2020/09/20200924-34.htm	\N	https://www.resmigazete.gov.tr/eskiler/2020/09/20200924-34.htm	2026-03-03 11:07:19.785	2026-03-03 11:07:19.785
cmmai6xka0038j088larfm87u	Atıktan Türetilmiş Yakıt, Ek Yakıt ve Alternatif Hammade Tebliği	TEBLİĞLER	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=9.5.19804&MevzuatIliski=0&sourceXmlSearch=ATIKTAN%20T%C3%9CRET%C4%B0LM%C4%B0%C5%9E%20YAKIT,	\N	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=9.5.19804&MevzuatIliski=0&sourceXmlSearch=ATIKTAN%20T%C3%9CRET%C4%B0LM%C4%B0%C5%9E%20YAKIT,	2026-03-03 11:07:19.787	2026-03-03 11:07:19.787
cmmai6xkb0039j088bzch4p8g	Atıkların Karayolunda Taşınmasına İlişkin Tebliğ	TEBLİĞLER	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=9.5.20617&MevzuatIliski=0&sourceXmlSearch=at%C4%B1klar%C4%B1n%20kara	\N	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=9.5.20617&MevzuatIliski=0&sourceXmlSearch=at%C4%B1klar%C4%B1n%20kara	2026-03-03 11:07:19.788	2026-03-03 11:07:19.788
cmmai6xkc003aj088jidg28ve	Bazı Tehlikesiz Atıkların Geri Kazanımı Tebliği	TEBLİĞLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=9.5.15051&MevzuatIliski=0&sourceXmlSearch=Baz%C4%B1%20Tehlikesiz%20At%C4%B1klar%C4%B1n%20Geri%20Kazan%C4%B1m%C4%B1%20Tebli%C4%9Fi	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=9.5.15051&MevzuatIliski=0&sourceXmlSearch=Baz%C4%B1%20Tehlikesiz%20At%C4%B1klar%C4%B1n%20Geri%20Kazan%C4%B1m%C4%B1%20Tebli%C4%9Fi	2026-03-03 11:07:19.789	2026-03-03 11:07:19.789
cmmai6xke003bj088hqtrr7ws	Toprak Kirliliğinin Kontrolü ve Noktasal Kaynaklı Kirlenmiş Sahalara Dair Yönetmelik Yeterlilik Belgesi Tebliği	TEBLİĞLER	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=9.5.15052&MevzuatIliski=0&sourceXmlSearch=toprak%20kirlili%C4%9Fin	\N	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=9.5.15052&MevzuatIliski=0&sourceXmlSearch=toprak%20kirlili%C4%9Fin	2026-03-03 11:07:19.79	2026-03-03 11:07:19.79
cmmai6xkf003cj088e3ds2oxu	Atık Ara Depolama Tesisleri Tebliği	TEBLİĞLER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/icerikler/tbl-32052at-karadepolamates-20230103120614.docx	\N	https://webdosya.csb.gov.tr/db/cygm/icerikler/tbl-32052at-karadepolamates-20230103120614.docx	2026-03-03 11:07:19.791	2026-03-03 11:07:19.791
cmmai6xkg003dj088cxbkd7a6	Tanker Temizleme Tesisleri Tebliği	TEBLİĞLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=9.5.12822&MevzuatIliski=0&sourceXmlSearch=Tanker%20Temizleme%20Tesisleri%20Tebli%C4%9Fi	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=9.5.12822&MevzuatIliski=0&sourceXmlSearch=Tanker%20Temizleme%20Tesisleri%20Tebli%C4%9Fi	2026-03-03 11:07:19.793	2026-03-03 11:07:19.793
cmmai6xkh003ej088qvjhzmiy	Su Kirliliği Kontrolü Yönetmeliği İdari Usuller Tebliği	TEBLİĞLER	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=13481&MevzuatTur=9&MevzuatTertip=5	\N	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=13481&MevzuatTur=9&MevzuatTertip=5	2026-03-03 11:07:19.794	2026-03-03 11:07:19.794
cmmai6xki003fj088nqhhcvye	Su Kirliliği Kontrolü Yönetmeliği Numune Alma ve Analiz Metodları Tebliği	TEBLİĞLER	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=13482&MevzuatTur=9&MevzuatTertip=5	\N	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=13482&MevzuatTur=9&MevzuatTertip=5	2026-03-03 11:07:19.795	2026-03-03 11:07:19.795
cmmai6xkk003gj088127sgpvc	İçme - Kullanma Suyu Havzası Koruma Planı Hazırlanmasına Dair Usul ve Esaslar Tebliği	TEBLİĞLER	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=9.5.31273&MevzuatIliski=0&sourceXmlSearch=i%C3%A7me%20-%20kullanma	\N	https://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=9.5.31273&MevzuatIliski=0&sourceXmlSearch=i%C3%A7me%20-%20kullanma	2026-03-03 11:07:19.796	2026-03-03 11:07:19.796
cmmai6xkl003hj088utrzk1mj	Kompost Tebliği	TEBLİĞLER	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=20577&MevzuatTur=9&MevzuatTertip=5	\N	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=20577&MevzuatTur=9&MevzuatTertip=5	2026-03-03 11:07:19.797	2026-03-03 11:07:19.797
cmmai6xkm003ij088z3jmfe78	Mekanik Ayırma, Biyokurutma ve Biyometanizasyon Tesisleri ile Fermente Ürün Yönetimi Tebliği	TEBLİĞLER	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=21174&MevzuatTur=9&MevzuatTertip=5	\N	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=21174&MevzuatTur=9&MevzuatTertip=5	2026-03-03 11:07:19.799	2026-03-03 11:07:19.799
cmmai6xkn003jj08861o6soxa	Büyük Endüstriyel Kazalarla İlgili Hazırlanacak Güvenlik Raporu Tebliği	TEBLİĞLER	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=9.5.31436&MevzuatIliski=0&sourceXmlSearch=B%C3%9CY%C3%9CK%20END%C3%9CSTR%C4%B0YEL	\N	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=9.5.31436&MevzuatIliski=0&sourceXmlSearch=B%C3%9CY%C3%9CK%20END%C3%9CSTR%C4%B0YEL	2026-03-03 11:07:19.8	2026-03-03 11:07:19.8
cmmai6xkp003kj088nqyjl68e	Büyük Endüstriyel Kazalarla İlgili Hazırlanacak Büyük Kaza Önleme Politika Belgesi Tebliği	TEBLİĞLER	\N	\N	03.03.2026	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=9.5.31437&MevzuatIliski=0&sourceXmlSearch=B%C3%9CY%C3%9CK%20END%C3%9CSTR%C4%B0YEL	\N	http://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=9.5.31437&MevzuatIliski=0&sourceXmlSearch=B%C3%9CY%C3%9CK%20END%C3%9CSTR%C4%B0YEL	2026-03-03 11:07:19.801	2026-03-03 11:07:19.801
cmmai6xkq003lj0882jxg2ach	Sulak Alanlar Tebliği (No: 4)	TEBLİĞLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=9.5.6092&MevzuatIliski=0&sourceXmlSearch=sulak%20alanlar	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=9.5.6092&MevzuatIliski=0&sourceXmlSearch=sulak%20alanlar	2026-03-03 11:07:19.802	2026-03-03 11:07:19.802
cmmai6xkr003mj088bb07ul8f	Sulak Alanlar Tebliği (No: 5)	TEBLİĞLER	\N	\N	03.03.2026	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=9.5.13146&MevzuatIliski=0&sourceXmlSearch=sulak%20alanlar	\N	http://mevzuat.basbakanlik.gov.tr/Metin.Aspx?MevzuatKod=9.5.13146&MevzuatIliski=0&sourceXmlSearch=sulak%20alanlar	2026-03-03 11:07:19.804	2026-03-03 11:07:19.804
cmmai6xks003nj088224bb43f	Basel  Sözleşmesi	TEBLİĞLER	\N	\N	03.03.2026	http://www2.cevreorman.gov.tr/mevzuat/basel.doc	\N	http://www2.cevreorman.gov.tr/mevzuat/basel.doc	2026-03-03 11:07:19.805	2026-03-03 11:07:19.805
cmmai6xku003oj088mjq4fs94	Pil ve Akümülatörlerin İthalat Denetimi Tebliği (Ürün Güvenliği ve Denetimi (2021/15)	TEBLİĞLER	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=36189&MevzuatTur=9&MevzuatTertip=5	\N	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=36189&MevzuatTur=9&MevzuatTertip=5	2026-03-03 11:07:19.806	2026-03-03 11:07:19.806
cmmai6xkv003pj0886n9tmyjt	ÇEVRENİN KORUNMASI YÖNÜNDEN KONTROL ALTINDA TUTULAN KATI YAKITLARIN İTHALAT DENETİMİ TEBLİĞİ (ÜRÜN GÜVENLİĞİ VE DENETİMİ: 2021/7)	TEBLİĞLER	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=36174&MevzuatTur=9&MevzuatTertip=5	\N	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=36174&MevzuatTur=9&MevzuatTertip=5	2026-03-03 11:07:19.807	2026-03-03 11:07:19.807
cmmai6xkw003qj088zdpczfxk	ÇEVRENİN KORUNMASI YÖNÜNDEN KONTROL ALTINDA TUTULAN METAL HURDALARIN İTHALAT DENETİMİ TEBLİĞİ (ÜRÜN GÜVENLİĞİ VE DENETİMİ: 2021/23)	TEBLİĞLER	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=36175&MevzuatTur=9&MevzuatTertip=5	\N	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=36175&MevzuatTur=9&MevzuatTertip=5	2026-03-03 11:07:19.809	2026-03-03 11:07:19.809
cmmai6xkx003rj088mtc9natr	GERİ KAZANIM KATILIM PAYI BEYANNAMESİ GENEL TEBLİĞİ (SIRA NO: 1)	TEBLİĞLER	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=9.5.31386&MevzuatIliski=0&sourceXmlSearch=geri%20kazan%C4%B1m	\N	https://www.mevzuat.gov.tr/Metin.Aspx?MevzuatKod=9.5.31386&MevzuatIliski=0&sourceXmlSearch=geri%20kazan%C4%B1m	2026-03-03 11:07:19.81	2026-03-03 11:07:19.81
cmmai6xkz003sj088qyskrn63	GERİ KAZANIM KATILIM PAYI BEYANNAMESİ GENEL TEBLİĞİ (SIRA NO: 1)’NDE DEĞİŞİKLİK YAPILMASINA DAİR TEBLİĞ (SIRA NO: 3)	TEBLİĞLER	\N	\N	03.03.2026	https://www.resmigazete.gov.tr/eskiler/2020/03/20200322-6.htm	\N	https://www.resmigazete.gov.tr/eskiler/2020/03/20200322-6.htm	2026-03-03 11:07:19.811	2026-03-03 11:07:19.811
cmmai6xl0003tj088warhhnp7	ÇEVRENİN KORUNMASI YÖNÜNDEN KONTROL ALTINDA TUTULAN ATIKLARIN İTHALAT DENETİMİ TEBLİĞİ (ÜRÜN GÜVENLİĞİ VE DENETİMİ: 2021/3)	TEBLİĞLER	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=36169&MevzuatTur=9&MevzuatTertip=5	\N	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=36169&MevzuatTur=9&MevzuatTertip=5	2026-03-03 11:07:19.812	2026-03-03 11:07:19.812
cmmai6xl1003uj088w22tkc06	İÇME SUYU ARITMA TESİSLERİ TEKNİK USULLER TEBLİĞİ	TEBLİĞLER	\N	\N	03.03.2026	https://www.resmigazete.gov.tr/eskiler/2020/03/20200307-2.htm	\N	https://www.resmigazete.gov.tr/eskiler/2020/03/20200307-2.htm	2026-03-03 11:07:19.814	2026-03-03 11:07:19.814
cmmai6xl2003vj088mopwe676	Binalar ile Yerleşmeler için Yeşil Sertifika UygulamaTebliği	TEBLİĞLER	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=38684&MevzuatTur=9&MevzuatTertip=5	\N	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=38684&MevzuatTur=9&MevzuatTertip=5	2026-03-03 11:07:19.815	2026-03-03 11:07:19.815
cmmai6xl4003wj088eltvhxhu	Çevrenin Korunması Yönünden Kontrol Altında Tutulan Atıkların İthalat Denetimi Tebliği (Ürün Güvenliği ve Denetimi: 2021/3)’nde Değişiklik Yapılmasına Dair Tebliğ (Ürün Güvenliği ve Denetimi: 2021/36)	TEBLİĞLER	\N	\N	03.03.2026	https://www.resmigazete.gov.tr/eskiler/2021/07/20210710-28.htm	\N	https://www.resmigazete.gov.tr/eskiler/2021/07/20210710-28.htm	2026-03-03 11:07:19.816	2026-03-03 11:07:19.816
cmmai6xl5003xj088k2s7opko	Atık Getirme Merkezi Tebliğinin Yürürlükten Kaldırılmasına Dair Tebliğ	TEBLİĞLER	\N	\N	03.03.2026	https://www.resmigazete.gov.tr/eskiler/2021/10/20211009-6.htm	\N	https://www.resmigazete.gov.tr/eskiler/2021/10/20211009-6.htm	2026-03-03 11:07:19.817	2026-03-03 11:07:19.817
cmmai6xl6003yj0888lkrz9un	Bazı Tehlikesiz Atıkların Geri Kazanımı Tebliğinin Yürürlükten Kaldırılmasına Dair Tebliğ	TEBLİĞLER	\N	\N	03.03.2026	https://www.resmigazete.gov.tr/eskiler/2021/10/20211009-7.htm	\N	https://www.resmigazete.gov.tr/eskiler/2021/10/20211009-7.htm	2026-03-03 11:07:19.818	2026-03-03 11:07:19.818
cmmai6xl7003zj088t4czrqx6	Çevrenin Korunması Yönünden Kontrol Altında Tutulan Katı Yakıtların İthalat Denetimi Tebliği (Ürün Güvenliği ve Denetimi: 2022/7)	TEBLİĞLER	\N	\N	03.03.2026	https://www.resmigazete.gov.tr/eskiler/2021/12/20211231M4-6.htm	\N	https://www.resmigazete.gov.tr/eskiler/2021/12/20211231M4-6.htm	2026-03-03 11:07:19.82	2026-03-03 11:07:19.82
cmmai6xl90040j088l5w2fuyx	Çevrenin Korunması Yönünden Kontrol Altında Tutulan Metal Hurdaların İthalat Denetimi Tebliği (Ürün Güvenliği ve Denetimi: 2022/23)	TEBLİĞLER	\N	\N	03.03.2026	https://www.resmigazete.gov.tr/eskiler/2021/12/20211231M4-20.htm	\N	https://www.resmigazete.gov.tr/eskiler/2021/12/20211231M4-20.htm	2026-03-03 11:07:19.821	2026-03-03 11:07:19.821
cmmai6xla0041j0883rpxm5d9	Pil ve Akümülatörlerin İthalat Denetimi Tebliği (Ürün Güvenliği ve Denetimi (2022/15)	TEBLİĞLER	\N	\N	03.03.2026	https://www.resmigazete.gov.tr/eskiler/2021/12/20211231M4-14.htm	\N	https://www.resmigazete.gov.tr/eskiler/2021/12/20211231M4-14.htm	2026-03-03 11:07:19.823	2026-03-03 11:07:19.823
cmmai6xlb0042j0880knygfv4	Çevrenin Korunması Yönünden Kontrol Altında Tutulan Atıkların İthalat Denetimi Tebliği (Ürün Güvenliği ve Denetimi: 2022/3)	TEBLİĞLER	\N	\N	03.03.2026	https://www.resmigazete.gov.tr/eskiler/2021/12/20211231M4-2.htm	\N	https://www.resmigazete.gov.tr/eskiler/2021/12/20211231M4-2.htm	2026-03-03 11:07:19.824	2026-03-03 11:07:19.824
cmmai6xld0043j088mbny60ok	Binalar ile Yerleşmeler İçin Yeşil Sertifika Uygulama Tebliğinin Yürürlükten Kaldırılmasına Dair Tebliğ	TEBLİĞLER	\N	\N	03.03.2026	https://www.resmigazete.gov.tr/eskiler/2022/06/20220612-4.htm	\N	https://www.resmigazete.gov.tr/eskiler/2022/06/20220612-4.htm	2026-03-03 11:07:19.825	2026-03-03 11:07:19.825
cmmai6xle0044j088apr3unac	Sera Gazı Emisyon Raporlarının Doğrulanması ve Doğrulayıcı Kuruluşların Akreditasyonu Tebliğinde Değişiklik Yapılmasına Dair Tebliğ	TEBLİĞLER	\N	\N	03.03.2026	https://www.resmigazete.gov.tr/eskiler/2022/06/20220621-5.htm	\N	https://www.resmigazete.gov.tr/eskiler/2022/06/20220621-5.htm	2026-03-03 11:07:19.826	2026-03-03 11:07:19.826
cmmai6xlf0045j088vr6v45b1	Durgun Yerüstü Kara İç Sularının Ötrofikasyona Karşı Korunmasına İlişkin Tebliğ	TEBLİĞLER	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=19430&MevzuatTur=9&MevzuatTertip=5	\N	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=19430&MevzuatTur=9&MevzuatTertip=5	2026-03-03 11:07:19.828	2026-03-03 11:07:19.828
cmmai6xlh0046j088t2m3q9cu	Yerüstü Su Kalitesi Yönetmeliğinde Değişiklik Yapılmasına Dair Yönetmelik	TEBLİĞLER	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=16806&MevzuatTur=7&MevzuatTertip=5	\N	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=16806&MevzuatTur=7&MevzuatTertip=5	2026-03-03 11:07:19.829	2026-03-03 11:07:19.829
cmmai6xli0047j088zwiwdkln	Tehlikeli Maddeler İçin Yaptırılacak Zorunlu Sorumluluk Sigortalarına İlişkin Tarife ve Talimat	TEBLİĞLER	\N	\N	03.03.2026	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=13969&MevzuatTur=9&MevzuatTertip=5	\N	https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=13969&MevzuatTur=9&MevzuatTertip=5	2026-03-03 11:07:19.83	2026-03-03 11:07:19.83
cmmai6xlj0048j088oc7eddm0	Atıksu Arıtma Tesislerinde Çalışan Teknik Personele İlişkin Tebliğde Değişiklik Yapılmasına Dair Tebliğ	TEBLİĞLER	\N	\N	03.03.2026	https://www.resmigazete.gov.tr/eskiler/2025/09/20250923-2.htm	\N	https://www.resmigazete.gov.tr/eskiler/2025/09/20250923-2.htm	2026-03-03 11:07:19.832	2026-03-03 11:07:19.832
cmmai6xlk0049j088zq06kkaz	Kıyı Tesisleri Deniz Kirliliği Zorunlu Mali Sorumluluk Sigortası Tarife ve Talimat Tebliğinde Değişiklik Yapılmasına Dair Tebliğ	TEBLİĞLER	\N	\N	03.03.2026	https://www.resmigazete.gov.tr/eskiler/2025/11/20251125-9.htm	\N	https://www.resmigazete.gov.tr/eskiler/2025/11/20251125-9.htm	2026-03-03 11:07:19.833	2026-03-03 11:07:19.833
cmmai6xll004aj088q0yq9bs6	7552 Sayılı İklim Kanunu Uyarınca Verilecek İdari Para Cezalarına İlişkin Tebliğ (2026/1)	TEBLİĞLER	\N	\N	03.03.2026	https://www.resmigazete.gov.tr/eskiler/2025/12/20251227-11.htm	\N	https://www.resmigazete.gov.tr/eskiler/2025/12/20251227-11.htm	2026-03-03 11:07:19.834	2026-03-03 11:07:19.834
cmmai6xln004bj088ilye1iqh	2872 Sayılı Çevre Kanununun 20 nci Maddesinin Birinci Fıkrasının (K) Bendi Uyarınca Verilecek İdari Para Cezalarına İlişkin Tebliğ (No: 2025/41)	TEBLİĞLER	\N	\N	03.03.2026	https://www.resmigazete.gov.tr/eskiler/2025/12/20251227-12.htm	\N	https://www.resmigazete.gov.tr/eskiler/2025/12/20251227-12.htm	2026-03-03 11:07:19.835	2026-03-03 11:07:19.835
cmmai6xlo004cj088v9x9kakl	2872 Sayılı Çevre Kanunu Uyarınca Alınacak Geri Kazanım Katılım Payı Tutarlarına İlişkin Tebliğ (2026/1)	TEBLİĞLER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/v2/cygm/2025/12/TBL-33123gekap-20261-2-20251230105416.pdf	\N	https://webdosya.csb.gov.tr/v2/cygm/2025/12/TBL-33123gekap-20261-2-20251230105416.pdf	2026-03-03 11:07:19.836	2026-03-03 11:07:19.836
cmmai6xlp004dj088dpbxyepq	2872 Sayılı Çevre Kanunu Uyarınca Verilecek İdari Para Cezalarına İlişkin Tebliğ (2026/1)	TEBLİĞLER	\N	\N	03.03.2026	https://www.resmigazete.gov.tr/eskiler/2025/12/20251230-7.htm	\N	https://www.resmigazete.gov.tr/eskiler/2025/12/20251230-7.htm	2026-03-03 11:07:19.837	2026-03-03 11:07:19.837
cmmai6xlq004ej088sa8z18vs	GENELGELER	TEBLİĞLER	\N	\N	03.03.2026	http://www.resmigazete.gov.tr/eskiler/2018/12/20181231-6.htm	\N	http://www.resmigazete.gov.tr/eskiler/2018/12/20181231-6.htm	2026-03-03 11:07:19.839	2026-03-03 11:07:19.839
cmmai6xlr004fj088urk0g3l8	Atık Karakterizasyonu Genelgesi	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/icerikler/gng2024-8at-kkarakter-zasyonu-20241219090929.pdf	\N	https://webdosya.csb.gov.tr/db/cygm/icerikler/gng2024-8at-kkarakter-zasyonu-20241219090929.pdf	2026-03-03 11:07:19.84	2026-03-03 11:07:19.84
cmmai6xls004gj0881lufb8qg	Atıkların Düzenli Depolanmasına Dair Yönetmeliğe İlişkin Genelge	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/editordosya/GNG2010-16AtikDuzenliDepo.pdf	\N	https://webdosya.csb.gov.tr/db/cygm/editordosya/GNG2010-16AtikDuzenliDepo.pdf	2026-03-03 11:07:19.841	2026-03-03 11:07:19.841
cmmai6xlt004hj088kbptyfky	Düzenli Depolama Tesisi Uygulama Projeleri Hazırlanmasına İlişkin Genelge	GENELGELER	\N	\N	03.03.2026	http://webdosya.csb.gov.tr/db/cygm/icerikler/gng2018-15ddt_uyg_prj_haz-20181128144802.pdf	\N	http://webdosya.csb.gov.tr/db/cygm/icerikler/gng2018-15ddt_uyg_prj_haz-20181128144802.pdf	2026-03-03 11:07:19.842	2026-03-03 11:07:19.842
cmmai6xlv004ij088fmpk0wn1	Elektrikli ve Elektronik Eşyalarda Bazı Zararlı Maddelerin Kullanımının Kısıtlanmasından Muaf Tutulan Uygulamalara İlişkin Genelge (2024/7 sayılı Genelge ile güncellenen konsolide metin)	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/icerikler/gng2024-7eeemuafkonsol-de20241128-20241128145206.pdf	\N	https://webdosya.csb.gov.tr/db/cygm/icerikler/gng2024-7eeemuafkonsol-de20241128-20241128145206.pdf	2026-03-03 11:07:19.843	2026-03-03 11:07:19.843
cmmai6xlw004jj0888zddc31q	Gereksiz Kırtasiye Kullanımının Önlenmesine İlişkin Genelge	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/editordosya/GNG2012-13GereksizKirtasiye.pdf	\N	https://webdosya.csb.gov.tr/db/cygm/editordosya/GNG2012-13GereksizKirtasiye.pdf	2026-03-03 11:07:19.844	2026-03-03 11:07:19.844
cmmai6xly004kj088inlgg0b0	Hafriyat Toprağı, İnşaat ve Yıkıntı Atıkları Yetki Devri	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/editordosya/GNG2008-06YDGHafriyatYikinti.pdf	\N	https://webdosya.csb.gov.tr/db/cygm/editordosya/GNG2008-06YDGHafriyatYikinti.pdf	2026-03-03 11:07:19.846	2026-03-03 11:07:19.846
cmmai6xlz004lj0882ztylpio	Katı Atık Genelgesi	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/editordosya/GNG2003-08KatiAtik.pdf	\N	https://webdosya.csb.gov.tr/db/cygm/editordosya/GNG2003-08KatiAtik.pdf	2026-03-03 11:07:19.847	2026-03-03 11:07:19.847
cmmai6xm0004mj088t3va176y	Tek Kullanımlık Maske, Eldiven Gibi Kişisel Hijyen Malzeme Atıklarının Yönetiminde Covid-19 Tedbirlerine İlişkin 2020/12 Genelgesi	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/icerikler/gng2020-16-cov-d-19-20200408101457.pdf	\N	https://webdosya.csb.gov.tr/db/cygm/icerikler/gng2020-16-cov-d-19-20200408101457.pdf	2026-03-03 11:07:19.849	2026-03-03 11:07:19.849
cmmai6xm1004nj088lbgur346	Tıbbi Atıkların Kontrolü Yönetmeliği Eğitim Programları Genelgesi	GENELGELER	\N	\N	03.03.2026	http://webdosya.csb.gov.tr/db/cygm/icerikler/genelge_2018_08-20180803154215.pdf	\N	http://webdosya.csb.gov.tr/db/cygm/icerikler/genelge_2018_08-20180803154215.pdf	2026-03-03 11:07:19.85	2026-03-03 11:07:19.85
cmmai6xm2004oj088392tb86u	Tıbbi Atıkların Yönetimine İlişkin Genelgelerin İptal Edilmesi Hakkında Genelge	GENELGELER	\N	\N	03.03.2026	http://webdosya.csb.gov.tr/db/cygm/icerikler/genelge_2018_07-20180803154357.pdf	\N	http://webdosya.csb.gov.tr/db/cygm/icerikler/genelge_2018_07-20180803154357.pdf	2026-03-03 11:07:19.851	2026-03-03 11:07:19.851
cmmai6xm4004pj088rp9noaty	04 Mayıs 2015 tarih ve 5993 sayılı Bakan Oluru ile “Yetkilendirme Usul ve Esasları”	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/editordosya/ykusulesas(1).pdf	\N	https://webdosya.csb.gov.tr/db/cygm/editordosya/ykusulesas(1).pdf	2026-03-03 11:07:19.852	2026-03-03 11:07:19.852
cmmai6xm5004qj088bjkg03h8	Akümülatör Depozito Sistemi Uygulamalarına İlişkin Usul ve Esaslar	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/icerikler/gngakudepo2022-20250725162529.pdf	\N	https://webdosya.csb.gov.tr/db/cygm/icerikler/gngakudepo2022-20250725162529.pdf	2026-03-03 11:07:19.853	2026-03-03 11:07:19.853
cmmai6xm6004rj088v475kcjq	Atık Yağların Toplanmasına İlişkin Usul ve Esaslar	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/icerikler/at-kyagtop20230320-20230329104244.pdf	\N	https://webdosya.csb.gov.tr/db/cygm/icerikler/at-kyagtop20230320-20230329104244.pdf	2026-03-03 11:07:19.854	2026-03-03 11:07:19.854
cmmai6xm7004sj088dzzwfb1o	Geri Kazanım Katılım Payına İlişkin Yönetmeliğin Uygulanmasına Dair Usul Ve Esaslar	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/icerikler/gekap_ue20250808-20250808110606.pdf	\N	https://webdosya.csb.gov.tr/db/cygm/icerikler/gekap_ue20250808-20250808110606.pdf	2026-03-03 11:07:19.856	2026-03-03 11:07:19.856
cmmai6xm8004tj088xain6fj2	Plastik Poşetlerin Ücretlendirilmesine İlişkin Usul ve Esaslar	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/v2/cygm/2025/12/posetusulesas20251223-20251228005347.pdf	\N	https://webdosya.csb.gov.tr/v2/cygm/2025/12/posetusulesas20251223-20251228005347.pdf	2026-03-03 11:07:19.857	2026-03-03 11:07:19.857
cmmai6xm9004uj0882fw51qty	Yeniden/Tekrar Kullanılabilir Ambalajlar İçin Depozito Sistemi Uygulamalarına İlişkin Usul ve Esaslar	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/icerikler/usulesasytkullanamb-20250725162821.pdf	\N	https://webdosya.csb.gov.tr/db/cygm/icerikler/usulesasytkullanamb-20250725162821.pdf	2026-03-03 11:07:19.858	2026-03-03 11:07:19.858
cmmai6xmb004vj0883uzwywoc	Denizcilik Atıkları Uygulaması Hakkında Genelge	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/icerikler/genelge-20220910100702.pdf	\N	https://webdosya.csb.gov.tr/db/cygm/icerikler/genelge-20220910100702.pdf	2026-03-03 11:07:19.859	2026-03-03 11:07:19.859
cmmai6xmc004wj0881s4sfigu	Marmara Denizi Eylem Planı'nın Uygulanmasına İlişkin Genelge	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/icerikler/2012-12-say-l--genelge_20210607034915-20210609132947.pdf	\N	https://webdosya.csb.gov.tr/db/cygm/icerikler/2012-12-say-l--genelge_20210607034915-20210609132947.pdf	2026-03-03 11:07:19.86	2026-03-03 11:07:19.86
cmmai6xmd004xj0887m4scp9p	Denizlerde Faaliyet Gösteren Balık Çiftliklerinin Çevresel Yönetimi Uygulama Genelgesi	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/icerikler/genelge-metn--20210301212352.pdf	\N	https://webdosya.csb.gov.tr/db/cygm/icerikler/genelge-metn--20210301212352.pdf	2026-03-03 11:07:19.861	2026-03-03 11:07:19.861
cmmai6xme004yj088lk0kmv49	Atıksu Arıtma / Derin Deniz Deşarjı Tesisi Proje Onayı Genelgesi	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/icerikler//gen-2018-14-atiksu-aritma-der-n-den-z-desarji-tes-s--proje-onayi-genelges--20181123140410.pdf	\N	https://webdosya.csb.gov.tr/db/cygm/icerikler//gen-2018-14-atiksu-aritma-der-n-den-z-desarji-tes-s--proje-onayi-genelges--20181123140410.pdf	2026-03-03 11:07:19.862	2026-03-03 11:07:19.862
cmmai6xmf004zj088gug12fy8	Derin Deniz Deşarjı izleme Genelgesi	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/editordosya/GNG2009-16DDDIzleme.doc	\N	https://webdosya.csb.gov.tr/db/cygm/editordosya/GNG2009-16DDDIzleme.doc	2026-03-03 11:07:19.864	2026-03-03 11:07:19.864
cmmai6xmg0050j0880jiyz0qf	Gemi Kaynaklı Deniz Kirliliğinin Denetiminde Görevlendirilecek Personelin Nitelikleri İle Bu Personele Verilecek Eğitime İlişkin Genelge	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/icerikler/den-z-k-rl-l-g--denet-m-personel--hk.-20230124095356.pdf	\N	https://webdosya.csb.gov.tr/db/cygm/icerikler/den-z-k-rl-l-g--denet-m-personel--hk.-20230124095356.pdf	2026-03-03 11:07:19.865	2026-03-03 11:07:19.865
cmmai6xmh0051j088u4oact4q	Kıyı Tesisi Risk Değerlendirmesi ve Acil Müdahale Planı Onay Prosedürü Genelgesi	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/editordosya/GNG2009-06RDAMPOnayProseduru.rtf	\N	https://webdosya.csb.gov.tr/db/cygm/editordosya/GNG2009-06RDAMPOnayProseduru.rtf	2026-03-03 11:07:19.866	2026-03-03 11:07:19.866
cmmai6xmj0052j088s8uo1xb1	Gemi Kaynaklı Deniz Kirliliği Denetimi Yetkisinin Devri Genelgesi	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/icerikler/gem--kaynakli-den-z-k-rl-l-g--denet-m--yetk-s-n-n-devr--hk.-20230124095205.pdf	\N	https://webdosya.csb.gov.tr/db/cygm/icerikler/gem--kaynakli-den-z-k-rl-l-g--denet-m--yetk-s-n-n-devr--hk.-20230124095205.pdf	2026-03-03 11:07:19.867	2026-03-03 11:07:19.867
cmmai6xmk0053j0886tcipz0k	Deniz Çöpleri İl Eylem Planlarının Hazırlanması ve Uygulanması Genelgesi	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/icerikler/den-z-copler--il-eylem-planlarinin-hazirlanmasi-ve-uygulanmasigenelges--20190611131547.pdf	\N	https://webdosya.csb.gov.tr/db/cygm/icerikler/den-z-copler--il-eylem-planlarinin-hazirlanmasi-ve-uygulanmasigenelges--20190611131547.pdf	2026-03-03 11:07:19.868	2026-03-03 11:07:19.868
cmmai6xml0054j088vyahvsib	2019/9 Sayılı Deniz Çöpleri İl Eylem Planlarının Hazırlanması ve Uygulanması Genelgesi Kılavuzları-1 için tıklayınız.	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/icerikler/1--eylem-plani-formati-formati-20230614110225.docx	\N	https://webdosya.csb.gov.tr/db/cygm/icerikler/1--eylem-plani-formati-formati-20230614110225.docx	2026-03-03 11:07:19.87	2026-03-03 11:07:19.87
cmmai6xmm0055j088mbtzzxqz	2 - İl Faaliyet Raporu Format	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/icerikler/2--il-faal-yet-raporu-format-20230614110254.docx	\N	https://webdosya.csb.gov.tr/db/cygm/icerikler/2--il-faal-yet-raporu-format-20230614110254.docx	2026-03-03 11:07:19.871	2026-03-03 11:07:19.871
cmmai6xmn0056j088id61md9p	3 Aylık Deniz Çöpleri Envanter Tablosu	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/icerikler/3-ayl-k-den-z-copler---l-envanter--20230614110418.xlsx	\N	https://webdosya.csb.gov.tr/db/cygm/icerikler/3-ayl-k-den-z-copler---l-envanter--20230614110418.xlsx	2026-03-03 11:07:19.872	2026-03-03 11:07:19.872
cmmai6xmp0057j0882hxz04yk	Dip Taraması ve Boşaltım Faaliyetleri Uygulama ve Yetki Devri Genelgesi	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/icerikler/genelge-20200220084653.pdf	\N	https://webdosya.csb.gov.tr/db/cygm/icerikler/genelge-20200220084653.pdf	2026-03-03 11:07:19.873	2026-03-03 11:07:19.873
cmmai6xmq0058j088s91kc75c	Normalleşme Sürecinde Gemi Atıklarının Yönetimine İlişkin Genelge	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/icerikler/2020-19-covid-19-genelge-20200817153437.pdf	\N	https://webdosya.csb.gov.tr/db/cygm/icerikler/2020-19-covid-19-genelge-20200817153437.pdf	2026-03-03 11:07:19.874	2026-03-03 11:07:19.874
cmmai6xmr0059j088ha65dolz	Hava Kalitesi Değerlendirme ve Yönetimi Genelgesi	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/editordosya/GNG2013-37HavaKalitesiDegerl.pdf	\N	https://webdosya.csb.gov.tr/db/cygm/editordosya/GNG2013-37HavaKalitesiDegerl.pdf	2026-03-03 11:07:19.876	2026-03-03 11:07:19.876
cmmai6xms005aj088xo56gt6y	Hava Kirliliğinin Kontrolü ve Önlenmesi Genelgesi	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/editordosya/GNG2010-14HavaKirlKontOnl.doc	\N	https://webdosya.csb.gov.tr/db/cygm/editordosya/GNG2010-14HavaKirlKontOnl.doc	2026-03-03 11:07:19.877	2026-03-03 11:07:19.877
cmmai6xmu005bj088xbhj4erh	İthal Katı Yakıtlar Genelgesi	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/editordosya/GNG2011-04IthalKatiYakitlar.doc	\N	https://webdosya.csb.gov.tr/db/cygm/editordosya/GNG2011-04IthalKatiYakitlar.doc	2026-03-03 11:07:19.878	2026-03-03 11:07:19.878
cmmai6xmv005cj088gmf2szr2	İthal Katı Yakıtlar Genelgesi	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/editordosya/genelge(1).pdf	\N	https://webdosya.csb.gov.tr/db/cygm/editordosya/genelge(1).pdf	2026-03-03 11:07:19.879	2026-03-03 11:07:19.879
cmmai6xmw005dj0889xmf4tf4	İthal Katı Yakıtlar Genelgesi	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/icerikler/2021-19_sayili_genelge-20211011113926.pdf	\N	https://webdosya.csb.gov.tr/db/cygm/icerikler/2021-19_sayili_genelge-20211011113926.pdf	2026-03-03 11:07:19.881	2026-03-03 11:07:19.881
cmmai6xmx005ej088788o82gc	Müzik Yayın İznine İlişkin Usul ve Esaslar	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/icerikler/bakan-oluru-muz-k-yayin-izn-ne-il-sk-n-usul-ve-esaslar-20230102150833.pdf	\N	https://webdosya.csb.gov.tr/db/cygm/icerikler/bakan-oluru-muz-k-yayin-izn-ne-il-sk-n-usul-ve-esaslar-20230102150833.pdf	2026-03-03 11:07:19.882	2026-03-03 11:07:19.882
cmmai6xmz005fj08848muowfs	Tekstil Sektöründe Temiz Üretim Uygulamaları	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/icerikler/tekst-l-sektorunde-tem-z-uret-m-uygulamalari-genelges--20230102182517.pdf	\N	https://webdosya.csb.gov.tr/db/cygm/icerikler/tekst-l-sektorunde-tem-z-uret-m-uygulamalari-genelges--20230102182517.pdf	2026-03-03 11:07:19.883	2026-03-03 11:07:19.883
cmmai6xn2005gj0889w8ikhm5	Yakıt ve Yakma Sistemleri Hakkında Genelge	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/icerikler/2024_5-20240924135520.pdf	\N	https://webdosya.csb.gov.tr/db/cygm/icerikler/2024_5-20240924135520.pdf	2026-03-03 11:07:19.886	2026-03-03 11:07:19.886
cmmai6xn3005hj08816x10yew	Atık Toplayıcıları	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/icerikler/gng20022-6at-ktoplay-c-lar--20220622132541.pdf	\N	https://webdosya.csb.gov.tr/db/cygm/icerikler/gng20022-6at-ktoplay-c-lar--20220622132541.pdf	2026-03-03 11:07:19.888	2026-03-03 11:07:19.888
cmmai6xn5005ij088zcrmy7bn	Atık Getirme Merkezlerinin Kurulması ve İşletilmesi İle Sıfır Atık Uygulamalarına İlişkin Usul Ve Esaslar	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/duyurular/usulesasagmsau20211231-20220105161839-20220105163645.pdf	\N	https://webdosya.csb.gov.tr/db/cygm/duyurular/usulesasagmsau20211231-20220105161839-20220105163645.pdf	2026-03-03 11:07:19.889	2026-03-03 11:07:19.889
cmmai6xn6005jj08881654sif	Atıksu Arıtma / Derin Deniz Deşarjı Tesisi Proje Onayı Genelgesi	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/icerikler/2025-5-sayili-genelge-20250930103540.pdf	\N	https://webdosya.csb.gov.tr/db/cygm/icerikler/2025-5-sayili-genelge-20250930103540.pdf	2026-03-03 11:07:19.89	2026-03-03 11:07:19.89
cmmai6xn7005kj088y2lq6kik	Klavuz	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/icerikler/proje-onay-ve-tekn-k-rapor-hazirlama-kilavuzu-2025-5-20250930103614.docx	\N	https://webdosya.csb.gov.tr/db/cygm/icerikler/proje-onay-ve-tekn-k-rapor-hazirlama-kilavuzu-2025-5-20250930103614.docx	2026-03-03 11:07:19.891	2026-03-03 11:07:19.891
cmmai6xn8005lj088tz4drwj3	Atıksu Arıtma / Derin Deniz Deşarjı Tesisi Proje Onayı Genelgesi	GENELGELER	\N	\N	03.03.2026	http://webdosya.csb.gov.tr/db/cygm/icerikler/gen-2018-14-atiksu-aritma-der-n-den-z-desarji-tes-s--proje-onayi-genelges--20181123140410.pdf	\N	http://webdosya.csb.gov.tr/db/cygm/icerikler/gen-2018-14-atiksu-aritma-der-n-den-z-desarji-tes-s--proje-onayi-genelges--20181123140410.pdf	2026-03-03 11:07:19.893	2026-03-03 11:07:19.893
cmmai6xn9005mj088iadkh7ry	Klavuz	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/icerikler//proje-onay-ve-tekn-k-rapor-hazirlama-kilavuzu-20181123135748.pdf	\N	https://webdosya.csb.gov.tr/db/cygm/icerikler//proje-onay-ve-tekn-k-rapor-hazirlama-kilavuzu-20181123135748.pdf	2026-03-03 11:07:19.894	2026-03-03 11:07:19.894
cmmai6xnb005nj088z8eh5nuc	Zeytinyağı İşletmelerinin 2 Fazlı Üretime Geçişi	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/icerikler/zeyt-nyagi-genelges--20230126083828.pdf	\N	https://webdosya.csb.gov.tr/db/cygm/icerikler/zeyt-nyagi-genelges--20230126083828.pdf	2026-03-03 11:07:19.895	2026-03-03 11:07:19.895
cmmai6xnc005oj088yhowjbeh	Marmara Denizi Eylem Planı Kapsamında Deşarj Standartlarında Kısıtlama Genelgesi	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/icerikler/2021-13-sayili-genelge-22-06-2021-1172378-20210623132535.pdf	\N	https://webdosya.csb.gov.tr/db/cygm/icerikler/2021-13-sayili-genelge-22-06-2021-1172378-20210623132535.pdf	2026-03-03 11:07:19.896	2026-03-03 11:07:19.896
cmmai6xnd005pj088zr6rp5lh	İş Termin Planı	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/icerikler/is-term-n-plani-09.07.2021-002-20210710074732.docx	\N	https://webdosya.csb.gov.tr/db/cygm/icerikler/is-term-n-plani-09.07.2021-002-20210710074732.docx	2026-03-03 11:07:19.898	2026-03-03 11:07:19.898
cmmai6xne005qj088q013mlxm	Atıksu Bilgi Sistemi Genelgesi	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/icerikler/atiksu-b-lg--s-stem--genelges--20200615164754.pdf	\N	https://webdosya.csb.gov.tr/db/cygm/icerikler/atiksu-b-lg--s-stem--genelges--20200615164754.pdf	2026-03-03 11:07:19.899	2026-03-03 11:07:19.899
cmmai6xng005rj0883gzze5yl	COVİD-19 Salgını ve Atıksu Yönetimine İlişkin Önlemler Genelgesi	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/icerikler/genelge-cov-d-19-salgini-ve-atiksu-yonet-m-ne-il-sk-n-onlemler-20200409151134.pdf	\N	https://webdosya.csb.gov.tr/db/cygm/icerikler/genelge-cov-d-19-salgini-ve-atiksu-yonet-m-ne-il-sk-n-onlemler-20200409151134.pdf	2026-03-03 11:07:19.9	2026-03-03 11:07:19.9
cmmai6xnh005sj088xrzig70i	Ergene Nehrinde Deşarj Standartlarında Kısıtlama Genelgesi	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/icerikler/2019-17-sayili-koi-genelgesi-20191230084555.pdf	\N	https://webdosya.csb.gov.tr/db/cygm/icerikler/2019-17-sayili-koi-genelgesi-20191230084555.pdf	2026-03-03 11:07:19.901	2026-03-03 11:07:19.901
cmmai6xni005tj088m5t0itl7	Zeytinyağı Tesislerinde Oluşan Atıksuların Yönetiminde Uyulması Gereken Teknik Hususlar	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/editordosya/zeytin_genelgesi_1447773403(1).pdf	\N	https://webdosya.csb.gov.tr/db/cygm/editordosya/zeytin_genelgesi_1447773403(1).pdf	2026-03-03 11:07:19.903	2026-03-03 11:07:19.903
cmmai6xnk005uj088gwjfrpak	Zeytinyağı Tesislerinde Oluşan Atıksuların Yönetiminde Uyulması Gereken Teknik Esaslar	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/editordosya/1447773478%20Teknik%20Kriterler(2).pdf	\N	https://webdosya.csb.gov.tr/db/cygm/editordosya/1447773478%20Teknik%20Kriterler(2).pdf	2026-03-03 11:07:19.904	2026-03-03 11:07:19.904
cmmai6xnl005vj088446b1lsz	2004/12 Sayılı Katı Atık ve Atıksu Yönetimi Genelgesi'nin İptaline İlişkin Genelge (2013/11)	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/cygm/editordosya/GNG2013-11KatiAtikIptal.pdf	\N	https://webdosya.csb.gov.tr/db/cygm/editordosya/GNG2013-11KatiAtikIptal.pdf	2026-03-03 11:07:19.906	2026-03-03 11:07:19.906
cmmai6xnm005wj088r5zh3dzp	Hidroflorokarbonların İthalatı İçin Yıllık Kota Tahsisine İlişkin Genelge	GENELGELER	\N	\N	03.03.2026	https://iklim.gov.tr/db/turkce/icerikler/files/Hidroflorokarbonlar%C4%B1n%20%C4%B0thalat%C4%B1%20%C4%B0%C3%A7in%20Y%C4%B1ll%C4%B1k%20Kota%20Tahsisine%20%C4%B0li%C5%9Fkin%20Genelge(2025-1).pdf	\N	https://iklim.gov.tr/db/turkce/icerikler/files/Hidroflorokarbonlar%C4%B1n%20%C4%B0thalat%C4%B1%20%C4%B0%C3%A7in%20Y%C4%B1ll%C4%B1k%20Kota%20Tahsisine%20%C4%B0li%C5%9Fkin%20Genelge(2025-1).pdf	2026-03-03 11:07:19.907	2026-03-03 11:07:19.907
cmmai6xnn005xj0883m5gcgy9	Florlu Sera Gazlarının Yönetimi Hakkında Genelge	GENELGELER	\N	\N	03.03.2026	https://iklim.gov.tr/db/turkce/icerikler/files/Florlu%20Sera%20Gaz%C4%B1%20Genelgesi.pdf	\N	https://iklim.gov.tr/db/turkce/icerikler/files/Florlu%20Sera%20Gaz%C4%B1%20Genelgesi.pdf	2026-03-03 11:07:19.908	2026-03-03 11:07:19.908
cmmai6xnp005yj0883bq36qt8	Yurt Dışı Geçici Görevlendirme Genelgesi	GENELGELER	\N	\N	03.03.2026	https://iklim.gov.tr/db/turkce/icerikler/files/Yurt%20D%C4%B1%C5%9F%C4%B1%20Ge%C3%A7ici%20G%C3%B6revlendirme%20Genelgesi.pdf	\N	https://iklim.gov.tr/db/turkce/icerikler/files/Yurt%20D%C4%B1%C5%9F%C4%B1%20Ge%C3%A7ici%20G%C3%B6revlendirme%20Genelgesi.pdf	2026-03-03 11:07:19.909	2026-03-03 11:07:19.909
cmmai6xnq005zj088v066h49a	Stratejik Plan	GENELGELER	\N	\N	03.03.2026	https://iklim.gov.tr/db/turkce/icerikler/files/Stratejik%20Plan%20Genelgesi.pdf	\N	https://iklim.gov.tr/db/turkce/icerikler/files/Stratejik%20Plan%20Genelgesi.pdf	2026-03-03 11:07:19.91	2026-03-03 11:07:19.91
cmmai6xnr0060j088umcx1wpj	Doğrulayıcı Kuruluşlarda Baş Doğrulayıcı, Doğrulayıcı ve Teknik Uzman Çalıştırılması Hakkında Genelge	GENELGELER	\N	\N	03.03.2026	https://iklim.gov.tr/db/turkce/icerikler/files/Genelge(2022_1)(1).pdf	\N	https://iklim.gov.tr/db/turkce/icerikler/files/Genelge(2022_1)(1).pdf	2026-03-03 11:07:19.912	2026-03-03 11:07:19.912
cmmai6xns0061j088a1dqxw7p	Türkiye Çevre Haftası	GENELGELER	\N	\N	03.03.2026	https://www.iklim.gov.tr/Images/Genelgeler/turkiye-cevre-haftasi-180631.pdf	\N	https://www.iklim.gov.tr/Images/Genelgeler/turkiye-cevre-haftasi-180631.pdf	2026-03-03 11:07:19.913	2026-03-03 11:07:19.913
cmmai6xnu0062j08858dt8g52	Ozon Tabakasını İncelten Maddelerin İthalatı ve Kullanımı Genelgesi	GENELGELER	\N	\N	03.03.2026	https://iklim.gov.tr/db/turkce/icerikler/files/4.2.%20OT%C4%B0M%20Genelgesi(1).pdf	\N	https://iklim.gov.tr/db/turkce/icerikler/files/4.2.%20OT%C4%B0M%20Genelgesi(1).pdf	2026-03-03 11:07:19.914	2026-03-03 11:07:19.914
cmmai6xnv0063j088csgap71p	İklim Değişikliği ve Hava Yönetimi Koordinasyon Kurulu Genelgesi	GENELGELER	\N	\N	03.03.2026	https://www.iklim.gov.tr/Images/Genelgeler/iklim-degisikligi-ve-hava-yonetimi-koordinasyon-kurulu-genelgesi-913575.pdf	\N	https://www.iklim.gov.tr/Images/Genelgeler/iklim-degisikligi-ve-hava-yonetimi-koordinasyon-kurulu-genelgesi-913575.pdf	2026-03-03 11:07:19.915	2026-03-03 11:07:19.915
cmmai6xnw0064j08849shkvl4	Halon Genelgesi	GENELGELER	\N	\N	03.03.2026	https://iklim.gov.tr/db/turkce/icerikler/files/4.1.%20halon-genelgesi.pdf	\N	https://iklim.gov.tr/db/turkce/icerikler/files/4.1.%20halon-genelgesi.pdf	2026-03-03 11:07:19.916	2026-03-03 11:07:19.916
cmmai6xnx0065j088qzg3o2sp	03.01.2024 tarih ve 2025/1 Sayılı Genelge / Konu: Atık İthalatı Uygulamaları Genelgesi	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/ced/icerikler/2025-1-atik-ithalati-uygulama-genelges--1-20250106084812.pdf	\N	https://webdosya.csb.gov.tr/db/ced/icerikler/2025-1-atik-ithalati-uygulama-genelges--1-20250106084812.pdf	2026-03-03 11:07:19.918	2026-03-03 11:07:19.918
cmmai6xny0066j088vfjtlfin	03.03.2022 tarih ve 2022/4 Sayılı Genelge / Konu: Kütle Denge Bildirimleri	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/ced/icerikler/2022-4_genelge_kutle_denge_bildirimleri-20220303120057.pdf	\N	https://webdosya.csb.gov.tr/db/ced/icerikler/2022-4_genelge_kutle_denge_bildirimleri-20220303120057.pdf	2026-03-03 11:07:19.919	2026-03-03 11:07:19.919
cmmai6xo00067j0889dhyi5dn	08.08.2018 tarih ve 2018/09 Sayılı Genelge / Konu: ÇED Süreçleri Hk.	GENELGELER	\N	\N	03.03.2026	http://webdosya.csb.gov.tr/db/ced/icerikler/genelge_08082018_2018_09-20180905130440.pdf	\N	http://webdosya.csb.gov.tr/db/ced/icerikler/genelge_08082018_2018_09-20180905130440.pdf	2026-03-03 11:07:19.92	2026-03-03 11:07:19.92
cmmai6xo10068j0882evm88qt	08.04.2015 tarih ve 2015/03 Sayılı Genelge / Konu: ÇED Yönetmeliği Uygulamaları	GENELGELER	\N	\N	03.03.2026	http://webdosya.csb.gov.tr/db/ced/icerikbelge/icerikbelge2984.pdf	\N	http://webdosya.csb.gov.tr/db/ced/icerikbelge/icerikbelge2984.pdf	2026-03-03 11:07:19.921	2026-03-03 11:07:19.921
cmmai6xo20069j088jzq7xr80	25.11.2014 tarih ve 2014/24 Sayılı Genelge / Konu: ÇED Yönetmeliği	GENELGELER	\N	\N	03.03.2026	http://webdosya.csb.gov.tr/db/ced/editordosya/25112014-2014_24GENELGE.pdf	\N	http://webdosya.csb.gov.tr/db/ced/editordosya/25112014-2014_24GENELGE.pdf	2026-03-03 11:07:19.922	2026-03-03 11:07:19.922
cmmai6xo3006aj088g8yometq	2009/7 Sayılı Genelge / Konu: ÇED Yönetmeliği Uygulamaları	GENELGELER	\N	\N	03.03.2026	http://webdosya.csb.gov.tr/db/ced/icerikler/2009-7_say-l-_genelge-20180729174058.pdf	\N	http://webdosya.csb.gov.tr/db/ced/icerikler/2009-7_say-l-_genelge-20180729174058.pdf	2026-03-03 11:07:19.923	2026-03-03 11:07:19.923
cmmai6xo4006bj088suhzxtpc	18.11.2020 tarih ve 2020/25 Sayılı Genelge / Konu: Hava Kirliliğinin Kontrolüne Yönelik Uygulamalar	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/ced/icerikler/202025-say-l--genelge-20201118152738.pdf	\N	https://webdosya.csb.gov.tr/db/ced/icerikler/202025-say-l--genelge-20201118152738.pdf	2026-03-03 11:07:19.925	2026-03-03 11:07:19.925
cmmai6xo6006cj088zn85403x	24.06.2015 tarih ve 2015/7 Sayılı Genelge / Konu: Genelge	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/ced/editordosya/2015-7%20suc%20duyurusu%20genelgesi.pdf	\N	https://webdosya.csb.gov.tr/db/ced/editordosya/2015-7%20suc%20duyurusu%20genelgesi.pdf	2026-03-03 11:07:19.926	2026-03-03 11:07:19.926
cmmai6xo7006dj088olbpznoa	02.07.2021 tarih ve 2021/14 Sayılı Genelge / Konu: Marmara Bölgesinde Bulunan Atık Su Artıma Tesislerinin Gerçek Zamanlı İzlenmesi	GENELGELER	\N	\N	03.03.2026	http://webdosya.csb.gov.tr/db/ced/icerikler/genelge-02072021_2021-14-20210702160946.pdf	\N	http://webdosya.csb.gov.tr/db/ced/icerikler/genelge-02072021_2021-14-20210702160946.pdf	2026-03-03 11:07:19.927	2026-03-03 11:07:19.927
cmmai6xo8006ej088km23a3u0	24.04.2014 tarih ve 2014/12 Sayılı Genelge / Konu: Sürekli Emisyon Ölçümlerinin Çevrimiçi (Online) İzlenmesi	GENELGELER	\N	\N	03.03.2026	http://webdosya.csb.gov.tr/db/ced/editordosya/SurekliEmisyonOlcumGenelge%202014-12(1).pdf	\N	http://webdosya.csb.gov.tr/db/ced/editordosya/SurekliEmisyonOlcumGenelge%202014-12(1).pdf	2026-03-03 11:07:19.928	2026-03-03 11:07:19.928
cmmai6xo9006fj088wdv8edne	04.12.2013 tarih ve 2013/40 Sayılı Genelge / Konu: Katı Yakıt Numune Alma ve Analiz Genelgesi	GENELGELER	\N	\N	03.03.2026	http://webdosya.csb.gov.tr/db/ced/icerikler/2013-40-sayili-kati-yakit-numune-alma-ve-anal-z-genelges--20181203124403.pdf	\N	http://webdosya.csb.gov.tr/db/ced/icerikler/2013-40-sayili-kati-yakit-numune-alma-ve-anal-z-genelges--20181203124403.pdf	2026-03-03 11:07:19.93	2026-03-03 11:07:19.93
cmmai6xoa006gj088x1kwzxzc	11.08.2011 tarih ve 2011/3 Sayılı Genelge / Konu:Genelge ve Talimatlara İlişkin Usul ve Esaslar	GENELGELER	\N	\N	03.03.2026	http://webdosya.csb.gov.tr/dosyalar/images/file/2011-3_Genelge.PNG	\N	http://webdosya.csb.gov.tr/dosyalar/images/file/2011-3_Genelge.PNG	2026-03-03 11:07:19.931	2026-03-03 11:07:19.931
cmmai6xoc006hj088aioj1hm2	19.01.2026 tarih ve 2026/2 Sayılı Genelge  / Konu: Türkiye Çevre Etiket Sisteminin Yaygınlaştırılması	GENELGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/v2/ced/2026/01/t-rkiye-evre-etiket-sisteminin-yayg-nla-t-r-lmas-genelgesi-20260119165255.pdf	\N	https://webdosya.csb.gov.tr/v2/ced/2026/01/t-rkiye-evre-etiket-sisteminin-yayg-nla-t-r-lmas-genelgesi-20260119165255.pdf	2026-03-03 11:07:19.932	2026-03-03 11:07:19.932
cmmai6xod006ij0887179krg0	ÇED Yönetmeliği'nin Uygulanmasına İlişkin Usul ve Esaslarda Değişiklik Yapılmasına Dair Usul ve Esaslar - 12.04.2023	USUL VE ESASLAR	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/ced/icerikler/-lave.usul.esaslar12042023_6206377-20230419140354.pdf	\N	https://webdosya.csb.gov.tr/db/ced/icerikler/-lave.usul.esaslar12042023_6206377-20230419140354.pdf	2026-03-03 11:07:19.933	2026-03-03 11:07:19.933
cmmai6xoe006jj088jep1h65p	ÇED Yönetmeliği'nin Uygulanmasına İlişkin Usul ve Esaslar - 09.09.2022	USUL VE ESASLAR	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/ced/icerikler/ced-yonetmel-g-n-n-uygulanmasina-il-sk-n-usul-ve-esaslar-20220914155431.pdf	\N	https://webdosya.csb.gov.tr/db/ced/icerikler/ced-yonetmel-g-n-n-uygulanmasina-il-sk-n-usul-ve-esaslar-20220914155431.pdf	2026-03-03 11:07:19.935	2026-03-03 11:07:19.935
cmmai6xof006kj088oghd45xi	Çevre İzin ve Lisans Yönetmeliği Uygulamalarına İlişkin Usul ve Esaslar - 02.02.2022	USUL VE ESASLAR	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/ced/icerikler/02-subat-2022-tar-hl--cevre-iz-n-ve-l-sans-yonetmel-g--uygulamalarina-il-sk-n-usul-ve-esaslar-yazisi-20220202141149.pdf	\N	https://webdosya.csb.gov.tr/db/ced/icerikler/02-subat-2022-tar-hl--cevre-iz-n-ve-l-sans-yonetmel-g--uygulamalarina-il-sk-n-usul-ve-esaslar-yazisi-20220202141149.pdf	2026-03-03 11:07:19.936	2026-03-03 11:07:19.936
cmmai6xoh006lj0880syndj9i	Çevre İzin ve Lisans Yönetmeliği Uygulamalarına İlişkin Usul ve Esaslar - 04.11.2021	USUL VE ESASLAR	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/ced/icerikler/cevre-iz-n-ve-l-sans-yonetmel-g--uygulamalarina-il-sk-n-usul-ve-esaslar-20211108142434.pdf	\N	https://webdosya.csb.gov.tr/db/ced/icerikler/cevre-iz-n-ve-l-sans-yonetmel-g--uygulamalarina-il-sk-n-usul-ve-esaslar-20211108142434.pdf	2026-03-03 11:07:19.937	2026-03-03 11:07:19.937
cmmai6xoi006mj088kj5x6n1h	Madencilik Faaliyetleri ile ilgili ÇED Sürecinde ve Görüş Taleplerinde Uygulanacak Usul ve Esaslar	USUL VE ESASLAR	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/ced/icerikler/madenc-l-k-faal-yetler-n-n-ced-surec-nde-ve-gorus-talepler-nde-uygulanacak-usul-ve-esaslar-20210903172116.pdf	\N	https://webdosya.csb.gov.tr/db/ced/icerikler/madenc-l-k-faal-yetler-n-n-ced-surec-nde-ve-gorus-talepler-nde-uygulanacak-usul-ve-esaslar-20210903172116.pdf	2026-03-03 11:07:19.938	2026-03-03 11:07:19.938
cmmai6xoj006nj088syqdeng4	Araç Takip Servis Sağlayıcılarının Niteliklerinin Belirlenmesi İle İlgili Usul Ve Esaslar	USUL VE ESASLAR	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/ced/icerikler/usul-ve-esaslar-20200728162122.pdf	\N	https://webdosya.csb.gov.tr/db/ced/icerikler/usul-ve-esaslar-20200728162122.pdf	2026-03-03 11:07:19.94	2026-03-03 11:07:19.94
cmmai6xok006oj0881vk14l8t	Depozito Saha Yönetim Sistemi Operatörlerinin Belirlenmesine İlişkin Usul ve Esaslar	USUL VE ESASLAR	\N	\N	03.03.2026	https://www.tuca.gov.tr/uploaded_files/2025/11/DEPOZI%CC%87TO-SAHA-YO%CC%88NETI%CC%87M-SI%CC%87STEMI%CC%87-OPERATO%CC%88RLERI%CC%87NI%CC%87N-BELI%CC%87RLENMESI%CC%87NE-I%CC%87LI%CC%87S%CC%A7KI%CC%87N-USUL-VE-ESASLAR.pdf	\N	https://www.tuca.gov.tr/uploaded_files/2025/11/DEPOZI%CC%87TO-SAHA-YO%CC%88NETI%CC%87M-SI%CC%87STEMI%CC%87-OPERATO%CC%88RLERI%CC%87NI%CC%87N-BELI%CC%87RLENMESI%CC%87NE-I%CC%87LI%CC%87S%CC%A7KI%CC%87N-USUL-VE-ESASLAR.pdf	2026-03-03 11:07:19.941	2026-03-03 11:07:19.941
cmmai6xom006pj088jnmexrhk	Çevre Ölçüm ve Analiz Laboratuvarları Yeterlik Yönetmeliği Planlı ve Ani Denetim Ceza Puanı Uygulama Yönerges	YÖNERGELER	\N	\N	03.03.2026	https://webdosya.csb.gov.tr/db/lab/duyurular/planli-ve-ani-denetim-ceza-puani-uygulama-yonergesi-1-20250717103611.pdf	\N	https://webdosya.csb.gov.tr/db/lab/duyurular/planli-ve-ani-denetim-ceza-puani-uygulama-yonergesi-1-20250717103611.pdf	2026-03-03 11:07:19.942	2026-03-03 11:07:19.942
\.


--
-- Data for Name: LegislationCategory; Type: TABLE DATA; Schema: public\; Owner: blt_user
--

COPY "public\"."LegislationCategory" (id, name, description, "createdAt", "updatedAt") FROM stdin;
cmmai6xfz0000j088vrx24xsa	KANUNLAR	KANUNLAR ile ilgili güncel mevzuat.	2026-03-03 11:07:19.632	2026-03-03 11:07:19.632
cmmai6xg40001j0887v84rzgl	YÖNETMELİKLER	YÖNETMELİKLER ile ilgili güncel mevzuat.	2026-03-03 11:07:19.637	2026-03-03 11:07:19.637
cmmai6xg60002j08848pumpgz	TEBLİĞLER	TEBLİĞLER ile ilgili güncel mevzuat.	2026-03-03 11:07:19.638	2026-03-03 11:07:19.638
cmmai6xg70003j088oljsrag9	GENELGELER	GENELGELER ile ilgili güncel mevzuat.	2026-03-03 11:07:19.64	2026-03-03 11:07:19.64
cmmai6xg80004j088jqkm1tgq	USUL VE ESASLAR	USUL VE ESASLAR ile ilgili güncel mevzuat.	2026-03-03 11:07:19.641	2026-03-03 11:07:19.641
cmmai6xga0005j08805sczk85	YÖNERGELER	YÖNERGELER ile ilgili güncel mevzuat.	2026-03-03 11:07:19.642	2026-03-03 11:07:19.642
\.


--
-- Data for Name: MembershipRequest; Type: TABLE DATA; Schema: public\; Owner: blt_user
--

COPY "public\"."MembershipRequest" (id, "companyName", "contactName", email, phone, message, status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Proposal; Type: TABLE DATA; Schema: public\; Owner: blt_user
--

COPY "public\"."Proposal" (id, "leadId", title, amount, currency, "taxRate", status, date, "validUntil", terms, notes, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ProposalItem; Type: TABLE DATA; Schema: public\; Owner: blt_user
--

COPY "public\"."ProposalItem" (id, "proposalId", description, quantity, "unitPrice", total) FROM stdin;
\.


--
-- Data for Name: QuizQuestion; Type: TABLE DATA; Schema: public\; Owner: blt_user
--

COPY "public\"."QuizQuestion" (id, "videoId", "timestamp", "questionText", options, "correctOptionIdx", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: SupportTicket; Type: TABLE DATA; Schema: public\; Owner: blt_user
--

COPY "public\"."SupportTicket" (id, "userId", "companyId", subject, message, status, priority, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public\; Owner: blt_user
--

COPY "public\"."User" (id, name, email, password, "companyName", "companyId", roles, "allowedModules", "createdAt", "updatedAt", "isActive", "lastSeen", "attentionLevel", "attentionTestDate") FROM stdin;
cmmah8bgg00002go8r80spuoo	Super Admin	admin@beyondlimits.com	$2b$10$5SevLiUAx/gphW6Qnl2YHuoS/1ZO0em0ukzc3AGFQpdMkY/dIYtoS	\N	\N	SUPER_ADMIN	ALL	2026-03-03 10:40:24.833	2026-03-03 16:27:30.804	t	2026-03-03 16:27:30.774	MEDIUM	2026-03-03 11:13:47.203
\.


--
-- Data for Name: Video; Type: TABLE DATA; Schema: public\; Owner: blt_user
--

COPY "public\"."Video" (id, title, description, url, thumbnail, category, "attentionLevel", "courseId", "order", "createdAt", "updatedAt") FROM stdin;
cmmakfta70004kxbkkt8cnpo8	Bölüm 2	\N	/uploads/videos/42637f0d72bd4bb6-1772539813064.mp4	\N	\N	\N	cmmaka2to0000kxbkqi4s788u	0	2026-03-03 12:10:13.363	2026-03-03 12:10:13.363
cmmakcrml0002kxbkhtc8nm2z	Bölüm 1:	\N	/uploads/videos/b897df32059a892d-1772539670961.mp4	\N	\N	\N	cmmaka2to0000kxbkqi4s788u	0	2026-03-03 12:07:51.259	2026-03-03 12:11:02.821
cmmakhxzh0006kxbk93clbrda	Bölüm 3:	\N	/uploads/videos/f905995abe3c2d6a-1772539912449.mp4	\N	\N	\N	cmmaka2to0000kxbkqi4s788u	0	2026-03-03 12:11:52.779	2026-03-03 12:11:52.779
cmmakk2r00008kxbkfe8qg2el	Bölüm 4	\N	/uploads/videos/0dfa646cb4e8884e-1772540012034.mp4	\N	\N	\N	cmmaka2to0000kxbkqi4s788u	0	2026-03-03 12:13:32.267	2026-03-03 12:13:32.267
\.


--
-- Data for Name: WaterGreyEntry; Type: TABLE DATA; Schema: public\; Owner: blt_user
--

COPY "public\"."WaterGreyEntry" (id, "reportId", date, param, "Q", "Ceff", "Cnat", "Cmax", wfgrey, evidence, note) FROM stdin;
\.


--
-- Data for Name: WaterProcess; Type: TABLE DATA; Schema: public\; Owner: blt_user
--

COPY "public\"."WaterProcess" (id, "reportId", date, name, type, input, output, product, "productUnit", note, "businessProcessId") FROM stdin;
\.


--
-- Data for Name: WaterReport; Type: TABLE DATA; Schema: public\; Owner: blt_user
--

COPY "public\"."WaterReport" (id, "companyId", year, period, "orgName", basin, methodology, boundary, "blueDirect", "greenDirect", "blueMethod", "greenMethod", "totalWater", "blueWater", "greenWater", "greyWater", status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: WaterSource; Type: TABLE DATA; Schema: public\; Owner: blt_user
--

COPY "public\"."WaterSource" (id, "reportId", type, name, withdraw, return, note) FROM stdin;
\.


--
-- Name: Activity Activity_pkey; Type: CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."Activity"
    ADD CONSTRAINT "Activity_pkey" PRIMARY KEY (id);


--
-- Name: BusinessProcess BusinessProcess_pkey; Type: CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."BusinessProcess"
    ADD CONSTRAINT "BusinessProcess_pkey" PRIMARY KEY (id);


--
-- Name: CarbonEntry CarbonEntry_pkey; Type: CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."CarbonEntry"
    ADD CONSTRAINT "CarbonEntry_pkey" PRIMARY KEY (id);


--
-- Name: Company Company_pkey; Type: CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."Company"
    ADD CONSTRAINT "Company_pkey" PRIMARY KEY (id);


--
-- Name: Course Course_pkey; Type: CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."Course"
    ADD CONSTRAINT "Course_pkey" PRIMARY KEY (id);


--
-- Name: EmissionFactor EmissionFactor_pkey; Type: CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."EmissionFactor"
    ADD CONSTRAINT "EmissionFactor_pkey" PRIMARY KEY (id);


--
-- Name: FinancialRecord FinancialRecord_pkey; Type: CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."FinancialRecord"
    ADD CONSTRAINT "FinancialRecord_pkey" PRIMARY KEY (id);


--
-- Name: Lead Lead_pkey; Type: CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."Lead"
    ADD CONSTRAINT "Lead_pkey" PRIMARY KEY (id);


--
-- Name: LegislationCategory LegislationCategory_pkey; Type: CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."LegislationCategory"
    ADD CONSTRAINT "LegislationCategory_pkey" PRIMARY KEY (id);


--
-- Name: Legislation Legislation_pkey; Type: CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."Legislation"
    ADD CONSTRAINT "Legislation_pkey" PRIMARY KEY (id);


--
-- Name: MembershipRequest MembershipRequest_pkey; Type: CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."MembershipRequest"
    ADD CONSTRAINT "MembershipRequest_pkey" PRIMARY KEY (id);


--
-- Name: ProposalItem ProposalItem_pkey; Type: CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."ProposalItem"
    ADD CONSTRAINT "ProposalItem_pkey" PRIMARY KEY (id);


--
-- Name: Proposal Proposal_pkey; Type: CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."Proposal"
    ADD CONSTRAINT "Proposal_pkey" PRIMARY KEY (id);


--
-- Name: QuizQuestion QuizQuestion_pkey; Type: CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."QuizQuestion"
    ADD CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY (id);


--
-- Name: SupportTicket SupportTicket_pkey; Type: CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."SupportTicket"
    ADD CONSTRAINT "SupportTicket_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Video Video_pkey; Type: CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."Video"
    ADD CONSTRAINT "Video_pkey" PRIMARY KEY (id);


--
-- Name: WaterGreyEntry WaterGreyEntry_pkey; Type: CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."WaterGreyEntry"
    ADD CONSTRAINT "WaterGreyEntry_pkey" PRIMARY KEY (id);


--
-- Name: WaterProcess WaterProcess_pkey; Type: CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."WaterProcess"
    ADD CONSTRAINT "WaterProcess_pkey" PRIMARY KEY (id);


--
-- Name: WaterReport WaterReport_pkey; Type: CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."WaterReport"
    ADD CONSTRAINT "WaterReport_pkey" PRIMARY KEY (id);


--
-- Name: WaterSource WaterSource_pkey; Type: CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."WaterSource"
    ADD CONSTRAINT "WaterSource_pkey" PRIMARY KEY (id);


--
-- Name: LegislationCategory_name_key; Type: INDEX; Schema: public\; Owner: blt_user
--

CREATE UNIQUE INDEX "LegislationCategory_name_key" ON "public\"."LegislationCategory" USING btree (name);


--
-- Name: User_email_key; Type: INDEX; Schema: public\; Owner: blt_user
--

CREATE UNIQUE INDEX "User_email_key" ON "public\"."User" USING btree (email);


--
-- Name: Activity Activity_leadId_fkey; Type: FK CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."Activity"
    ADD CONSTRAINT "Activity_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public\"."Lead"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BusinessProcess BusinessProcess_companyId_fkey; Type: FK CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."BusinessProcess"
    ADD CONSTRAINT "BusinessProcess_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public\"."Company"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CarbonEntry CarbonEntry_businessProcessId_fkey; Type: FK CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."CarbonEntry"
    ADD CONSTRAINT "CarbonEntry_businessProcessId_fkey" FOREIGN KEY ("businessProcessId") REFERENCES "public\"."BusinessProcess"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: CarbonEntry CarbonEntry_companyId_fkey; Type: FK CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."CarbonEntry"
    ADD CONSTRAINT "CarbonEntry_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public\"."Company"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: EmissionFactor EmissionFactor_companyId_fkey; Type: FK CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."EmissionFactor"
    ADD CONSTRAINT "EmissionFactor_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public\"."Company"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ProposalItem ProposalItem_proposalId_fkey; Type: FK CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."ProposalItem"
    ADD CONSTRAINT "ProposalItem_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "public\"."Proposal"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Proposal Proposal_leadId_fkey; Type: FK CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."Proposal"
    ADD CONSTRAINT "Proposal_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public\"."Lead"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: QuizQuestion QuizQuestion_videoId_fkey; Type: FK CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."QuizQuestion"
    ADD CONSTRAINT "QuizQuestion_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "public\"."Video"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SupportTicket SupportTicket_companyId_fkey; Type: FK CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."SupportTicket"
    ADD CONSTRAINT "SupportTicket_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public\"."Company"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SupportTicket SupportTicket_userId_fkey; Type: FK CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."SupportTicket"
    ADD CONSTRAINT "SupportTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public\"."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: User User_companyId_fkey; Type: FK CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."User"
    ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public\"."Company"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Video Video_courseId_fkey; Type: FK CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."Video"
    ADD CONSTRAINT "Video_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public\"."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WaterGreyEntry WaterGreyEntry_reportId_fkey; Type: FK CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."WaterGreyEntry"
    ADD CONSTRAINT "WaterGreyEntry_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "public\"."WaterReport"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WaterProcess WaterProcess_businessProcessId_fkey; Type: FK CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."WaterProcess"
    ADD CONSTRAINT "WaterProcess_businessProcessId_fkey" FOREIGN KEY ("businessProcessId") REFERENCES "public\"."BusinessProcess"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: WaterProcess WaterProcess_reportId_fkey; Type: FK CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."WaterProcess"
    ADD CONSTRAINT "WaterProcess_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "public\"."WaterReport"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WaterReport WaterReport_companyId_fkey; Type: FK CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."WaterReport"
    ADD CONSTRAINT "WaterReport_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public\"."Company"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WaterSource WaterSource_reportId_fkey; Type: FK CONSTRAINT; Schema: public\; Owner: blt_user
--

ALTER TABLE ONLY "public\"."WaterSource"
    ADD CONSTRAINT "WaterSource_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "public\"."WaterReport"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict zJJUpV9qO7BvQQycFZHB5GSCM7k18cU8nOLKNmxNtBvBpggjOZF5awaxIVKvQyq

