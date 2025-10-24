package emails

import (
	"strconv"
	"strings"
	"time"
)

func GenerateAwaitingVerificationEmail(userName, dashboardLink string) string {
	body := `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to JobTracker+! Awaiting Verification</title>
 <link href="https://fonts.googleapis.com/css2?family=Saira:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;font-family:'Saira', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color:#f9fafb; color:#111827; line-height:1.6;">
  <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="640" style="margin:auto;border-collapse:collapse;background-color:#ffffff;border-radius:12px;overflow:hidden;">
    <tbody>
      <tr>
		<td align="center" style="background-color:#ffffff; padding:24px; border-bottom: 2px solid #313131ff;">
			<span style="color:#111827; font-size:1.25rem; font-weight:500; white-space:nowrap;">
			JOBTRACKER <span style="color:#00FF37;">+</span>
			</span>
		</td>
	  </tr>

      <tr>
        <td style="padding:32px 24px 16px 24px;background-color:#ffffff;text-align:left;">
          <p style="font-size:18px;font-weight:600;color:#111827;margin:0 0 16px 0;">Hi {{UserName}},</p>
          <p style="font-size:15px;margin:0 0 16px 0;color:#374151;">
            Thanks for joining <strong>JobTracker+</strong>! We’re excited to have you onboard.
          </p>
          <p style="font-size:15px;margin:0 0 16px 0;color:#374151;">
            Your profile is currently <strong>awaiting verification</strong>. To get started, please log in to your dashboard and complete any required steps to help us verify your trade details.
          </p>
          <p style="font-size:15px;margin:0 0 16px 0;color:#374151;">
            Once verified, you’ll start receiving job leads in your area.
          </p>
          <p style="text-align:center;margin-top:24px;">
            <a href="{{DashboardLink}}" target="_blank"
               style="display:inline-block;background-color:#16a34a;color:#ffffff;text-decoration:none;
                      padding:14px 28px;font-size:16px;font-weight:600;border-radius:8px;">
               Go to Dashboard
            </a>
          </p>
          <p style="font-size:15px;margin-top:32px;color:#374151;">
            Thanks for joining our community of trusted tradespeople,<br/>
            <strong>The JobTracker+ Team</strong>
          </p>
        </td>
      </tr>

      <tr>
        <td style="background-color:#f3f4f6;text-align:center;padding:20px;font-size:13px;color:#6b7280;">
          © {{Year}} JobTracker+. All rights reserved.<br/>
          <a href="https://jobtrackerplus.com" target="_blank" style="color:#16a34a;text-decoration:none;">jobtrackerplus.com</a>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>
`

	body = strings.ReplaceAll(body, "{{UserName}}", userName)
	body = strings.ReplaceAll(body, "{{DashboardLink}}", dashboardLink)
	body = strings.ReplaceAll(body, "{{Year}}", strconv.Itoa(time.Now().Year()))

	return body
}
