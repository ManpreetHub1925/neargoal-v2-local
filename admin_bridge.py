from __future__ import annotations

import json
import os
import re
from datetime import datetime
from types import SimpleNamespace

from flask import url_for
from sqlalchemy import inspect, text
from werkzeug.security import generate_password_hash

from models import db


def slugify_text(value: str | None, fallback: str = "item") -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", (value or "").strip().lower())
    slug = re.sub(r"-{2,}", "-", slug).strip("-")
    return slug or fallback


def strip_html(value: object) -> str:
    text_value = re.sub(r"<[^>]+>", " ", str(value or ""))
    return re.sub(r"\s+", " ", text_value).strip()


def split_text_items(value: object) -> list[str]:
    def normalize_item(item: object) -> str:
        plain = strip_html(item)
        return re.sub(r"\s+", " ", plain).strip("- ").strip()

    if value is None:
        return []
    if isinstance(value, (list, tuple, set)):
        return [cleaned for item in value if (cleaned := normalize_item(item))]

    raw = str(value).strip()
    if not raw:
        return []

    try:
        parsed = json.loads(raw)
    except Exception:
        parsed = None

    if isinstance(parsed, list):
        return [cleaned for item in parsed if (cleaned := normalize_item(item))]

    cleaned = (
        re.sub(r"</?(ul|ol)[^>]*>", "\n", raw, flags=re.IGNORECASE)
        .replace("•", "\n")
        .replace("·", "\n")
        .replace(";", "\n")
        .replace("<br>", "\n")
        .replace("<br/>", "\n")
        .replace("<br />", "\n")
    )
    cleaned = re.sub(r"<li[^>]*>", "\n", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"</li>", "\n", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"<p[^>]*>", "\n", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"</p>", "\n", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"<div[^>]*>", "\n", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"</div>", "\n", cleaned, flags=re.IGNORECASE)
    plain = re.sub(r"<[^>]+>", " ", cleaned)
    items = []
    for part in re.split(r"[\r\n]+", plain):
        normalized = re.sub(r"\s+", " ", part).strip("- ").strip()
        if normalized:
            items.append(normalized)
    return items


def summary_from_html(value: object, max_length: int = 240) -> str:
    plain = strip_html(value)
    if len(plain) <= max_length:
        return plain
    return plain[: max_length - 3].rstrip() + "..."


def benefits_json(short_description: object, description: object) -> str:
    items = split_text_items(short_description) + split_text_items(description)
    if not items:
        source = strip_html(description or short_description)
        items = [
            sentence.strip()
            for sentence in re.split(r"(?<=[.!?])\s+", source)
            if sentence.strip()
        ]

    unique_items: list[str] = []
    for item in items:
        if item not in unique_items:
            unique_items.append(item)

    selected = unique_items[:4]
    if not selected:
        selected = [
            "Analyst-led strategic support",
            "Decision-ready market insights",
            "Custom research scope",
            "Fast turnaround on critical questions",
        ]
    return json.dumps(selected)


def tags_json(value: object) -> str:
    if isinstance(value, list):
        return json.dumps([str(item).strip() for item in value if str(item).strip()])

    raw = str(value or "").strip()
    if not raw:
        return json.dumps([])
    parts = [part.strip() for part in raw.split(",") if part.strip()]
    return json.dumps(parts)


def html_list_json(value: object) -> str:
    return json.dumps(split_text_items(value))


def resolve_media_url(value: str | None) -> str | None:
    if not value:
        return None
    if value.startswith(("http://", "https://", "//", "data:")):
        return value
    cleaned = value.lstrip("/").removeprefix("static/")
    return url_for("static", filename=cleaned)


def _table_columns(table_name: str) -> dict[str, dict[str, object]]:
    inspector = inspect(db.engine)
    if not inspector.has_table(table_name):
        return {}
    return {column["name"]: column for column in inspector.get_columns(table_name)}


def _add_column_if_missing(conn, table_name: str, column_name: str, ddl: str) -> None:
    if column_name not in _table_columns(table_name):
        conn.execute(text(f"ALTER TABLE {table_name} ADD COLUMN {ddl}"))


