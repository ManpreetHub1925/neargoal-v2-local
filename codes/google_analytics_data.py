
try:
    from google.analytics.data_v1beta import BetaAnalyticsDataClient
    from google.analytics.data_v1beta.types import (
        DateRange, Dimension, Metric, RunReportRequest
    )
    from google.oauth2 import service_account

    PROPERTY_ID = "519326912"

    credentials = service_account.Credentials.from_service_account_file(
        "codes/ga_service_account.json"
    )

    client = BetaAnalyticsDataClient(credentials=credentials)
except (ImportError, TypeError, Exception) as e:
    print(f"Warning: Google Analytics Data API could not be initialized: {e}")
    client = None


def get_impressions_clicks(days=30):
    if not client:
        return {
            "labels": [],
            "impressions": [],
            "clicks": []
        }
        
    request = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        date_ranges=[DateRange(start_date=f"{days}daysAgo", end_date="today")],
        dimensions=[Dimension(name="date")],
        metrics=[
            Metric(name="screenPageViews"),
            Metric(name="eventCount")
        ]
    )

    response = client.run_report(request)

    labels, impressions, clicks = [], [], []

    for row in response.rows:
        labels.append(row.dimension_values[0].value)
        impressions.append(int(row.metric_values[0].value))
        clicks.append(int(row.metric_values[1].value))

    return {
        "labels": labels,
        "impressions": impressions,
        "clicks": clicks
    }


