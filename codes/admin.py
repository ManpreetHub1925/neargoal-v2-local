from flask import Flask, render_template, redirect, session, url_for, flash, Blueprint, request, jsonify, abort
from functools import wraps
from codes.db.db_creds import create_connections
from sqlalchemy import text, inspect
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename
import os
import json
from codes.google_analytics_data import get_impressions_clicks
from codes.mail_sender import send_email
import threading
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from threading import Thread
from datetime import datetime, timedelta
import re

from admin_bridge import (
    benefits_json,
    html_list_json,
    slugify_text,
    split_text_items,
    strip_html,
    summary_from_html,
    tags_json,
)


db = create_connections()

admin = Blueprint('admin', __name__, url_prefix='/admin')


def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if not session.get('admin_logged_in'):
            return redirect(url_for('admin.login'))
        return f(*args, **kwargs)
    return decorated


def send_email(to_email, subject, body, html=False):
    host = os.getenv('MAIL_HOST')
    port = int(os.getenv('MAIL_PORT'))
    username = os.getenv('MAIL_USERNAME')
    password = os.getenv('MAIL_PASSWORD')
    encryption = (os.getenv('MAIL_ENCRYPTION') or '').lower()
    from_email = os.getenv('MAIL_FROM_EMAIL')

    if not all([host, port, username, password, from_email]):
        raise RuntimeError("Missing SMTP configuration")

    msg = MIMEMultipart('alternative')
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject

    mime_type = 'html' if html else 'plain'
    msg.attach(MIMEText(body, mime_type, 'utf-8'))

    try:
        if encryption == 'ssl' or port == 465:
            server = smtplib.SMTP_SSL(host, port, timeout=10)
        else:
            server = smtplib.SMTP(host, port, timeout=10)
            if encryption == 'tls':
                server.starttls()

        server.login(username, password)
        server.sendmail(from_email, [to_email], msg.as_string())
        server.quit()

        return True, "Email sent successfully"

    except Exception as e:
        return False, str(e)


def ensure_landing_pages_table():
    with db.engine.begin() as conn:
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS landing_pages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                slug VARCHAR(255) NOT NULL UNIQUE,
                hero_title VARCHAR(255),
                hero_subtitle TEXT,
                content LONGTEXT,
                cta_text VARCHAR(120),
                cta_url VARCHAR(255),
                banner_svg VARCHAR(255),
                seo_title VARCHAR(255),
                seo_description TEXT,
                seo_keywords TEXT,
                show_in_menu TINYINT(1) DEFAULT 0,
                is_active TINYINT(1) DEFAULT 1,
                created_at DATETIME,
                updated_at DATETIME
            )
        """))


def ensure_newsletter_schema():
    try:
        inspector = inspect(db.engine)
        with db.engine.begin() as conn:
            if not inspector.has_table("newsletter_sends"):
                conn.execute(text("""
                    CREATE TABLE IF NOT EXISTS newsletter_sends (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        subject VARCHAR(255),
                        content LONGTEXT,
                        content_type VARCHAR(20) DEFAULT 'html',
                        sent_count INT DEFAULT 0,
                        failed_count INT DEFAULT 0,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                """))
            else:
                columns = {col["name"] for col in inspector.get_columns("newsletter_sends")}
                if "content" not in columns:
                    conn.execute(text("ALTER TABLE newsletter_sends ADD COLUMN content LONGTEXT NULL"))
                if "content_type" not in columns:
                    conn.execute(text("ALTER TABLE newsletter_sends ADD COLUMN content_type VARCHAR(20) DEFAULT 'html'"))
                if "failed_count" not in columns:
                    conn.execute(text("ALTER TABLE newsletter_sends ADD COLUMN failed_count INT DEFAULT 0"))
    except Exception:
        pass


def ensure_report_requests_table():
    try:
        with db.engine.begin() as conn:
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS report_requests (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    full_name VARCHAR(255) NOT NULL,
                    email VARCHAR(191) NOT NULL,
                    country_code VARCHAR(10),
                    phone VARCHAR(50),
                    company VARCHAR(255),
                    designation VARCHAR(255),
                    country VARCHAR(255),
                    industry_slug VARCHAR(191),
                    report_slug VARCHAR(191),
                    advisory_name VARCHAR(150),
                    source_page VARCHAR(255),
                    report_id VARCHAR(250),
                    message TEXT,
                    status VARCHAR(30) DEFAULT 'new',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP
                )
            """))
    except Exception:
        pass


def ensure_sales_tables():
    try:
        inspector = inspect(db.engine)
        with db.engine.begin() as conn:
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS inquiry_requests (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    inquiry_type VARCHAR(80) NOT NULL,
                    full_name VARCHAR(255) NOT NULL,
                    email VARCHAR(191) NOT NULL,
                    country_code VARCHAR(10),
                    phone VARCHAR(50),
                    company VARCHAR(255),
                    designation VARCHAR(255),
                    country VARCHAR(255),
                    industry_slug VARCHAR(191),
                    report_slug VARCHAR(191),
                    source_page VARCHAR(255),
                    message TEXT,
                    status VARCHAR(30) DEFAULT 'new',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP
                )
            """))
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS report_orders (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    order_ref VARCHAR(50) NOT NULL UNIQUE,
                    user_id INT NOT NULL,
                    customer_name VARCHAR(255),
                    customer_email VARCHAR(191),
                    customer_phone VARCHAR(50),
                    customer_company VARCHAR(255),
                    customer_designation VARCHAR(255),
                    billing_address TEXT,
                    gst_number VARCHAR(80),
                    report_slug VARCHAR(191) NOT NULL,
                    report_title VARCHAR(255) NOT NULL,
                    amount DECIMAL(10,2) DEFAULT 0.00,
                    base_amount DECIMAL(10,2) DEFAULT 0.00,
                    gateway_charge_percent DECIMAL(6,2) DEFAULT 0.00,
                    gateway_charge_amount DECIMAL(10,2) DEFAULT 0.00,
                    currency VARCHAR(8) DEFAULT 'INR',
                    gateway VARCHAR(30),
                    gateway_order_id VARCHAR(120),
                    gateway_payment_id VARCHAR(120),
                    gateway_signature VARCHAR(255),
                    payment_status VARCHAR(30) DEFAULT 'pending',
                    order_status VARCHAR(30) DEFAULT 'initiated',
                    access_status VARCHAR(30) DEFAULT 'locked',
                    delivery_mode VARCHAR(30) DEFAULT 'portal',
                    notes TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
                    INDEX idx_report_orders_user (user_id),
                    INDEX idx_report_orders_slug (report_slug)
                )
            """))
            if inspector.has_table("report_orders"):
                order_cols = {col["name"] for col in inspector.get_columns("report_orders")}
                if "customer_name" not in order_cols:
                    conn.execute(text("ALTER TABLE report_orders ADD COLUMN customer_name VARCHAR(255) NULL"))
                if "customer_email" not in order_cols:
                    conn.execute(text("ALTER TABLE report_orders ADD COLUMN customer_email VARCHAR(191) NULL"))
                if "customer_phone" not in order_cols:
                    conn.execute(text("ALTER TABLE report_orders ADD COLUMN customer_phone VARCHAR(50) NULL"))
                if "customer_company" not in order_cols:
                    conn.execute(text("ALTER TABLE report_orders ADD COLUMN customer_company VARCHAR(255) NULL"))
                if "customer_designation" not in order_cols:
                    conn.execute(text("ALTER TABLE report_orders ADD COLUMN customer_designation VARCHAR(255) NULL"))
                if "billing_address" not in order_cols:
                    conn.execute(text("ALTER TABLE report_orders ADD COLUMN billing_address TEXT NULL"))
                if "gst_number" not in order_cols:
                    conn.execute(text("ALTER TABLE report_orders ADD COLUMN gst_number VARCHAR(80) NULL"))
                if "base_amount" not in order_cols:
                    conn.execute(text("ALTER TABLE report_orders ADD COLUMN base_amount DECIMAL(10,2) DEFAULT 0.00"))
                if "gateway_charge_percent" not in order_cols:
                    conn.execute(text("ALTER TABLE report_orders ADD COLUMN gateway_charge_percent DECIMAL(6,2) DEFAULT 0.00"))
                if "gateway_charge_amount" not in order_cols:
                    conn.execute(text("ALTER TABLE report_orders ADD COLUMN gateway_charge_amount DECIMAL(10,2) DEFAULT 0.00"))
                if "gateway" not in order_cols:
                    conn.execute(text("ALTER TABLE report_orders ADD COLUMN gateway VARCHAR(30) NULL"))
                if "gateway_order_id" not in order_cols:
                    conn.execute(text("ALTER TABLE report_orders ADD COLUMN gateway_order_id VARCHAR(120) NULL"))
                if "gateway_payment_id" not in order_cols:
                    conn.execute(text("ALTER TABLE report_orders ADD COLUMN gateway_payment_id VARCHAR(120) NULL"))
                if "gateway_signature" not in order_cols:
                    conn.execute(text("ALTER TABLE report_orders ADD COLUMN gateway_signature VARCHAR(255) NULL"))
    except Exception:
        pass


DEFAULT_FORM_CONTROLS = {
    "contact_form": [
        {"field_key": "name", "label": "Name", "placeholder": "Your name", "input_type": "text", "is_enabled": 1, "is_required": 1, "display_order": 1},
        {"field_key": "email", "label": "Email", "placeholder": "Work email", "input_type": "email", "is_enabled": 1, "is_required": 1, "display_order": 2},
        {"field_key": "phone", "label": "Phone", "placeholder": "Phone", "input_type": "text", "is_enabled": 1, "is_required": 0, "display_order": 3},
        {"field_key": "company", "label": "Company", "placeholder": "Company", "input_type": "text", "is_enabled": 1, "is_required": 0, "display_order": 4},
        {"field_key": "designation", "label": "Designation", "placeholder": "Designation", "input_type": "text", "is_enabled": 1, "is_required": 0, "display_order": 5},
        {"field_key": "service_interest", "label": "Service Interest", "placeholder": "", "input_type": "select", "options": ["Custom Market Research", "Competitive & Strategic Intelligence", "Decision Support & Scenario Analysis", "Industry Tracking & Intelligence Subscriptions", "Investment & Due Diligence Research"], "is_enabled": 1, "is_required": 0, "display_order": 6},
        {"field_key": "message", "label": "Requirement", "placeholder": "Tell us your requirement", "input_type": "textarea", "is_enabled": 1, "is_required": 1, "display_order": 7},
    ],
    "newsletter_form": [
        {"field_key": "email", "label": "Email", "placeholder": "Your email address", "input_type": "email", "is_enabled": 1, "is_required": 1, "display_order": 1},
    ],
    "career_application_form": [
        {"field_key": "name", "label": "Full name", "placeholder": "Full name", "input_type": "text", "is_enabled": 1, "is_required": 1, "display_order": 1},
        {"field_key": "email", "label": "Email", "placeholder": "Email", "input_type": "email", "is_enabled": 1, "is_required": 1, "display_order": 2},
        {"field_key": "cover_letter", "label": "Cover letter", "placeholder": "Tell us about yourself", "input_type": "textarea", "is_enabled": 1, "is_required": 0, "display_order": 3},
        {"field_key": "resume", "label": "Resume", "placeholder": "", "input_type": "file", "is_enabled": 1, "is_required": 1, "display_order": 4},
    ],
    "request_sample_form": [
        {"field_key": "full_name", "label": "Full name", "placeholder": "Full name", "input_type": "text", "is_enabled": 1, "is_required": 1, "display_order": 1},
        {"field_key": "email", "label": "Email", "placeholder": "Work email", "input_type": "email", "is_enabled": 1, "is_required": 1, "display_order": 2},
        {"field_key": "phone", "label": "Phone", "placeholder": "Phone", "input_type": "text", "is_enabled": 1, "is_required": 0, "display_order": 3},
        {"field_key": "company", "label": "Company", "placeholder": "Company", "input_type": "text", "is_enabled": 1, "is_required": 0, "display_order": 4},
        {"field_key": "message", "label": "Requirement", "placeholder": "What are you looking for?", "input_type": "textarea", "is_enabled": 1, "is_required": 0, "display_order": 5},
    ],
    "speak_to_analyst_form": [
        {"field_key": "full_name", "label": "Full name", "placeholder": "Full name", "input_type": "text", "is_enabled": 1, "is_required": 1, "display_order": 1},
        {"field_key": "email", "label": "Email", "placeholder": "Work email", "input_type": "email", "is_enabled": 1, "is_required": 1, "display_order": 2},
        {"field_key": "phone", "label": "Phone", "placeholder": "Phone", "input_type": "text", "is_enabled": 1, "is_required": 1, "display_order": 3},
        {"field_key": "company", "label": "Company", "placeholder": "Company", "input_type": "text", "is_enabled": 1, "is_required": 0, "display_order": 4},
        {"field_key": "message", "label": "Requirement", "placeholder": "Key discussion points", "input_type": "textarea", "is_enabled": 1, "is_required": 1, "display_order": 5},
    ],
    "consulting_requirement_form": [
        {"field_key": "full_name", "label": "Full name", "placeholder": "Full name", "input_type": "text", "is_enabled": 1, "is_required": 1, "display_order": 1},
        {"field_key": "email", "label": "Email", "placeholder": "Work email", "input_type": "email", "is_enabled": 1, "is_required": 1, "display_order": 2},
        {"field_key": "phone", "label": "Phone", "placeholder": "Phone", "input_type": "text", "is_enabled": 1, "is_required": 1, "display_order": 3},
        {"field_key": "company", "label": "Company", "placeholder": "Company", "input_type": "text", "is_enabled": 1, "is_required": 1, "display_order": 4},
        {"field_key": "message", "label": "Requirement", "placeholder": "Objective, geography and timeline", "input_type": "textarea", "is_enabled": 1, "is_required": 1, "display_order": 5},
    ],
    "buy_report_form": [
        {"field_key": "full_name", "label": "Full name", "placeholder": "Full name", "input_type": "text", "is_enabled": 1, "is_required": 1, "display_order": 1},
        {"field_key": "email", "label": "Email", "placeholder": "Email", "input_type": "email", "is_enabled": 1, "is_required": 1, "display_order": 2},
        {"field_key": "phone", "label": "Phone", "placeholder": "Phone", "input_type": "text", "is_enabled": 1, "is_required": 1, "display_order": 3},
        {"field_key": "company", "label": "Company", "placeholder": "Company", "input_type": "text", "is_enabled": 1, "is_required": 0, "display_order": 4},
        {"field_key": "designation", "label": "Designation", "placeholder": "Designation", "input_type": "text", "is_enabled": 1, "is_required": 0, "display_order": 5},
        {"field_key": "gst_number", "label": "GST Number", "placeholder": "GST Number", "input_type": "text", "is_enabled": 1, "is_required": 0, "display_order": 6},
        {"field_key": "billing_address", "label": "Billing Address", "placeholder": "Billing address", "input_type": "textarea", "is_enabled": 1, "is_required": 0, "display_order": 7},
        {"field_key": "objective", "label": "Purchase objective", "placeholder": "Purchase objective", "input_type": "text", "is_enabled": 1, "is_required": 0, "display_order": 8},
        {"field_key": "notes", "label": "Additional notes", "placeholder": "Additional notes", "input_type": "textarea", "is_enabled": 1, "is_required": 0, "display_order": 9},
    ],
}


