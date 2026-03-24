from __future__ import annotations

import os
import sys
import time
from datetime import datetime
from pathlib import Path
from urllib.parse import quote_plus
from typing import List, Dict, Any

from dotenv import load_dotenv
from flask import (
    Flask,
    flash,
    redirect,
    render_template,
    request,
    send_from_directory,
    url_for,
    jsonify,
)
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import or_
from werkzeug.utils import secure_filename

from admin_bridge import (
    bootstrap_admin_console,
    get_home_hero,
    get_job,
    get_jobs,
    get_landing_page,
    get_nav_pages,
    get_team_members,
    sync_job_application_record,
    sync_newsletter_subscriber,
    sync_public_query,
)
from models import (
    Blog,
    Career,
    CaseStudy,
    FAQ,
    Industry,
    Job,
    JobApplication,
    LandingPage,
    MarketUpdate,
    NewsletterSubscriber,
    Query,
    Report,
    ReportOrder,
    Service,
    TeamMember,
    db,
)
from seed_data import CORE_VALUES, LEGAL_CONTENT, TEAM_MEMBERS, seed_database


BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads" / "resumes"

INDUSTRY_ICON_NAMES = {
    "energy-power-infrastructure": "zap",
    "chemicals-materials": "beaker",
    "automotive-mobility": "car",
    "digital-tech-ai": "cpu",
    "consumer-goods": "shopping-bag",
    "healthcare": "heart",
    "defense-aerospace": "plane",
}

SERVICE_ICON_NAMES = {
    "custom-research": "file-search",
    "competitive-intelligence": "target",
    "decision-support": "compass",
    "industry-tracking": "refresh-cw",
    "investment-due-diligence": "briefcase",
}

load_dotenv()


DEFAULT_HOME_HERO = {
    "title": "Neargoal Consulting",
    "hero_title": "Research That Brings You Closer to Your Business Goals",
    "hero_subtitle": "Neargoal Consulting delivers deep, analyst-driven market research and strategic intelligence across high-impact global industries.",
    "content": "Neargoal Consulting delivers deep, analyst-driven market research and strategic intelligence across high-impact global industries.",
    "cta_text": "Contact Us",
    "cta_url": "/contact",
    "banner_svg": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
}


def slugify(value: str) -> str:
    cleaned = []
    last_dash = False

    for char in value.lower():
        if char.isalnum():
            cleaned.append(char)
            last_dash = False
            continue
        if not last_dash:
            cleaned.append("-")
            last_dash = True

    return "".join(cleaned).strip("-")


def abbreviation(value: str) -> str:
    words = [part for part in value.replace("&", " ").replace(",", " ").split() if part]
    return "".join(word[0] for word in words[:3]).upper()


def industry_icon_name(slug: str) -> str:
    return INDUSTRY_ICON_NAMES.get(slug, "circle")


def service_icon_name(slug: str) -> str:
    return SERVICE_ICON_NAMES.get(slug, "briefcase")


def database_config_error() -> str:
    env_path = BASE_DIR / ".env"
    if not env_path.exists():
        return "Missing .env file. Copy .env.example to .env and set DATABASE_URL or MYSQL_* values."
    return "Missing MySQL configuration. Set DATABASE_URL or MYSQL_* values in .env."


def build_database_url() -> str:
    explicit_url = os.getenv("DATABASE_URL")
    if explicit_url:
        return explicit_url

    host = os.getenv("MYSQL_HOST")
    port = os.getenv("MYSQL_PORT")
    user = os.getenv("MYSQL_USER")
    password = os.getenv("MYSQL_PASSWORD")
    database = os.getenv("MYSQL_DATABASE")

    if not all([host, port, user, database]):
        raise RuntimeError(database_config_error())

    user = quote_plus(user)
    password = quote_plus(password or "")
    credentials = f"{user}:{password}" if password else user
    return f"mysql+pymysql://{credentials}@{host}:{port}/{database}?charset=utf8mb4"


