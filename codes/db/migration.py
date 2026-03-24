from sqlalchemy import text


def migrate(engine):
    statements = [
        """
        CREATE TABLE IF NOT EXISTS admin_users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(191) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            full_name VARCHAR(255),
            role VARCHAR(50),
            profile_image VARCHAR(255),
            is_active TINYINT(1) DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """,
        """
        CREATE TABLE IF NOT EXISTS email_templates (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            template_key VARCHAR(191) NOT NULL UNIQUE,
            subject VARCHAR(255),
            body_html LONGTEXT,
            is_active TINYINT(1) DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """,
        """
        CREATE TABLE IF NOT EXISTS credential_settings (
            `key` VARCHAR(191) PRIMARY KEY,
            `value` TEXT NULL,
            `status` TINYINT(1) DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """,
        """
        CREATE TABLE IF NOT EXISTS payment_gateway_settings (
            `key` VARCHAR(191) PRIMARY KEY,
            `value` TEXT NULL,
            `status` TINYINT(1) DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """,
        """
        CREATE TABLE IF NOT EXISTS blog_categories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            slug VARCHAR(191) NOT NULL UNIQUE,
            is_active TINYINT(1) DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """,
        """
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """,
        """
        CREATE TABLE IF NOT EXISTS team_members (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            slug VARCHAR(191) NOT NULL UNIQUE,
            designation VARCHAR(255),
            department VARCHAR(255),
            profile_image VARCHAR(255),
            bio TEXT,
            email VARCHAR(191),
            linkedin_url VARCHAR(255),
            facebook_url VARCHAR(255),
            instagram_url VARCHAR(255),
            twitter_url VARCHAR(255),
            github_url VARCHAR(255),
            other_url VARCHAR(255),
            display_order INT DEFAULT 0,
            is_active TINYINT(1) DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """,
        """
        CREATE TABLE IF NOT EXISTS services (
            id INT AUTO_INCREMENT PRIMARY KEY,
            service_name VARCHAR(255) NOT NULL,
            slug VARCHAR(191) NOT NULL UNIQUE,
            short_description TEXT,
            description LONGTEXT,
            seo_title VARCHAR(255),
            seo_keywords TEXT,
            seo_description TEXT,
            icon VARCHAR(120),
            starting_price INT DEFAULT 0,
            price_note VARCHAR(255),
            display_order INT DEFAULT 0,
            is_active TINYINT(1) DEFAULT 1,
            is_featured TINYINT(1) DEFAULT 0,
            banner_image VARCHAR(255),
            service_group VARCHAR(255),
            industry_subcategories TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """,
        """
        CREATE TABLE IF NOT EXISTS industry_segments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            slug VARCHAR(191) NOT NULL UNIQUE,
            tagline TEXT,
            display_order INT DEFAULT 0,
            is_active TINYINT(1) DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """,
        """
        CREATE TABLE IF NOT EXISTS advisory_segments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            slug VARCHAR(191) NOT NULL UNIQUE,
            display_order INT DEFAULT 0,
            is_active TINYINT(1) DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """,
        """
        CREATE TABLE IF NOT EXISTS service_families (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            slug VARCHAR(191) NOT NULL UNIQUE,
            display_order INT DEFAULT 0,
            is_active TINYINT(1) DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """,
        """
        CREATE TABLE IF NOT EXISTS faqs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            question VARCHAR(500) NOT NULL,
            answer TEXT,
            display_order INT DEFAULT 0,
            is_active TINYINT(1) DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """,
        """
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """,
        """
        CREATE TABLE IF NOT EXISTS awards (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            category VARCHAR(255),
            image VARCHAR(255),
            display_order INT DEFAULT 0,
            is_active TINYINT(1) DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """,
        """
        CREATE TABLE IF NOT EXISTS newsletter_subscribers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(191) NOT NULL UNIQUE,
            status VARCHAR(20) DEFAULT 'subscribed',
            subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """,
        """
        CREATE TABLE IF NOT EXISTS newsletter_sends (
            id INT AUTO_INCREMENT PRIMARY KEY,
            subject VARCHAR(255),
            content LONGTEXT,
            content_type VARCHAR(20) DEFAULT 'html',
            sent_count INT DEFAULT 0,
            failed_count INT DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """,
        """
        CREATE TABLE IF NOT EXISTS report_requests (
            id INT AUTO_INCREMENT PRIMARY KEY,
            full_name VARCHAR(255) NOT NULL,
            email VARCHAR(191) NOT NULL,
            phone VARCHAR(50),
            company VARCHAR(255),
            industry_slug VARCHAR(191),
            report_slug VARCHAR(191),
            source_page VARCHAR(255),
            message TEXT,
            status VARCHAR(30) DEFAULT 'new',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """,
        """
        CREATE TABLE IF NOT EXISTS inquiry_requests (
            id INT AUTO_INCREMENT PRIMARY KEY,
            inquiry_type VARCHAR(80) NOT NULL,
            full_name VARCHAR(255) NOT NULL,
            email VARCHAR(191) NOT NULL,
            phone VARCHAR(50),
            company VARCHAR(255),
            industry_slug VARCHAR(191),
            report_slug VARCHAR(191),
            source_page VARCHAR(255),
            message TEXT,
            status VARCHAR(30) DEFAULT 'new',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """,
        """
        CREATE TABLE IF NOT EXISTS portal_users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            full_name VARCHAR(255) NOT NULL,
            email VARCHAR(191) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            is_active TINYINT(1) DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """,
        """
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """,
        """
        CREATE TABLE IF NOT EXISTS testimonials (
            id INT AUTO_INCREMENT PRIMARY KEY,
            client_name VARCHAR(255),
            feedback TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """,
        """
        CREATE TABLE IF NOT EXISTS contact_messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            email VARCHAR(191),
            message TEXT,
            received_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """,
        """
        CREATE TABLE IF NOT EXISTS policies (
            id INT AUTO_INCREMENT PRIMARY KEY,
            policy_type VARCHAR(50) NOT NULL,
            title VARCHAR(255),
            content LONGTEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_policies_type (policy_type)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """,
        """
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
        """,
        """
        CREATE TABLE IF NOT EXISTS job_applications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            job_id INT NOT NULL,
            applicant_name VARCHAR(255),
            applicant_email VARCHAR(191),
            resume_path VARCHAR(255),
            cover_letter TEXT,
            applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_job_applications_job
                FOREIGN KEY (job_id) REFERENCES jobs(id)
                ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """,
        """
        CREATE TABLE IF NOT EXISTS reports (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            slug VARCHAR(191) NOT NULL UNIQUE,
            industry_slug VARCHAR(191),
            excerpt TEXT,
            content LONGTEXT,
            table_of_contents LONGTEXT,
            banner_image VARCHAR(255),
            price DECIMAL(10,2) DEFAULT 0.00,
            is_active TINYINT(1) DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """,
        """
        CREATE TABLE IF NOT EXISTS report_access_requests (
            id INT AUTO_INCREMENT PRIMARY KEY,
            report_id INT NOT NULL,
            requester_name VARCHAR(255),
            requester_email VARCHAR(191),
            message TEXT,
            status VARCHAR(20) DEFAULT 'pending',
            requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_access_requests_report
                FOREIGN KEY (report_id) REFERENCES reports(id)
                ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """,
    ]

    with engine.begin() as conn:
        for stmt in statements:
            conn.execute(text(stmt))