FORM_LABELS = {
    "contact_form": "Contact Form",
    "newsletter_form": "Newsletter Form",
    "career_application_form": "Career Application Form",
    "request_sample_form": "Request Sample Form",
    "speak_to_analyst_form": "Speak To Analyst Form",
    "consulting_requirement_form": "Consulting Requirement Form",
    "buy_report_form": "Buy Report Form",
}


def ensure_form_controls_table():
    try:
        with db.engine.begin() as conn:
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS website_form_controls (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    form_key VARCHAR(80) NOT NULL,
                    field_key VARCHAR(80) NOT NULL,
                    label VARCHAR(191) NULL,
                    placeholder VARCHAR(255) NULL,
                    input_type VARCHAR(30) DEFAULT 'text',
                    options_json LONGTEXT NULL,
                    is_enabled TINYINT(1) DEFAULT 1,
                    is_required TINYINT(1) DEFAULT 0,
                    display_order INT DEFAULT 0,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
                    UNIQUE KEY uq_form_field (form_key, field_key)
                )
            """))
            for form_key, fields in DEFAULT_FORM_CONTROLS.items():
                for field in fields:
                    conn.execute(text("""
                        INSERT INTO website_form_controls (
                            form_key, field_key, label, placeholder, input_type,
                            options_json, is_enabled, is_required, display_order
                        ) VALUES (
                            :form_key, :field_key, :label, :placeholder, :input_type,
                            :options_json, :is_enabled, :is_required, :display_order
                        )
                        ON DUPLICATE KEY UPDATE
                            label = COALESCE(NULLIF(label, ''), VALUES(label)),
                            placeholder = COALESCE(NULLIF(placeholder, ''), VALUES(placeholder)),
                            input_type = COALESCE(NULLIF(input_type, ''), VALUES(input_type)),
                            options_json = COALESCE(options_json, VALUES(options_json)),
                            is_enabled = COALESCE(is_enabled, VALUES(is_enabled)),
                            is_required = COALESCE(is_required, VALUES(is_required)),
                            display_order = COALESCE(display_order, VALUES(display_order))
                    """), {
                        "form_key": form_key,
                        "field_key": field["field_key"],
                        "label": field.get("label"),
                        "placeholder": field.get("placeholder"),
                        "input_type": field.get("input_type") or "text",
                        "options_json": json.dumps(field.get("options", [])),
                        "is_enabled": int(field.get("is_enabled", 1)),
                        "is_required": int(field.get("is_required", 0)),
                        "display_order": int(field.get("display_order", 0)),
                    })
    except Exception:
        pass


def ensure_blog_schema():
    try:
        inspector = inspect(db.engine)
        with db.engine.begin() as conn:
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS blog_categories (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    slug VARCHAR(191) NOT NULL UNIQUE,
                    is_active TINYINT(1) DEFAULT 1,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            """))
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS blogs (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    category_id INT NULL,
                    title VARCHAR(255) NOT NULL,
                    slug VARCHAR(191) NOT NULL UNIQUE,
                    short_description TEXT,
                    content LONGTEXT,
                    featured_image VARCHAR(255),
                    tags VARCHAR(255),
                    seo_title VARCHAR(255),
                    seo_description TEXT,
                    seo_keywords TEXT,
                    author_name VARCHAR(255),
                    status VARCHAR(20) DEFAULT 'draft',
                    published_at DATETIME NULL,
                    is_popular TINYINT(1) DEFAULT 0,
                    show_homepage TINYINT(1) DEFAULT 0,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
                    INDEX idx_blogs_category_id (category_id)
                )
            """))

            if inspector.has_table("blogs"):
                columns = {col["name"] for col in inspector.get_columns("blogs")}
                if "author_name" not in columns:
                    conn.execute(text("ALTER TABLE blogs ADD COLUMN author_name VARCHAR(255) NULL"))
                if "status" not in columns:
                    conn.execute(text("ALTER TABLE blogs ADD COLUMN status VARCHAR(20) DEFAULT 'draft'"))
                if "published_at" not in columns:
                    conn.execute(text("ALTER TABLE blogs ADD COLUMN published_at DATETIME NULL"))
                if "is_popular" not in columns:
                    conn.execute(text("ALTER TABLE blogs ADD COLUMN is_popular TINYINT(1) DEFAULT 0"))
                if "show_homepage" not in columns:
                    conn.execute(text("ALTER TABLE blogs ADD COLUMN show_homepage TINYINT(1) DEFAULT 0"))
    except Exception:
        pass


def ensure_default_blog_categories():
    ensure_blog_schema()
    defaults = [
        ("Insights", "insights"),
        ("Case Studies", "case-studies"),
        ("News", "news"),
        ("Corporate Developments", "corporate-developments"),
        ("Press Releases", "press-releases"),
    ]
    try:
        with db.engine.begin() as conn:
            for name, slug in defaults:
                exists = conn.execute(
                    text("SELECT id FROM blog_categories WHERE slug=:slug LIMIT 1"),
                    {"slug": slug},
                ).fetchone()
                if not exists:
                    conn.execute(text("""
                        INSERT INTO blog_categories (name, slug, is_active, created_at)
                        VALUES (:name, :slug, 1, :created_at)
                    """), {"name": name, "slug": slug, "created_at": datetime.utcnow()})
    except Exception:
        pass


DEFAULT_INDUSTRY_SEGMENTS = [
    "Energy, Power & Infrastructure",
    "Chemicals, Water Technologies & Advanced Materials",
    "Automotive, EV & Mobility",
    "Healthcare & Life Sciences",
    "Digital Technologies, AI & Semiconductors",
    "Consumer Goods, Retail & E-Commerce",
    "Defense & Aerospace",
]

DEFAULT_ADVISORY_SEGMENTS = [
    "Custom Market Research",
    "Competitive & Strategic Intelligence",
    "Decision Support & Scenario Analysis",
    "Industry Tracking & Intelligence Subscriptions",
    "Investment & Due Diligence Research",
]

DEFAULT_SERVICE_FAMILIES = [
    ("Market Intelligence Reports", "market-intelligence-reports"),
    ("Research & Advisory Services", "research-advisory-services"),
]


def _slugify_nav(value):
    slug = re.sub(r"[^a-z0-9]+", "-", (value or "").strip().lower())
    slug = re.sub(r"-{2,}", "-", slug).strip("-")
    return slug or "item"


def ensure_service_taxonomy_tables():
    try:
        with db.engine.begin() as conn:
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS industry_segments (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    slug VARCHAR(191) NOT NULL UNIQUE,
                    tagline TEXT,
                    display_order INT DEFAULT 0,
                    is_active TINYINT(1) DEFAULT 1,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP
                )
            """))
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS advisory_segments (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    slug VARCHAR(191) NOT NULL UNIQUE,
                    display_order INT DEFAULT 0,
                    is_active TINYINT(1) DEFAULT 1,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP
                )
            """))
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS service_families (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    slug VARCHAR(191) NOT NULL UNIQUE,
                    display_order INT DEFAULT 0,
                    is_active TINYINT(1) DEFAULT 1,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP
                )
            """))

            industry_count = conn.execute(text("SELECT COUNT(*) AS c FROM industry_segments")).fetchone().c
            advisory_count = conn.execute(text("SELECT COUNT(*) AS c FROM advisory_segments")).fetchone().c
            family_count = conn.execute(text("SELECT COUNT(*) AS c FROM service_families")).fetchone().c

            if industry_count == 0:
                for idx, name in enumerate(DEFAULT_INDUSTRY_SEGMENTS, start=1):
                    conn.execute(text("""
                        INSERT INTO industry_segments (name, slug, tagline, display_order, is_active, created_at)
                        VALUES (:name, :slug, '', :display_order, 1, :created_at)
                    """), {
                        "name": name,
                        "slug": _slugify_nav(name.replace("&", "and")),
                        "display_order": idx,
                        "created_at": datetime.utcnow(),
                    })

            if advisory_count == 0:
                for idx, name in enumerate(DEFAULT_ADVISORY_SEGMENTS, start=1):
                    conn.execute(text("""
                        INSERT INTO advisory_segments (name, slug, display_order, is_active, created_at)
                        VALUES (:name, :slug, :display_order, 1, :created_at)
                    """), {
                        "name": name,
                        "slug": _slugify_nav(name.replace("&", "and")),
                        "display_order": idx,
                        "created_at": datetime.utcnow(),
                    })

            if family_count == 0:
                for idx, (title, slug) in enumerate(DEFAULT_SERVICE_FAMILIES, start=1):
                    conn.execute(text("""
                        INSERT INTO service_families (title, slug, display_order, is_active, created_at)
                        VALUES (:title, :slug, :display_order, 1, :created_at)
                    """), {
                        "title": title,
                        "slug": slug,
                        "display_order": idx,
                        "created_at": datetime.utcnow(),
                    })
    except Exception:
        pass


def _slugify(value):
    slug = re.sub(r"[^a-z0-9]+", "-", (value or "").strip().lower())
    slug = re.sub(r"-{2,}", "-", slug).strip("-")
    return slug or "member"


def _generate_unique_team_slug(conn, name, team_id=None):
    base_slug = _slugify(name)
    candidate = base_slug
    suffix = 2

    while True:
        existing = conn.execute(
            text("SELECT id FROM team_members WHERE slug=:slug LIMIT 1"),
            {"slug": candidate}
        ).fetchone()
        if not existing or (team_id and int(existing.id) == int(team_id)):
            return candidate
        candidate = f"{base_slug}-{suffix}"
        suffix += 1


def ensure_team_members_schema():
    try:
        inspector = inspect(db.engine)
        if not inspector.has_table("team_members"):
            return

        columns = {col["name"] for col in inspector.get_columns("team_members")}
        indexes = inspector.get_indexes("team_members")
        unique_slug_exists = any(
            idx.get("unique") and idx.get("column_names") == ["slug"]
            for idx in indexes
        )

        with db.engine.begin() as conn:
            if "slug" not in columns:
                conn.execute(text("ALTER TABLE team_members ADD COLUMN slug VARCHAR(191) NULL"))

            null_slug_rows = conn.execute(text("""
                SELECT id, name
                FROM team_members
                WHERE slug IS NULL OR slug = ''
                ORDER BY id ASC
            """)).fetchall()

            for row in null_slug_rows:
                generated_slug = _generate_unique_team_slug(conn, row.name or f"member-{row.id}", row.id)
                conn.execute(
                    text("UPDATE team_members SET slug=:slug WHERE id=:id"),
                    {"slug": generated_slug, "id": row.id}
                )

            duplicate_rows = conn.execute(text("""
                SELECT id, slug
                FROM team_members
                WHERE slug IS NOT NULL AND slug <> ''
                ORDER BY slug ASC, id ASC
            """)).fetchall()

            seen_slugs = set()
            for row in duplicate_rows:
                if row.slug in seen_slugs:
                    deduped_slug = _generate_unique_team_slug(conn, f"{row.slug}-{row.id}", row.id)
                    conn.execute(
                        text("UPDATE team_members SET slug=:slug WHERE id=:id"),
                        {"slug": deduped_slug, "id": row.id}
                    )
                else:
                    seen_slugs.add(row.slug)

            conn.execute(text("""
                UPDATE team_members
                SET slug = CONCAT('member-', id)
                WHERE slug IS NULL OR slug = ''
            """))

            conn.execute(text("ALTER TABLE team_members MODIFY COLUMN slug VARCHAR(191) NOT NULL"))

            if not unique_slug_exists:
                conn.execute(text("CREATE UNIQUE INDEX ux_team_members_slug ON team_members (slug)"))
    except Exception:
        # Keep admin pages accessible even if schema migration is restricted.
        pass


def _safe_int(value, default=0):
    try:
        return int(str(value).strip())
    except Exception:
        return default


def _published_label():
    return datetime.utcnow().strftime("%b %Y")


def _lookup_industry(conn, industry_slug):
    if not industry_slug:
        return None
    return conn.execute(
        text("SELECT id, name, slug FROM industries WHERE slug=:slug LIMIT 1"),
        {"slug": industry_slug},
    ).fetchone()


def _report_code_from_title(conn, industry_slug, title, report_id=None):
    industry = _lookup_industry(conn, industry_slug)
    industry_label = industry.name if industry else industry_slug or "General"
    base = _industry_short_code_admin(industry_slug, industry_label)
    if report_id:
        suffix = int(report_id) % 100 or 1
    else:
        latest_id = conn.execute(text("SELECT COALESCE(MAX(id), 0) AS latest_id FROM reports")).scalar() or 0
        suffix = (int(latest_id) + 1) % 100 or 1
    return f"NG-{base}-{datetime.utcnow().year}-{suffix:02d}"



@admin.route('/login', methods=['GET', 'POST'])
def login():

    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        if not email or not password:
            flash('Email and password are required.', 'danger')
            return redirect(url_for('admin.login'))

        try:
            with db.connect() as connection:
                query = text("""
                    SELECT id, email, password_hash, full_name
                    FROM admin_users 
                    WHERE email = :email
                """)
                user = connection.execute(query, {"email": email}).fetchone()

                if user and check_password_hash(user.password_hash, password):
                    session.clear()
                    session['admin_logged_in'] = True
                    session['admin_id'] = user.id
                    session['admin_name'] = user.full_name
                    session['admin_email'] = user.email

                    flash('Login successful!', 'success')
                    return redirect(url_for('admin.dashboard'))

                flash('Invalid email or password.', 'danger')

        except Exception:
            flash('Something went wrong. Please try again later.', 'danger')

    return render_template('admin/login.html')

# active_user_profile

def active_user_profile(admin_id):
    with db.connect() as conn:
        profile = conn.execute(
            text("SELECT id, full_name, email, profile_image FROM admin_users WHERE id=:id"),
            {"id": admin_id}
        ).fetchone()
    return profile


@admin.app_context_processor
def inject_admin_globals():
    admin_id = session.get('admin_id')
    profile = active_user_profile(admin_id) if admin_id else None
    return {
        "profile": profile,
        "app_name": os.getenv("APP_NAME", "Admin Panel"),
        "company_name": os.getenv("COMPANY_NAME", "Company"),
        "current_year": datetime.utcnow().year,
    }


@admin.route('/logout')
@login_required
def logout():
    session.clear()
    flash('You have been logged out.', 'success')
    return redirect(url_for('admin.login'))


@admin.route('/update_password', methods=['POST'])
@login_required
def update_password():
    admin_id = session.get('admin_id')

    current_password = request.form.get('current_password')
    new_password = request.form.get('new_password')
    confirm_password = request.form.get('confirm_password')

    if not all([current_password, new_password, confirm_password]):
        flash('All fields are required.', 'danger')
        return redirect(url_for('admin.profile'))

    if new_password != confirm_password:
        flash('Passwords do not match.', 'danger')
        return redirect(url_for('admin.profile'))

    with db.begin() as conn:
        user = conn.execute(
            text("SELECT password_hash FROM admin_users WHERE id = :id"),
            {"id": admin_id}
        ).fetchone()

        if not user or not check_password_hash(user.password_hash, current_password):
            flash('Current password is incorrect.', 'danger')
            return redirect(url_for('admin.profile'))

        conn.execute(
            text("""
                UPDATE admin_users
                SET password_hash = :pw,
                    updated_at = :updated_at
                WHERE id = :id
            """),
            {
                "pw": generate_password_hash(new_password),
                "updated_at": datetime.utcnow(),
                "id": admin_id
            }
        )

    # 🔐 Force re-login after password change
    session.clear()
    flash('Password updated successfully. Please login again.', 'success')
    return redirect(url_for('admin.login'))


