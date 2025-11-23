import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email,
      name,
      businessName,
      loginUrl,
      sandboxApiKey,
      productionApiKey,
      documentationUrl,
      apiKeysUrl,
    } = body;

    // In production, integrate with your email service (SendGrid, AWS SES, etc.)
    // For now, we'll log the email content
    
    const emailContent = {
      to: email,
      subject: `Welcome to PexiPay - ${businessName} Super Merchant Account Created`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to PexiPay</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, oklch(0.32 0.1 250) 0%, oklch(0.55 0.24 27) 100%); padding: 40px 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Welcome to PexiPay!</h1>
      <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Your Super Merchant Account is Ready</p>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px;">
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
        Hi <strong>${name}</strong>,
      </p>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
        Your PexiPay Super Merchant account for <strong>${businessName}</strong> has been successfully created! You can now start onboarding sub-merchants and earning commissions.
      </p>

      <!-- Login Credentials Section -->
      <div style="background-color: #f9fafb; border-left: 4px solid oklch(0.32 0.1 250); padding: 20px; margin: 30px 0;">
        <h2 style="color: #1f2937; font-size: 18px; margin: 0 0 15px 0;">🔐 Your Login Credentials</h2>
        <p style="color: #374151; font-size: 14px; margin: 0 0 10px 0;">
          <strong>Email:</strong> ${email}
        </p>
        <p style="color: #374151; font-size: 14px; margin: 0 0 15px 0;">
          <strong>Password:</strong> (Set by administrator - please change after first login)
        </p>
        <a href="${loginUrl}" style="display: inline-block; background-color: oklch(0.32 0.1 250); color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; font-size: 14px;">
          Login to Dashboard
        </a>
      </div>

      <!-- API Keys Section -->
      <div style="background-color: #fef3c7; border-left: 4px solid oklch(0.55 0.24 27); padding: 20px; margin: 30px 0;">
        <h2 style="color: #1f2937; font-size: 18px; margin: 0 0 15px 0;">🔑 Your API Keys</h2>
        
        <div style="margin-bottom: 20px;">
          <p style="color: #374151; font-size: 14px; margin: 0 0 8px 0; font-weight: bold;">Sandbox API Key (Testing):</p>
          <div style="background-color: #ffffff; padding: 12px; border-radius: 4px; font-family: monospace; font-size: 12px; word-break: break-all; color: #1f2937; border: 1px solid #e5e7eb;">
            ${sandboxApiKey}
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <p style="color: #374151; font-size: 14px; margin: 0 0 8px 0; font-weight: bold;">Production API Key (Live Transactions):</p>
          <div style="background-color: #ffffff; padding: 12px; border-radius: 4px; font-family: monospace; font-size: 12px; word-break: break-all; color: #1f2937; border: 1px solid #e5e7eb;">
            ${productionApiKey}
          </div>
        </div>

        <p style="color: #92400e; font-size: 12px; margin: 0; line-height: 1.5;">
          ⚠️ <strong>Important:</strong> Keep these API keys secure and never share them publicly. You can manage and regenerate keys from your dashboard.
        </p>
      </div>

      <!-- Quick Start Section -->
      <div style="margin: 30px 0;">
        <h2 style="color: #1f2937; font-size: 20px; margin: 0 0 15px 0;">🚀 Getting Started</h2>
        
        <div style="margin-bottom: 15px;">
          <div style="display: inline-block; background-color: oklch(0.32 0.1 250); color: #ffffff; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; font-weight: bold; font-size: 14px; margin-right: 10px;">1</div>
          <span style="color: #374151; font-size: 14px;">Log in to your dashboard and update your profile</span>
        </div>

        <div style="margin-bottom: 15px;">
          <div style="display: inline-block; background-color: oklch(0.32 0.1 250); color: #ffffff; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; font-weight: bold; font-size: 14px; margin-right: 10px;">2</div>
          <span style="color: #374151; font-size: 14px;">Review the API documentation to understand integration</span>
        </div>

        <div style="margin-bottom: 15px;">
          <div style="display: inline-block; background-color: oklch(0.32 0.1 250); color: #ffffff; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; font-weight: bold; font-size: 14px; margin-right: 10px;">3</div>
          <span style="color: #374151; font-size: 14px;">Start onboarding your sub-merchants</span>
        </div>

        <div style="margin-bottom: 15px;">
          <div style="display: inline-block; background-color: oklch(0.32 0.1 250); color: #ffffff; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; font-weight: bold; font-size: 14px; margin-right: 10px;">4</div>
          <span style="color: #374151; font-size: 14px;">Test your integration using the Sandbox API key</span>
        </div>

        <div>
          <div style="display: inline-block; background-color: oklch(0.32 0.1 250); color: #ffffff; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; font-weight: bold; font-size: 14px; margin-right: 10px;">5</div>
          <span style="color: #374151; font-size: 14px;">Go live with your Production API key</span>
        </div>
      </div>

      <!-- Resources Section -->
      <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 30px 0;">
        <h2 style="color: #1f2937; font-size: 18px; margin: 0 0 15px 0;">📚 Helpful Resources</h2>
        
        <div style="margin-bottom: 12px;">
          <a href="${documentationUrl}" style="color: oklch(0.32 0.1 250); text-decoration: none; font-size: 14px; font-weight: 500;">
            📖 API Documentation →
          </a>
        </div>

        <div style="margin-bottom: 12px;">
          <a href="${apiKeysUrl}" style="color: oklch(0.32 0.1 250); text-decoration: none; font-size: 14px; font-weight: 500;">
            🔑 Manage API Keys →
          </a>
        </div>

        <div style="margin-bottom: 12px;">
          <a href="${loginUrl.replace('/login', '/super-merchant/merchants')}" style="color: oklch(0.32 0.1 250); text-decoration: none; font-size: 14px; font-weight: 500;">
            🏪 Manage Sub-Merchants →
          </a>
        </div>

        <div>
          <a href="${loginUrl.replace('/login', '/super-merchant/settlements')}" style="color: oklch(0.32 0.1 250); text-decoration: none; font-size: 14px; font-weight: 500;">
            💰 View Settlements →
          </a>
        </div>
      </div>

      <!-- Support Section -->
      <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
        <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0 0 15px 0;">
          If you have any questions or need assistance, our support team is here to help!
        </p>
        <p style="color: #374151; font-size: 14px; margin: 0;">
          📧 Email: <a href="mailto:support@pexipay.com" style="color: oklch(0.32 0.1 250); text-decoration: none;">support@pexipay.com</a><br>
          📞 Phone: +1 (555) 123-4567<br>
          💬 Live Chat: Available in your dashboard
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 12px; margin: 0 0 10px 0;">
        © 2025 PexiPay. All rights reserved.
      </p>
      <p style="color: #6b7280; font-size: 12px; margin: 0;">
        This email contains sensitive information. Please keep it secure.
      </p>
    </div>
  </div>
