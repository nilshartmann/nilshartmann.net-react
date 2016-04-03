Postgresql Database Setup
=========================

# PG **Admin user** used to create schemas and roles (e.g. in tests)

We have exactly one **Admin user** configured. This user needs to have the rights to create other databases and
roles. The user will be user to create temp databases during the tests

* Username: `simpleblogadmin`
* Password: `simpleblogadmin`

SQL:

```sql
-- Role: simpleblogadmin

-- DROP ROLE simpleblogadmin;

CREATE ROLE simpleblogadmin LOGIN
  ENCRYPTED PASSWORD 'md5ddf942189fe2ac78a3dc93a46a97e437'
  NOSUPERUSER INHERIT CREATEDB CREATEROLE NOREPLICATION;
```

# Create the simpleblog database
```sql
-- Database: simpleblog

-- DROP DATABASE simpleblog;

CREATE DATABASE simpleblog
  WITH OWNER = simpleblogadmin
       ENCODING = 'UTF8'
       TABLESPACE = pg_default
       LC_COLLATE = 'C'
       LC_CTYPE = 'C'
       CONNECTION LIMIT = -1;
```