@admin.route('/dashboard')
@login_required
def dashboard():
    ensure_default_blog_categories()
    ensure_service_taxonomy_tables()
    ensure_reports_schema()
    ensure_jobs_schema()
    ensure_newsletter_schema()
    ensure_report_requests_table()
    ensure_sales_tables()
    ga_chart = get_impressions_clicks(days=30)
    profile = active_user_profile(session.get('admin_id'))
    today = datetime.utcnow().date()
    past_13 = [today - timedelta(days=i) for i in range(13, -1, -1)]
    date_labels = [d.strftime('%d %b') for d in past_13]

    with db.engine.connect() as conn:
        def safe_scalar(query, params=None, default=0):
            try:
                row = conn.execute(text(query), params or {}).fetchone()
                if not row:
                    return default
                val = list(row._mapping.values())[0]
                return val if val is not None else default
            except Exception:
                return default

        dashboard = {
            "impressions": sum(ga_chart.get("impressions", [])),
            "clicks": sum(ga_chart.get("clicks", [])),
            "total_blogs": safe_scalar("SELECT COUNT(*) FROM blogs"),
            "published_blogs": safe_scalar("SELECT COUNT(*) FROM blogs WHERE status='published'"),
            "total_reports": safe_scalar("SELECT COUNT(*) FROM reports"),
            "active_reports": safe_scalar("SELECT COUNT(*) FROM reports WHERE is_active=1"),
            "total_services": safe_scalar("SELECT COUNT(*) FROM services"),
            "active_services": safe_scalar("SELECT COUNT(*) FROM services WHERE is_active=1"),
            "subscribers": safe_scalar("SELECT COUNT(*) FROM newsletter_subscribers WHERE status='subscribed'"),
            "active_landing_pages": safe_scalar("SELECT COUNT(*) FROM landing_pages WHERE is_active=1"),
            "open_jobs": safe_scalar("SELECT COUNT(*) FROM jobs WHERE LOWER(COALESCE(status,'open')) IN ('open','active','published')"),
            "job_applications": safe_scalar("SELECT COUNT(*) FROM job_applications"),
            "contact_leads": safe_scalar("SELECT COUNT(*) FROM queries"),
            "report_requests": safe_scalar("SELECT COUNT(*) FROM report_requests"),
            "inquiry_requests": safe_scalar("SELECT COUNT(*) FROM inquiry_requests"),
            "new_inquiries": safe_scalar("SELECT COUNT(*) FROM inquiry_requests WHERE status='new'"),
            "orders_total": safe_scalar("SELECT COUNT(*) FROM report_orders"),
            "orders_paid": safe_scalar("SELECT COUNT(*) FROM report_orders WHERE payment_status='paid'"),
            "orders_pending": safe_scalar("SELECT COUNT(*) FROM report_orders WHERE payment_status='pending'"),
            "revenue_total": float(safe_scalar("SELECT COALESCE(SUM(amount),0) FROM report_orders WHERE payment_status='paid'", default=0) or 0),
        }
        dashboard["total_leads"] = (
            dashboard["contact_leads"] + dashboard["report_requests"] +
            dashboard["inquiry_requests"] + dashboard["job_applications"]
        )

        try:
            latest_blogs = [row._asdict() for row in conn.execute(text("""
                SELECT title, status, created_at
                FROM blogs
                ORDER BY created_at DESC
                LIMIT 8
            """)).fetchall()]
        except Exception:
            latest_blogs = []

        try:
            recent_orders = [row._asdict() for row in conn.execute(text("""
                SELECT order_ref, report_title, amount, currency, payment_status, order_status, created_at
                FROM report_orders
                ORDER BY created_at DESC
                LIMIT 8
            """)).fetchall()]
        except Exception:
            recent_orders = []

        try:
            recent_inquiries = [row._asdict() for row in conn.execute(text("""
                SELECT inquiry_type, full_name, email, status, created_at
                FROM inquiry_requests
                ORDER BY created_at DESC
                LIMIT 10
            """)).fetchall()]
        except Exception:
            recent_inquiries = []

        try:
            top_reports = [row._asdict() for row in conn.execute(text("""
                SELECT report_title, COUNT(*) AS orders_count, COALESCE(SUM(amount),0) AS revenue
                FROM report_orders
                WHERE payment_status='paid'
                GROUP BY report_title
                ORDER BY revenue DESC, orders_count DESC
                LIMIT 8
            """)).fetchall()]
        except Exception:
            top_reports = []

        leads_map = {d.isoformat(): 0 for d in past_13}
        revenue_map = {d.isoformat(): 0.0 for d in past_13}
        paid_map = {d.isoformat(): 0 for d in past_13}

        try:
            lead_rows = conn.execute(text("""
                SELECT DATE(created_at) AS d, COUNT(*) AS c
                FROM inquiry_requests
                WHERE created_at >= :start_date
                GROUP BY DATE(created_at)
            """), {"start_date": past_13[0]}).fetchall()
            for row in lead_rows:
                key = str(row.d)
                if key in leads_map:
                    leads_map[key] += int(row.c or 0)
        except Exception:
            pass

        try:
            contact_rows = conn.execute(text("""
                SELECT DATE(created_at) AS d, COUNT(*) AS c
                FROM queries
                WHERE created_at >= :start_date
                GROUP BY DATE(created_at)
            """), {"start_date": past_13[0]}).fetchall()
            for row in contact_rows:
                key = str(row.d)
                if key in leads_map:
                    leads_map[key] += int(row.c or 0)
        except Exception:
            pass

        try:
            order_rows = conn.execute(text("""
                SELECT DATE(created_at) AS d,
                       SUM(CASE WHEN payment_status='paid' THEN 1 ELSE 0 END) AS paid_count,
                       COALESCE(SUM(CASE WHEN payment_status='paid' THEN amount ELSE 0 END),0) AS paid_revenue
                FROM report_orders
                WHERE created_at >= :start_date
                GROUP BY DATE(created_at)
            """), {"start_date": past_13[0]}).fetchall()
            for row in order_rows:
                key = str(row.d)
                if key in paid_map:
                    paid_map[key] = int(row.paid_count or 0)
                    revenue_map[key] = float(row.paid_revenue or 0)
        except Exception:
            pass

        leads_chart = {
            "labels": date_labels,
            "values": [leads_map[d.isoformat()] for d in past_13]
        }
        orders_chart = {
            "labels": date_labels,
            "paid_count": [paid_map[d.isoformat()] for d in past_13],
            "paid_revenue": [round(revenue_map[d.isoformat()], 2) for d in past_13]
        }

    return render_template(
        "admin/dashboard.html",
        dashboard=dashboard,
        ga_chart=ga_chart,
        leads_chart=leads_chart,
        orders_chart=orders_chart,
        latest_blogs=latest_blogs,
        recent_orders=recent_orders,
        recent_inquiries=recent_inquiries,
        top_reports=top_reports,
        current_year=datetime.now().year,
        profile=profile
    )


@admin.route('/profile')
@login_required
def profile():
    profile = active_user_profile(session.get('admin_id'))

    return render_template('admin/profile.html', profile=profile)

@admin.route('/profile_update', methods=['POST'])
@login_required
def profile_update():
    admin_id = session.get('admin_id')

    name = request.form.get('name')
    email = request.form.get('email')
    image = request.files.get('image')

    if not name or not email:
        flash('Name and email are required.', 'danger')
        return redirect(url_for('admin.profile'))

    profile_image = None

    # ---------- IMAGE UPLOAD ----------
    if image and image.filename:
        filename = secure_filename(image.filename)
        ext = filename.rsplit('.', 1)[-1].lower()

        allowed_ext = {'png', 'jpg', 'jpeg', 'webp'}
        if ext not in allowed_ext:
            flash('Invalid image format.', 'danger')
            return redirect(url_for('admin.profile'))

        upload_dir = 'static/admin/assets/img/user'
        os.makedirs(upload_dir, exist_ok=True)

        new_profile_image = f"{admin_id}_{int(datetime.utcnow().timestamp())}.{ext}"
        image.save(os.path.join(upload_dir, new_profile_image))

    # ---------- DB UPDATE ----------
    with db.begin() as conn:
        if new_profile_image:
            conn.execute(
                text("""
                    UPDATE admin_users
                    SET full_name=:name,
                        email=:email,
                        profile_image=:profile_image,
                        updated_at=:updated_at
                    WHERE id=:id
                """),
                {
                    "name": name,
                    "email": email,
                    "profile_image": new_profile_image,
                    "updated_at": datetime.utcnow(),
                    "id": admin_id
                }
            )
            
        else:
            conn.execute(
                text("""
                    UPDATE admin_users
                    SET full_name=:name,
                        email=:email,
                        updated_at=:updated_at
                    WHERE id=:id
                """),
                {
                    "name": name,
                    "email": email,
                    "updated_at": datetime.utcnow(),
                    "id": admin_id
                }
            )
        conn.commit()

    flash('Profile updated successfully.', 'success')
    return redirect(url_for('admin.profile'))


@admin.route('/settings')
@login_required
def settings():
    profile = active_user_profile(session.get('admin_id'))

    return render_template('admin/settings.html', profile=profile)


@admin.route('/email-configuration', methods=['GET', 'POST'])
@login_required
def email_config():
    profile = active_user_profile(session.get('admin_id'))

    # -------- ADD / EDIT EMAIL TEMPLATE --------
    if request.method == 'POST':

        id = request.form.get('template_id')
        template_name = request.form.get('template_name')
        template_key = request.form.get('template_key')
        subject = request.form.get('template_subject')
        html_body = request.form.get('template_body')
        
        is_active = 1 if '1' in request.form.getlist('is_active') else 0


        with db.engine.begin() as conn:
            if id:  # Edit
                query = """
                    UPDATE email_templates
                    SET
                        name=:template_name, template_key=:template_key,
                        subject=:subject, body_html=:html_body,
                        is_active=:is_active, updated_at=NOW()
                """
                params = {
                    "template_name": template_name,
                    "template_key": template_key,
                    "subject": subject,
                    "html_body": html_body,
                    "is_active": is_active
                }
                conn.execute(text(query), params)

                flash('Email template updated successfully', 'success')

            else:  # Add
                conn.execute(text("""
                    INSERT INTO email_templates (
                        name, template_key, subject, body_html,
                        is_active, created_at, updated_at
                    ) VALUES (
                        :name, :template_key, :subject, :body_html,
                       is_active, NOW(), NOW()
                    )
                """), {
                    "name": template_name,
                    "template_key": template_key,
                    "subject": subject,
                    "body_html": html_body,
                    "is_active": is_active
                })

                flash('Email template saved successfully', 'success')

        return redirect(url_for('admin.email_config'))

    # -------- LIST TEAM --------
    with db.engine.connect() as conn:
        
        email_templates = conn.execute(text("""
            SELECT *
            FROM email_templates
            ORDER BY created_at DESC;
        """)).fetchall()

        email_settings = {
            "host": os.getenv('MAIL_HOST'),
            "port": int(os.getenv('MAIL_PORT', 587)),
            "username": os.getenv('MAIL_USERNAME'),
            "password": os.getenv('MAIL_PASSWORD'),
            "encryption": os.getenv('MAIL_ENCRYPTION', ''),
            "mail_from_email": os.getenv('MAIL_FROM_EMAIL'),
            "mail_from_name": os.getenv('MAIL_FROM_NAME')
        }


        templates = [row._asdict() for row in email_templates]

    return render_template(
        'admin/email_configuration.html',
        templates=templates,
        settings = email_settings,
        profile=profile
    )   


@admin.route('/email-template/delete/<int:template_id>', methods=['POST'])
@login_required
def delete_email_template(template_id):
    with db.engine.begin() as conn:
        conn.execute(
            text("DELETE FROM email_templates WHERE id=:id"),
            {"id": template_id}
        )

    flash('Email template deleted successfully', 'success')
    return redirect(url_for('admin.email_config'))



@admin.route('/credential_settings', methods=['GET', 'POST'])
@login_required
def credential_settings():

    profile = active_user_profile(session.get('admin_id'))

    if request.method == 'POST':
        with db.engine.begin() as conn:

            # IMPORTANT: read full form once
            form_data = request.form.to_dict(flat=False)
            section = form_data.get('section', [''])[-1]

            # Mapping from section to the key that holds the status
            section_to_status_key = {
                'recaptcha': 'recaptcha_site_key',
                'google_analytics': 'google_analytic_id',
                'google_tag': 'google_tag_id',
                'facebook_pixel': 'facebook_pixel_id',
                'social_login': 'google_login_client_id',
                'tawk_chat': 'tawk_chat_link'
            }

            for field, values in form_data.items():

                if field == 'section':
                    continue

                # ✅ STATUS FIX
                # checkbox sends TWO values: ['0', '1'] or ['0']
                if field.endswith('_status'):
                    key = section_to_status_key.get(section, field.replace('_status', ''))

                    # if checkbox checked → last value is '1'
                    status_value = 1 if '1' in values else 0

                    conn.execute(
                        text("""
                            INSERT INTO credential_settings (`key`, status)
                            VALUES (:key, :status)
                            ON DUPLICATE KEY UPDATE status = :status
                        """),
                        {"key": key, "status": status_value}
                    )

                # VALUE FIELD
                else:
                    conn.execute(
                        text("""
                            INSERT INTO credential_settings (`key`, value)
                            VALUES (:key, :value)
                            ON DUPLICATE KEY UPDATE value = :value
                        """),
                        {"key": field, "value": values[-1]}
                    )

        flash("Credentials updated successfully", "success")
        return redirect(url_for('admin.credential_settings'))

    # LOAD DATA
    with db.engine.connect() as conn:
        rows = conn.execute(
            text("SELECT `key`, `value`, status FROM credential_settings")
        ).fetchall()

    credentials = {
        r.key: {
            "value": r.value,
            "status": r.status
        }
        for r in rows
    }

    return render_template(
        "admin/credential_settings.html",
        profile=profile,
        credentials=credentials
    )


@admin.route('/payment_gateway', methods=['GET', 'POST'])
@login_required
def payment_gateway():

    profile = active_user_profile(session.get('admin_id'))

    if request.method == 'POST':
        with db.engine.begin() as conn:

            # Read full form once
            form_data = request.form.to_dict(flat=False)
            section = form_data.get('section', [''])[-1]

            # Map gateway section → primary key prefix
            section_key_map = {
                'stripe': 'stripe',
                'payu': 'payu',
                'paypal': 'paypal',
                'razorpay': 'razorpay'
            }

            gateway_prefix = section_key_map.get(section, section)

            for field, values in form_data.items():

                if field == 'section':
                    continue

                # STATUS HANDLING (checkbox)
                if field.endswith('_status'):
                    status_value = 1 if 'active' in values or '1' in values else 0
                    key_name = f"{gateway_prefix}_status"

                    conn.execute(
                        text("""
                            INSERT INTO payment_gateway_settings (`key`, status)
                            VALUES (:key, :status)
                            ON DUPLICATE KEY UPDATE status = :status
                        """),
                        {"key": key_name, "status": status_value}
                    )

                # NORMAL VALUE FIELD
                else:
                    conn.execute(
                        text("""
                            INSERT INTO payment_gateway_settings (`key`, value)
                            VALUES (:key, :value)
                            ON DUPLICATE KEY UPDATE value = :value
                        """),
                        {"key": field, "value": values[-1]}
                    )

        flash("Payment gateway settings updated successfully", "success")
        return redirect(url_for('admin.payment_gateway'))

    # LOAD DATA
    with db.engine.connect() as conn:
        rows = conn.execute(
            text("SELECT `key`, `value`, status FROM payment_gateway_settings")
        ).fetchall()

    payment_settings = {
        r.key: {
            "value": r.value,
            "status": r.status
        }
        for r in rows
    }

    return render_template(
        'admin/payment_gateway.html',
        profile=profile,
        payment_settings=payment_settings
    )