def _ensure_shared_compatibility() -> None:
    with db.engine.begin() as conn:
        shared_columns = {
            "services": {
                "service_name": "service_name VARCHAR(255) NULL",
                "short_description": "short_description TEXT NULL",
                "icon": "icon VARCHAR(120) NULL",
                "banner_image": "banner_image VARCHAR(255) NULL",
                "display_order": "display_order INT DEFAULT 0",
                "is_active": "is_active TINYINT(1) DEFAULT 1",
                "is_featured": "is_featured TINYINT(1) DEFAULT 0",
                "service_group": "service_group VARCHAR(255) NULL",
                "industry_subcategories": "industry_subcategories TEXT NULL",
                "seo_title": "seo_title VARCHAR(255) NULL",
                "seo_keywords": "seo_keywords TEXT NULL",
                "seo_description": "seo_description TEXT NULL",
                "starting_price": "starting_price INT DEFAULT 0",
                "price_note": "price_note VARCHAR(255) NULL",
                "created_at": "created_at DATETIME DEFAULT CURRENT_TIMESTAMP",
                "updated_at": "updated_at DATETIME NULL",
            },
            "reports": {
                "slug": "slug VARCHAR(191) NULL",
                "industry_slug": "industry_slug VARCHAR(191) NULL",
                "excerpt": "excerpt TEXT NULL",
                "content": "content LONGTEXT NULL",
                "table_of_contents": "table_of_contents LONGTEXT NULL",
                "page_count": "page_count INT NULL",
                "delivery_format": "delivery_format VARCHAR(100) NULL",
                "banner_image": "banner_image VARCHAR(255) NULL",
                "is_active": "is_active TINYINT(1) DEFAULT 1",
                "created_at": "created_at DATETIME DEFAULT CURRENT_TIMESTAMP",
                "updated_at": "updated_at DATETIME NULL",
            },
            "blogs": {
                "category_id": "category_id INT NULL",
                "short_description": "short_description TEXT NULL",
                "featured_image": "featured_image VARCHAR(255) NULL",
                "seo_title": "seo_title VARCHAR(255) NULL",
                "seo_description": "seo_description TEXT NULL",
                "seo_keywords": "seo_keywords TEXT NULL",
                "author_name": "author_name VARCHAR(255) NULL",
                "status": "status VARCHAR(20) DEFAULT 'draft'",
                "published_at": "published_at DATETIME NULL",
                "is_popular": "is_popular TINYINT(1) DEFAULT 0",
                "show_homepage": "show_homepage TINYINT(1) DEFAULT 0",
                "created_at": "created_at DATETIME DEFAULT CURRENT_TIMESTAMP",
                "updated_at": "updated_at DATETIME NULL",
            },
            "faqs": {
                "display_order": "display_order INT DEFAULT 0",
                "is_active": "is_active TINYINT(1) DEFAULT 1",
                "created_at": "created_at DATETIME DEFAULT CURRENT_TIMESTAMP",
                "updated_at": "updated_at DATETIME NULL",
            },
            "newsletter_subscribers": {
                "status": "status VARCHAR(20) DEFAULT 'subscribed'",
                "subscribed_at": "subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP",
            },
            "job_applications": {
                "job_id": "job_id INT NULL",
                "applicant_name": "applicant_name VARCHAR(255) NULL",
                "applicant_email": "applicant_email VARCHAR(191) NULL",
                "resume_path": "resume_path VARCHAR(255) NULL",
                "applied_at": "applied_at DATETIME DEFAULT CURRENT_TIMESTAMP",
            },
            "jobs": {
                "slug": "slug VARCHAR(191) NULL",
                "department": "department VARCHAR(255) NULL",
                "responsibilities": "responsibilities LONGTEXT NULL",
                "created_at": "created_at DATETIME DEFAULT CURRENT_TIMESTAMP",
            },
        }

        for table_name, columns in shared_columns.items():
            if not _table_columns(table_name):
                continue
            for column_name, ddl in columns.items():
                _add_column_if_missing(conn, table_name, column_name, ddl)

        job_application_columns = _table_columns("job_applications")
        if job_application_columns:
            if not job_application_columns["career_id"].get("nullable", True):
                conn.execute(text("ALTER TABLE job_applications MODIFY COLUMN career_id INT NULL"))
            if not job_application_columns["full_name"].get("nullable", True):
                conn.execute(text("ALTER TABLE job_applications MODIFY COLUMN full_name VARCHAR(255) NULL"))
            if not job_application_columns["email"].get("nullable", True):
                conn.execute(text("ALTER TABLE job_applications MODIFY COLUMN email VARCHAR(255) NULL"))


