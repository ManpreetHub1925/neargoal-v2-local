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
    service_name = db.Column(db.String(255))
    short_description = db.Column(db.Text)
    icon = db.Column(db.String(120))
    banner_image = db.Column(db.String(255))
    display_order = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    is_featured = db.Column(db.Boolean, default=False)
    service_group = db.Column(db.String(255))
    industry_subcategories = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime)


class Report(db.Model):
    __tablename__ = "reports"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(191))
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
    industry_slug = db.Column(db.String(191))
    excerpt = db.Column(db.Text)
    content = db.Column(db.Text)
    table_of_contents = db.Column(db.Text)
    page_count = db.Column(db.Integer)
    delivery_format = db.Column(db.String(100))
    banner_image = db.Column(db.String(255))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime)
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
    category_id = db.Column(db.Integer)
    short_description = db.Column(db.Text)
    featured_image = db.Column(db.String(255))
    seo_title = db.Column(db.String(255))
    seo_description = db.Column(db.Text)
    seo_keywords = db.Column(db.Text)
    author_name = db.Column(db.String(255))
    status = db.Column(db.String(20), default="draft")
    published_at = db.Column(db.DateTime)
    is_popular = db.Column(db.Boolean, default=False)
    show_homepage = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime)


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
    display_order = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime)


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
    status = db.Column(db.String(20), default="subscribed")
    subscribed_at = db.Column(db.DateTime, default=datetime.utcnow)


class TeamMember(db.Model):
    __tablename__ = "team_members"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(191), nullable=False, unique=True)
    designation = db.Column(db.String(255))
    department = db.Column(db.String(255))
    profile_image = db.Column(db.String(255))
    bio = db.Column(db.Text)
    email = db.Column(db.String(191))
    linkedin_url = db.Column(db.String(255))
    facebook_url = db.Column(db.String(255))
    instagram_url = db.Column(db.String(255))
    twitter_url = db.Column(db.String(255))
    github_url = db.Column(db.String(255))
    other_url = db.Column(db.String(255))
    display_order = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime)


class LandingPage(db.Model):
    __tablename__ = "landing_pages"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(255), nullable=False, unique=True)
    hero_title = db.Column(db.String(255))
    hero_subtitle = db.Column(db.Text)
    content = db.Column(db.Text)
    cta_text = db.Column(db.String(120))
    cta_url = db.Column(db.String(255))
    banner_svg = db.Column(db.String(255))
    seo_title = db.Column(db.String(255))
    seo_description = db.Column(db.Text)
    seo_keywords = db.Column(db.Text)
    show_in_menu = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime)


class Job(db.Model):
    __tablename__ = "jobs"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(191), unique=True)
    department = db.Column(db.String(255))
    location = db.Column(db.String(255))
    employment_type = db.Column(db.String(50))
    description = db.Column(db.Text)
    responsibilities = db.Column(db.Text)
    requirements = db.Column(db.Text)
    status = db.Column(db.String(20), default="open")
    posted_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime)


class JobApplication(db.Model):
    __tablename__ = "job_applications"

    id = db.Column(db.Integer, primary_key=True)
    career_id = db.Column(db.Integer, db.ForeignKey("careers.id"), nullable=True)
    job_id = db.Column(db.Integer, db.ForeignKey("jobs.id"), nullable=True)
    full_name = db.Column(db.String(255), nullable=True)
    applicant_name = db.Column(db.String(255))
    email = db.Column(db.String(255), nullable=True)
    applicant_email = db.Column(db.String(191))
    phone = db.Column(db.String(64))
    cover_letter = db.Column(db.Text)
    resume_filename = db.Column(db.String(255))
    resume_path = db.Column(db.String(255))
    status = db.Column(db.String(32), nullable=False, default="New")
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    applied_at = db.Column(db.DateTime, default=datetime.utcnow)

    career = db.relationship("Career", back_populates="applications")


class ReportOrder(db.Model):
    __tablename__ = "report_orders"

    id = db.Column(db.Integer, primary_key=True)
    order_ref = db.Column(db.String(50), nullable=False, unique=True)
    user_id = db.Column(db.Integer, nullable=False)
    customer_name = db.Column(db.String(255))
    customer_email = db.Column(db.String(191))
    customer_phone = db.Column(db.String(50))
    customer_company = db.Column(db.String(255))
    customer_designation = db.Column(db.String(255))
    billing_address = db.Column(db.Text)
    gst_number = db.Column(db.String(80))
    report_id = db.Column(db.String(100))
    report_slug = db.Column(db.String(191), nullable=False)
    report_title = db.Column(db.String(255), nullable=False)
    amount = db.Column(db.Numeric(10, 2), default=0.00)
    base_amount = db.Column(db.Numeric(10, 2), default=0.00)
    gateway_charge_percent = db.Column(db.Numeric(6, 2), default=0.00)
    gateway_charge_amount = db.Column(db.Numeric(10, 2), default=0.00)
    currency = db.Column(db.String(8), default="INR")
    gateway = db.Column(db.String(30))
    gateway_order_id = db.Column(db.String(120))
    gateway_payment_id = db.Column(db.String(120))
    gateway_signature = db.Column(db.String(255))
    payment_status = db.Column(db.String(30), default="pending")
    order_status = db.Column(db.String(30), default="initiated")
    access_status = db.Column(db.String(30), default="locked")
    delivery_mode = db.Column(db.String(30), default="portal")
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