@admin.route('/form-controls', methods=['GET', 'POST'])
@login_required
def form_controls():
    ensure_form_controls_table()
    profile = active_user_profile(session.get('admin_id'))
    selected_form = (request.args.get('form_key') or request.form.get('form_key') or 'buy_report_form').strip()
    if selected_form not in FORM_LABELS:
        selected_form = 'buy_report_form'

    if request.method == 'POST':
        field_ids = request.form.getlist('field_id[]')
        labels = request.form.getlist('label[]')
        placeholders = request.form.getlist('placeholder[]')
        input_types = request.form.getlist('input_type[]')
        options_list = request.form.getlist('options[]')
        display_orders = request.form.getlist('display_order[]')

        for idx, field_id in enumerate(field_ids):
            if not field_id:
                continue
            label = (labels[idx] if idx < len(labels) else '').strip()
            placeholder = (placeholders[idx] if idx < len(placeholders) else '').strip()
            input_type = (input_types[idx] if idx < len(input_types) else 'text').strip() or "text"
            options_raw = (options_list[idx] if idx < len(options_list) else '').strip()
            is_enabled = 1 if f"is_enabled_{field_id}" in request.form else 0
            is_required = 1 if f"is_required_{field_id}" in request.form else 0
            try:
                display_order = int((display_orders[idx] if idx < len(display_orders) else '0').strip() or 0)
            except Exception:
                display_order = 0
            options_rows = [item.strip() for item in options_raw.split("\n") if item.strip()]
            with db.engine.begin() as conn:
                conn.execute(text("""
                    UPDATE website_form_controls
                    SET label=:label,
                        placeholder=:placeholder,
                        input_type=:input_type,
                        options_json=:options_json,
                        is_enabled=:is_enabled,
                        is_required=:is_required,
                        display_order=:display_order,
                        updated_at=:updated_at
                    WHERE id=:id
                """), {
                    "id": int(field_id),
                    "label": label,
                    "placeholder": placeholder,
                    "input_type": input_type,
                    "options_json": json.dumps(options_rows),
                    "is_enabled": is_enabled,
                    "is_required": is_required,
                    "display_order": display_order,
                    "updated_at": datetime.utcnow(),
                })
        flash("Form controls updated successfully.", "success")
        return redirect(url_for('admin.form_controls', form_key=selected_form))

    with db.engine.connect() as conn:
        rows = conn.execute(text("""
            SELECT id, form_key, field_key, label, placeholder, input_type, options_json, is_enabled, is_required, display_order
            FROM website_form_controls
            WHERE form_key=:form_key
            ORDER BY display_order ASC, id ASC
        """), {"form_key": selected_form}).fetchall()

    controls = []
    for row in rows:
        parsed_options = []
        if row.options_json:
            try:
                options_data = json.loads(row.options_json)
                if isinstance(options_data, list):
                    parsed_options = [str(opt).strip() for opt in options_data if str(opt).strip()]
            except Exception:
                parsed_options = []
        controls.append({
            "id": row.id,
            "field_key": row.field_key,
            "label": row.label or row.field_key.replace("_", " ").title(),
            "placeholder": row.placeholder or "",
            "input_type": row.input_type or "text",
            "options_raw": "\n".join(parsed_options),
            "is_enabled": int(row.is_enabled or 0),
            "is_required": int(row.is_required or 0),
            "display_order": int(row.display_order or 0),
        })

    return render_template(
        'admin/form_controls.html',
        profile=profile,
        form_labels=FORM_LABELS,
        selected_form=selected_form,
        controls=controls,
    )



@admin.route('/manage-logins', methods=['GET', 'POST'])
@login_required
def manage_logins():
    profile = active_user_profile(session.get('admin_id'))

    try:
        # ---------- CREATE USER ----------
        if request.method == 'POST':
            form = request.form

            email = form.get('email')
            full_name = form.get('full_name')
            role = form.get('role')
            is_active = 1 if form.get('is_active') == '1' else 0
            password = form.get('password')

            if not email or not password or not full_name:
                flash('All required fields must be filled', 'danger')
                return redirect(url_for('admin.manage_logins'))

            password_hash = generate_password_hash(password)

            with db.begin() as conn:
                conn.execute(
                    text("""
                        INSERT INTO admin_users
                        (email, password_hash, full_name, role, is_active)
                        VALUES (:email, :password_hash, :full_name, :role, :is_active)
                    """),
                    {
                        "email": email,
                        "password_hash": password_hash,
                        "full_name": full_name,
                        "role": role,
                        "is_active": is_active
                    }
                )

            flash('User created successfully', 'success')
            return redirect(url_for('admin.manage_logins'))

        # ---------- FETCH USERS ----------
        with db.connect() as conn:
            logins = conn.execute(
                text("SELECT * FROM admin_users ORDER BY id DESC")
            ).fetchall()

        return render_template(
            'admin/user_manager.html',
            logins=logins,
            profile=profile
        )

    except Exception as e:
        print(e)
        flash('Could not retrieve login records. Please try again later.', 'danger')
        return redirect(url_for('admin.dashboard'))


@admin.route('/delete_user/<int:user_id>', methods=['POST'])
@login_required
def delete_user(user_id):
    if session.get('admin_id') == user_id:
        flash("You can't delete your own account", 'danger')
        return redirect(url_for('admin.manage_logins'))

    with db.engine.begin() as conn:
        conn.execute(
            text("DELETE FROM admin_users WHERE id = :id"),
            {"id": user_id}
        )

    flash('User deleted successfully', 'success')
    return redirect(url_for('admin.manage_logins'))



@admin.route('/blogs')
@login_required
def blogs():
    profile = active_user_profile(session.get('admin_id'))
    ensure_default_blog_categories()

    keyword = request.args.get('keyword')
    category_slug = request.args.get('category_slug')
    show_homepage = request.args.get('show_homepage')
    is_popular = request.args.get('is_popular')
    status = request.args.get('status')
    order_by = request.args.get('order_by')
    per_page = request.args.get('par-page')

    conditions = []
    params = {}

    # SEARCH
    if keyword:
        conditions.append("(b.title LIKE :keyword OR b.slug LIKE :keyword)")
        params['keyword'] = f"%{keyword}%"

    # CATEGORY
    if category_slug:
        conditions.append("c.slug = :category_slug")
        params['category_slug'] = category_slug

    # SHOW HOMEPAGE
    if show_homepage in ['0', '1']:
        conditions.append("b.show_homepage = :show_homepage")
        params['show_homepage'] = int(show_homepage)

    # POPULAR
    if is_popular in ['0', '1']:
        conditions.append("b.is_popular = :is_popular")
        params['is_popular'] = int(is_popular)

    # STATUS
    if status in ['0', '1']:
        conditions.append("b.status = :status")
        params['status'] = 'published' if status == '1' else 'draft'

    where_clause = f"WHERE {' AND '.join(conditions)}" if conditions else ""

    # ORDER
    order_clause = "ORDER BY b.created_at DESC"
    if order_by == '1':
        order_clause = "ORDER BY b.created_at ASC"
    elif order_by == '0':
        order_clause = "ORDER BY b.created_at DESC"

    # LIMIT
    limit_clause = ""
    if per_page and per_page.isdigit():
        limit_clause = f"LIMIT {int(per_page)}"

    query = f"""
        SELECT b.*, c.name AS category_name
        FROM blogs b
        LEFT JOIN blog_categories c ON c.id = b.category_id
        {where_clause}
        {order_clause}
        {limit_clause}
    """

    with db.connect() as conn:
        blogs = conn.execute(text(query), params).fetchall()

    return render_template(
        'admin/blogs.html',
        profile=profile,
        blogs=blogs
    )


@admin.route('/blog-category', methods=['GET', 'POST'])
@login_required
def manage_blog_category():
    profile = active_user_profile(session.get('admin_id'))
    ensure_default_blog_categories()

    if request.method == 'POST':
        name = request.form.get('category_name')
        slug = request.form.get('slug')

        is_active = 1 if request.form.getlist('is_active')[-1] == '1' else 0
        created_at = datetime.utcnow()

        if not name or not slug:
            flash('Category name and slug are required.', 'danger')
            return redirect(url_for('admin.manage_blog_category'))

        try:
            with db.engine.begin() as conn:
                conn.execute(
                    text("""
                        INSERT INTO blog_categories
                        (name, slug, is_active, created_at)
                        VALUES
                        (:name, :slug, :is_active, :created_at)
                    """),
                    {
                        "name": name,
                        "slug": slug,
                        "is_active": is_active,
                        "created_at": created_at
                    }
                )

            flash('Category created successfully.', 'success')
            return redirect(url_for('admin.manage_blog_category'))

        except Exception as e:
            print(e)
            flash('Could not create category.', 'danger')
            return redirect(url_for('admin.manage_blog_category'))

    # ---------- GET ----------
    with db.connect() as conn:
        categories = conn.execute(
            text("""
                SELECT id, name, slug, is_active
                FROM blog_categories
                ORDER BY created_at DESC
            """)
        ).fetchall()

    return render_template(
        'admin/blog_category.html',
        profile=profile,
        categories=categories
    )


@admin.route('/create-blog', methods=['GET', 'POST'])
@login_required
def create_blog():
    profile = active_user_profile(session.get('admin_id'))
    ensure_default_blog_categories()
    selected_category_slug = (request.args.get('category_slug') or '').strip().lower()

    # ================= EDITOR IMAGE UPLOAD (AJAX) =================
    if request.method == 'POST' and request.files.get('editor_image'):
        image = request.files['editor_image']

        os.makedirs('static/admin/assets/uploads/blogs', exist_ok=True)
        filename = secure_filename(image.filename)
        path = os.path.join('static/admin/assets/uploads/blogs', filename)
        image.save(path)

        return {
            "url": url_for(
                'static',
                filename=f'admin/assets/uploads/blogs/{filename}'
            )
        }

    # ================= BLOG SAVE =================
    if request.method == 'POST':
        title = request.form.get('title')
        slug = request.form.get('slug')
        short_description = request.form.get('sort_description')
        content = request.form.get('description')
        category_id = request.form.get('blog_category_id')

        tags = request.form.get('tags')
        seo_title = request.form.get('seo_title')
        seo_description = request.form.get('seo_description')
        seo_keywords = request.form.get('seo_keywords')

        show_homepage = 1 if '1' in request.form.getlist('show_homepage') else 0
        is_popular = 1 if '1' in request.form.getlist('is_popular') else 0
        status = 'published' if '1' in request.form.getlist('status') else 'draft'

        author_name = session.get('admin_name')
        published_at = datetime.utcnow() if status == 'published' else None

        # -------- FEATURED IMAGE --------
        featured_image = None
        image = request.files.get('image')
        if image and image.filename:
            os.makedirs('static/admin/assets/uploads/blogs', exist_ok=True)
            filename = secure_filename(f"{slug}-{image.filename}")
            path = os.path.join('static/admin/assets/uploads/blogs', filename)
            image.save(path)
            featured_image = f'admin/assets/uploads/blogs/{filename}'

        if not title or not slug or not content or not category_id:
            flash('All required fields are mandatory.', 'danger')
            return redirect(url_for('admin.create_blog'))

        with db.engine.begin() as conn:
            category = conn.execute(
                text("SELECT name FROM blog_categories WHERE id=:id LIMIT 1"),
                {"id": int(category_id)},
            ).fetchone()
            category_name = category.name if category else "Insights"
            legacy_image = featured_image or "images/primary-logo5.png"
            conn.execute(
                text("""
                    INSERT INTO blogs (
                        category_id, title, slug, short_description,
                        content, featured_image, tags,
                        seo_title, seo_description, seo_keywords,
                        author_name, status, published_at,
                        is_popular, show_homepage, created_at,
                        author, date_label, category, summary, image
                    )
                    VALUES (
                        :category_id, :title, :slug, :short_description,
                        :content, :featured_image, :tags,
                        :seo_title, :seo_description, :seo_keywords,
                        :author_name, :status, :published_at,
                        :is_popular, :show_homepage, :created_at,
                        :author, :date_label, :category, :summary, :image
                    )
                """),
                {
                    "category_id": category_id,
                    "title": title,
                    "slug": slug,
                    "short_description": short_description,
                    "content": content,
                    "featured_image": featured_image,
                    "tags": tags_json(tags),
                    "seo_title": seo_title,
                    "seo_description": seo_description,
                    "seo_keywords": seo_keywords,
                    "author_name": author_name,
                    "status": status,
                    "published_at": published_at,
                    "is_popular": is_popular,
                    "show_homepage": show_homepage,
                    "created_at": datetime.utcnow(),
                    "author": author_name,
                    "date_label": datetime.utcnow().strftime("%b %d, %Y"),
                    "category": category_name,
                    "summary": summary_from_html(short_description or content, max_length=260),
                    "image": legacy_image,
                }
            )

        flash('Blog created successfully!', 'success')
        return redirect(url_for('admin.blogs'))

    # ================= GET =================
    with db.connect() as conn:
        categories = conn.execute(
            text("SELECT id, name FROM blog_categories ORDER BY name ASC")
        ).fetchall()
        selected_category = None
        if selected_category_slug:
            selected_category = conn.execute(
                text("SELECT id FROM blog_categories WHERE slug=:slug LIMIT 1"),
                {"slug": selected_category_slug},
            ).fetchone()

    return render_template(
        'admin/create_blog.html',
        profile=profile,
        categories=categories,
        selected_category_id=(selected_category.id if selected_category else None)
    )


@admin.route('/blog-status-update/<int:blog_id>', methods=['POST'])
@login_required
def blog_status_update(blog_id):
    status_val = request.form.get('status')
    status = 'published' if status_val == '1' else 'draft'
    with db.engine.begin() as conn:
        conn.execute(
            text("""
                UPDATE blogs
                SET status = :status
                WHERE id = :id
            """),
            {"status": status, "id": blog_id}
        )
    return jsonify({"success": True})

@admin.route('/blog-preview/<string:slug>', methods=['GET'])
@login_required
def blog_preview(slug):

    query = text("""
        SELECT b.*, c.name AS category_name
        FROM blogs b
        LEFT JOIN blog_categories c ON c.id = b.category_id
        WHERE b.slug = :slug
        LIMIT 1
    """)

    with db.engine.connect() as conn:
        blog = conn.execute(query, {"slug": slug}).fetchone()

    if not blog:
        abort(404)

    return render_template(
        'admin/blog_preview.html',
        blog=blog
    )