def _unique_slug(conn, table_name: str, source: str, row_id: int | None = None) -> str:
    base_slug = slugify_text(source)
    candidate = base_slug
    suffix = 2
    while True:
        existing = conn.execute(
            text(f"SELECT id FROM {table_name} WHERE slug=:slug LIMIT 1"),
            {"slug": candidate},
        ).fetchone()
        if not existing or (row_id and int(existing.id) == int(row_id)):
            return candidate
        candidate = f"{base_slug}-{suffix}"
        suffix += 1


def _seed_team_members(conn, default_team_members: list[dict[str, str]]) -> None:
    count = conn.execute(text("SELECT COUNT(*) AS count_value FROM team_members")).scalar() or 0
    if count:
        return

    for index, member in enumerate(default_team_members, start=1):
        name = member.get("name") or f"Team Member {index}"
        conn.execute(
            text(
                """
                INSERT INTO team_members (
                    name, slug, designation, department, profile_image, bio,
                    display_order, is_active, created_at, updated_at
                ) VALUES (
                    :name, :slug, :designation, :department, :profile_image, :bio,
                    :display_order, 1, :created_at, :updated_at
                )
                """
            ),
            {
                "name": name,
                "slug": _unique_slug(conn, "team_members", name),
                "designation": member.get("role"),
                "department": "Leadership",
                "profile_image": member.get("image"),
                "bio": member.get("bio"),
                "display_order": index,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
            },
        )


def _seed_landing_pages(conn, default_home_hero: dict[str, str]) -> None:
    count = conn.execute(
        text("SELECT COUNT(*) AS count_value FROM landing_pages WHERE slug='home' OR slug LIKE 'home-%'")
    ).scalar() or 0
    if count:
        return

    conn.execute(
        text(
            """
            INSERT INTO landing_pages (
                title, slug, hero_title, hero_subtitle, content, cta_text, cta_url,
                banner_svg, seo_title, seo_description, seo_keywords,
                show_in_menu, is_active, created_at, updated_at
            ) VALUES (
                :title, 'home', :hero_title, :hero_subtitle, :content, :cta_text, :cta_url,
                :banner_svg, :seo_title, :seo_description, :seo_keywords,
                0, 1, :created_at, :updated_at
            )
            """
        ),
        {
            "title": default_home_hero["title"],
            "hero_title": default_home_hero["hero_title"],
            "hero_subtitle": default_home_hero["hero_subtitle"],
            "content": default_home_hero["content"],
            "cta_text": default_home_hero["cta_text"],
            "cta_url": default_home_hero["cta_url"],
            "banner_svg": default_home_hero["banner_svg"],
            "seo_title": default_home_hero["title"],
            "seo_description": default_home_hero["hero_subtitle"],
            "seo_keywords": "market research, consulting, intelligence",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        },
    )


def _seed_jobs_from_careers(conn) -> None:
    jobs_count = conn.execute(text("SELECT COUNT(*) AS count_value FROM jobs")).scalar() or 0
    if jobs_count:
        return

    careers = conn.execute(
        text(
            """
            SELECT id, title, slug, location, job_type, department, description, responsibilities, requirements
            FROM careers
            ORDER BY sort_order ASC, id ASC
            """
        )
    ).mappings().all()

    for row in careers:
        conn.execute(
            text(
                """
                INSERT INTO jobs (
                    title, slug, department, location, employment_type,
                    description, responsibilities, requirements, status, posted_at, updated_at, created_at
                ) VALUES (
                    :title, :slug, :department, :location, :employment_type,
                    :description, :responsibilities, :requirements, 'open', :posted_at, :updated_at, :created_at
                )
                """
            ),
            {
                "title": row["title"],
                "slug": row["slug"] or _unique_slug(conn, "jobs", row["title"]),
                "department": row["department"],
                "location": row["location"],
                "employment_type": row["job_type"],
                "description": row["description"],
                "responsibilities": json.dumps(row["responsibilities"] or []),
                "requirements": json.dumps(row["requirements"] or []),
                "posted_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "created_at": datetime.utcnow(),
            },
        )