def create_app() -> Flask:
    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "change-me")
    app.config["SQLALCHEMY_DATABASE_URI"] = build_database_url()
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["UPLOAD_FOLDER"] = str(UPLOAD_DIR)
    app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024

    db.init_app(app)
    app.jinja_env.filters["slugify"] = slugify
    app.jinja_env.filters["abbreviation"] = abbreviation
    app.jinja_env.filters["industry_icon_name"] = industry_icon_name
    app.jinja_env.filters["service_icon_name"] = service_icon_name

    with app.app_context():
        try:
            UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
            db.create_all()
            bootstrap_admin_console(TEAM_MEMBERS, DEFAULT_HOME_HERO, LEGAL_CONTENT)
            seed_database()
            bootstrap_admin_console(TEAM_MEMBERS, DEFAULT_HOME_HERO, LEGAL_CONTENT)
        except SQLAlchemyError as exc:
            raise RuntimeError(
                "Unable to connect to MySQL using the current .env values. Check DATABASE_URL or MYSQL_* settings."
            ) from exc

    register_context_processors(app)
    register_routes(app)
    from codes.admin import admin as admin_blueprint

    app.register_blueprint(admin_blueprint)
    return app


def create_error_app(message: str) -> Flask:
    app = Flask(__name__)

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def startup_error(path: str = ""):
        return message, 500

    return app


def register_context_processors(app: Flask) -> None:
    @app.context_processor
    def inject_layout_data() -> dict[str, object]:
        industries = Industry.query.order_by(Industry.sort_order.asc()).all()
        services = (
            Service.query.filter(or_(Service.is_active.is_(None), Service.is_active.is_(True)))
            .order_by(Service.sort_order.asc(), Service.display_order.asc(), Service.id.asc())
            .all()
        )
        update_categories = [
            {
                "name": "Corporate Developments",
                "slug": slugify("Corporate Developments"),
                "href": url_for("market_updates", category_slug=slugify("Corporate Developments")),
            },
            {
                "name": "Press Releases",
                "slug": slugify("Press Releases"),
                "href": url_for("market_updates", category_slug=slugify("Press Releases")),
            },
        ]
        return {
            "nav_industries": industries,
            "nav_services": services,
            "nav_pages": get_nav_pages(),
            "nav_update_categories": update_categories,
            "current_year": datetime.now().year,
        }


def create_breadcrumbs(*items: tuple[str, str | None]) -> list[dict[str, object]]:
    crumbs = [{"label": "Home", "href": url_for("home"), "current": False}]
    for label, href in items:
        crumbs.append({"label": label, "href": href, "current": False})
    if crumbs:
        crumbs[-1]["current"] = True
    return crumbs


def save_query(
    inquiry_type: str,
    *,
    target_type: str | None = None,
    target_slug: str | None = None,
) -> None:
    name = request.form.get("name", "").strip() or request.form.get("full_name", "").strip()
    email = request.form.get("email", "").strip()
    company = request.form.get("company", "").strip() or None
    phone = request.form.get("phone", "").strip() or None
    designation = request.form.get("designation", "").strip() or None
    country = request.form.get("country", "").strip() or None
    industry_slug = request.form.get("industry_slug", "").strip() or None
    report_id = request.form.get("report_id", "").strip() or None
    message = request.form.get("message", "").strip() or request.form.get("requirement", "").strip() or None
    requirement = request.form.get("requirement", "").strip() or request.form.get("message", "").strip() or None
    query = Query(
        name=name,
        email=email,
        company=company,
        phone=phone,
        designation=designation,
        message=message,
        requirement=requirement,
        inquiry_type=inquiry_type,
        target_type=target_type,
        target_slug=target_slug,
        status="New",
    )
    db.session.add(query)
    db.session.commit()
    sync_public_query(
        inquiry_type=inquiry_type,
        name=name,
        email=email,
        phone=phone,
        company=company,
        designation=designation,
        country=country,
        industry_slug=industry_slug,
        report_id=report_id,
        message=message or requirement,
        target_type=target_type,
        target_slug=target_slug,
        source_page=request.path,
    )