@admin.route('/blog-edit/<string:slug>', methods=['GET', 'POST'])
@login_required
def edit_blog(slug):

    profile = active_user_profile(session.get('admin_id'))

    # ================= IMAGE UPLOAD FOR EDITOR =================
    if request.method == 'POST' and request.files.get('editor_image'):
        image = request.files['editor_image']
        os.makedirs('static/admin/assets/uploads/blogs', exist_ok=True)

        filename = secure_filename(image.filename)
        path = os.path.join('static/admin/assets/uploads/blogs', filename)
        image.save(path)

        return jsonify({
            "url": url_for('static', filename=f'admin/assets/uploads/blogs/{filename}')
        })

    # ================= UPDATE BLOG =================
    if request.method == 'POST':
        title = request.form.get('title')
        new_slug = request.form.get('slug')
        old_slug = request.form.get('old_slug')
        short_description = request.form.get('sort_description')
        content = request.form.get('description')
        category_id = request.form.get('blog_category_id')

        tags = request.form.get('tags')
        seo_title = request.form.get('seo_title')
        seo_description = request.form.get('seo_description')
        seo_keywords = request.form.get('seo_keywords')

        show_homepage = int(request.form.get('show_homepage', 0))
        is_popular = int(request.form.get('is_popular', 0))
        status = 'published' if request.form.get('status') == '1' else 'draft'

        published_at = datetime.utcnow() if status == 'published' else None

        # -------- FEATURED IMAGE --------
        featured_image = request.form.get('existing_image')
        image = request.files.get('image')

        if image and image.filename:
            os.makedirs('static/admin/assets/uploads/blogs', exist_ok=True)
            filename = secure_filename(f"{new_slug}-{image.filename}")
            path = os.path.join('static/admin/assets/uploads/blogs', filename)
            image.save(path)
            featured_image = f'admin/assets/uploads/blogs/{filename}'

        if not title or not new_slug or not content or not category_id:
            flash('All required fields are mandatory.', 'danger')
            return redirect(url_for('admin.edit_blog', slug=old_slug))

        with db.engine.begin() as conn:
            category = conn.execute(
                text("SELECT name FROM blog_categories WHERE id=:id LIMIT 1"),
                {"id": int(category_id)},
            ).fetchone()
            category_name = category.name if category else "Insights"
            legacy_image = featured_image or "images/primary-logo5.png"
            conn.execute(
                text("""
                    UPDATE blogs SET
                        category_id = :category_id,
                        title = :title,
                        slug = :new_slug,
                        short_description = :short_description,
                        content = :content,
                        featured_image = :featured_image,
                        tags = :tags,
                        seo_title = :seo_title,
                        seo_description = :seo_description,
                        seo_keywords = :seo_keywords,
                        author = :author,
                        date_label = :date_label,
                        category = :category,
                        summary = :summary,
                        image = :image,
                        status = :status,
                        published_at = :published_at,
                        is_popular = :is_popular,
                        show_homepage = :show_homepage
                    WHERE slug = :old_slug
                """),
                {
                    "category_id": category_id,
                    "title": title,
                    "new_slug": new_slug,
                    "old_slug": old_slug,
                    "short_description": short_description,
                    "content": content,
                    "featured_image": featured_image,
                    "tags": tags_json(tags),
                    "seo_title": seo_title,
                    "seo_description": seo_description,
                    "seo_keywords": seo_keywords,
                    "author": session.get('admin_name'),
                    "date_label": datetime.utcnow().strftime("%b %d, %Y"),
                    "category": category_name,
                    "summary": summary_from_html(short_description or content, max_length=260),
                    "image": legacy_image,
                    "status": status,
                    "published_at": published_at,
                    "is_popular": is_popular,
                    "show_homepage": show_homepage
                }
            )

        flash('Blog updated successfully!', 'success')
        return redirect(url_for('admin.blogs'))

    # ================= GET =================
    with db.engine.connect() as conn:
        categories = conn.execute(
            text("SELECT id, name FROM blog_categories ORDER BY name")
        ).fetchall()

        blog = conn.execute(
            text("SELECT * FROM blogs WHERE slug=:slug"),
            {"slug": slug}
        ).mappings().first()

    if not blog:
        abort(404)

    blog = dict(blog)
    if isinstance(blog.get("tags"), list):
        blog["tags"] = ", ".join(str(item) for item in blog["tags"] if str(item).strip())

    return render_template(
        'admin/edit_blog.html',
        blog=blog,
        categories=categories,
        profile=profile
    )


@admin.route('/blog-delete/<int:blog_id>', methods=['POST'])
@login_required
def delete_blog(blog_id):
    with db.engine.begin() as conn:
        conn.execute(
            text("DELETE FROM blogs WHERE id=:id"),
            {"id": blog_id}
        )

    flash('Blog deleted successfully', 'success')
    return redirect(url_for('admin.blogs'))


# ================= MANAGE TEAM =================
@admin.route('/manage-team', methods=['GET', 'POST'])
@login_required
def manage_team():
    profile = active_user_profile(session.get('admin_id'))
    ensure_team_members_schema()

    # -------- ADD / EDIT TEAM MEMBER --------
    if request.method == 'POST':

        team_id = request.form.get('id')
        name = (request.form.get('name') or '').strip()
        designation = request.form.get('designation')
        department = request.form.get('department')
        bio = request.form.get('bio')
        email = request.form.get('email')

        linkedin_url = request.form.get('linkedin_url')
        facebook_url = request.form.get('facebook_url')
        instagram_url = request.form.get('instagram_url')
        twitter_url = request.form.get('twitter_url')
        github_url = request.form.get('github_url')
        other_url = request.form.get('other_url')

        display_order = int(request.form.get('display_order') or 0)
        is_active = 1 if '1' in request.form.getlist('is_active') else 0

        if not name:
            flash('Name is required.', 'danger')
            return redirect(url_for('admin.manage_team'))

        # -------- IMAGE --------
        profile_image = None
        image = request.files.get('profile_image')
        if image and image.filename:
            os.makedirs('static/admin/assets/uploads/team', exist_ok=True)
            filename = secure_filename(image.filename)
            image.save(f'static/admin/assets/uploads/team/{filename}')
            profile_image = f'admin/assets/uploads/team/{filename}'

        with db.engine.begin() as conn:
            team_slug = _generate_unique_team_slug(conn, name, team_id)
            if team_id:  # Edit
                query = """
                    UPDATE team_members SET
                        name=:name, slug=:slug, designation=:designation, department=:department,
                        bio=:bio, email=:email, linkedin_url=:linkedin_url,
                        facebook_url=:facebook_url, instagram_url=:instagram_url,
                        twitter_url=:twitter_url, github_url=:github_url,
                        other_url=:other_url, display_order=:display_order,
                        is_active=:is_active, updated_at=NOW()
                """
                if profile_image:
                    query += ", profile_image=:profile_image"
                query += " WHERE id=:id"
                params = {
                    "id": team_id, "name": name, "slug": team_slug, "designation": designation,
                    "department": department, "bio": bio, "email": email,
                    "linkedin_url": linkedin_url, "facebook_url": facebook_url,
                    "instagram_url": instagram_url, "twitter_url": twitter_url,
                    "github_url": github_url, "other_url": other_url,
                    "display_order": display_order, "is_active": is_active
                }
                if profile_image:
                    params["profile_image"] = profile_image
                conn.execute(text(query), params)
            else:  # Add
                conn.execute(text("""
                    INSERT INTO team_members (
                        name, slug, designation, department, profile_image, bio, email,
                        linkedin_url, facebook_url, instagram_url, twitter_url,
                        github_url, other_url, display_order, is_active,
                        created_at, updated_at
                    ) VALUES (
                        :name, :slug, :designation, :department, :profile_image, :bio, :email,
                        :linkedin_url, :facebook_url, :instagram_url, :twitter_url,
                        :github_url, :other_url, :display_order, :is_active,
                        NOW(), NOW()
                    )
                """), {
                    "name": name,
                    "slug": team_slug,
                    "designation": designation,
                    "department": department,
                    "profile_image": profile_image,
                    "bio": bio,
                    "email": email,
                    "linkedin_url": linkedin_url,
                    "facebook_url": facebook_url,
                    "instagram_url": instagram_url,
                    "twitter_url": twitter_url,
                    "github_url": github_url,
                    "other_url": other_url,
                    "display_order": display_order,
                    "is_active": is_active
                })


        return redirect(url_for('admin.manage_team'))

    # -------- LIST TEAM --------
    with db.engine.connect() as conn:
        team_rows = conn.execute(text("""
            SELECT id, name, designation, department, bio, email,
                   linkedin_url, facebook_url, instagram_url, twitter_url,
                   github_url, other_url, profile_image, display_order, is_active
            FROM team_members
            ORDER BY display_order ASC, created_at DESC
        """)).fetchall()
        team = [row._asdict() for row in team_rows]

    return render_template(
        'admin/manage_team.html',
        team=team,
        profile=profile
    )


# ================= DELETE =================
@admin.route('/team/delete/<int:id>', methods=['POST'])
@login_required
def delete_team_member(id):
    with db.engine.begin() as conn:
        conn.execute(
            text("DELETE FROM team_members WHERE id=:id"),
            {"id": id}
        )
    flash('Member deleted successfully', 'success')
    return redirect(url_for('admin.manage_team'))


# ================= STATUS TOGGLE =================
@admin.route('/team/status/<int:id>', methods=['POST'])
@login_required
def team_status(id):
    status = 1 if request.form.get('status') == '1' else 0
    with db.engine.begin() as conn:
        conn.execute(
            text("UPDATE team_members SET is_active=:s WHERE id=:id"),
            {"s": status, "id": id}
        )
    return jsonify({"success": True})


@admin.route('/manage-services', methods=['GET', 'POST'])
@login_required
def manage_services():
    profile = active_user_profile(session.get('admin_id'))
    UPLOAD_DIR = "static/admin/assets/uploads/services"
    service_groups = [
        "Market Intelligence Reports",
        "Research & Advisory Services"
    ]
    has_service_group = False
    has_industry_subcategories = False

    try:
        inspector = inspect(db.engine)
        if inspector.has_table("services"):
            service_columns = {col["name"] for col in inspector.get_columns("services")}
            with db.engine.begin() as conn:
                if "service_group" not in service_columns:
                    conn.execute(text("ALTER TABLE services ADD COLUMN service_group VARCHAR(255)"))
                if "industry_subcategories" not in service_columns:
                    conn.execute(text("ALTER TABLE services ADD COLUMN industry_subcategories TEXT"))
            refreshed_columns = {col["name"] for col in inspect(db.engine).get_columns("services")}
            has_service_group = "service_group" in refreshed_columns
            has_industry_subcategories = "industry_subcategories" in refreshed_columns
    except Exception:
        # Keep the page usable even if schema updates are not permitted.
        pass

    try:
        with db.engine.begin() as conn:

            # ================= CREATE / UPDATE =================
            if request.method == 'POST':
                service_id = request.form.get('id')
                title = (request.form.get('title') or '').strip()
                short_description = request.form.get('short_description') or ''
                long_description = request.form.get('description') or ''
                display_order = _safe_int(request.form.get('display_order') or 0, 0)
                public_image = None

                data = {
                    "service_name": title,
                    "icon": request.form.get('icon'),
                    "slug": (request.form.get('slug') or slugify_text(title, "service")).strip(),
                    "short_description": short_description,
                    "description": long_description,
                    "seo_title": request.form.get('seo_title'),
                    "seo_keywords": request.form.get('seo_keywords'),
                    "seo_description": request.form.get('seo_description'),
                    "starting_price": (lambda x: int(x) if x and str(x).isdigit() else 0)(request.form.get('starting_price', '').strip()),
                    "price_note": request.form.get('price_note'),
                    "display_order": display_order,
                    "is_active": 1 if request.form.get('is_active') else 0,
                    "is_featured": 1 if request.form.get('is_featured') else 0,
                    "name": title,
                    "public_description": summary_from_html(short_description or long_description, max_length=260),
                    "details": strip_html(long_description or short_description),
                    "benefits": benefits_json(short_description, long_description),
                    "sort_order": display_order,
                    "updated_at": datetime.utcnow()
                }
                if has_service_group:
                    data["service_group"] = request.form.get('service_group')
                if has_industry_subcategories:
                    data["industry_subcategories"] = request.form.get('industry_subcategories')

                # ---- FILE UPLOAD ----
                os.makedirs(UPLOAD_DIR, exist_ok=True)
                banner = request.files.get('banner_image')

                if banner and banner.filename:
                    banner_name = secure_filename(banner.filename)
                    banner.save(os.path.join(UPLOAD_DIR, banner_name))
                    data["banner_image"] = f"{UPLOAD_DIR}/{banner_name}"
                    public_image = data["banner_image"].replace("static/", "")
                else:
                    data["banner_image"] = None
                    if not service_id:
                        public_image = "images/primary-logo5.png"
                data["public_image"] = public_image

                if service_id:
                    set_parts = [
                        "service_name=:service_name",
                        "name=:name",
                        "slug=:slug",
                        "short_description=:short_description",
                        "description=:public_description",
                        "details=:details",
                        "image=COALESCE(:public_image, image)",
                        "benefits=:benefits",
                        "seo_title=:seo_title",
                        "seo_keywords=:seo_keywords",
                        "seo_description=:seo_description",
                        "banner_image=COALESCE(:banner_image, banner_image)",
                        "icon=:icon",
                        "starting_price=:starting_price",
                        "price_note=:price_note",
                        "display_order=:display_order",
                        "sort_order=:sort_order",
                        "is_active=:is_active",
                        "is_featured=:is_featured",
                        "updated_at=:updated_at",
                    ]
                    if has_service_group:
                        set_parts.append("service_group=:service_group")
                    if has_industry_subcategories:
                        set_parts.append("industry_subcategories=:industry_subcategories")

                    conn.execute(
                        text(f"UPDATE services SET {', '.join(set_parts)} WHERE id=:id"),
                        {**data, "id": service_id}
                    )

                    flash("Service updated successfully", "success")

                else:
                    insert_columns = [
                        "service_name", "name", "slug", "short_description", "description", "details", "image", "benefits",
                        "icon", "banner_image",
                        "seo_title", "seo_keywords", "seo_description", "starting_price", "price_note",
                        "display_order", "sort_order", "is_active", "is_featured", "created_at", "updated_at"
                    ]
                    insert_values = [
                        ":service_name", ":name", ":slug", ":short_description", ":public_description", ":details", ":public_image", ":benefits",
                        ":icon", ":banner_image",
                        ":seo_title", ":seo_keywords", ":seo_description", ":starting_price", ":price_note",
                        ":display_order", ":sort_order", ":is_active", ":is_featured", ":created_at", ":updated_at"
                    ]
                    if has_service_group:
                        insert_columns.insert(2, "service_group")
                        insert_values.insert(2, ":service_group")
                    if has_industry_subcategories:
                        insert_at = 3 if has_service_group else 2
                        insert_columns.insert(insert_at, "industry_subcategories")
                        insert_values.insert(insert_at, ":industry_subcategories")

                    conn.execute(
                        text(f"""
                            INSERT INTO services ({', '.join(insert_columns)})
                            VALUES ({', '.join(insert_values)})
                        """),
                        {**data, "created_at": datetime.utcnow()}
                    )

                    flash("Service created successfully", "success")

                return redirect(url_for('admin.manage_services'))

            # ================= LIST =================
            service_rows = conn.execute(text("SELECT * FROM services ORDER BY display_order ASC, created_at DESC")).fetchall()
            services = []
            for row in service_rows:
                item = row._asdict()
                item.setdefault("service_group", None)
                item.setdefault("industry_subcategories", None)
                item["title"] = item.get("service_name") or item.get("name")
                item["short_description"] = item.get("short_description") or item.get("description")
                item["description"] = item.get("details") or item.get("description") or ""
                services.append(item)

        return render_template(
            'admin/manage_services.html',
            services=services,
            service_groups=service_groups,
            has_service_group=has_service_group,
            has_industry_subcategories=has_industry_subcategories,
            profile=profile
        )

    except Exception as e:
        flash(str(e), 'danger')
        return redirect(url_for('admin.dashboard'))