def _seed_industry_segments(conn) -> None:
    count = conn.execute(text("SELECT COUNT(*) AS count_value FROM industry_segments")).scalar() or 0
    if count:
        return

    rows = conn.execute(
        text(
            """
            SELECT name, slug, description, sort_order
            FROM industries
            ORDER BY sort_order ASC, id ASC
            """
        )
    ).mappings().all()

    for row in rows:
        conn.execute(
            text(
                """
                INSERT INTO industry_segments (
                    name, slug, tagline, display_order, is_active, created_at, updated_at
                ) VALUES (
                    :name, :slug, :tagline, :display_order, 1, :created_at, :updated_at
                )
                """
            ),
            {
                "name": row["name"],
                "slug": row["slug"],
                "tagline": summary_from_html(row["description"], max_length=160),
                "display_order": row["sort_order"] or 0,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
            },
        )


def _seed_blog_categories(conn) -> None:
    categories = conn.execute(
        text("SELECT DISTINCT category FROM blogs WHERE category IS NOT NULL AND category <> ''")
    ).fetchall()

    for row in categories:
        slug = slugify_text(row.category)
        existing = conn.execute(
            text("SELECT id FROM blog_categories WHERE slug=:slug LIMIT 1"),
            {"slug": slug},
        ).fetchone()
        if not existing:
            conn.execute(
                text(
                    """
                    INSERT INTO blog_categories (name, slug, is_active, created_at)
                    VALUES (:name, :slug, 1, :created_at)
                    """
                ),
                {"name": row.category, "slug": slug, "created_at": datetime.utcnow()},
            )

    mapping = {
        row.slug: row.id
        for row in conn.execute(text("SELECT id, slug FROM blog_categories")).fetchall()
    }
    blog_rows = conn.execute(
        text("SELECT id, category FROM blogs WHERE category_id IS NULL OR category_id = 0")
    ).fetchall()

    for row in blog_rows:
        category_slug = slugify_text(row.category)
        category_id = mapping.get(category_slug)
        if category_id:
            conn.execute(
                text("UPDATE blogs SET category_id=:category_id WHERE id=:id"),
                {"category_id": category_id, "id": row.id},
            )


def _backfill_services(conn) -> None:
    conn.execute(
        text(
            """
            UPDATE services
            SET service_name = COALESCE(NULLIF(service_name, ''), name),
                short_description = COALESCE(NULLIF(short_description, ''), description),
                banner_image = COALESCE(NULLIF(banner_image, ''), image),
                display_order = COALESCE(display_order, sort_order),
                is_active = COALESCE(is_active, 1),
                created_at = COALESCE(created_at, NOW()),
                updated_at = COALESCE(updated_at, NOW())
            """
        )
    )


def _backfill_reports(conn) -> None:
    rows = conn.execute(
        text(
            """
            SELECT r.id, r.title, r.industry_id, r.summary, r.description, r.toc, r.pages, r.status, i.slug AS industry_slug_value
            FROM reports r
            LEFT JOIN industries i ON i.id = r.industry_id
            ORDER BY r.id ASC
            """
        )
    ).mappings().all()

    for row in rows:
        slug_value = _unique_slug(conn, "reports", row["title"], row["id"])
        toc_json = row["toc"] or []
        if not isinstance(toc_json, list):
            try:
                toc_json = json.loads(toc_json)
            except Exception:
                toc_json = []
        conn.execute(
            text(
                """
                UPDATE reports
                SET slug = COALESCE(NULLIF(slug, ''), :slug),
                    industry_slug = COALESCE(NULLIF(industry_slug, ''), :industry_slug),
                    excerpt = COALESCE(NULLIF(excerpt, ''), :excerpt),
                    content = COALESCE(NULLIF(content, ''), description),
                    table_of_contents = COALESCE(NULLIF(table_of_contents, ''), :table_of_contents),
                    page_count = COALESCE(page_count, pages),
                    delivery_format = COALESCE(NULLIF(delivery_format, ''), 'PDF'),
                    is_active = COALESCE(is_active, :is_active),
                    created_at = COALESCE(created_at, NOW()),
                    updated_at = COALESCE(updated_at, NOW())
                WHERE id = :id
                """
            ),
            {
                "id": row["id"],
                "slug": slug_value,
                "industry_slug": row["industry_slug_value"],
                "excerpt": row["summary"],
                "table_of_contents": "<br>".join(toc_json),
                "is_active": 1 if str(row["status"]).lower() in {"published", "active"} else 0,
            },
        )


