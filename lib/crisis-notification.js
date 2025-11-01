const nodemailer = require('nodemailer');

const NOTIFICATION_CONFIG = {
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },
  from: process.env.NOTIFICATION_FROM || 'sahayak@mentalhealth.app',
  smsGateways: {
    'verizon': '@vtext.com',
    'att': '@txt.att.net',
    'tmobile': '@tmomail.net',
    'sprint': '@messaging.sprintpcs.com',
    'email': '',
  },
};

function createTransporter() {
  return nodemailer.createTransporter(NOTIFICATION_CONFIG.smtp);
}

async function sendCrisisAlert({
  recipient,
  carrier = 'email',
  userName,
  crisisLevel,
  message,
  context = {},
}) {
  try {
    const transporter = createTransporter();

    let toAddress = recipient;
    if (carrier !== 'email') {
      const gateway = NOTIFICATION_CONFIG.smsGateways[carrier.toLowerCase()];
      if (!gateway) {
        throw new Error(`Unsupported carrier: ${carrier}`);
      }
      toAddress = `${recipient}${gateway}`;
    }

    const defaultMessage = `URGENT: ${userName} is experiencing a ${crisisLevel} crisis situation and may need immediate support. Please check on them.`;
    const notificationMessage = message || defaultMessage;

    let fullMessage = notificationMessage;
    if (context.timestamp) {
      fullMessage += `\n\nTime: ${new Date(context.timestamp).toLocaleString()}`;
    }
    if (context.location) {
      fullMessage += `\nLocation: ${context.location}`;
    }
    if (context.emergencyContacts) {
      fullMessage += `\n\nEmergency Contacts: ${context.emergencyContacts}`;
    }

    const mailOptions = {
    from: NOTIFICATION_CONFIG.from,
    to: toAddress,
    subject: `${userName} needs immediate support`,
    text: fullMessage,
    html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2px; border-radius: 8px;">
            <div style="background: #fff; padding: 24px; border-radius: 6px;">
            <div style="background-color: #fff3e0; border-left: 4px solid #ff9800; padding: 16px; border-radius: 4px; margin-bottom: 20px;">
                <h2 style="color: #e65100; margin: 0 0 12px 0; font-size: 20px; font-weight: 600;">
                Someone needs your help
                </h2>
                <p style="margin: 0; font-size: 16px; color: #424242;">
                ${notificationMessage}
                </p>
            </div>
            
            ${context.timestamp || context.location || context.emergencyContacts ? `
                <div style="background-color: #f5f5f5; padding: 16px; border-radius: 4px; margin-bottom: 20px;">
                ${context.timestamp ? `
                    <p style="margin: 0 0 8px 0; font-size: 14px;">
                    <span style="color: #757575;">When:</span> 
                    <strong style="color: #333;">${new Date(context.timestamp).toLocaleString('en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit'
                    })}</strong>
                    </p>
                ` : ''}
                ${context.location ? `
                    <p style="margin: 0 0 8px 0; font-size: 14px;">
                    <span style="color: #757575;">Location:</span> 
                    <strong style="color: #333;">${context.location}</strong>
                    </p>
                ` : ''}
                ${context.emergencyContacts ? `
                    <p style="margin: 0; font-size: 14px;">
                    <span style="color: #757575;">Other contacts:</span> 
                    <strong style="color: #333;">${context.emergencyContacts}</strong>
                    </p>
                ` : ''}
                </div>
            ` : ''}
            
            <div style="background-color: #e3f2fd; padding: 16px; border-radius: 4px; border-left: 4px solid #2196f3;">
                <p style="margin: 0; font-size: 14px; color: #1565c0; font-weight: 500;">
                💙 Please reach out as soon as possible. Your support means everything right now.
                </p>
            </div>
            
            <p style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #9e9e9e; font-size: 13px; text-align: center;">
                Sent via Sahayak Mental Health Assistant
            </p>
            </div>
        </div>
        </div>
    `,
};

    const result = await transporter.sendMail(mailOptions);

    console.log('[Crisis Notification] Alert sent successfully:', {
      to: toAddress,
      messageId: result.messageId,
      userName,
      crisisLevel,
    });

    return {
      success: true,
      messageId: result.messageId,
      recipient: toAddress,
    };

  } catch (error) {
    console.error('[Crisis Notification] Failed to send alert:', error);

    return {
      success: false,
      error: error.message,
      recipient,
    };
  }
}

async function sendBulkCrisisAlerts(notifications) {
  const results = [];

  for (const notification of notifications) {
    const result = await sendCrisisAlert(notification);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
}

function validateConfig() {
  const required = ['SMTP_USER', 'SMTP_PASS'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.warn('[Crisis Notification] Missing required environment variables:', missing);
    return false;
  }

  return true;
}

async function testNotification(testRecipient) {
  return await sendCrisisAlert({
    recipient: testRecipient,
    carrier: 'email',
    userName: 'Test User',
    crisisLevel: 'TEST',
    message: 'This is a test notification from Sahayak Crisis Notification System.',
  });
}

module.exports = {
  sendCrisisAlert,
  sendBulkCrisisAlerts,
  validateConfig,
  testNotification,
  NOTIFICATION_CONFIG,
};