@admin.route('/service/delete/<int:id>', methods=['POST'])
@login_required
def delete_service(id):
    with db.engine.begin() as conn:
        conn.execute(text("DELETE FROM services WHERE id=:id"), {"id": id})
    flash("Service deleted", "success")
    return redirect(url_for('admin.manage_services'))


@admin.route('/service-taxonomy', methods=['GET', 'POST'])
@login_required
def service_taxonomy():
    ensure_service_taxonomy_tables()
    query_text = (request.args.get('q') or '').strip()

    if request.method == 'POST':
        section = (request.form.get('section') or '').strip()
        row_id = request.form.get('id')
        name = (request.form.get('name') or '').strip()
        slug = (request.form.get('slug') or '').strip()
        display_order = int(request.form.get('display_order') or 0)
        is_active = 1 if request.form.get('is_active') else 0
        tagline = (request.form.get('tagline') or '').strip()

        if section not in {'industry', 'advisory', 'family'}:
            flash("Invalid section selected.", "danger")
            return redirect(url_for('admin.service_taxonomy'))
        if not name:
            flash("Name/Title is required.", "danger")
            return redirect(url_for('admin.service_taxonomy'))

        slug = slug or _slugify_nav(name.replace("&", "and"))
        table_map = {
            "industry": ("industry_segments", "name"),
            "advisory": ("advisory_segments", "name"),
            "family": ("service_families", "title"),
        }
        table_name, label_col = table_map[section]

        try:
            with db.engine.begin() as conn:
                if row_id:
                    base_query = f"""
                        UPDATE {table_name}
                        SET {label_col}=:label, slug=:slug, display_order=:display_order, is_active=:is_active, updated_at=:updated_at
                    """
                    params = {
                        "id": int(row_id),
                        "label": name,
                        "slug": slug,
                        "display_order": display_order,
                        "is_active": is_active,
                        "updated_at": datetime.utcnow(),
                    }
                    if section == "industry":
                        base_query += ", tagline=:tagline"
                        params["tagline"] = tagline
                    base_query += " WHERE id=:id"
                    conn.execute(text(base_query), params)
                    flash("Taxonomy item updated.", "success")
                else:
                    if section == "industry":
                        conn.execute(text("""
                            INSERT INTO industry_segments (name, slug, tagline, display_order, is_active, created_at, updated_at)
                            VALUES (:label, :slug, :tagline, :display_order, :is_active, :created_at, :updated_at)
                        """), {
                            "label": name,
                            "slug": slug,
                            "tagline": tagline,
                            "display_order": display_order,
                            "is_active": is_active,
                            "created_at": datetime.utcnow(),
                            "updated_at": datetime.utcnow(),
                        })
                    elif section == "advisory":
                        conn.execute(text("""
                            INSERT INTO advisory_segments (name, slug, display_order, is_active, created_at, updated_at)
                            VALUES (:label, :slug, :display_order, :is_active, :created_at, :updated_at)
                        """), {
                            "label": name,
                            "slug": slug,
                            "display_order": display_order,
                            "is_active": is_active,
                            "created_at": datetime.utcnow(),
                            "updated_at": datetime.utcnow(),
                        })
                    else:
                        conn.execute(text("""
                            INSERT INTO service_families (title, slug, display_order, is_active, created_at, updated_at)
                            VALUES (:label, :slug, :display_order, :is_active, :created_at, :updated_at)
                        """), {
                            "label": name,
                            "slug": slug,
                            "display_order": display_order,
                            "is_active": is_active,
                            "created_at": datetime.utcnow(),
                            "updated_at": datetime.utcnow(),
                        })
                    flash("Taxonomy item added.", "success")
        except Exception as e:
            flash(str(e), "danger")

        return redirect(url_for('admin.service_taxonomy', q=query_text))

    search_filter = ""
    params = {}
    if query_text:
        search_filter = " WHERE name LIKE :q"
        params["q"] = f"%{query_text}%"

    with db.engine.connect() as conn:
        industries = conn.execute(text(f"""
            SELECT id, name, slug, tagline, display_order, is_active
            FROM industry_segments
            {search_filter}
            ORDER BY display_order ASC, id ASC
        """), params).fetchall()

        advisory = conn.execute(text(f"""
            SELECT id, name, slug, display_order, is_active
            FROM advisory_segments
            {search_filter}
            ORDER BY display_order ASC, id ASC
        """), params).fetchall()

        family_filter = " WHERE title LIKE :q" if query_text else ""
        families = conn.execute(text(f"""
            SELECT id, title, slug, display_order, is_active
            FROM service_families
            {family_filter}
            ORDER BY display_order ASC, id ASC
        """), params if query_text else {}).fetchall()

    return render_template(
        'admin/service_taxonomy.html',
        industries=[row._asdict() for row in industries],
        advisory=[row._asdict() for row in advisory],
        families=[row._asdict() for row in families],
        q=query_text,
    )


@admin.route('/service-taxonomy/delete/<string:section>/<int:id>', methods=['POST'])
@login_required
def delete_service_taxonomy_item(section, id):
    ensure_service_taxonomy_tables()
    table_map = {
        "industry": "industry_segments",
        "advisory": "advisory_segments",
        "family": "service_families",
    }
    table_name = table_map.get(section)
    if not table_name:
        flash("Invalid section selected.", "danger")
        return redirect(url_for('admin.service_taxonomy'))

    try:
        with db.engine.begin() as conn:
            conn.execute(text(f"DELETE FROM {table_name} WHERE id=:id"), {"id": id})
        flash("Taxonomy item deleted.", "success")
    except Exception as e:
        flash(str(e), "danger")
    return redirect(url_for('admin.service_taxonomy'))


@admin.route('/faqs', methods=['GET', 'POST'])
@login_required
def faqs():
    profile = active_user_profile(session.get('admin_id'))

    try:
        with db.engine.begin() as conn:

            # ========== CREATE / UPDATE ==========
            if request.method == 'POST':
                faq_id = request.form.get('id')

                data = {
                    "question": request.form.get('question'),
                    "answer": request.form.get('answer'),
                    "display_order": int(request.form.get('display_order') or 0),
                    "sort_order": int(request.form.get('display_order') or 0),
                    "is_active": 1 if request.form.get('is_active') else 0,
                    "updated_at": datetime.utcnow()
                }

                if faq_id:
                    conn.execute(text("""
                        UPDATE faqs SET
                        question=:question,
                        answer=:answer,
                        display_order=:display_order,
                        sort_order=:sort_order,
                        is_active=:is_active,
                        updated_at=:updated_at
                        WHERE id=:id
                    """), {**data, "id": faq_id})
                    flash("FAQ updated successfully", "success")
                else:
                    conn.execute(text("""
                        INSERT INTO faqs
                        (question, answer, display_order, sort_order, is_active, created_at, updated_at)
                        VALUES
                        (:question, :answer, :display_order, :sort_order, :is_active, :created_at, :updated_at)
                    """), {**data, "created_at": datetime.utcnow()})
                    flash("FAQ created successfully", "success")

                return redirect(url_for('admin.faqs'))

            # ========== LIST ==========
            faqs = conn.execute(
                text("SELECT * FROM faqs ORDER BY display_order ASC, created_at DESC")
            ).fetchall()

        return render_template('admin/faqs.html', faqs=faqs, profile=profile)

    except Exception as e:
        flash(str(e), 'danger')
        return redirect(url_for('admin.dashboard'))

@admin.route('/faqs/delete/<int:id>', methods=['POST'])
@login_required
def delete_faq(id):
    try:
        with db.engine.begin() as conn:
            conn.execute(text("DELETE FROM faqs WHERE id=:id"), {"id": id})
        flash("FAQ deleted successfully", "success")
    except Exception as e:
        flash(str(e), "danger")
    return redirect(url_for('admin.faqs'))


def _next_home_hero_slug(conn):
    rows = conn.execute(text("""
        SELECT slug
        FROM landing_pages
        WHERE slug='home' OR slug LIKE 'home-%'
    """)).fetchall()
    used = set()
    for row in rows:
        slug = (row.slug or "").strip()
        if slug == "home":
            used.add(0)
        elif slug.startswith("home-"):
            tail = slug.split("-", 1)[1]
            if tail.isdigit():
                used.add(int(tail))

    if 0 not in used:
        return "home"

    i = 1
    while i in used:
        i += 1
    return f"home-{i}"


@admin.route('/home-hero', methods=['GET', 'POST'])
@login_required
def home_hero():
    ensure_landing_pages_table()

    try:
        with db.engine.begin() as conn:
            if request.method == 'POST':
                row_id = request.form.get('id')
                title = (request.form.get('title') or '').strip() or "Home Hero"
                hero_title = (request.form.get('hero_title') or '').strip()
                hero_subtitle = (request.form.get('hero_subtitle') or '').strip()
                content = (request.form.get('content') or '').strip()
                cta_text = (request.form.get('cta_text') or '').strip()
                cta_url = (request.form.get('cta_url') or '').strip() or '/contact-us'
                banner_svg = (request.form.get('banner_svg') or '').strip()
                is_active = 1 if request.form.get('is_active') else 0
                now = datetime.utcnow()
                banner_upload = request.files.get('banner_image')

                if banner_upload and banner_upload.filename:
                    upload_dir = "static/admin/assets/uploads/home_hero"
                    os.makedirs(upload_dir, exist_ok=True)
                    filename = secure_filename(banner_upload.filename)
                    save_name = f"{now.strftime('%Y%m%d%H%M%S')}-{filename}"
                    banner_upload.save(os.path.join(upload_dir, save_name))
                    banner_svg = f"admin/assets/uploads/home_hero/{save_name}"

                if not hero_title:
                    flash("Hero title is required.", "danger")
                    return redirect(url_for('admin.home_hero'))

                if row_id:
                    existing = conn.execute(text("""
                        SELECT id
                        FROM landing_pages
                        WHERE id=:id
                          AND (slug='home' OR slug LIKE 'home-%')
                        LIMIT 1
                    """), {"id": int(row_id)}).fetchone()
                    if not existing:
                        flash("Invalid hero slide.", "danger")
                        return redirect(url_for('admin.home_hero'))

                    conn.execute(text("""
                        UPDATE landing_pages
                        SET title=:title,
                            hero_title=:hero_title,
                            hero_subtitle=:hero_subtitle,
                            content=:content,
                            cta_text=:cta_text,
                            cta_url=:cta_url,
                            banner_svg=:banner_svg,
                            is_active=:is_active,
                            updated_at=:updated_at
                        WHERE id=:id
                    """), {
                        "id": int(row_id),
                        "title": title,
                        "hero_title": hero_title,
                        "hero_subtitle": hero_subtitle,
                        "content": content,
                        "cta_text": cta_text,
                        "cta_url": cta_url,
                        "banner_svg": banner_svg,
                        "is_active": is_active,
                        "updated_at": now,
                    })
                    flash("Home hero slide updated.", "success")
                else:
                    slug = _next_home_hero_slug(conn)
                    conn.execute(text("""
                        INSERT INTO landing_pages (
                            title, slug, hero_title, hero_subtitle, content,
                            cta_text, cta_url, banner_svg,
                            seo_title, seo_description, seo_keywords,
                            show_in_menu, is_active, created_at, updated_at
                        ) VALUES (
                            :title, :slug, :hero_title, :hero_subtitle, :content,
                            :cta_text, :cta_url, :banner_svg,
                            '', '', '',
                            0, :is_active, :created_at, :updated_at
                        )
                    """), {
                        "title": title,
                        "slug": slug,
                        "hero_title": hero_title,
                        "hero_subtitle": hero_subtitle,
                        "content": content,
                        "cta_text": cta_text,
                        "cta_url": cta_url,
                        "banner_svg": banner_svg,
                        "is_active": is_active,
                        "created_at": now,
                        "updated_at": now,
                    })
                    flash("Home hero slide created.", "success")

                return redirect(url_for('admin.home_hero'))

            hero_rows = conn.execute(text("""
                SELECT id, title, slug, hero_title, hero_subtitle, content, cta_text, cta_url,
                       banner_svg, is_active, updated_at, created_at
                FROM landing_pages
                WHERE slug='home' OR slug LIKE 'home-%'
                ORDER BY
                    CASE WHEN slug='home' THEN 0 ELSE 1 END,
                    slug ASC,
                    updated_at DESC
            """)).fetchall()

        return render_template('admin/home_hero.html', hero_rows=[row._asdict() for row in hero_rows])
    except Exception as e:
        flash(str(e), 'danger')
        return redirect(url_for('admin.dashboard'))


@admin.route('/home-hero/delete/<int:id>', methods=['POST'])
@login_required
def delete_home_hero(id):
    ensure_landing_pages_table()
    try:
        with db.engine.begin() as conn:
            row = conn.execute(text("""
                SELECT id
                FROM landing_pages
                WHERE id=:id AND (slug='home' OR slug LIKE 'home-%')
                LIMIT 1
            """), {"id": id}).fetchone()
            if row:
                conn.execute(text("DELETE FROM landing_pages WHERE id=:id"), {"id": id})
                flash("Home hero slide deleted.", "success")
            else:
                flash("Invalid hero slide.", "danger")
    except Exception as e:
        flash(str(e), "danger")
    return redirect(url_for('admin.home_hero'))


@admin.route('/home-hero/status/<int:id>', methods=['POST'])
@login_required
def home_hero_status(id):
    ensure_landing_pages_table()
    status = 1 if request.form.get('status') == '1' else 0
    with db.engine.begin() as conn:
        conn.execute(text("""
            UPDATE landing_pages
            SET is_active=:s, updated_at=:updated_at
            WHERE id=:id AND (slug='home' OR slug LIKE 'home-%')
        """), {"s": status, "id": id, "updated_at": datetime.utcnow()})
    return jsonify({"success": True})


@admin.route('/landing-pages-list', methods=['GET', 'POST'])
@login_required
def landing_pages_list():
    profile = active_user_profile(session.get('admin_id'))
    ensure_landing_pages_table()

    try:
        with db.engine.begin() as conn:
            if request.method == 'POST':
                page_id = request.form.get('id')
                data = {
                    "title": (request.form.get('title') or '').strip(),
                    "slug": (request.form.get('slug') or '').strip(),
                    "hero_title": request.form.get('hero_title'),
                    "hero_subtitle": request.form.get('hero_subtitle'),
                    "content": request.form.get('content'),
                    "cta_text": request.form.get('cta_text'),
                    "cta_url": request.form.get('cta_url'),
                    "banner_svg": request.form.get('banner_svg'),
                    "seo_title": request.form.get('seo_title'),
                    "seo_description": request.form.get('seo_description'),
                    "seo_keywords": request.form.get('seo_keywords'),
                    "show_in_menu": 1 if request.form.get('show_in_menu') else 0,
                    "is_active": 1 if request.form.get('is_active') else 0,
                    "updated_at": datetime.utcnow(),
                }

                if not data["title"] or not data["slug"]:
                    flash("Title and slug are required.", "danger")
                    return redirect(url_for('admin.landing_pages_list'))

                if page_id:
                    conn.execute(text("""
                        UPDATE landing_pages SET
                            title=:title,
                            slug=:slug,
                            hero_title=:hero_title,
                            hero_subtitle=:hero_subtitle,
                            content=:content,
                            cta_text=:cta_text,
                            cta_url=:cta_url,
                            banner_svg=:banner_svg,
                            seo_title=:seo_title,
                            seo_description=:seo_description,
                            seo_keywords=:seo_keywords,
                            show_in_menu=:show_in_menu,
                            is_active=:is_active,
                            updated_at=:updated_at
                        WHERE id=:id
                    """), {**data, "id": int(page_id)})
                    flash("Landing page updated.", "success")
                else:
                    conn.execute(text("""
                        INSERT INTO landing_pages (
                            title, slug, hero_title, hero_subtitle, content,
                            cta_text, cta_url, banner_svg, seo_title, seo_description,
                            seo_keywords, show_in_menu, is_active, created_at, updated_at
                        ) VALUES (
                            :title, :slug, :hero_title, :hero_subtitle, :content,
                            :cta_text, :cta_url, :banner_svg, :seo_title, :seo_description,
                            :seo_keywords, :show_in_menu, :is_active, :created_at, :updated_at
                        )
                    """), {**data, "created_at": datetime.utcnow()})
                    flash("Landing page created.", "success")

                return redirect(url_for('admin.landing_pages_list'))

            landing_pages = conn.execute(text("""
                SELECT id, title, slug, hero_title, hero_subtitle, content, cta_text, cta_url,
                       banner_svg, seo_title, seo_description, seo_keywords,
                       show_in_menu, is_active, updated_at, created_at
                FROM landing_pages
                ORDER BY updated_at DESC, created_at DESC
            """)).fetchall()

        return render_template(
            'admin/landing_pages_list.html',
            landing_pages=[row._asdict() for row in landing_pages],
            profile=profile
        )

    except Exception as e:
        flash(str(e), 'danger')
        return redirect(url_for('admin.dashboard'))