def _backfill_blogs(conn) -> None:
    conn.execute(
        text(
            """
            UPDATE blogs
            SET short_description = COALESCE(NULLIF(short_description, ''), summary),
                featured_image = COALESCE(NULLIF(featured_image, ''), image),
                author_name = COALESCE(NULLIF(author_name, ''), author),
                status = COALESCE(NULLIF(status, ''), 'published'),
                show_homepage = COALESCE(show_homepage, 0),
                is_popular = COALESCE(is_popular, 0),
                created_at = COALESCE(created_at, NOW()),
                updated_at = COALESCE(updated_at, NOW())
            """
        )
    )


def _backfill_faqs(conn) -> None:
    conn.execute(
        text(
            """
            UPDATE faqs
            SET display_order = COALESCE(display_order, sort_order),
                is_active = COALESCE(is_active, 1),
                created_at = COALESCE(created_at, NOW()),
                updated_at = COALESCE(updated_at, NOW())
            """
        )
    )


def _backfill_newsletter(conn) -> None:
    conn.execute(
        text(
            """
            UPDATE newsletter_subscribers
            SET status = COALESCE(NULLIF(status, ''), 'subscribed'),
                subscribed_at = COALESCE(subscribed_at, created_at, NOW())
            """
        )
    )


def _backfill_jobs(conn) -> None:
    rows = conn.execute(text("SELECT id, title, slug FROM jobs ORDER BY id ASC")).fetchall()
    for row in rows:
        if not row.slug:
            conn.execute(
                text("UPDATE jobs SET slug=:slug WHERE id=:id"),
                {"slug": _unique_slug(conn, "jobs", row.title, row.id), "id": row.id},
            )


def _seed_policies(conn, legal_content: dict[str, dict[str, str]]) -> None:
    existing = conn.execute(text("SELECT COUNT(*) AS count_value FROM policies")).scalar() or 0
    if existing:
        return
    for slug, content in legal_content.items():
        conn.execute(
            text(
                """
                INSERT INTO policies (policy_type, title, content, created_at, updated_at)
                VALUES (:policy_type, :title, :content, :created_at, :updated_at)
                """
            ),
            {
                "policy_type": slug,
                "title": content.get("title"),
                "content": content.get("content"),
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
            },
        )


def _seed_admin_user(conn) -> None:
    count = conn.execute(text("SELECT COUNT(*) AS count_value FROM admin_users")).scalar() or 0
    if count:
        return

    email = os.getenv("ADMIN_EMAIL", "admin@neargoal.com")
    password = os.getenv("ADMIN_PASSWORD", "Admin@123")
    full_name = os.getenv("ADMIN_NAME", "Administrator")

    conn.execute(
        text(
            """
            INSERT INTO admin_users (
                email, password_hash, full_name, role, is_active, created_at, updated_at
            ) VALUES (
                :email, :password_hash, :full_name, 'super-admin', 1, :created_at, :updated_at
            )
            """
        ),
        {
            "email": email,
            "password_hash": generate_password_hash(password),
            "full_name": full_name,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        },
    )


def bootstrap_admin_console(
    default_team_members: list[dict[str, str]],
    default_home_hero: dict[str, str],
    legal_content: dict[str, dict[str, str]],
) -> None:
    from codes.db.migration import migrate

    migrate(db.engine)
    _ensure_shared_compatibility()

    with db.engine.begin() as conn:
        _seed_admin_user(conn)
        _seed_industry_segments(conn)
        _seed_team_members(conn, default_team_members)
        _seed_landing_pages(conn, default_home_hero)
        _seed_jobs_from_careers(conn)
        _seed_blog_categories(conn)
        _backfill_services(conn)
        _backfill_reports(conn)
        _backfill_blogs(conn)
        _backfill_faqs(conn)
        _backfill_newsletter(conn)
        _backfill_jobs(conn)
        _seed_policies(conn, legal_content)