</body>
</html>
      `,
      text: `
Welcome to PexiPay!

Hi ${name},

Your PexiPay Super Merchant account for ${businessName} has been successfully created!

LOGIN CREDENTIALS:
Email: ${email}
Password: (Set by administrator - please change after first login)
Login URL: ${loginUrl}

YOUR API KEYS:

Sandbox API Key (Testing):
${sandboxApiKey}

Production API Key (Live Transactions):
${productionApiKey}

⚠️ IMPORTANT: Keep these API keys secure and never share them publicly.

GETTING STARTED:
1. Log in to your dashboard and update your profile
2. Review the API documentation: ${documentationUrl}
3. Start onboarding your sub-merchants
4. Test your integration using the Sandbox API key
5. Go live with your Production API key

HELPFUL RESOURCES:
- API Documentation: ${documentationUrl}
- Manage API Keys: ${apiKeysUrl}
- Manage Sub-Merchants: ${loginUrl.replace('/login', '/super-merchant/merchants')}
- View Settlements: ${loginUrl.replace('/login', '/super-merchant/settlements')}

SUPPORT:
Email: support@pexipay.com
Phone: +1 (555) 123-4567

Thank you for choosing PexiPay!

© 2025 PexiPay. All rights reserved.
      `,
    };

    // Log email for development
    console.log('Super Merchant Welcome Email:', emailContent);

    // TODO: In production, send actual email using your email service
    // Example with SendGrid:
    // await sgMail.send({
    //   to: emailContent.to,
    //   from: 'noreply@pexipay.com',
    //   subject: emailContent.subject,
    //   text: emailContent.text,
    //   html: emailContent.html,
    // });

    return NextResponse.json({
      success: true,
      message: 'Welcome email queued for delivery',
    });
  } catch (error) {
    console.error('Send email error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
