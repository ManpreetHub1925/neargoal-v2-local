from __future__ import annotations

import os
import sys
import time
from datetime import datetime
from pathlib import Path
from urllib.parse import quote_plus

from dotenv import load_dotenv
from flask import (
    Flask,
    flash,
    redirect,
    render_template,
    request,
    url_for,
)
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import or_
from werkzeug.utils import secure_filename

from models import (
    Blog,
    Career,
    CaseStudy,
    FAQ,
    Industry,
    JobApplication,
    MarketUpdate,
    NewsletterSubscriber,
    Query,
    Report,
    Service,
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
            seed_database()
        except SQLAlchemyError as exc:
            raise RuntimeError(
                "Unable to connect to MySQL using the current .env values. Check DATABASE_URL or MYSQL_* settings."
            ) from exc

    register_context_processors(app)
    register_routes(app)
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
        services = Service.query.order_by(Service.sort_order.asc()).all()
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
    query = Query(
        name=request.form.get("name", "").strip() or request.form.get("full_name", "").strip(),
        email=request.form.get("email", "").strip(),
        company=request.form.get("company", "").strip() or None,
        phone=request.form.get("phone", "").strip() or None,
        designation=request.form.get("designation", "").strip() or None,
        message=request.form.get("message", "").strip() or request.form.get("requirement", "").strip() or None,
        requirement=request.form.get("requirement", "").strip() or request.form.get("message", "").strip() or None,
        inquiry_type=inquiry_type,
        target_type=target_type,
        target_slug=target_slug,
        status="New",
    )
    db.session.add(query)
    db.session.commit()


def redirect_back(default_endpoint: str = "home", **values: object):
    target = request.form.get("redirect_to") or request.referrer
    if target:
        return redirect(target)
    return redirect(url_for(default_endpoint, **values))


def register_routes(app: Flask) -> None:
    @app.get("/")
    def home():
        industries = Industry.query.order_by(Industry.sort_order.asc()).all()
        services = Service.query.order_by(Service.sort_order.asc()).all()
        latest_reports = Report.query.order_by(Report.id.asc()).limit(8).all()
        return render_template(
            "home.html",
            title="Neargoal Consulting",
            industries=industries,
            services=services,
            latest_reports=latest_reports,
            breadcrumbs=[],
        )

    @app.route("/market-intelligence", methods=["GET"])
    def market_intelligence():
        search = request.args.get("search", "").strip()
        industry_slug = request.args.get("industry", "").strip()
        geography = request.args.get("geography", "").strip()

        report_query = Report.query.join(Industry)
        if industry_slug:
            report_query = report_query.filter(Industry.slug == industry_slug)
        if geography:
            report_query = report_query.filter(Report.geography == geography)
        if search:
            like = f"%{search}%"
            report_query = report_query.filter(
                or_(Report.title.ilike(like), Report.summary.ilike(like), Report.code.ilike(like))
            )

        reports = report_query.order_by(Report.id.asc()).all()
        industries = Industry.query.order_by(Industry.sort_order.asc()).all()
        geographies = ["North America", "South America", "Europe", "APAC", "MEA"]

        return render_template(
            "market_intelligence.html",
            title="Market Intelligence Reports",
            reports=reports,
            industries=industries,
            geographies=geographies,
            selected_industry=industry_slug,
            selected_geography=geography,
            search=search,
            breadcrumbs=create_breadcrumbs(("Market Intelligence", None)),
        )

    @app.get("/market-intelligence/<industry_slug>")
    def industry_detail(industry_slug: str):
        industry = Industry.query.filter_by(slug=industry_slug).first_or_404()
        reports = (
            Report.query.filter_by(industry_id=industry.id)
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

    @app.get("/market-intelligence/<industry_slug>/<int:report_id>")
    def report_detail(industry_slug: str, report_id: int):
        report = Report.query.get_or_404(report_id)
        if report.industry.slug != industry_slug:
            return redirect(
                url_for(
                    "report_detail",
                    industry_slug=report.industry.slug,
                    report_id=report.id,
                )
            )

        related_reports = (
            Report.query.filter(
                Report.industry_id == report.industry_id,
                Report.id != report.id,
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

    @app.get("/consulting")
    def consulting():
        services = Service.query.order_by(Service.sort_order.asc()).all()
        return render_template(
            "consulting_list.html",
            title="Consulting & Advisory Services",
            services=services,
            breadcrumbs=create_breadcrumbs(("Consulting & Advisory", None)),
        )

    @app.get("/consulting/<slug>")
    def consulting_detail(slug: str):
        service = Service.query.filter_by(slug=slug).first_or_404()
        other_services = Service.query.filter(Service.slug != slug).order_by(Service.sort_order.asc()).all()
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
        return render_template(
            "about.html",
            title="About Neargoal Consulting",
            core_values=CORE_VALUES,
            team_members=TEAM_MEMBERS,
            breadcrumbs=create_breadcrumbs(("About Us", None)),
        )

    @app.get("/careers")
    def careers():
        jobs = Career.query.order_by(Career.sort_order.asc()).all()
        return render_template(
            "careers.html",
            title="Careers at Neargoal",
            jobs=jobs,
            breadcrumbs=create_breadcrumbs(("Careers", None)),
        )

    @app.get("/jobs/<slug>")
    def career_detail(slug: str):
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
        career = Career.query.filter_by(slug=slug).first_or_404()
        resume = request.files.get("resume")
        filename = None

        if resume and resume.filename:
            timestamp = int(time.time())
            filename = f"{career.slug}-{timestamp}-{secure_filename(resume.filename)}"
            resume.save(UPLOAD_DIR / filename)

        application = JobApplication(
            career_id=career.id,
            full_name=request.form.get("full_name", "").strip(),
            email=request.form.get("email", "").strip(),
            phone=request.form.get("phone", "").strip() or None,
            cover_letter=request.form.get("cover_letter", "").strip() or None,
            resume_filename=filename,
            status="New",
        )
        db.session.add(application)
        db.session.commit()

        flash("Application submitted successfully.", "success")
        return redirect(url_for("career_detail", slug=slug))

    @app.get("/insights")
    def insights():
        blogs = Blog.query.order_by(Blog.id.asc()).all()
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
        updates_query = MarketUpdate.query
        title = "Market Updates"
        if category_slug:
            category_title = category_slug.replace("-", " ").title()
            updates_query = updates_query.filter(MarketUpdate.category.ilike(category_title))
            title = category_title

        updates = updates_query.order_by(MarketUpdate.id.asc()).all()
        return render_template(
            "market_updates.html",
            title=title,
            updates=updates,
            category_slug=category_slug,
            breadcrumbs=create_breadcrumbs(("Market Updates", None)),
        )

    @app.get("/updates/<slug>")
    def update_detail(slug: str):
        update = MarketUpdate.query.filter_by(slug=slug).first_or_404()
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
        faqs = FAQ.query.order_by(FAQ.sort_order.asc()).all()
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

    @app.post("/inquiry")
    def submit_inquiry():
        inquiry_type = request.form.get("inquiry_type", "general").strip() or "general"
        target_type = request.form.get("target_type", "").strip() or None
        target_slug = request.form.get("target_slug", "").strip() or None
        save_query(inquiry_type, target_type=target_type, target_slug=target_slug)
        flash("Request submitted successfully.", "success")
        return redirect_back()

    @app.post("/newsletter")
    def newsletter():
        email = request.form.get("email", "").strip()
        if not email:
            flash("Please enter an email address.", "error")
            return redirect_back()

        existing = NewsletterSubscriber.query.filter_by(email=email).first()
        if existing:
            flash("This email is already subscribed.", "info")
            return redirect_back()

        subscriber = NewsletterSubscriber(email=email)
        db.session.add(subscriber)
        db.session.commit()
        flash("Subscribed successfully.", "success")
        return redirect_back()

try:
    app = create_app()
except RuntimeError as exc:
    app = create_error_app(str(exc))
    if __name__ == "__main__":
        print(str(exc), file=sys.stderr)
        raise SystemExit(1)


if __name__ == "__main__":
    app.run(debug=True)