def get_home_hero() -> SimpleNamespace | None:
    row = db.session.execute(
        text(
            """
            SELECT title, slug, hero_title, hero_subtitle, content, cta_text, cta_url, banner_svg
            FROM landing_pages
            WHERE is_active = 1 AND (slug='home' OR slug LIKE 'home-%')
            ORDER BY CASE WHEN slug='home' THEN 0 ELSE 1 END, updated_at DESC, created_at DESC
            LIMIT 1
            """
        )
    ).mappings().first()
    if not row:
        return None
    return SimpleNamespace(
        title=row["title"],
        slug=row["slug"],
        hero_title=row["hero_title"],
        hero_subtitle=row["hero_subtitle"],
        content=row["content"],
        cta_text=row["cta_text"],
        cta_url=row["cta_url"],
        banner_url=resolve_media_url(row["banner_svg"]),
    )


def get_nav_pages() -> list[SimpleNamespace]:
    rows = db.session.execute(
        text(
            """
            SELECT title, slug
            FROM landing_pages
            WHERE is_active = 1 AND show_in_menu = 1 AND slug <> 'home' AND slug NOT LIKE 'home-%'
            ORDER BY updated_at DESC, created_at DESC
            """
        )
    ).mappings().all()
    return [SimpleNamespace(title=row["title"], slug=row["slug"]) for row in rows]


def get_team_members() -> list[SimpleNamespace]:
    rows = db.session.execute(
        text(
            """
            SELECT name, designation, bio, profile_image, linkedin_url, twitter_url, display_order
            FROM team_members
            WHERE is_active = 1
            ORDER BY display_order ASC, created_at DESC
            """
        )
    ).mappings().all()
    members = []
    for row in rows:
        members.append(
            SimpleNamespace(
                name=row["name"],
                role=row["designation"] or "Neargoal Consultant",
                bio=row["bio"],
                image=resolve_media_url(row["profile_image"]),
                linkedin_url=row["linkedin_url"],
                twitter_url=row["twitter_url"],
            )
        )
    return members


def _job_namespace(row: dict[str, object]) -> SimpleNamespace:
    return SimpleNamespace(
        id=row["id"],
        title=row["title"],
        slug=row["slug"],
        location=row["location"] or "Remote",
        job_type=row["employment_type"] or "Full time",
        department=row["department"] or "Neargoal Consulting",
        description=row["description"] or "",
        responsibilities=split_text_items(row["responsibilities"]),
        requirements=split_text_items(row["requirements"]),
    )


def get_jobs() -> list[SimpleNamespace]:
    rows = db.session.execute(
        text(
            """
            SELECT id, title, slug, department, location, employment_type, description, responsibilities, requirements
            FROM jobs
            WHERE LOWER(COALESCE(status, 'open')) IN ('open', 'active', 'published')
            ORDER BY posted_at DESC, updated_at DESC, id DESC
            """
        )
    ).mappings().all()
    return [_job_namespace(row) for row in rows]


def get_job(slug: str) -> SimpleNamespace | None:
    row = db.session.execute(
        text(
            """
            SELECT id, title, slug, department, location, employment_type, description, responsibilities, requirements
            FROM jobs
            WHERE slug = :slug AND LOWER(COALESCE(status, 'open')) IN ('open', 'active', 'published')
            LIMIT 1
            """
        ),
        {"slug": slug},
    ).mappings().first()
    if not row:
        return None
    return _job_namespace(row)


def get_landing_page(slug: str) -> SimpleNamespace | None:
    row = db.session.execute(
        text(
            """
            SELECT title, slug, hero_title, hero_subtitle, content, cta_text, cta_url, banner_svg
            FROM landing_pages
            WHERE slug = :slug AND is_active = 1
            LIMIT 1
            """
        ),
        {"slug": slug},
    ).mappings().first()
    if not row:
        return None
    return SimpleNamespace(
        title=row["title"],
        slug=row["slug"],
        hero_title=row["hero_title"],
        hero_subtitle=row["hero_subtitle"],
        content=row["content"],
        cta_text=row["cta_text"],
        cta_url=row["cta_url"],
        banner_url=resolve_media_url(row["banner_svg"]),
    )


def sync_newsletter_subscriber(email: str) -> None:
    with db.engine.begin() as conn:
        conn.execute(
            text(
                """
                INSERT INTO newsletter_subscribers (email, status, subscribed_at, created_at)
                VALUES (:email, 'subscribed', :subscribed_at, :created_at)
                ON DUPLICATE KEY UPDATE
                    status = 'subscribed',
                    subscribed_at = COALESCE(subscribed_at, VALUES(subscribed_at))
                """
            ),
            {
                "email": email,
                "subscribed_at": datetime.utcnow(),
                "created_at": datetime.utcnow(),
            },
        )


