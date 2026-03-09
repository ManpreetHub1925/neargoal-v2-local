from __future__ import annotations

from datetime import datetime

from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


class Industry(db.Model):
    __tablename__ = "industries"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    slug = db.Column(db.String(255), nullable=False, unique=True)
    description = db.Column(db.Text, nullable=False)
    details = db.Column(db.Text, nullable=False)
    image = db.Column(db.String(512), nullable=False)
    sort_order = db.Column(db.Integer, nullable=False, default=0)

    reports = db.relationship("Report", back_populates="industry", lazy=True)


class Service(db.Model):
    __tablename__ = "services"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    slug = db.Column(db.String(255), nullable=False, unique=True)
    description = db.Column(db.Text, nullable=False)
    details = db.Column(db.Text, nullable=False)
    image = db.Column(db.String(512), nullable=False)
    benefits = db.Column(db.JSON, nullable=False)
    sort_order = db.Column(db.Integer, nullable=False, default=0)


class Report(db.Model):
    __tablename__ = "reports"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    code = db.Column(db.String(64), nullable=False, unique=True)
    geography = db.Column(db.String(128), nullable=False)
    published_label = db.Column(db.String(64), nullable=False)
    summary = db.Column(db.Text, nullable=False)
    price = db.Column(db.Integer, nullable=False)
    pages = db.Column(db.Integer, nullable=False)
    coverage = db.Column(db.String(128), nullable=False)
    description = db.Column(db.Text, nullable=False)
    toc = db.Column(db.JSON, nullable=False)
    lof = db.Column(db.JSON, nullable=False)
    lot = db.Column(db.JSON, nullable=False)
    companies = db.Column(db.JSON, nullable=False)
    status = db.Column(db.String(32), nullable=False, default="Published")
    industry_id = db.Column(db.Integer, db.ForeignKey("industries.id"), nullable=False)

    industry = db.relationship("Industry", back_populates="reports")


class Blog(db.Model):
    __tablename__ = "blogs"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(255), nullable=False, unique=True)
    author = db.Column(db.String(128), nullable=False)
    date_label = db.Column(db.String(64), nullable=False)
    category = db.Column(db.String(128), nullable=False)
    summary = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    image = db.Column(db.String(512), nullable=False)
    tags = db.Column(db.JSON, nullable=False)


class CaseStudy(db.Model):
    __tablename__ = "case_studies"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(255), nullable=False, unique=True)
    client = db.Column(db.String(255), nullable=False)
    sector = db.Column(db.String(255), nullable=False)
    challenge = db.Column(db.Text, nullable=False)
    solution = db.Column(db.Text, nullable=False)
    impact = db.Column(db.Text, nullable=False)
    image = db.Column(db.String(512), nullable=False)
    stats = db.Column(db.JSON, nullable=False)


class MarketUpdate(db.Model):
    __tablename__ = "market_updates"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(255), nullable=False, unique=True)
    date_label = db.Column(db.String(64), nullable=False)
    category = db.Column(db.String(128), nullable=False)
    summary = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    tags = db.Column(db.JSON, nullable=False)


class Career(db.Model):
    __tablename__ = "careers"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(255), nullable=False, unique=True)
    location = db.Column(db.String(255), nullable=False)
    job_type = db.Column(db.String(128), nullable=False)
    department = db.Column(db.String(128), nullable=False)
    description = db.Column(db.Text, nullable=False)
    responsibilities = db.Column(db.JSON, nullable=False)
    requirements = db.Column(db.JSON, nullable=False)
    sort_order = db.Column(db.Integer, nullable=False, default=0)

    applications = db.relationship("JobApplication", back_populates="career", lazy=True)


class FAQ(db.Model):
    __tablename__ = "faqs"

    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.Text, nullable=False)
    answer = db.Column(db.Text, nullable=False)
    sort_order = db.Column(db.Integer, nullable=False, default=0)


class Query(db.Model):
    __tablename__ = "queries"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    company = db.Column(db.String(255))
    phone = db.Column(db.String(64))
    designation = db.Column(db.String(255))
    message = db.Column(db.Text)
    requirement = db.Column(db.Text)
    inquiry_type = db.Column(db.String(128), nullable=False)
    target_type = db.Column(db.String(128))
    target_slug = db.Column(db.String(255))
    status = db.Column(db.String(32), nullable=False, default="New")
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)


class NewsletterSubscriber(db.Model):
    __tablename__ = "newsletter_subscribers"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)


class JobApplication(db.Model):
    __tablename__ = "job_applications"

    id = db.Column(db.Integer, primary_key=True)
    career_id = db.Column(db.Integer, db.ForeignKey("careers.id"), nullable=False)
    full_name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(64))
    cover_letter = db.Column(db.Text)
    resume_filename = db.Column(db.String(255))
    status = db.Column(db.String(32), nullable=False, default="New")
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    career = db.relationship("Career", back_populates="applications")
