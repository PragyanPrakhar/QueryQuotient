export const generateWelcomeHtml = ({ username }) => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #f9fafb;">
    <h2 style="color: #4a90e2;">👋 Welcome to INNGEST MS, ${username}!</h2>
    
    <p style="font-size: 16px; color: #333;">
      We're excited to have you on board! INNGEST MS is your intelligent support assistant, helping you raise and resolve technical queries seamlessly.
    </p>
    
    <div style="margin: 25px 0; background: #ffffff; padding: 20px; border-left: 5px solid #4a90e2; box-shadow: 0 1px 5px rgba(0,0,0,0.05);">
      <h3 style="margin-top: 0; color: #222;">🚀 What you can do:</h3>
      <ul style="line-height: 1.8;">
        <li>Raise tickets with ease</li>
        <li>Get instant summaries and skill-tagging</li>
        <li>Track and manage your queries in one place</li>
        <li>Receive timely updates via email</li>
      </ul>
    </div>

    <p style="font-size: 16px; color: #333;">
      To get started, login to your dashboard and explore the platform.
    </p>

    <a href="https://your-platform-url.com/login" style="display: inline-block; background-color: #4a90e2; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>

    <p style="margin-top: 40px; font-size: 14px; color: #888;">
      If you didn’t create this account, please ignore this email.
    </p>

    <p style="font-size: 14px; color: #aaa; margin-top: 20px;">
      – The INNGEST MS Team
    </p>
  </div>
`;