def resolve_report_slug(target_slug: str | None) -> str | None:
    if not target_slug:
        return None
    cleaned = target_slug.strip()
    if not cleaned.isdigit():
        return cleaned

    row = db.session.execute(
        text("SELECT slug FROM reports WHERE id = :id LIMIT 1"),
        {"id": int(cleaned)},
    ).fetchone()
    return row.slug if row else cleaned



def sync_public_query(
    *,
    inquiry_type: str,
    name: str,
    email: str,
    country_code: str | None = None,
    phone: str | None,
    company: str | None,
    designation: str | None = None,
    country: str | None = None,
    industry_slug: str | None = None,
    report_id: str | None = None,
    message: str | None = None,
    target_type: str | None = None,
    target_slug: str | None = None,
    source_page: str | None = None,
    advisory_name: str | None = None,
) -> None:
    normalized_target_type = "report" if inquiry_type in {"report-sample", "report-analyst"} else target_type
    report_lookup_value = target_slug
    if not report_lookup_value and report_id and str(report_id).isdigit():
        report_lookup_value = str(report_id)
    report_slug = resolve_report_slug(report_lookup_value) if normalized_target_type == "report" and report_lookup_value else None
    
    payload = {
        "full_name": name,
        "email": email,
        "country_code": country_code,
        "phone": phone,
        "company": company,
        "designation": designation,
        "country": country,
        "industry_slug": industry_slug,
        "report_id": report_id,
        "report_slug": report_slug,
        "source_page": source_page,
        "message": message,
        "status": "new",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "inquiry_type": inquiry_type,
        "advisory_name": advisory_name,
        "target_type": target_type,
    }

    with db.engine.begin() as conn:

        if normalized_target_type == "report" and inquiry_type in {"report-sample", "report-analyst"}:
            conn.execute(
                text(
                    """
                    INSERT INTO report_requests (
                        full_name, email, country_code, phone, company, designation, country, target_type, industry_slug, report_id, report_slug, source_page,
                        message, status, created_at, updated_at
                    ) VALUES (
                        :full_name, :email, :country_code, :phone, :company, :designation, :country, :target_type, :industry_slug, :report_id, :report_slug, :source_page,
                        :message, :status, :created_at, :updated_at
                    )
                    """
                ),
                payload,
            )
            return

        # Default for other inquiry requests
        conn.execute(
            text(
                """
                INSERT INTO inquiry_requests (
                    inquiry_type, full_name, email, country_code, phone, company, designation, country, industry_slug, report_slug,
                    advisory_name, source_page, message, status, created_at, updated_at
                ) VALUES (
                    :inquiry_type, :full_name, :email, :country_code, :phone, :company, :designation, :country, :industry_slug, :report_slug,
                    :advisory_name, :source_page, :message, :status, :created_at, :updated_at
                )
                """
            ),
            payload,
        )

def sync_job_application_record(
    *,
    job_id: int | None,
    career_id: int | None,
    full_name: str,
    email: str,
    phone: str | None,
    cover_letter: str | None,
    resume_filename: str | None,
) -> None:
    with db.engine.begin() as conn:
        conn.execute(
            text(
                """
                INSERT INTO job_applications (
                    career_id, job_id, full_name, applicant_name, email, applicant_email,
                    phone, cover_letter, resume_filename, resume_path, status, created_at, applied_at
                ) VALUES (
                    :career_id, :job_id, :full_name, :applicant_name, :email, :applicant_email,
                    :phone, :cover_letter, :resume_filename, :resume_path, :status, :created_at, :applied_at
                )
                """
            ),
            {
                "career_id": career_id,
                "job_id": job_id,
                "full_name": full_name,
                "applicant_name": full_name,
                "email": email,
                "applicant_email": email,
                "phone": phone,
                "cover_letter": cover_letter,
                "resume_filename": resume_filename,
                "resume_path": resume_filename,
                "status": "New",
                "created_at": datetime.utcnow(),
                "applied_at": datetime.utcnow(),
            },
        )
