import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()




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


def test_smtp_connection():
    host = os.getenv('MAIL_HOST')
    port = int(os.getenv('MAIL_PORT'))
    username = os.getenv('MAIL_USERNAME')
    password = os.getenv('MAIL_PASSWORD')
    encryption = (os.getenv('MAIL_ENCRYPTION') or '').lower()

    try:
        if encryption == 'ssl' or port == 465:
            server = smtplib.SMTP_SSL(host, port, timeout=10)
        else:
            server = smtplib.SMTP(host, port, timeout=10)
            if encryption == 'tls':
                server.starttls()

        server.login(username, password)
        server.quit()
        return True, "SMTP connection successful"

    except Exception as e:
        return False, str(e)


if __name__ == "__main__":
    ok, msg = test_smtp_connection()
    print("SMTP TEST:", ok, msg)

    if ok:
        sent, result = send_email(
            to_email="info@dataamps.com",
            subject="SMTP Test Email",
            body="<h3>SMTP is working 🎉</h3><p>This is a test email.</p>",
            html=True
        )
        print("SEND RESULT:", sent, result)