@admin.route('/landing-page/delete/<int:id>', methods=['POST'])
@login_required
def delete_landing_page(id):
    ensure_landing_pages_table()
    with db.engine.begin() as conn:
        conn.execute(text("DELETE FROM landing_pages WHERE id=:id"), {"id": id})
    flash("Landing page deleted.", "success")
    return redirect(url_for('admin.landing_pages_list'))


@admin.route('/landing-page/status/<int:id>', methods=['POST'])
@login_required
def landing_page_status(id):
    ensure_landing_pages_table()
    status = 1 if request.form.get('status') == '1' else 0
    with db.engine.begin() as conn:
        conn.execute(text("UPDATE landing_pages SET is_active=:s WHERE id=:id"), {"s": status, "id": id})
    return jsonify({"success": True})



# Sections


@admin.route('/award-section', methods=['GET', 'POST'])
@login_required
def award_section():
    profile = active_user_profile(session.get('admin_id'))
    UPLOAD_DIR = "static/admin/assets/uploads/awards"

    try:
        with db.engine.begin() as conn:

            # ================= CREATE / UPDATE =================
            if request.method == 'POST':
                award_id = request.form.get('id')

                data = {
                    "title": request.form.get('title'),
                    "description": request.form.get('description'),
                    "category": request.form.get('category'),
                    "display_order": request.form.get('display_order') or 0,
                    "is_active": 1 if request.form.get('is_active') else 0,
                    "updated_at": datetime.utcnow()
                }

                os.makedirs(UPLOAD_DIR, exist_ok=True)

                image = request.files.get('image')
                if image and image.filename:
                    filename = secure_filename(image.filename)
                    image.save(os.path.join(UPLOAD_DIR, filename))
                    data["image"] = f"{UPLOAD_DIR}/{filename}"

                if award_id:
                    conn.execute(
                        text("""
                        UPDATE awards SET
                            title=:title,
                            description=:description,
                            category=:category,
                            image=COALESCE(:image, image),
                            display_order=:display_order,
                            is_active=:is_active,
                            updated_at=:updated_at
                        WHERE id=:id
                        """),
                        {**data, "id": award_id}
                    )
                    flash("Award updated successfully", "success")
                else:
                    conn.execute(
                        text("""
                        INSERT INTO awards
                        (title, description, category, image, display_order, is_active, created_at)
                        VALUES
                        (:title, :description, :category, :image, :display_order, :is_active, :created_at)
                        """),
                        {**data, "created_at": datetime.utcnow()}
                    )
                    flash("Award added successfully", "success")

                return redirect(url_for('admin.award_section'))

            # ================= LIST =================
            awards = conn.execute(
                text("SELECT * FROM awards ORDER BY display_order ASC, created_at DESC")
            ).fetchall()

        return render_template(
            'admin/award_section.html',
            awards=awards,
            profile=profile
        )

    except Exception as e:
        flash(str(e), 'danger')
        return redirect(url_for('admin.dashboard'))


@admin.route('/award/delete/<int:id>', methods=['POST'])
@login_required
def delete_award(id):
    try:
        with db.engine.begin() as conn:
            conn.execute(text("DELETE FROM awards WHERE id=:id"), {"id": id})
        flash("Award deleted successfully", "success")
    except Exception as e:
        flash(str(e), "danger")
    return redirect(url_for('admin.award_section'))



def ensure_reports_schema():
    try:
        inspector = inspect(db.engine)
        if not inspector.has_table("reports"):
            return
        columns = {col["name"] for col in inspector.get_columns("reports")}
        with db.engine.begin() as conn:
            if "industry_slug" not in columns:
                conn.execute(text("ALTER TABLE reports ADD COLUMN industry_slug VARCHAR(191) NULL"))
            if "table_of_contents" not in columns:
                conn.execute(text("ALTER TABLE reports ADD COLUMN table_of_contents LONGTEXT NULL"))
            if "geography" not in columns:
                conn.execute(text("ALTER TABLE reports ADD COLUMN geography VARCHAR(255) NULL"))
            if "page_count" not in columns:
                conn.execute(text("ALTER TABLE reports ADD COLUMN page_count INT NULL"))
            if "delivery_format" not in columns:
                conn.execute(text("ALTER TABLE reports ADD COLUMN delivery_format VARCHAR(100) NULL"))
            if "list_of_figures" not in columns:
                conn.execute(text("ALTER TABLE reports ADD COLUMN list_of_figures LONGTEXT NULL"))
            if "list_of_tables" not in columns:
                conn.execute(text("ALTER TABLE reports ADD COLUMN list_of_tables LONGTEXT NULL"))
            if "report_review" not in columns:
                conn.execute(text("ALTER TABLE reports ADD COLUMN report_review LONGTEXT NULL"))
            if "faqs" not in columns:
                conn.execute(text("ALTER TABLE reports ADD COLUMN faqs LONGTEXT NULL"))
    except Exception:
        pass


def _industry_short_code_admin(industry_slug=None, industry_name=None):
    raw = (industry_name or industry_slug or "GEN").replace("-", " ").replace("&", " and ")
    tokens = [t for t in re.split(r"[^a-zA-Z0-9]+", raw) if t]
    stopwords = {"and", "the", "for", "of", "to", "in"}
    meaningful = [t for t in tokens if t.lower() not in stopwords]
    source = meaningful[:3] if meaningful else tokens[:3]
    code = "".join(part[0].upper() for part in source if part)
    return code or "GEN"


def _report_code_admin(row, industry_label_map):
    industry_slug = row.get("industry_slug")
    industry_name = industry_label_map.get(industry_slug) if industry_slug else "General"
    ts = row.get("updated_at") or row.get("created_at")
    year_value = ts.year if ts else datetime.utcnow().year
    sequence = int(row.get("id") or 0) % 100
    if sequence == 0:
        sequence = 1
    return f"NG-{_industry_short_code_admin(industry_slug, industry_name)}-{year_value}-{sequence:02d}"


def ensure_jobs_schema():
    try:
        inspector = inspect(db.engine)
        with db.engine.begin() as conn:
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS jobs (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    location VARCHAR(255),
                    employment_type VARCHAR(50),
                    description LONGTEXT,
                    requirements LONGTEXT,
                    status VARCHAR(20) DEFAULT 'open',
                    posted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            """))
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS job_applications (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    job_id INT NOT NULL,
                    applicant_name VARCHAR(255),
                    applicant_email VARCHAR(191),
                    resume_path VARCHAR(255),
                    cover_letter TEXT,
                    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    INDEX idx_job_applications_job_id (job_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            """))

            if inspector.has_table("jobs"):
                columns = {col["name"] for col in inspector.get_columns("jobs")}
                if "slug" not in columns:
                    conn.execute(text("ALTER TABLE jobs ADD COLUMN slug VARCHAR(191) NULL"))
                if "department" not in columns:
                    conn.execute(text("ALTER TABLE jobs ADD COLUMN department VARCHAR(255) NULL"))
                if "employment_type" not in columns:
                    conn.execute(text("ALTER TABLE jobs ADD COLUMN employment_type VARCHAR(50) NULL"))
                if "responsibilities" not in columns:
                    conn.execute(text("ALTER TABLE jobs ADD COLUMN responsibilities LONGTEXT NULL"))
                if "requirements" not in columns:
                    conn.execute(text("ALTER TABLE jobs ADD COLUMN requirements LONGTEXT NULL"))
                if "status" not in columns:
                    conn.execute(text("ALTER TABLE jobs ADD COLUMN status VARCHAR(20) DEFAULT 'open'"))
                if "created_at" not in columns:
                    conn.execute(text("ALTER TABLE jobs ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP"))
                if "updated_at" not in columns:
                    conn.execute(text("ALTER TABLE jobs ADD COLUMN updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP"))
    except Exception:
        pass


@admin.route('/manage-reports', methods=['GET', 'POST'])
@login_required
def manage_reports():
    ensure_reports_schema()
    ensure_service_taxonomy_tables()
    upload_dir = "static/admin/assets/uploads/reports"
    os.makedirs(upload_dir, exist_ok=True)
    query_text = (request.args.get('q') or '').strip()
    industry_filter = (request.args.get('industry') or '').strip()
    status_filter = (request.args.get('status') or '').strip()

    try:
        with db.engine.begin() as conn:
            if request.method == 'POST':
                report_id = request.form.get('id')
                slug = (request.form.get('slug') or '').strip()
                title = (request.form.get('title') or '').strip()
                industry_slug = (request.form.get('industry_slug') or '').strip() or None
                industry = _lookup_industry(conn, industry_slug) or conn.execute(
                    text("SELECT id, name, slug FROM industries ORDER BY sort_order ASC, id ASC LIMIT 1")
                ).fetchone()
                if industry:
                    industry_slug = industry.slug
                excerpt = request.form.get('excerpt')
                content = request.form.get('content')
                toc_html = request.form.get('table_of_contents')
                lof_html = request.form.get('list_of_figures')
                lot_html = request.form.get('list_of_tables')
                review_html = request.form.get('report_review')
                report_faqs_json = request.form.get('report_faqs', '[]')
                published_label = (request.form.get('published_label') or '').strip() or _published_label()
                data = {
                    "faqs": report_faqs_json,
                    "title": title,
                    "slug": slug,
                    "industry_slug": industry_slug,
                    "excerpt": excerpt,
                    "content": content,
                    "table_of_contents": toc_html,
                    "lof_html": lof_html,
                    "lot_html": lot_html,
                    "review_html": review_html,
                    "geography": (request.form.get('geography') or '').strip() or None,
                    "page_count": int(request.form.get('page_count') or 0) or None,
                    "delivery_format": (request.form.get('delivery_format') or '').strip() or None,
                    "price": float(request.form.get('price') or 0),
                    "code": (request.form.get('code') or '').strip() or _report_code_from_title(conn, industry_slug, title, int(report_id) if report_id else None),
                    "published_label": published_label,
                    "summary": summary_from_html(excerpt or content, max_length=280),
                    "pages": int(request.form.get('page_count') or 0) or 185,
                    "coverage": (request.form.get('coverage') or '').strip() or 'Global',
                    "description": strip_html(content or excerpt),
                    "toc": html_list_json(toc_html),
                    "lof": html_list_json(lof_html),
                    "lot": html_list_json(lot_html),
                    "status": "Published" if request.form.get('is_active') else "Draft",
                    "industry_id": industry.id if industry else None,
                    "is_active": 1 if request.form.get('is_active') else 0,
                    "updated_at": datetime.utcnow(),
                }
                if not title or not slug:
                    flash("Title and slug are required.", "danger")
                    return redirect(url_for('admin.manage_reports'))

                banner = request.files.get('banner_image')
                if banner and banner.filename:
                    filename = secure_filename(banner.filename)
                    banner.save(os.path.join(upload_dir, filename))
                    data["banner_image"] = f"{upload_dir}/{filename}"
                else:
                    data["banner_image"] = None

                if report_id:
                    conn.execute(text("""
                        UPDATE reports SET
                            title=:title,
                            slug=:slug,
                            industry_slug=:industry_slug,
                            excerpt=:excerpt,
                            content=:content,
                            table_of_contents=:table_of_contents,
                            list_of_figures=:lof_html,
                            list_of_tables=:lot_html,
                            report_review=:review_html,
                            faqs=:faqs,
                            geography=:geography,
                            page_count=:page_count,
                            delivery_format=:delivery_format,
                            banner_image=COALESCE(:banner_image, banner_image),
                            price=:price,
                            code=:code,
                            published_label=:published_label,
                            summary=:summary,
                            pages=:pages,
                            coverage=:coverage,
                            description=:description,
                            toc=:toc,
                            lof=:lof,
                            lot=:lot,
                            status=:status,
                            industry_id=:industry_id,
                            is_active=:is_active,
                            updated_at=:updated_at
                        WHERE id=:id
                    """), {**data, "id": int(report_id)})
                    flash("Report updated.", "success")
                else:
                    conn.execute(text("""
                        INSERT INTO reports (
                            title, slug, industry_slug, excerpt, content, table_of_contents, 
                            list_of_figures, list_of_tables, report_review,
                            geography, page_count, delivery_format, banner_image, price,
                            code, published_label, summary, pages, coverage, description, toc, lof, lot, companies, status, industry_id,
                            is_active, created_at, updated_at
                        ) VALUES (
                            :title, :slug, :industry_slug, :excerpt, :content, :table_of_contents, 
                            :lof_html, :lot_html, :review_html,
                            :geography, :page_count, :delivery_format, :banner_image, :price,
                            :code, :published_label, :summary, :pages, :coverage, :description, :toc, :lof, :lot, :companies, :status, :industry_id,
                            :is_active, :created_at, :updated_at
                        )
                    """), {
                        **data,
                        "companies": json.dumps([]),
                        "created_at": datetime.utcnow(),
                    })
                    flash("Report created.", "success")
                return redirect(url_for('admin.manage_reports'))

            filters = []
            params = {}
            if query_text:
                filters.append("(title LIKE :q OR slug LIKE :q OR excerpt LIKE :q)")
                params["q"] = f"%{query_text}%"
            if industry_filter:
                filters.append("industry_slug = :industry_slug")
                params["industry_slug"] = industry_filter
            if status_filter in {"active", "inactive"}:
                filters.append("is_active = :is_active")
                params["is_active"] = 1 if status_filter == "active" else 0

            where_clause = f"WHERE {' AND '.join(filters)}" if filters else ""
            reports = conn.execute(text(f"""
                SELECT id, title, slug, industry_slug, excerpt, content, table_of_contents, 
                       list_of_figures, list_of_tables, report_review, faqs,
                       geography, coverage, page_count, delivery_format, banner_image, price, is_active, created_at, updated_at
                FROM reports
                {where_clause}
                ORDER BY updated_at DESC, created_at DESC
            """), params).fetchall()
            industry_rows = conn.execute(text("""
                SELECT slug, name
                FROM industry_segments
                WHERE is_active = 1
                ORDER BY display_order ASC, id ASC
            """)).fetchall()
            industry_options = [row._asdict() for row in industry_rows]
            industry_label_map = {row["slug"]: row["name"] for row in industry_options}
            reports_list = [row._asdict() for row in reports]
            for row in reports_list:
                row["report_code"] = _report_code_admin(row, industry_label_map)
            total_reports = len(reports_list)
            active_reports = sum(1 for row in reports_list if int(row.get("is_active") or 0) == 1)
            inactive_reports = total_reports - active_reports

        return render_template(
            'admin/manage_reports.html',
            reports=reports_list,
            industry_options=industry_options,
            industry_label_map=industry_label_map,
            q=query_text,
            selected_industry=industry_filter,
            selected_status=status_filter,
            total_reports=total_reports,
            active_reports=active_reports,
            inactive_reports=inactive_reports
        )
    except Exception as e:
        flash(str(e), "danger")
        return redirect(url_for('admin.dashboard'))


