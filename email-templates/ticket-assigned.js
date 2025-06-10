export const generateTicketAssignedHtml = ({
    moderatorName,
    ticketTitle,
    ticketDescription,
    ticketDate,
}) => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #f9fafb;">
    <h2 style="color: #4a90e2;">📩 New Ticket Assigned to You, ${moderatorName}</h2>

    <p style="font-size: 16px; color: #333;">
      A new support ticket has been assigned to you. Please review the details below and take the necessary action.
    </p>

    <div style="margin: 25px 0; background: #ffffff; padding: 20px; border-left: 5px solid #4a90e2; box-shadow: 0 1px 5px rgba(0,0,0,0.05);">
      <h3 style="margin-top: 0; color: #222;">🧾 Ticket Details</h3>
      <ul style="line-height: 1.8; padding-left: 0; list-style: none;">
        <li><strong>🎫 Title:</strong> ${ticketTitle}</li>
        <li><strong>📅 Date Submitted:</strong> ${ticketDate}</li>
        <li><strong>📝 Description:</strong><br /> ${ticketDescription}</li>
      </ul>
    </div>

    <p style="font-size: 16px; color: #333;">
      You can view and manage thes ticket in Your Dashboard.
    </p>


    <p style="margin-top: 40px; font-size: 14px; color: #888;">
      If this ticket was not assigned to you, please contact the support admin.
    </p>

    <p style="font-size: 14px; color: #aaa; margin-top: 20px;">
      – The INNGEST MS Team
    </p>
  </div>
`;