def redirect_back(default_endpoint: str = "home", **values: object):
    target = request.form.get("redirect_to") or request.referrer
    if target:
        return redirect(target)
    return redirect(url_for(default_endpoint, **values))


def register_routes(app: Flask) -> None:
    @app.route("/", methods=["GET"])
    def home():
        industries = Industry.query.order_by(Industry.sort_order.asc()).all()
        services = (
            Service.query.filter(or_(Service.is_active.is_(None), Service.is_active.is_(True)))
            .order_by(Service.sort_order.asc(), Service.display_order.asc(), Service.id.asc())
            .all()
        )
        latest_reports = (
            Report.query.filter(or_(Report.is_active.is_(None), Report.is_active.is_(True)))
            .order_by(Report.id.desc())
            .limit(8)
            .all()
        )
        return render_template(
            "home.html",
            title="Neargoal Consulting",
            hero_slide=get_home_hero(),
            industries=industries,
            services=services,
            latest_reports=latest_reports,
            breadcrumbs=[],
        )

    @app.route("/market-intelligence", methods=["GET"])
    def market_intelligence():
        search = request.args.get("search", "").strip()
        industry_slugs = request.args.getlist("industry")
        geographies = request.args.getlist("geography")

        report_query = Report.query.join(Industry).filter(or_(Report.is_active.is_(None), Report.is_active.is_(True)))
        if industry_slugs:
            report_query = report_query.filter(Industry.slug.in_(industry_slugs))
        if geographies:
            report_query = report_query.filter(Report.geography.in_(geographies))
        if search:
            like = f"%{search}%"
            report_query = report_query.filter(
                or_(Report.title.ilike(like), Report.summary.ilike(like), Report.code.ilike(like))
            )

        reports = report_query.order_by(Report.id.asc()).all()
        industries = Industry.query.order_by(Industry.sort_order.asc()).all()
        # Dynamic geographies from DB
        unique_geographies = sorted(set(
            r.geography for r in Report.query.filter(
                or_(Report.is_active.is_(None), Report.is_active.is_(True))
            ).all()
        ) or ["Global"])

        return render_template(
            "market_intelligence.html",
            title="Market Intelligence Reports",
            reports=reports,
            industries=industries,
            geographies=unique_geographies,
            selected_industries=industry_slugs,
            selected_geographies=geographies,
            search=search,
            breadcrumbs=create_breadcrumbs(("Market Intelligence", None)),
        )

    @app.get("/market-intelligence/<industry_slug>")
    def industry_detail(industry_slug: str):
        industry = Industry.query.filter_by(slug=industry_slug).first_or_404()
        reports = (
            Report.query.filter(
                Report.industry_id == industry.id,
                or_(Report.is_active.is_(None), Report.is_active.is_(True)),
            )
            .order_by(Report.id.asc())
            .all()
        )
        return render_template(
            "industry_detail.html",
            title=industry.name,
            industry=industry,
            reports=reports,
            breadcrumbs=create_breadcrumbs(
                ("Market Intelligence", url_for("market_intelligence")),
                (industry.name, None),
            ),
        )

    @app.get("/market-intelligence/<industry_slug>/<report_slug>")
    def report_detail(industry_slug: str, report_slug: str):
        # Try finding by slug first
        report = Report.query.filter_by(slug=report_slug).first()
        
        # If not found, try finding by id if report_slug is numeric
        if not report and report_slug.isdigit():
            report = Report.query.get(int(report_slug))

        if not report:
            return "Report not found", 404

        if report.industry.slug != industry_slug:
            return redirect(
                url_for(
                    "report_detail",
                    industry_slug=report.industry.slug,
                    report_slug=report.slug or report.id,
                )
            )

        related_reports = (
            Report.query.filter(
                Report.industry_id == report.industry_id,
                Report.id != report.id,
                or_(Report.is_active.is_(None), Report.is_active.is_(True)),
            )
            .order_by(Report.id.asc())
            .limit(3)
            .all()
        )
        return render_template(
            "report_detail.html",
            title=report.title,
            report=report,
            related_reports=related_reports,
            breadcrumbs=create_breadcrumbs(
                ("Market Intelligence", url_for("market_intelligence")),
                (report.industry.name, url_for("industry_detail", industry_slug=industry_slug)),
                (report.title, None),
            ),
        )

    @app.get("/reports/<slug>")
    def report_detail_by_slug(slug: str):
        report = Report.query.filter_by(slug=slug).first_or_404()
        return redirect(
            url_for(
                "report_detail",
                industry_slug=report.industry.slug,
                report_slug=report.slug or report.id,
            )
        )

    @app.get("/consulting")
    def consulting():
        services = (
            Service.query.filter(or_(Service.is_active.is_(None), Service.is_active.is_(True)))
            .order_by(Service.sort_order.asc(), Service.display_order.asc(), Service.id.asc())
            .all()
        )
        return render_template(
            "consulting_list.html",
            title="Consulting & Advisory Services",
            services=services,
            breadcrumbs=create_breadcrumbs(("Consulting & Advisory", None)),
        )

    @app.get("/consulting/<slug>")
    def consulting_detail(slug: str):
        service = Service.query.filter_by(slug=slug).first_or_404()
        other_services = (
            Service.query.filter(
                Service.slug != slug,
                or_(Service.is_active.is_(None), Service.is_active.is_(True)),
            )
            .order_by(Service.sort_order.asc(), Service.display_order.asc(), Service.id.asc())
            .all()
        )
        return render_template(
            "consulting_detail.html",
            title=service.name,
            service=service,
            other_services=other_services,
            breadcrumbs=create_breadcrumbs(
                ("Consulting & Advisory", url_for("consulting")),
                (service.name, None),
            ),
        )

    @app.route("/contact", methods=["GET", "POST"])
    def contact():
        if request.method == "POST":
            save_query("contact", target_type="page", target_slug="contact")
            flash("Message sent successfully.", "success")
            return redirect(url_for("contact"))

        return render_template(
            "contact.html",
            title="Contact Us",
            breadcrumbs=create_breadcrumbs(("Contact Us", None)),
        )

    @app.get("/about")
    def about():
        team_members = get_team_members() or TEAM_MEMBERS
        return render_template(
            "about.html",
            title="About Neargoal Consulting",
            core_values=CORE_VALUES,
            team_members=team_members,
            breadcrumbs=create_breadcrumbs(("About Us", None)),
        )

    @app.get("/careers")
    def careers():
        jobs = get_jobs()
        if not jobs:
            jobs = Career.query.order_by(Career.sort_order.asc()).all()
        return render_template(
            "careers.html",
            title="Careers at Neargoal",
            jobs=jobs,
            breadcrumbs=create_breadcrumbs(("Careers", None)),
        )

    @app.get("/jobs/<slug>")
    def career_detail(slug: str):
        career = get_job(slug)
        if career is None:
            career = Career.query.filter_by(slug=slug).first_or_404()
        return render_template(
            "career_detail.html",
            title=career.title,
            career=career,
            breadcrumbs=create_breadcrumbs(
                ("Careers", url_for("careers")),
                (career.title, None),
            ),
        )

    @app.post("/jobs/<slug>/apply")
    def apply_for_job(slug: str):
        admin_job = get_job(slug)
        legacy_career = None if admin_job else Career.query.filter_by(slug=slug).first_or_404()
        resume = request.files.get("resume")
        filename = None

        if resume and resume.filename:
            timestamp = int(time.time())
            base_slug = admin_job.slug if admin_job else legacy_career.slug
            filename = f"{base_slug}-{timestamp}-{secure_filename(resume.filename)}"
            resume.save(UPLOAD_DIR / filename)

        sync_job_application_record(
            job_id=admin_job.id if admin_job else None,
            career_id=legacy_career.id if legacy_career else None,
            full_name=request.form.get("full_name", "").strip(),
            email=request.form.get("email", "").strip(),
            phone=request.form.get("phone", "").strip() or None,
            cover_letter=request.form.get("cover_letter", "").strip() or None,
            resume_filename=filename,
        )

        flash("Application submitted successfully.", "success")
        return redirect(url_for("career_detail", slug=slug))

    @app.get("/pages/<slug>")
    def landing_page(slug: str):
        page = get_landing_page(slug)
        if page is None:
            return redirect(url_for("home")) if slug == "home" else ("Page not found", 404)
        return render_template(
            "landing_page.html",
            title=page.title,
            page=page,
            breadcrumbs=create_breadcrumbs((page.title, None)),
        )

    @app.get("/uploads/resumes/<path:filename>")
    def resume_download(filename: str):
        return send_from_directory(UPLOAD_DIR, filename, as_attachment=False)

    @app.get("/insights")
    def insights():
        blogs = (
            Blog.query.filter(or_(Blog.status.is_(None), Blog.status == "published"))
            .order_by(Blog.published_at.desc(), Blog.id.desc())
            .all()
        )
        case_studies = CaseStudy.query.order_by(CaseStudy.id.asc()).all()
        updates = MarketUpdate.query.order_by(MarketUpdate.id.asc()).all()
        return render_template(
            "insights.html",
            title="Insights & News",
            blogs=blogs,
            case_studies=case_studies,
            updates=updates,
            breadcrumbs=create_breadcrumbs(("Insights & News", None)),
        )

    @app.get("/insights/blogs/<slug>")
    def blog_detail(slug: str):
        blog = Blog.query.filter_by(slug=slug).first_or_404()
        return render_template(
            "blog_detail.html",
            title=blog.title,
            blog=blog,
            breadcrumbs=create_breadcrumbs(
                ("Insights & News", url_for("insights")),
                ("Expert Blogs", f"{url_for('insights')}#blogs"),
                (blog.title, None),
            ),
        )

    @app.get("/insights/case-studies/<slug>")
    def case_study_detail(slug: str):
        case_study = CaseStudy.query.filter_by(slug=slug).first_or_404()
        return render_template(
            "case_study_detail.html",
            title=case_study.title,
            case_study=case_study,
            breadcrumbs=create_breadcrumbs(
                ("Insights & News", url_for("insights")),
                ("Case Studies", f"{url_for('insights')}#case-studies"),
                (case_study.title, None),
            ),
        )

    @app.get("/market-updates")
    @app.get("/market-updates/<category_slug>")
    def market_updates(category_slug: str | None = None):
        updates_query = Blog.query
        title = "Market Updates"
        if category_slug:
            category_title = category_slug.replace("-", " ").title()
            updates_query = updates_query.filter(Blog.category.ilike(category_title))
            title = category_title

        updates = updates_query.order_by(Blog.id.asc()).all()
        return render_template(
            "market_updates.html",
            title=title,
            updates=updates,
            category_slug=category_slug,
            breadcrumbs=create_breadcrumbs(("Market Updates", None)),
        )

    @app.get("/updates/<slug>")
    def update_detail(slug: str):
        update = Blog.query.filter_by(slug=slug).first_or_404()
        return render_template(
            "update_detail.html",
            title=update.title,
            update=update,
            breadcrumbs=create_breadcrumbs(
                ("Market Updates", url_for("market_updates")),
                (update.title, None),
            ),
        )

    @app.get("/faq")
    def faq():
        faqs = (
            FAQ.query.filter(or_(FAQ.is_active.is_(None), FAQ.is_active.is_(True)))
            .order_by(FAQ.sort_order.asc(), FAQ.display_order.asc(), FAQ.id.asc())
            .all()
        )
        return render_template(
            "faq.html",
            title="Frequently Asked Questions",
            faqs=faqs,
            breadcrumbs=create_breadcrumbs(("FAQ", None)),
        )

    @app.get("/privacy-policy")
    @app.get("/terms")
    def legal():
        slug = request.path.strip("/")
        content = LEGAL_CONTENT[slug]
        label = "Privacy Policy" if slug == "privacy-policy" else "Terms & Conditions"
        return render_template(
            "legal.html",
            title=content["title"],
            legal=content,
            breadcrumbs=create_breadcrumbs((label, None)),
        )


    @app.post("/checkout")
    def checkout():
        # 1. Extract info from form
        name = request.form.get("name", "").strip()
        email = request.form.get("email", "").strip()
        company = request.form.get("company", "").strip()
        designation = request.form.get("designation", "").strip()
        country = request.form.get("country", "").strip()
        country_code = request.form.get("country_code", "").strip()
        phone = request.form.get("phone", "").strip()
        billing_address = request.form.get("billing_address", "").strip()
        gst_number = request.form.get("gst_number", "").strip()
        report_db_id = request.form.get("target_slug", "").strip()
        report_title = request.form.get("report_title", "").strip()
        industry_slug = request.form.get("industry_slug", "").strip()
        report_code = request.form.get("report_id", "").strip()

        # 2. Get report for amount and real slug
        report = Report.query.get(report_db_id)
        amount = report.price if report else 0.00
        real_report_slug = report.slug

        # 3. Create unique order reference
        order_ref = f"NG-ORD-{int(time.time())}"

        try:
            # 4. Save to database
            order = ReportOrder(
                order_ref=order_ref,
                user_id=0, # Assuming guest for now, can be updated later with auth
                customer_name=name,
                customer_email=email,
                customer_phone=f"{country_code} {phone}",
                customer_company=company,
                customer_designation=designation,
                billing_address=billing_address,
                gst_number=gst_number,
                report_id=report_code,
                report_slug=real_report_slug,
                report_title=report_title,
                amount=amount,
                base_amount=amount,
                currency="USD",
                payment_status="pending",
                order_status="initiated",
                access_status="locked",
                delivery_mode="email",
                notes=f"Order initiated for {report_title} from {country}"
            )
            db.session.add(order)
            db.session.commit()

            # For now, flash success and redirect back. 
            # In a real payment gateway integration, we'd redirect to the gateway here.
            flash(f"Order {order_ref} initiated successfully. Right now payment gateway is under process, our team will call you soon.", "success")
            
        except Exception as e:
            db.session.rollback()
            print(f"Error creating order: {e}")
            flash("There was an error creating your order. Please try again.", "error")

        return redirect_back()

    @app.post("/inquiry")
    def submit_inquiry():
        # 1. Extract ALL required fields from the form
        inquiry_type = request.form.get("inquiry_type", "general").strip() or "general"
        
        # Required string fields (default to empty string if missing to avoid crashes)
        name = request.form.get("name", "").strip()
        email = request.form.get("email", "").strip()
        
        # Optional fields (convert empty strings to None for clean database insertion)
        country_code = request.form.get("country_code", "").strip() or None
        phone = request.form.get("phone", "").strip() or None
        company = request.form.get("company", "").strip() or None
        designation = request.form.get("designation", "").strip() or None
        country = request.form.get("country", "").strip() or None
        
        industry_slug = request.form.get("industry_slug", "").strip() or None
        report_id = request.form.get("report_id", "").strip() or None
        message = request.form.get("message", "").strip() or None
        target_type = request.form.get("target_type", "").strip() or None
        target_slug = request.form.get("target_slug", "").strip() or None
        source_page = request.form.get("redirect_to", "").strip() or None
        advisory_name = request.form.get("advisory_name", "").strip() or None

        try:
            # 2. Call your robust DB function and pass ALL the extracted data
            sync_public_query(
                inquiry_type=inquiry_type,
                name=name,
                email=email,
                country_code=country_code,
                phone=phone,
                company=company,
                designation=designation,
                country=country,
                industry_slug=industry_slug,
                report_id=report_id,
                message=message,
                target_type=target_type,
                target_slug=target_slug,
                source_page=source_page,
                advisory_name=advisory_name,
            )
            flash("Request submitted successfully.", "success")
            
        except Exception as e:
            # If something goes wrong in the DB, it won't crash the server silently
            print(f"Error saving inquiry to DB: {e}")
            flash("There was an error submitting your request. Please try again.", "error")

        # 3. Redirect the user back to where they came from
        return redirect_back()

    @app.post("/newsletter")
    def newsletter():
        email = request.form.get("email", "").strip()
        if not email:
            flash("Please enter an email address.", "error")
            return redirect_back()

        existing = NewsletterSubscriber.query.filter_by(email=email).first()
        if existing:
            sync_newsletter_subscriber(email)
            flash("This email is already subscribed.", "info")
            return redirect_back()

        subscriber = NewsletterSubscriber(email=email)
        db.session.add(subscriber)
        db.session.commit()
        sync_newsletter_subscriber(email)
        flash("Subscribed successfully.", "success")
        return redirect_back()


    @app.route('/api/search')
    def api_search():
        q = request.args.get('q', '').strip()
        if len(q) < 2:
            return jsonify([])

        like = f"%{q}%"
        results = []

        # Priority 1: Reports
        reports = Report.query.filter(
            Report.is_active == True,
            or_(
                Report.title.ilike(like),
                Report.summary.ilike(like),
                Report.excerpt.ilike(like)
            )
        ).order_by(
            Report.title.ilike(f"{q}%").desc(),
            Report.id.desc()
        ).limit(5).all()
        for r in reports:
            results.append({
                'id': r.id,
                'title': r.title,
                'type': 'Report',
                'url': url_for('report_detail', industry_slug=r.industry.slug, report_slug=r.slug or r.id),
                'snippet': (r.summary or r.excerpt or '')[:120].strip() + '...' if (r.summary or r.excerpt) else '',
                'badge': r.industry.name if r.industry else ''
            })

        # Priority 2: Blogs (Articles)
        blogs = Blog.query.filter(
            or_(Blog.status.is_(None), Blog.status == 'published'),
            or_(
                Blog.title.ilike(like),
                Blog.summary.ilike(like)
            )
        ).order_by(
            Blog.title.ilike(f"{q}%").desc(),
            Blog.published_at.desc()
        ).limit(3).all()
        for b in blogs:
            results.append({
                'id': f'blog-{b.id}',
                'title': b.title,
                'type': 'Article',
                'url': url_for('blog_detail', slug=b.slug),
                'snippet': (b.summary or '')[:120].strip() + '...',
                'badge': b.category if b.category else ''
            })

        # Priority 3: Market Updates (Press Releases)
        updates = MarketUpdate.query.filter(
            or_(
                MarketUpdate.title.ilike(like),
                MarketUpdate.summary.ilike(like)
            )
        ).order_by(
            MarketUpdate.title.ilike(f"{q}%").desc(),
            MarketUpdate.id.desc()
        ).limit(3).all()
        for u in updates:
            results.append({
                'id': f'update-{u.id}',
                'title': u.title,
                'type': 'Press Release',
                'url': url_for('update_detail', slug=u.slug),
                'snippet': (u.summary or '')[:120].strip() + '...',
                'badge': u.category
            })

        return jsonify(results[:10])


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5001, host='127.0.0.1')
