package emails

import (
	"strconv"
	"strings"
	"time"
)

// GenerateJobHiredEmail creates a personalized HTML email
// for users who have successfully hired a tradesperson on JobTracker+.
func GenerateJobHiredEmail(firstName, tradespersonName, jobTitle, location, dashboardLink string) string {
	body := `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You’ve Successfully Hired for Your Job - JobTracker+ </title>
 <link href="https://fonts.googleapis.com/css2?family=Saira:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;font-family:'Saira', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color:#f9fafb; color:#111827; line-height:1.6;">
  <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="640" style="margin:auto;border-collapse:collapse;background-color:#ffffff;border-radius:12px;overflow:hidden;">
    <tbody>
      <!-- Header -->
      <tr>
		<td align="center" style="background-color:#ffffff; padding:24px; border-bottom: 2px solid #313131ff;">
			<span style="color:#111827; font-size:1.25rem; font-weight:500; white-space:nowrap;">
			JOBTRACKER <span style="color:#00FF37;">+</span>
			</span>
		</td>
	  </tr>

      <!-- Main Content -->
      <tr>
        <td style="padding:32px 24px 16px 24px;background-color:#ffffff;text-align:left;">
          <p style="font-size:18px;font-weight:600;color:#111827;margin:0 0 16px 0;">Hi {{FirstName}},</p>

          <p style="font-size:15px;margin:0 0 16px 0;color:#374151;">
            Congratulations you’ve successfully hired <strong>{{TradespersonName}}</strong> for your job!
          </p>

          <p style="font-size:15px;margin:0 0 8px 0;color:#374151;">
            <strong>Job:</strong> {{JobTitle}}<br/>
            <strong>Location:</strong> {{Location}}
          </p>

          <p style="font-size:15px;margin:16px 0;color:#374151;">
            You can now contact your tradesperson directly to arrange details and start the work.
          </p>

          <p style="text-align:center;margin-top:24px;">
            <a href="{{DashboardLink}}" target="_blank"
               style="display:inline-block;background-color:#16a34a;color:#ffffff;text-decoration:none;
                      padding:14px 28px;font-size:16px;font-weight:600;border-radius:8px;">
               View Job & Contact Details
            </a>
          </p>

          <p style="font-size:15px;margin-top:24px;color:#374151;">
            Once the work is complete, don’t forget to leave a review — it helps other homeowners find great tradespeople too.
          </p>

          <p style="font-size:15px;margin-top:32px;color:#374151;">
            Thanks for choosing <strong>JobTracker+ </strong>,<br/>
            The JobTracker+  Team
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background-color:#f3f4f6;text-align:center;padding:20px;font-size:13px;color:#6b7280;">
          © {{Year}} JobTracker+ . All rights reserved.<br/>
          <a href="https://jobtrackerplus.com" target="_blank" style="color:#16a34a;text-decoration:none;">jobtrackerplus.com</a>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>
`

	body = strings.ReplaceAll(body, "{{FirstName}}", firstName)
	body = strings.ReplaceAll(body, "{{TradespersonName}}", tradespersonName)
	body = strings.ReplaceAll(body, "{{JobTitle}}", jobTitle)
	body = strings.ReplaceAll(body, "{{Location}}", location)
	body = strings.ReplaceAll(body, "{{DashboardLink}}", dashboardLink)
	body = strings.ReplaceAll(body, "{{Year}}", strconv.Itoa(time.Now().Year()))

	return body
}