@admin.route('/report/delete/<int:id>', methods=['POST'])
@login_required
def delete_report(id):
    try:
        with db.engine.begin() as conn:
            conn.execute(text("DELETE FROM reports WHERE id=:id"), {"id": id})
        flash("Report deleted.", "success")
    except Exception as e:
        flash(str(e), "danger")
    return redirect(url_for('admin.manage_reports'))


@admin.route('/report/status/<int:id>', methods=['POST'])
@login_required
def report_status(id):
    status = 1 if request.form.get('status') == '1' else 0
    with db.engine.begin() as conn:
        conn.execute(
            text("UPDATE reports SET is_active=:s, status=:status WHERE id=:id"),
            {"s": status, "status": "Published" if status else "Draft", "id": id},
        )
    return jsonify({"success": True})


@admin.route('/manage-jobs', methods=['GET', 'POST'])
@login_required
def manage_jobs():
    ensure_jobs_schema()
    try:
        with db.engine.begin() as conn:
            if request.method == 'POST':
                job_id = request.form.get('id')
                title = (request.form.get('title') or '').strip()
                data = {
                    "title": title,
                    "slug": (request.form.get('slug') or slugify_text(title, "job")).strip(),
                    "department": (request.form.get('department') or '').strip(),
                    "location": (request.form.get('location') or '').strip(),
                    "employment_type": (request.form.get('employment_type') or '').strip(),
                    "description": request.form.get('description'),
                    "responsibilities": (request.form.get('responsibilities')),
                    "requirements": (request.form.get('requirements')),
                    "status": (request.form.get('status') or 'open').strip(),
                    "updated_at": datetime.utcnow(),
                }
                if not data["title"]:
                    flash("Job title is required.", "danger")
                    return redirect(url_for('admin.manage_jobs'))

                if job_id:
                    conn.execute(text("""
                        UPDATE jobs SET
                            title=:title,
                            slug=:slug,
                            department=:department,
                            location=:location,
                            employment_type=:employment_type,
                            description=:description,
                            responsibilities=:responsibilities,
                            requirements=:requirements,
                            status=:status,
                            updated_at=:updated_at
                        WHERE id=:id
                    """), {**data, "id": int(job_id)})
                    flash("Job updated.", "success")
                else:
                    conn.execute(text("""
                        INSERT INTO jobs (
                            title, slug, department, location, employment_type, description, responsibilities, requirements, status, posted_at, updated_at
                        ) VALUES (
                            :title, :slug, :department, :location, :employment_type, :description, :responsibilities, :requirements, :status, :posted_at, :updated_at
                        )
                    """), {**data, "posted_at": datetime.utcnow()})
                    flash("Job created.", "success")
                return redirect(url_for('admin.manage_jobs'))

            jobs = conn.execute(text("""
                SELECT id, title, slug, department, location, employment_type, description, responsibilities, requirements, status, posted_at, updated_at
                FROM jobs
                ORDER BY posted_at DESC
            """)).fetchall()
            applications = conn.execute(text("""
                SELECT a.id, a.job_id, j.title AS job_title, a.applicant_name, a.applicant_email, a.resume_path, a.applied_at
                FROM job_applications a
                LEFT JOIN jobs j ON j.id = a.job_id
                ORDER BY a.applied_at DESC
                LIMIT 200
            """)).fetchall()

        job_rows = []
        for row in jobs:
            job = row._asdict()
            job["responsibilities"] = split_text_items(job.get("responsibilities"))
            job["requirements"] = split_text_items(job.get("requirements"))
            job_rows.append(job)

        return render_template(
            'admin/manage_jobs.html',
            jobs=job_rows,
            applications=[row._asdict() for row in applications]
        )
    except Exception as e:
        flash(str(e), "danger")
        if request.method == 'POST':
            return redirect(url_for('admin.manage_jobs'))
        return render_template('admin/manage_jobs.html', jobs=[], applications=[])


@admin.route('/job/delete/<int:id>', methods=['POST'])
@login_required
def delete_job(id):
    try:
        with db.engine.begin() as conn:
            conn.execute(text("DELETE FROM jobs WHERE id=:id"), {"id": id})
        flash("Job deleted.", "success")
    except Exception as e:
        flash(str(e), "danger")
    return redirect(url_for('admin.manage_jobs'))


@admin.route('/newsletter-subscriber')
@login_required
def newsletter_subscriber():
    ensure_newsletter_schema()

    profile = active_user_profile(session.get('admin_id'))

    try:
        with db.connect() as connection:
            query = text("SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC")
            subscribers = connection.execute(query).fetchall()
            subscriber_rows = [row._asdict() for row in subscribers]

        return render_template('admin/newsletter_subscribers_list.html', subscribers=subscriber_rows, profile=profile)

    except Exception:
        flash('Could not retrieve subscribers. Please try again later.', 'danger')
        return redirect(url_for('admin.dashboard'))


@admin.route('/send-mail-to-newsletter', methods=['GET', 'POST'])
@login_required
def send_mail_to_newsletter():
    ensure_newsletter_schema()

    profile = active_user_profile(session.get('admin_id'))

    with db.engine.begin() as conn:
        if request.method == 'POST':
            subject = (request.form.get('subject') or '').strip()
            content_type = (request.form.get('content_type') or 'html').strip().lower()
            content = request.form.get('description') or ''
            send_limit_raw = (request.form.get('send_limit') or '').strip()

            if not subject or not content:
                flash('Subject and content are required.', 'danger')
                return redirect(url_for('admin.send_mail_to_newsletter'))

            limit_clause = ""
            params = {}
            if send_limit_raw.isdigit():
                limit_clause = " LIMIT :send_limit"
                params["send_limit"] = int(send_limit_raw)

            subscribers = conn.execute(
                text(f"SELECT email FROM newsletter_subscribers WHERE status='subscribed' ORDER BY subscribed_at DESC{limit_clause}"),
                params
            ).fetchall()

            sent_count = 0
            failed_count = 0
            is_html = content_type == "html"
            for sub in subscribers:
                ok, _ = send_email(sub.email, subject, content, html=is_html)
                if ok:
                    sent_count += 1
                else:
                    failed_count += 1

            conn.execute(text("""
                INSERT INTO newsletter_sends (subject, content, content_type, sent_count, failed_count, created_at)
                VALUES (:subject, :content, :content_type, :sent_count, :failed_count, :created_at)
            """), {
                "subject": subject,
                "content": content,
                "content_type": content_type,
                "sent_count": sent_count,
                "failed_count": failed_count,
                "created_at": datetime.utcnow(),
            })
            flash(f"Newsletter processed. Sent: {sent_count}, Failed: {failed_count}", "success")

        history = conn.execute(
            text("SELECT id, subject, content, content_type, sent_count, failed_count, created_at FROM newsletter_sends ORDER BY created_at DESC")
        ).fetchall()

    return render_template(
        'admin/send_mail_to_newsletter.html',
        profile=profile,
        history=[row._asdict() for row in history],
        send_id=None
    )


@admin.route('/report-requests', methods=['GET', 'POST'])
@login_required
def report_requests():
    ensure_report_requests_table()
    profile = active_user_profile(session.get('admin_id'))
    default_statuses = ['new', 'contacted', 'qualified', 'closed']

    query_text = (request.args.get('q') or '').strip()
    status_filter = (request.args.get('status') or '').strip()
    where_clauses = []
    params = {}
    if query_text:
        where_clauses.append("(full_name LIKE :q OR email LIKE :q OR company LIKE :q OR report_slug LIKE :q OR industry_slug LIKE :q)")
        params["q"] = f"%{query_text}%"
    if status_filter:
        where_clauses.append("status=:status")
        params["status"] = status_filter

    where_sql = f"WHERE {' AND '.join(where_clauses)}" if where_clauses else ""
    with db.engine.connect() as conn:
        rows = conn.execute(text(f"""
            SELECT *
            FROM report_requests
            {where_sql}
            ORDER BY created_at DESC
            LIMIT 500
        """), params).fetchall()

    return render_template(
        'admin/report_requests.html',
        profile=profile,
        requests=[row._asdict() for row in rows],
        q=query_text,
        selected_status=status_filter,
    )


# @admin.route('/inquiry-requests', methods=['GET', 'POST'])
# @login_required
# def inquiry_requests():
#     ensure_sales_tables()
#     profile = active_user_profile(session.get('admin_id'))

#     if request.method == 'POST':
#         row_id = request.form.get('id')
#         status = (request.form.get('status') or 'new').strip()
#         if row_id and status in {'new', 'contacted', 'qualified', 'closed'}:
#             with db.engine.begin() as conn:
#                 conn.execute(text("""
#                     UPDATE inquiry_requests
#                     SET status=:status, updated_at=:updated_at
#                     WHERE id=:id
#                 """), {"status": status, "updated_at": datetime.utcnow(), "id": int(row_id)})
#             flash("Inquiry status updated.", "success")
#         return redirect(url_for('admin.inquiry_requests'))

#     q = (request.args.get('q') or '').strip()
#     status_filter = (request.args.get('status') or '').strip()
#     clauses = []
#     params = {}
#     if q:
#         clauses.append("(full_name LIKE :q OR email LIKE :q OR company LIKE :q OR inquiry_type LIKE :q OR report_slug LIKE :q)")
#         params["q"] = f"%{q}%"
#     if status_filter:
#         clauses.append("status=:status")
#         params["status"] = status_filter
#     where_sql = f"WHERE {' AND '.join(clauses)}" if clauses else ""
#     with db.engine.connect() as conn:
#         rows = conn.execute(text(f"""
#             SELECT id, inquiry_type, full_name, email, phone, company, industry_slug, report_slug, source_page, message, status, created_at
#             FROM inquiry_requests
#             {where_sql}
#             ORDER BY created_at DESC
#             LIMIT 600
#         """), params).fetchall()
#     return render_template(
#         'admin/inquiry_requests.html',
#         profile=profile,
#         requests=[row._asdict() for row in rows],
#         q=q,
#         selected_status=status_filter,
#     )


@admin.route('/report-orders', methods=['GET', 'POST'])
@login_required
def report_orders():
    ensure_sales_tables()
    profile = active_user_profile(session.get('admin_id'))

    if request.method == 'POST':
        row_id = request.form.get('id')
        payment_status = (request.form.get('payment_status') or 'pending').strip()
        order_status = (request.form.get('order_status') or 'initiated').strip()
        access_status = (request.form.get('access_status') or 'locked').strip()
        if row_id:
            with db.engine.begin() as conn:
                conn.execute(text("""
                    UPDATE report_orders
                    SET payment_status=:payment_status,
                        order_status=:order_status,
                        access_status=:access_status,
                        updated_at=:updated_at
                    WHERE id=:id
                """), {
                    "id": int(row_id),
                    "payment_status": payment_status,
                    "order_status": order_status,
                    "access_status": access_status,
                    "updated_at": datetime.utcnow(),
                })
            flash("Order updated.", "success")
        return redirect(url_for('admin.report_orders'))

    with db.engine.connect() as conn:
        rows = conn.execute(text("""
            SELECT id, order_ref, user_id,
                   customer_name, customer_email, customer_phone, customer_company, customer_designation,
                   billing_address, gst_number,
                   report_id, report_slug, report_title,
                   amount, base_amount, gateway_charge_percent, gateway_charge_amount, currency,
                   gateway, gateway_order_id, gateway_payment_id, gateway_signature,
                   payment_status, order_status, access_status, delivery_mode, notes, created_at, updated_at
            FROM report_orders
            ORDER BY created_at DESC
            LIMIT 600
        """)).fetchall()
    return render_template(
        'admin/report_orders.html',
        profile=profile,
        orders=[row._asdict() for row in rows],
    )


@admin.route('/testimonial')
@login_required
def testimonial():
    try:
        with db.connect() as connection:
            query = text("SELECT id, client_name, feedback, created_at FROM testimonials ORDER BY created_at DESC")
            testimonials = connection.execute(query).fetchall()

        return render_template('admin/testimonial.html', testimonials=testimonials)

    except Exception:
        flash('Could not retrieve testimonials. Please try again later.', 'danger')
        return redirect(url_for('admin.dashboard'))

@admin.route('/contact-messages')
@login_required
def contact_messages():
    profile = active_user_profile(session.get('admin_id'))
    try:
        with db.connect() as connection:
            # We use UNION ALL to combine the new table and the old table.
            # We alias columns in the old table (e.g., 'name as full_name') 
            # and inject NULLs so both queries have the exact same structure.
            query = text("""
                SELECT 
                    id, 
                    inquiry_type, 
                    full_name, 
                    email, 
                    country_code, 
                    phone, 
                    country,
                    company, 
                    designation, 
                    message,
                    advisory_name, 
                    source_page, 
                    status, 
                    created_at 
                FROM inquiry_requests
                
                UNION ALL
                
                SELECT 
                    id, 
                    inquiry_type, 
                    name AS full_name,  -- Rename 'name' to 'full_name' to match
                    email, 
                    country_code AS country_code, -- Doesn't exist in old table
                    phone, 
                    country AS country,      -- Doesn't exist in old table
                    company, 
                    designation, 
                    message,              -- Or use COALESCE(message, requirement) if needed
                    NULL AS advisory_name,-- Doesn't exist in old table
                    target_slug AS source_page,  -- Doesn't exist in old table
                    status, 
                    created_at 
                FROM queries
                
                ORDER BY created_at DESC -- Sort the combined list by date
            """)
            messages = connection.execute(query).fetchall()

        return render_template('admin/contact_messages.html', messages=messages, profile=profile)

    except Exception as e:
        print(f"Error fetching combined inquiries: {e}") # Crucial for debugging!
        flash('Could not retrieve contact messages. Please try again later.', 'danger')
        return redirect(url_for('admin.dashboard'))


@admin.route('/app-info')
@login_required
def app_info():
    return render_template('admin/app_info.html')


@admin.context_processor
def inject_global_context():
    admin_id = session.get('admin_id')
    company_details = {
        "name": os.getenv("COMPANY_NAME", "Dataamp Services Private Limited"),
        "website": os.getenv("COMPANY_WEBSITE", "https://www.dataamps.com"),
        "phone": os.getenv("COMPANY_PHONE", "9354396784"),
        "email": os.getenv("COMPANY_EMAIL", "info@dataamps.com"),
        "address": os.getenv(
            "COMPANY_ADDRESS",
            "House No 241/248, Nagar Streets, Illhabash Gali No 17, Sector 86, Noida, UP - 201301"
        ),
        "country": "India",
    }


    return {
        "current_year": datetime.utcnow().year,
        "company": company_details
    }
